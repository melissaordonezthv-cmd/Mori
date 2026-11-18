import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

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

    let transcribedText = typeof existingLyrics === 'string' ? existingLyrics.trim() : '';

    // Step 1: If audio snippet is provided and no existing manual lyrics, transcribe vocals with gemini-3.5-transcribe
    if (!transcribedText && typeof audioBase64 === 'string' && audioBase64.length > 0) {
      try {
        const audioPart = {
          inlineData: {
            mimeType: typeof mimeType === 'string' && mimeType ? mimeType : 'audio/wav',
            data: audioBase64,
          },
        };
        const transcriptionResponse = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              audioPart,
              {
                text: 'Listen carefully to this audio clip. If there are sung or spoken vocals/lyrics, transcribe every audible lyric line accurately in its original language, separated by newlines. If the audio is purely instrumental with no vocals at all, reply strictly with [INSTRUMENTAL] and briefly describe the instruments and musical mood.',
              },
            ],
          },
        });
        transcribedText = (transcriptionResponse.text ?? '').trim();
      } catch (transcribeErr: unknown) {
        console.warn('Transcription step fallback to audio-multimodal analysis:', transcribeErr);
      }
    }

    // Step 2: Analyze mood, structure lines with timestamps, and translate to targetLanguage via gemini-4-hydrogen
    const promptParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    if (!transcribedText && typeof audioBase64 === 'string' && audioBase64.length > 0) {
      promptParts.push({
        inlineData: {
          mimeType: typeof mimeType === 'string' && mimeType ? mimeType : 'audio/wav',
          data: audioBase64,
        },
      });
    }

    promptParts.push({
      text: `You are a musicologist and multilingual lyricist assistant for the MoriNote music player.
Track info:
- Title: "${title}"
- Artist: "${artist}"
- Album: "${album}"
- Duration in seconds: ${Math.max(10, Math.round(Number(duration) || 180))}
- User's app language: ${targetLangName}
${transcribedText ? `\nDetected / Provided vocals transcript:\n"""\n${transcribedText}\n"""\n` : '\nNo pre-extracted transcript provided; inspect the attached audio clip if present, or infer based on the audio/title whether it is vocal or instrumental.'}

Tasks:
1. Determine the original language of the song (or "Instrumental" if no vocals exist).
2. Analyze the musical mood and classify it into exactly one of: "serene", "joyful", "melancholic", "energetic", "romantic", "dreamy".
3. Provide a localized mood label (2-3 words) and a poetic 1-sentence mood description written in ${targetLangName}.
4. Provide a soft pastel hex color for "suggestedAura" (never harsh neon, always soft pastel like #F4B8CC, #A8D8EA, #B5E5CF, #F8C4B4, #C8BFE7, #F9E2AE).
5. Determine "tempoFeeling": "slow", "medium", or "fast".
6. Output "lines":
   - If vocals/lyrics were transcribed or provided, preserve every lyric line in "original" and provide a natural, poetic translation into ${targetLangName} in "translated". Assign realistic ascending "timeSec" values within 0 to ${Math.max(10, Math.round(Number(duration) || 180))}.
   - If the audio is purely instrumental, set "isInstrumental": true and create 4-6 poetic instrumental listening cues / ambient reflections in "original" and "translated" (in ${targetLangName}) distributed across the track duration so the listener still sees a synced atmosphere guide.`,
    });

    const structuredResponse = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts: promptParts },
      config: {
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

    const parsed = JSON.parse((structuredResponse.text ?? '{}').trim());
    res.json({
      ...parsed,
      targetLanguage,
      rawTranscript: transcribedText,
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

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Translate the following song lyric lines for "${title}" by "${artist}" naturally and poetically into ${targetLangName}. Keep the exact same number of lines and preserve each timeSec value.
Also provide a localized moodLabel and 1-sentence moodDescription in ${targetLangName}.

Lines JSON:
${JSON.stringify(lines.map((l: { timeSec?: number; original?: string }) => ({ timeSec: l.timeSec ?? 0, original: l.original ?? '' })))}`,
      config: {
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

    const parsed = JSON.parse((response.text ?? '{}').trim());
    res.json({
      ...parsed,
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
