import type { ButtonSoundId, LockSoundId } from '../types/music';

export interface LockSoundPreset {
  id: LockSoundId;
  emoji: string;
  label: string;
  description: string;
}

export interface ButtonSoundPreset {
  id: ButtonSoundId;
  emoji: string;
  label: string;
  tag: string;
  description: string;
}

export const LOCK_SOUND_OPTIONS: LockSoundPreset[] = [
  {
    id: 'soft_bubbles',
    emoji: '🫧',
    label: 'Burbujas suaves',
    description: 'Burbujitas de jabón con tono dulce que sube en cada emoji',
  },
  {
    id: 'creamy_bubbles',
    emoji: '🧋',
    label: 'Burbujas de leche',
    description: 'Espuma tibia y cremosa aún más suave y redondita',
  },
  {
    id: 'rain_drops',
    emoji: '💧',
    label: 'Gotitas de lluvia',
    description: 'Gotas cristalinas suaves sobre agua tranquila',
  },
  {
    id: 'honey_drops',
    emoji: '🍯',
    label: 'Gotitas de miel',
    description: 'Gotas tibias y dulces con caída aterciopelada',
  },
  {
    id: 'jelly_pops',
    emoji: '🍮',
    label: 'Gomitas pop',
    description: 'Rebote esponjoso tipo gelatina pastel ASMR',
  },
  {
    id: 'music_box',
    emoji: '🎐',
    label: 'Cajita musical',
    description: 'Notas delicadas de campanita y kalimba',
  },
  {
    id: 'cloud_puffs',
    emoji: '☁️',
    label: 'Nubes suaves',
    description: 'Toque acolchado de aire cálido ultra sutil',
  },
  {
    id: 'off',
    emoji: '🤫',
    label: 'Silencio',
    description: 'Sin sonido al tocar la clave',
  },
];

export const BUTTON_SOUND_OPTIONS: ButtonSoundPreset[] = [
  {
    id: 'creamy_keycaps',
    emoji: '⌨️',
    label: 'Teclado cremoso',
    tag: 'Creamy Thock',
    description: 'Estilo teclado custom chino con espuma suave y PBT cremoso',
  },
  {
    id: 'ice_cream_thock',
    emoji: '🍦',
    label: 'Helado Cremoso',
    tag: '冰淇淋轴',
    description: 'Switch ultra cremoso con cuerpo tibio y fondo de silicona suave',
  },
  {
    id: 'matcha_latte',
    emoji: '🍵',
    label: 'Matcha Latte',
    tag: '抹茶拿铁',
    description: 'Tecla mate sedosa tipo canica suave sin brillo agudo',
  },
  {
    id: 'marshmallow_gasket',
    emoji: '🍡',
    label: 'Malvavisco Gasket',
    tag: '棉花糖',
    description: 'Montaje acolchado ultra blando y silencioso tipo nube',
  },
  {
    id: 'butter_pbt',
    emoji: '🧈',
    label: 'Mantequilla PBT',
    tag: '黄油轴',
    description: 'Famoso switch mantequilla chino: denso, redondo y súper suave',
  },
  {
    id: 'cloud_foam',
    emoji: '☁️',
    label: 'Espuma de Nube',
    tag: '云朵静音',
    description: 'Susurro táctil amortiguado con espuma doble, cero estridencia',
  },
  {
    id: 'mahjong_clack',
    emoji: '🀄',
    label: 'Teclas Mahjong',
    tag: '麻将音',
    description: 'Clack lechoso y denso tipo ficha de mahjong de resina',
  },
  {
    id: 'peach_switch',
    emoji: '🍑',
    label: 'Switch Durazno',
    tag: '水蜜桃轴',
    description: 'Switch lineal lubricado silencioso, suave y aterciopelado',
  },
  {
    id: 'milk_pudding',
    emoji: '🥛',
    label: 'Tecla Pudín Leche',
    tag: 'Milky Pop',
    description: 'Tecla redonda cremosa con rebote tibio tipo pudín',
  },
  {
    id: 'bamboo_wood',
    emoji: '🎋',
    label: 'Bambú Lo-Fi',
    tag: 'Woody ASMR',
    description: 'Toque cálido de madera hueca y bambú japonés',
  },
  {
    id: 'sugar_sparkles',
    emoji: '✨',
    label: 'Chispitas Kawaii',
    tag: 'Sparkle Click',
    description: 'Clic ligerito con micro brillo dulce',
  },
  {
    id: 'off',
    emoji: '🔇',
    label: 'Silencio',
    tag: 'Off',
    description: 'Sin sonido al presionar botones',
  },
];

