import React from 'react';
import type { AvatarFrameId, CharmStickerId } from '../types/music';

interface CuteAvatarFrameProps {
  avatarUrl: string;
  displayName: string;
  frame: AvatarFrameId;
  size?: 'sm' | 'lg';
}

export const CuteAvatarFrame: React.FC<CuteAvatarFrameProps> = ({
  avatarUrl,
  displayName,
  frame,
  size = 'lg',
}) => {
  const dim = size === 'lg' ? 'w-24 h-24' : 'w-11 h-11';
  const showDecor = size === 'lg';

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
  cloud: 'Nube',
  matcha: 'Matcha',
  boba: 'Boba Tea',
  strawberry: 'Fresa',
  peach: 'Durazno',
  cherry: 'Cereza',
  cake: 'Pastelito',
  spark: 'Estrella',
  crescent: 'Luna',
  cat: 'Gatito',
  tulip: 'Tulipán',
  letter: 'Cartita',
  headphones: 'Audífonos',
};

export const FRAME_LABELS: Record<AvatarFrameId, string> = {
  none: 'Sin marco',
  sakura: 'Sakura',
  bunny: 'Conejito',
  kitty: 'Gatito',
  bear: 'Osito',
  puppy: 'Perrito',
  panda: 'Pandita',
  frog: 'Ranita',
  pearl: 'Perlas',
  lace: 'Encaje',
  starry: 'Estrellas',
  sparkles: 'Destellos',
  ribbon: 'Moño',
  butterfly: 'Mariposas',
  moon: 'Luna',
  cloud_dream: 'Nubes',
  clover: 'Trébol',
  heart: 'Corazones',
  strawberry: 'Fresitas',
  peach: 'Durazno',
  flower_crown: 'Corona floral',
  crown: 'Princesa',
  angel: 'Angelito',
  headphones: 'Audífonos',
};
