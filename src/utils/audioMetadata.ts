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

export function isSupportedAudioFile(file: File): boolean {
  if (file.type.startsWith('audio/')) return true;
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
    for await (const entry of iterable.values()) {
      if (entry.kind === 'file') {
        const file = await (entry as FileSystemFileHandle).getFile();
        if (isSupportedAudioFile(file)) {
          collected.push(file);
        }
      } else if (entry.kind === 'directory') {
        await walk(entry as FileSystemDirectoryHandle);
      }
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
  try {
    return await new Promise<number>((resolve) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
      };
      audio.onerror = () => resolve(0);
      audio.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function extractTrackFromFile(
  file: File,
  fallbackIndex = 0
): Promise<{ track: AudioTrack; blob: Blob }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'audio';
  const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_]+/g, ' ').trim();

  let title = cleanName || 'Pista sin título';
  let artist = 'Artista local';
  let album = 'Biblioteca local';
  let genre = '';
  let year = '';
  let trackNumber = '';
  let duration = 0;
  let sampleRate: number | undefined;
  let bitDepth: number | undefined;
  let bitrate: number | undefined;
  let formatLabel = ext.toUpperCase();
  let lossless = LOSSLESS_EXTENSIONS.has(ext);
  let coverUrl = fallbackIndex % 2 === 0 ? DEFAULT_COVER_SAKURA : DEFAULT_COVER_CLOUD;

  try {
    const metadata = await parseBlob(file, { duration: true });
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
    } else if (formatLabel === 'ALAC' || formatLabel === 'FLAC' || formatLabel === 'WAV' || formatLabel === 'AIFF') {
      lossless = true;
    }

    const picture = metadata.common.picture?.[0];
    if (picture && picture.data?.length) {
      coverUrl = await uint8ToDataUrl(picture.data, picture.format || 'image/jpeg');
    }
  } catch (err) {
    console.warn('Metadata parse fallback for', file.name, err);
  }

  if (!duration || duration <= 0) {
    duration = await measureAudioDurationFallback(file);
  }

  const track: AudioTrack = {
    id: crypto.randomUUID(),
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
    fileSize: file.size,
    coverUrl,
    originalCoverUrl: coverUrl,
    isFavorite: false,
    playCount: 0,
    createdAt: Date.now(),
  };

  return { track, blob: file };
}

function encodeMonoWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
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
 * Downsamples up to 45 seconds of a local lossless/compressed audio blob
 * to a lightweight 16kHz mono WAV (~1.4MB) for rapid Gemini lyrics & mood analysis.
 */
export async function prepareAudioSnippetForAI(
  blob: Blob
): Promise<{ base64: string; mimeType: string } | null> {
  // If original file is already small (< 3.5MB) and standard web mime, send directly
  if (blob.size <= 3.5 * 1024 * 1024 && (blob.type === 'audio/mpeg' || blob.type === 'audio/wav' || blob.type === 'audio/ogg')) {
    const base64 = await blobToBase64(blob);
    return { base64, mimeType: blob.type };
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const tempCtx = new AudioCtx();
    const decoded = await tempCtx.decodeAudioData(arrayBuffer);
    await tempCtx.close();

    const targetRate = 16000;
    const maxSeconds = Math.min(decoded.duration, 45);
    const frameCount = Math.max(1, Math.floor(maxSeconds * targetRate));
    const offline = new OfflineAudioContext(1, frameCount, targetRate);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start(0, 0, maxSeconds);

    const rendered = await offline.startRendering();
    const channelData = rendered.getChannelData(0);
    const wavBlob = encodeMonoWav(channelData, targetRate);
    const base64 = await blobToBase64(wavBlob);
    return { base64, mimeType: 'audio/wav' };
  } catch (err) {
    console.warn('Could not resample audio snippet, continuing with metadata:', err);
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
