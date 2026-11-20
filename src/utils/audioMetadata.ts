import { parseBlob } from 'music-metadata';
import { DEFAULT_COVER_CLOUD, DEFAULT_COVER_SAKURA } from '../constants/themes';
import type { AudioTrack } from '../types/music';

const LOSSLESS_EXTENSIONS = new Set(['flac', 'wav', 'alac', 'aiff', 'aif', 'ape', 'wv', 'dsf', 'dff']);

const SUPPORTED_AUDIO_EXTENSIONS = new Set([
  'flac',
  'wav',
  'alac',
  'aiff',
  'aif',
  'm4a',
  'm4b',
  'aac',
  'mp3',
  'ogg',
  'opus',
  'webm',
  'ape',
  'wv',
  'dsf',
  'dff',
  'caf',
  'wma',
  'amr',
  '3gp',
  'mp4',
]);

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    let settled = false;
    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallback);
      }
    }, ms);
    promise
      .then((value) => {
        if (!settled) {
          settled = true;
          window.clearTimeout(timer);
          resolve(value);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          window.clearTimeout(timer);
          resolve(fallback);
        }
      });
  });
}

export function isSupportedAudioFile(file: File): boolean {
  if (file.type.startsWith('audio/') || file.type === 'application/ogg') return true;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return SUPPORTED_AUDIO_EXTENSIONS.has(ext);
}

export async function collectAudioFilesFromDirectory(
  dirHandle: FileSystemDirectoryHandle
): Promise<File[]> {
  const collected: File[] = [];

  async function walk(handle: FileSystemDirectoryHandle) {
    const iterable = handle as unknown as {
      values: () => AsyncIterable<FileSystemHandle>;
    };
    const subDirs: FileSystemDirectoryHandle[] = [];
    const filePromises: Array<Promise<void>> = [];

    for await (const entry of iterable.values()) {
      if (entry.kind === 'file') {
        filePromises.push(
          (entry as FileSystemFileHandle)
            .getFile()
            .then((file) => {
              if (isSupportedAudioFile(file)) {
                collected.push(file);
              }
            })
            .catch(() => {})
        );
      } else if (entry.kind === 'directory') {
        subDirs.push(entry as FileSystemDirectoryHandle);
      }
    }

    if (filePromises.length > 0) {
      await Promise.all(filePromises);
    }
    for (const dir of subDirs) {
      await walk(dir);
    }
  }

  await walk(dirHandle);
  return collected;
}

function uint8ToDataUrl(bytes: Uint8Array, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    const blob = new Blob([copy], { type: mimeType || 'image/jpeg' });
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert artwork'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function compressCoverBytesToDataUrl(
  bytes: Uint8Array,
  mimeType: string,
  maxSize = 260
): Promise<string | null> {
  if (!bytes || bytes.length === 0) return null;

  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: mimeType || 'image/jpeg' });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const dataUrl = await withTimeout(
      new Promise<string | null>((resolve) => {
        const image = new Image();
        image.onload = () => {
          try {
            const scale = Math.min(1, maxSize / Math.max(image.width || maxSize, image.height || maxSize));
            const w = Math.max(1, Math.round((image.width || maxSize) * scale));
            const h = Math.max(1, Math.round((image.height || maxSize) * scale));
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(null);
              return;
            }
            ctx.drawImage(image, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } catch {
            resolve(null);
          }
        };
        image.onerror = () => resolve(null);
        image.src = objectUrl;
      }),
      1500,
      null
    );

    if (dataUrl) return dataUrl;
    if (bytes.byteLength <= 120 * 1024) {
      return await uint8ToDataUrl(bytes, mimeType).catch(() => null);
    }
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function resizeImageFileToDataUrl(
  file: File,
  maxSize = 640
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Invalid image file'));
      image.src = objectUrl;
    });

    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', 0.88);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function measureAudioDurationFallback(blob: Blob): Promise<number> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio();
  try {
    return await withTimeout(
      new Promise<number>((resolve) => {
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
        };
        audio.onerror = () => resolve(0);
        audio.src = url;
      }),
      1400,
      0
    );
  } finally {
    audio.onloadedmetadata = null;
    audio.onerror = null;
    audio.src = '';
    URL.revokeObjectURL(url);
  }
}

function parseFilenameParts(fileName: string): { title: string; artist: string } {
  const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[_]+/g, ' ').trim();
  const dashIdx = cleanName.indexOf(' - ');
  if (dashIdx > 0 && dashIdx < cleanName.length - 3) {
    const possibleArtist = cleanName.slice(0, dashIdx).trim();
    const possibleTitle = cleanName.slice(dashIdx + 3).trim();
    if (possibleArtist && possibleTitle) {
      return { title: possibleTitle, artist: possibleArtist };
    }
  }
  return { title: cleanName || 'Pista sin título', artist: 'Artista local' };
}

