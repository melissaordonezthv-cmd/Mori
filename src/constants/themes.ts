import type {
  AudioEngineMode,
  BackgroundColorId,
  ButtonThemeId,
  DividerColorId,
  EqPresetId,
  MusicalMood,
  NowPlayingVisualId,
  PlaybackButton3DStyleId,
  PlaybackButtonColorId,
  SongBarAnimationId,
  SongBarColorId,
  TextColorId,
  TrackCardColorId,
  TrackCardDecorId,
  TrackCardStyleId,
} from '../types/music';

export interface SurfaceSwatch {
  id: BackgroundColorId;
  label: string;
  bgApp: string;
  bgSurface: string;
  bgElevated: string;
  accent: string;
  accentSoft: string;
  swatchPreview: string;
  isDark: boolean;
}

export const SURFACE_SWATCHES: SurfaceSwatch[] = [
  {
    id: 'rosa',
    label: 'Rosa',
    bgApp: '#FFF2F6',
    bgSurface: '#FDE8F0',
    bgElevated: '#FFFFFF',
    accent: '#F4B8CC',
    accentSoft: 'rgba(244, 184, 204, 0.28)',
    swatchPreview: '#F8D4E0',
    isDark: false,
  },
  {
    id: 'sakura',
    label: 'Sakura',
    bgApp: '#FFF5F8',
    bgSurface: '#FFEAF1',
    bgElevated: '#FFFFFF',
    accent: '#F7C6D7',
    accentSoft: 'rgba(247, 198, 215, 0.30)',
    swatchPreview: '#FCE0EA',
    isDark: false,
  },
  {
    id: 'nube_rosa',
    label: 'Nube Rosa',
    bgApp: '#FDF3F5',
    bgSurface: '#F8E4E9',
    bgElevated: '#FFFFFF',
    accent: '#EBBAC5',
    accentSoft: 'rgba(235, 186, 197, 0.28)',
    swatchPreview: '#F4D4DC',
    isDark: false,
  },
  {
    id: 'durazno',
    label: 'Durazno',
    bgApp: '#FFF6EE',
    bgSurface: '#FFECDC',
    bgElevated: '#FFFFFF',
    accent: '#F6C5A3',
    accentSoft: 'rgba(246, 197, 163, 0.28)',
    swatchPreview: '#FAD9C2',
    isDark: false,
  },
  {
    id: 'melon',
    label: 'Melón',
    bgApp: '#FFF7F2',
    bgSurface: '#FFEBE0',
    bgElevated: '#FFFFFF',
    accent: '#F8C0A6',
    accentSoft: 'rgba(248, 192, 166, 0.28)',
    swatchPreview: '#FAD5C3',
    isDark: false,
  },
  {
    id: 'coral',
    label: 'Coral',
    bgApp: '#FFF4F1',
    bgSurface: '#FFE8E1',
    bgElevated: '#FFFFFF',
    accent: '#F6B7A7',
    accentSoft: 'rgba(246, 183, 167, 0.28)',
    swatchPreview: '#FAD0C4',
    isDark: false,
  },
  {
    id: 'mantequilla',
    label: 'Mantequilla',
    bgApp: '#FFFDF0',
    bgSurface: '#FCF6DA',
    bgElevated: '#FFFFFF',
    accent: '#F2DF95',
    accentSoft: 'rgba(242, 223, 149, 0.30)',
    swatchPreview: '#F9ECBA',
    isDark: false,
  },
  {
    id: 'limon',
    label: 'Limón',
    bgApp: '#FCFEF0',
    bgSurface: '#F5FADC',
    bgElevated: '#FFFFFF',
    accent: '#E2EA9D',
    accentSoft: 'rgba(226, 234, 157, 0.30)',
    swatchPreview: '#EDF2BE',
    isDark: false,
  },
  {
    id: 'verde',
    label: 'Menta',
    bgApp: '#F1FAF4',
    bgSurface: '#E3F5EA',
    bgElevated: '#FFFFFF',
    accent: '#9DD9B7',
    accentSoft: 'rgba(157, 217, 183, 0.28)',
    swatchPreview: '#C2EAD2',
    isDark: false,
  },
  {
    id: 'pistacho',
    label: 'Pistacho',
    bgApp: '#F5FBF1',
    bgSurface: '#E9F5E1',
    bgElevated: '#FFFFFF',
    accent: '#B8DDA1',
    accentSoft: 'rgba(184, 221, 161, 0.28)',
    swatchPreview: '#D2ECC2',
    isDark: false,
  },
  {
    id: 'salvia',
    label: 'Salvia',
    bgApp: '#F3F8F4',
    bgSurface: '#E6F0E8',
    bgElevated: '#FFFFFF',
    accent: '#B4CEBA',
    accentSoft: 'rgba(180, 206, 186, 0.30)',
    swatchPreview: '#D2E2D5',
    isDark: false,
  },
  {
    id: 'agua',
    label: 'Agua',
    bgApp: '#EFFCFB',
    bgSurface: '#E0F7F5',
    bgElevated: '#FFFFFF',
    accent: '#9ADFD9',
    accentSoft: 'rgba(154, 223, 217, 0.28)',
    swatchPreview: '#C1EDE9',
    isDark: false,
  },
  {
    id: 'celeste',
    label: 'Celeste',
    bgApp: '#F0F8FF',
    bgSurface: '#E2F2FE',
    bgElevated: '#FFFFFF',
    accent: '#9FD3F7',
    accentSoft: 'rgba(159, 211, 247, 0.28)',
    swatchPreview: '#C4E4FC',
    isDark: false,
  },
  {
    id: 'hielo',
    label: 'Hielo',
    bgApp: '#F3FAFC',
    bgSurface: '#E6F4F9',
    bgElevated: '#FFFFFF',
    accent: '#B2DCEB',
    accentSoft: 'rgba(178, 220, 235, 0.28)',
    swatchPreview: '#D1ECF5',
    isDark: false,
  },
  {
    id: 'azul',
    label: 'Cielo',
    bgApp: '#F1F4FF',
    bgSurface: '#E5EBFF',
    bgElevated: '#FFFFFF',
    accent: '#AABEF7',
    accentSoft: 'rgba(170, 190, 247, 0.28)',
    swatchPreview: '#C8D6FC',
    isDark: false,
  },
  {
    id: 'lavanda',
    label: 'Lavanda',
    bgApp: '#F4F3FF',
    bgSurface: '#EAE7FE',
    bgElevated: '#FFFFFF',
    accent: '#BFC0F8',
    accentSoft: 'rgba(191, 192, 248, 0.28)',
    swatchPreview: '#D8D8FC',
    isDark: false,
  },
  {
    id: 'lila',
    label: 'Lila',
    bgApp: '#F7F2FF',
    bgSurface: '#EFE6FF',
    bgElevated: '#FFFFFF',
    accent: '#CBB4F7',
    accentSoft: 'rgba(203, 180, 247, 0.28)',
    swatchPreview: '#DFCFFC',
    isDark: false,
  },
  {
    id: 'malva',
    label: 'Malva',
    bgApp: '#F9F4FA',
    bgSurface: '#F0E6F2',
    bgElevated: '#FFFFFF',
    accent: '#D5B8DC',
    accentSoft: 'rgba(213, 184, 220, 0.28)',
    swatchPreview: '#E6D2EB',
    isDark: false,
  },
  {
    id: 'orquidea',
    label: 'Orquídea',
    bgApp: '#FBF2FC',
    bgSurface: '#F5E4F7',
    bgElevated: '#FFFFFF',
    accent: '#E0B4E6',
    accentSoft: 'rgba(224, 180, 230, 0.28)',
    swatchPreview: '#ECCEF0',
    isDark: false,
  },
  {
    id: 'crema',
    label: 'Crema',
    bgApp: '#FDF9F2',
    bgSurface: '#F7EFE1',
    bgElevated: '#FFFFFF',
    accent: '#E5CFA8',
    accentSoft: 'rgba(229, 207, 168, 0.30)',
    swatchPreview: '#F0E1C6',
    isDark: false,
  },
  {
    id: 'perla',
    label: 'Perla',
    bgApp: '#FAF8F9',
    bgSurface: '#F2EEF1',
    bgElevated: '#FFFFFF',
    accent: '#DCD3DA',
    accentSoft: 'rgba(220, 211, 218, 0.32)',
    swatchPreview: '#EAE4E8',
    isDark: false,
  },
  {
    id: 'latte',
    label: 'Latte',
    bgApp: '#F9F5F1',
    bgSurface: '#F0E8E0',
    bgElevated: '#FFFFFF',
    accent: '#D8C3B0',
    accentSoft: 'rgba(216, 195, 176, 0.30)',
    swatchPreview: '#E8D8C9',
    isDark: false,
  },
  {
    id: 'avellana',
    label: 'Avellana',
    bgApp: '#F4EAE1',
    bgSurface: '#EADACE',
    bgElevated: '#FBF6F1',
    accent: '#CDB096',
    accentSoft: 'rgba(205, 176, 150, 0.32)',
    swatchPreview: '#DFC7B1',
    isDark: false,
  },
  {
    id: 'canela',
    label: 'Canela',
    bgApp: '#EFE0D2',
    bgSurface: '#E5CEBA',
    bgElevated: '#F8EFE7',
    accent: '#C49E7E',
    accentSoft: 'rgba(196, 158, 126, 0.32)',
    swatchPreview: '#D8B99E',
    isDark: false,
  },
  {
    id: 'caramelo',
    label: 'Caramelo',
    bgApp: '#E7D3C0',
    bgSurface: '#DCC0A7',
    bgElevated: '#F3E7DB',
    accent: '#B68964',
    accentSoft: 'rgba(182, 137, 100, 0.32)',
    swatchPreview: '#CCA584',
    isDark: false,
  },
  // Darker brown shades specifically requested ("algo oscuros pero solo en casos del marrón")
  {
    id: 'chocolate',
    label: 'Chocolate',
    bgApp: '#38271F',
    bgSurface: '#463228',
    bgElevated: '#533C31',
    accent: '#C9A489',
    accentSoft: 'rgba(201, 164, 137, 0.25)',
    swatchPreview: '#4D362B',
    isDark: true,
  },
  {
    id: 'cacao',
    label: 'Cacao',
    bgApp: '#2B1D17',
    bgSurface: '#37261E',
    bgElevated: '#422F25',
    accent: '#B99277',
    accentSoft: 'rgba(185, 146, 119, 0.26)',
    swatchPreview: '#3B2820',
    isDark: true,
  },
  {
    id: 'espresso',
    label: 'Espresso',
    bgApp: '#1E1410',
    bgSurface: '#291C17',
    bgElevated: '#34241E',
    accent: '#A98268',
    accentSoft: 'rgba(169, 130, 104, 0.28)',
    swatchPreview: '#261914',
    isDark: true,
  },
  {
    id: 'blanco',
    label: 'Blanco',
    bgApp: '#FFFFFF',
    bgSurface: '#F6F6F8',
    bgElevated: '#FFFFFF',
    accent: '#D4D4DC',
    accentSoft: 'rgba(212, 212, 220, 0.35)',
    swatchPreview: '#FFFFFF',
    isDark: false,
  },
  {
    id: 'negro',
    label: 'Negro',
    bgApp: '#131418',
    bgSurface: '#1C1E24',
    bgElevated: '#242730',
    accent: '#3B404E',
    accentSoft: 'rgba(59, 64, 78, 0.45)',
    swatchPreview: '#18191E',
    isDark: true,
  },
];

