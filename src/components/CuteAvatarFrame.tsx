import React from 'react';
import type { AvatarFrameId, CharmStickerId } from '../types/music';

interface CuteAvatarFrameProps {
  avatarUrl: string;
  displayName: string;
  frame: AvatarFrameId;
  frameColor?: string;
  size?: 'sm' | 'md' | 'lg';
  alwaysShowFrame?: boolean;
}

function normalizeHex(hex?: string, fallback = '#F472B6'): string {
  if (!hex) return fallback;
  const trimmed = hex.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
  }
  return fallback;
}

function tintHex(hex: string, ratioToWhite: number): string {
  const clean = normalizeHex(hex);
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  const mix = (c: number) =>
    Math.min(255, Math.max(0, Math.round(c + (255 - c) * ratioToWhite)));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function shadeHex(hex: string, ratioToBlack: number): string {
  const clean = normalizeHex(hex);
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  const mix = (c: number) => Math.max(0, Math.round(c * (1 - ratioToBlack)));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

type LuxeRingStyle =
  | 'double'
  | 'octagon'
  | 'scallop'
  | 'braid'
  | 'prism_hex'
  | 'celestial_ellipses'
  | 'arch_cathedral'
  | 'lace_ring';

type LuxeMotifKind =
  | 'tiara'
  | 'velvet_bow'
  | 'crescent_moon'
  | 'lotus'
  | 'laurel'
  | 'fairy_wings'
  | 'gems'
  | 'music_notes'
  | 'swans'
  | 'lanterns'
  | 'snowflakes'
  | 'hearts'
  | 'feathers'
  | 'butterflies'
  | 'cat_ears'
  | 'bunny_ears'
  | 'roses'
  | 'clovers'
  | 'vinyl'
  | 'stars';

interface LuxeFrameSpec {
  ring: LuxeRingStyle;
  motif: LuxeMotifKind;
  accent?: LuxeMotifKind;
  sparkles: number;
  rotateOffset?: number;
}

const LUXE_FRAME_SPECS: Partial<Record<AvatarFrameId, LuxeFrameSpec>> = {
  starlight_tiara: { ring: 'double', motif: 'tiara', accent: 'stars', sparkles: 6 },
  velvet_bow_luxe: { ring: 'scallop', motif: 'velvet_bow', accent: 'hearts', sparkles: 4 },
  aurora_crescent: { ring: 'celestial_ellipses', motif: 'crescent_moon', accent: 'stars', sparkles: 8 },
  lotus_sanctuary: { ring: 'double', motif: 'lotus', accent: 'gems', sparkles: 4 },
  symphony_laurel: { ring: 'braid', motif: 'laurel', accent: 'music_notes', sparkles: 6 },
  fairy_wing_filigree: { ring: 'lace_ring', motif: 'fairy_wings', accent: 'butterflies', sparkles: 6 },
  pearl_cathedral: { ring: 'arch_cathedral', motif: 'tiara', accent: 'gems', sparkles: 8 },
  gemstone_octagon: { ring: 'octagon', motif: 'gems', accent: 'stars', sparkles: 8 },
  melody_clef_crest: { ring: 'double', motif: 'music_notes', accent: 'stars', sparkles: 6 },
  swan_grace_ring: { ring: 'scallop', motif: 'swans', accent: 'feathers', sparkles: 4 },
  sakura_lanterns: { ring: 'braid', motif: 'lanterns', accent: 'roses', sparkles: 6 },
  opal_arch_halo: { ring: 'arch_cathedral', motif: 'gems', accent: 'crescent_moon', sparkles: 6 },
  royal_comet_trail: { ring: 'celestial_ellipses', motif: 'stars', accent: 'feathers', sparkles: 10 },
  stardust_compass: { ring: 'octagon', motif: 'stars', accent: 'gems', sparkles: 8, rotateOffset: 22.5 },
  ribbon_choker_luxe: { ring: 'lace_ring', motif: 'velvet_bow', accent: 'gems', sparkles: 6 },
  crystal_snowflake: { ring: 'prism_hex', motif: 'snowflakes', accent: 'gems', sparkles: 6 },
  charmed_hearts_ring: { ring: 'scallop', motif: 'hearts', accent: 'velvet_bow', sparkles: 6 },
  angelic_feather_crown: { ring: 'double', motif: 'feathers', accent: 'tiara', sparkles: 6 },
  twin_butterfly_lace: { ring: 'lace_ring', motif: 'butterflies', accent: 'hearts', sparkles: 6 },
  eclipse_sun_moon: { ring: 'celestial_ellipses', motif: 'crescent_moon', accent: 'lotus', sparkles: 8 },
  botanical_ivy_gold: { ring: 'braid', motif: 'laurel', accent: 'clovers', sparkles: 4 },
  prism_mosaic_halo: { ring: 'prism_hex', motif: 'gems', accent: 'stars', sparkles: 8 },
  harp_strings_crest: { ring: 'arch_cathedral', motif: 'music_notes', accent: 'feathers', sparkles: 6 },
  pearl_shell_siren: { ring: 'scallop', motif: 'lotus', accent: 'swans', sparkles: 8 },
  crown_jewel_scepter: { ring: 'octagon', motif: 'tiara', accent: 'gems', sparkles: 8 },
  cat_ears_imperial: { ring: 'double', motif: 'cat_ears', accent: 'gems', sparkles: 4 },
  bunny_tiara_royal: { ring: 'lace_ring', motif: 'bunny_ears', accent: 'tiara', sparkles: 6 },
  astral_zodiac_ring: { ring: 'celestial_ellipses', motif: 'stars', accent: 'crescent_moon', sparkles: 12 },
  diamond_lace_veil: { ring: 'lace_ring', motif: 'gems', accent: 'snowflakes', sparkles: 8 },
  rose_thorn_regal: { ring: 'braid', motif: 'roses', accent: 'hearts', sparkles: 4 },
  galactic_ring_nova: { ring: 'celestial_ellipses', motif: 'stars', accent: 'gems', sparkles: 10, rotateOffset: 15 },
  dreamcatcher_silk: { ring: 'double', motif: 'feathers', accent: 'crescent_moon', sparkles: 6 },
  cherub_wing_lace: { ring: 'scallop', motif: 'fairy_wings', accent: 'hearts', sparkles: 6 },
  emerald_cut_mirror: { ring: 'octagon', motif: 'gems', accent: 'laurel', sparkles: 8 },
  clover_crown_lucky: { ring: 'braid', motif: 'clovers', accent: 'tiara', sparkles: 6 },
  serenade_vinyl_halo: { ring: 'double', motif: 'vinyl', accent: 'music_notes', sparkles: 6 },
  aurora_borealis_arc: { ring: 'arch_cathedral', motif: 'stars', accent: 'fairy_wings', sparkles: 10 },
  mythic_phoenix_plume: { ring: 'prism_hex', motif: 'feathers', accent: 'lotus', sparkles: 8 },
  moonlit_pagoda_ring: { ring: 'arch_cathedral', motif: 'lanterns', accent: 'crescent_moon', sparkles: 6 },
  infinite_knot_luxe: { ring: 'braid', motif: 'hearts', accent: 'gems', sparkles: 8 },
  celestial_empress: { ring: 'celestial_ellipses', motif: 'tiara', accent: 'fairy_wings', sparkles: 10 },
  morinote_sovereign: { ring: 'prism_hex', motif: 'tiara', accent: 'music_notes', sparkles: 12 },
};

const renderMotifFragment = (
  kind: LuxeMotifKind,
  pMain: string,
  pSoft: string,
  pMid: string,
  pDeep: string,
  isSecondary = false
) => {
  const scale = isSecondary ? 0.78 : 1;
  switch (kind) {
    case 'tiara':
      return (
        <g transform={isSecondary ? 'translate(0,95) rotate(180 60 15)' : undefined}>
          <path d="M38 20 L44 7 L53 15 L60 4 L67 15 L76 7 L82 20 Z" fill={pSoft} stroke={pDeep} strokeWidth="1.9" strokeLinejoin="round" />
          <circle cx="60" cy="12" r="2.8" fill={pMain} stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="46" cy="14" r="2" fill={pMain} />
          <circle cx="74" cy="14" r="2" fill={pMain} />
        </g>
      );
    case 'velvet_bow':
      return (
        <g transform={isSecondary ? 'translate(60,104) scale(0.85)' : 'translate(60,15)'}>
          <path d="M0 0 C-10 -9 -20 -6 -16 3 C-12 8 -4 5 0 1 Z" fill={pMain} stroke={pDeep} strokeWidth="1.5" />
          <path d="M0 0 C10 -9 20 -6 16 3 C12 8 4 5 0 1 Z" fill={pMain} stroke={pDeep} strokeWidth="1.5" />
          <path d="M-3 2 L-9 12 L-2 9 Z M3 2 L9 12 L2 9 Z" fill={pMid} stroke={pDeep} strokeWidth="1.2" />
          <circle cx="0" cy="0.5" r="3.4" fill={pSoft} stroke={pDeep} strokeWidth="1.4" />
        </g>
      );
    case 'crescent_moon':
      return (
        <g transform={isSecondary ? 'translate(92,94) scale(0.85)' : 'translate(24,22)'}>
          <path d="M6 -9 A10 10 0 1 0 12 8 A7.5 7.5 0 0 1 6 -9 Z" fill={pSoft} stroke={pMain} strokeWidth="1.7" />
          <circle cx="8" cy="-2" r="1.8" fill="#FFFFFF" stroke={pMain} strokeWidth="0.9" />
        </g>
      );
    case 'lotus':
      return (
        <g transform={isSecondary ? 'translate(60,106) rotate(180)' : 'translate(60,14)'}>
          <path d="M0 -10 C5 -4 5 3 0 6 C-5 3 -5 -4 0 -10 Z" fill={pMain} stroke={pDeep} strokeWidth="1.3" />
          <path d="M0 5 C-8 3 -14 -2 -12 -8 C-6 -6 -2 -1 0 5 Z" fill={pSoft} stroke={pMain} strokeWidth="1.3" />
          <path d="M0 5 C8 3 14 -2 12 -8 C6 -6 2 -1 0 5 Z" fill={pSoft} stroke={pMain} strokeWidth="1.3" />
        </g>
      );
    case 'laurel':
      return (
        <g>
          {[28, 45, 62, 79].map((deg, idx) => (
            <g key={`l-${deg}`}>
              <ellipse cx={14 + idx * 1.4} cy={80 - idx * 14} rx="4.5" ry="2.4" transform={`rotate(${-35 + idx * 8} ${14 + idx * 1.4} ${80 - idx * 14})`} fill={pSoft} stroke={pMain} strokeWidth="1.2" />
              <ellipse cx={106 - idx * 1.4} cy={80 - idx * 14} rx="4.5" ry="2.4" transform={`rotate(${35 - idx * 8} ${106 - idx * 1.4} ${80 - idx * 14})`} fill={pSoft} stroke={pMain} strokeWidth="1.2" />
            </g>
          ))}
        </g>
      );
    case 'fairy_wings':
      return (
        <g transform={isSecondary ? 'translate(0,4) scale(0.92)' : undefined}>
          <path d="M16 54 C2 34 3 58 14 64 C4 70 8 88 22 80 Z" fill={pSoft} stroke={pMain} strokeWidth="1.8" opacity="0.92" />
          <path d="M104 54 C118 34 117 58 106 64 C116 70 112 88 98 80 Z" fill={pSoft} stroke={pMain} strokeWidth="1.8" opacity="0.92" />
          <path d="M10 48 L18 58 M110 48 L102 58" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case 'gems':
      return (
        <g>
          {[0, 90, 180, 270].map((deg) => (
            <g key={`gem-${deg}`} transform={`rotate(${deg + (isSecondary ? 45 : 0)} 60 60)`}>
              <polygon points="60,5 64.5,11 60,17 55.5,11" fill={deg % 180 === 0 ? pMain : pSoft} stroke="#FFFFFF" strokeWidth="1.1" />
            </g>
          ))}
        </g>
      );
    case 'music_notes':
      return (
        <g transform={`scale(${scale})`}>
          <g transform="translate(18,22)">
            <path d="M0 10 V-3 L9 -5 V7" fill="none" stroke={pDeep} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="-2.2" cy="10.5" r="2.7" fill={pMain} stroke="#FFFFFF" strokeWidth="0.9" />
            <circle cx="6.8" cy="8.5" r="2.7" fill={pSoft} stroke={pMain} strokeWidth="1" />
          </g>
          <g transform="translate(94,88)">
            <path d="M0 9 V-2 L7 -4 V6" fill="none" stroke={pDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="-2" cy="9.5" r="2.4" fill={pMain} stroke="#FFFFFF" strokeWidth="0.9" />
          </g>
        </g>
      );
    case 'swans':
      return (
        <g>
          <path d="M16 78 C11 64 14 48 22 46 C26 45 26 51 22 54 C19 56 21 66 25 74 Z" fill={pSoft} stroke={pMain} strokeWidth="1.5" />
          <path d="M104 78 C109 64 106 48 98 46 C94 45 94 51 98 54 C101 56 99 66 95 74 Z" fill={pSoft} stroke={pMain} strokeWidth="1.5" />
        </g>
      );
    case 'lanterns':
      return (
        <g>
          <g transform="translate(16,38)">
            <line x1="0" y1="-10" x2="0" y2="-4" stroke={pDeep} strokeWidth="1.3" />
            <rect x="-5" y="-4" width="10" height="12" rx="4" fill={pSoft} stroke={pMain} strokeWidth="1.5" />
            <line x1="0" y1="8" x2="0" y2="14" stroke={pMain} strokeWidth="1.4" />
          </g>
          <g transform="translate(104,38)">
            <line x1="0" y1="-10" x2="0" y2="-4" stroke={pDeep} strokeWidth="1.3" />
            <rect x="-5" y="-4" width="10" height="12" rx="4" fill={pSoft} stroke={pMain} strokeWidth="1.5" />
            <line x1="0" y1="8" x2="0" y2="14" stroke={pMain} strokeWidth="1.4" />
          </g>
        </g>
      );
    case 'snowflakes':
      return (
        <g>
          {[30, 150, 210, 330].map((deg) => (
            <g key={`sf-${deg}`} transform={`rotate(${deg} 60 60)`}>
              <path d="M60 5 V15 M56 8 L64 12 M64 8 L56 12" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="60" cy="10" r="1.6" fill={pMain} />
            </g>
          ))}
        </g>
      );
    case 'hearts':
      return (
        <g>
          {[[26, 24], [94, 24], [60, 108]].map(([x, y], idx) => (
            <path
              key={`hrt-${idx}`}
              transform={`translate(${x},${y}) scale(${isSecondary ? 0.75 : 0.95})`}
              d="M0 5 C-6 0 -7 -5 -3 -7 C0 -8 0 -4 0 -4 C0 -4 0 -8 3 -7 C7 -5 6 0 0 5 Z"
              fill={idx === 2 ? pMain : pSoft}
              stroke={pDeep}
              strokeWidth="1.3"
            />
          ))}
        </g>
      );
    case 'feathers':
      return (
        <g>
          <path d="M12 72 C6 54 12 36 24 28 C20 44 18 58 22 72 Z" fill={pSoft} stroke={pMain} strokeWidth="1.5" />
          <path d="M108 72 C114 54 108 36 96 28 C100 44 102 58 98 72 Z" fill={pSoft} stroke={pMain} strokeWidth="1.5" />
        </g>
      );
    case 'butterflies':
      return (
        <g>
          <g transform="translate(23,26) rotate(-25) scale(0.85)">
            <ellipse cx="-5" cy="-3" rx="6" ry="4" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="5" cy="-3" rx="6" ry="4" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="-4" cy="3" rx="4" ry="3" fill={pMid} stroke={pMain} strokeWidth="1.2" />
            <ellipse cx="4" cy="3" rx="4" ry="3" fill={pMid} stroke={pMain} strokeWidth="1.2" />
            <rect x="-1" y="-5" width="2" height="10" rx="1" fill={pDeep} />
          </g>
          <g transform="translate(97,92) rotate(145) scale(0.8)">
            <ellipse cx="-5" cy="-3" rx="6" ry="4" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="5" cy="-3" rx="6" ry="4" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <rect x="-1" y="-5" width="2" height="9" rx="1" fill={pDeep} />
          </g>
        </g>
      );
    case 'cat_ears':
      return (
        <g>
          <path d="M24 42 L20 12 L46 26 Z" fill={pSoft} stroke={pMain} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M27 36 L24 19 L40 27 Z" fill={pMain} />
          <path d="M96 42 L100 12 L74 26 Z" fill={pSoft} stroke={pMain} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M93 36 L96 19 L80 27 Z" fill={pMain} />
        </g>
      );
    case 'bunny_ears':
      return (
        <g>
          <ellipse cx="40" cy="17" rx="8" ry="17" transform="rotate(-14 40 17)" fill={pSoft} stroke={pMain} strokeWidth="2" />
          <ellipse cx="40" cy="18" rx="4" ry="10" transform="rotate(-14 40 18)" fill={pMid} />
          <ellipse cx="80" cy="17" rx="8" ry="17" transform="rotate(14 80 17)" fill={pSoft} stroke={pMain} strokeWidth="2" />
          <ellipse cx="80" cy="18" rx="4" ry="10" transform="rotate(14 80 18)" fill={pMid} />
        </g>
      );
    case 'roses':
      return (
        <g>
          {[[26, 26], [94, 26], [94, 94]].map(([x, y], i) => (
            <g key={`rs-${i}`} transform={`translate(${x},${y})`}>
              <circle cx="0" cy="0" r="6.5" fill={pMain} stroke={pDeep} strokeWidth="1.3" />
              <path d="M-2.5 -1 C-1 -3.5 3 -2.5 2.5 0.5 C2 3 -2.5 3.5 -2.5 0.5" fill="none" stroke={pSoft} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    case 'clovers':
      return (
        <g>
          {[[24, 26], [96, 94]].map(([x, y], i) => (
            <g key={`clv-${i}`} transform={`translate(${x},${y}) scale(0.85)`}>
              <circle cx="0" cy="-4" r="3.5" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
              <circle cx="4" cy="0" r="3.5" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
              <circle cx="0" cy="4" r="3.5" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
              <circle cx="-4" cy="0" r="3.5" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
            </g>
          ))}
        </g>
      );
    case 'vinyl':
      return (
        <g>
          <circle cx="60" cy="60" r="53.5" fill="none" stroke={pDeep} strokeWidth="2.4" strokeDasharray="10 4" />
          <g transform="translate(94,25)">
            <circle cx="0" cy="0" r="8" fill={pDeep} stroke={pMain} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3" fill={pSoft} />
          </g>
        </g>
      );
    case 'stars':
    default:
      return (
        <g>
          {[[22, 24], [98, 24], [22, 96], [98, 96]].map(([x, y], idx) => (
            <path
              key={`st-${idx}`}
              transform={`translate(${x},${y}) scale(${isSecondary ? 0.65 : 0.85})`}
              d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"
              fill={idx % 2 === 0 ? '#FFFFFF' : pMain}
              stroke={pDeep}
              strokeWidth="1"
            />
          ))}
        </g>
      );
  }
};

const LuxeRecordFrameSvg: React.FC<{
  spec: LuxeFrameSpec;
  pMain: string;
  pSoft: string;
  pMid: string;
  pDeep: string;
}> = ({ spec, pMain, pSoft, pMid, pDeep }) => {
  const rot = spec.rotateOffset ?? 0;
  return (
    <svg
      viewBox="0 0 120 120"
      className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10"
      aria-hidden="true"
    >
      {/* Ring Geometry */}
      <g transform={rot ? `rotate(${rot} 60 60)` : undefined}>
        {spec.ring === 'double' && (
          <>
            <circle cx="60" cy="60" r="47.5" fill="none" stroke={pMain} strokeWidth="3.1" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={pSoft} strokeWidth="1.8" strokeDasharray="5 3" />
          </>
        )}
        {spec.ring === 'octagon' && (
          <>
            <polygon points="41,10 79,10 110,41 110,79 79,110 41,110 10,79 10,41" fill="none" stroke={pMain} strokeWidth="2.8" strokeLinejoin="round" />
            <circle cx="60" cy="60" r="46.5" fill="none" stroke={pSoft} strokeWidth="2" />
          </>
        )}
        {spec.ring === 'scallop' && (
          <>
            <circle cx="60" cy="60" r="47.5" fill="none" stroke={pMain} strokeWidth="3" />
            <circle cx="60" cy="60" r="51.5" fill="none" stroke={pSoft} strokeWidth="3.8" strokeDasharray="1.5 6.5" strokeLinecap="round" />
          </>
        )}
        {spec.ring === 'braid' && (
          <>
            <circle cx="60" cy="60" r="47.5" fill="none" stroke={pDeep} strokeWidth="3.2" />
            <circle cx="60" cy="60" r="50.5" fill="none" stroke={pMid} strokeWidth="2.2" strokeDasharray="7 3" />
            <circle cx="60" cy="60" r="53" fill="none" stroke={pSoft} strokeWidth="1.2" />
          </>
        )}
        {spec.ring === 'prism_hex' && (
          <>
            <polygon points="60,8 106,34 106,86 60,112 14,86 14,34" fill="none" stroke={pMain} strokeWidth="2.6" strokeLinejoin="round" />
            <polygon points="60,12 102,36 102,84 60,108 18,84 18,36" fill="none" stroke={pSoft} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="60" cy="60" r="46.5" fill="none" stroke={pMid} strokeWidth="2" />
          </>
        )}
        {spec.ring === 'celestial_ellipses' && (
          <>
            <ellipse cx="60" cy="60" rx="56" ry="30" transform="rotate(-24 60 60)" fill="none" stroke={pMain} strokeWidth="2.2" />
            <ellipse cx="60" cy="60" rx="56" ry="30" transform="rotate(24 60 60)" fill="none" stroke={pSoft} strokeWidth="1.8" />
            <circle cx="60" cy="60" r="46.5" fill="none" stroke={pMid} strokeWidth="2.4" />
          </>
        )}
        {spec.ring === 'arch_cathedral' && (
          <>
            <circle cx="60" cy="62" r="47" fill="none" stroke={pMain} strokeWidth="3" />
            <path d="M14 66 A46 52 0 0 1 106 66" fill="none" stroke={pSoft} strokeWidth="2.2" strokeDasharray="4 2.5" />
          </>
        )}
        {spec.ring === 'lace_ring' && (
          <>
            <circle cx="60" cy="60" r="47" fill="none" stroke={pMid} strokeWidth="2.8" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={pSoft} strokeWidth="3.2" strokeDasharray="2 4.5" strokeLinecap="round" />
            <circle cx="60" cy="60" r="55" fill="none" stroke={pMain} strokeWidth="1.1" strokeDasharray="1 6" />
          </>
        )}
      </g>

      {/* Primary & Secondary Ornate Motifs */}
      {renderMotifFragment(spec.motif, pMain, pSoft, pMid, pDeep, false)}
      {spec.accent && renderMotifFragment(spec.accent, pMain, pSoft, pMid, pDeep, true)}

      {/* Perimeter Sparkles */}
      {Array.from({ length: spec.sparkles }).map((_, i) => {
        const deg = (i * 360) / spec.sparkles + 15;
        const rad = (deg * Math.PI) / 180;
        const cx = 60 + Math.cos(rad) * 52.5;
        const cy = 60 + Math.sin(rad) * 52.5;
        return (
          <circle
            key={`spk-${i}`}
            cx={cx}
            cy={cy}
            r={i % 2 === 0 ? 2.1 : 1.4}
            fill={i % 2 === 0 ? '#FFFFFF' : pMain}
            stroke={pDeep}
            strokeWidth="0.7"
          />
        );
      })}
    </svg>
  );
};

export const CuteAvatarFrame: React.FC<CuteAvatarFrameProps> = ({
  avatarUrl,
  displayName,
  frame,
  frameColor,
  size = 'lg',
  alwaysShowFrame = false,
}) => {
  const dim = size === 'lg' ? 'w-24 h-24' : size === 'md' ? 'w-14 h-14' : 'w-11 h-11';
  const showDecor = size === 'lg' || size === 'md' || alwaysShowFrame;
  const pMain = normalizeHex(frameColor, '#F472B6');
  const pSoft = tintHex(pMain, 0.72);
  const pMid = tintHex(pMain, 0.35);
  const pDeep = shadeHex(pMain, 0.28);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dim}`}>
      {/* Bunny Ears Frame */}
      {showDecor && frame === 'bunny' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <ellipse cx="40" cy="18" rx="9" ry="20" transform="rotate(-14 40 18)" fill="#FCE7F0" stroke="#F4B8CC" strokeWidth="2.5" />
          <ellipse cx="40" cy="19" rx="4.5" ry="12" transform="rotate(-14 40 19)" fill="#F7C9D9" />
          <ellipse cx="80" cy="18" rx="9" ry="20" transform="rotate(14 80 18)" fill="#FCE7F0" stroke="#F4B8CC" strokeWidth="2.5" />
          <ellipse cx="80" cy="19" rx="4.5" ry="12" transform="rotate(14 80 19)" fill="#F7C9D9" />
          <circle cx="60" cy="66" r="46" fill="none" stroke="#F4B8CC" strokeWidth="3" />
        </svg>
      )}

      {/* Kitty Ears Frame */}
      {showDecor && frame === 'kitty' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <path d="M24 44 L22 14 L46 28 Z" fill="#FFF2F6" stroke="#EEAFC4" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M27 38 L26 21 L40 29 Z" fill="#F8C8D9" />
          <path d="M96 44 L98 14 L74 28 Z" fill="#FFF2F6" stroke="#EEAFC4" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M93 38 L94 21 L80 29 Z" fill="#F8C8D9" />
          <circle cx="60" cy="63" r="46" fill="none" stroke="#EEAFC4" strokeWidth="2.8" />
          {/* Little whiskers */}
          <path d="M10 62 L21 64 M10 70 L21 69 M110 62 L99 64 M110 70 L99 69" stroke="#E89CB7" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}

      {/* Bear Ears Frame */}
      {showDecor && frame === 'bear' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="28" cy="28" r="14" fill="#F5E4D3" stroke="#D7B797" strokeWidth="2.5" />
          <circle cx="28" cy="28" r="7" fill="#E8C6A7" />
          <circle cx="92" cy="28" r="14" fill="#F5E4D3" stroke="#D7B797" strokeWidth="2.5" />
          <circle cx="92" cy="28" r="7" fill="#E8C6A7" />
          <circle cx="60" cy="63" r="46" fill="none" stroke="#D7B797" strokeWidth="3" />
        </svg>
      )}

      {/* Sakura Frame */}
      {showDecor && frame === 'sakura' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F4B8CC" strokeWidth="2.5" strokeDasharray="6 4" />
          <g transform="translate(92,26)">
            <circle cx="0" cy="-6" r="5" fill="#F9D5E2" />
            <circle cx="6" cy="-2" r="5" fill="#F9D5E2" />
            <circle cx="4" cy="5" r="5" fill="#F9D5E2" />
            <circle cx="-4" cy="5" r="5" fill="#F9D5E2" />
            <circle cx="-6" cy="-2" r="5" fill="#F9D5E2" />
            <circle cx="0" cy="0" r="3" fill="#F4B8CC" />
          </g>
          <g transform="translate(26,92) scale(0.85)">
            <circle cx="0" cy="-6" r="5" fill="#F9D5E2" />
            <circle cx="6" cy="-2" r="5" fill="#F9D5E2" />
            <circle cx="4" cy="5" r="5" fill="#F9D5E2" />
            <circle cx="-4" cy="5" r="5" fill="#F9D5E2" />
            <circle cx="-6" cy="-2" r="5" fill="#F9D5E2" />
            <circle cx="0" cy="0" r="3" fill="#F4B8CC" />
          </g>
        </svg>
      )}

      {/* Pearl Frame */}
      {showDecor && frame === 'pearl' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-2.5 w-[calc(100%+1.25rem)] h-[calc(100%+1.25rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          {Array.from({ length: 16 }).map((_, idx) => {
            const angle = (idx / 16) * Math.PI * 2;
            const cx = 60 + Math.cos(angle) * 51;
            const cy = 60 + Math.sin(angle) * 51;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="4.5"
                fill="#FFFFFF"
                stroke="#E4D7DF"
                strokeWidth="1.2"
              />
            );
          })}
        </svg>
      )}

      {/* Starry Frame */}
      {showDecor && frame === 'starry' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#AABEF7" strokeWidth="2.5" />
          <path d="M24 30 L27 37 L34 39 L27 42 L24 49 L21 42 L14 39 L21 37 Z" fill="#F9E2AE" stroke="#E5C675" strokeWidth="1" />
          <path d="M95 82 L97 87 L102 89 L97 91 L95 96 L93 91 L88 89 L93 87 Z" fill="#C8D6FC" stroke="#8FA8F2" strokeWidth="1" />
        </svg>
      )}

      {/* Ribbon Bow Frame */}
      {showDecor && frame === 'ribbon' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="62" r="46" fill="none" stroke="#F4B8CC" strokeWidth="2.8" />
          <g transform="translate(60,15)">
            <path d="M0 4 C-10 -8 -22 -6 -20 4 C-18 11 -6 10 0 4 Z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.8" />
            <path d="M0 4 C10 -8 22 -6 20 4 C18 11 6 10 0 4 Z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.8" />
            <path d="M-2 6 L-10 18 L-3 15 L0 8 M2 6 L10 18 L3 15 L0 8" fill="#F4B8CC" stroke="#E28FA8" strokeWidth="1.4" strokeLinejoin="round" />
            <circle cx="0" cy="4" r="3.8" fill="#FFF7FA" stroke="#E28FA8" strokeWidth="1.8" />
          </g>
        </svg>
      )}

      {/* Butterfly Frame */}
      {showDecor && frame === 'butterfly' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#CBB4F7" strokeWidth="2.4" strokeDasharray="4 3" />
          <g transform="translate(94,28) rotate(18)">
            <ellipse cx="-6" cy="-4" rx="6" ry="4.5" fill="#DFCFFC" stroke="#A78CE0" strokeWidth="1.4" />
            <ellipse cx="6" cy="-4" rx="6" ry="4.5" fill="#DFCFFC" stroke="#A78CE0" strokeWidth="1.4" />
            <ellipse cx="-5" cy="4" rx="4.2" ry="3.5" fill="#EAE0FE" stroke="#A78CE0" strokeWidth="1.3" />
            <ellipse cx="5" cy="4" rx="4.2" ry="3.5" fill="#EAE0FE" stroke="#A78CE0" strokeWidth="1.3" />
            <rect x="-1.2" y="-6" width="2.4" height="12" rx="1.2" fill="#8B6EC9" />
          </g>
          <g transform="translate(24,88) rotate(-22) scale(0.8)">
            <ellipse cx="-6" cy="-4" rx="6" ry="4.5" fill="#FCE0EA" stroke="#E29BB6" strokeWidth="1.4" />
            <ellipse cx="6" cy="-4" rx="6" ry="4.5" fill="#FCE0EA" stroke="#E29BB6" strokeWidth="1.4" />
            <ellipse cx="-5" cy="4" rx="4.2" ry="3.5" fill="#FFF0F5" stroke="#E29BB6" strokeWidth="1.3" />
            <ellipse cx="5" cy="4" rx="4.2" ry="3.5" fill="#FFF0F5" stroke="#E29BB6" strokeWidth="1.3" />
            <rect x="-1.2" y="-6" width="2.4" height="12" rx="1.2" fill="#D57A9E" />
          </g>
        </svg>
      )}

      {/* Crescent Moon Frame */}
      {showDecor && frame === 'moon' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#9FD3F7" strokeWidth="2.5" />
          <path d="M96 20 A11 11 0 1 0 105 36 A8.5 8.5 0 1 1 96 20 Z" fill="#FDF0C4" stroke="#E2BD5A" strokeWidth="1.4" />
          <circle cx="23" cy="27" r="2.6" fill="#F9E2AE" />
          <circle cx="28" cy="95" r="2.2" fill="#C4E4FC" />
        </svg>
      )}

      {/* Clover Frame */}
      {showDecor && frame === 'clover' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#9DD9B7" strokeWidth="2.6" />
          <g transform="translate(24,25)">
            <circle cx="0" cy="-4.5" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="4.5" cy="0" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="0" cy="4.5" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="-4.5" cy="0" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="2" fill="#6FB68E" />
          </g>
          <g transform="translate(95,93) scale(0.9)">
            <circle cx="0" cy="-4.5" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="4.5" cy="0" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="0" cy="4.5" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="-4.5" cy="0" r="4.2" fill="#B8E7CB" stroke="#6FB68E" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="2" fill="#6FB68E" />
          </g>
        </svg>
      )}

      {/* Hearts Garland Frame */}
      {showDecor && frame === 'heart' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F6B7A7" strokeWidth="2.5" />
          <path d="M93 33 C93 33 84 27 84 21 C84 18 87 16 90 16 C91.8 16 93 17.4 93 17.4 C93 17.4 94.2 16 96 16 C99 16 102 18 102 21 C102 27 93 33 93 33 Z" fill="#FAD0C4" stroke="#E58D7D" strokeWidth="1.4" />
          <path d="M27 101 C27 101 20 96 20 91 C20 88.5 22.3 87 24.5 87 C26 87 27 88 27 88 C27 88 28 87 29.5 87 C31.7 87 34 88.5 34 91 C34 96 27 101 27 101 Z" fill="#F8C8D9" stroke="#E28FA8" strokeWidth="1.3" />
        </svg>
      )}

      {/* Angel Halo & Wings Frame */}
      {showDecor && frame === 'angel' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          {/* Floating Halo */}
          <ellipse cx="60" cy="11" rx="22" ry="5" fill="none" stroke="#F2D27A" strokeWidth="3" />
          {/* Soft Wings */}
          <path d="M16 58 C4 48 6 66 15 69 C8 72 11 82 20 79" fill="#FFFFFF" stroke="#D5DCE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M104 58 C116 48 114 66 105 69 C112 72 109 82 100 79" fill="#FFFFFF" stroke="#D5DCE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="64" r="45" fill="none" stroke="#E4EAF4" strokeWidth="2.5" />
        </svg>
      )}

      {/* Pastel Headphones Frame */}
      {showDecor && frame === 'headphones' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <path d="M16 62 A44 44 0 0 1 104 62" fill="none" stroke="#B4DDF8" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="8" y="52" width="12" height="24" rx="6" fill="#E2F2FE" stroke="#8CC4EE" strokeWidth="2" />
          <rect x="100" y="52" width="12" height="24" rx="6" fill="#E2F2FE" stroke="#8CC4EE" strokeWidth="2" />
          <circle cx="60" cy="62" r="46" fill="none" stroke="#D4EBFB" strokeWidth="1.8" />
        </svg>
      )}

      {/* Floppy Puppy Frame */}
      {showDecor && frame === 'puppy' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <ellipse cx="20" cy="48" rx="11" ry="21" transform="rotate(18 20 48)" fill="#EED3B6" stroke="#C99F76" strokeWidth="2.4" />
          <ellipse cx="20" cy="50" rx="5.5" ry="12" transform="rotate(18 20 50)" fill="#DFB690" />
          <ellipse cx="100" cy="48" rx="11" ry="21" transform="rotate(-18 100 48)" fill="#EED3B6" stroke="#C99F76" strokeWidth="2.4" />
          <ellipse cx="100" cy="50" rx="5.5" ry="12" transform="rotate(-18 100 50)" fill="#DFB690" />
          <circle cx="60" cy="60" r="46" fill="none" stroke="#D9B18A" strokeWidth="2.8" />
          <path d="M60 112 C60 112 52 106 52 101 C52 98.5 54.5 97 57 97 C58.5 97 60 98.5 60 98.5 C60 98.5 61.5 97 63 97 C65.5 97 68 98.5 68 101 C68 106 60 112 60 112 Z" fill="#F9E2AE" stroke="#D9AD5B" strokeWidth="1.4" />
        </svg>
      )}

      {/* Panda Frame */}
      {showDecor && frame === 'panda' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="27" cy="27" r="13" fill="#443F46" stroke="#2D2930" strokeWidth="2" />
          <circle cx="27" cy="27" r="5.5" fill="#736C76" />
          <circle cx="93" cy="27" r="13" fill="#443F46" stroke="#2D2930" strokeWidth="2" />
          <circle cx="93" cy="27" r="5.5" fill="#736C76" />
          <circle cx="60" cy="62" r="46" fill="none" stroke="#E8E4E8" strokeWidth="3.2" />
          <g transform="translate(96,88) rotate(-25)">
            <ellipse cx="0" cy="-4" rx="4" ry="8" fill="#A6DFBC" stroke="#6FB68E" strokeWidth="1.2" />
            <ellipse cx="6" cy="2" rx="3.5" ry="7" transform="rotate(40 6 2)" fill="#BBEAD0" stroke="#6FB68E" strokeWidth="1.2" />
          </g>
        </svg>
      )}

      {/* Kawaii Frog Frame */}
      {showDecor && frame === 'frog' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="34" cy="23" r="12" fill="#C7EED7" stroke="#7FC49D" strokeWidth="2.4" />
          <circle cx="34" cy="23" r="5.5" fill="#FFFFFF" />
          <circle cx="35" cy="23" r="3" fill="#374151" />
          <circle cx="86" cy="23" r="12" fill="#C7EED7" stroke="#7FC49D" strokeWidth="2.4" />
          <circle cx="86" cy="23" r="5.5" fill="#FFFFFF" />
          <circle cx="85" cy="23" r="3" fill="#374151" />
          <circle cx="60" cy="63" r="46" fill="none" stroke="#9DD9B7" strokeWidth="3" />
          <ellipse cx="20" cy="70" rx="5" ry="3" fill="#FAD0DC" />
          <ellipse cx="100" cy="70" rx="5" ry="3" fill="#FAD0DC" />
        </svg>
      )}

      {/* Delicate Lace Frame */}
      {showDecor && frame === 'lace' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          {Array.from({ length: 20 }).map((_, idx) => {
            const angle = (idx / 20) * Math.PI * 2;
            const cx = 60 + Math.cos(angle) * 50;
            const cy = 60 + Math.sin(angle) * 50;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="6.2"
                fill="#FFF8FB"
                stroke="#F2C8D8"
                strokeWidth="1.2"
              />
            );
          })}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#F4B8CC" strokeWidth="2" />
          <g transform="translate(60,108) scale(0.7)">
            <path d="M0 0 C-9 -9 -18 -5 -16 3 C-14 9 -5 7 0 0 Z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.6" />
            <path d="M0 0 C9 -9 18 -5 16 3 C14 9 5 7 0 0 Z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.6" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" stroke="#E28FA8" strokeWidth="1.4" />
          </g>
        </svg>
      )}

      {/* Golden Sparkles Frame */}
      {showDecor && frame === 'sparkles' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F0D082" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M22 22 L24.5 29 L31.5 31.5 L24.5 34 L22 41 L19.5 34 L12.5 31.5 L19.5 29 Z" fill="#FDF0C4" stroke="#E2BD5A" strokeWidth="1.1" />
          <path d="M97 22 L99 27 L104 29 L99 31 L97 36 L95 31 L90 29 L95 27 Z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1" />
          <path d="M95 85 L97.5 92 L104.5 94.5 L97.5 97 L95 104 L92.5 97 L85.5 94.5 L92.5 92 Z" fill="#FDF0C4" stroke="#E2BD5A" strokeWidth="1.1" />
          <circle cx="23" cy="91" r="3.2" fill="#FFFFFF" stroke="#E2BD5A" strokeWidth="1.2" />
        </svg>
      )}

      {/* Fluffy Cloud Dream Frame */}
      {showDecor && frame === 'cloud_dream' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="46" fill="none" stroke="#B4DDF8" strokeWidth="2.4" />
          <g transform="translate(26,23)">
            <path d="M-12 6 H12 A5 5 0 0 0 13 -4 A7 7 0 0 0 -1 -5 A5.5 5.5 0 0 0 -12 6 Z" fill="#FFFFFF" stroke="#9CCDF2" strokeWidth="1.6" />
          </g>
          <g transform="translate(88,97)">
            <path d="M-14 6 H14 A5.5 5.5 0 0 0 15 -5 A7.5 7.5 0 0 0 -1 -6 A6 6 0 0 0 -14 6 Z" fill="#EBF6FF" stroke="#9CCDF2" strokeWidth="1.6" />
          </g>
          <circle cx="96" cy="27" r="2.5" fill="#FDF0C4" stroke="#E2BD5A" strokeWidth="1" />
        </svg>
      )}

      {/* Strawberry Frame */}
      {showDecor && frame === 'strawberry' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F6B7A7" strokeWidth="2.8" />
          <g transform="translate(23,24) rotate(-18)">
            <path d="M0 14 C-6 14 -10 7 -10 1 C-10 -3 -6 -6 0 -6 C6 -6 10 -3 10 1 C10 7 6 14 0 14 Z" fill="#FAD0DC" stroke="#E27A8D" strokeWidth="1.5" />
            <path d="M-6 -6 C-3 -9 3 -9 6 -6 C3 -4 -3 -4 -6 -6 Z" fill="#A4DCB9" stroke="#6EB68B" strokeWidth="1.2" />
            <circle cx="-3" cy="2" r="0.9" fill="#FFFFFF" />
            <circle cx="3" cy="2" r="0.9" fill="#FFFFFF" />
            <circle cx="0" cy="7" r="0.9" fill="#FFFFFF" />
          </g>
          <g transform="translate(95,93) rotate(16) scale(0.9)">
            <path d="M0 14 C-6 14 -10 7 -10 1 C-10 -3 -6 -6 0 -6 C6 -6 10 -3 10 1 C10 7 6 14 0 14 Z" fill="#FAD0DC" stroke="#E27A8D" strokeWidth="1.5" />
            <path d="M-6 -6 C-3 -9 3 -9 6 -6 C3 -4 -3 -4 -6 -6 Z" fill="#A4DCB9" stroke="#6EB68B" strokeWidth="1.2" />
            <circle cx="-3" cy="2" r="0.9" fill="#FFFFFF" />
            <circle cx="3" cy="2" r="0.9" fill="#FFFFFF" />
          </g>
        </svg>
      )}

      {/* Peach Blossom Frame */}
      {showDecor && frame === 'peach' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F6C5A3" strokeWidth="2.8" />
          <g transform="translate(95,26) rotate(12)">
            <path d="M0 -8 C-6 -10 -11 -4 -11 2 C-11 8 -5 13 0 14 C5 13 11 8 11 2 C11 -4 6 -10 0 -8 Z" fill="#FFD9C2" stroke="#E89A74" strokeWidth="1.5" />
            <path d="M0 -8 C2 -11 6 -12 8 -10 C6 -7 3 -6 0 -8 Z" fill="#A6DFBC" stroke="#6FB68E" strokeWidth="1.2" />
          </g>
          <g transform="translate(24,93) rotate(-14) scale(0.85)">
            <path d="M0 -8 C-6 -10 -11 -4 -11 2 C-11 8 -5 13 0 14 C5 13 11 8 11 2 C11 -4 6 -10 0 -8 Z" fill="#FFD9C2" stroke="#E89A74" strokeWidth="1.5" />
            <path d="M0 -8 C2 -11 6 -12 8 -10 C6 -7 3 -6 0 -8 Z" fill="#A6DFBC" stroke="#6FB68E" strokeWidth="1.2" />
          </g>
        </svg>
      )}

      {/* Flower Crown Frame */}
      {showDecor && frame === 'flower_crown' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="62" r="46" fill="none" stroke="#BBEAD0" strokeWidth="2.5" />
          {/* Leaves */}
          <ellipse cx="28" cy="29" rx="7" ry="3.5" transform="rotate(-35 28 29)" fill="#A6DFBC" stroke="#6FB68E" strokeWidth="1.1" />
          <ellipse cx="92" cy="29" rx="7" ry="3.5" transform="rotate(35 92 29)" fill="#A6DFBC" stroke="#6FB68E" strokeWidth="1.1" />
          {/* Left flower */}
          <g transform="translate(38,20)">
            <circle cx="0" cy="-4.5" r="3.8" fill="#DFCFFC" />
            <circle cx="4.5" cy="0" r="3.8" fill="#DFCFFC" />
            <circle cx="0" cy="4.5" r="3.8" fill="#DFCFFC" />
            <circle cx="-4.5" cy="0" r="3.8" fill="#DFCFFC" />
            <circle cx="0" cy="0" r="2.6" fill="#FDF0C4" />
          </g>
          {/* Center blossom */}
          <g transform="translate(60,14)">
            <circle cx="0" cy="-5.5" r="4.5" fill="#FAD0DC" />
            <circle cx="5.2" cy="-1.5" r="4.5" fill="#FAD0DC" />
            <circle cx="3.2" cy="4.5" r="4.5" fill="#FAD0DC" />
            <circle cx="-3.2" cy="4.5" r="4.5" fill="#FAD0DC" />
            <circle cx="-5.2" cy="-1.5" r="4.5" fill="#FAD0DC" />
            <circle cx="0" cy="0" r="3.2" fill="#F9E2AE" />
          </g>
          {/* Right flower */}
          <g transform="translate(82,20)">
            <circle cx="0" cy="-4.5" r="3.8" fill="#C4E4FC" />
            <circle cx="4.5" cy="0" r="3.8" fill="#C4E4FC" />
            <circle cx="0" cy="4.5" r="3.8" fill="#C4E4FC" />
            <circle cx="-4.5" cy="0" r="3.8" fill="#C4E4FC" />
            <circle cx="0" cy="0" r="2.6" fill="#FDF0C4" />
          </g>
        </svg>
      )}

      {/* Princess Tiara Crown Frame */}
      {showDecor && frame === 'crown' && (
        <svg
          viewBox="0 0 120 120"
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10"
          aria-hidden="true"
        >
          <circle cx="60" cy="64" r="45" fill="none" stroke="#F0D082" strokeWidth="2.8" />
          <path d="M36 24 L40 8 L51 17 L60 4 L69 17 L80 8 L84 24 Z" fill="#FDF0C4" stroke="#DDA93D" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="60" cy="16" r="2.8" fill="#F4A7C3" />
          <circle cx="46" cy="18" r="2" fill="#9FD3F7" />
          <circle cx="74" cy="18" r="2" fill="#9FD3F7" />
          <circle cx="60" cy="4" r="2.4" fill="#FFFFFF" stroke="#DDA93D" strokeWidth="1.1" />
        </svg>
      )}

      {/* === 24 NEW ORNATE / LAYERED RICH FRAMES === */}

      {/* Chocolate Lace (Marrón + Encaje crema) */}
      {showDecor && frame === 'chocolate_lace' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, idx) => {
            const a = (idx / 22) * Math.PI * 2;
            return <circle key={idx} cx={60 + Math.cos(a) * 51} cy={60 + Math.sin(a) * 51} r="5.5" fill="#F7EAE0" stroke="#7A503B" strokeWidth="1.4" />;
          })}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#5A3928" strokeWidth="3.2" />
          <circle cx="60" cy="60" r="49" fill="none" stroke="#D9B391" strokeWidth="1.2" strokeDasharray="3 3" />
          <g transform="translate(60,109)">
            <path d="M0 0 C-10 -9 -20 -5 -18 3 C-16 9 -5 7 0 0 Z" fill="#8D5D43" stroke="#4D2F20" strokeWidth="1.4" />
            <path d="M0 0 C10 -9 20 -5 18 3 C16 9 5 7 0 0 Z" fill="#8D5D43" stroke="#4D2F20" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="3.2" fill="#F7EAE0" stroke="#4D2F20" strokeWidth="1.3" />
          </g>
        </svg>
      )}

      {/* Espresso Gold (Marrón oscuro + Dorado ornamental) */}
      {showDecor && frame === 'espresso_gold' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#3B2318" strokeWidth="5.5" />
          <circle cx="60" cy="60" r="47" fill="none" stroke="#E8C77B" strokeWidth="2" />
          <circle cx="60" cy="60" r="53" fill="none" stroke="#E8C77B" strokeWidth="1.5" strokeDasharray="4 4" />
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 60 60) translate(60 8)`}>
              <path d="M0 -4 L4 0 L0 4 L-4 0 Z" fill="#FDF0C4" stroke="#C5963B" strokeWidth="1.3" />
            </g>
          ))}
        </svg>
      )}

      {/* Caramel Bear (Osito marrón acaramelado cargado) */}
      {showDecor && frame === 'caramel_bear' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="27" cy="27" r="14.5" fill="#9E6A47" stroke="#5E3A24" strokeWidth="2.4" />
          <circle cx="27" cy="27" r="7.5" fill="#E3BC9A" />
          <circle cx="93" cy="27" r="14.5" fill="#9E6A47" stroke="#5E3A24" strokeWidth="2.4" />
          <circle cx="93" cy="27" r="7.5" fill="#E3BC9A" />
          <circle cx="60" cy="62" r="47" fill="none" stroke="#8B5A3C" strokeWidth="4" />
          <circle cx="60" cy="62" r="50.5" fill="none" stroke="#E8CAAE" strokeWidth="1.5" strokeDasharray="3 3" />
          <g transform="translate(60,108)">
            <path d="M0 0 C-10 -8 -20 -4 -17 4 C-14 9 -5 6 0 0 Z" fill="#F4D3B6" stroke="#8B5A3C" strokeWidth="1.4" />
            <path d="M0 0 C10 -8 20 -4 17 4 C14 9 5 6 0 0 Z" fill="#F4D3B6" stroke="#8B5A3C" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="3" fill="#FFF8F0" stroke="#8B5A3C" strokeWidth="1.4" />
          </g>
        </svg>
      )}

      {/* Mocha Bunny (Conejito café latte con moño) */}
      {showDecor && frame === 'mocha_bunny' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <ellipse cx="40" cy="18" rx="9" ry="20" transform="rotate(-14 40 18)" fill="#A67B5B" stroke="#5E3D28" strokeWidth="2.3" />
          <ellipse cx="40" cy="19" rx="4.5" ry="12" transform="rotate(-14 40 19)" fill="#EED2BC" />
          <ellipse cx="80" cy="18" rx="9" ry="20" transform="rotate(14 80 18)" fill="#A67B5B" stroke="#5E3D28" strokeWidth="2.3" />
          <ellipse cx="80" cy="19" rx="4.5" ry="12" transform="rotate(14 80 19)" fill="#EED2BC" />
          <circle cx="60" cy="65" r="46" fill="none" stroke="#8C5E40" strokeWidth="3.5" />
          <circle cx="20" cy="88" r="4" fill="#F7E4D4" stroke="#8C5E40" strokeWidth="1.3" />
          <circle cx="100" cy="88" r="4" fill="#F7E4D4" stroke="#8C5E40" strokeWidth="1.3" />
        </svg>
      )}

      {/* Latte Ribbon (Crema café con lazo doble) */}
      {showDecor && frame === 'latte_ribbon' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="62" r="47" fill="none" stroke="#B68964" strokeWidth="3.5" />
          <circle cx="60" cy="62" r="51" fill="none" stroke="#E5CFB8" strokeWidth="1.6" strokeDasharray="5 3" />
          <g transform="translate(60,14)">
            <path d="M0 4 C-12 -10 -26 -6 -23 5 C-20 13 -7 11 0 4 Z" fill="#DFC2A4" stroke="#8C6242" strokeWidth="1.7" />
            <path d="M0 4 C12 -10 26 -6 23 5 C20 13 7 11 0 4 Z" fill="#DFC2A4" stroke="#8C6242" strokeWidth="1.7" />
            <path d="M-2 6 L-12 21 L-4 17 L0 8 M2 6 L12 21 L4 17 L0 8" fill="#C49A76" stroke="#8C6242" strokeWidth="1.4" strokeLinejoin="round" />
            <circle cx="0" cy="4" r="4" fill="#FFF9F2" stroke="#8C6242" strokeWidth="1.6" />
          </g>
        </svg>
      )}

      {/* Noir Velvet (Negro terciopelo encaje oscuro) */}
      {showDecor && frame === 'noir_velvet' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, idx) => {
            const a = (idx / 20) * Math.PI * 2;
            return <circle key={idx} cx={60 + Math.cos(a) * 51} cy={60 + Math.sin(a) * 51} r="5.5" fill="#1F2028" stroke="#525566" strokeWidth="1.4" />;
          })}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#111216" strokeWidth="3.5" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#E5E7EB" strokeWidth="1.1" strokeDasharray="2 4" />
          <g transform="translate(60,108)">
            <path d="M0 0 C-10 -9 -20 -5 -18 3 C-16 9 -5 7 0 0 Z" fill="#2A2C36" stroke="#D1D5DB" strokeWidth="1.3" />
            <path d="M0 0 C10 -9 20 -5 18 3 C16 9 5 7 0 0 Z" fill="#2A2C36" stroke="#D1D5DB" strokeWidth="1.3" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" stroke="#111216" strokeWidth="1.2" />
          </g>
        </svg>
      )}

      {/* Noir Pearls (Negro + Perlas blancas y moño) */}
      {showDecor && frame === 'noir_pearls' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#181920" strokeWidth="5.5" />
          {Array.from({ length: 18 }).map((_, idx) => {
            const a = (idx / 18) * Math.PI * 2;
            return <circle key={idx} cx={60 + Math.cos(a) * 51} cy={60 + Math.sin(a) * 51} r="4.2" fill="#FFFFFF" stroke="#181920" strokeWidth="1.5" />;
          })}
          <g transform="translate(60,11)">
            <path d="M0 3 C-9 -7 -19 -4 -17 4 C-15 10 -5 8 0 3 Z" fill="#181920" stroke="#FFFFFF" strokeWidth="1.4" />
            <path d="M0 3 C9 -7 19 -4 17 4 C15 10 5 8 0 3 Z" fill="#181920" stroke="#FFFFFF" strokeWidth="1.4" />
            <circle cx="0" cy="3" r="3" fill="#FFFFFF" />
          </g>
        </svg>
      )}

      {/* Noir Crown (Corona oscura elegante) */}
      {showDecor && frame === 'noir_crown' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="64" r="46" fill="none" stroke="#1C1D24" strokeWidth="4" />
          <circle cx="60" cy="64" r="49.5" fill="none" stroke="#C5B0D8" strokeWidth="1.4" strokeDasharray="4 3" />
          <path d="M35 24 L40 8 L51 17 L60 4 L69 17 L80 8 L85 24 Z" fill="#232530" stroke="#E2C77E" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="60" cy="16" r="2.8" fill="#F4A7C3" />
          <circle cx="46" cy="18" r="2" fill="#E2C77E" />
          <circle cx="74" cy="18" r="2" fill="#E2C77E" />
        </svg>
      )}

      {/* Noir Kitty (Gatito negro chic con moñito rosa/plata) */}
      {showDecor && frame === 'noir_kitty' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <path d="M24 44 L21 13 L47 28 Z" fill="#1C1D24" stroke="#D1D5DB" strokeWidth="2" strokeLinejoin="round" />
          <path d="M27 38 L25 20 L40 29 Z" fill="#F4A7C3" />
          <path d="M96 44 L99 13 L73 28 Z" fill="#1C1D24" stroke="#D1D5DB" strokeWidth="2" strokeLinejoin="round" />
          <path d="M93 38 L95 20 L80 29 Z" fill="#F4A7C3" />
          <circle cx="60" cy="63" r="46" fill="none" stroke="#1C1D24" strokeWidth="4" />
          <circle cx="60" cy="63" r="48.5" fill="none" stroke="#F4A7C3" strokeWidth="1.3" strokeDasharray="3 3" />
          <path d="M8 62 L21 64 M8 70 L21 69 M112 62 L99 64 M112 70 L99 69" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}

      {/* Gothic Moon (Luna nocturna oscura con estrellas) */}
      {showDecor && frame === 'gothic_moon' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#1E1B29" strokeWidth="4.2" />
          <circle cx="60" cy="60" r="50.5" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 4" />
          <path d="M95 18 A12 12 0 1 0 107 36 A9 9 0 1 1 95 18 Z" fill="#E9D5FF" stroke="#4C1D95" strokeWidth="1.4" />
          <path d="M23 23 L25.5 29 L31.5 31.5 L25.5 34 L23 40 L20.5 34 L14.5 31.5 L20.5 29 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
          <circle cx="24" cy="95" r="3" fill="#DDD6FE" />
        </svg>
      )}

      {/* Pistachio Garden (Pistacho floral abundante) */}
      {showDecor && frame === 'pistachio_garden' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#98CA7B" strokeWidth="4" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#D2ECC2" strokeWidth="1.8" strokeDasharray="5 3" />
          {[[26, 28], [94, 28], [26, 92], [94, 92]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle cx="0" cy="-4.5" r="4" fill="#E9F7DF" stroke="#6B9E52" strokeWidth="1" />
              <circle cx="4.5" cy="0" r="4" fill="#E9F7DF" stroke="#6B9E52" strokeWidth="1" />
              <circle cx="0" cy="4.5" r="4" fill="#E9F7DF" stroke="#6B9E52" strokeWidth="1" />
              <circle cx="-4.5" cy="0" r="4" fill="#E9F7DF" stroke="#6B9E52" strokeWidth="1" />
              <circle cx="0" cy="0" r="2.6" fill="#FDE68A" />
            </g>
          ))}
        </svg>
      )}

      {/* Pistachio Cream (Crema pistacho con lazos y perlas) */}
      {showDecor && frame === 'pistachio_cream' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, idx) => {
            const a = (idx / 18) * Math.PI * 2;
            return <circle key={idx} cx={60 + Math.cos(a) * 51} cy={60 + Math.sin(a) * 51} r="4.6" fill="#E8F6DC" stroke="#7EB863" strokeWidth="1.2" />;
          })}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#82BC68" strokeWidth="3" />
          <g transform="translate(60,11)">
            <path d="M0 2 C-10 -8 -20 -4 -18 4 C-16 10 -6 8 0 2 Z" fill="#C4E6AE" stroke="#5E9446" strokeWidth="1.5" />
            <path d="M0 2 C10 -8 20 -4 18 4 C16 10 6 8 0 2 Z" fill="#C4E6AE" stroke="#5E9446" strokeWidth="1.5" />
            <circle cx="0" cy="2" r="3.2" fill="#FFFDF5" stroke="#5E9446" strokeWidth="1.4" />
          </g>
        </svg>
      )}

      {/* Matcha Bloom (Matcha té verde y flores blancas) */}
      {showDecor && frame === 'matcha_bloom' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#629D6E" strokeWidth="3.8" />
          <ellipse cx="26" cy="30" rx="8" ry="4" transform="rotate(-35 26 30)" fill="#98D4A4" stroke="#4D8058" strokeWidth="1.2" />
          <ellipse cx="94" cy="30" rx="8" ry="4" transform="rotate(35 94 30)" fill="#98D4A4" stroke="#4D8058" strokeWidth="1.2" />
          <ellipse cx="26" cy="90" rx="8" ry="4" transform="rotate(35 26 90)" fill="#98D4A4" stroke="#4D8058" strokeWidth="1.2" />
          <ellipse cx="94" cy="90" rx="8" ry="4" transform="rotate(-35 94 90)" fill="#98D4A4" stroke="#4D8058" strokeWidth="1.2" />
          <g transform="translate(60,12)">
            <circle cx="0" cy="-4.5" r="4" fill="#FFFFFF" stroke="#629D6E" strokeWidth="1.1" />
            <circle cx="4.5" cy="0" r="4" fill="#FFFFFF" stroke="#629D6E" strokeWidth="1.1" />
            <circle cx="0" cy="4.5" r="4" fill="#FFFFFF" stroke="#629D6E" strokeWidth="1.1" />
            <circle cx="-4.5" cy="0" r="4" fill="#FFFFFF" stroke="#629D6E" strokeWidth="1.1" />
            <circle cx="0" cy="0" r="2.5" fill="#F6C5A3" />
          </g>
        </svg>
      )}

      {/* Double Sakura (Sakura súper cargada) */}
      {showDecor && frame === 'double_sakura' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F4A7C3" strokeWidth="3.5" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#FAD5E2" strokeWidth="1.8" strokeDasharray="3 3" />
          {[[26, 26], [94, 26], [26, 94], [94, 94], [60, 11]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y}) scale(${i === 4 ? 1.05 : 0.88})`}>
              <circle cx="0" cy="-5.5" r="4.5" fill="#F9D5E2" stroke="#E69DB6" strokeWidth="1" />
              <circle cx="5.2" cy="-1.7" r="4.5" fill="#F9D5E2" stroke="#E69DB6" strokeWidth="1" />
              <circle cx="3.2" cy="4.5" r="4.5" fill="#F9D5E2" stroke="#E69DB6" strokeWidth="1" />
              <circle cx="-3.2" cy="4.5" r="4.5" fill="#F9D5E2" stroke="#E69DB6" strokeWidth="1" />
              <circle cx="-5.2" cy="-1.7" r="4.5" fill="#F9D5E2" stroke="#E69DB6" strokeWidth="1" />
              <circle cx="0" cy="0" r="2.6" fill="#FFF3B0" />
            </g>
          ))}
        </svg>
      )}

      {/* Pearl Tiara (Perlas + Tiara real) */}
      {showDecor && frame === 'pearl_tiara' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, idx) => {
            const a = (idx / 18) * Math.PI * 2;
            return <circle key={idx} cx={60 + Math.cos(a) * 50} cy={63 + Math.sin(a) * 50} r="4" fill="#FFFFFF" stroke="#DFC8D8" strokeWidth="1.2" />;
          })}
          <path d="M36 22 L41 7 L51 15 L60 3 L69 15 L79 7 L84 22 Z" fill="#FFF7FB" stroke="#E29BB6" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="60" cy="14" r="3" fill="#FAD0DC" />
        </svg>
      )}

      {/* Royal Baroque (Dorado barroco recargado) */}
      {showDecor && frame === 'royal_baroque' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#D9A84E" strokeWidth="4.2" />
          <circle cx="60" cy="60" r="51.5" fill="none" stroke="#F6E3A6" strokeWidth="2" strokeDasharray="6 3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle key={deg} cx={60 + Math.cos((deg * Math.PI) / 180) * 51} cy={60 + Math.sin((deg * Math.PI) / 180) * 51} r="3.6" fill="#FDF0C4" stroke="#B6822A" strokeWidth="1.2" />
          ))}
        </svg>
      )}

      {/* Galaxy Night (Galaxia estelar) */}
      {showDecor && frame === 'galaxy_night' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#312E81" strokeWidth="4.5" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 4" />
          <ellipse cx="60" cy="60" rx="56" ry="22" transform="rotate(-22 60 60)" fill="none" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.85" />
          <path d="M21 28 L23 34 L29 36 L23 38 L21 44 L19 38 L13 36 L19 34 Z" fill="#FDE68A" />
          <circle cx="98" cy="86" r="3.2" fill="#93C5FD" />
          <circle cx="92" cy="24" r="2.6" fill="#F9A8D4" />
        </svg>
      )}

      {/* Butterfly Royal (Mariposas múltiples cargadas) */}
      {showDecor && frame === 'butterfly_royal' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#C084FC" strokeWidth="3.2" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#F9A8D4" strokeWidth="1.5" strokeDasharray="3 4" />
          {[[24, 26, -24], [96, 28, 24], [24, 92, 20], [96, 92, -20]].map(([x, y, rot], idx) => (
            <g key={idx} transform={`translate(${x},${y}) rotate(${rot}) scale(0.95)`}>
              <ellipse cx="-5.5" cy="-3.5" rx="5.5" ry="4" fill={idx % 2 === 0 ? '#E9D5FF' : '#FBCFE8'} stroke="#9333EA" strokeWidth="1.2" />
              <ellipse cx="5.5" cy="-3.5" rx="5.5" ry="4" fill={idx % 2 === 0 ? '#E9D5FF' : '#FBCFE8'} stroke="#9333EA" strokeWidth="1.2" />
              <ellipse cx="-4" cy="3.5" rx="3.8" ry="3" fill="#FAF5FF" stroke="#9333EA" strokeWidth="1.1" />
              <ellipse cx="4" cy="3.5" rx="3.8" ry="3" fill="#FAF5FF" stroke="#9333EA" strokeWidth="1.1" />
              <rect x="-1" y="-5" width="2" height="10" rx="1" fill="#6B21A8" />
            </g>
          ))}
        </svg>
      )}

      {/* Strawberry Lace (Fresitas con encaje crema) */}
      {showDecor && frame === 'strawberry_lace' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, idx) => {
            const a = (idx / 18) * Math.PI * 2;
            return <circle key={idx} cx={60 + Math.cos(a) * 51} cy={60 + Math.sin(a) * 51} r="4.8" fill="#FFF1F5" stroke="#F472B6" strokeWidth="1.2" />;
          })}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#F472B6" strokeWidth="2.8" />
          {[[23, 24, -18], [97, 94, 18]].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
              <path d="M0 13 C-6 13 -9.5 6 -9.5 1 C-9.5 -3 -5.5 -5.5 0 -5.5 C5.5 -5.5 9.5 -3 9.5 1 C9.5 6 6 13 0 13 Z" fill="#FB7185" stroke="#BE123C" strokeWidth="1.4" />
              <path d="M-5 -5.5 C-2 -8 2 -8 5 -5.5 C2 -3.5 -2 -3.5 -5 -5.5 Z" fill="#86EFAC" stroke="#15803D" strokeWidth="1.1" />
            </g>
          ))}
        </svg>
      )}

      {/* Cherry Cream (Cerezas pastel + crema) */}
      {showDecor && frame === 'cherry_cream' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#FB7185" strokeWidth="3.2" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#FFE4E6" strokeWidth="2" strokeDasharray="4 3" />
          <g transform="translate(88,20)">
            <path d="M6 -6 C2 0 -2 4 -4 8 M6 -6 C10 0 12 4 12 8" stroke="#4D7C0F" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="-4" cy="10" r="5" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.3" />
            <circle cx="12" cy="10" r="5" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.3" />
          </g>
          <g transform="translate(22,86) scale(0.85)">
            <path d="M6 -6 C2 0 -2 4 -4 8 M6 -6 C10 0 12 4 12 8" stroke="#4D7C0F" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="-4" cy="10" r="5" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.3" />
            <circle cx="12" cy="10" r="5" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.3" />
          </g>
        </svg>
      )}

      {/* Vintage Rose (Rosetón vintage) */}
      {showDecor && frame === 'vintage_rose' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#B76E79" strokeWidth="3.5" />
          <circle cx="60" cy="60" r="51.5" fill="none" stroke="#E9D2D5" strokeWidth="1.8" />
          {[[26, 26], [94, 94], [94, 26]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle cx="0" cy="0" r="7.5" fill="#E8A5B0" stroke="#9E4B5A" strokeWidth="1.3" />
              <path d="M-3 -1 C-1 -4 3 -3 3 0 C3 3 -2 4 -3 1" fill="none" stroke="#9E4B5A" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      )}

      {/* Angel Gold (Alas doradas + halo) */}
      {showDecor && frame === 'angel_gold' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <ellipse cx="60" cy="10" rx="23" ry="5" fill="none" stroke="#EAB308" strokeWidth="3.2" />
          <path d="M16 56 C2 44 4 65 14 69 C6 74 10 86 21 82" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <path d="M104 56 C118 44 116 65 106 69 C114 74 110 86 99 82" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="63" r="46" fill="none" stroke="#FDE047" strokeWidth="2.8" />
        </svg>
      )}

      {/* Lavender Dream (Lavanda doble y lunas) */}
      {showDecor && frame === 'lavender_dream' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#A78BFA" strokeWidth="3.4" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#DDD6FE" strokeWidth="1.8" strokeDasharray="4 3" />
          <path d="M22 28 L25 34 L31 36 L25 38 L22 44 L19 38 L13 36 L19 34 Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.1" />
          <path d="M96 86 L98 91 L103 93 L98 95 L96 100 L94 95 L89 93 L94 91 Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.1" />
        </svg>
      )}

      {/* Honey Bee (Miel dorada) */}
      {showDecor && frame === 'honey_bee' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#FDE68A" strokeWidth="1.8" strokeDasharray="5 3" />
          <g transform="translate(94,25) rotate(15)">
            <ellipse cx="-2" cy="-5" rx="4" ry="2.8" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
            <ellipse cx="3" cy="-5" rx="4" ry="2.8" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
            <ellipse cx="0" cy="0" rx="6.5" ry="4.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.3" />
            <path d="M-2 -4 V4 M2 -4 V4" stroke="#78350F" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {/* === PREMIUM / UNIQUE RECORD-UNLOCKABLE CUSTOM-COLOR FRAMES === */}

      {/* 1. Prisma Cristal (prism_aura) */}
      {showDecor && frame === 'prism_aura' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" stroke={pSoft} strokeWidth="2.2" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="47.5" fill="none" stroke={pMain} strokeWidth="3.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 60 60)`}>
              <polygon points="60,3 64,11 60,17 56,11" fill={deg % 90 === 0 ? pMain : pSoft} stroke="#FFFFFF" strokeWidth="1.1" />
            </g>
          ))}
        </svg>
      )}

      {/* 2. Alas de Cristal (crystal_wings) */}
      {showDecor && frame === 'crystal_wings' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <path d="M16 54 C1 36 2 62 15 67 C3 74 8 92 24 84 Z" fill={pSoft} stroke={pMain} strokeWidth="2" strokeLinejoin="round" />
          <path d="M104 54 C119 36 118 62 105 67 C117 74 112 92 96 84 Z" fill={pSoft} stroke={pMain} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="60" cy="62" r="46.5" fill="none" stroke={pMain} strokeWidth="3" />
          <circle cx="60" cy="62" r="50.5" fill="none" stroke={pSoft} strokeWidth="1.5" />
          <path d="M60 11 L65 18 L60 25 L55 18 Z" fill={pMain} stroke="#FFFFFF" strokeWidth="1.3" />
        </svg>
      )}

      {/* 3. Corona Suprema (royal_prism_crown) */}
      {showDecor && frame === 'royal_prism_crown' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="64" r="47" fill="none" stroke={pMain} strokeWidth="3.4" />
          <circle cx="60" cy="64" r="51.5" fill="none" stroke={pSoft} strokeWidth="1.8" strokeDasharray="5 2.5" />
          <path d="M36 22 L42 6 L52 16 L60 3 L68 16 L78 6 L84 22 Z" fill={pSoft} stroke={pDeep} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="60" cy="14" r="3.4" fill={pMain} stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="44" cy="16" r="2.3" fill={pMain} />
          <circle cx="76" cy="16" r="2.3" fill={pMain} />
          <circle cx="15" cy="64" r="3" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
          <circle cx="105" cy="64" r="3" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
        </svg>
      )}

      {/* 4. Mariposas Prism (holo_butterfly) */}
      {showDecor && frame === 'holo_butterfly' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47.5" fill="none" stroke={pMid} strokeWidth="2.8" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={pSoft} strokeWidth="1.4" strokeDasharray="2 5" />
          <g transform="translate(24,25) rotate(-25)">
            <ellipse cx="-6" cy="-4" rx="7" ry="5" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="6" cy="-4" rx="7" ry="5" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="-5" cy="4" rx="5" ry="4" fill={pMid} stroke={pMain} strokeWidth="1.2" />
            <ellipse cx="5" cy="4" rx="5" ry="4" fill={pMid} stroke={pMain} strokeWidth="1.2" />
            <rect x="-1.2" y="-6" width="2.4" height="12" rx="1.2" fill={pDeep} />
          </g>
          <g transform="translate(95,93) rotate(145) scale(0.88)">
            <ellipse cx="-6" cy="-4" rx="7" ry="5" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="6" cy="-4" rx="7" ry="5" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
            <ellipse cx="-5" cy="4" rx="5" ry="4" fill={pMid} stroke={pMain} strokeWidth="1.2" />
            <ellipse cx="5" cy="4" rx="5" ry="4" fill={pMid} stroke={pMain} strokeWidth="1.2" />
            <rect x="-1.2" y="-6" width="2.4" height="12" rx="1.2" fill={pDeep} />
          </g>
        </svg>
      )}

      {/* 5. Diamante Halo (diamond_halo) */}
      {showDecor && frame === 'diamond_halo' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <polygon points="60,8 106,34 106,86 60,112 14,86 14,34" fill="none" stroke={pMain} strokeWidth="2.8" strokeLinejoin="round" />
          <circle cx="60" cy="60" r="47" fill="none" stroke={pSoft} strokeWidth="2.2" />
          <polygon points="60,4 67,13 60,22 53,13" fill={pMain} stroke="#FFFFFF" strokeWidth="1.3" />
          <polygon points="60,98 66,106 60,114 54,106" fill={pSoft} stroke={pMain} strokeWidth="1.2" />
          <circle cx="14" cy="60" r="3.2" fill="#FFFFFF" stroke={pMain} strokeWidth="1.5" />
          <circle cx="106" cy="60" r="3.2" fill="#FFFFFF" stroke={pMain} strokeWidth="1.5" />
        </svg>
      )}

      {/* 6. Órbita Celestial (celestial_orbit) */}
      {showDecor && frame === 'celestial_orbit' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <ellipse cx="60" cy="60" rx="56" ry="30" transform="rotate(-22 60 60)" fill="none" stroke={pMain} strokeWidth="2.4" />
          <ellipse cx="60" cy="60" rx="56" ry="30" transform="rotate(22 60 60)" fill="none" stroke={pSoft} strokeWidth="2" />
          <circle cx="60" cy="60" r="46" fill="none" stroke={pMid} strokeWidth="2.4" />
          <path d="M98 20a8 8 0 103 14 6.5 6.5 0 01-3-14z" fill={pSoft} stroke={pDeep} strokeWidth="1.4" />
          <path d="M22 92 L25 97 L30 99 L25 101 L22 106 L19 101 L14 99 L19 97 Z" fill={pMain} stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      )}

      {/* 7. Nebulosa Única (neon_nebula) */}
      {showDecor && frame === 'neon_nebula' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="53" fill="none" stroke={pSoft} strokeWidth="4" opacity="0.65" />
          <circle cx="60" cy="60" r="48.5" fill="none" stroke={pMain} strokeWidth="3.2" />
          <circle cx="60" cy="60" r="44.5" fill="none" stroke="#FFFFFF" strokeWidth="1.3" opacity="0.9" />
          {[18, 72, 138, 198, 265, 322].map((deg, idx) => (
            <circle
              key={deg}
              cx={60 + Math.cos((deg * Math.PI) / 180) * 53}
              cy={60 + Math.sin((deg * Math.PI) / 180) * 53}
              r={idx % 2 === 0 ? 3.5 : 2.3}
              fill={idx % 2 === 0 ? '#FFFFFF' : pMain}
              stroke={pDeep}
              strokeWidth="1"
            />
          ))}
        </svg>
      )}

      {/* 8. Imperial Único (imperial_floral) */}
      {showDecor && frame === 'imperial_floral' && (
        <svg viewBox="0 0 120 120" className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none z-10" aria-hidden="true">
          <circle cx="60" cy="60" r="47.5" fill="none" stroke={pDeep} strokeWidth="3.2" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={pMain} strokeWidth="2.2" strokeDasharray="6 3" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 60 60)`}>
              <circle cx="60" cy="10" r="5.5" fill={pSoft} stroke={pMain} strokeWidth="1.4" />
              <circle cx="60" cy="10" r="2.2" fill={pMain} />
            </g>
          ))}
        </svg>
      )}

      {/* 9..50 Exclusive Record-Unlockable Custom-Color Frames */}
      {showDecor && LUXE_FRAME_SPECS[frame] && (
        <LuxeRecordFrameSvg
          spec={LUXE_FRAME_SPECS[frame]!}
          pMain={pMain}
          pSoft={pSoft}
          pMid={pMid}
          pDeep={pDeep}
        />
      )}

      <div
        className="w-full h-full rounded-full overflow-hidden border-2 shadow-sm flex items-center justify-center"
        style={{
          borderColor: 'var(--bg-elevated)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <img
          src={avatarUrl}
          alt={displayName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export const CharmIcon: React.FC<{ charm: CharmStickerId; className?: string }> = ({
  charm,
  className = 'w-7 h-7',
}) => {
  switch (charm) {
    case 'cassette':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="8" width="28" height="20" rx="4" fill="#FCE7F0" stroke="#E69DB6" strokeWidth="1.8" />
          <rect x="9" y="12" width="18" height="7" rx="2" fill="#FFFFFF" stroke="#E69DB6" strokeWidth="1.2" />
          <circle cx="13" cy="15.5" r="2" fill="#E69DB6" />
          <circle cx="23" cy="15.5" r="2" fill="#E69DB6" />
          <path d="M10 28l2-4h12l2 4" fill="#F4B8CC" />
        </svg>
      );
    case 'vinyl':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="13" fill="#4B4453" stroke="#9B8EA9" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="9.5" stroke="#6E6578" strokeWidth="0.9" strokeDasharray="3 2" />
          <circle cx="18" cy="18" r="5" fill="#FAD0DC" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="18" cy="18" r="1.6" fill="#4B4453" />
        </svg>
      );
    case 'ribbon':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 17c-4-6-12-8-12-2 0 5 8 5 12 2z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.6" />
          <path d="M18 17c4-6 12-8 12-2 0 5-8 5-12 2z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.6" />
          <path d="M16 19l-5 10 4-2 3-7M20 19l5 10-4-2-3-7" fill="#F4B8CC" stroke="#E28FA8" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="18" cy="17.5" r="2.8" fill="#FFF7FA" stroke="#E28FA8" strokeWidth="1.6" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M10 25h17a5 5 0 00.8-9.9A7 7 0 0014.3 13a5.5 5.5 0 00-4.3 12z" fill="#E2F2FE" stroke="#89C4EE" strokeWidth="1.7" />
          <circle cx="15" cy="19.5" r="1.1" fill="#5D82A6" />
          <circle cx="21" cy="19.5" r="1.1" fill="#5D82A6" />
          <path d="M16.8 21.3c.7.7 1.7.7 2.4 0" stroke="#5D82A6" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'matcha':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M8 14h18v7a8 8 0 01-8 8h-2a8 8 0 01-8-8v-7z" fill="#E3F5EA" stroke="#7FC19C" strokeWidth="1.7" />
          <path d="M26 16h2.5a2.5 2.5 0 010 5H26" stroke="#7FC19C" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="17" cy="14" rx="9" ry="2.6" fill="#A6DFBC" stroke="#7FC19C" strokeWidth="1.4" />
          <path d="M14 9c0-1.5 1-2 1-3M19 9.5c0-1.5 1-2 1-3" stroke="#96C9AB" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'boba':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M19 5l3 6" stroke="#E59AB5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M11 12h14l-2 18H13l-2-18z" fill="#F5E4D3" stroke="#B88E68" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="9.5" y="10.5" width="17" height="3" rx="1.5" fill="#FFFDF9" stroke="#B88E68" strokeWidth="1.4" />
          <circle cx="15" cy="26" r="1.6" fill="#5A3E2E" />
          <circle cx="19" cy="27" r="1.6" fill="#5A3E2E" />
          <circle cx="21.5" cy="24" r="1.6" fill="#5A3E2E" />
        </svg>
      );
    case 'strawberry':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 29c-5.5 0-9-5.8-9-11 0-4 3.5-6.5 9-6.5s9 2.5 9 6.5c0 5.2-3.5 11-9 11z" fill="#FAD2CA" stroke="#E68B7C" strokeWidth="1.7" />
          <path d="M13 12c2-2.5 8-2.5 10 0-2 1.5-8 1.5-10 0z" fill="#A4DCB9" stroke="#6EB68B" strokeWidth="1.4" />
          <circle cx="15" cy="18" r="0.9" fill="#FFF8F6" />
          <circle cx="21" cy="18" r="0.9" fill="#FFF8F6" />
          <circle cx="18" cy="23" r="0.9" fill="#FFF8F6" />
        </svg>
      );
    case 'peach':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 11c-5.5-2.5-11 2-11 8.5 0 6 5.5 10.5 11 11.5 5.5-1 11-5.5 11-11.5 0-6.5-5.5-11-11-8.5z" fill="#FFD9C2" stroke="#E89A74" strokeWidth="1.7" />
          <path d="M18 11c2-3 6-4 8-2.5-1.5 2.5-4.5 3.5-8 2.5z" fill="#A6DFBC" stroke="#6FB68E" strokeWidth="1.3" />
          <path d="M18 12c0 4-.5 7.5-2 10.5" stroke="#E89A74" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'cherry':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 7c-2 5-5 9-6 13M18 7c2 5 5 9 6 13" stroke="#6EB68B" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M18 7c3-2 7-1 8 1.5-3 1.5-6 .5-8-1.5z" fill="#A4DCB9" stroke="#6EB68B" strokeWidth="1.2" />
          <circle cx="12" cy="24" r="5" fill="#FAD0DC" stroke="#DF7892" strokeWidth="1.6" />
          <circle cx="24" cy="24" r="5" fill="#FAD0DC" stroke="#DF7892" strokeWidth="1.6" />
          <circle cx="10.5" cy="22.5" r="1.2" fill="#FFFFFF" />
          <circle cx="22.5" cy="22.5" r="1.2" fill="#FFFFFF" />
        </svg>
      );
    case 'cake':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M7 18h22v10a2 2 0 01-2 2H9a2 2 0 01-2-2V18z" fill="#FFF2E0" stroke="#D9A773" strokeWidth="1.6" />
          <path d="M7 18c2 2.5 4.5 2.5 6 0 1.5 2.5 4 2.5 5 0 1.5 2.5 4 2.5 5 0 1.5 2.5 4 2.5 6 0v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.4" />
          <circle cx="18" cy="10.5" r="2.8" fill="#F6939D" stroke="#D96B77" strokeWidth="1.2" />
        </svg>
      );
    case 'crescent':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M23 9a10 10 0 104 17.5A8 8 0 0123 9z" fill="#FDF0C4" stroke="#E2BD5A" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="25" cy="11" r="1.4" fill="#F9E2AE" />
          <circle cx="28" cy="17" r="1.1" fill="#C4E4FC" />
        </svg>
      );
    case 'cat':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M8 14L7 6l7 4a11 11 0 018 0l7-4-1 8c1.5 2.2 2 5 1 8-1.5 4.5-6 7-11 7s-9.5-2.5-11-7c-1-3-.5-5.8 1-8z" fill="#FFF4E8" stroke="#D1A683" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="14" cy="19" r="1.3" fill="#5D4433" />
          <circle cx="22" cy="19" r="1.3" fill="#5D4433" />
          <path d="M16.5 22c.8.8 2.2.8 3 0" stroke="#E08B9A" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'tulip':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 19v11" stroke="#6FB68E" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 26c-3-2-6-2-7 0 2 2 5 2 7 0zM18 26c3-2 6-2 7 0-2 2-5 2-7 0z" fill="#A4DCB9" stroke="#6FB68E" strokeWidth="1.2" />
          <path d="M11 10c0 7 3 10 7 10s7-3 7-10l-3.5 3L18 8l-3.5 5L11 10z" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case 'letter':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <rect x="5" y="9" width="26" height="18" rx="3.5" fill="#FFF8FA" stroke="#E29BB6" strokeWidth="1.6" />
          <path d="M6 11l12 9 12-9" stroke="#E29BB6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="19.5" r="2.3" fill="#F4B8CC" />
        </svg>
      );
    case 'headphones':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M8 20a10 10 0 0120 0" stroke="#89C4EE" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="5.5" y="17" width="5" height="9" rx="2.5" fill="#C4E4FC" stroke="#6FAEE0" strokeWidth="1.5" />
          <rect x="25.5" y="17" width="5" height="9" rx="2.5" fill="#C4E4FC" stroke="#6FAEE0" strokeWidth="1.5" />
        </svg>
      );
    case 'black_bow':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 17c-4-6-12-8-12-2 0 5 8 5 12 2z" fill="#1F2028" stroke="#9CA3AF" strokeWidth="1.4" />
          <path d="M18 17c4-6 12-8 12-2 0 5-8 5-12 2z" fill="#1F2028" stroke="#9CA3AF" strokeWidth="1.4" />
          <path d="M16 19l-5 10 4-2 3-7M20 19l5 10-4-2-3-7" fill="#181920" stroke="#9CA3AF" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="18" cy="17.5" r="2.8" fill="#FFFFFF" stroke="#181920" strokeWidth="1.5" />
        </svg>
      );
    case 'iced_coffee':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M19 5l3 6" stroke="#8C5E40" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M11 12h14l-2 18H13l-2-18z" fill="#C49A76" stroke="#6E4730" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 14h12l-1 6H13l-1-6z" fill="#FFFDF8" opacity="0.85" />
          <rect x="9.5" y="10.5" width="17" height="3" rx="1.5" fill="#FFFDF9" stroke="#6E4730" strokeWidth="1.4" />
        </svg>
      );
    case 'matcha_cake':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M7 18h22v10a2 2 0 01-2 2H9a2 2 0 01-2-2V18z" fill="#D5ECC8" stroke="#5E9446" strokeWidth="1.6" />
          <path d="M7 18c2 2.5 4.5 2.5 6 0 1.5 2.5 4 2.5 5 0 1.5 2.5 4 2.5 5 0 1.5 2.5 4 2.5 6 0v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3z" fill="#FFFFFF" stroke="#5E9446" strokeWidth="1.4" />
          <circle cx="18" cy="10.5" r="2.8" fill="#82BC68" stroke="#4D7C39" strokeWidth="1.2" />
        </svg>
      );
    case 'pistachio_macaron':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M7 16c0-4.5 4.5-7 11-7s11 2.5 11 7H7z" fill="#B8DDA1" stroke="#5E9446" strokeWidth="1.5" />
          <rect x="7.5" y="16" width="21" height="4" rx="2" fill="#FFFDF5" stroke="#5E9446" strokeWidth="1.3" />
          <path d="M7 20h22c0 4.5-4.5 7-11 7s-11-2.5-11-7z" fill="#B8DDA1" stroke="#5E9446" strokeWidth="1.5" />
        </svg>
      );
    case 'chocolate_bar':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <rect x="8" y="6" width="20" height="24" rx="3" fill="#6E4730" stroke="#3E271C" strokeWidth="1.6" />
          <path d="M18 6v14M8 13h20M8 20h20" stroke="#3E271C" strokeWidth="1.3" />
          <path d="M7 19h22v9a2 2 0 01-2 2H9a2 2 0 01-2-2v-9z" fill="#FAD0DC" stroke="#D97897" strokeWidth="1.4" />
        </svg>
      );
    case 'croissant':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M7 23c0-7 5-12 11-12s11 5 11 12c-3 2-6 1-11 1s-8 1-11-1z" fill="#F2C88B" stroke="#B67B3E" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 12l2 12M22 12l-2 12" stroke="#B67B3E" strokeWidth="1.3" />
        </svg>
      );
    case 'pudding':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M9 26l2.5-12c.5-2 2.5-3 6.5-3s6 1 6.5 3L27 26H9z" fill="#FCE59B" stroke="#B47B2B" strokeWidth="1.5" />
          <path d="M11 14c2 2 4 1 7 2s5-1 6.5-2c-.5-2-2.5-3-6.5-3s-6 1-7 3z" fill="#8D512C" />
          <ellipse cx="18" cy="27" rx="11" ry="2.2" fill="#FFFFFF" stroke="#D4B48C" strokeWidth="1.3" />
        </svg>
      );
    case 'milk_carton':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M10 13l4-6h8l4 6v16H10V13z" fill="#FFF1F5" stroke="#E28FA8" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 13h16" stroke="#E28FA8" strokeWidth="1.5" />
          <circle cx="18" cy="21" r="3" fill="#FAD0DC" stroke="#E28FA8" strokeWidth="1.2" />
        </svg>
      );
    case 'black_cat':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M8 14L7 6l7 4a11 11 0 018 0l7-4-1 8c1.5 2.2 2 5 1 8-1.5 4.5-6 7-11 7s-9.5-2.5-11-7c-1-3-.5-5.8 1-8z" fill="#1F2028" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="14" cy="19" r="1.4" fill="#FDE68A" />
          <circle cx="22" cy="19" r="1.4" fill="#FDE68A" />
          <path d="M16.5 22c.8.8 2.2.8 3 0" stroke="#F9A8D4" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'bunny':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <ellipse cx="14" cy="10" rx="2.6" ry="6" fill="#FFF5F8" stroke="#E28FA8" strokeWidth="1.4" />
          <ellipse cx="22" cy="10" rx="2.6" ry="6" fill="#FFF5F8" stroke="#E28FA8" strokeWidth="1.4" />
          <circle cx="18" cy="22" r="8" fill="#FFF5F8" stroke="#E28FA8" strokeWidth="1.5" />
          <circle cx="15.5" cy="21" r="1.1" fill="#5D4433" />
          <circle cx="20.5" cy="21" r="1.1" fill="#5D4433" />
          <ellipse cx="13.5" cy="23.5" rx="1.4" ry="0.9" fill="#FAD0DC" />
          <ellipse cx="22.5" cy="23.5" rx="1.4" ry="0.9" fill="#FAD0DC" />
        </svg>
      );
    case 'bear_latte':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <circle cx="11" cy="12" r="3.5" fill="#B68964" stroke="#6E4730" strokeWidth="1.4" />
          <circle cx="25" cy="12" r="3.5" fill="#B68964" stroke="#6E4730" strokeWidth="1.4" />
          <circle cx="18" cy="20" r="8.5" fill="#C99F76" stroke="#6E4730" strokeWidth="1.5" />
          <ellipse cx="18" cy="22" rx="3.4" ry="2.6" fill="#F5E4D3" />
          <circle cx="15" cy="18.5" r="1.1" fill="#3E271C" />
          <circle cx="21" cy="18.5" r="1.1" fill="#3E271C" />
        </svg>
      );
    case 'butterfly':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <ellipse cx="12" cy="14" rx="5.5" ry="4.5" fill="#DFCFFC" stroke="#9333EA" strokeWidth="1.3" />
          <ellipse cx="24" cy="14" rx="5.5" ry="4.5" fill="#DFCFFC" stroke="#9333EA" strokeWidth="1.3" />
          <ellipse cx="13" cy="22" rx="4" ry="3.5" fill="#FBCFE8" stroke="#9333EA" strokeWidth="1.3" />
          <ellipse cx="23" cy="22" rx="4" ry="3.5" fill="#FBCFE8" stroke="#9333EA" strokeWidth="1.3" />
          <rect x="16.8" y="11" width="2.4" height="14" rx="1.2" fill="#6B21A8" />
        </svg>
      );
    case 'clover':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <circle cx="18" cy="12" r="4.2" fill="#B8DDA1" stroke="#5E9446" strokeWidth="1.3" />
          <circle cx="24" cy="18" r="4.2" fill="#B8DDA1" stroke="#5E9446" strokeWidth="1.3" />
          <circle cx="18" cy="24" r="4.2" fill="#B8DDA1" stroke="#5E9446" strokeWidth="1.3" />
          <circle cx="12" cy="18" r="4.2" fill="#B8DDA1" stroke="#5E9446" strokeWidth="1.3" />
          <path d="M18 24v7" stroke="#5E9446" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'polaroid':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <rect x="7" y="6" width="22" height="24" rx="2.5" fill="#FFFFFF" stroke="#D1C7CE" strokeWidth="1.5" />
          <rect x="10" y="9" width="16" height="14" rx="1.5" fill="#FCE7F0" stroke="#E28FA8" strokeWidth="1.2" />
          <circle cx="18" cy="16" r="3" fill="#F4B8CC" />
        </svg>
      );
    case 'crystal_heart':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 29s-10-6.2-10-13a5.8 5.8 0 0110-3.8A5.8 5.8 0 0128 16c0 6.8-10 13-10 13z" fill="#C4E4FC" stroke="#60A5FA" strokeWidth="1.6" />
          <path d="M14 14l4 4 4-4" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'music_note':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M15 24V10l12-2v14" stroke="#EC7FA9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12.5" cy="24.5" r="3.2" fill="#FAD0DC" stroke="#EC7FA9" strokeWidth="1.6" />
          <circle cx="24.5" cy="22.5" r="3.2" fill="#FAD0DC" stroke="#EC7FA9" strokeWidth="1.6" />
        </svg>
      );
    case 'spark':
    default:
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
          <path d="M18 6l2.8 8.2L29 17l-8.2 2.8L18 28l-2.8-8.2L7 17l8.2-2.8L18 6z" fill="#FDF0C4" stroke="#E2BD5A" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const CHARM_LABELS: Record<CharmStickerId, string> = {
  cassette: 'Casete',
  vinyl: 'Vinilo',
  ribbon: 'Lazo',
  black_bow: 'Moño Noir',
  cloud: 'Nube',
  matcha: 'Matcha',
  boba: 'Boba Tea',
  iced_coffee: 'Café Frío',
  strawberry: 'Fresa',
  peach: 'Durazno',
  cherry: 'Cereza',
  cake: 'Pastelito',
  matcha_cake: 'Pastel Matcha',
  pistachio_macaron: 'Macaron',
  chocolate_bar: 'Chocolate',
  croissant: 'Croissant',
  pudding: 'Flan',
  milk_carton: 'Lechita',
  spark: 'Estrella',
  crescent: 'Luna',
  cat: 'Gatito',
  black_cat: 'Gato Noir',
  bunny: 'Conejito',
  bear_latte: 'Osito Café',
  butterfly: 'Mariposa',
  clover: 'Trébol',
  tulip: 'Tulipán',
  letter: 'Cartita',
  polaroid: 'Polaroid',
  crystal_heart: 'Cristal',
  music_note: 'Nota ♪',
  headphones: 'Audífonos',
};

export const FRAME_LABELS: Record<AvatarFrameId, string> = {
  none: 'Sin marco',
  sakura: 'Sakura',
  double_sakura: 'Doble Sakura',
  bunny: 'Conejito',
  mocha_bunny: 'Conejo Café',
  kitty: 'Gatito',
  noir_kitty: 'Gato Noir',
  bear: 'Osito',
  caramel_bear: 'Oso Caramelo',
  puppy: 'Perrito',
  panda: 'Pandita',
  frog: 'Ranita',
  pearl: 'Perlas',
  pearl_tiara: 'Tiara Perla',
  noir_pearls: 'Perlas Noir',
  lace: 'Encaje',
  chocolate_lace: 'Encaje Cacao',
  starry: 'Estrellas',
  galaxy_night: 'Galaxia',
  sparkles: 'Destellos',
  ribbon: 'Moño',
  latte_ribbon: 'Moño Latte',
  butterfly: 'Mariposas',
  butterfly_royal: 'Mariposa Real',
  moon: 'Luna',
  gothic_moon: 'Luna Nocturna',
  cloud_dream: 'Nubes',
  clover: 'Trébol',
  pistachio_garden: 'Jardín Pistacho',
  pistachio_cream: 'Crema Pistacho',
  matcha_bloom: 'Matcha Floral',
  heart: 'Corazones',
  strawberry: 'Fresitas',
  strawberry_lace: 'Fresa Encaje',
  cherry_cream: 'Cereza Crema',
  peach: 'Durazno',
  flower_crown: 'Corona floral',
  vintage_rose: 'Rosa Vintage',
  crown: 'Princesa',
  noir_crown: 'Corona Noir',
  royal_baroque: 'Barroco Oro',
  angel: 'Angelito',
  angel_gold: 'Ángel Dorado',
  headphones: 'Audífonos',
  espresso_gold: 'Espresso Oro',
  noir_velvet: 'Terciopelo Noir',
  lavender_dream: 'Lavanda Real',
  honey_bee: 'Miel Abejita',
  prism_aura: 'Prisma Cristal',
  crystal_wings: 'Alas de Cristal',
  royal_prism_crown: 'Corona Suprema',
  holo_butterfly: 'Mariposas Prism',
  diamond_halo: 'Diamante Halo',
  celestial_orbit: 'Órbita Celestial',
  neon_nebula: 'Nebulosa Única',
  imperial_floral: 'Imperial Único',
  starlight_tiara: 'Tiara Estelar',
  velvet_bow_luxe: 'Moño Imperial',
  aurora_crescent: 'Luna Aurora',
  lotus_sanctuary: 'Loto Dorado',
  symphony_laurel: 'Laurel Sinfonía',
  fairy_wing_filigree: 'Alas de Hada',
  pearl_cathedral: 'Catedral Perla',
  gemstone_octagon: 'Gema Octágono',
  melody_clef_crest: 'Clave Melódica',
  swan_grace_ring: 'Cisne Real',
  sakura_lanterns: 'Faroles Sakura',
  opal_arch_halo: 'Arco de Ópalo',
  royal_comet_trail: 'Cometa Real',
  stardust_compass: 'Brújula Estelar',
  ribbon_choker_luxe: 'Lazo Rococó',
  crystal_snowflake: 'Cristal Glacial',
  charmed_hearts_ring: 'Corazones Joya',
  angelic_feather_crown: 'Corona Plumaje',
  twin_butterfly_lace: 'Encaje Mariposa',
  eclipse_sun_moon: 'Eclipse Místico',
  botanical_ivy_gold: 'Hiedra Botánica',
  prism_mosaic_halo: 'Mosaico Prisma',
  harp_strings_crest: 'Arpa Celestial',
  pearl_shell_siren: 'Concha Perla',
  crown_jewel_scepter: 'Cetro Corona',
  cat_ears_imperial: 'Gato Imperial',
  bunny_tiara_royal: 'Conejo Real',
  astral_zodiac_ring: 'Anillo Astral',
  diamond_lace_veil: 'Velo Diamante',
  rose_thorn_regal: 'Rosa Regia',
  galactic_ring_nova: 'Supernova',
  dreamcatcher_silk: 'Atrapasueños',
  cherub_wing_lace: 'Alas Querubín',
  emerald_cut_mirror: 'Espejo Esmeralda',
  clover_crown_lucky: 'Trébol Real',
  serenade_vinyl_halo: 'Vinilo Dorado',
  aurora_borealis_arc: 'Aurora Boreal',
  mythic_phoenix_plume: 'Pluma Fénix',
  moonlit_pagoda_ring: 'Luna Imperial',
  infinite_knot_luxe: 'Nudo Infinito',
  celestial_empress: 'Emperatriz Estelar',
  morinote_sovereign: 'Soberano MoriNote',
};
