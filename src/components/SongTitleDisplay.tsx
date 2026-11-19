import React, { useLayoutEffect, useRef, useState } from 'react';
import { SONG_TITLE_COLOR_PRESETS } from '../constants/themes';
import type { SongTitleColorId, SongTitleShapeId } from '../types/music';

interface SongTitleDisplayProps {
  title: string;
  shapeId?: SongTitleShapeId;
  colorId?: SongTitleColorId;
  customBg?: string;
  customText?: string;
  compact?: boolean;
  size?: 'hero' | 'row';
  fallbackTextColor?: string;
}

const SingleLineMarqueeText: React.FC<{
  text: string;
  className: string;
  color?: string;
}> = ({ text, className, color }) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [overflowPx, setOverflowPx] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const measure = () => {
      const available = container.clientWidth;
      const needed = textEl.scrollWidth;
      const delta = Math.ceil(needed - available);
      setOverflowPx(delta > 2 ? delta + 4 : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(textEl);
    return () => ro.disconnect();
  }, [text, className]);

  const durationSec = Math.min(14, Math.max(5.5, 3.6 + overflowPx / 24));

  return (
    <span
      ref={containerRef}
      className="block w-full flex-1 min-w-0 overflow-hidden whitespace-nowrap"
      style={color ? { color } : undefined}
    >
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap ${className} ${
          overflowPx > 0 ? 'title-marquee-pingpong' : ''
        }`}
        style={
          overflowPx > 0
            ? ({
                '--marquee-shift': `-${overflowPx}px`,
                '--marquee-duration': `${durationSec.toFixed(2)}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </span>
  );
};

function isHexDark(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return false;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.52;
}

function resolveSongTitlePalette(
  colorId: SongTitleColorId,
  customBg?: string,
  customText?: string,
  fallbackTextColor?: string
): { bg: string; text: string; border: string; accent: string; plainText: string } {
  if (colorId === 'custom') {
    const bg = customBg || '#FFF2F6';
    const dark = isHexDark(bg);
    const text = customText || (dark ? '#FFFFFF' : '#1C1B1F');
    return {
      bg,
      text,
      border: dark ? 'rgba(255,255,255,0.34)' : 'rgba(28,27,31,0.22)',
      accent: text,
      plainText: customText || bg,
    };
  }
  if (colorId === 'auto') {
    const fallbackIsLight = fallbackTextColor ? !isHexDark(fallbackTextColor) : false;
    return {
      bg: fallbackIsLight ? 'rgba(255,255,255,0.14)' : 'var(--bg-surface)',
      text: fallbackTextColor || 'var(--text-main)',
      border: 'var(--accent-color)',
      accent: 'var(--accent-color)',
      plainText: fallbackTextColor || 'var(--text-main)',
    };
  }
  const found =
    SONG_TITLE_COLOR_PRESETS.find((c) => c.id === colorId) ?? SONG_TITLE_COLOR_PRESETS[0];
  return {
    bg: found.bg,
    text: found.text,
    border: found.border,
    accent: found.accent,
    plainText: found.plainText,
  };
}