export interface DividerSwatch {
  id: DividerColorId;
  label: string;
  color: string;
}

export const DIVIDER_SWATCHES: DividerSwatch[] = [
  { id: 'suave', label: 'Auto', color: 'rgba(128, 120, 128, 0.16)' },
  { id: 'rosa', label: 'Rosa', color: '#F5C4D4' },
  { id: 'sakura', label: 'Sakura', color: '#FAD5E2' },
  { id: 'durazno', label: 'Durazno', color: '#F7CFB4' },
  { id: 'coral', label: 'Coral', color: '#F7C2B4' },
  { id: 'mantequilla', label: 'Mantequilla', color: '#F2E1A0' },
  { id: 'verde', label: 'Menta', color: '#B0E0C4' },
  { id: 'salvia', label: 'Salvia', color: '#C2D7C7' },
  { id: 'agua', label: 'Agua', color: '#AEE6E1' },
  { id: 'celeste', label: 'Celeste', color: '#B4DDF8' },
  { id: 'azul', label: 'Cielo', color: '#BCCBF8' },
  { id: 'lavanda', label: 'Lavanda', color: '#CBCBF9' },
  { id: 'lila', label: 'Lila', color: '#D4C2F8' },
  { id: 'orquidea', label: 'Orquídea', color: '#E6C2EB' },
  { id: 'crema', label: 'Crema', color: '#E8D5B5' },
  { id: 'latte', label: 'Latte', color: '#DFCCB9' },
  { id: 'avellana', label: 'Avellana', color: '#CBB099' },
  { id: 'cacao', label: 'Cacao', color: '#5A4134' },
  { id: 'blanco', label: 'Blanco', color: '#FFFFFF' },
  { id: 'negro', label: 'Negro', color: '#27272A' },
];

export interface TextSwatch {
  id: TextColorId;
  label: string;
  hex: string;
  mutedHex: string;
}

