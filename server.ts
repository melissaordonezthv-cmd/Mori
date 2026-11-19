import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '35mb' }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const LANGUAGE_LABELS: Record<string, string> = {
  es: 'Spanish (Español)',
  en: 'English',
  zh: 'Simplified Chinese (简体中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
};

interface ParsedPastedLine {
  index: number;
  text: string;
  lrcTimeSec?: number;
}

const SECTION_HEADER_REGEX =
  /^\[(?:intro|verse|pre-chorus|chorus|post-chorus|bridge|outro|hook|solo|instrumental|interlude|refrain|estrofa|verso|pre-coro|coro|estribillo|puente|final)(?:\s*#?\d*|[\s:-].*)?\]$/i;

function parseManualLyrics(raw: string): ParsedPastedLine[] {
  const rawLines = raw.split(/\r?\n/);
  const result: ParsedPastedLine[] = [];

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    if (SECTION_HEADER_REGEX.test(trimmed)) continue;

    // Parse optional leading LRC timestamp e.g. [01:23.45]
    const lrcMatch = trimmed.match(/^\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/);
    if (lrcMatch) {
      const mins = Number(lrcMatch[1]);
      const secs = Number(lrcMatch[2]);
      const fracStr = lrcMatch[3] || '';
      const frac = fracStr ? Number(fracStr) / Math.pow(10, fracStr.length) : 0;
      const text = lrcMatch[4].trim();
      if (!text || SECTION_HEADER_REGEX.test(text)) continue;
      result.push({
        index: result.length,
        text,
        lrcTimeSec: Number((mins * 60 + secs + frac).toFixed(2)),
      });
    } else {
      result.push({
        index: result.length,
        text: trimmed,
      });
    }
  }

  return result;
}

interface LyricLineOut {
  timeSec: number;
  original: string;
  translated: string;
}

function normalizeAndClampLines(
  lines: unknown,
  trackDuration: number
): LyricLineOut[] {
  if (!Array.isArray(lines)) return [];
  let prevTime = 0;
  return lines
    .map((item) => {
      const rec = (item && typeof item === 'object' ? item : {}) as {
        timeSec?: unknown;
        original?: unknown;
        translated?: unknown;
      };
      const rawTime = Number(rec.timeSec);
      let timeSec = Number.isFinite(rawTime) ? Math.max(0, Math.min(trackDuration, rawTime)) : prevTime;
      if (timeSec < prevTime) {
        timeSec = prevTime;
      }
      prevTime = timeSec;
      const original = String(rec.original ?? '').trim();
      const translated = String(rec.translated ?? '').trim() || original;
      return {
        timeSec: Number(timeSec.toFixed(2)),
        original,
        translated,
      };
    })
    .filter((l) => l.original.length > 0 || l.translated.length > 0);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'MoriNote' });
});

