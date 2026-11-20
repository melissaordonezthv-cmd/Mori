import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_BOOT_ID = Date.now().toString(36);

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

function extractJsonObject<T = Record<string, unknown>>(rawText: string | undefined): T {
  const cleaned = (rawText ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  if (!cleaned) {
    throw new Error('La respuesta de la IA llegó vacía.');
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
    }
    throw new Error('No se pudo interpretar el formato de respuesta de la IA.');
  }
}

function getErrorStatusAndFriendlyMessage(error: unknown): {
  status: number;
  message: string;
  isTransient: boolean;
  isAudioInvalidArg: boolean;
} {
  const raw = error instanceof Error ? error.message : String(error ?? 'Error desconocido');
  const upper = raw.toUpperCase();

  if (
    upper.includes('PERMISSION_DENIED') ||
    upper.includes('API_KEY_INVALID') ||
    upper.includes('403') ||
    upper.includes('NOT CONFIGURED')
  ) {
    return {
      status: 403,
      message:
        'La clave de API de Gemini no es válida o no tiene permisos. Verifica tu clave en Settings > Secrets.',
      isTransient: false,
      isAudioInvalidArg: false,
    };
  }

  if (upper.includes('RESOURCE_EXHAUSTED') || upper.includes('429')) {
    return {
      status: 429,
      message: 'Se alcanzó temporalmente el límite de solicitudes de la IA. Intenta de nuevo en unos segundos.',
      isTransient: true,
      isAudioInvalidArg: false,
    };
  }

  if (
    upper.includes('UNAVAILABLE') ||
    upper.includes('503') ||
    upper.includes('504') ||
    upper.includes('DEADLINE_EXCEEDED') ||
    upper.includes('TIMED OUT') ||
    upper.includes('TIMEOUT') ||
    upper.includes('ECONNRESET') ||
    upper.includes('FETCH FAILED')
  ) {
    return {
      status: 503,
      message: 'El servicio de IA está con alta demanda en este momento. Intenta de nuevo en unos segundos.',
      isTransient: true,
      isAudioInvalidArg: false,
    };
  }

  const isInvalidArg = upper.includes('INVALID_ARGUMENT') || upper.includes('400');
  if (isInvalidArg) {
    return {
      status: 400,
      message: 'El formato de audio o los datos enviados no pudieron ser procesados por la IA.',
      isTransient: false,
      isAudioInvalidArg: true,
    };
  }

  return {
    status: 500,
    message: raw.startsWith('{')
      ? 'No se pudo completar la operación con la IA. Intenta nuevamente.'
      : raw,
    isTransient: upper.includes('INTERNAL') || upper.includes('500'),
    isAudioInvalidArg: false,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function generateWithFallback(
  ai: GoogleGenAI,
  models: string[],
  buildParams: (model: string) => Parameters<GoogleGenAI['models']['generateContent']>[0],
  timeoutMs = 24000
) {
  let lastError: unknown;

  for (let mIdx = 0; mIdx < models.length; mIdx++) {
    const model = models[mIdx];
    try {
      return await withTimeout(
        ai.models.generateContent(buildParams(model)),
        timeoutMs,
        model
      );
    } catch (err) {
      lastError = err;
      const info = getErrorStatusAndFriendlyMessage(err);
      console.warn(`Gemini call failed [model=${model}]:`, info.message);
      if (info.isAudioInvalidArg || (!info.isTransient && mIdx === models.length - 1)) {
        throw err;
      }
      if (!info.isTransient) {
        throw err;
      }
      await sleep(350);
    }
  }

  throw lastError;
}

async function translateLinesInChunks(
  ai: GoogleGenAI,
  inputLines: Array<{ timeSec: number; original: string }>,
  targetLangName: string,
  title: string,
  artist: string,
  includeMood: boolean
): Promise<{
  moodLabel?: string;
  moodDescription?: string;
  lines: LyricLineOut[];
}> {
  const CHUNK_SIZE = 32;
  const translatedTexts = new Array<string>(inputLines.length);
  let moodLabel: string | undefined;
  let moodDescription: string | undefined;

  for (let start = 0; start < inputLines.length; start += CHUNK_SIZE) {
    const chunk = inputLines.slice(start, start + CHUNK_SIZE);
    const indexedChunk = chunk.map((l, offset) => ({
      i: start + offset,
      text: l.original,
    }));
    const askMood = includeMood && start === 0;

    const response = await generateWithFallback(
      ai,
      ['gemini-3.1-flash-lite', 'gemini-4-hydrogen'],
      (model) => ({
        model,
        contents: `Translate ALL ${indexedChunk.length} song lyric lines for "${title}" by "${artist}" completely, naturally, and poetically into ${targetLangName}.
CRITICAL:
- Translate EVERY single item "i" in the list completely into ${targetLangName} (never skip words, never leave fragments untranslated).
- Return one object per index "i" with "t" set to the full translated line.${
          askMood
            ? `\n- Also provide a 2-3 word "moodLabel" and 1-sentence "moodDescription" in ${targetLangName}.`
            : ''
        }

Lines JSON:
${JSON.stringify(indexedChunk)}`,
        config: {
          systemInstruction: `You translate every song lyric line completely and faithfully into ${targetLangName}. Output valid JSON matching the schema with all ${indexedChunk.length} items.`,
          thinkingConfig: {
            thinkingLevel: model === 'gemini-3.1-flash-lite' ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ...(askMood
                ? {
                    moodLabel: { type: Type.STRING },
                    moodDescription: { type: Type.STRING },
                  }
                : {}),
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    i: { type: Type.INTEGER },
                    t: { type: Type.STRING },
                  },
                  required: ['i', 't'],
                },
              },
            },
            required: askMood ? ['items', 'moodLabel', 'moodDescription'] : ['items'],
          },
        },
      })
    );

    const parsed = extractJsonObject<{
      moodLabel?: string;
      moodDescription?: string;
      items?: Array<{ i?: number; t?: string }>;
    }>(response.text);

    if (askMood) {
      moodLabel = parsed.moodLabel;
      moodDescription = parsed.moodDescription;
    }

    const items = Array.isArray(parsed.items) ? parsed.items : [];
    for (let k = 0; k < items.length; k++) {
      const item = items[k];
      const idx =
        typeof item?.i === 'number' && item.i >= start && item.i < start + chunk.length
          ? item.i
          : start + k;
      if (idx >= 0 && idx < inputLines.length) {
        const val = String(item?.t ?? '').trim();
        if (val) translatedTexts[idx] = val;
      }
    }
  }

  return {
    moodLabel,
    moodDescription,
    lines: inputLines.map((l, idx) => ({
      timeSec: Number((Number.isFinite(Number(l.timeSec)) ? Number(l.timeSec) : 0).toFixed(2)),
      original: l.original,
      translated: translatedTexts[idx] || l.original,
    })),
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'MoriNote' });
});