export const TEXT_SWATCHES: TextSwatch[] = [
  {
    id: 'negro',
    label: 'Negro',
    hex: '#1C1B1F',
    mutedHex: 'rgba(28, 27, 31, 0.62)',
  },
  {
    id: 'blanco',
    label: 'Blanco',
    hex: '#FFFFFF',
    mutedHex: 'rgba(255, 255, 255, 0.72)',
  },
  {
    id: 'crema',
    label: 'Crema',
    hex: '#FAF3E6',
    mutedHex: 'rgba(250, 243, 230, 0.74)',
  },
  {
    id: 'gris',
    label: 'Grafito',
    hex: '#52525B',
    mutedHex: 'rgba(82, 82, 91, 0.70)',
  },
  {
    id: 'marron',
    label: 'Marrón',
    hex: '#6B4423',
    mutedHex: 'rgba(107, 68, 35, 0.68)',
  },
  {
    id: 'cafe',
    label: 'Espresso',
    hex: '#432918',
    mutedHex: 'rgba(67, 41, 24, 0.70)',
  },
  {
    id: 'verde',
    label: 'Verde',
    hex: '#256D46',
    mutedHex: 'rgba(37, 109, 70, 0.68)',
  },
  {
    id: 'amarillo',
    label: 'Amarillo',
    hex: '#EAB308',
    mutedHex: 'rgba(234, 179, 8, 0.75)',
  },
  {
    id: 'dorado',
    label: 'Dorado',
    hex: '#B47B00',
    mutedHex: 'rgba(180, 123, 0, 0.74)',
  },
  {
    id: 'rosa',
    label: 'Rosa',
    hex: '#B84A6F',
    mutedHex: 'rgba(184, 74, 111, 0.72)',
  },
  {
    id: 'coral',
    label: 'Coral',
    hex: '#B85242',
    mutedHex: 'rgba(184, 82, 66, 0.72)',
  },
  {
    id: 'azul',
    label: 'Azul',
    hex: '#2B4C7E',
    mutedHex: 'rgba(43, 76, 126, 0.72)',
  },
  {
    id: 'morado',
    label: 'Ciruela',
    hex: '#5B3A7A',
    mutedHex: 'rgba(91, 58, 122, 0.72)',
  },
];

export interface SongBarSwatch {
  id: SongBarColorId;
  label: string;
  color: string;
  isLight?: boolean;
}

export const SONG_BAR_SWATCHES: SongBarSwatch[] = [
  { id: 'auto', label: 'Auto', color: 'auto' },
  { id: 'rosa_chicle', label: 'Rosa Chicle', color: '#EC7FA9' },
  { id: 'sakura', label: 'Sakura', color: '#F4A7C3', isLight: true },
  { id: 'frambuesa', label: 'Frambuesa', color: '#D95B86' },
  { id: 'coral', label: 'Coral', color: '#F08A75' },
  { id: 'durazno', label: 'Durazno', color: '#F4AA7E', isLight: true },
  { id: 'miel', label: 'Miel', color: '#E8B84B', isLight: true },
  { id: 'limon', label: 'Limón', color: '#BECF4E', isLight: true },
  { id: 'menta', label: 'Menta', color: '#6DC497' },
  { id: 'esmeralda', label: 'Esmeralda', color: '#2E8B57' },
  { id: 'turquesa', label: 'Turquesa', color: '#52B7B0' },
  { id: 'celeste', label: 'Celeste', color: '#6FB9EC' },
  { id: 'cielo', label: 'Azul Cielo', color: '#6D8EE6' },
  { id: 'indigo', label: 'Índigo', color: '#5A67C8' },
  { id: 'lavanda', label: 'Lavanda', color: '#9A92EC' },
  { id: 'lila', label: 'Lila', color: '#B589EB' },
  { id: 'orquidea', label: 'Orquídea', color: '#D17BD6' },
  { id: 'caramelo', label: 'Caramelo', color: '#B67B52' },
  { id: 'chocolate', label: 'Chocolate', color: '#6E4730' },
  { id: 'espresso', label: 'Espresso', color: '#3E271C' },
  { id: 'blanco', label: 'Blanco', color: '#FFFFFF', isLight: true },
  { id: 'negro', label: 'Negro', color: '#1C1B1F' },
];

export const MOOD_AURAS: Record<
  MusicalMood,
  { aura1: string; aura2: string; speedSec: number }
> = {
  serene: {
    aura1: 'rgba(159, 211, 247, 0.34)',
    aura2: 'rgba(157, 217, 183, 0.24)',
    speedSec: 24,
  },
  joyful: {
    aura1: 'rgba(249, 217, 140, 0.34)',
    aura2: 'rgba(246, 183, 167, 0.28)',
    speedSec: 12,
  },
  melancholic: {
    aura1: 'rgba(170, 190, 247, 0.34)',
    aura2: 'rgba(203, 180, 247, 0.28)',
    speedSec: 28,
  },
  energetic: {
    aura1: 'rgba(246, 183, 167, 0.38)',
    aura2: 'rgba(244, 184, 204, 0.32)',
    speedSec: 9,
  },
  romantic: {
    aura1: 'rgba(244, 184, 204, 0.38)',
    aura2: 'rgba(246, 183, 167, 0.26)',
    speedSec: 18,
  },
  dreamy: {
    aura1: 'rgba(203, 180, 247, 0.36)',
    aura2: 'rgba(159, 211, 247, 0.26)',
    speedSec: 22,
  },
};

export const EQ_PRESETS: Record<
  EqPresetId,
  { label: string; bands: [number, number, number, number, number] }
> = {
  flat: { label: 'Plano', bands: [0, 0, 0, 0, 0] },
  pop: { label: 'Pop Suave', bands: [2, 3, 1, 2, 3] },
  acoustic: { label: 'Acústico', bands: [2, 1, 2, 3, 2] },
  bass: { label: 'Graves', bands: [6, 4, 0, -1, 0] },
  vocal: { label: 'Voz Clara', bands: [-2, 1, 4, 3, 1] },
  night: { label: 'Nocturno', bands: [3, 1, -1, 1, -2] },
};

export interface AudioModeProfile {
  id: AudioEngineMode;
  label: string;
  subtitle: string;
  subGain: number;
  cleanGain: number;
  presenceGain: number;
  airGain: number;
  baseWidth: number;
  reverbWet: number;
}