app.post('/api/ai/analyze-lyrics', async (req, res) => {
  try {
    const {
      title = 'Unknown Track',
      artist = 'Unknown Artist',
      album = '',
      duration = 180,
      targetLanguage = 'es',
      audioBase64,
      mimeType,
      existingLyrics,
    } = req.body ?? {};

    const ai = getGeminiClient();
    const targetLangName = LANGUAGE_LABELS[targetLanguage] || 'Spanish (Español)';
    const trackDuration = Math.max(10, Math.round(Number(duration) || 180));

    const hasAudio = typeof audioBase64 === 'string' && audioBase64.length > 0;
    const audioPart = hasAudio
      ? {
          inlineData: {
            mimeType: typeof mimeType === 'string' && mimeType ? mimeType : 'audio/wav',
            data: audioBase64,
          },
        }
      : null;

    const rawManualLyrics = typeof existingLyrics === 'string' ? existingLyrics.trim() : '';
    const pastedEntries = rawManualLyrics ? parseManualLyrics(rawManualLyrics) : [];
    const isManualSyncMode = pastedEntries.length > 0;

    let transcribedDraft = '';

    // Step 1: For automatic detection (no pasted lyrics), run full-track transcription first as a vocal draft.
    // Audio is STILL passed to Step 2 so gemini-4-hydrogen listens directly to catch missed lines and align timestamps.
    if (!isManualSyncMode && audioPart) {
      try {
        const transcriptionResponse = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              audioPart,
              {
                text: `Listen carefully to this ENTIRE audio track from 0:00 to the very end (${trackDuration} seconds).
Transcribe EVERY single sung or spoken vocal line in its original language from start to finish.
CRITICAL RULES:
- Do NOT stop after the first few words or first verse.
- Do NOT skip repeated choruses, pre-choruses, bridges, or outro lyrics.
- Do NOT summarize or write placeholders like "[chorus]" or "[music]".
- Output each sung phrase on its own line in chronological order.
- Only if the entire track is 100% instrumental with zero sung or spoken words anywhere, reply strictly with [INSTRUMENTAL].`,
              },
            ],
          },
        });
        transcribedDraft = (transcriptionResponse.text ?? '').trim();
      } catch (transcribeErr: unknown) {
        console.warn('Transcription step fallback to direct multimodal audio analysis:', transcribeErr);
      }
    }

    // Step 2: Always give gemini-4-hydrogen the audio (if available) so it actually listens for synchronization,
    // completes any missed vocals, detects language/mood, and translates 100% of every line into targetLanguage.
    const promptParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    if (audioPart) {
      promptParts.push(audioPart);
    }

    const systemInstruction = isManualSyncMode
      ? `You are a precision audio-lyric synchronizer and literary translator for MoriNote.
Rules you MUST obey strictly:
1. Never drop, merge, summarize, or omit ANY line from the user's pasted lyrics. Output ALL ${pastedEntries.length} lines in exact sequential order.
2. Listen to the entire attached audio (0s to ${trackDuration}s) to determine exact vocal entry timestamps (skipping instrumental intros, breaks, and solos) so every line's "timeSec" matches when it is actually sung in the audio.
3. Keep "original" matching the user's pasted line text.
4. Translate EVERY SINGLE word and meaning of EVERY SINGLE line completely and naturally into ${targetLangName} in "translated" — never translate only a few words, never leave partial phrases untranslated, and never truncate.`
      : `You are a complete song lyricist, audio-timestamp aligner, and literary translator for MoriNote.
Rules you MUST obey strictly:
1. Listen to the ENTIRE attached audio from 0s to ${trackDuration}s — never stop after the intro or first verse!
2. If there are sung/spoken vocals anywhere in the track, transcribe EVERY line from start to finish (including all verses, choruses, repetitions, bridges, and outro) — even if the reference transcript draft was short or missed sections, YOU must listen directly to the full audio and include ALL sung lines.
3. Translate EVERY SINGLE line completely, accurately, and naturally into ${targetLangName} in "translated" — never translate only a few words, never summarize, and never truncate.`;

    if (isManualSyncMode) {
      const formattedLines = pastedEntries
        .map((entry) =>
          entry.lrcTimeSec !== undefined
            ? `[${entry.index}] (LRC hint: ${entry.lrcTimeSec}s) ${entry.text}`
            : `[${entry.index}] ${entry.text}`
        )
        .join('\n');

      promptParts.push({
        text: `Track info:
- Title: "${title}"
- Artist: "${artist}"
- Album: "${album}"
- Full track duration in seconds: ${trackDuration}
- Target translation language: ${targetLangName}
- Audio attached: ${hasAudio ? 'YES — listen to the entire audio to align timestamps precisely to the real singing!' : 'NO — estimate realistic verse/chorus pacing across duration.'}

USER-PASTED LYRICS (${pastedEntries.length} lines — synchronize ALL ${pastedEntries.length} lines in order and translate every line completely):
"""
${formattedLines}
"""

Tasks:
1. Detect the true original language of the pasted lyrics ("detectedLanguage", e.g., "English", "Japanese", "Korean", "Spanish", "Chinese").
2. Set "isInstrumental": false.
3. Analyze the musical mood from the audio and lyrics: classify "mood" as one of "serene", "joyful", "melancholic", "energetic", "romantic", "dreamy", provide a 2-3 word "moodLabel" and 1-sentence "moodDescription" in ${targetLangName}, a soft pastel hex "suggestedAura" (like #F4B8CC, #A8D8EA, #B5E5CF, #F8C4B4, #C8BFE7, #F9E2AE), and "tempoFeeling" ("slow", "medium", "fast").
4. Output "lines" with ALL ${pastedEntries.length} items in exact order [0]..[${pastedEntries.length - 1}]:
   - "original": the exact pasted lyric line text (without the [index] prefix or LRC hint).
   - "translated": complete, natural, full-sentence translation of the ENTIRE line into ${targetLangName}.
   - "timeSec": ascending timestamp in seconds (within 0..${trackDuration}) aligned to when that exact line starts being sung in the audio (respecting instrumental intro/breaks/outro, or honoring LRC hints refined against the audio).`,
      });
    } else {
      const draftSection = transcribedDraft
        ? `\nReference vocal draft (may be incomplete — cross-check directly against the FULL attached audio and add any missing verses, choruses, or lines you hear):\n"""\n${transcribedDraft}\n"""\n`
        : '\nNo pre-extracted draft transcript; listen directly to the entire attached audio from beginning to end.\n';

      promptParts.push({
        text: `Track info:
- Title: "${title}"
- Artist: "${artist}"
- Album: "${album}"
- Full track duration in seconds: ${trackDuration}
- Target translation language: ${targetLangName}
${draftSection}
Tasks:
1. Determine the original language of the song (or "Instrumental" ONLY if the entire ${trackDuration}s audio truly has zero vocals).
2. Analyze the musical mood and classify "mood" as one of: "serene", "joyful", "melancholic", "energetic", "romantic", "dreamy".
3. Provide a 2-3 word "moodLabel" and a 1-sentence poetic "moodDescription" in ${targetLangName}.
4. Provide a soft pastel hex "suggestedAura" (like #F4B8CC, #A8D8EA, #B5E5CF, #F8C4B4, #C8BFE7, #F9E2AE).
5. Determine "tempoFeeling": "slow", "medium", or "fast".
6. Output "lines":
   - Listen through the ENTIRE song (0s to ${trackDuration}s). Output EVERY audible sung lyric line from beginning to end (do NOT stop after a few words or first verse; include repeated choruses and bridges in full).
   - Set "original" to the complete lyric line in its original language, and "translated" to a COMPLETE, natural translation of the entire line into ${targetLangName}.
   - Set ascending "timeSec" timestamps within 0..${trackDuration} matching when each line is actually sung in the audio.
   - If the entire track is purely instrumental with zero vocals anywhere, set "isInstrumental": true and create 4-6 poetic ambient listening cues distributed across 0..${trackDuration}.`,
      });
    }

    const structuredResponse = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts: promptParts },
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: isManualSyncMode ? ThinkingLevel.MEDIUM : ThinkingLevel.MEDIUM,
        },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: { type: Type.STRING },
            isInstrumental: { type: Type.BOOLEAN },
            mood: {
              type: Type.STRING,
              enum: ['serene', 'joyful', 'melancholic', 'energetic', 'romantic', 'dreamy'],
            },
            moodLabel: { type: Type.STRING },
            moodDescription: { type: Type.STRING },
            suggestedAura: { type: Type.STRING },
            tempoFeeling: {
              type: Type.STRING,
              enum: ['slow', 'medium', 'fast'],
            },
            lines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSec: { type: Type.NUMBER },
                  original: { type: Type.STRING },
                  translated: { type: Type.STRING },
                },
                required: ['timeSec', 'original', 'translated'],
              },
            },
          },
          required: [
            'detectedLanguage',
            'isInstrumental',
            'mood',
            'moodLabel',
            'moodDescription',
            'suggestedAura',
            'tempoFeeling',
            'lines',
          ],
        },
      },
    });

    const parsed = JSON.parse((structuredResponse.text ?? '{}').trim()) as Record<string, unknown>;
    let finalLines = normalizeAndClampLines(parsed.lines, trackDuration);

    // Guarantee pasted lines are never lost or altered if the model returned slightly mismatched original strings
    if (isManualSyncMode && finalLines.length === pastedEntries.length) {
      finalLines = finalLines.map((line, i) => ({
        timeSec: line.timeSec,
        original: pastedEntries[i].text,
        translated: line.translated || pastedEntries[i].text,
      }));
    }

    res.json({
      ...parsed,
      isInstrumental: isManualSyncMode ? false : Boolean(parsed.isInstrumental),
      lines: finalLines,
      targetLanguage,
      rawTranscript: transcribedDraft,
    });
  } catch (error: unknown) {
    console.error('AI lyrics analysis error:', error);
    const errMessage = error instanceof Error ? error.message : 'Error analyzing audio with Gemini AI';
    const status = errMessage.includes('PERMISSION_DENIED') || errMessage.includes('403')
      ? 403
      : errMessage.includes('429')
        ? 429
        : 500;
    res.status(status).json({ error: errMessage });
  }
});

