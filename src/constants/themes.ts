import type {
  AppTitleColorId,
  AudioEngineMode,
  BackgroundColorId,
  ButtonThemeId,
  DividerColorId,
  EqPresetId,
  MusicCardOuterIconId,
  MusicalMood,
  NowPlayingVisualId,
  PlaybackButton3DStyleId,
  PlaybackButtonColorId,
  ScreenOverlayFilterId,
  SongBarAnimationId,
  SongBarColorId,
  SongTitleColorId,
  SongTitleShapeId,
  TextColorId,
  TrackCardColorId,
  TrackCardDecorId,
  TrackCardStyleId,
  WallpaperFilterId,
  WallpaperMotionId,
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
    id: 'marfil',
    label: 'Marfil',
    bgApp: '#FFFDF7',
    bgSurface: '#F8F3E6',
    bgElevated: '#FFFFFF',
    accent: '#E6DAC0',
    accentSoft: 'rgba(230, 218, 192, 0.32)',
    swatchPreview: '#FAF4E4',
    isDark: false,
  },
  {
    id: 'trigo',
    label: 'Trigo',
    bgApp: '#FBF4E5',
    bgSurface: '#F3E7CE',
    bgElevated: '#FFFDF8',
    accent: '#DFC597',
    accentSoft: 'rgba(223, 197, 151, 0.32)',
    swatchPreview: '#EEDBBE',
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
    id: 'gris_perla',
    label: 'Gris Perla',
    bgApp: '#F3F4F6',
    bgSurface: '#E5E7EB',
    bgElevated: '#FFFFFF',
    accent: '#9CA3AF',
    accentSoft: 'rgba(156, 163, 175, 0.28)',
    swatchPreview: '#D1D5DB',
    isDark: false,
  },
  {
    id: 'gris_pizarra',
    label: 'Gris Pizarra',
    bgApp: '#272932',
    bgSurface: '#323540',
    bgElevated: '#3E4250',
    accent: '#9CA3AF',
    accentSoft: 'rgba(156, 163, 175, 0.25)',
    swatchPreview: '#374151',
    isDark: true,
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
  // Intense & medium-to-dark color variants
  {
    id: 'rosa_intenso',
    label: 'Rosa Intenso',
    bgApp: '#831843',
    bgSurface: '#9D174D',
    bgElevated: '#BE185D',
    accent: '#FBCFE8',
    accentSoft: 'rgba(251, 207, 232, 0.25)',
    swatchPreview: '#DB2777',
    isDark: true,
  },
  {
    id: 'rojo',
    label: 'Rojo Intenso',
    bgApp: '#7F1D1D',
    bgSurface: '#991B1B',
    bgElevated: '#B91C1C',
    accent: '#FCA5A5',
    accentSoft: 'rgba(252, 165, 165, 0.25)',
    swatchPreview: '#DC2626',
    isDark: true,
  },
  {
    id: 'rojo_rubi',
    label: 'Rojo Rubí',
    bgApp: '#660F24',
    bgSurface: '#7D142E',
    bgElevated: '#961A39',
    accent: '#FDA4AF',
    accentSoft: 'rgba(253, 164, 175, 0.24)',
    swatchPreview: '#BE123C',
    isDark: true,
  },
  {
    id: 'cereza',
    label: 'Cereza Oscuro',
    bgApp: '#4C0D1D',
    bgSurface: '#5F1225',
    bgElevated: '#741930',
    accent: '#F9A8D4',
    accentSoft: 'rgba(249, 168, 212, 0.24)',
    swatchPreview: '#881337',
    isDark: true,
  },
  {
    id: 'vino_oscuro',
    label: 'Vino Profundo',
    bgApp: '#2D0A16',
    bgSurface: '#3D1020',
    bgElevated: '#4E172B',
    accent: '#F4B6CA',
    accentSoft: 'rgba(244, 182, 202, 0.24)',
    swatchPreview: '#4B1226',
    isDark: true,
  },
  {
    id: 'coral_oscuro',
    label: 'Coral Profundo',
    bgApp: '#9A3412',
    bgSurface: '#C2410C',
    bgElevated: '#EA580C',
    accent: '#FED7AA',
    accentSoft: 'rgba(254, 215, 170, 0.25)',
    swatchPreview: '#EA580C',
    isDark: true,
  },
  {
    id: 'terracota',
    label: 'Terracota',
    bgApp: '#7C2D12',
    bgSurface: '#9A3412',
    bgElevated: '#B8431B',
    accent: '#FDBA74',
    accentSoft: 'rgba(253, 186, 116, 0.26)',
    swatchPreview: '#C2410C',
    isDark: true,
  },
  {
    id: 'oro_antiguo',
    label: 'Ámbar Oscuro',
    bgApp: '#5C3A0B',
    bgSurface: '#784E12',
    bgElevated: '#926119',
    accent: '#FDE68A',
    accentSoft: 'rgba(253, 230, 138, 0.24)',
    swatchPreview: '#B45309',
    isDark: true,
  },
  {
    id: 'menta_profundo',
    label: 'Verde Bosque',
    bgApp: '#134E4A',
    bgSurface: '#115E59',
    bgElevated: '#0F766E',
    accent: '#99F6E4',
    accentSoft: 'rgba(153, 246, 228, 0.25)',
    swatchPreview: '#0F766E',
    isDark: true,
  },
  {
    id: 'esmeralda_oscuro',
    label: 'Esmeralda Oscuro',
    bgApp: '#064E3B',
    bgSurface: '#065F46',
    bgElevated: '#047857',
    accent: '#6EE7B7',
    accentSoft: 'rgba(110, 231, 183, 0.25)',
    swatchPreview: '#059669',
    isDark: true,
  },
  {
    id: 'azul_pastel_medio',
    label: 'Azul Océano',
    bgApp: '#1E40AF',
    bgSurface: '#1D4ED8',
    bgElevated: '#2563EB',
    accent: '#BFDBFE',
    accentSoft: 'rgba(191, 219, 254, 0.25)',
    swatchPreview: '#3B82F6',
    isDark: true,
  },
  {
    id: 'azul_rey',
    label: 'Azul Rey',
    bgApp: '#1E3A8A',
    bgSurface: '#1D4ED8',
    bgElevated: '#2563EB',
    accent: '#93C5FD',
    accentSoft: 'rgba(147, 197, 253, 0.26)',
    swatchPreview: '#2563EB',
    isDark: true,
  },
  {
    id: 'azul_marino',
    label: 'Azul Marino',
    bgApp: '#0F172A',
    bgSurface: '#172554',
    bgElevated: '#1E293B',
    accent: '#7DD3FC',
    accentSoft: 'rgba(125, 211, 252, 0.25)',
    swatchPreview: '#172554',
    isDark: true,
  },
  {
    id: 'azul_medianoche',
    label: 'Azul Noche',
    bgApp: '#0B1120',
    bgSurface: '#111C33',
    bgElevated: '#172542',
    accent: '#60A5FA',
    accentSoft: 'rgba(96, 165, 250, 0.25)',
    swatchPreview: '#0F1D3A',
    isDark: true,
  },
  {
    id: 'azul_zafiro',
    label: 'Zafiro Oscuro',
    bgApp: '#0C4A6E',
    bgSurface: '#075985',
    bgElevated: '#0369A1',
    accent: '#7DD3FC',
    accentSoft: 'rgba(125, 211, 252, 0.26)',
    swatchPreview: '#0284C7',
    isDark: true,
  },
  {
    id: 'azul_electrico',
    label: 'Azul Cobalto',
    bgApp: '#172554',
    bgSurface: '#1E3A8A',
    bgElevated: '#1E40AF',
    accent: '#BAE6FD',
    accentSoft: 'rgba(186, 230, 253, 0.25)',
    swatchPreview: '#1D4ED8',
    isDark: true,
  },
  {
    id: 'lavanda_oscuro',
    label: 'Lavanda Oscuro',
    bgApp: '#312E81',
    bgSurface: '#3730A3',
    bgElevated: '#4338CA',
    accent: '#C7D2FE',
    accentSoft: 'rgba(199, 210, 254, 0.25)',
    swatchPreview: '#4F46E5',
    isDark: true,
  },
  {
    id: 'morado_intenso',
    label: 'Púrpura Real',
    bgApp: '#3B0764',
    bgSurface: '#4C1D95',
    bgElevated: '#5B21B6',
    accent: '#D8B4FE',
    accentSoft: 'rgba(216, 180, 254, 0.26)',
    swatchPreview: '#6D28D9',
    isDark: true,
  },
  {
    id: 'ciruela_oscuro',
    label: 'Ciruela Oscuro',
    bgApp: '#4A044E',
    bgSurface: '#701A75',
    bgElevated: '#86198F',
    accent: '#F5D0FE',
    accentSoft: 'rgba(245, 208, 254, 0.24)',
    swatchPreview: '#701A75',
    isDark: true,
  },
  {
    id: 'magenta',
    label: 'Fucsia Intenso',
    bgApp: '#701A75',
    bgSurface: '#86198F',
    bgElevated: '#A21CAF',
    accent: '#F5D0FE',
    accentSoft: 'rgba(245, 208, 254, 0.25)',
    swatchPreview: '#C026D3',
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
  { id: 'blanco', label: 'Blanco', color: '#FFFFFF' },
  { id: 'marfil', label: 'Marfil', color: '#F7F1E3' },
  { id: 'crema', label: 'Crema', color: '#E8D5B5' },
  { id: 'latte', label: 'Latte', color: '#DFCCB9' },
  { id: 'avellana', label: 'Avellana', color: '#CBB099' },
  { id: 'caramelo', label: 'Caramelo', color: '#B3855F' },
  { id: 'cacao', label: 'Cacao', color: '#5A4134' },
  { id: 'marron_oscuro', label: 'Espresso', color: '#382419' },
  { id: 'rosa', label: 'Rosa', color: '#F5C4D4' },
  { id: 'sakura', label: 'Sakura', color: '#FAD5E2' },
  { id: 'rosa_intenso', label: 'Rosa Intenso', color: '#EC4899' },
  { id: 'durazno', label: 'Durazno', color: '#F7CFB4' },
  { id: 'coral', label: 'Coral', color: '#F7C2B4' },
  { id: 'mantequilla', label: 'Mantequilla', color: '#F2E1A0' },
  { id: 'dorado', label: 'Dorado', color: '#D97706' },
  { id: 'verde', label: 'Menta', color: '#B0E0C4' },
  { id: 'salvia', label: 'Salvia', color: '#C2D7C7' },
  { id: 'menta_oscuro', label: 'Verde Bosque', color: '#0F766E' },
  { id: 'esmeralda', label: 'Esmeralda', color: '#059669' },
  { id: 'agua', label: 'Agua', color: '#AEE6E1' },
  { id: 'celeste', label: 'Celeste', color: '#B4DDF8' },
  { id: 'azul', label: 'Cielo', color: '#BCCBF8' },
  { id: 'azul_cielo_medio', label: 'Azul Océano', color: '#3B82F6' },
  { id: 'azul_rey', label: 'Azul Rey', color: '#2563EB' },
  { id: 'azul_marino', label: 'Azul Marino', color: '#1E3A8A' },
  { id: 'lavanda', label: 'Lavanda', color: '#CBCBF9' },
  { id: 'lila', label: 'Lila', color: '#D4C2F8' },
  { id: 'orquidea', label: 'Orquídea', color: '#E6C2EB' },
  { id: 'lavanda_oscuro', label: 'Índigo Oscuro', color: '#4338CA' },
  { id: 'purpura', label: 'Púrpura', color: '#7C3AED' },
  { id: 'fucsia', label: 'Fucsia', color: '#DB2777' },
  { id: 'rojo', label: 'Rojo Intenso', color: '#DC2626' },
  { id: 'carmesi', label: 'Carmesí', color: '#881337' },
  { id: 'gris_medio', label: 'Gris Medio', color: '#9CA3AF' },
  { id: 'negro', label: 'Negro', color: '#27272A' },
];

export interface TextSwatch {
  id: TextColorId;
  label: string;
  hex: string;
  mutedHex: string;
}

export const TEXT_SWATCHES: TextSwatch[] = [
  // Cremas, blancos y marrones claros -> medios -> oscuros
  { id: 'blanco', label: 'Blanco', hex: '#FFFFFF', mutedHex: 'rgba(255, 255, 255, 0.72)' },
  { id: 'marfil', label: 'Marfil', hex: '#FFFDF5', mutedHex: 'rgba(255, 253, 245, 0.74)' },
  { id: 'vainilla', label: 'Vainilla', hex: '#FBF0D9', mutedHex: 'rgba(251, 240, 217, 0.74)' },
  { id: 'crema', label: 'Crema', hex: '#FAF3E6', mutedHex: 'rgba(250, 243, 230, 0.74)' },
  { id: 'crema_tibia', label: 'Crema Tibia', hex: '#F5E5CA', mutedHex: 'rgba(245, 229, 202, 0.74)' },
  { id: 'almendra', label: 'Almendra', hex: '#EAD5B8', mutedHex: 'rgba(234, 213, 184, 0.74)' },
  { id: 'latte_claro', label: 'Latte Claro', hex: '#DFC3A3', mutedHex: 'rgba(223, 195, 163, 0.74)' },
  { id: 'arena', label: 'Arena', hex: '#D6B48E', mutedHex: 'rgba(214, 180, 142, 0.74)' },
  { id: 'caramelo_claro', label: 'Caramelo Luz', hex: '#C79B71', mutedHex: 'rgba(199, 155, 113, 0.74)' },
  { id: 'canela', label: 'Canela', hex: '#A87951', mutedHex: 'rgba(168, 121, 81, 0.72)' },
  { id: 'avellana', label: 'Avellana', hex: '#8B5E3C', mutedHex: 'rgba(139, 94, 60, 0.72)' },
  { id: 'marron', label: 'Marrón', hex: '#6B4423', mutedHex: 'rgba(107, 68, 35, 0.68)' },
  { id: 'cafe', label: 'Espresso', hex: '#432918', mutedHex: 'rgba(67, 41, 24, 0.70)' },
  // Neutros de claro a oscuro
  { id: 'gris_claro', label: 'Gris Luz', hex: '#D4D4DD', mutedHex: 'rgba(212, 212, 221, 0.76)' },
  { id: 'gris', label: 'Grafito', hex: '#52525B', mutedHex: 'rgba(82, 82, 91, 0.70)' },
  { id: 'gris_oscuro', label: 'Gris Oscuro', hex: '#32323A', mutedHex: 'rgba(50, 50, 58, 0.72)' },
  { id: 'negro', label: 'Negro', hex: '#1C1B1F', mutedHex: 'rgba(28, 27, 31, 0.62)' },
  // Colores variados claros -> oscuros
  { id: 'rosa_claro', label: 'Rosa Luz', hex: '#FBCFE8', mutedHex: 'rgba(251, 207, 232, 0.78)' },
  { id: 'rosa_palo', label: 'Rosa Palo', hex: '#E892B0', mutedHex: 'rgba(232, 146, 176, 0.76)' },
  { id: 'rosa', label: 'Rosa', hex: '#B84A6F', mutedHex: 'rgba(184, 74, 111, 0.72)' },
  { id: 'durazno_claro', label: 'Durazno Luz', hex: '#FCD2B8', mutedHex: 'rgba(252, 210, 184, 0.78)' },
  { id: 'coral', label: 'Coral', hex: '#B85242', mutedHex: 'rgba(184, 82, 66, 0.72)' },
  { id: 'rojo_claro', label: 'Rojo Luz', hex: '#FCA5A5', mutedHex: 'rgba(252, 165, 165, 0.78)' },
  { id: 'rojo', label: 'Rojo Vivo', hex: '#DC2626', mutedHex: 'rgba(220, 38, 38, 0.76)' },
  { id: 'carmesi', label: 'Carmesí', hex: '#881337', mutedHex: 'rgba(136, 19, 55, 0.74)' },
  { id: 'amarillo', label: 'Amarillo', hex: '#EAB308', mutedHex: 'rgba(234, 179, 8, 0.75)' },
  { id: 'dorado', label: 'Dorado', hex: '#B47B00', mutedHex: 'rgba(180, 123, 0, 0.74)' },
  { id: 'menta_claro', label: 'Menta Luz', hex: '#A7F3D0', mutedHex: 'rgba(167, 243, 208, 0.78)' },
  { id: 'verde', label: 'Verde', hex: '#256D46', mutedHex: 'rgba(37, 109, 70, 0.68)' },
  { id: 'esmeralda', label: 'Esmeralda', hex: '#059669', mutedHex: 'rgba(5, 150, 105, 0.74)' },
  { id: 'verde_bosque', label: 'Verde Bosque', hex: '#14532D', mutedHex: 'rgba(20, 83, 45, 0.74)' },
  { id: 'celeste_vivo', label: 'Celeste Luz', hex: '#93C5FD', mutedHex: 'rgba(147, 197, 253, 0.78)' },
  { id: 'azul', label: 'Azul', hex: '#2B4C7E', mutedHex: 'rgba(43, 76, 126, 0.72)' },
  { id: 'azul_rey', label: 'Azul Rey', hex: '#1D4ED8', mutedHex: 'rgba(29, 78, 216, 0.76)' },
  { id: 'azul_marino', label: 'Azul Marino', hex: '#0F295C', mutedHex: 'rgba(15, 41, 92, 0.74)' },
  { id: 'lavanda_claro', label: 'Lavanda Luz', hex: '#DDD6FE', mutedHex: 'rgba(221, 214, 254, 0.78)' },
  { id: 'morado', label: 'Ciruela', hex: '#5B3A7A', mutedHex: 'rgba(91, 58, 122, 0.72)' },
  { id: 'morado_oscuro', label: 'Morado Noche', hex: '#3B0764', mutedHex: 'rgba(59, 7, 100, 0.74)' },
  { id: 'fucsia', label: 'Fucsia', hex: '#C026D3', mutedHex: 'rgba(192, 38, 211, 0.74)' },
];

export interface AppTitleColorPreset {
  id: AppTitleColorId;
  label: string;
  hex: string;
  preview: string;
}

export const APP_TITLE_COLOR_PRESETS: AppTitleColorPreset[] = [
  { id: 'auto', label: 'Del diseño', hex: 'auto', preview: 'var(--text-main)' },
  { id: 'blanco', label: 'Blanco puro', hex: '#FFFFFF', preview: '#FFFFFF' },
  { id: 'marfil', label: 'Marfil luz', hex: '#FFFDF5', preview: '#FFFDF5' },
  { id: 'crema', label: 'Crema tibia', hex: '#F7E8CF', preview: '#F7E8CF' },
  { id: 'latte_claro', label: 'Latte claro', hex: '#DFC3A3', preview: '#DFC3A3' },
  { id: 'rosa_claro', label: 'Rosa luz', hex: '#FBCFE8', preview: '#FBCFE8' },
  { id: 'durazno_claro', label: 'Durazno luz', hex: '#FCD2B8', preview: '#FCD2B8' },
  { id: 'menta_claro', label: 'Menta luz', hex: '#A7F3D0', preview: '#A7F3D0' },
  { id: 'celeste_claro', label: 'Celeste luz', hex: '#BAE6FD', preview: '#BAE6FD' },
  { id: 'lavanda_claro', label: 'Lavanda luz', hex: '#DDD6FE', preview: '#DDD6FE' },
  { id: 'gris_claro', label: 'Gris plata', hex: '#D4D4DD', preview: '#D4D4DD' },
  { id: 'dorado', label: 'Dorado', hex: '#C88A1E', preview: '#C88A1E' },
  { id: 'canela', label: 'Canela', hex: '#A87951', preview: '#A87951' },
  { id: 'caramelo', label: 'Caramelo', hex: '#8D5B38', preview: '#8D5B38' },
  { id: 'rosa_medio', label: 'Rosa frambuesa', hex: '#D64D7D', preview: '#D64D7D' },
  { id: 'rojo_intenso', label: 'Rojo vivo', hex: '#DC2626', preview: '#DC2626' },
  { id: 'esmeralda', label: 'Esmeralda', hex: '#059669', preview: '#059669' },
  { id: 'azul_rey', label: 'Azul rey', hex: '#2563EB', preview: '#2563EB' },
  { id: 'purpura', label: 'Púrpura vivo', hex: '#7C3AED', preview: '#7C3AED' },
  { id: 'chocolate', label: 'Chocolate', hex: '#4D3225', preview: '#4D3225' },
  { id: 'vino', label: 'Vino oscuro', hex: '#6B1126', preview: '#6B1126' },
  { id: 'verde_oscuro', label: 'Verde bosque', hex: '#14532D', preview: '#14532D' },
  { id: 'azul_marino', label: 'Azul marino', hex: '#172554', preview: '#172554' },
  { id: 'negro', label: 'Negro tinta', hex: '#18181D', preview: '#18181D' },
  {
    id: 'custom',
    label: 'Tu color',
    hex: 'custom',
    preview: 'linear-gradient(135deg,#F4A6C1,#C88A1E,#2563EB)',
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
  { id: 'blanco', label: 'Blanco', color: '#FFFFFF', isLight: true },
  { id: 'vainilla', label: 'Vainilla', color: '#FBF0D9', isLight: true },
  { id: 'crema', label: 'Crema', color: '#F5E5CA', isLight: true },
  { id: 'avellana', label: 'Avellana', color: '#B58C6B' },
  { id: 'caramelo', label: 'Caramelo', color: '#B67B52' },
  { id: 'chocolate', label: 'Chocolate', color: '#6E4730' },
  { id: 'espresso', label: 'Espresso', color: '#3E271C' },
  { id: 'rosa_claro', label: 'Rosa Luz', color: '#FBCFE8', isLight: true },
  { id: 'sakura', label: 'Sakura', color: '#F4A7C3', isLight: true },
  { id: 'rosa_chicle', label: 'Rosa Chicle', color: '#EC7FA9' },
  { id: 'frambuesa', label: 'Frambuesa', color: '#D95B86' },
  { id: 'rosa_vino', label: 'Rosa Vino', color: '#831843' },
  { id: 'durazno', label: 'Durazno', color: '#F4AA7E', isLight: true },
  { id: 'coral', label: 'Coral', color: '#F08A75' },
  { id: 'miel', label: 'Miel', color: '#E8B84B', isLight: true },
  { id: 'dorado_intenso', label: 'Dorado Intenso', color: '#D97706' },
  { id: 'limon', label: 'Limón', color: '#BECF4E', isLight: true },
  { id: 'menta', label: 'Menta', color: '#6DC497' },
  { id: 'esmeralda', label: 'Esmeralda', color: '#2E8B57' },
  { id: 'verde_bosque', label: 'Verde Bosque', color: '#065F46' },
  { id: 'turquesa', label: 'Turquesa', color: '#52B7B0' },
  { id: 'celeste_claro', label: 'Celeste Luz', color: '#BAE6FD', isLight: true },
  { id: 'celeste', label: 'Celeste', color: '#6FB9EC' },
  { id: 'cyan_intenso', label: 'Cian Vivo', color: '#06B6D4' },
  { id: 'cielo', label: 'Azul Cielo', color: '#6D8EE6' },
  { id: 'azul_electrico', label: 'Azul Eléctrico', color: '#0284C7' },
  { id: 'azul_rey', label: 'Azul Rey', color: '#2563EB' },
  { id: 'azul_marino', label: 'Azul Marino', color: '#1E3A8A' },
  { id: 'indigo', label: 'Índigo', color: '#5A67C8' },
  { id: 'lavanda_claro', label: 'Lavanda Luz', color: '#DDD6FE', isLight: true },
  { id: 'lavanda', label: 'Lavanda', color: '#9A92EC' },
  { id: 'lila', label: 'Lila', color: '#B589EB' },
  { id: 'orquidea', label: 'Orquídea', color: '#D17BD6' },
  { id: 'purpura_real', label: 'Púrpura Real', color: '#7C3AED' },
  { id: 'fucsia', label: 'Fucsia Vivo', color: '#DB2777' },
  { id: 'rojo_intenso', label: 'Rojo Intenso', color: '#DC2626' },
  { id: 'rojo_carmesi', label: 'Rojo Carmesí', color: '#991B1B' },
  { id: 'vino_profundo', label: 'Vino Oscuro', color: '#581124' },
  { id: 'gris_plata', label: 'Gris Plata', color: '#CBD5E1', isLight: true },
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
  { id: 'gris_claro', label: 'Gris claro', bg: '#F3F4F6', activeBg: '#E5E7EB', text: '#1F2937', muted: 'rgba(31,41,55,0.65)', border: '#D1D5DB', preview: '#E5E7EB' },
  { id: 'gris_oscuro', label: 'Gris oscuro', bg: '#272932', activeBg: '#323540', text: '#F9FAFB', muted: 'rgba(249,250,251,0.7)', border: '#4B5563', preview: '#374151' },
  { id: 'negro', label: 'Negro', bg: '#151519', activeBg: '#23232A', text: '#F8F7FA', muted: 'rgba(248,247,250,0.68)', border: '#383844', preview: '#151519' },
  { id: 'marfil', label: 'Marfil', bg: '#FFFDF5', activeBg: '#F8F3E6', text: '#3F3226', muted: 'rgba(63,50,38,0.68)', border: '#EAE0CC', preview: '#FAF3E1' },
  { id: 'crema', label: 'Crema', bg: '#FFF9EF', activeBg: '#F8EEDC', text: '#423326', muted: 'rgba(66,51,38,0.68)', border: '#E5D3BA', preview: '#FFF3DF' },
  { id: 'latte', label: 'Latte', bg: '#F5ECE2', activeBg: '#EADBC9', text: '#4A3423', muted: 'rgba(74,52,35,0.7)', border: '#D9C2AC', preview: '#EBDCCB' },
  { id: 'canela', label: 'Canela', bg: '#EAD6C3', activeBg: '#DEC2A7', text: '#422818', muted: 'rgba(66,40,24,0.7)', border: '#C7A07D', preview: '#D9B99B' },
  { id: 'caramelo', label: 'Caramelo', bg: '#9C6B46', activeBg: '#875A38', text: '#FFF7F0', muted: 'rgba(255,247,240,0.76)', border: '#C79B71', preview: '#9C6B46' },
  { id: 'chocolate', label: 'Chocolate', bg: '#4E3427', activeBg: '#5F4132', text: '#FFF3E8', muted: 'rgba(255,243,232,0.74)', border: '#8D6752', preview: '#4E3427' },
  { id: 'rosa_pastel', label: 'Rosa pastel', bg: '#FFF0F5', activeBg: '#FCE0EC', text: '#5A2A3F', muted: 'rgba(90,42,63,0.7)', border: '#F4B8CC', preview: '#FAD7E4' },
  { id: 'rosa_oscuro', label: 'Rosa oscuro', bg: '#9D174D', activeBg: '#BE185D', text: '#FFF1F7', muted: 'rgba(255,241,247,0.76)', border: '#F9A8D4', preview: '#BE185D' },
  { id: 'durazno', label: 'Durazno', bg: '#FFF3E8', activeBg: '#FFE4CE', text: '#5B3420', muted: 'rgba(91,52,32,0.7)', border: '#F4BC98', preview: '#FCDDC4' },
  { id: 'pistacho', label: 'Pistacho', bg: '#EFF9E8', activeBg: '#DFF1D3', text: '#264422', muted: 'rgba(38,68,34,0.7)', border: '#A7D28E', preview: '#D5ECC4' },
  { id: 'menta', label: 'Menta', bg: '#EDFAF3', activeBg: '#D8F4E5', text: '#1C4B36', muted: 'rgba(28,75,54,0.7)', border: '#9AD9B8', preview: '#C6EED8' },
  { id: 'verde_esmeralda', label: 'Esmeralda', bg: '#065F46', activeBg: '#047857', text: '#ECFDF5', muted: 'rgba(236,253,245,0.78)', border: '#6EE7B7', preview: '#059669' },
  { id: 'celeste', label: 'Celeste', bg: '#EEF7FF', activeBg: '#DCEEFF', text: '#1D3E5E', muted: 'rgba(29,62,94,0.7)', border: '#9FD3F7', preview: '#CDE8FD' },
  { id: 'azul_cielo', label: 'Azul medio', bg: '#2563EB', activeBg: '#3B82F6', text: '#FFFFFF', muted: 'rgba(255,255,255,0.8)', border: '#BFDBFE', preview: '#3B82F6' },
  { id: 'azul_rey', label: 'Azul rey', bg: '#1D4ED8', activeBg: '#2563EB', text: '#FFFFFF', muted: 'rgba(255,255,255,0.8)', border: '#93C5FD', preview: '#1D4ED8' },
  { id: 'azul_cobalto', label: 'Azul cobalto', bg: '#0C4A6E', activeBg: '#0369A1', text: '#F0F9FF', muted: 'rgba(240,249,255,0.76)', border: '#7DD3FC', preview: '#0369A1' },
  { id: 'azul_marino', label: 'Azul marino', bg: '#0F1E3D', activeBg: '#172E5C', text: '#F0F7FF', muted: 'rgba(240,247,255,0.76)', border: '#60A5FA', preview: '#0F1E3D' },
  { id: 'lila_nube', label: 'Lila nube', bg: '#F6F0FF', activeBg: '#EAE0FE', text: '#3E2E5C', muted: 'rgba(62,46,92,0.7)', border: '#CBB4F7', preview: '#E5D6FC' },
  { id: 'lavanda_oscuro', label: 'Índigo oscuro', bg: '#3730A3', activeBg: '#4338CA', text: '#EEF2FF', muted: 'rgba(238,242,255,0.78)', border: '#A5B4FC', preview: '#4338CA' },
  { id: 'morado_noche', label: 'Púrpura real', bg: '#4C1D95', activeBg: '#5B21B6', text: '#F5F3FF', muted: 'rgba(245,243,255,0.78)', border: '#C4B5FD', preview: '#5B21B6' },
  { id: 'fucsia_intenso', label: 'Fucsia vivo', bg: '#86198F', activeBg: '#A21CAF', text: '#FDF4FF', muted: 'rgba(253,244,255,0.78)', border: '#F0ABFC', preview: '#A21CAF' },
  { id: 'vino', label: 'Vino chic', bg: '#3E1C28', activeBg: '#512535', text: '#FFF0F4', muted: 'rgba(255,240,244,0.72)', border: '#8B4A62', preview: '#3E1C28' },
  { id: 'rojo_intenso', label: 'Rojo intenso', bg: '#991B1B', activeBg: '#B91C1C', text: '#FFFFFF', muted: 'rgba(255,255,255,0.78)', border: '#FCA5A5', preview: '#B91C1C' },
  { id: 'rojo_oscuro', label: 'Rojo rubí', bg: '#5C0D1E', activeBg: '#78142B', text: '#FFF1F4', muted: 'rgba(255,241,244,0.75)', border: '#FB7185', preview: '#6B1126' },
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
  { id: 'pure_white', label: 'Blanco puro', playBg: '#FFFFFF', navBg: '#F4F4F8', playIcon: '#1C1B1F', navIcon: '#1C1B1F', rim: '#CFCFD9' },
  { id: 'crema_dorada', label: 'Crema dorada', playBg: '#FAF0DC', navBg: '#FFFDF8', playIcon: '#4B341E', navIcon: '#5C432A', rim: '#D9BC8C' },
  { id: 'latte_miel', label: 'Latte & Miel', playBg: '#DFC3A3', navBg: '#F8EFE6', playIcon: '#3D2514', navIcon: '#52341E', rim: '#B58D63' },
  { id: 'gris_plata', label: 'Gris plata', playBg: '#D1D5DB', navBg: '#F3F4F6', playIcon: '#1F2937', navIcon: '#374151', rim: '#9CA3AF' },
  { id: 'porcelain_sakura', label: 'Sakura & Blanco', playBg: '#F4A6C1', navBg: '#FFFFFF', playIcon: '#2B1620', navIcon: '#3D2531', rim: '#CF7A99' },
  { id: 'strawberry_milk', label: 'Fresa brillante', playBg: '#E975A0', navBg: '#FFF1F6', playIcon: '#FFFFFF', navIcon: '#872A4D', rim: '#BE4D77' },
  { id: 'rosa_vino', label: 'Rosa vino', playBg: '#9D174D', navBg: '#FDF2F8', playIcon: '#FFFFFF', navIcon: '#831843', rim: '#500724' },
  { id: 'champagne_rose', label: 'Champán dorado', playBg: '#E6C285', navBg: '#FFF9EE', playIcon: '#3B290E', navIcon: '#5C431C', rim: '#B68C49' },
  { id: 'pistachio_cream', label: 'Pistacho crema', playBg: '#9BD27E', navBg: '#F4FBEF', playIcon: '#1E3C19', navIcon: '#2B4E24', rim: '#6CA74E' },
  { id: 'menta_oscuro', label: 'Verde bosque', playBg: '#0F766E', navBg: '#ECFDF5', playIcon: '#FFFFFF', navIcon: '#115E59', rim: '#134E4A' },
  { id: 'esmeralda_oro', label: 'Esmeralda & Oro', playBg: '#059669', navBg: '#064E3B', playIcon: '#FEF3C7', navIcon: '#A7F3D0', rim: '#022C22' },
  { id: 'sky_ice', label: 'Celeste hielo', playBg: '#7CC3F7', navBg: '#EFF8FF', playIcon: '#10314C', navIcon: '#1D496E', rim: '#4B99D6' },
  { id: 'azul_cielo_suave', label: 'Azul océano', playBg: '#3B82F6', navBg: '#EFF6FF', playIcon: '#FFFFFF', navIcon: '#1E40AF', rim: '#1D4ED8' },
  { id: 'azul_rey', label: 'Azul Rey Intenso', playBg: '#2563EB', navBg: '#1E3A8A', playIcon: '#FFFFFF', navIcon: '#DBEAFE', rim: '#172554' },
  { id: 'azul_marino', label: 'Azul Marino Noche', playBg: '#0F172A', navBg: '#1E293B', playIcon: '#7DD3FC', navIcon: '#E0F2FE', rim: '#020617' },
  { id: 'lavender_pearl', label: 'Lavanda perla', playBg: '#C2AAF9', navBg: '#F7F3FF', playIcon: '#2B1D4C', navIcon: '#412D6B', rim: '#9174DD' },
  { id: 'lila_oscuro', label: 'Índigo oscuro', playBg: '#4338CA', navBg: '#312E81', playIcon: '#FFFFFF', navIcon: '#E0E7FF', rim: '#1E1B4B' },
  { id: 'purpura_real', label: 'Púrpura Real', playBg: '#7C3AED', navBg: '#4C1D95', playIcon: '#FFFFFF', navIcon: '#EDE9FE', rim: '#2E1065' },
  { id: 'fucsia_vivo', label: 'Fucsia Brillante', playBg: '#DB2777', navBg: '#831843', playIcon: '#FFFFFF', navIcon: '#FCE7F3', rim: '#500724' },
  { id: 'chocolate_caramel', label: 'Cacao & Latte', playBg: '#5B3826', navBg: '#F2E4D5', playIcon: '#FFF5EB', navIcon: '#4A2D1D', rim: '#361E13' },
  { id: 'cherry_noir', label: 'Cereza vino', playBg: '#75203A', navBg: '#FCEEF3', playIcon: '#FFF4F7', navIcon: '#5B192E', rim: '#4A1022' },
  { id: 'rojo_carmesi', label: 'Rojo Carmesí', playBg: '#DC2626', navBg: '#991B1B', playIcon: '#FFFFFF', navIcon: '#FEE2E2', rim: '#7F1D1D' },
  { id: 'rojo_oscuro', label: 'Rojo Rubí Oscuro', playBg: '#881337', navBg: '#4C0D1D', playIcon: '#FFF1F2', navIcon: '#FECDD3', rim: '#3B0816' },
  { id: 'noir_velvet', label: 'Negro & Oro', playBg: '#191920', navBg: '#2A2A34', playIcon: '#F5D596', navIcon: '#F4F4F8', rim: '#09090D' },
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
  { label: 'Rojo Carmesí', primary: '#B91C1C', secondary: '#FFF1F2', accent: '#FCA5A5', detail: '#450A0A' },
  { label: 'Azul Rey & Plata', primary: '#1D4ED8', secondary: '#EFF6FF', accent: '#E2E8F0', detail: '#172554' },
  { label: 'Azul Noche & Cian', primary: '#0F172A', secondary: '#1E293B', accent: '#38BDF8', detail: '#020617' },
  { label: 'Esmeralda Real', primary: '#047857', secondary: '#ECFDF5', accent: '#FCD34D', detail: '#022C22' },
];

export const DEFAULT_AVATAR_URL = '/src/assets/images/cute_avatar_default_1794973377333.jpg';
export const DEFAULT_BANNER_URL = '/src/assets/images/cute_banner_default_1794973376848.jpg';
export const DEFAULT_COVER_SAKURA = '/src/assets/images/cover_sakura_lo_1794973378033.jpg';
export const DEFAULT_COVER_CLOUD = '/src/assets/images/cover_cloud_melody_1794973378393.jpg';

export interface SongTitleShapePreset {
  id: SongTitleShapeId;
  label: string;
  description: string;
}

export const SONG_TITLE_SHAPES: SongTitleShapePreset[] = [
  { id: 'title_only', label: 'Solo el título', description: 'Texto limpio sin marco ni adornos' },
  { id: 'cloud_plush', label: 'Nube esponjosa', description: 'Contorno mullido de nube pastel' },
  { id: 'ribbon_banner', label: 'Listón coquette', description: 'Cinta elegante con lazo fino' },
  { id: 'ticket_stub', label: 'Ticket musical', description: 'Muescas laterales y borde punteado' },
  { id: 'heart_plaque', label: 'Placa corazón', description: 'Marco suave con corazón lineal' },
  { id: 'capsule_3d', label: 'Cápsula 3D', description: 'Relieve tridimensional muy nítido' },
  { id: 'notebook_tab', label: 'Hoja de libreta', description: 'Renglones delicados y pestaña lateral' },
  { id: 'polaroid_tag', label: 'Etiqueta Polaroid', description: 'Cartulina estilizada con cinta superior' },
  { id: 'crystal_glass', label: 'Cristal glaseado', description: 'Placa acrílica con brillo suave' },
  { id: 'sakura_frame', label: 'Marco sakura', description: 'Detalle floral vectorial en la esquina' },
  { id: 'starry_plaque', label: 'Placa estelar', description: 'Destellos finos geométricos' },
  { id: 'double_lace', label: 'Encaje doble', description: 'Doble marco punteado delicado' },
  { id: 'kitty_ears', label: 'Orejitas gatito', description: 'Silueta kawaii sobre el título' },
  { id: 'bunny_ears', label: 'Orejitas conejo', description: 'Orejitas suaves arriba del título' },
  { id: 'wave_underline', label: 'Onda melódica', description: 'Subrayado ondulado musical abierto' },
  { id: 'gold_velvet', label: 'Placa chic', description: 'Doble filo elegante con acento' },
];

export interface SongTitleColorPreset {
  id: SongTitleColorId;
  label: string;
  bg: string;
  text: string;
  border: string;
  accent: string;
  plainText: string;
  preview: string;
}

export const SONG_TITLE_COLOR_PRESETS: SongTitleColorPreset[] = [
  {
    id: 'auto',
    label: 'Del tema',
    bg: 'var(--bg-surface)',
    text: 'var(--text-main)',
    border: 'var(--accent-color)',
    accent: 'var(--accent-color)',
    plainText: 'var(--text-main)',
    preview: 'var(--accent-color)',
  },
  {
    id: 'blanco',
    label: 'Blanco puro',
    bg: '#FFFFFF',
    text: '#1C1B1F',
    border: '#DCDCE4',
    accent: '#8E8E9E',
    plainText: '#FFFFFF',
    preview: '#FFFFFF',
  },
  {
    id: 'gris_claro',
    label: 'Gris plata',
    bg: '#F3F4F6',
    text: '#1F2937',
    border: '#D1D5DB',
    accent: '#6B7280',
    plainText: '#D4D4DD',
    preview: '#E5E7EB',
  },
  {
    id: 'gris_oscuro',
    label: 'Gris oscuro',
    bg: '#323540',
    text: '#F9FAFB',
    border: '#6B7280',
    accent: '#D1D5DB',
    plainText: '#374151',
    preview: '#374151',
  },
  {
    id: 'negro',
    label: 'Negro tinta',
    bg: '#16161B',
    text: '#FFFFFF',
    border: '#3C3C48',
    accent: '#D4D4E0',
    plainText: '#16161B',
    preview: '#16161B',
  },
  {
    id: 'marfil',
    label: 'Marfil luz',
    bg: '#FFFDF5',
    text: '#3F3226',
    border: '#EAE0CC',
    accent: '#B59B75',
    plainText: '#FFFDF5',
    preview: '#FAF4E4',
  },
  {
    id: 'crema',
    label: 'Crema tibia',
    bg: '#FFF8EB',
    text: '#3F2F21',
    border: '#DFC7A4',
    accent: '#B48854',
    plainText: '#F5E5CA',
    preview: '#F7E8CF',
  },
  {
    id: 'latte',
    label: 'Latte claro',
    bg: '#F4EAE0',
    text: '#4A3321',
    border: '#D6BCA3',
    accent: '#A9825D',
    plainText: '#DFC3A3',
    preview: '#E8D5C1',
  },
  {
    id: 'canela',
    label: 'Canela',
    bg: '#E8D1BC',
    text: '#412817',
    border: '#C59E7B',
    accent: '#8C5E39',
    plainText: '#A87951',
    preview: '#D4B08E',
  },
  {
    id: 'caramelo',
    label: 'Caramelo',
    bg: '#9C6B46',
    text: '#FFF8F2',
    border: '#C79B71',
    accent: '#F5DFC6',
    plainText: '#8D5B38',
    preview: '#9C6B46',
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    bg: '#4A2F22',
    text: '#FFF4E8',
    border: '#8E644E',
    accent: '#E5BC96',
    plainText: '#5B3928',
    preview: '#4A2F22',
  },
  {
    id: 'sakura',
    label: 'Sakura suave',
    bg: '#FFF3F7',
    text: '#6A2742',
    border: '#F5BACF',
    accent: '#E0799E',
    plainText: '#FBCFE8',
    preview: '#F9DAE6',
  },
  {
    id: 'rosa_pastel',
    label: 'Rosa pastel',
    bg: '#FFEBF2',
    text: '#5A1F38',
    border: '#F2ABC4',
    accent: '#D6648D',
    plainText: '#B84A6F',
    preview: '#FAD4E2',
  },
  {
    id: 'frambuesa',
    label: 'Frambuesa',
    bg: '#D44D7D',
    text: '#FFFFFF',
    border: '#A7315C',
    accent: '#FFD7E6',
    plainText: '#C53A6C',
    preview: '#D44D7D',
  },
  {
    id: 'rosa_fuerte',
    label: 'Rosa intenso',
    bg: '#BE185D',
    text: '#FFFFFF',
    border: '#F9A8D4',
    accent: '#FCE7F3',
    plainText: '#DB2777',
    preview: '#BE185D',
  },
  {
    id: 'durazno',
    label: 'Durazno',
    bg: '#FFF0E5',
    text: '#5A2F19',
    border: '#F3B48D',
    accent: '#CF6F3B',
    plainText: '#FCD2B8',
    preview: '#FAD6BE',
  },
  {
    id: 'pistacho',
    label: 'Pistacho',
    bg: '#ECF8E4',
    text: '#21421D',
    border: '#A0CF85',
    accent: '#5C9840',
    plainText: '#BFE4A8',
    preview: '#CFEAC0',
  },
  {
    id: 'menta',
    label: 'Menta fresca',
    bg: '#E6F9F0',
    text: '#164531',
    border: '#8ED5B5',
    accent: '#37986E',
    plainText: '#A7F3D0',
    preview: '#BBEBD4',
  },
  {
    id: 'verde_claro',
    label: 'Verde luz',
    bg: '#DCFCE7',
    text: '#14532D',
    border: '#86EFAC',
    accent: '#22C55E',
    plainText: '#86EFAC',
    preview: '#BBF7D0',
  },
  {
    id: 'verde_bosque',
    label: 'Esmeralda',
    bg: '#065F46',
    text: '#ECFDF5',
    border: '#6EE7B7',
    accent: '#A7F3D0',
    plainText: '#059669',
    preview: '#059669',
  },
  {
    id: 'celeste',
    label: 'Celeste cielo',
    bg: '#EAF5FF',
    text: '#163A5C',
    border: '#96CBF4',
    accent: '#3A88C8',
    plainText: '#BAE6FD',
    preview: '#C3E4FD',
  },
  {
    id: 'azul_cobalto',
    label: 'Azul Cobalto',
    bg: '#0369A1',
    text: '#FFFFFF',
    border: '#7DD3FC',
    accent: '#BAE6FD',
    plainText: '#0284C7',
    preview: '#0284C7',
  },
  {
    id: 'azul_rey',
    label: 'Azul Rey',
    bg: '#1D4ED8',
    text: '#FFFFFF',
    border: '#93C5FD',
    accent: '#DBEAFE',
    plainText: '#2563EB',
    preview: '#2563EB',
  },
  {
    id: 'azul_marino',
    label: 'Azul Marino',
    bg: '#0F172A',
    text: '#F0F9FF',
    border: '#60A5FA',
    accent: '#7DD3FC',
    plainText: '#1E3A8A',
    preview: '#172554',
  },
  {
    id: 'lavanda',
    label: 'Lavanda nube',
    bg: '#F2ECFF',
    text: '#392561',
    border: '#C3ABF6',
    accent: '#7D5CC8',
    plainText: '#DDD6FE',
    preview: '#DDD0FC',
  },
  {
    id: 'purpura_real',
    label: 'Púrpura Real',
    bg: '#5B21B6',
    text: '#F5F3FF',
    border: '#C4B5FD',
    accent: '#DDD6FE',
    plainText: '#7C3AED',
    preview: '#6D28D9',
  },
  {
    id: 'fucsia_vivo',
    label: 'Fucsia Vivo',
    bg: '#A21CAF',
    text: '#FDF4FF',
    border: '#F0ABFC',
    accent: '#F5D0FE',
    plainText: '#C026D3',
    preview: '#C026D3',
  },
  {
    id: 'rojo_intenso',
    label: 'Rojo Intenso',
    bg: '#B91C1C',
    text: '#FFFFFF',
    border: '#FCA5A5',
    accent: '#FEE2E2',
    plainText: '#DC2626',
    preview: '#DC2626',
  },
  {
    id: 'carmesi_oscuro',
    label: 'Carmesí Oscuro',
    bg: '#5C0D1E',
    text: '#FFF1F2',
    border: '#FB7185',
    accent: '#FDA4AF',
    plainText: '#881337',
    preview: '#881337',
  },
  {
    id: 'vino',
    label: 'Vino chic',
    bg: '#4B192B',
    text: '#FFF0F5',
    border: '#9C4D69',
    accent: '#F4B6CA',
    plainText: '#72233E',
    preview: '#4B192B',
  },
  {
    id: 'oro_negro',
    label: 'Negro & Oro',
    bg: '#18181F',
    text: '#F7DFAC',
    border: '#C99E4E',
    accent: '#E9C477',
    plainText: '#8E681E',
    preview: 'linear-gradient(135deg,#18181F 55%,#E9C477 100%)',
  },
  {
    id: 'custom',
    label: 'Tu color',
    bg: 'custom',
    text: 'custom',
    border: 'custom',
    accent: 'custom',
    plainText: 'custom',
    preview: 'linear-gradient(135deg,#F4A6C1,#7CC3F7,#9BD27E)',
  },
];

export interface MusicCardOuterIconOption {
  id: MusicCardOuterIconId;
  label: string;
}

export const MUSIC_CARD_OUTER_ICONS: MusicCardOuterIconOption[] = [
  { id: 'none', label: 'Ninguno' },
  { id: 'note_sparkle', label: 'Nota musical' },
  { id: 'bow_ribbon', label: 'Moñito fino' },
  { id: 'kitty_silhouette', label: 'Gatito kawaii' },
  { id: 'bunny_silhouette', label: 'Conejito tierno' },
  { id: 'bear_silhouette', label: 'Osito dulce' },
  { id: 'sakura_flower', label: 'Flor sakura' },
  { id: 'tulip_bloom', label: 'Tulipán' },
  { id: 'crescent_moon', label: 'Luna y estrella' },
  { id: 'cloud_dream', label: 'Nube esponjosa' },
  { id: 'crystal_heart', label: 'Corazón joya' },
  { id: 'butterfly_wing', label: 'Mariposita' },
  { id: 'crown_mini', label: 'Coronita' },
  { id: 'headphones_cute', label: 'Audífonos' },
  { id: 'vinyl_mini', label: 'Mini vinilo' },
  { id: 'teacup_steam', label: 'Tacita tibia' },
  { id: 'clover_leaf', label: 'Trébol' },
  { id: 'cherry_twin', label: 'Cerecitas' },
  { id: 'star_gem', label: 'Estrella brillo' },
];

export const WALLPAPER_FILTER_OPTIONS: Array<{
  id: WallpaperFilterId;
  label: string;
  description: string;
}> = [
  { id: 'none', label: 'Sin filtro', description: 'Imagen limpia tal cual' },
  { id: 'blur_soft', label: 'Borroso', description: 'Fondo difuminado detrás de tus accesorios' },
];

export const WALLPAPER_MOTION_OPTIONS: Array<{
  id: WallpaperMotionId;
  label: string;
  description: string;
}> = [
  { id: 'none', label: 'Sin movimiento', description: 'Fondo estático' },
  { id: 'flowers', label: 'Flores flotando', description: 'Pétalos y flores suaves en brisa' },
  { id: 'leaves', label: 'Hojas cayendo', description: 'Hojas naturales meciéndose' },
  { id: 'chains', label: 'Cadenas colgantes', description: 'Cadenitas finas balanceándose' },
  { id: 'rain_drops', label: 'Gotas deslizantes', description: 'Gotitas finas sobre el fondo' },
  { id: 'sparkles', label: 'Destellos / Luciérnagas', description: 'Brillos flotantes sutiles' },
  { id: 'butterflies', label: 'Mariposas', description: 'Vuelo suave detrás de la app' },
  { id: 'ribbons', label: 'Lazos y pétalos', description: 'Cintas ligeras en el aire' },
];

export const SCREEN_OVERLAY_FILTER_OPTIONS: Array<{
  id: ScreenOverlayFilterId;
  label: string;
  description: string;
}> = [
  { id: 'none', label: 'Sin filtro', description: 'Pantalla completamente limpia' },
  {
    id: 'crystal_drops_tilt',
    label: 'Gotas + agua móvil',
    description: 'Gotas cristalinas 3D y agua fluida abajo que responde al mover el móvil',
  },
  {
    id: 'fluid_bottom_water',
    label: 'Agua cristalina abajo',
    description: 'Agua pura con olas, reflejos y burbujas que fluye al inclinar el teléfono',
  },
  {
    id: 'rainy_window',
    label: 'Ventana lluviosa',
    description: 'Lluvia 3D WebGL cristalina con física real y acelerómetro al inclinar el móvil',
  },
  {
    id: 'water_ripples',
    label: 'Ondas en espejo de agua',
    description: 'Ondas líquidas transparentes y caústicas brillando en movimiento',
  },
  {
    id: 'plastic_bag',
    label: 'Bolsa de plástico',
    description: 'Pliegue brillante y reflejos nítidos de celofán transparente',
  },
  {
    id: 'soap_bubbles',
    label: 'Burbujas iridiscentes',
    description: 'Burbujas de jabón translúcidas flotando suavemente',
  },
  {
    id: 'liquid_mercury',
    label: 'Lágrimas de cristal',
    description: 'Gotas líquidas orgánicas con brillo de espejo deslizándose',
  },
  {
    id: 'crushed_ice',
    label: 'Hielo fracturado',
    description: 'Facetas cristalinas translúcidas con destellos helados',
  },
  {
    id: 'frosted_glass',
    label: 'Cristal empañado',
    description: 'Bordes esmerilados y textura de vidrio tibio',
  },
  {
    id: 'silk_veil',
    label: 'Velo de seda móvil',
    description: 'Textura fina de tul translúcido mecida por la brisa',
  },
  {
    id: 'gold_dust',
    label: 'Polvo dorado flotante',
    description: 'Destellos finos y luces bokeh cálidas en suspensión',
  },
  {
    id: 'sakura_glass',
    label: 'Cristal con pétalos',
    description: 'Vidrio claro con rocío cristalino y pétalos cayendo',
  },
  {
    id: 'snow_crystal',
    label: 'Nieve y escarcha móvil',
    description: 'Copos suaves y cristales translúcidos cayendo',
  },
  {
    id: 'cd_prism',
    label: 'Prisma arcoíris',
    description: 'Destellos iridiscentes de luz solar',
  },
  {
    id: 'vintage_film',
    label: 'Película 35mm',
    description: 'Grano analógico suave y fuga de luz cálida',
  },
  {
    id: 'crt_scanlines',
    label: 'Monitor retro',
    description: 'Líneas finas de pantalla vintage y brillo suave',
  },
];