export const AUDIO_MODE_PROFILES: Record<AudioEngineMode, AudioModeProfile> = {
  apple_master: {
    id: 'apple_master',
    label: 'Studio Master',
    subtitle: 'Claridad cristalina, graves profundos y escena estéreo equilibrada',
    subGain: 1.6,
    cleanGain: -1.1,
    presenceGain: 1.8,
    airGain: 2.2,
    baseWidth: 1.18,
    reverbWet: 0.06,
  },
  spatial_3d: {
    id: 'spatial_3d',
    label: 'Espacial 3D',
    subtitle: 'Amplitud envolvente tipo Spatial Audio con aire vocal tridimensional',
    subGain: 1.4,
    cleanGain: -1.3,
    presenceGain: 2.1,
    airGain: 2.6,
    baseWidth: 1.42,
    reverbWet: 0.14,
  },
  studio_hall: {
    id: 'studio_hall',
    label: 'Sala Acústica',
    subtitle: 'Calidez orgánica con reflexiones tempranas de estudio de grabación',
    subGain: 2.0,
    cleanGain: -0.6,
    presenceGain: 1.2,
    airGain: 1.5,
    baseWidth: 1.28,
    reverbWet: 0.2,
  },
  lossless_pure: {
    id: 'lossless_pure',
    label: 'Sin pérdida puro',
    subtitle: 'Señal directa transparente sin coloración espacial (Bit-Perfect)',
    subGain: 0,
    cleanGain: 0,
    presenceGain: 0,
    airGain: 0,
    baseWidth: 1.0,
    reverbWet: 0,
  },
};

export interface SongBarAnimationPreset {
  id: SongBarAnimationId;
  emoji: string;
  label: string;
  description: string;
  outOfLine?: boolean;
}

export const SONG_BAR_OUT_OF_LINE_ANIMATIONS: SongBarAnimationPreset[] = [
  { id: 'out_float_wave', emoji: '', label: 'Onda flotante', description: 'Curva sin emoji que sale arriba y abajo', outOfLine: true },
  { id: 'out_elastic_arc', emoji: '', label: 'Arco elástico', description: 'Lazo elevado sobre la línea', outOfLine: true },
  { id: 'out_pulse_bars', emoji: '', label: 'Barras libres', description: 'Columnas rítmicas fuera del riel', outOfLine: true },
  { id: 'out_ribbon_loop', emoji: '', label: 'Doble serpentina', description: 'Ondas cruzadas fuera de la barra', outOfLine: true },
  { id: 'out_liquid_crest', emoji: '', label: 'Cresta líquida', description: 'Ola suave subiendo sobre el borde', outOfLine: true },
  { id: 'out_bounce_line', emoji: '', label: 'Línea viva', description: 'Toda la barra ondula fuera de eje', outOfLine: true },
  { id: 'out_comet_orb', emoji: '', label: 'Orbe orbital', description: 'Esfera brillante sin emoji flotando', outOfLine: true },
  { id: 'out_heartbeat_ecg', emoji: '', label: 'Pulso melódico', description: 'Trazo armónico sobresaliente', outOfLine: true },
];

export const SONG_BAR_ANIMATIONS: SongBarAnimationPreset[] = [
  { id: 'wave_ribbon', emoji: '🌊', label: 'Ola sedosa', description: 'Onda marina real en movimiento' },
  { id: 'double_wave', emoji: '🫧', label: 'Doble marea', description: 'Dos olas cruzándose suaves' },
  { id: 'sound_eq_wave', emoji: '〰️', label: 'Onda musical', description: 'Curva rítmica deslizante' },
  { id: 'milk_splash', emoji: '🥛', label: 'Ola de leche', description: 'Espuma cremosa ondulante' },
  { id: 'pistachio_cream', emoji: '🍵', label: 'Crema pistacho', description: 'Remolino matcha ondulado' },
  { id: 'shimmer_glow', emoji: '✨', label: 'Brillo deslizante', description: 'Destello perlado suave' },
  { id: 'rainbow_candy', emoji: '🍬', label: 'Arcoíris pastel', description: 'Degradado dulce fluido' },
  { id: 'heart_pulse', emoji: '💕', label: 'Latido corazón', description: 'Corazoncito que late' },
  { id: 'floating_sparkles', emoji: '🌟', label: 'Estrellitas', description: 'Chispas brillando' },
  { id: 'candy_stripes', emoji: '🍭', label: 'Caramelo', description: 'Rayitas diagonales cute' },
  { id: 'bouncing_note', emoji: '🎵', label: 'Nota saltarina', description: 'Nota musical saltando' },
  { id: 'sakura_petals', emoji: '🌸', label: 'Pétalos sakura', description: 'Flor sakura deslizándose' },
  { id: 'cat_paw', emoji: '🐾', label: 'Huellita cute', description: 'Patita tierna avanzando' },
  { id: 'bubble_stream', emoji: '🫧', label: 'Burbujitas', description: 'Burbujas flotando' },
  { id: 'comet_trail', emoji: '☄️', label: 'Cometa brillante', description: 'Punta luminosa de estrella' },
  { id: 'jelly_ripple', emoji: '🍮', label: 'Gelatina suave', description: 'Brillo elástico cremoso' },
  { id: 'starlight_stream', emoji: '🌠', label: 'Lluvia estelar', description: 'Estrellas fugaces' },
  { id: 'butterfly_glide', emoji: '🦋', label: 'Mariposita', description: 'Mariposa volando al frente' },
  { id: 'bunny_hop', emoji: '🐰', label: 'Conejito', description: 'Conejito dando saltitos' },
  { id: 'none', emoji: '➖', label: 'Clásica fija', description: 'Barra lisa sin movimiento' },
];

export interface TrackCardStylePreset {
  id: TrackCardStyleId;
  emoji: string;
  label: string;
  description: string;
  defaultDecor: string;
  is3D?: boolean;
}

