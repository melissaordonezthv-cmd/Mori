import React from 'react';
import { Lock } from 'lucide-react';
import type { BadgeEmblemShape, BadgeTier, RecordBadge } from '../constants/records';

interface PreciousBadgeMedalProps {
  badge: RecordBadge;
  earned: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TIER_PALETTES: Record<BadgeTier, { rim: string; faceTop: string; faceBottom: string }> = {
  pearl: { rim: '#E2E8F0', faceTop: '#FFFDF9', faceBottom: '#FCE7F3' },
  rose_quartz: { rim: '#FDA4AF', faceTop: '#FFF1F2', faceBottom: '#FECDD3' },
  amethyst: { rim: '#C4B5FD', faceTop: '#F5F3FF', faceBottom: '#DDD6FE' },
  sapphire: { rim: '#7DD3FC', faceTop: '#F0F9FF', faceBottom: '#BAE6FD' },
  emerald: { rim: '#6EE7B7', faceTop: '#ECFDF5', faceBottom: '#A7F3D0' },
  amber_gold: { rim: '#FBBF24', faceTop: '#FFFBEB', faceBottom: '#FDE68A' },
  diamond: { rim: '#5EEAD4', faceTop: '#FFFFFF', faceBottom: '#CCFBF1' },
  aurora: { rim: '#E879F9', faceTop: '#FDF4FF', faceBottom: '#E0E7FF' },
};

function renderEmblemPath(emblem: BadgeEmblemShape, fill: string, stroke: string) {
  switch (emblem) {
    case 'crown':
      return (
        <path
          d="M19 36 L22 22 L28 28 L32 19 L36 28 L42 22 L45 36 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      );
    case 'heart':
      return (
        <path
          d="M32 42 C24 36 18 30 18 24.5 C18 20.8 21 18.5 24.5 18.5 C27.2 18.5 29.8 20.2 32 22.8 C34.2 20.2 36.8 18.5 39.5 18.5 C43 18.5 46 20.8 46 24.5 C46 30 40 36 32 42 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    case 'butterfly':
      return (
        <g>
          <ellipse cx="24" cy="27" rx="7" ry="5.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="40" cy="27" rx="7" ry="5.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="25.5" cy="36" rx="5.2" ry="4" fill={fill} stroke={stroke} strokeWidth="1.4" />
          <ellipse cx="38.5" cy="36" rx="5.2" ry="4" fill={fill} stroke={stroke} strokeWidth="1.4" />
          <rect x="30.6" y="21" width="2.8" height="19" rx="1.4" fill={stroke} />
        </g>
      );
    case 'moon':
      return (
        <path
          d="M36 19 A12 12 0 1 0 43 39 A9.5 9.5 0 0 1 36 19 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    case 'diamond':
      return (
        <polygon
          points="32,17 44,29 32,45 20,29"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      );
    case 'lotus':
      return (
        <g>
          <path d="M32 18 C36 24 36 33 32 39 C28 33 28 24 32 18 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M32 39 C24 36 19 30 20 23 C25 25 29 31 32 39 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M32 39 C40 36 45 30 44 23 C39 25 35 31 32 39 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      );
    case 'note':
      return (
        <g>
          <path d="M27 36 V21 L41 18 V33" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="37" r="4" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <circle cx="38" cy="34" r="4" fill={fill} stroke={stroke} strokeWidth="1.6" />
        </g>
      );
    case 'wings':
      return (
        <g>
          <path d="M30 33 C20 22 15 27 19 34 C16 37 20 41 29 37 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M34 33 C44 22 49 27 45 34 C48 37 44 41 35 37 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="32" cy="32" r="3.5" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
        </g>
      );
    case 'infinity':
      return (
        <path
          d="M23 30 C19 30 17 34 21 36 C25 38 30 32 32 30 C34 28 39 22 43 24 C47 26 45 32 41 32 C37 32 34 29 32 30 C30 31 27 30 23 30 Z"
          fill="none"
          stroke={stroke}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      );
    case 'star':
    default:
      return (
        <path
          d="M32 17 L35.8 25.6 L45 26.8 L38.2 33 L40 42 L32 37.4 L24 42 L25.8 33 L19 26.8 L28.2 25.6 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      );
  }
}

export const PreciousBadgeMedal: React.FC<PreciousBadgeMedalProps> = ({
  badge,
  earned,
  size = 'md',
}) => {
  const dim = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-10 h-10';
  const pal = TIER_PALETTES[badge.tier];
  const gradId = `medal-grad-${badge.id}-${size}`;

  if (!earned) {
    return (
      <div
        className={`${dim} rounded-full border-2 border-dashed flex items-center justify-center shrink-0 opacity-60`}
        style={{
          borderColor: 'var(--divider-color)',
          backgroundColor: 'rgba(128,128,128,0.08)',
        }}
      >
        <Lock className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className={`relative ${dim} shrink-0 anim-badge-float`}>
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={pal.faceTop} />
            <stop offset="100%" stopColor={pal.faceBottom} />
          </linearGradient>
        </defs>
        {/* Outer scalloped jewel bezel */}
        <circle cx="32" cy="32" r="28" fill={`url(#${gradId})`} stroke={badge.accentHex} strokeWidth="3" />
        <circle cx="32" cy="32" r="23.5" fill="none" stroke={pal.rim} strokeWidth="1.5" strokeDasharray="3 2.5" />
        {/* Corner gem sparkles */}
        <circle cx="32" cy="5.5" r="2.6" fill="#FFFFFF" stroke={badge.accentHex} strokeWidth="1.2" />
        <circle cx="32" cy="58.5" r="2.2" fill={badge.glowHex} stroke={badge.accentHex} strokeWidth="1" />
        <circle cx="5.5" cy="32" r="2.2" fill={badge.glowHex} stroke={badge.accentHex} strokeWidth="1" />
        <circle cx="58.5" cy="32" r="2.2" fill={badge.glowHex} stroke={badge.accentHex} strokeWidth="1" />
        {/* Center emblem */}
        {renderEmblemPath(badge.emblem, badge.glowHex, badge.accentHex)}
      </svg>
    </div>
  );
};