export const SongTitleDisplay: React.FC<SongTitleDisplayProps> = ({
  title,
  shapeId = 'cloud_plush',
  colorId = 'auto',
  customBg,
  customText,
  compact = false,
  size = 'hero',
  fallbackTextColor,
}) => {
  const isRow = size === 'row';
  const palette = resolveSongTitlePalette(colorId, customBg, customText, fallbackTextColor);

  const textSizeCls = isRow
    ? 'text-[13.5px] sm:text-sm font-bold tracking-tight leading-tight'
    : compact
      ? 'text-lg sm:text-xl font-extrabold tracking-tight leading-snug'
      : 'text-xl sm:text-[1.35rem] font-extrabold tracking-tight leading-snug';

  const padCls = isRow ? 'px-2.5 py-0.5' : 'px-4 py-2';
  const iconDim = isRow ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0';

  const TitleTag = isRow ? 'span' : 'h2';
  const titleNode = isRow ? (
    <SingleLineMarqueeText text={title} className={textSizeCls} />
  ) : (
    <TitleTag className={`block ${textSizeCls} break-words line-clamp-2 [text-wrap:balance]`}>
      {title}
    </TitleTag>
  );

  // Option: "Solo el título" — clean typography only, zero decorative frame or extras
  if (shapeId === 'title_only') {
    if (isRow) {
      return (
        <SingleLineMarqueeText
          text={title}
          className={textSizeCls}
          color={palette.plainText}
        />
      );
    }
    return (
      <TitleTag
        className={`block ${textSizeCls} break-words line-clamp-2 [text-wrap:balance]`}
        style={{ color: palette.plainText }}
      >
        {title}
      </TitleTag>
    );
  }

  // Wave Underline (open title + clean SVG melodic wave underneath)
  if (shapeId === 'wave_underline') {
    return (
      <span className="inline-block max-w-full min-w-0 align-middle">
        {isRow ? (
          <SingleLineMarqueeText
            text={title}
            className={textSizeCls}
            color={palette.plainText}
          />
        ) : (
          <TitleTag
            className={`block ${textSizeCls} break-words line-clamp-2 [text-wrap:balance]`}
            style={{ color: palette.plainText }}
          >
            {title}
          </TitleTag>
        )}
        <svg
          viewBox="0 0 180 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          className={`w-full ${isRow ? 'max-w-[160px] h-1.5 mt-0.5' : 'max-w-[240px] h-2.5 mt-1'}`}
          style={{ color: colorId === 'auto' ? 'var(--accent-color)' : palette.accent }}
        >
          <path
            d="M2 7 Q 16 1, 30 7 T 58 7 T 86 7 T 114 7 T 142 7 T 178 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  // Ribbon Banner
  if (shapeId === 'ribbon_banner') {
    return (
      <span className="relative inline-flex max-w-full min-w-0 items-center">
        <span
          aria-hidden="true"
          className={`${isRow ? 'w-2 h-6 -mr-1' : 'w-3 h-8 -mr-1.5'} rounded-l-md border border-r-0 shrink-0`}
          style={{
            backgroundColor: palette.bg,
            borderColor: palette.border,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 42% 50%)',
          }}
        />
        <span
          className={`relative ${padCls} rounded-xl border-2 shadow-sm max-w-full min-w-0 flex-1 inline-flex items-center gap-1.5`}
          style={{
            backgroundColor: palette.bg,
            borderColor: palette.border,
            color: palette.text,
          }}
        >
          <svg
            viewBox="0 0 24 18"
            className={iconDim}
            aria-hidden="true"
            style={{ color: palette.accent }}
          >
            <path
              d="M12 9 C7 3, 2 3, 2 9 C2 15, 7 15, 12 9 Z M12 9 C17 3, 22 3, 22 9 C22 15, 17 15, 12 9 Z"
              fill="currentColor"
              fillOpacity="0.24"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.2" fill="currentColor" />
          </svg>
          {titleNode}
        </span>
        <span
          aria-hidden="true"
          className={`${isRow ? 'w-2 h-6 -ml-1' : 'w-3 h-8 -ml-1.5'} rounded-r-md border border-l-0 shrink-0`}
          style={{
            backgroundColor: palette.bg,
            borderColor: palette.border,
            clipPath: 'polygon(0 0, 100% 0, 58% 50%, 100% 100%, 0 100%)',
          }}
        />
      </span>
    );
  }

  // Ticket Stub
  if (shapeId === 'ticket_stub') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center gap-1.5 ${padCls} rounded-xl border-2 border-dashed shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        <span
          aria-hidden="true"
          className={`absolute ${isRow ? '-left-1.5 w-2.5 h-2.5' : '-left-2 w-3.5 h-3.5'} top-1/2 -translate-y-1/2 rounded-full border-r-2`}
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: palette.border }}
        />
        <span
          aria-hidden="true"
          className={`absolute ${isRow ? '-right-1.5 w-2.5 h-2.5' : '-right-2 w-3.5 h-3.5'} top-1/2 -translate-y-1/2 rounded-full border-l-2`}
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: palette.border }}
        />
        <span className="text-xs font-bold shrink-0" style={{ color: palette.accent }} aria-hidden="true">
          ♪
        </span>
        {titleNode}
      </span>
    );
  }

  // Heart Plaque
  if (shapeId === 'heart_plaque') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center gap-1.5 ${padCls} rounded-[1.2rem] border-2 shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        <svg viewBox="0 0 24 24" className={iconDim} aria-hidden="true" style={{ color: palette.accent }}>
          <path
            d="M12 20.5s-7-4.5-9-8.8C1.6 8.6 3.5 5 7 5c2 0 3.7 1.1 5 2.8C13.3 6.1 15 5 17 5c3.5 0 5.4 3.6 4 6.7-2 4.3-9 8.8-9 8.8Z"
            fill="currentColor"
            fillOpacity="0.24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        {titleNode}
      </span>
    );
  }

  // Capsule 3D
  if (shapeId === 'capsule_3d') {
    return (
      <span
        className={`inline-flex max-w-full min-w-0 items-center ${padCls} rounded-2xl border-2`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: `${isRow ? '0 3px 0' : '0 4px 0'} ${palette.border}, inset 0 2px 0 rgba(255,255,255,0.55)`,
        }}
      >
        {titleNode}
      </span>
    );
  }

  // Notebook Tab
  if (shapeId === 'notebook_tab') {
    return (
      <span
        className={`relative inline-block max-w-full min-w-0 ${padCls} rounded-r-xl rounded-l-md border shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderLeftWidth: isRow ? '4px' : '5px',
          borderLeftColor: palette.accent,
          color: palette.text,
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 21px, rgba(128,128,128,0.12) 22px)',
        }}
      >
        {titleNode}
      </span>
    );
  }

  // Polaroid Tag
  if (shapeId === 'polaroid_tag') {
    return (
      <span
        className={`relative inline-block max-w-full min-w-0 ${isRow ? 'px-2.5 pt-1.5 pb-1 mt-1' : 'px-4 pt-2.5 pb-3 mt-1.5'} rounded-xl border-2 shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        <span
          aria-hidden="true"
          className={`absolute ${isRow ? '-top-1.5 w-7 h-2' : '-top-2 w-10 h-2.5'} left-1/2 -translate-x-1/2 rounded-sm opacity-85`}
          style={{ backgroundColor: palette.accent }}
        />
        {titleNode}
      </span>
    );
  }

  // Crystal Glass
  if (shapeId === 'crystal_glass') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center ${padCls} rounded-xl border backdrop-blur-md`}
        style={{
          background:
            colorId === 'auto'
              ? 'linear-gradient(135deg, rgba(255,255,255,0.68), var(--accent-soft))'
              : `linear-gradient(135deg, ${palette.bg}, rgba(255,255,255,0.35))`,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: '0 4px 12px -6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.75)',
        }}
      >
        {titleNode}
      </span>
    );
  }

  // Sakura Frame
  if (shapeId === 'sakura_frame') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center gap-1.5 ${padCls} rounded-xl border-2 shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        <svg viewBox="0 0 24 24" className={iconDim} aria-hidden="true" style={{ color: palette.accent }}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="12"
              cy="6"
              rx="2.7"
              ry="4.5"
              transform={`rotate(${deg} 12 12)`}
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          ))}
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        {titleNode}
      </span>
    );
  }

  // Starry Plaque
  if (shapeId === 'starry_plaque') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center gap-1.5 ${padCls} rounded-xl border-2 shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        <svg viewBox="0 0 24 24" className={iconDim} aria-hidden="true" style={{ color: palette.accent }}>
          <path
            d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z"
            fill="currentColor"
            fillOpacity="0.28"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {titleNode}
      </span>
    );
  }

  // Double Lace
  if (shapeId === 'double_lace') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center ${padCls} rounded-2xl border-2 border-dotted`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: `0 0 0 2px ${palette.bg}, 0 0 0 3.5px ${palette.border}`,
        }}
      >
        {titleNode}
      </span>
    );
  }

  // Kitty Ears
  if (shapeId === 'kitty_ears') {
    return (
      <span className={`relative inline-block max-w-full min-w-0 ${isRow ? 'pt-2.5' : 'pt-3'}`}>
        <svg
          viewBox="0 0 60 18"
          aria-hidden="true"
          className={`${isRow ? 'w-11 h-3 left-3' : 'w-14 h-4 left-4'} absolute top-0 pointer-events-none`}
          style={{ color: palette.border }}
        >
          <path d="M4 17 L8 2 L22 14 Z" fill={palette.bg} stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M56 17 L52 2 L38 14 Z" fill={palette.bg} stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
        <span
          className={`relative block max-w-full min-w-0 ${padCls} rounded-xl border-2 shadow-sm`}
          style={{
            backgroundColor: palette.bg,
            borderColor: palette.border,
            color: palette.text,
          }}
        >
          {titleNode}
        </span>
      </span>
    );
  }

  // Bunny Ears
  if (shapeId === 'bunny_ears') {
    return (
      <span className={`relative inline-block max-w-full min-w-0 ${isRow ? 'pt-3' : 'pt-4'}`}>
        <svg
          viewBox="0 0 56 24"
          aria-hidden="true"
          className={`${isRow ? 'w-9 h-4 left-3.5' : 'w-12 h-5 left-5'} absolute top-0 pointer-events-none`}
          style={{ color: palette.border }}
        >
          <ellipse cx="16" cy="12" rx="5.5" ry="10.5" transform="rotate(-10 16 12)" fill={palette.bg} stroke="currentColor" strokeWidth="2.2" />
          <ellipse cx="40" cy="12" rx="5.5" ry="10.5" transform="rotate(10 40 12)" fill={palette.bg} stroke="currentColor" strokeWidth="2.2" />
        </svg>
        <span
          className={`relative block max-w-full min-w-0 ${padCls} rounded-xl border-2 shadow-sm`}
          style={{
            backgroundColor: palette.bg,
            borderColor: palette.border,
            color: palette.text,
          }}
        >
          {titleNode}
        </span>
      </span>
    );
  }

  // Gold Velvet / Chic Plaque
  if (shapeId === 'gold_velvet') {
    return (
      <span
        className={`relative inline-flex max-w-full min-w-0 items-center ${padCls} rounded-xl border-[3px] border-double shadow-sm`}
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        {titleNode}
      </span>
    );
  }

  // Default: Cloud Plush ("cloud_plush")
  return (
    <span
      className={`relative inline-flex max-w-full min-w-0 items-center ${padCls} rounded-[1.35rem] border-2`}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        color: palette.text,
        boxShadow: '0 4px 12px -6px rgba(0,0,0,0.12), inset 0 -2px 5px rgba(0,0,0,0.05), inset 0 2px 5px rgba(255,255,255,0.65)',
      }}
    >
      {titleNode}
    </span>
  );
};