export const TRACK_CARD_STYLES: TrackCardStylePreset[] = [
  { id: 'classic_row', emoji: '📋', label: 'Lista clásica', description: 'Filas limpias con separadores', defaultDecor: '' },
  { id: 'soft_pill', emoji: '☁️', label: 'Cápsula suave', description: 'Tarjetas separadas redondeadas', defaultDecor: '✨' },
  { id: 'bevel_3d', emoji: '🧊', label: 'Relieve 3D', description: 'Borde grueso 3D con brillo alto', defaultDecor: '✨', is3D: true },
  { id: 'clay_puff', emoji: '🫧', label: 'Puff 3D', description: 'Acolchado 3D suave tipo nube', defaultDecor: '🤍', is3D: true },
  { id: 'glass_prism_3d', emoji: '💎', label: 'Prisma 3D', description: 'Cristal biselado tridimensional', defaultDecor: '💎', is3D: true },
  { id: 'acrylic_block', emoji: '🪞', label: 'Bloque acrílico 3D', description: 'Capa profunda con reflejo superior', defaultDecor: '✨', is3D: true },
  { id: 'plush_cushion', emoji: '🧸', label: 'Cojín 3D', description: 'Relieve mullido con luz interior', defaultDecor: '🎀', is3D: true },
  { id: 'vinyl_box_3d', emoji: '💿', label: 'Caja vinilo 3D', description: 'Estuche rígido con base profunda', defaultDecor: '💿', is3D: true },
  { id: 'piano_key_3d', emoji: '🎹', label: 'Tecla piano 3D', description: 'Bisel marcado y base elevada', defaultDecor: '🎵', is3D: true },
  { id: 'macaron_3d', emoji: '🧁', label: 'Macaron 3D', description: 'Doble capa dulce con volumen', defaultDecor: '🌸', is3D: true },
  { id: 'polaroid_tilt_3d', emoji: '🖼️', label: 'Polaroid 3D', description: 'Marco 3D con sombra profunda', defaultDecor: '📷', is3D: true },
  { id: 'jewelry_case_3d', emoji: '👑', label: 'Estuche joyero 3D', description: 'Borde perla elevado en 3D', defaultDecor: '🤍', is3D: true },
  { id: 'cloud_scallop', emoji: '☁️', label: 'Nube esponjosa', description: 'Contorno suave tipo nube', defaultDecor: '☁️' },
  { id: 'lace_crochet', emoji: '🧁', label: 'Encaje pastel', description: 'Borde punteado tipo blonda', defaultDecor: '🤍' },
  { id: 'ticket_stub', emoji: '🎟️', label: 'Ticket musical', description: 'Borde punteado con muescas', defaultDecor: '♪' },
  { id: 'ribbon_card', emoji: '🎀', label: 'Listón coquette', description: 'Doble borde con moñito', defaultDecor: '🎀' },
  { id: 'notebook_lined', emoji: '📝', label: 'Hoja de libreta', description: 'Renglones y margen cute', defaultDecor: '✏️' },
  { id: 'polaroid_strip', emoji: '📸', label: 'Foto Polaroid', description: 'Marco crema tipo fotografía', defaultDecor: '📷' },
  { id: 'love_note', emoji: '💌', label: 'Cartita sellada', description: 'Sobre dulce con corazoncito', defaultDecor: '💌' },
  { id: 'chocolate_wafer', emoji: '🍫', label: 'Barra chocolate', description: 'Tono cacao con borde cálido', defaultDecor: '🤎' },
  { id: 'espresso_noir', emoji: '🖤', label: 'Terciopelo negro', description: 'Oscuro chic con filo perlado', defaultDecor: '🖤' },
  { id: 'pistachio_crepe', emoji: '🥬', label: 'Pistacho crema', description: 'Verde pistacho suave', defaultDecor: '🌿' },
  { id: 'strawberry_milk', emoji: '🍓', label: 'Leche de fresa', description: 'Base cremosa rosada', defaultDecor: '🍓' },
  { id: 'matcha_wave', emoji: '🍵', label: 'Ola matcha', description: 'Tono té verde con relieve', defaultDecor: '🍵' },
  { id: 'kitty_frame', emoji: '🐱', label: 'Orejitas kawaii', description: 'Esquinas tiernas de gatito', defaultDecor: '🐾' },
  { id: 'vinyl_sleeve', emoji: '💿', label: 'Funda vinilo', description: 'Lomo de disco coleccionable', defaultDecor: '💿' },
  { id: 'crystal_glass', emoji: '💎', label: 'Cristal glaseado', description: 'Brillo suave translúcido', defaultDecor: '💎' },
  { id: 'double_stitch', emoji: '🧵', label: 'Costura kawaii', description: 'Pespunte interior bonito', defaultDecor: '🌷' },
  { id: 'starry_dream', emoji: '🌟', label: 'Sueño estelar', description: 'Degradado mágico brillante', defaultDecor: '🌟' },
  { id: 'washi_tape', emoji: '🏷️', label: 'Cinta Washi', description: 'Decorada con cintita pastel', defaultDecor: '🌸' },
  { id: 'petal_corner', emoji: '🌸', label: 'Pétalo curvo', description: 'Esquinas asimétricas suaves', defaultDecor: '🌸' },
  { id: 'retro_cassette', emoji: '📼', label: 'Casete retro', description: 'Etiqueta musical vintage', defaultDecor: '📼' },
];

export interface TrackCardColorPreset {
  id: TrackCardColorId;
  label: string;
  bg: string;
  activeBg?: string;
  text: string;
  muted: string;
  border: string;
  preview: string;
}

export const TRACK_CARD_COLOR_PRESETS: TrackCardColorPreset[] = [
  { id: 'auto', label: 'Del diseño', bg: 'auto', text: 'auto', muted: 'auto', border: 'auto', preview: 'var(--bg-elevated)' },
  { id: 'blanco', label: 'Blanco', bg: '#FFFFFF', activeBg: '#F4F4F7', text: '#1C1B1F', muted: 'rgba(28,27,31,0.64)', border: '#E4E4EA', preview: '#FFFFFF' },
  { id: 'negro', label: 'Negro', bg: '#151519', activeBg: '#23232A', text: '#F8F7FA', muted: 'rgba(248,247,250,0.68)', border: '#383844', preview: '#151519' },
  { id: 'crema', label: 'Crema', bg: '#FFF9EF', activeBg: '#F8EEDC', text: '#423326', muted: 'rgba(66,51,38,0.68)', border: '#E5D3BA', preview: '#FFF3DF' },
  { id: 'rosa_pastel', label: 'Rosa pastel', bg: '#FFF0F5', activeBg: '#FCE0EC', text: '#5A2A3F', muted: 'rgba(90,42,63,0.7)', border: '#F4B8CC', preview: '#FAD7E4' },
  { id: 'lila_nube', label: 'Lila nube', bg: '#F6F0FF', activeBg: '#EAE0FE', text: '#3E2E5C', muted: 'rgba(62,46,92,0.7)', border: '#CBB4F7', preview: '#E5D6FC' },
  { id: 'pistacho', label: 'Pistacho', bg: '#EFF9E8', activeBg: '#DFF1D3', text: '#264422', muted: 'rgba(38,68,34,0.7)', border: '#A7D28E', preview: '#D5ECC4' },
  { id: 'chocolate', label: 'Chocolate', bg: '#4E3427', activeBg: '#5F4132', text: '#FFF3E8', muted: 'rgba(255,243,232,0.74)', border: '#8D6752', preview: '#4E3427' },
  { id: 'celeste', label: 'Celeste', bg: '#EEF7FF', activeBg: '#DCEEFF', text: '#1D3E5E', muted: 'rgba(29,62,94,0.7)', border: '#9FD3F7', preview: '#CDE8FD' },
  { id: 'durazno', label: 'Durazno', bg: '#FFF3E8', activeBg: '#FFE4CE', text: '#5B3420', muted: 'rgba(91,52,32,0.7)', border: '#F4BC98', preview: '#FCDDC4' },
  { id: 'menta', label: 'Menta', bg: '#EDFAF3', activeBg: '#D8F4E5', text: '#1C4B36', muted: 'rgba(28,75,54,0.7)', border: '#9AD9B8', preview: '#C6EED8' },
  { id: 'vino', label: 'Vino chic', bg: '#3E1C28', activeBg: '#512535', text: '#FFF0F4', muted: 'rgba(255,240,244,0.72)', border: '#8B4A62', preview: '#3E1C28' },
  { id: 'custom', label: 'Tu color', bg: 'custom', text: 'custom', muted: 'custom', border: 'custom', preview: 'linear-gradient(135deg,#F4B8CC,#9FD3F7,#B8DDA1)' },
];