export function createInstantTrackPlaceholder(file: File, fallbackIndex = 0): AudioTrack {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'audio';
  const parsed = parseFilenameParts(file.name);
  const coverUrl = fallbackIndex % 2 === 0 ? DEFAULT_COVER_SAKURA : DEFAULT_COVER_CLOUD;

  return {
    id: crypto.randomUUID(),
    title: parsed.title,
    artist: parsed.artist,
    album: 'Biblioteca local',
    duration: 0,
    format: ext.toUpperCase(),
    lossless: LOSSLESS_EXTENSIONS.has(ext),
    fileSize: file.size,
    coverUrl,
    originalCoverUrl: coverUrl,
    isFavorite: false,
    playCount: 0,
    createdAt: Date.now() - fallbackIndex,
  };
}

export async function extractTrackMetadataIntoTrack(
  file: File,
  baseTrack: AudioTrack
): Promise<AudioTrack> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'audio';
  let title = baseTrack.title;
  let artist = baseTrack.artist;
  let album = baseTrack.album;
  let genre = baseTrack.genre;
  let year = baseTrack.year;
  let trackNumber = baseTrack.trackNumber;
  let duration = baseTrack.duration;
  let sampleRate = baseTrack.sampleRate;
  let bitDepth = baseTrack.bitDepth;
  let bitrate = baseTrack.bitrate;
  let formatLabel = baseTrack.format;
  let lossless = baseTrack.lossless;
  let coverUrl = baseTrack.coverUrl;

  try {
    const metadata = await withTimeout(
      parseBlob(file, { duration: false, skipCovers: false }),
      2500,
      null
    );

    if (metadata) {
      if (metadata.common.title?.trim()) title = metadata.common.title.trim();
      if (metadata.common.artist?.trim()) artist = metadata.common.artist.trim();
      if (metadata.common.album?.trim()) album = metadata.common.album.trim();
      if (metadata.common.genre?.[0]?.trim()) genre = metadata.common.genre[0].trim();
      if (metadata.common.year) year = String(metadata.common.year);
      if (metadata.common.track?.no) trackNumber = String(metadata.common.track.no);

      if (metadata.format.duration && Number.isFinite(metadata.format.duration)) {
        duration = metadata.format.duration;
      }
      if (metadata.format.sampleRate) {
        sampleRate = metadata.format.sampleRate;
      }
      if (metadata.format.bitsPerSample) {
        bitDepth = metadata.format.bitsPerSample;
      }
      if (metadata.format.bitrate) {
        bitrate = Math.round(metadata.format.bitrate / 1000);
      }
      if (metadata.format.codec) {
        const codecUpper = metadata.format.codec.toUpperCase();
        if (codecUpper.includes('FLAC')) formatLabel = 'FLAC';
        else if (codecUpper.includes('ALAC')) formatLabel = 'ALAC';
        else if (codecUpper.includes('PCM')) formatLabel = ext === 'aiff' || ext === 'aif' ? 'AIFF' : 'WAV';
        else if (codecUpper.includes('OPUS')) formatLabel = 'OPUS';
        else if (codecUpper.includes('VORBIS')) formatLabel = 'OGG';
        else if (codecUpper.includes('MPEG')) formatLabel = 'MP3';
        else if (codecUpper.includes('AAC')) formatLabel = 'AAC';
        else formatLabel = ext.toUpperCase();
      }
      if (typeof metadata.format.lossless === 'boolean') {
        lossless = metadata.format.lossless;
      } else if (
        formatLabel === 'ALAC' ||
        formatLabel === 'FLAC' ||
        formatLabel === 'WAV' ||
        formatLabel === 'AIFF'
      ) {
        lossless = true;
      }

      const picture = metadata.common.picture?.[0];
      if (picture && picture.data?.length) {
        const compressed = await compressCoverBytesToDataUrl(
          picture.data,
          picture.format || 'image/jpeg',
          260
        );
        if (compressed) {
          coverUrl = compressed;
        }
      }
    }
  } catch (err) {
    console.warn('Metadata parse fallback for', file.name, err);
  }

  if ((!duration || duration <= 0) && file.size <= 80 * 1024 * 1024) {
    duration = await measureAudioDurationFallback(file);
  }

  return {
    ...baseTrack,
    title,
    artist,
    album,
    genre: genre || undefined,
    year: year || undefined,
    trackNumber: trackNumber || undefined,
    duration,
    format: formatLabel,
    lossless,
    sampleRate,
    bitDepth,
    bitrate,
    coverUrl,
    originalCoverUrl: coverUrl,
  };
}

