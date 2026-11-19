import React from 'react';
import type { MusicCardOuterIconId } from '../types/music';

interface MusicCardOuterSvgProps {
  iconId: Exclude<MusicCardOuterIconId, 'none'>;
  className?: string;
}

/**
 * Pure crisp custom SVG vector cute icons (never emoji stickers).
 */
export const MusicCardOuterSvg: React.FC<MusicCardOuterSvgProps> = ({
  iconId,
  className = 'w-5 h-5',
}) => {
  switch (iconId) {
    case 'note_sparkle':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M11 16.5V6.2l7-1.7v9.8"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="17" r="2.7" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="15.5" cy="15" r="2.5" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 4l.8 1.7L7.5 6.5 5.8 7.3 5 9l-.8-1.7L2.5 6.5l1.7-.8L5 4Z" fill="currentColor" />
        </svg>
      );

    case 'bow_ribbon':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M12 11.5C8.5 6.5 3.5 6.5 3.5 11.5S8.5 16.5 12 11.5ZM12 11.5C15.5 6.5 20.5 6.5 20.5 11.5S15.5 16.5 12 11.5Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M10.8 13.5 7.5 19.5M13.2 13.5 16.5 19.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="11.5" r="2.1" fill="currentColor" />
        </svg>
      );

    case 'kitty_silhouette':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M5 10.5 4.2 4.5 9.2 7.5a7.2 7.2 0 0 1 5.6 0l5-3-.8 6c.9 1.3 1.3 2.7 1.3 4 0 3.6-3.7 6-8.3 6s-8.3-2.4-8.3-6c0-1.3.4-2.7 1.3-4Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="9.2" cy="13.5" r="1.1" fill="currentColor" />
          <circle cx="14.8" cy="13.5" r="1.1" fill="currentColor" />
          <path d="M11 15.6h2l-1 1.2-1-1.2Z" fill="currentColor" />
          <path d="M2.5 14h2.5M2.8 16.2h2.4M19 14h2.5M18.8 16.2h2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bunny_silhouette':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <ellipse cx="9" cy="7" rx="2.3" ry="5" transform="rotate(-10 9 7)" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.7" />
          <ellipse cx="15" cy="7" rx="2.3" ry="5" transform="rotate(10 15 7)" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.7" />
          <ellipse cx="12" cy="15.5" rx="6.5" ry="5.2" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="9.8" cy="15" r="1" fill="currentColor" />
          <circle cx="14.2" cy="15" r="1" fill="currentColor" />
          <path d="M11.2 17c.5.5 1.1.5 1.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bear_silhouette':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <circle cx="6.8" cy="7.5" r="2.6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17.2" cy="7.5" r="2.6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="13.5" r="6.8" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" />
          <ellipse cx="12" cy="15.3" rx="2.8" ry="2.1" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="9.5" cy="12.2" r="1" fill="currentColor" />
          <circle cx="14.5" cy="12.2" r="1" fill="currentColor" />
          <circle cx="12" cy="14.7" r="0.9" fill="currentColor" />
        </svg>
      );

    case 'sakura_flower':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M12 10.5 C9.5 6.8, 10 3.2, 12 3.2 C14 3.2, 14.5 6.8, 12 10.5 Z"
              transform={`rotate(${deg} 12 12)`}
              fill="currentColor"
              fillOpacity="0.22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ))}
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
        </svg>
      );

    case 'tulip_bloom':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M7.5 6.5c0 4.5 2 6.8 4.5 6.8s4.5-2.3 4.5-6.8l-2.3 1.8L12 5l-2.2 3.3-2.3-1.8Z"
            fill="currentColor"
            fillOpacity="0.24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 13.3V20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M12 19c-2.8 0-4.5-1.5-4.8-3.8 2.2 0 4 1.2 4.8 3.8ZM12 19c2.8 0 4.5-1.5 4.8-3.8-2.2 0-4 1.2-4.8 3.8Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'crescent_moon':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M15.8 17.8A7.2 7.2 0 0 1 9.5 4.2a7.5 7.5 0 1 0 9.8 11.4 7.1 7.1 0 0 1-3.5 2.2Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 5.2l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9Z"
            fill="currentColor"
          />
        </svg>
      );

    case 'cloud_dream':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M7.2 17.8h10a3.6 3.6 0 0 0 .5-7.1A4.8 4.8 0 0 0 8.6 9.3 3.8 3.8 0 0 0 7.2 17.8Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="9.8" cy="14" r="0.8" fill="currentColor" />
          <circle cx="14.2" cy="14" r="0.8" fill="currentColor" />
        </svg>
      );

    case 'crystal_heart':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M12 20s-7-4.5-8.6-8.4C2 8.4 4.1 5 7.4 5c1.9 0 3.5 1 4.6 2.6C13.1 6 14.7 5 16.6 5c3.3 0 5.4 3.4 4 6.6C19 15.5 12 20 12 20Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M8 9.2 12 13l4-3.8M12 13v6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'butterfly_wing':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M12 12C9 6.2 3.5 5.2 3.5 9.5c0 2.7 3 3.8 8.5 2.5Zm0 0c3-5.8 8.5-6.8 8.5-2.5 0 2.7-3 3.8-8.5 2.5Z"
            fill="currentColor"
            fillOpacity="0.24"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12 12.5c-4.5.6-6.5 3.3-5.2 5.4 1.3 2 4.2 1.2 5.2-5.4Zm0 0c4.5.6 6.5 3.3 5.2 5.4-1.3 2-4.2 1.2-5.2-5.4Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12 7v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'crown_mini':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M4 17.5 3.2 8l4.9 4.2L12 6.5l3.9 5.7L20.8 8 20 17.5H4Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="5.5" r="1.2" fill="currentColor" />
          <circle cx="3.2" cy="7.5" r="1" fill="currentColor" />
          <circle cx="20.8" cy="7.5" r="1" fill="currentColor" />
        </svg>
      );

    case 'headphones_cute':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <rect x="3.2" y="13" width="3.8" height="6" rx="1.9" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.7" />
          <rect x="17" y="13" width="3.8" height="6" rx="1.9" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );

    case 'vinyl_mini':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="5.3" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" fillOpacity="0.32" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" />
        </svg>
      );

    case 'teacup_steam':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M5 11.5h10.5v3.8a4.7 4.7 0 0 1-4.7 4.7H9.7A4.7 4.7 0 0 1 5 15.3v-3.8Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M15.5 12.5h1.8a2.2 2.2 0 0 1 0 4.4h-1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M8.5 8.5c-.6-1 .6-2 0-3M12 8.5c-.6-1 .6-2 0-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'clover_leaf':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <circle cx="9.2" cy="8.5" r="3" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="14.8" cy="8.5" r="3" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9.2" cy="14" r="3" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="14.8" cy="14" r="3" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 14.5c0 2.8.8 4.6 2.3 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'cherry_twin':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path d="M14.5 4.5C11 6.5 9.2 10 8.5 14M14.5 4.5c1 2.8 1.5 6 1.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M14.5 4.5c1.8-.3 3.5.3 4.3 1.5-1.6 1-3.3.7-4.3-1.5Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="7.8" cy="16.5" r="3.2" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="16.2" cy="16.5" r="3.2" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );

    case 'star_gem':
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M12 3.2 14.3 9.7 20.8 12l-6.5 2.3L12 20.8l-2.3-6.5L3.2 12l6.5-2.3L12 3.2Z"
            fill="currentColor"
            fillOpacity="0.24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="17.8" cy="6.2" r="1.1" fill="currentColor" />
        </svg>
      );
  }
};

interface MusicCardOuterIconProps {
  iconId?: MusicCardOuterIconId;
  color?: string;
}

/**
 * Floating outer vector badge mounted OUTSIDE the top border of the music card
 * (never inside the album art/vinyl stage or card interior).
 */
export const MusicCardOuterIcon: React.FC<MusicCardOuterIconProps> = ({
  iconId = 'note_sparkle',
  color = 'auto',
}) => {
  if (!iconId || iconId === 'none') return null;

  const resolvedColor = !color || color === 'auto' ? 'var(--text-main)' : color;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-6 z-20 w-9 h-9 rounded-2xl border-2 shadow-md flex items-center justify-center transition-transform duration-300"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--accent-color)',
        color: resolvedColor,
        boxShadow: '0 6px 14px -4px rgba(0,0,0,0.16), 0 0 0 3px var(--bg-app)',
      }}
    >
      <MusicCardOuterSvg iconId={iconId} className="w-5 h-5" />
    </div>
  );
};