let sharedCtx: AudioContext | null = null;
let masterOut: GainNode | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;

function ensureAudioContext(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedCtx) {
    sharedCtx = new AudioCtx({ latencyHint: 'interactive' });
    const compressor = sharedCtx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.08;

    masterOut = sharedCtx.createGain();
    masterOut.gain.value = 0.9;
    masterOut.connect(compressor);
    compressor.connect(sharedCtx.destination);
  }

  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }

  return sharedCtx && masterOut ? { ctx: sharedCtx, out: masterOut } : null;
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.14);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Slightly smoothed pink-ish noise for creamy transients without harsh digital hiss
  let b0 = 0;
  let b1 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.92 * b0 + white * 0.18;
    b1 = 0.65 * b1 + b0 * 0.55;
    data[i] = Math.max(-1, Math.min(1, b1 * 2.1));
  }
  cachedNoiseBuffer = buffer;
  return buffer;
}

function jitter(base: number, amount = 0.05): number {
  return base * (1 + (Math.random() * 2 - 1) * amount);
}

function clampVolume(volume: number): number {
  if (!Number.isFinite(volume)) return 0.75;
  return Math.max(0.05, Math.min(1.0, volume));
}

/**
 * Plays cute ASMR sound when tapping a lock-screen emoji key (slots 0..3).
 */
