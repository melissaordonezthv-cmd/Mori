import { DEFAULT_COVER_CLOUD, DEFAULT_COVER_SAKURA } from '../constants/themes';
import type { AudioTrack, Playlist } from '../types/music';

function createStereoWavBlob(
  durationSec: number,
  sampleRate: number,
  renderSample: (t: number) => [number, number]
): Blob {
  const numSamples = Math.floor(durationSec * sampleRate);
  const buffer = new ArrayBuffer(44 + numSamples * 4);
  const view = new DataView(buffer);

  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 4, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 4, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const [l, r] = renderSample(t);
    const cl = Math.max(-0.95, Math.min(0.95, l));
    const cr = Math.max(-0.95, Math.min(0.95, r));
    view.setInt16(offset, Math.round(cl * 32767), true);
    view.setInt16(offset + 2, Math.round(cr * 32767), true);
    offset += 4;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export function generateStarterSampleTracks(): {
  tracks: Array<{ track: AudioTrack; blob: Blob }>;
  defaultPlaylist: Playlist;
} {
  const sampleRate = 44100;

  // Track 1: Gentle Pentatonic Sakura Music Box (16s lossless WAV)
  const pentatonicNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33];
  const wav1 = createStereoWavBlob(16, sampleRate, (t) => {
    const step = Math.floor(t / 0.8);
    const localT = t % 0.8;
    const freq = pentatonicNotes[step % pentatonicNotes.length];
    const env = Math.exp(-localT * 4.2) * Math.min(1, localT * 90);
    const fadeEdge = Math.min(1, t * 2) * Math.min(1, (16 - t) * 2);
    const chime =
      Math.sin(2 * Math.PI * freq * t) * 0.36 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.1;
    const warmPad = Math.sin(2 * Math.PI * (freq / 2) * t) * 0.14;
    const l = (chime * env + warmPad) * fadeEdge;
    const r = (chime * env * 0.92 + warmPad * 1.08) * fadeEdge;
    return [l, r];
  });

  // Track 2: Dreamy Cloud Pad Progression (18s lossless WAV)
  const chords = [
    [261.63, 329.63, 392.0, 493.88],
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 349.23],
    [196.0, 246.94, 293.66, 392.0],
  ];
  const wav2 = createStereoWavBlob(18, sampleRate, (t) => {
    const chordIdx = Math.floor(t / 4.5) % chords.length;
    const localT = t % 4.5;
    const chord = chords[chordIdx];
    const env = Math.sin(Math.PI * Math.min(1, localT / 4.5)) * 0.85 + 0.15;
    const fadeEdge = Math.min(1, t * 1.5) * Math.min(1, (18 - t) * 1.5);
    let sumL = 0;
    let sumR = 0;
    for (let i = 0; i < chord.length; i++) {
      const f = chord[i];
      sumL += Math.sin(2 * Math.PI * f * t + i * 0.2) * 0.12;
      sumR += Math.sin(2 * Math.PI * (f * 1.002) * t + i * 0.4) * 0.12;
    }
    return [sumL * env * fadeEdge, sumR * env * fadeEdge];
  });

  const now = Date.now();
  const track1: AudioTrack = {
    id: 'sample-sakura-box',
    title: 'Brisa de Sakura (Muestra)',
    artist: 'MoriNote Studio',
    album: 'Colección Pastel',
    duration: 16,
    format: 'WAV',
    lossless: true,
    sampleRate: 44100,
    bitDepth: 16,
    bitrate: 1411,
    fileSize: wav1.size,
    coverUrl: DEFAULT_COVER_SAKURA,
    isFavorite: true,
    playCount: 0,
    createdAt: now,
    isSample: true,
  };

  const track2: AudioTrack = {
    id: 'sample-cloud-pad',
    title: 'Nubes de Perla (Muestra)',
    artist: 'MoriNote Studio',
    album: 'Colección Pastel',
    duration: 18,
    format: 'WAV',
    lossless: true,
    sampleRate: 44100,
    bitDepth: 16,
    bitrate: 1411,
    fileSize: wav2.size,
    coverUrl: DEFAULT_COVER_CLOUD,
    isFavorite: false,
    playCount: 0,
    createdAt: now - 1000,
    isSample: true,
  };

  const defaultPlaylist: Playlist = {
    id: 'playlist-pastel-morning',
    name: 'Mañanas Pastel',
    description: 'Lista de ejemplo para probar la portada, edición y reproducción sin pérdida.',
    coverUrl: DEFAULT_COVER_SAKURA,
    trackIds: [track1.id, track2.id],
    createdAt: now,
    updatedAt: now,
  };

  return {
    tracks: [
      { track: track1, blob: wav1 },
      { track: track2, blob: wav2 },
    ],
    defaultPlaylist,
  };
}
