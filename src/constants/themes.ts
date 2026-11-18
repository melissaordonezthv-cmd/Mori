import type {
  AudioEngineMode,
  BackgroundColorId,
  DividerColorId,
  EqPresetId,
  MusicalMood,
  SongBarColorId,
  TextColorId,
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

export const DEFAULT_AVATAR_URL = '/src/assets/images/cute_avatar_default_1794973377333.jpg';
export const DEFAULT_BANNER_URL = '/src/assets/images/cute_banner_default_1794973376848.jpg';
export const DEFAULT_COVER_SAKURA = '/src/assets/images/cover_sakura_lo_1794973378033.jpg';
export const DEFAULT_COVER_CLOUD = '/src/assets/images/cover_cloud_melody_1794973378393.jpg';