export function playLockKeySound(
  preset: LockSoundId,
  slotIndex = 0,
  volume = 0.75
): void {
  if (preset === 'off') return;
  const audio = ensureAudioContext();
  if (!audio) return;

  const { ctx, out } = audio;
  const now = ctx.currentTime;
  const vol = clampVolume(volume);
  const stepRatio = [1, 1.122, 1.26, 1.498][Math.max(0, Math.min(3, slotIndex))] ?? 1;

  if (preset === 'soft_bubbles') {
    // Classic cute rising soap-bubble resonance + gentle airy pop
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const baseFreq = jitter(350 * stepRatio, 0.03);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.85, now + 0.068);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.28 * vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.115);

    osc.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + 0.125);

    // Subtle secondary bubble shimmer
    const air = ctx.createOscillator();
    const airG = ctx.createGain();
    air.type = 'sine';
    air.frequency.setValueAtTime(baseFreq * 2.1, now + 0.018);
    air.frequency.exponentialRampToValueAtTime(baseFreq * 2.9, now + 0.075);
    airG.gain.setValueAtTime(0.0001, now + 0.018);
    airG.gain.linearRampToValueAtTime(0.07 * vol, now + 0.026);
    airG.gain.exponentialRampToValueAtTime(0.0008, now + 0.095);
    air.connect(airG);
    airG.connect(out);
    air.start(now + 0.018);
    air.stop(now + 0.105);
    return;
  }

  if (preset === 'creamy_bubbles') {
    // Warmer, deeper, velvet milk-foam bubbles with soft low-pass smoothing
    const base = jitter(260 * stepRatio, 0.03);
    const osc = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.52, now + 0.075);

    lp.type = 'lowpass';
    lp.frequency.value = 820;

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.26 * vol, now + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.13);

    osc.connect(lp);
    lp.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + 0.14);
    return;
  }

  if (preset === 'rain_drops') {
    const base = jitter(580 * stepRatio, 0.03);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 2.1, now + 0.045);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.24 * vol, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.09);

    osc.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + 0.1);

    // Tiny echo droplet
    const echo = ctx.createOscillator();
    const eg = ctx.createGain();
    echo.type = 'sine';
    echo.frequency.setValueAtTime(base * 1.45, now + 0.048);
    echo.frequency.exponentialRampToValueAtTime(base * 2.25, now + 0.09);
    eg.gain.setValueAtTime(0.0001, now + 0.048);
    eg.gain.linearRampToValueAtTime(0.07 * vol, now + 0.054);
    eg.gain.exponentialRampToValueAtTime(0.0008, now + 0.13);
    echo.connect(eg);
    eg.connect(out);
    echo.start(now + 0.048);
    echo.stop(now + 0.14);
    return;
  }

  if (preset === 'honey_drops') {
    // Syrupy, warm honey drop with rounded low-mid body
    const base = jitter(310 * stepRatio, 0.03);
    const osc = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.65, now + 0.055);
    osc.frequency.exponentialRampToValueAtTime(base * 1.38, now + 0.12);

    lp.type = 'lowpass';
    lp.frequency.value = 740;

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.26 * vol, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.15);

    osc.connect(lp);
    lp.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + 0.16);
    return;
  }

  if (preset === 'jelly_pops') {
    const base = jitter(260 * stepRatio, 0.04);
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 2.2, now + 0.032);
    osc.frequency.exponentialRampToValueAtTime(base * 1.35, now + 0.085);

    filter.type = 'lowpass';
    filter.frequency.value = 1100;

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.3 * vol, now + 0.009);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.11);

    osc.connect(filter);
    filter.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + 0.12);
    return;
  }

  if (preset === 'music_box') {
    const notes = [659.25, 830.61, 987.77, 1318.51];
    const freq = notes[Math.max(0, Math.min(3, slotIndex))] ?? 659.25;

    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const g = ctx.createGain();
    const og = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.22 * vol, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

    og.gain.setValueAtTime(0.0001, now);
    og.gain.linearRampToValueAtTime(0.06 * vol, now + 0.004);
    og.gain.exponentialRampToValueAtTime(0.0008, now + 0.11);

    osc.connect(g);
    overtone.connect(og);
    g.connect(out);
    og.connect(out);
    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.25);
    overtone.stop(now + 0.12);
    return;
  }

  if (preset === 'cloud_puffs') {
    // Ultra-soft airy puff + pillowy sub-sine
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(950 * stepRatio, now);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.linearRampToValueAtTime(0.14 * vol, now + 0.012);
    ng.gain.exponentialRampToValueAtTime(0.0008, now + 0.075);

    noise.connect(lp);
    lp.connect(ng);
    ng.connect(out);
    noise.start(now);
    noise.stop(now + 0.085);

    const puff = ctx.createOscillator();
    const pg = ctx.createGain();
    puff.type = 'sine';
    puff.frequency.setValueAtTime(230 * stepRatio, now);
    puff.frequency.exponentialRampToValueAtTime(170 * stepRatio, now + 0.05);
    pg.gain.setValueAtTime(0.0001, now);
    pg.gain.linearRampToValueAtTime(0.18 * vol, now + 0.008);
    pg.gain.exponentialRampToValueAtTime(0.0008, now + 0.075);
    puff.connect(pg);
    pg.connect(out);
    puff.start(now);
    puff.stop(now + 0.085);
  }
}

export function playLockEraseSound(preset: LockSoundId, volume = 0.75): void {
  if (preset === 'off') return;
  const audio = ensureAudioContext();
  if (!audio) return;

  const { ctx, out } = audio;
  const now = ctx.currentTime;
  const vol = clampVolume(volume);

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.065);

  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.16 * vol, now + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0008, now + 0.075);

  osc.connect(g);
  g.connect(out);
  osc.start(now);
  osc.stop(now + 0.085);
}

export function playLockUnlockSound(preset: LockSoundId, volume = 0.75): void {
  if (preset === 'off') return;
  const audio = ensureAudioContext();
  if (!audio) return;

  const { ctx, out } = audio;
  const now = ctx.currentTime;
  const vol = clampVolume(volume);
  const chord = [523.25, 659.25, 783.99, 1046.5];

  chord.forEach((freq, idx) => {
    const start = now + idx * 0.055;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.92, start);
    osc.frequency.exponentialRampToValueAtTime(freq, start + 0.035);

    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(0.19 * vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, start + 0.24);

    osc.connect(g);
    g.connect(out);
    osc.start(start);
    osc.stop(start + 0.26);
  });
}

