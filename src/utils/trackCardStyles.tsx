import React from 'react';
import { TRACK_CARD_COLOR_PRESETS, TRACK_CARD_STYLES } from '../constants/themes';
import type { TrackCardColorId, TrackCardDecorId, TrackCardStyleId } from '../types/music';

export interface TrackCardColorConfig {
  colorId?: TrackCardColorId;
  customBg?: string;
  customText?: string;
}

export interface TrackCardSurfaceConfig {
  opacityPercent?: number;
  blurPx?: number;
}

export interface TrackCardPresentation {
  isGroupedList: boolean;
  containerClassName: string;
  containerStyle: React.CSSProperties;
  coverClassName: string;
  textColorOverride?: string;
  mutedColorOverride?: string;
  decorBadge: string | null;
  topAccentElement?: React.ReactNode;
}

const DECOR_MAP: Record<Exclude<TrackCardDecorId, 'auto' | 'none'>, string> = {
  bows: '🎀',
  hearts: '💕',
  sakura: '🌸',
  stars: '🌟',
  notes: '🎵',
  paws: '🐾',
  pearls: '🤍',
};

export function resolveTrackCardDecor(
  styleId: TrackCardStyleId,
  decorId: TrackCardDecorId
): string | null {
  if (decorId === 'none') return null;
  if (decorId === 'auto') {
    const preset = TRACK_CARD_STYLES.find((s) => s.id === styleId);
    return preset?.defaultDecor || null;
  }
  return DECOR_MAP[decorId] ?? null;
}

function isHexDark(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.52;
}

function resolveColorOverride(
  colorConfig?: TrackCardColorConfig
): { bg: string; activeBg: string; text: string; muted: string; border: string } | null {
  const colorId = colorConfig?.colorId ?? 'auto';
  if (colorId === 'auto') return null;

  if (colorId === 'custom') {
    const bg = colorConfig?.customBg || '#FFFFFF';
    const dark = isHexDark(bg);
    const text = colorConfig?.customText || (dark ? '#F8F7FA' : '#1C1B1F');
    const muted = dark ? 'rgba(248,247,250,0.7)' : 'rgba(28,27,31,0.65)';
    return {
      bg,
      activeBg: bg,
      text,
      muted,
      border: dark ? 'rgba(255,255,255,0.22)' : 'rgba(28,27,31,0.16)',
    };
  }

  const preset = TRACK_CARD_COLOR_PRESETS.find((p) => p.id === colorId);
  if (!preset || preset.bg === 'auto' || preset.bg === 'custom') return null;
  return {
    bg: preset.bg,
    activeBg: preset.activeBg || preset.bg,
    text: preset.text,
    muted: preset.muted,
    border: preset.border,
  };
}

export function applyOpacityToColorValue(value: string, opacityPercent: number): string {
  const clampedPct = Math.min(100, Math.max(15, opacityPercent));
  if (clampedPct >= 100) return value;
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'transparent' || trimmed === 'none') return value;

  const alpha = clampedPct / 100;
  const alphaRounded = Math.round(alpha * 1000) / 1000;

  return trimmed.replace(
    /rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|var\(--[a-zA-Z0-9_-]+\)/g,
    (token, r, g, b, a) => {
      if (token.startsWith('var(')) {
        return `color-mix(in srgb, ${token} ${Math.round(clampedPct)}%, transparent)`;
      }
      if (token.startsWith('#')) {
        const raw = token.slice(1);
        const full =
          raw.length === 3
            ? raw
                .split('')
                .map((ch) => ch + ch)
                .join('')
            : raw;
        const nr = parseInt(full.slice(0, 2), 16);
        const ng = parseInt(full.slice(2, 4), 16);
        const nb = parseInt(full.slice(4, 6), 16);
        return `rgba(${nr}, ${ng}, ${nb}, ${alphaRounded})`;
      }
      const baseAlpha = a !== undefined ? parseFloat(a) : 1;
      const nextAlpha = Math.round(baseAlpha * alpha * 1000) / 1000;
      return `rgba(${r}, ${g}, ${b}, ${nextAlpha})`;
    }
  );
}