export async function extractTrackFromFile(
  file: File,
  fallbackIndex = 0
): Promise<{ track: AudioTrack; blob: Blob }> {
  const placeholder = createInstantTrackPlaceholder(file, fallbackIndex);
  const enriched = await extractTrackMetadataIntoTrack(file, placeholder);
  return { track: enriched, blob: file };
}

function encodeMonoWav(
  samples: Float32Array,
  sampleRate: number,
  bitDepth: 8 | 16 = 16
): Blob {
  const bytesPerSample = bitDepth === 8 ? 1 : 2;
  const dataLength = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  if (bitDepth === 8) {
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setUint8(offset, Math.round((s * 0.5 + 0.5) * 255));
      offset += 1;
    }
  } else {
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function normalizeGeminiAudioMimeType(rawType: string): string | null {
  const lower = (rawType || '').toLowerCase().split(';')[0].trim();
  if (lower === 'audio/mpeg' || lower === 'audio/mp3') return 'audio/mpeg';
  if (lower === 'audio/wav' || lower === 'audio/x-wav' || lower === 'audio/wave') return 'audio/wav';
  if (lower === 'audio/ogg') return 'audio/ogg';
  if (lower === 'audio/flac' || lower === 'audio/x-flac') return 'audio/flac';
  if (lower === 'audio/aac') return 'audio/aac';
  if (lower === 'audio/mp4' || lower === 'audio/x-m4a' || lower === 'audio/m4a' || lower === 'video/mp4') {
    return 'audio/mp4';
  }
  if (lower === 'audio/webm') return 'audio/webm';
  return null;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const commaIdx = reader.result.indexOf(',');
        resolve(commaIdx >= 0 ? reader.result.slice(commaIdx + 1) : reader.result);
      } else {
        reject(new Error('Failed to encode audio to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Prepares the full song audio for Gemini AI transcription, pasted-lyrics timestamp alignment,
 * and complete translation. Sends compact compressed files <= 4.5 MB directly, or downsamples the full
 * track cleanly to a compact mono WAV fitting reliably within mobile/API payload limits.
 */
export async function prepareAudioSnippetForAI(
  blob: Blob
): Promise<{ base64: string; mimeType: string; durationSec?: number } | null> {
  const normalizedMime = normalizeGeminiAudioMimeType(blob.type);
  if (blob.size <= 4.5 * 1024 * 1024 && normalizedMime && normalizedMime !== 'audio/wav') {
    const base64 = await blobToBase64(blob);
    return { base64, mimeType: normalizedMime };
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const tempCtx = new AudioCtx();
    const decoded = await tempCtx.decodeAudioData(arrayBuffer);
    await tempCtx.close();

    const fullDuration = Math.max(1, decoded.duration);
    const maxWavBytes = 4.2 * 1024 * 1024;
    const profiles: Array<{ rate: number; bits: 8 | 16 }> = [
      { rate: 16000, bits: 16 },
      { rate: 12000, bits: 16 },
      { rate: 8000, bits: 16 },
      { rate: 8000, bits: 8 },
      { rate: 6000, bits: 8 },
    ];

    const chosen =
      profiles.find((p) => fullDuration * p.rate * (p.bits / 8) <= maxWavBytes) ??
      profiles[profiles.length - 1];

    const maxAllowedSeconds = Math.floor(maxWavBytes / (chosen.rate * (chosen.bits / 8)));
    const renderDuration = Math.min(fullDuration, maxAllowedSeconds);
    const frameCount = Math.max(1, Math.floor(renderDuration * chosen.rate));

    const offline = new OfflineAudioContext(1, frameCount, chosen.rate);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start(0, 0, renderDuration);

    const rendered = await offline.startRendering();
    const channelData = rendered.getChannelData(0);
    const wavBlob = encodeMonoWav(channelData, chosen.rate, chosen.bits);
    const base64 = await blobToBase64(wavBlob);
    return {
      base64,
      mimeType: 'audio/wav',
      durationSec: Math.round(fullDuration),
    };
  } catch (err) {
    console.warn('Could not resample audio for AI:', err);
    if (blob.size <= 8 * 1024 * 1024 && normalizedMime) {
      const base64 = await blobToBase64(blob);
      return { base64, mimeType: normalizedMime };
    }
    return null;
  }
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
