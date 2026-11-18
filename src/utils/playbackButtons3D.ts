import type React from 'react';
import { PLAYBACK_BUTTON_COLOR_PRESETS } from '../constants/themes';
import type { PlaybackButton3DStyleId, ThemeConfig } from '../types/music';

export interface ResolvedPlaybackColors {
  playBg: string;
  navBg: string;
  playIcon: string;
  navIcon: string;
  rim: string;
  isAuto: boolean;
}

export function resolvePlaybackColors(theme?: Partial<ThemeConfig> | null): ResolvedPlaybackColors {
  const colorId = theme?.playbackBtnColorId ?? 'auto';

  if (colorId === 'custom') {
    return {
      playBg: theme?.playbackPlayBg || '#F4A6C1',
      navBg: theme?.playbackNavBg || '#FFFFFF',
      playIcon: theme?.playbackPlayIcon || '#1C1B1F',
      navIcon: theme?.playbackNavIcon || '#1C1B1F',
      rim: theme?.playbackRimColor || '#CF7A99',
      isAuto: false,
    };
  }

  const preset = PLAYBACK_BUTTON_COLOR_PRESETS.find((p) => p.id === colorId);
  if (preset && preset.id !== 'auto') {
    return {
      playBg: preset.playBg,
      navBg: preset.navBg,
      playIcon: preset.playIcon,
      navIcon: preset.navIcon,
      rim: preset.rim,
      isAuto: false,
    };
  }

  return {
    playBg: 'var(--accent-color)',
    navBg: 'var(--bg-surface)',
    playIcon: '#1C1B1F',
    navIcon: 'var(--text-main)',
    rim: 'var(--divider-color)',
    isAuto: true,
  };
}

