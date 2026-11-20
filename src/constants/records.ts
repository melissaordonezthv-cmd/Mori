import type { AvatarFrameId } from '../types/music';

export interface PremiumFrameReward {
  frameId: AvatarFrameId;
  frameLabel: string;
  minutes: number;
  defaultColor: string;
}

export type BadgeTier =
  | 'pearl'
  | 'rose_quartz'
  | 'amethyst'
  | 'sapphire'
  | 'emerald'
  | 'amber_gold'
  | 'diamond'
  | 'aurora';

export type BadgeEmblemShape =
  | 'star'
  | 'heart'
  | 'crown'
  | 'butterfly'
  | 'moon'
  | 'diamond'
  | 'lotus'
  | 'note'
  | 'wings'
  | 'infinity';

export interface RecordBadge {
  id: string;
  minutes: number;
  title: string;
  subtitle: string;
  tier: BadgeTier;
  emblem: BadgeEmblemShape;
  accentHex: string;
  glowHex: string;
}

/**
 * 50 exclusive premium frames unlocked every 5 minutes (5, 10, 15 ... 250 min)
 * whenever the player beats their personal record.
 */
export const PREMIUM_FRAME_REWARDS: PremiumFrameReward[] = [
  { frameId: 'prism_aura', frameLabel: 'Prisma Cristal', minutes: 5, defaultColor: '#F472B6' },
  { frameId: 'crystal_wings', frameLabel: 'Alas de Cristal', minutes: 10, defaultColor: '#A78BFA' },
  { frameId: 'royal_prism_crown', frameLabel: 'Corona Suprema', minutes: 15, defaultColor: '#FBBF24' },
  { frameId: 'holo_butterfly', frameLabel: 'Mariposas Prism', minutes: 20, defaultColor: '#38BDF8' },
  { frameId: 'diamond_halo', frameLabel: 'Diamante Halo', minutes: 25, defaultColor: '#2DD4BF' },
  { frameId: 'celestial_orbit', frameLabel: 'Órbita Celestial', minutes: 30, defaultColor: '#FB923C' },
  { frameId: 'neon_nebula', frameLabel: 'Nebulosa Única', minutes: 35, defaultColor: '#C084FC' },
  { frameId: 'imperial_floral', frameLabel: 'Imperial Único', minutes: 40, defaultColor: '#FB7185' },
  { frameId: 'starlight_tiara', frameLabel: 'Tiara Estelar', minutes: 45, defaultColor: '#FCD34D' },
  { frameId: 'velvet_bow_luxe', frameLabel: 'Moño Imperial', minutes: 50, defaultColor: '#F43F5E' },
  { frameId: 'aurora_crescent', frameLabel: 'Luna Aurora', minutes: 55, defaultColor: '#818CF8' },
  { frameId: 'lotus_sanctuary', frameLabel: 'Loto Dorado', minutes: 60, defaultColor: '#F59E0B' },
  { frameId: 'symphony_laurel', frameLabel: 'Laurel Sinfonía', minutes: 65, defaultColor: '#34D399' },
  { frameId: 'fairy_wing_filigree', frameLabel: 'Alas de Hada', minutes: 70, defaultColor: '#E879F9' },
  { frameId: 'pearl_cathedral', frameLabel: 'Catedral Perla', minutes: 75, defaultColor: '#E2E8F0' },
  { frameId: 'gemstone_octagon', frameLabel: 'Gema Octágono', minutes: 80, defaultColor: '#22D3EE' },
  { frameId: 'melody_clef_crest', frameLabel: 'Clave Melódica', minutes: 85, defaultColor: '#EC4899' },
  { frameId: 'swan_grace_ring', frameLabel: 'Cisne Real', minutes: 90, defaultColor: '#F9A8D4' },
  { frameId: 'sakura_lanterns', frameLabel: 'Faroles Sakura', minutes: 95, defaultColor: '#FDA4AF' },
  { frameId: 'opal_arch_halo', frameLabel: 'Arco de Ópalo', minutes: 100, defaultColor: '#67E8F9' },
  { frameId: 'royal_comet_trail', frameLabel: 'Cometa Real', minutes: 105, defaultColor: '#60A5FA' },
  { frameId: 'stardust_compass', frameLabel: 'Brújula Estelar', minutes: 110, defaultColor: '#FBBF24' },
  { frameId: 'ribbon_choker_luxe', frameLabel: 'Lazo Rococó', minutes: 115, defaultColor: '#FB7185' },
  { frameId: 'crystal_snowflake', frameLabel: 'Cristal Glacial', minutes: 120, defaultColor: '#7DD3FC' },
  { frameId: 'charmed_hearts_ring', frameLabel: 'Corazones Joya', minutes: 125, defaultColor: '#F472B6' },
  { frameId: 'angelic_feather_crown', frameLabel: 'Corona Plumaje', minutes: 130, defaultColor: '#FDE68A' },
  { frameId: 'twin_butterfly_lace', frameLabel: 'Encaje Mariposa', minutes: 135, defaultColor: '#C4B5FD' },
  { frameId: 'eclipse_sun_moon', frameLabel: 'Eclipse Místico', minutes: 140, defaultColor: '#F59E0B' },
  { frameId: 'botanical_ivy_gold', frameLabel: 'Hiedra Botánica', minutes: 145, defaultColor: '#4ADE80' },
  { frameId: 'prism_mosaic_halo', frameLabel: 'Mosaico Prisma', minutes: 150, defaultColor: '#38BDF8' },
  { frameId: 'harp_strings_crest', frameLabel: 'Arpa Celestial', minutes: 155, defaultColor: '#FDE047' },
  { frameId: 'pearl_shell_siren', frameLabel: 'Concha Perla', minutes: 160, defaultColor: '#5EEAD4' },
  { frameId: 'crown_jewel_scepter', frameLabel: 'Cetro Corona', minutes: 165, defaultColor: '#FBBF24' },
  { frameId: 'cat_ears_imperial', frameLabel: 'Gato Imperial', minutes: 170, defaultColor: '#F472B6' },
  { frameId: 'bunny_tiara_royal', frameLabel: 'Conejo Real', minutes: 175, defaultColor: '#F9A8D4' },
  { frameId: 'astral_zodiac_ring', frameLabel: 'Anillo Astral', minutes: 180, defaultColor: '#818CF8' },
  { frameId: 'diamond_lace_veil', frameLabel: 'Velo Diamante', minutes: 185, defaultColor: '#E0F2FE' },
  { frameId: 'rose_thorn_regal', frameLabel: 'Rosa Regia', minutes: 190, defaultColor: '#E11D48' },
  { frameId: 'galactic_ring_nova', frameLabel: 'Supernova', minutes: 195, defaultColor: '#A855F7' },
  { frameId: 'dreamcatcher_silk', frameLabel: 'Atrapasueños', minutes: 200, defaultColor: '#2DD4BF' },
  { frameId: 'cherub_wing_lace', frameLabel: 'Alas Querubín', minutes: 205, defaultColor: '#FBCFE8' },
  { frameId: 'emerald_cut_mirror', frameLabel: 'Espejo Esmeralda', minutes: 210, defaultColor: '#10B981' },
  { frameId: 'clover_crown_lucky', frameLabel: 'Trébol Real', minutes: 215, defaultColor: '#84CC16' },
  { frameId: 'serenade_vinyl_halo', frameLabel: 'Vinilo Dorado', minutes: 220, defaultColor: '#D97706' },
  { frameId: 'aurora_borealis_arc', frameLabel: 'Aurora Boreal', minutes: 225, defaultColor: '#22D3EE' },
  { frameId: 'mythic_phoenix_plume', frameLabel: 'Pluma Fénix', minutes: 230, defaultColor: '#F97316' },
  { frameId: 'moonlit_pagoda_ring', frameLabel: 'Luna Imperial', minutes: 235, defaultColor: '#A78BFA' },
  { frameId: 'infinite_knot_luxe', frameLabel: 'Nudo Infinito', minutes: 240, defaultColor: '#F43F5E' },
  { frameId: 'celestial_empress', frameLabel: 'Emperatriz Estelar', minutes: 245, defaultColor: '#EAB308' },
  { frameId: 'morinote_sovereign', frameLabel: 'Soberano MoriNote', minutes: 250, defaultColor: '#EC4899' },
];