export const TRACK_CARD_DECORS: Array<{
  id: TrackCardDecorId;
  emoji: string;
  label: string;
}> = [
  { id: 'auto', emoji: '✨', label: 'Del diseño' },
  { id: 'bows', emoji: '🎀', label: 'Moñitos' },
  { id: 'hearts', emoji: '💕', label: 'Corazones' },
  { id: 'sakura', emoji: '🌸', label: 'Sakura' },
  { id: 'stars', emoji: '🌟', label: 'Estrellas' },
  { id: 'notes', emoji: '🎵', label: 'Notas' },
  { id: 'paws', emoji: '🐾', label: 'Huellitas' },
  { id: 'pearls', emoji: '🤍', label: 'Perlas' },
  { id: 'none', emoji: '➖', label: 'Sin adorno' },
];

export interface ButtonThemePreset {
  id: ButtonThemeId;
  label: string;
  description: string;
  previewBg: string;
  previewBorder: string;
  previewText: string;
  previewRadius: string;
  previewShadow: string;
}

export const BUTTON_THEMES: ButtonThemePreset[] = [
  { id: 'soft_pill', label: 'Cápsula suave', description: 'Bordes redondos sedosos', previewBg: 'var(--bg-surface)', previewBorder: '1.5px solid var(--divider-color)', previewText: 'var(--text-main)', previewRadius: '9999px', previewShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  { id: 'cloud_puff_3d', label: 'Nube 3D', description: 'Almohadilla mullida en 3D', previewBg: 'var(--bg-elevated)', previewBorder: '1.5px solid var(--accent-color)', previewText: 'var(--text-main)', previewRadius: '18px', previewShadow: '0 4px 0 var(--accent-color), inset 0 2px 3px rgba(255,255,255,0.85)' },
  { id: 'candy_gloss', label: 'Caramelo brillante', description: 'Brillo superior cristalino', previewBg: 'linear-gradient(180deg, var(--accent-color), var(--accent-soft))', previewBorder: '1.5px solid rgba(255,255,255,0.7)', previewText: '#1C1B1F', previewRadius: '16px', previewShadow: '0 3px 10px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8)' },
  { id: 'keycap_3d', label: 'Tecla cremosa 3D', description: 'Estilo teclado mecánico', previewBg: 'var(--bg-elevated)', previewBorder: '1.5px solid var(--divider-color)', previewText: 'var(--text-main)', previewRadius: '14px', previewShadow: '0 4px 0 var(--divider-color), inset 0 -2px 0 rgba(0,0,0,0.06)' },
  { id: 'velvet_black', label: 'Terciopelo negro', description: 'Botones oscuros elegantes', previewBg: '#18181D', previewBorder: '1.5px solid #3D3D48', previewText: '#FFFFFF', previewRadius: '14px', previewShadow: '0 3px 0 #0A0A0D' },
  { id: 'porcelain_white', label: 'Porcelana blanca', description: 'Blanco puro con borde fino', previewBg: '#FFFFFF', previewBorder: '1.5px solid #E2E2EA', previewText: '#1C1B1F', previewRadius: '16px', previewShadow: '0 3px 8px rgba(0,0,0,0.06)' },
  { id: 'lace_stitch', label: 'Costura encaje', description: 'Pespunte delicado alrededor', previewBg: 'var(--bg-surface)', previewBorder: '2px dotted var(--accent-color)', previewText: 'var(--text-main)', previewRadius: '18px', previewShadow: '0 2px 6px rgba(0,0,0,0.05)' },
  { id: 'pastel_bevel', label: 'Bisel pastel 3D', description: 'Borde grueso en relieve', previewBg: 'var(--accent-soft)', previewBorder: '2px solid var(--accent-color)', previewText: 'var(--text-main)', previewRadius: '15px', previewShadow: '0 4px 0 var(--accent-color)' },
  { id: 'acrylic_glass', label: 'Acrílico translúcido', description: 'Efecto cristal esmerilado', previewBg: 'rgba(255,255,255,0.58)', previewBorder: '1.5px solid rgba(255,255,255,0.85)', previewText: 'var(--text-main)', previewRadius: '16px', previewShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  { id: 'mochi_squish', label: 'Mochi elástico', description: 'Redondito y tierno al toque', previewBg: '#FFF5F8', previewBorder: '2px solid #F4B8CC', previewText: '#5A2A3F', previewRadius: '9999px', previewShadow: '0 4px 0 #F4B8CC' },
  { id: 'pistachio_macaron', label: 'Macaron pistacho', description: 'Verde pistacho con relieve', previewBg: '#EAF6E2', previewBorder: '1.5px solid #9ECE84', previewText: '#264422', previewRadius: '9999px', previewShadow: '0 4px 0 #9ECE84' },
  { id: 'cocoa_wafer', label: 'Oblea cacao', description: 'Tono marrón tibio 3D', previewBg: '#5A3D2F', previewBorder: '1.5px solid #9B745D', previewText: '#FFF4EA', previewRadius: '14px', previewShadow: '0 4px 0 #382319' },
  { id: 'pearl_rim', label: 'Marco perlado', description: 'Doble halo fino nacarado', previewBg: '#FFFDFB', previewBorder: '2px solid #E8DFD5', previewText: '#3E332B', previewRadius: '20px', previewShadow: '0 0 0 2px #FFFFFF, 0 4px 10px rgba(0,0,0,0.07)' },
  { id: 'petal_skew', label: 'Pétalo asimétrico', description: 'Esquinas curvas distintas', previewBg: 'var(--accent-soft)', previewBorder: '1.5px solid var(--accent-color)', previewText: 'var(--text-main)', previewRadius: '22px 8px 22px 8px', previewShadow: '0 3px 8px rgba(0,0,0,0.06)' },
  { id: 'double_border', label: 'Doble marco chic', description: 'Contorno doble estilizado', previewBg: 'var(--bg-elevated)', previewBorder: '3px double var(--accent-color)', previewText: 'var(--text-main)', previewRadius: '14px', previewShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  { id: 'ribbon_tab', label: 'Etiqueta listón', description: 'Borde lateral acentuado', previewBg: 'var(--bg-elevated)', previewBorder: '1.5px solid var(--divider-color)', previewText: 'var(--text-main)', previewRadius: '12px', previewShadow: '-4px 0 0 var(--accent-color), 0 2px 6px rgba(0,0,0,0.05)' },
  { id: 'neon_soft', label: 'Aura luminosa', description: 'Resplandor pastel alrededor', previewBg: 'var(--bg-elevated)', previewBorder: '1.5px solid var(--accent-color)', previewText: 'var(--text-main)', previewRadius: '16px', previewShadow: '0 0 12px var(--accent-soft)' },
  { id: 'champagne_gold', label: 'Champán dorado', description: 'Crema con filo dorado', previewBg: '#FCF5E5', previewBorder: '1.5px solid #D4A857', previewText: '#533B14', previewRadius: '15px', previewShadow: '0 3px 0 #D4A857' },
  { id: 'sakura_frost', label: 'Sakura helado', description: 'Rosa translúcido escarchado', previewBg: '#FFEAF2', previewBorder: '1.5px solid #F3A9C3', previewText: '#682C45', previewRadius: '18px', previewShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), 0 2px 6px rgba(243,169,195,0.35)' },
  { id: 'mint_gel', label: 'Gel de menta', description: 'Frescura translúcida en 3D', previewBg: '#E4F8EE', previewBorder: '1.5px solid #7ECBA3', previewText: '#194934', previewRadius: '18px', previewShadow: '0 4px 0 #7ECBA3' },
  { id: 'minimal_ink', label: 'Tinta minimal', description: 'Líneas nítidas y contraste alto', previewBg: 'transparent', previewBorder: '1.5px solid var(--text-main)', previewText: 'var(--text-main)', previewRadius: '10px', previewShadow: 'none' },
  { id: 'marshmallow_elevated', label: 'Bombón elevado', description: 'Sombra doble acolchada', previewBg: 'var(--bg-elevated)', previewBorder: '1.5px solid rgba(255,255,255,0.9)', previewText: 'var(--text-main)', previewRadius: '20px', previewShadow: '0 5px 12px rgba(0,0,0,0.09), 0 2px 0 var(--divider-color)' },
];

export interface PlaybackButton3DPreset {
  id: PlaybackButton3DStyleId;
  label: string;
  description: string;
}

export const PLAYBACK_BUTTON_3D_STYLES: PlaybackButton3DPreset[] = [
  { id: 'cushion_3d', label: 'Cojín mullido 3D', description: 'Almohadilla suave con borde acolchado' },
  { id: 'macaron_3d', label: 'Macaron doble capa', description: 'Relleno central y base dulce en relieve' },
  { id: 'mechanical_key_3d', label: 'Tecla mecánica 3D', description: 'Botón biselado con caída profunda' },
  { id: 'crystal_jewel_3d', label: 'Gema cristal 3D', description: 'Brillo superior acrílico y facetado' },
  { id: 'pearl_cabochon_3d', label: 'Perla nacarada', description: 'Esfera con reflejo perlado y aro fino' },
  { id: 'velvet_puck_3d', label: 'Disco terciopelo 3D', description: 'Cilindro mate con surco interior' },
  { id: 'acrylic_cube_3d', label: 'Bloque acrílico 3D', description: 'Cubo translúcido con canto grueso' },
  { id: 'vinyl_knob_3d', label: 'Perilla Hi-Fi', description: 'Dial metálico con borde estriado' },
  { id: 'chrome_dome_3d', label: 'Domo satinado 3D', description: 'Reflejo metálico curvo y base firme' },
  { id: 'porcelain_sculpt_3d', label: 'Porcelana esculpida', description: 'Cerámica brillante con sombra suave' },
  { id: 'marshmallow_3d', label: 'Bombón elevado 3D', description: 'Volumen tierno con luz en el tope' },
  { id: 'heart_locket_3d', label: 'Relicario biselado', description: 'Doble marco joya con profundidad' },
  { id: 'jelly_drop_3d', label: 'Gota gelatina 3D', description: 'Resina jugosa con destello curvo' },
  { id: 'wafer_biscuit_3d', label: 'Galleta relieve 3D', description: 'Borde pespuntado con base tostada' },
  { id: 'clover_petal_3d', label: 'Pétalo curvo 3D', description: 'Esquinas asimétricas elevadas' },
  { id: 'tape_deck_3d', label: 'Tecla deck retro', description: 'Botón inclinado de equipo analógico' },
  { id: 'diamond_cut_3d', label: 'Corte diamante 3D', description: 'Bisel marcado con facetas brillantes' },
  { id: 'orb_levitate_3d', label: 'Orbe flotante 3D', description: 'Esfera suspendida con aura abajo' },
];

export interface PlaybackButtonColorPreset {
  id: PlaybackButtonColorId;
  label: string;
  playBg: string;
  navBg: string;
  playIcon: string;
  navIcon: string;
  rim: string;
}

export const PLAYBACK_BUTTON_COLOR_PRESETS: PlaybackButtonColorPreset[] = [
  { id: 'auto', label: 'Del tema', playBg: 'auto', navBg: 'auto', playIcon: 'auto', navIcon: 'auto', rim: 'auto' },
  { id: 'porcelain_sakura', label: 'Sakura & Blanco', playBg: '#F4A6C1', navBg: '#FFFFFF', playIcon: '#2B1620', navIcon: '#3D2531', rim: '#CF7A99' },
  { id: 'noir_velvet', label: 'Negro & Oro', playBg: '#191920', navBg: '#2A2A34', playIcon: '#F5D596', navIcon: '#F4F4F8', rim: '#09090D' },
  { id: 'pure_white', label: 'Blanco puro', playBg: '#FFFFFF', navBg: '#F4F4F8', playIcon: '#1C1B1F', navIcon: '#1C1B1F', rim: '#CFCFD9' },
  { id: 'chocolate_caramel', label: 'Cacao & Latte', playBg: '#5B3826', navBg: '#F2E4D5', playIcon: '#FFF5EB', navIcon: '#4A2D1D', rim: '#361E13' },
  { id: 'pistachio_cream', label: 'Pistacho crema', playBg: '#9BD27E', navBg: '#F4FBEF', playIcon: '#1E3C19', navIcon: '#2B4E24', rim: '#6CA74E' },
  { id: 'lavender_pearl', label: 'Lavanda perla', playBg: '#C2AAF9', navBg: '#F7F3FF', playIcon: '#2B1D4C', navIcon: '#412D6B', rim: '#9174DD' },
  { id: 'strawberry_milk', label: 'Fresa brillante', playBg: '#E975A0', navBg: '#FFF1F6', playIcon: '#FFFFFF', navIcon: '#872A4D', rim: '#BE4D77' },
  { id: 'champagne_rose', label: 'Champán dorado', playBg: '#E6C285', navBg: '#FFF9EE', playIcon: '#3B290E', navIcon: '#5C431C', rim: '#B68C49' },
  { id: 'sky_ice', label: 'Celeste hielo', playBg: '#7CC3F7', navBg: '#EFF8FF', playIcon: '#10314C', navIcon: '#1D496E', rim: '#4B99D6' },
  { id: 'cherry_noir', label: 'Cereza vino', playBg: '#75203A', navBg: '#FCEEF3', playIcon: '#FFF4F7', navIcon: '#5B192E', rim: '#4A1022' },
  { id: 'custom', label: 'Tu color', playBg: 'custom', navBg: 'custom', playIcon: 'custom', navIcon: 'custom', rim: 'custom' },
];

export interface NowPlayingVisualOption {
  id: NowPlayingVisualId;
  label: string;
  description: string;
  category: 'disc' | 'retro' | 'light';
}

export const NOW_PLAYING_VISUAL_OPTIONS: NowPlayingVisualOption[] = [
  { id: 'cover_classic', label: 'Estuche portada 3D', description: 'Carátula en bloque 3D con brillo acrílico', category: 'light' },
  { id: 'vinyl_disc', label: 'Vinilo realista 3D', description: 'Surcos brillantes, luz fija y sello central', category: 'disc' },
  { id: 'vinyl_color_only', label: 'Solo vinilo a color', description: 'Únicamente vinilo 3D en tus 4 colores', category: 'disc' },
  { id: 'vinyl_transparent', label: 'Vinilo cristal 3D', description: 'Edición translúcida con reflejo prismático', category: 'disc' },
  { id: 'vinyl_gatefold_3d', label: 'Funda + vinilo 3D', description: 'Álbum abierto con vinilo saliendo y girando', category: 'disc' },
  { id: 'turntable_arm', label: 'Tocadiscos Hi-Fi 3D', description: 'Plato elevado con brazo metálico articulado', category: 'disc' },
  { id: 'cd_holographic', label: 'CD holográfico 3D', description: 'Arcoíris láser sobre disco con centro cristal', category: 'disc' },
  { id: 'jewel_case_3d', label: 'Estuche CD cristal 3D', description: 'Caja transparente con lomo acanalado real', category: 'disc' },
  { id: 'cassette_deck', label: 'Casete retro 3D', description: 'Carcasa con tornillos y cinta en movimiento', category: 'retro' },
  { id: 'reel_to_reel', label: 'Carrete de cinta 3D', description: 'Consola metálica con dos bobinas giratorias', category: 'retro' },
  { id: 'gramophone_gold', label: 'Gramófono antiguo 3D', description: 'Base tallada y bocina acústica en relieve', category: 'disc' },
  { id: 'music_box', label: 'Caja de música 3D', description: 'Estuche abierto con cilindro y llave lateral', category: 'retro' },
  { id: 'pocket_player', label: 'Reproductor classic 3D', description: 'Consola con cuerpo profundo y rueda táctil', category: 'retro' },
  { id: 'boombox_pastel_3d', label: 'Mini estéreo 3D', description: 'Estéreo portátil con bocinas y asa superior', category: 'retro' },
  { id: 'polaroid_float', label: 'Polaroid 3D flotante', description: 'Cartulina gruesa inclinada con reflejo suave', category: 'light' },
  { id: 'heart_locket_3d', label: 'Relicario corazón 3D', description: 'Medallón biselado con perlas y tapa joya', category: 'light' },
  { id: 'snow_globe_3d', label: 'Esfera de cristal 3D', description: 'Domo de vidrio brillante sobre base grabada', category: 'light' },
  { id: 'prism_crystal_3d', label: 'Prisma acrílico 3D', description: 'Bloque grueso de cristal con pernos esquineros', category: 'light' },
  { id: 'perfume_stage_3d', label: 'Frasco musical 3D', description: 'Botella de cristal tallado con tapa facetada', category: 'light' },
  { id: 'sakura_mirror_3d', label: 'Espejo compacto 3D', description: 'Estuche coquette abierto con aro perlado', category: 'light' },
  { id: 'aura_orb', label: 'Orbe cristal 3D', description: 'Esfera brillante con anillo orbital en perspectiva', category: 'light' },
  { id: 'equalizer_stage', label: 'Consola EQ 3D', description: 'Barras tridimensionales dentro de marco biselado', category: 'light' },
  { id: 'harmonic_waves', label: 'Ondas en relieve 3D', description: 'Aros luminosos inclinados en profundidad', category: 'light' },
];

export const NOW_PLAYING_COLOR_PRESETS: Array<{
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  detail: string;
}> = [
  { label: 'Negro & Oro', primary: '#18181D', secondary: '#FFF7EA', accent: '#E5C185', detail: '#2E2A36' },
  { label: 'Blanco Perla', primary: '#F9F8FB', secondary: '#FFF0F5', accent: '#E5B2C5', detail: '#D7D2DC' },
  { label: 'Sakura & Plata', primary: '#F4A6C1', secondary: '#FFF5F9', accent: '#E2E8F0', detail: '#9C4967' },
  { label: 'Porcelana Noir', primary: '#FFFFFF', secondary: '#191920', accent: '#D8B470', detail: '#343440' },
  { label: 'Pistacho Crema', primary: '#9ED282', secondary: '#F4FBEF', accent: '#E4C889', detail: '#3B5E31' },
  { label: 'Chocolate & Oro', primary: '#4D3225', secondary: '#F5E6D6', accent: '#DDA85E', detail: '#2C1B13' },
  { label: 'Lavanda Real', primary: '#BEA4F7', secondary: '#F6F1FF', accent: '#F3C7DF', detail: '#4E397E' },
  { label: 'Celeste Cristal', primary: '#8BC9FA', secondary: '#F0F9FF', accent: '#FFFFFF', detail: '#2C5C84' },
  { label: 'Vino & Marfil', primary: '#6E233C', secondary: '#FBF3EC', accent: '#E6BD80', detail: '#3D1020' },
  { label: 'Durazno & Rosa', primary: '#F5AE8D', secondary: '#FFF5EE', accent: '#F393B3', detail: '#7E4530' },
  { label: 'Menta Hielo', primary: '#7ED7B1', secondary: '#EEFAF5', accent: '#F8DF9D', detail: '#215B44' },
  { label: 'Cuarzo Rosa', primary: '#E89EB6', secondary: '#FDF6F8', accent: '#D6A468', detail: '#6D3C4E' },
];

export const DEFAULT_AVATAR_URL = '/src/assets/images/cute_avatar_default_1794973377333.jpg';
export const DEFAULT_BANNER_URL = '/src/assets/images/cute_banner_default_1794973376848.jpg';
export const DEFAULT_COVER_SAKURA = '/src/assets/images/cover_sakura_lo_1794973378033.jpg';
export const DEFAULT_COVER_CLOUD = '/src/assets/images/cover_cloud_melody_1794973378393.jpg';