app.get('/api/app-version', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  let buildId = 'dev';
  let builtAt: string | null = null;
  if (process.env.NODE_ENV === 'production') {
    const versionFile = path.resolve(__dirname, 'dist', 'app-version.json');
    try {
      if (fs.existsSync(versionFile)) {
        const raw = JSON.parse(fs.readFileSync(versionFile, 'utf-8')) as {
          buildId?: string;
          builtAt?: string;
        };
        if (raw.buildId) buildId = raw.buildId;
        if (raw.builtAt) builtAt = raw.builtAt;
      }
    } catch {
      // Fallback to boot id if file is unreadable
      buildId = SERVER_BOOT_ID;
    }
  }

  res.json({
    buildId,
    bootId: SERVER_BOOT_ID,
    builtAt,
  });
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
    const normalizedMime =
      typeof mimeType === 'string' && mimeType
        ? mimeType === 'video/mp4' || mimeType === 'audio/x-m4a' || mimeType === 'audio/m4a'
          ? 'audio/mp4'
          : mimeType
        : 'audio/wav';
    const audioPart = hasAudio
      ? {
          inlineData: {
            mimeType: normalizedMime,
            data: audioBase64,
          },
        }
      : null;

    const rawManualLyrics = typeof existingLyrics === 'string' ? existingLyrics.trim() : '';
    const pastedEntries = rawManualLyrics ? parseManualLyrics(rawManualLyrics) : [];
    const isManualSyncMode = pastedEntries.length > 0;

    let transcribedDraft = '';

    // Step 1: For automatic detection (no pasted lyrics), run audio transcription first as a vocal draft.
    if (!isManualSyncMode && audioPart) {
      try {
        const transcriptionResponse = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.5-transcribe',
            contents: {
              parts: [
                audioPart,
                {
                  text: `Listen carefully to this ENTIRE audio track from 0:00 to ${trackDuration}s.
Transcribe EVERY single sung or spoken vocal line in its original language from start to finish in chronological order, one line per phrase.
Do NOT stop after the first verse or skip repeated choruses.
Only if the entire track is 100% instrumental with zero sung/spoken vocals anywhere, reply strictly with [INSTRUMENTAL].`,
                },
              ],
            },
          }),
          22000,
          'gemini-3.5-transcribe'
        );
        transcribedDraft = (transcriptionResponse.text ?? '').trim();
      } catch (transcribeErr: unknown) {
        console.warn('Transcription step fallback to direct multimodal audio analysis:', transcribeErr);
      }
    }

    const buildAnalyzeParams = (model: string, attachAudio: boolean) => {
      const promptParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (attachAudio && audioPart) {
        promptParts.push(audioPart);
      }

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
- Audio attached: ${attachAudio && audioPart ? 'YES — listen to the entire audio to align timestamps precisely to the singing.' : 'NO — estimate realistic verse/chorus pacing across duration.'}

USER-PASTED LYRICS (${pastedEntries.length} lines — synchronize ALL indices [0]..[${pastedEntries.length - 1}] in exact order and translate EVERY line completely):
"""
${formattedLines}
"""

Tasks:
1. Detect the true original language of the pasted lyrics ("detectedLanguage").
2. Set "isInstrumental": false.
3. Classify "mood" as one of "serene", "joyful", "melancholic", "energetic", "romantic", "dreamy", provide a 2-3 word "moodLabel" and 1-sentence "moodDescription" in ${targetLangName}, a soft pastel hex "suggestedAura", and "tempoFeeling" ("slow", "medium", "fast").
4. Output "lines" with ALL ${pastedEntries.length} items in exact order [0]..[${pastedEntries.length - 1}]:
   - "index": integer matching [0]..[${pastedEntries.length - 1}]
   - "timeSec": ascending timestamp in seconds (within 0..${trackDuration}) when that line begins being sung
   - "translated": complete, natural, full-sentence translation of that entire line into ${targetLangName} (translate every word, never truncate).`,
        });

        return {
          model,
          contents: { parts: promptParts },
          config: {
            systemInstruction: `You are a precision audio-lyric synchronizer and literary translator. Output ALL ${pastedEntries.length} indices in order, with accurate vocal entry timestamps and complete translations in ${targetLangName}.`,
            thinkingConfig: {
              thinkingLevel: model === 'gemini-3.1-flash-lite' ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW,
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
                      index: { type: Type.INTEGER },
                      timeSec: { type: Type.NUMBER },
                      translated: { type: Type.STRING },
                    },
                    required: ['index', 'timeSec', 'translated'],
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
        };
      }

      const draftSection = transcribedDraft
        ? `\nReference vocal draft (cross-check against the audio and include all verses, choruses, bridges, and outro):\n"""\n${transcribedDraft}\n"""\n`
        : '\nListen directly to the audio from beginning to end.\n';

      promptParts.push({
        text: `Track info:
- Title: "${title}"
- Artist: "${artist}"
- Album: "${album}"
- Full track duration in seconds: ${trackDuration}
- Target translation language: ${targetLangName}
${draftSection}
Tasks:
1. Determine the original language of the song (or "Instrumental" ONLY if there are zero vocals anywhere).
2. Classify "mood" as one of: "serene", "joyful", "melancholic", "energetic", "romantic", "dreamy", with 2-3 word "moodLabel" and 1-sentence "moodDescription" in ${targetLangName}, pastel hex "suggestedAura", and "tempoFeeling" ("slow", "medium", "fast").
3. Output "lines" across 0..${trackDuration}s:
   - Include EVERY audible sung lyric line from start to finish.
   - Set "original" to the full lyric line in its original language, and "translated" to a COMPLETE, natural translation of the entire line into ${targetLangName}.
   - Set ascending "timeSec" timestamps within 0..${trackDuration}.
   - Only if 100% instrumental with zero vocals, set "isInstrumental": true and create 4-6 poetic listening cues.`,
      });

      return {
        model,
        contents: { parts: promptParts },
        config: {
          systemInstruction: `You are a complete song lyricist, audio-timestamp aligner, and literary translator. Transcribe every sung line across the full song and translate every line completely into ${targetLangName}.`,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
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
        };
      };

    const modelOrder = ['gemini-3.1-flash-lite', 'gemini-4-hydrogen'];
    let structuredResponse;
    try {
      structuredResponse = await generateWithFallback(ai, modelOrder, (model) =>
        buildAnalyzeParams(model, true)
      );
    } catch (primaryErr) {
      const errInfo = getErrorStatusAndFriendlyMessage(primaryErr);
      // If inline audio container itself was rejected (400) and we have pasted lyrics or draft text, retry text-only
      if (errInfo.isAudioInvalidArg && audioPart && (isManualSyncMode || transcribedDraft)) {
        structuredResponse = await generateWithFallback(ai, modelOrder, (model) =>
          buildAnalyzeParams(model, false)
        );
      } else {
        throw primaryErr;
      }
    }

    const parsed = extractJsonObject<Record<string, unknown>>(structuredResponse.text);
    let finalLines: LyricLineOut[];

    if (isManualSyncMode) {
      const rawArr = Array.isArray(parsed.lines) ? parsed.lines : [];
      const mapped = new Map<number, { timeSec: number; translated: string }>();

      rawArr.forEach((item, arrPos) => {
        const rec = (item && typeof item === 'object' ? item : {}) as {
          index?: unknown;
          timeSec?: unknown;
          translated?: unknown;
        };
        const idx =
          typeof rec.index === 'number' && rec.index >= 0 && rec.index < pastedEntries.length
            ? rec.index
            : arrPos;
        if (idx >= 0 && idx < pastedEntries.length) {
          const tVal = Number(rec.timeSec);
          mapped.set(idx, {
            timeSec: Number.isFinite(tVal) ? Math.max(0, Math.min(trackDuration, tVal)) : -1,
            translated: String(rec.translated ?? '').trim(),
          });
        }
      });

      // Ensure every pasted line exists in ascending order; fill any missing translations if needed
      let prevTime = 0;
      const missingIndices: number[] = [];
      finalLines = pastedEntries.map((entry, idx) => {
        const hit = mapped.get(idx);
        let tSec =
          hit && hit.timeSec >= 0
            ? hit.timeSec
            : entry.lrcTimeSec !== undefined
              ? entry.lrcTimeSec
              : (trackDuration * (idx + 0.5)) / Math.max(1, pastedEntries.length + 1);
        tSec = Math.max(prevTime, Math.min(trackDuration, tSec));
        prevTime = tSec;
        const translated = hit?.translated || '';
        if (!translated) missingIndices.push(idx);
        return {
          timeSec: Number(tSec.toFixed(2)),
          original: entry.text,
          translated: translated || entry.text,
        };
      });

      if (missingIndices.length > 0) {
        const missingBatch = missingIndices.map((idx) => ({
          timeSec: finalLines[idx].timeSec,
          original: pastedEntries[idx].text,
        }));
        const filled = await translateLinesInChunks(
          ai,
          missingBatch,
          targetLangName,
          String(title),
          String(artist),
          false
        );
        missingIndices.forEach((idx, pos) => {
          if (filled.lines[pos]?.translated) {
            finalLines[idx].translated = filled.lines[pos].translated;
          }
        });
      }
    } else {
      finalLines = normalizeAndClampLines(parsed.lines, trackDuration);
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
    const { status, message } = getErrorStatusAndFriendlyMessage(error);
    res.status(status).json({ error: message });
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
      res.status(400).json({ error: 'No hay líneas de letra para traducir.' });
      return;
    }

    const ai = getGeminiClient();
    const targetLangName = LANGUAGE_LABELS[targetLanguage] || 'Spanish (Español)';
    const inputLines = lines.map((l: { timeSec?: number; original?: string }) => ({
      timeSec: Number.isFinite(Number(l.timeSec)) ? Number(l.timeSec) : 0,
      original: String(l.original ?? '').trim(),
    }));

    const result = await translateLinesInChunks(
      ai,
      inputLines,
      targetLangName,
      String(title),
      String(artist),
      true
    );

    res.json({
      moodLabel: result.moodLabel,
      moodDescription: result.moodDescription,
      lines: result.lines,
      targetLanguage,
    });
  } catch (error: unknown) {
    console.error('AI lyrics translation error:', error);
    const { status, message } = getErrorStatusAndFriendlyMessage(error);
    res.status(status).json({ error: message });
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