/**
 * 22 precious medal badges awarded at key milestones — starting at 5 min (first badge)
 * and extending to long marathon records (30 min, 1h, 2h, 3h, 4h ... up to 8h).
 */
export const RECORD_BADGES: RecordBadge[] = [
  { id: 'badge_5m', minutes: 5, title: 'Perla del Alba', subtitle: '5 min continuos', tier: 'pearl', emblem: 'star', accentHex: '#F472B6', glowHex: '#FBCFE8' },
  { id: 'badge_15m', minutes: 15, title: 'Lazo de Cuarzo', subtitle: '15 min continuos', tier: 'rose_quartz', emblem: 'heart', accentHex: '#FB7185', glowHex: '#FECDD3' },
  { id: 'badge_30m', minutes: 30, title: 'Media Hora Dorada', subtitle: '30 min seguidos', tier: 'amber_gold', emblem: 'note', accentHex: '#F59E0B', glowHex: '#FDE68A' },
  { id: 'badge_45m', minutes: 45, title: 'Brisa Amatista', subtitle: '45 min seguidos', tier: 'amethyst', emblem: 'butterfly', accentHex: '#A78BFA', glowHex: '#DDD6FE' },
  { id: 'badge_60m', minutes: 60, title: 'Primera Hora Real', subtitle: '1 hora continua', tier: 'sapphire', emblem: 'crown', accentHex: '#38BDF8', glowHex: '#BAE6FD' },
  { id: 'badge_75m', minutes: 75, title: 'Esmeralda Pura', subtitle: '1h 15m continuos', tier: 'emerald', emblem: 'lotus', accentHex: '#10B981', glowHex: '#A7F3D0' },
  { id: 'badge_90m', minutes: 90, title: 'Luna de Zafiro', subtitle: '1h 30m continuos', tier: 'sapphire', emblem: 'moon', accentHex: '#60A5FA', glowHex: '#DBEAFE' },
  { id: 'badge_105m', minutes: 105, title: 'Alas de Diamante', subtitle: '1h 45m continuos', tier: 'diamond', emblem: 'wings', accentHex: '#2DD4BF', glowHex: '#99F6E4' },
  { id: 'badge_120m', minutes: 120, title: 'Corona Bicentenaria', subtitle: '2 horas seguidas', tier: 'amber_gold', emblem: 'crown', accentHex: '#EAB308', glowHex: '#FEF08A' },
  { id: 'badge_135m', minutes: 135, title: 'Prisma Encantado', subtitle: '2h 15m seguidos', tier: 'aurora', emblem: 'diamond', accentHex: '#C084FC', glowHex: '#F3E8FF' },
  { id: 'badge_150m', minutes: 150, title: 'Sinfonía Imperial', subtitle: '2h 30m seguidos', tier: 'rose_quartz', emblem: 'note', accentHex: '#EC4899', glowHex: '#FCE7F3' },
  { id: 'badge_165m', minutes: 165, title: 'Joya Celestial', subtitle: '2h 45m seguidos', tier: 'diamond', emblem: 'star', accentHex: '#22D3EE', glowHex: '#CFFAFE' },
  { id: 'badge_180m', minutes: 180, title: 'Emperatriz 3 Horas', subtitle: '3 horas continuas', tier: 'aurora', emblem: 'crown', accentHex: '#F43F5E', glowHex: '#FFE4E6' },
  { id: 'badge_195m', minutes: 195, title: 'Jardín Secreto', subtitle: '3h 15m continuos', tier: 'emerald', emblem: 'lotus', accentHex: '#34D399', glowHex: '#D1FAE5' },
  { id: 'badge_210m', minutes: 210, title: 'Vuelo Estelar', subtitle: '3h 30m continuos', tier: 'amethyst', emblem: 'butterfly', accentHex: '#818CF8', glowHex: '#E0E7FF' },
  { id: 'badge_225m', minutes: 225, title: 'Relicario de Luz', subtitle: '3h 45m continuos', tier: 'pearl', emblem: 'heart', accentHex: '#F472B6', glowHex: '#FCE7F3' },
  { id: 'badge_240m', minutes: 240, title: 'Medianoche 4 Horas', subtitle: '4 horas continuas', tier: 'sapphire', emblem: 'moon', accentHex: '#3B82F6', glowHex: '#BFDBFE' },
  { id: 'badge_270m', minutes: 270, title: 'Aura de Ángel', subtitle: '4h 30m continuos', tier: 'diamond', emblem: 'wings', accentHex: '#14B8A6', glowHex: '#CCFBF1' },
  { id: 'badge_300m', minutes: 300, title: 'Soberana 5 Horas', subtitle: '5 horas continuas', tier: 'amber_gold', emblem: 'crown', accentHex: '#D97706', glowHex: '#FEF3C7' },
  { id: 'badge_360m', minutes: 360, title: 'Constelación 6 Horas', subtitle: '6 horas continuas', tier: 'aurora', emblem: 'diamond', accentHex: '#A855F7', glowHex: '#F3E8FF' },
  { id: 'badge_420m', minutes: 420, title: 'Leyenda 7 Horas', subtitle: '7 horas continuas', tier: 'rose_quartz', emblem: 'star', accentHex: '#E11D48', glowHex: '#FFE4E6' },
  { id: 'badge_480m', minutes: 480, title: 'Eternidad MoriNote', subtitle: '8 horas seguidas · Máximo', tier: 'aurora', emblem: 'infinity', accentHex: '#EC4899', glowHex: '#FDE68A' },
];