export function playLockErrorSound(preset: LockSoundId, volume = 0.75): void {
  if (preset === 'off') return;
  const audio = ensureAudioContext();
  if (!audio) return;

  const { ctx, out } = audio;
  const now = ctx.currentTime;
  const vol = clampVolume(volume);

  [0, 0.09].forEach((offset, i) => {
    const start = now + offset;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    const startFreq = i === 0 ? 270 : 210;
    osc.frequency.setValueAtTime(startFreq, start);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, start + 0.07);

    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(0.18 * vol, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, start + 0.09);

    osc.connect(g);
    g.connect(out);
    osc.start(start);
    osc.stop(start + 0.1);
  });
}

/**
 * Plays ASMR mechanical/creamy Chinese keyboard or cute tactile button press sounds.
 */
export function playButtonSound(preset: ButtonSoundId, volume = 0.75): void {
  if (preset === 'off') return;
  const audio = ensureAudioContext();
  if (!audio) return;

  const { ctx, out } = audio;
  const now = ctx.currentTime;
  const vol = clampVolume(volume);

  if (preset === 'creamy_keycaps') {
    // 1) Warm foam-dampened POM/PBT "creamy thock" housing body
    const body = ctx.createOscillator();
    const bodyLp = ctx.createBiquadFilter();
    const bodyGain = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(jitter(245, 0.07), now);
    body.frequency.exponentialRampToValueAtTime(jitter(102, 0.06), now + 0.028);

    bodyLp.type = 'lowpass';
    bodyLp.frequency.value = 540;

    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.linearRampToValueAtTime(0.42 * vol, now + 0.0025);
    bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.044);

    body.connect(bodyLp);
    bodyLp.connect(bodyGain);
    bodyGain.connect(out);
    body.start(now);
    body.stop(now + 0.05);

    // 2) Marbly creamy stem-bottom tap (bandpassed resonant click)
    const tap = ctx.createOscillator();
    const tapGain = ctx.createGain();
    tap.type = 'sine';
    tap.frequency.setValueAtTime(jitter(920, 0.08), now);
    tap.frequency.exponentialRampToValueAtTime(jitter(390, 0.06), now + 0.015);
    tapGain.gain.setValueAtTime(0.0001, now);
    tapGain.gain.linearRampToValueAtTime(0.18 * vol, now + 0.0015);
    tapGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.02);
    tap.connect(tapGain);
    tapGain.connect(out);
    tap.start(now);
    tap.stop(now + 0.024);

    // 3) Filtered PBT keycap surface transient
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = jitter(1750, 0.09);
    bp.Q.value = 2.0;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.linearRampToValueAtTime(0.2 * vol, now + 0.0015);
    ng.gain.exponentialRampToValueAtTime(0.0008, now + 0.014);
    noise.connect(bp);
    bp.connect(ng);
    ng.connect(out);
    noise.start(now);
    noise.stop(now + 0.018);
    return;
  }

  if (preset === 'ice_cream_thock') {
    // 冰淇淋轴: ultra-soft deep creamy thock with silky silicone cushion
    const body = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(jitter(195, 0.06), now);
    body.frequency.exponentialRampToValueAtTime(jitter(82, 0.05), now + 0.036);
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.42 * vol, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.056);
    body.connect(lp);
    lp.connect(g);
    g.connect(out);
    body.start(now);
    body.stop(now + 0.062);

    const cream = ctx.createOscillator();
    const clp = ctx.createBiquadFilter();
    const cg = ctx.createGain();
    cream.type = 'triangle';
    cream.frequency.setValueAtTime(jitter(490, 0.07), now);
    cream.frequency.exponentialRampToValueAtTime(jitter(210, 0.05), now + 0.022);
    clp.type = 'lowpass';
    clp.frequency.value = 680;
    cg.gain.setValueAtTime(0.0001, now);
    cg.gain.linearRampToValueAtTime(0.16 * vol, now + 0.0025);
    cg.gain.exponentialRampToValueAtTime(0.0008, now + 0.03);
    cream.connect(clp);
    clp.connect(cg);
    cg.connect(out);
    cream.start(now);
    cream.stop(now + 0.035);
    return;
  }

  if (preset === 'matcha_latte') {
    // 抹茶拿铁: silky matte marble tap with warm low-mid resonance
    const body = ctx.createOscillator();
    const bg = ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(jitter(225, 0.06), now);
    body.frequency.exponentialRampToValueAtTime(jitter(96, 0.05), now + 0.03);
    bg.gain.setValueAtTime(0.0001, now);
    bg.gain.linearRampToValueAtTime(0.36 * vol, now + 0.003);
    bg.gain.exponentialRampToValueAtTime(0.0008, now + 0.046);
    body.connect(bg);
    bg.connect(out);
    body.start(now);
    body.stop(now + 0.052);

    const marble = ctx.createOscillator();
    const mlp = ctx.createBiquadFilter();
    const mg = ctx.createGain();
    marble.type = 'sine';
    marble.frequency.setValueAtTime(jitter(640, 0.06), now);
    marble.frequency.exponentialRampToValueAtTime(jitter(310, 0.05), now + 0.018);
    mlp.type = 'lowpass';
    mlp.frequency.value = 950;
    mg.gain.setValueAtTime(0.0001, now);
    mg.gain.linearRampToValueAtTime(0.18 * vol, now + 0.002);
    mg.gain.exponentialRampToValueAtTime(0.0008, now + 0.026);
    marble.connect(mlp);
    mlp.connect(mg);
    mg.connect(out);
    marble.start(now);
    marble.stop(now + 0.03);

    const foam = ctx.createBufferSource();
    foam.buffer = getNoiseBuffer(ctx);
    const flp = ctx.createBiquadFilter();
    flp.type = 'lowpass';
    flp.frequency.value = jitter(1050, 0.08);
    const fg = ctx.createGain();
    fg.gain.setValueAtTime(0.0001, now);
    fg.gain.linearRampToValueAtTime(0.12 * vol, now + 0.002);
    fg.gain.exponentialRampToValueAtTime(0.0008, now + 0.016);
    foam.connect(flp);
    flp.connect(fg);
    fg.connect(out);
    foam.start(now);
    foam.stop(now + 0.02);
    return;
  }

  if (preset === 'marshmallow_gasket') {
    // 棉花糖 Gasket: pillowy soft flex-board bounce
    const thump = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    thump.type = 'sine';
    const f = jitter(155, 0.06);
    thump.frequency.setValueAtTime(f, now);
    thump.frequency.exponentialRampToValueAtTime(f * 1.18, now + 0.012);
    thump.frequency.exponentialRampToValueAtTime(76, now + 0.044);
    lp.type = 'lowpass';
    lp.frequency.value = 360;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.4 * vol, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.062);
    thump.connect(lp);
    lp.connect(g);
    g.connect(out);
    thump.start(now);
    thump.stop(now + 0.068);

    const puff = ctx.createBufferSource();
    puff.buffer = getNoiseBuffer(ctx);
    const plp = ctx.createBiquadFilter();
    plp.type = 'lowpass';
    plp.frequency.value = 650;
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0.0001, now);
    pg.gain.linearRampToValueAtTime(0.11 * vol, now + 0.004);
    pg.gain.exponentialRampToValueAtTime(0.0008, now + 0.025);
    puff.connect(plp);
    plp.connect(pg);
    pg.connect(out);
    puff.start(now);
    puff.stop(now + 0.03);
    return;
  }

  if (preset === 'butter_pbt') {
    // 黄油轴 (Butter Switch): rich, dense, warm velvety PBT bottom-out
    const body = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(jitter(215, 0.06), now);
    body.frequency.exponentialRampToValueAtTime(jitter(112, 0.05), now + 0.03);
    lp.type = 'lowpass';
    lp.frequency.value = 460;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.4 * vol, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.046);
    body.connect(lp);
    lp.connect(g);
    g.connect(out);
    body.start(now);
    body.stop(now + 0.052);

    const roundTap = ctx.createOscillator();
    const rg = ctx.createGain();
    roundTap.type = 'sine';
    roundTap.frequency.setValueAtTime(jitter(720, 0.07), now);
    roundTap.frequency.exponentialRampToValueAtTime(jitter(350, 0.05), now + 0.016);
    rg.gain.setValueAtTime(0.0001, now);
    rg.gain.linearRampToValueAtTime(0.18 * vol, now + 0.002);
    rg.gain.exponentialRampToValueAtTime(0.0008, now + 0.022);
    roundTap.connect(rg);
    rg.connect(out);
    roundTap.start(now);
    roundTap.stop(now + 0.026);

    const silk = ctx.createBufferSource();
    silk.buffer = getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = jitter(1150, 0.08);
    bp.Q.value = 1.4;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, now);
    sg.gain.linearRampToValueAtTime(0.14 * vol, now + 0.002);
    sg.gain.exponentialRampToValueAtTime(0.0008, now + 0.016);
    silk.connect(bp);
    bp.connect(sg);
    sg.connect(out);
    silk.start(now);
    silk.stop(now + 0.02);
    return;
  }

  if (preset === 'cloud_foam') {
    // 云朵静音: whisper-soft double-foam damped silent key
    const sub = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(jitter(142, 0.05), now);
    sub.frequency.exponentialRampToValueAtTime(jitter(74, 0.05), now + 0.034);
    lp.type = 'lowpass';
    lp.frequency.value = 320;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.32 * vol, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.05);
    sub.connect(lp);
    lp.connect(g);
    g.connect(out);
    sub.start(now);
    sub.stop(now + 0.056);

    const velvet = ctx.createBufferSource();
    velvet.buffer = getNoiseBuffer(ctx);
    const vlp = ctx.createBiquadFilter();
    vlp.type = 'lowpass';
    vlp.frequency.value = 580;
    const vg = ctx.createGain();
    vg.gain.setValueAtTime(0.0001, now);
    vg.gain.linearRampToValueAtTime(0.12 * vol, now + 0.004);
    vg.gain.exponentialRampToValueAtTime(0.0008, now + 0.024);
    velvet.connect(vlp);
    vlp.connect(vg);
    vg.connect(out);
    velvet.start(now);
    velvet.stop(now + 0.028);
    return;
  }

  if (preset === 'mahjong_clack') {
    // Chinese Mahjong-tile switch sound (麻将音): dense milky mid resonance + crisp clack
    const body = ctx.createOscillator();
    const bg = ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(jitter(310, 0.07), now);
    body.frequency.exponentialRampToValueAtTime(jitter(140, 0.06), now + 0.026);
    bg.gain.setValueAtTime(0.0001, now);
    bg.gain.linearRampToValueAtTime(0.32 * vol, now + 0.002);
    bg.gain.exponentialRampToValueAtTime(0.0008, now + 0.038);
    body.connect(bg);
    bg.connect(out);
    body.start(now);
    body.stop(now + 0.044);

    // Resonant ceramic/mahjong pair
    [760, 1480].forEach((f, idx) => {
      const tile = ctx.createOscillator();
      const tg = ctx.createGain();
      tile.type = 'sine';
      tile.frequency.setValueAtTime(jitter(f, 0.06), now);
      tile.frequency.exponentialRampToValueAtTime(jitter(f * 0.72, 0.05), now + 0.02);
      tg.gain.setValueAtTime(0.0001, now);
      tg.gain.linearRampToValueAtTime((idx === 0 ? 0.2 : 0.13) * vol, now + 0.0015);
      tg.gain.exponentialRampToValueAtTime(0.0008, now + 0.024);
      tile.connect(tg);
      tg.connect(out);
      tile.start(now);
      tile.stop(now + 0.028);
    });

    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = jitter(2500, 0.08);
    bp.Q.value = 2.4;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.linearRampToValueAtTime(0.22 * vol, now + 0.001);
    ng.gain.exponentialRampToValueAtTime(0.0008, now + 0.011);
    noise.connect(bp);
    bp.connect(ng);
    ng.connect(out);
    noise.start(now);
    noise.stop(now + 0.015);
    return;
  }

  if (preset === 'peach_switch') {
    // Silent lubed Chinese Peach switch (水蜜桃轴): ultra soft velvety cushioned thud
    const body = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const bg = ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(jitter(175, 0.06), now);
    body.frequency.exponentialRampToValueAtTime(jitter(82, 0.05), now + 0.032);
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    bg.gain.setValueAtTime(0.0001, now);
    bg.gain.linearRampToValueAtTime(0.36 * vol, now + 0.004);
    bg.gain.exponentialRampToValueAtTime(0.0008, now + 0.048);
    body.connect(lp);
    lp.connect(bg);
    bg.connect(out);
    body.start(now);
    body.stop(now + 0.055);

    const felt = ctx.createBufferSource();
    felt.buffer = getNoiseBuffer(ctx);
    const flp = ctx.createBiquadFilter();
    flp.type = 'lowpass';
    flp.frequency.value = jitter(860, 0.08);
    const fg = ctx.createGain();
    fg.gain.setValueAtTime(0.0001, now);
    fg.gain.linearRampToValueAtTime(0.15 * vol, now + 0.003);
    fg.gain.exponentialRampToValueAtTime(0.0008, now + 0.022);
    felt.connect(flp);
    flp.connect(fg);
    fg.connect(out);
    felt.start(now);
    felt.stop(now + 0.026);
    return;
  }

  if (preset === 'milk_pudding') {
    // Creamy bouncy milky pudding keycap pop
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    const f = jitter(260, 0.07);
    osc.frequency.setValueAtTime(f, now);
    osc.frequency.exponentialRampToValueAtTime(f * 1.45, now + 0.018);
    osc.frequency.exponentialRampToValueAtTime(f * 0.65, now + 0.052);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.3 * vol, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.062);
    osc.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + 0.068);

    const click = ctx.createOscillator();
    const cg = ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(jitter(1150, 0.08), now);
    click.frequency.exponentialRampToValueAtTime(520, now + 0.012);
    cg.gain.setValueAtTime(0.0001, now);
    cg.gain.linearRampToValueAtTime(0.11 * vol, now + 0.0015);
    cg.gain.exponentialRampToValueAtTime(0.0008, now + 0.016);
    click.connect(cg);
    cg.connect(out);
    click.start(now);
    click.stop(now + 0.02);
    return;
  }

  if (preset === 'bamboo_wood') {
    // Warm hollow bamboo / wooden ASMR tap
    const f1 = jitter(520, 0.06);
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(f1, now);
    osc1.frequency.exponentialRampToValueAtTime(f1 * 0.85, now + 0.032);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(f1 * 1.52, now);
    osc2.frequency.exponentialRampToValueAtTime(f1 * 1.38, now + 0.024);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.24 * vol, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.044);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, now);
    g2.gain.linearRampToValueAtTime(0.09 * vol, now + 0.0015);
    g2.gain.exponentialRampToValueAtTime(0.0008, now + 0.028);

    osc1.connect(g);
    osc2.connect(g2);
    g.connect(out);
    g2.connect(out);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.048);
    osc2.stop(now + 0.032);
    return;
  }

  if (preset === 'sugar_sparkles') {
    // Tiny mechanical click + delicate sparkle
    const thock = ctx.createOscillator();
    const tg = ctx.createGain();
    thock.type = 'sine';
    thock.frequency.setValueAtTime(jitter(300, 0.07), now);
    thock.frequency.exponentialRampToValueAtTime(140, now + 0.022);
    tg.gain.setValueAtTime(0.0001, now);
    tg.gain.linearRampToValueAtTime(0.2 * vol, now + 0.002);
    tg.gain.exponentialRampToValueAtTime(0.0008, now + 0.028);
    thock.connect(tg);
    tg.connect(out);
    thock.start(now);
    thock.stop(now + 0.032);

    const bell = ctx.createOscillator();
    const bg = ctx.createGain();
    bell.type = 'sine';
    const bf = jitter(1480, 0.08);
    bell.frequency.setValueAtTime(bf, now);
    bell.frequency.exponentialRampToValueAtTime(bf * 1.25, now + 0.045);
    bg.gain.setValueAtTime(0.0001, now);
    bg.gain.linearRampToValueAtTime(0.11 * vol, now + 0.003);
    bg.gain.exponentialRampToValueAtTime(0.0008, now + 0.085);
    bell.connect(bg);
    bg.connect(out);
    bell.start(now);
    bell.stop(now + 0.092);
  }
}