export function getTrackCardPresentation(
  styleId: TrackCardStyleId = 'classic_row',
  decorId: TrackCardDecorId = 'auto',
  isCurrent: boolean,
  isFirstInList: boolean,
  colorConfig?: TrackCardColorConfig,
  surfaceConfig?: TrackCardSurfaceConfig
): TrackCardPresentation {
  const decorBadge = resolveTrackCardDecor(styleId, decorId);
  const customPalette = resolveColorOverride(colorConfig);
  const opacityPct = Math.min(100, Math.max(15, surfaceConfig?.opacityPercent ?? 100));
  const blurPx = Math.min(20, Math.max(0, surfaceConfig?.blurPx ?? 0));

  if (styleId === 'classic_row') {
    const classicBg = customPalette
      ? isCurrent
        ? customPalette.activeBg
        : customPalette.bg
      : isCurrent
        ? 'var(--accent-soft)'
        : 'transparent';

    const resolvedClassicBg = applyOpacityToColorValue(classicBg, opacityPct);

    return {
      isGroupedList: true,
      containerClassName:
        'px-3.5 sm:px-4 py-3 flex flex-col gap-1.5 transition-colors relative',
      containerStyle: {
        borderTopWidth: isFirstInList ? 0 : '1.5px',
        borderTopStyle: 'solid',
        borderTopColor: customPalette ? customPalette.border : 'var(--divider-color)',
        backgroundColor: resolvedClassicBg,
      },
      coverClassName: 'w-12 h-12 rounded-xl',
      textColorOverride: customPalette?.text,
      mutedColorOverride: customPalette?.muted,
      decorBadge,
    };
  }

  let containerClassName =
    'px-3.5 py-2.5 flex flex-col gap-1.5 transition-all relative overflow-visible';
  let containerStyle: React.CSSProperties = {
    backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
    border: `1.5px solid ${isCurrent ? 'var(--accent-color)' : 'var(--divider-color)'}`,
    borderRadius: '1.25rem',
  };
  let coverClassName = 'w-12 h-12 rounded-xl';
  let textColorOverride: string | undefined;
  let mutedColorOverride: string | undefined;
  let topAccentElement: React.ReactNode = undefined;

  switch (styleId) {
    case 'soft_pill':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: `1.5px solid ${isCurrent ? 'var(--accent-color)' : 'var(--divider-color)'}`,
        borderRadius: '9999px',
        boxShadow: '0 2px 10px -4px rgba(0,0,0,0.06)',
      };
      coverClassName = 'w-11 h-11 rounded-full';
      break;

    // 10 Tactile 3D Designs
    case 'bevel_3d':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '1.25rem',
        boxShadow:
          '0 5px 0 var(--accent-color), 0 8px 14px -4px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.8)',
      };
      break;

    case 'clay_puff':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '1.5px solid rgba(255,255,255,0.85)',
        borderRadius: '1.65rem',
        boxShadow:
          '0 8px 16px -4px rgba(0,0,0,0.12), inset 0 -5px 8px rgba(0,0,0,0.06), inset 0 5px 8px rgba(255,255,255,0.85)',
      };
      coverClassName = 'w-12 h-12 rounded-2xl shadow-md';
      break;

    case 'glass_prism_3d':
      containerStyle = {
        background: isCurrent
          ? 'linear-gradient(145deg, rgba(255,255,255,0.85), var(--accent-soft))'
          : 'linear-gradient(145deg, rgba(255,255,255,0.72), var(--bg-surface))',
        border: '2px solid rgba(255,255,255,0.9)',
        borderRadius: '1.3rem',
        boxShadow:
          '0 6px 0 rgba(160,155,175,0.28), 0 10px 20px -6px rgba(0,0,0,0.14), inset 0 2px 3px rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
      };
      break;

    case 'acrylic_block':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid rgba(255,255,255,0.8)',
        borderBottomWidth: '6px',
        borderBottomColor: 'var(--accent-color)',
        borderRadius: '1.15rem',
        boxShadow:
          '0 8px 16px -6px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.85)',
      };
      break;

    case 'plush_cushion':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--divider-color)',
        borderRadius: '1.75rem',
        boxShadow:
          'inset 0 6px 10px rgba(255,255,255,0.85), inset 0 -6px 10px rgba(0,0,0,0.07), 0 5px 12px -4px rgba(0,0,0,0.12)',
      };
      coverClassName = 'w-12 h-12 rounded-full shadow-sm';
      break;

    case 'vinyl_box_3d':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--text-main)',
        borderRadius: '1rem',
        boxShadow: '4px 5px 0 var(--accent-color), 6px 8px 14px -4px rgba(0,0,0,0.16)',
      };
      coverClassName = 'w-12 h-12 rounded-full shadow';
      break;

    case 'piano_key_3d':
      containerStyle = {
        backgroundColor: '#FFFFFF',
        border: '2px solid #D4D4DC',
        borderBottomWidth: '7px',
        borderBottomColor: '#B8B8C6',
        borderRadius: '0.9rem',
        boxShadow: '0 6px 12px -5px rgba(0,0,0,0.14), inset 0 2px 0 #FFFFFF',
      };
      textColorOverride = '#1C1B1F';
      mutedColorOverride = 'rgba(28,27,31,0.62)';
      break;

    case 'macaron_3d':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '9999px',
        boxShadow:
          '0 4px 0 var(--bg-surface), 0 7px 0 var(--accent-color), 0 10px 14px -4px rgba(0,0,0,0.12)',
      };
      coverClassName = 'w-11 h-11 rounded-full';
      break;

    case 'polaroid_tilt_3d':
      containerStyle = {
        backgroundColor: '#FFFDF8',
        border: '2px solid #E6DED4',
        borderBottomWidth: '8px',
        borderRadius: '0.95rem',
        boxShadow: '3px 6px 0 rgba(190,175,160,0.45), 0 10px 18px -6px rgba(0,0,0,0.15)',
      };
      textColorOverride = '#241E1C';
      mutedColorOverride = 'rgba(36,30,28,0.65)';
      break;

    case 'jewelry_case_3d':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2.5px solid #F6EDE4',
        borderRadius: '1.4rem',
        boxShadow:
          '0 0 0 2px var(--accent-color), 0 6px 0 var(--accent-color), inset 0 2px 5px rgba(255,255,255,0.9)',
      };
      break;

    case 'cloud_scallop':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '1.75rem',
        boxShadow: '0 4px 12px -4px var(--accent-soft)',
      };
      coverClassName = 'w-12 h-12 rounded-full';
      break;

    case 'lace_crochet':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2.5px dotted var(--accent-color)',
        borderRadius: '1.35rem',
        outline: '1px solid var(--divider-color)',
        outlineOffset: '2px',
      };
      coverClassName = 'w-12 h-12 rounded-2xl';
      break;

    case 'ticket_stub':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-surface)',
        border: '2px dashed var(--accent-color)',
        borderRadius: '1rem',
      };
      topAccentElement = (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-r-2"
            style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--accent-color)' }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-l-2"
            style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--accent-color)' }}
          />
        </>
      );
      break;

    case 'ribbon_card':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '1.25rem',
        boxShadow: 'inset 0 0 0 2px var(--accent-soft)',
      };
      break;

    case 'notebook_lined':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        backgroundImage:
          'repeating-linear-gradient(transparent, transparent 15px, rgba(160,140,150,0.12) 15px, rgba(160,140,150,0.12) 16px)',
        border: '1.5px solid var(--divider-color)',
        borderRadius: '0.85rem',
        boxShadow: 'inset 6px 0 0 var(--accent-color)',
      };
      containerClassName += ' pl-5';
      break;

    case 'polaroid_strip':
      containerStyle = {
        backgroundColor: '#FFFDF9',
        border: '1.5px solid rgba(180,165,155,0.45)',
        borderBottomWidth: '6px',
        borderRadius: '0.9rem',
        boxShadow: '0 4px 12px -4px rgba(0,0,0,0.09)',
      };
      textColorOverride = '#231F20';
      mutedColorOverride = 'rgba(35,31,32,0.65)';
      break;

    case 'love_note':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '1.1rem',
        boxShadow: 'inset 0 -3px 0 var(--accent-soft)',
      };
      break;

    case 'chocolate_wafer':
      containerStyle = {
        backgroundColor: isCurrent ? '#5C3F32' : '#432C22',
        border: '2px solid #C9A489',
        borderRadius: '1.15rem',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.22)',
      };
      textColorOverride = '#FDF6EE';
      mutedColorOverride = 'rgba(253,246,238,0.74)';
      break;

    case 'espresso_noir':
      containerStyle = {
        backgroundColor: isCurrent ? '#2A2C34' : '#18191F',
        border: '1.5px solid #D4C5A9',
        borderRadius: '1.15rem',
        boxShadow: '0 4px 14px -6px rgba(0,0,0,0.35)',
      };
      textColorOverride = '#F7F5F0';
      mutedColorOverride = 'rgba(247,245,240,0.68)';
      break;

    case 'pistachio_crepe':
      containerStyle = {
        backgroundColor: isCurrent ? '#D5ECC8' : '#ECF7E5',
        border: '2px solid #9ECC84',
        borderRadius: '1.35rem',
      };
      textColorOverride = '#22331D';
      mutedColorOverride = 'rgba(34,51,29,0.68)';
      break;

    case 'strawberry_milk':
      containerStyle = {
        background: isCurrent
          ? 'linear-gradient(135deg, #FBD5E2, #FFF2F6)'
          : 'linear-gradient(135deg, #FFEBF2, #FFFFFF)',
        border: '2px solid #F4A7C3',
        borderRadius: '1.5rem',
        boxShadow: 'inset 0 -4px 0 rgba(244,167,195,0.35)',
      };
      textColorOverride = '#3A1D29';
      mutedColorOverride = 'rgba(58,29,41,0.68)';
      break;

    case 'matcha_wave':
      containerStyle = {
        background: isCurrent
          ? 'linear-gradient(135deg, #CCEBD7, #F1FAF4)'
          : 'linear-gradient(135deg, #E3F4EA, #FFFFFF)',
        border: '2px solid #88C9A1',
        borderRadius: '1.5rem 0.75rem 1.5rem 0.75rem',
      };
      textColorOverride = '#1F3627';
      mutedColorOverride = 'rgba(31,54,39,0.68)';
      break;

    case 'kitty_frame':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '1.4rem',
      };
      topAccentElement = (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-1.5 left-5 w-3 h-3 rotate-45 border-l-2 border-t-2"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--accent-color)' }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-1.5 right-5 w-3 h-3 rotate-45 border-l-2 border-t-2"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--accent-color)' }}
          />
        </>
      );
      break;

    case 'vinyl_sleeve':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '1.5px solid var(--divider-color)',
        borderLeftWidth: '8px',
        borderLeftColor: 'var(--accent-color)',
        borderRadius: '0.75rem 1.25rem 1.25rem 0.75rem',
      };
      coverClassName = 'w-12 h-12 rounded-full';
      break;

    case 'crystal_glass':
      containerStyle = {
        background: isCurrent
          ? 'linear-gradient(125deg, var(--accent-soft), rgba(255,255,255,0.65))'
          : 'linear-gradient(125deg, rgba(255,255,255,0.52), var(--bg-surface))',
        border: '1.5px solid rgba(255,255,255,0.75)',
        borderRadius: '1.25rem',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px -6px rgba(0,0,0,0.08)',
      };
      break;

    case 'double_stitch':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-surface)',
        border: '1.5px solid var(--divider-color)',
        outline: '1.5px dashed var(--accent-color)',
        outlineOffset: '-4px',
        borderRadius: '1.2rem',
      };
      break;

    case 'starry_dream':
      containerStyle = {
        background: isCurrent
          ? 'linear-gradient(120deg, var(--accent-soft), var(--bg-elevated))'
          : 'linear-gradient(120deg, var(--bg-elevated), var(--accent-soft))',
        border: '1.5px solid var(--accent-color)',
        borderRadius: '1.35rem',
      };
      break;

    case 'washi_tape':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '1.5px solid var(--divider-color)',
        borderRadius: '1rem',
      };
      topAccentElement = (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-sm opacity-85"
          style={{ backgroundColor: 'var(--accent-color)' }}
        />
      );
      break;

    case 'petal_corner':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '2px solid var(--accent-color)',
        borderRadius: '1.8rem 0.6rem 1.8rem 0.6rem',
      };
      coverClassName = 'w-12 h-12 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md';
      break;

    case 'retro_cassette':
      containerStyle = {
        backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--bg-surface)',
        border: '2px solid var(--text-main)',
        borderRadius: '0.85rem',
        boxShadow: '0 3px 0 var(--accent-color)',
      };
      break;
  }

  // Apply custom/preset song card color overrides when user chooses a specific card palette (including blanco, negro, etc.)
  if (customPalette) {
    const finalBg = isCurrent ? customPalette.activeBg : customPalette.bg;
    containerStyle = {
      ...containerStyle,
      background: undefined,
      backgroundColor: finalBg,
      borderColor: customPalette.border,
    };
    textColorOverride = customPalette.text;
    mutedColorOverride = customPalette.muted;
  }

  // Apply user-configured card background opacity & soft frosted glass blur
  // (applied strictly to card background/filter so title, cover, and buttons remain 100% crisp)
  if (opacityPct < 100) {
    if (typeof containerStyle.background === 'string' && containerStyle.background) {
      containerStyle = {
        ...containerStyle,
        background: applyOpacityToColorValue(containerStyle.background, opacityPct),
      };
    } else if (
      typeof containerStyle.backgroundColor === 'string' &&
      containerStyle.backgroundColor
    ) {
      containerStyle = {
        ...containerStyle,
        backgroundColor: applyOpacityToColorValue(containerStyle.backgroundColor, opacityPct),
      };
    }
  }

  if (blurPx > 0) {
    const blurValue = `blur(${blurPx}px)`;
    containerStyle = {
      ...containerStyle,
      backdropFilter: blurValue,
      WebkitBackdropFilter: blurValue,
      boxShadow:
        containerStyle.boxShadow ||
        'inset 0 1px 0 rgba(255,255,255,0.42), 0 6px 18px -6px rgba(0,0,0,0.1)',
    };
  }

  return {
    isGroupedList: false,
    containerClassName,
    containerStyle,
    coverClassName,
    textColorOverride,
    mutedColorOverride,
    decorBadge,
    topAccentElement,
  };
}