export const PREMIUM_FRAME_IDS: AvatarFrameId[] = PREMIUM_FRAME_REWARDS.map((f) => f.frameId);
export const PREMIUM_FRAME_SET = new Set<AvatarFrameId>(PREMIUM_FRAME_IDS);

export const PREMIUM_FRAME_REQUIRED_MINUTES: Partial<Record<AvatarFrameId, number>> =
  Object.fromEntries(PREMIUM_FRAME_REWARDS.map((f) => [f.frameId, f.minutes]));

export function formatRecordMinutesLabel(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export const CUSTOM_FRAME_COLORS: Array<{ label: string; hex: string }> = [
  { label: 'Rosa Cristal', hex: '#F472B6' },
  { label: 'Fresa', hex: '#FB7185' },
  { label: 'Lavanda', hex: '#A78BFA' },
  { label: 'Violeta', hex: '#C084FC' },
  { label: 'Cielo', hex: '#38BDF8' },
  { label: 'Turquesa', hex: '#2DD4BF' },
  { label: 'Matcha', hex: '#86EFAC' },
  { label: 'Lima', hex: '#A3E635' },
  { label: 'Oro Real', hex: '#FBBF24' },
  { label: 'Durazno', hex: '#FB923C' },
  { label: 'Crema Perla', hex: '#F5E6D3' },
  { label: 'Caramelo', hex: '#B4835A' },
  { label: 'Borgoña', hex: '#9F1239' },
  { label: 'Noir Plata', hex: '#3F3F46' },
];