app.post('/api/ai/translate-lyrics', async (req, res) => {
  try {
    const {
      lines = [],
      targetLanguage = 'es',
      title = '',
      artist = '',
    } = req.body ?? {};

    if (!Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ error: 'No lyrics lines provided to translate.' });
      return;
    }

    const ai = getGeminiClient();
    const targetLangName = LANGUAGE_LABELS[targetLanguage] || 'Spanish (Español)';
    const inputLines = lines.map(
      (l: { timeSec?: number; original?: string }, idx: number) => ({
        index: idx,
        timeSec: Number.isFinite(Number(l.timeSec)) ? Number(l.timeSec) : 0,
        original: String(l.original ?? ''),
      })
    );

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Translate ALL ${inputLines.length} song lyric lines for "${title}" by "${artist}" completely, faithfully, and poetically into ${targetLangName}.
CRITICAL: Return ALL ${inputLines.length} lines in exact order. Preserve each "timeSec" and "original" verbatim. Translate every single word/phrase completely into ${targetLangName} without skipping or truncating.
Also provide a localized 2-3 word "moodLabel" and 1-sentence "moodDescription" in ${targetLangName}.

Lines JSON:
${JSON.stringify(inputLines)}`,
      config: {
        systemInstruction: `You translate every lyric line completely into ${targetLangName}. Never truncate the array, never skip lines, and never translate only fragments of a line.`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            moodLabel: { type: Type.STRING },
            moodDescription: { type: Type.STRING },
            lines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSec: { type: Type.NUMBER },
                  original: { type: Type.STRING },
                  translated: { type: Type.STRING },
                },
                required: ['timeSec', 'original', 'translated'],
              },
            },
          },
          required: ['lines', 'moodLabel', 'moodDescription'],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim()) as {
      moodLabel?: string;
      moodDescription?: string;
      lines?: Array<{ timeSec?: number; original?: string; translated?: string }>;
    };

    const outputLines = Array.isArray(parsed.lines)
      ? parsed.lines.map((l, idx) => ({
          timeSec: inputLines[idx]?.timeSec ?? Number(l.timeSec ?? 0),
          original: inputLines[idx]?.original ?? String(l.original ?? ''),
          translated: String(l.translated ?? '').trim() || inputLines[idx]?.original || '',
        }))
      : [];

    res.json({
      moodLabel: parsed.moodLabel,
      moodDescription: parsed.moodDescription,
      lines: outputLines,
      targetLanguage,
    });
  } catch (error: unknown) {
    console.error('AI lyrics translation error:', error);
    const errMessage = error instanceof Error ? error.message : 'Error translating lyrics';
    res.status(500).json({ error: errMessage });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MoriNote server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