export function getPlaybackControlPresentation(
  role: 'play' | 'nav' | 'aux',
  theme?: Partial<ThemeConfig> | null,
  isAuxActive = false
): {
  className: string;
  style: React.CSSProperties;
} {
  const styleId: PlaybackButton3DStyleId = theme?.playbackBtnStyleId ?? 'cushion_3d';
  const colors = resolvePlaybackColors(theme);

  const bg =
    role === 'play'
      ? colors.playBg
      : role === 'aux'
        ? isAuxActive
          ? colors.playBg
          : colors.navBg
        : colors.navBg;

  const iconColor =
    role === 'play'
      ? colors.playIcon
      : role === 'aux'
        ? isAuxActive
          ? colors.playIcon
          : colors.navIcon
        : colors.navIcon;

  const rim = colors.rim;
  const depth = role === 'play' ? 5 : role === 'aux' ? 3 : 4;

  const baseMotion =
    'btn-raw relative select-none flex items-center justify-center transition-all duration-150 active:translate-y-[3px] active:scale-[0.96]';

  switch (styleId) {
    case 'macaron_3d':
      return {
        className: `${baseMotion} rounded-full border-2`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.85)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, transparent 48%, rgba(0,0,0,0.08) 100%)',
          boxShadow: `0 ${depth}px 0 #FFFFFF, 0 ${depth + 3}px 0 ${rim}, 0 ${depth + 8}px 14px rgba(0,0,0,0.16)`,
        },
      };

    case 'mechanical_key_3d':
      return {
        className: `${baseMotion} rounded-2xl border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: rim,
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(0,0,0,0.06) 100%)',
          boxShadow: `0 ${depth + 1}px 0 ${rim}, 0 ${depth + 6}px 12px rgba(0,0,0,0.18), inset 0 2px 2px rgba(255,255,255,0.55), inset 0 -3px 5px rgba(0,0,0,0.1)`,
        },
      };

    case 'crystal_jewel_3d':
      return {
        className: `${baseMotion} rounded-[20px] border-2`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.88)',
          backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.12) 48%, rgba(0,0,0,0.1) 100%)',
          boxShadow: `0 ${depth}px 0 ${rim}, 0 10px 20px rgba(0,0,0,0.15), inset 0 2px 5px rgba(255,255,255,0.9)`,
        },
      };

    case 'pearl_cabochon_3d':
      return {
        className: `${baseMotion} rounded-full border-2`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.92)',
          backgroundImage: 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.75) 0%, transparent 52%, rgba(0,0,0,0.12) 100%)',
          boxShadow: `0 0 0 2px ${rim}, 0 ${depth + 3}px 12px rgba(0,0,0,0.16), inset 0 -3px 6px rgba(0,0,0,0.1)`,
        },
      };

    case 'velvet_puck_3d':
      return {
        className: `${baseMotion} rounded-full border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.22)',
          backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.14) 0%, transparent 55%, rgba(0,0,0,0.18) 100%)',
          boxShadow: `0 ${depth + 1}px 0 ${rim}, 0 10px 18px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(255,255,255,0.12)`,
        },
      };

    case 'acrylic_cube_3d':
      return {
        className: `${baseMotion} rounded-2xl border-2 backdrop-blur-md`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.82)',
          backgroundImage: 'linear-gradient(140deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.06) 60%)',
          boxShadow: `3px ${depth + 2}px 0 ${rim}, 0 10px 18px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)`,
        },
      };

    case 'vinyl_knob_3d':
      return {
        className: `${baseMotion} rounded-full border-[3px]`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: rim,
          backgroundImage: 'repeating-radial-gradient(circle at center, transparent 0px, transparent 3px, rgba(255,255,255,0.14) 4px)',
          boxShadow: `0 ${depth}px 0 ${rim}, 0 8px 14px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.45)`,
        },
      };

    case 'chrome_dome_3d':
      return {
        className: `${baseMotion} rounded-full border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.85)',
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.68) 0%, transparent 45%, rgba(0,0,0,0.14) 55%, rgba(255,255,255,0.3) 100%)',
          boxShadow: `0 ${depth}px 0 ${rim}, 0 8px 16px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.85)`,
        },
      };

    case 'porcelain_sculpt_3d':
      return {
        className: `${baseMotion} rounded-[22px] border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.9)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 70%)',
          boxShadow: `0 ${depth}px 0 ${rim}, 0 10px 18px rgba(0,0,0,0.12), inset 0 -3px 6px rgba(0,0,0,0.08)`,
        },
      };

    case 'marshmallow_3d':
      return {
        className: `${baseMotion} rounded-[24px] border-2`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.75)',
          boxShadow: `0 ${depth + 1}px 0 ${rim}, 0 12px 18px -4px rgba(0,0,0,0.16), inset 0 4px 6px rgba(255,255,255,0.7)`,
        },
      };

    case 'heart_locket_3d':
      return {
        className: `${baseMotion} rounded-full border-2`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: rim,
          backgroundImage: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.45) 0%, transparent 65%)',
          boxShadow: `inset 0 0 0 2.5px rgba(255,255,255,0.78), 0 ${depth}px 0 ${rim}, 0 8px 16px rgba(0,0,0,0.15)`,
        },
      };

    case 'jelly_drop_3d':
      return {
        className: `${baseMotion} rounded-[26px] border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.65)',
          backgroundImage: 'radial-gradient(ellipse at 32% 20%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.12) 45%, transparent 72%)',
          boxShadow: `0 ${depth}px 0 ${rim}, 0 8px 18px ${rim}55, inset 0 -4px 8px rgba(0,0,0,0.12)`,
        },
      };

    case 'wafer_biscuit_3d':
      return {
        className: `${baseMotion} rounded-2xl border-2 border-dashed`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.75)',
          boxShadow: `0 ${depth + 1}px 0 ${rim}, 0 8px 14px rgba(0,0,0,0.14)`,
        },
      };

    case 'clover_petal_3d':
      return {
        className: `${baseMotion} border-2`,
        style: {
          borderRadius: role === 'play' ? '26px 12px 26px 12px' : '18px 8px 18px 8px',
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.75)',
          boxShadow: `2px ${depth}px 0 ${rim}, 0 8px 14px rgba(0,0,0,0.14), inset 0 2px 3px rgba(255,255,255,0.65)`,
        },
      };

    case 'tape_deck_3d':
      return {
        className: `${baseMotion} rounded-xl border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: rim,
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, transparent 32%, rgba(0,0,0,0.12) 100%)',
          boxShadow: `0 ${depth + 2}px 0 ${rim}, 0 7px 12px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.6)`,
        },
      };

    case 'diamond_cut_3d':
      return {
        className: `${baseMotion} rounded-2xl border-2`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.85)',
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.52) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)',
          boxShadow: `inset 0 0 0 2px ${rim}, 0 ${depth}px 0 ${rim}, 0 10px 18px rgba(0,0,0,0.16)`,
        },
      };

    case 'orb_levitate_3d':
      return {
        className: `${baseMotion} rounded-full border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.78)',
          backgroundImage: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.65) 0%, transparent 58%, rgba(0,0,0,0.15) 100%)',
          boxShadow: `0 8px 18px -2px ${rim}, 0 3px 6px rgba(0,0,0,0.16)`,
        },
      };

    case 'cushion_3d':
    default:
      return {
        className: `${baseMotion} rounded-2xl border`,
        style: {
          backgroundColor: bg,
          color: iconColor,
          borderColor: 'rgba(255,255,255,0.72)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, transparent 60%)',
          boxShadow: `0 ${depth}px 0 ${rim}, 0 8px 16px rgba(0,0,0,0.13), inset 0 2px 3px rgba(255,255,255,0.7)`,
        },
      };
  }
}
