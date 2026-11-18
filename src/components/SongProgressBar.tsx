import React from 'react';
import type { SongBarAnimationId } from '../types/music';

interface SongProgressBarProps {
  currentTime: number;
  duration: number;
  animation: SongBarAnimationId;
  isPlaying?: boolean;
  compact?: boolean;
  onSeek?: (sec: number) => void;
}

const WAVE_ANIMATIONS = new Set<SongBarAnimationId>([
  'wave_ribbon',
  'double_wave',
  'sound_eq_wave',
  'milk_splash',
  'pistachio_cream',
]);

const OUT_OF_LINE_ANIMATIONS = new Set<SongBarAnimationId>([
  'out_float_wave',
  'out_elastic_arc',
  'out_pulse_bars',
  'out_ribbon_loop',
  'out_liquid_crest',
  'out_bounce_line',
  'out_comet_orb',
  'out_heartbeat_ecg',
]);

export const SongProgressBar: React.FC<SongProgressBarProps> = ({
  currentTime,
  duration,
  animation,
  isPlaying = true,
  compact = false,
  onSeek,
}) => {
  const pct = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const isRainbow = animation === 'rainbow_candy';
  const isPistachio = animation === 'pistachio_cream';
  const isWaveSvg = WAVE_ANIMATIONS.has(animation);
  const isOutOfLine = OUT_OF_LINE_ANIMATIONS.has(animation);
  const isJelly = animation === 'jelly_ripple';

  const renderWaveSvgOverlay = () => {
    if (!isWaveSvg) return null;

    if (animation === 'sound_eq_wave') {
      return (
        <svg
          viewBox="0 0 200 16"
          preserveAspectRatio="none"
          className={`absolute inset-0 w-[200%] h-full pointer-events-none ${
            isPlaying ? 'bar-anim-wave-svg' : ''
          }`}
          aria-hidden="true"
        >
          <path
            d="M0 8 Q 6 1, 12 8 T 25 8 T 37 8 T 50 8 T 62 8 T 75 8 T 87 8 T 100 8 T 112 8 T 125 8 T 137 8 T 150 8 T 162 8 T 175 8 T 187 8 T 200 8"
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <>
        <svg
          viewBox="0 0 200 16"
          preserveAspectRatio="none"
          className={`absolute inset-0 w-[200%] h-full pointer-events-none ${
            isPlaying ? 'bar-anim-wave-svg' : ''
          }`}
          aria-hidden="true"
        >
          <path
            d="M0 8 Q 12.5 2, 25 8 T 50 8 T 75 8 T 100 8 T 125 8 T 150 8 T 175 8 T 200 8 L 200 16 L 0 16 Z"
            fill={animation === 'milk_splash' ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.38)'}
          />
        </svg>
        {(animation === 'double_wave' || animation === 'wave_ribbon' || animation === 'pistachio_cream') && (
          <svg
            viewBox="0 0 200 16"
            preserveAspectRatio="none"
            className={`absolute inset-0 w-[200%] h-full pointer-events-none ${
              isPlaying ? 'bar-anim-wave-svg-reverse' : ''
            }`}
            aria-hidden="true"
          >
            <path
              d="M0 9 Q 12.5 14, 25 9 T 50 9 T 75 9 T 100 9 T 125 9 T 150 9 T 175 9 T 200 9"
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </>
    );
  };

  const renderFillOverlay = () => {
    if (animation === 'none') return null;
    if (isWaveSvg) return renderWaveSvgOverlay();
    if (
      animation === 'shimmer_glow' ||
      animation === 'floating_sparkles' ||
      animation === 'comet_trail' ||
      animation === 'starlight_stream'
    ) {
      return <span className="absolute inset-0 w-1/2 bar-anim-shimmer pointer-events-none" />;
    }
    if (animation === 'candy_stripes') {
      return <span className="absolute inset-0 bar-anim-stripes pointer-events-none" />;
    }
    if (animation === 'bubble_stream' || animation === 'sakura_petals') {
      return <span className="absolute inset-0 bar-anim-bubbles pointer-events-none" />;
    }
    if (animation === 'jelly_ripple') {
      return <span className="absolute inset-0 bar-anim-wave pointer-events-none" />;
    }
    return null;
  };

  const barBgClass = isRainbow
    ? 'bar-anim-rainbow'
    : isPistachio
      ? 'bar-anim-pistachio'
      : '';

  // Out-of-line emoji-free geometric/wave overlays clipped horizontally to progress pct, vertically overflowing!
  const renderOutOfLineSvgLayer = () => {
    if (!isOutOfLine || animation === 'out_bounce_line' || animation === 'out_comet_orb') {
      return null;
    }

    if (animation === 'out_pulse_bars') {
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden flex items-center gap-[3px]"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full shrink-0 ${isPlaying ? 'bar-anim-eq-bar' : ''}`}
              style={{
                height: i % 3 === 0 ? '22px' : i % 2 === 0 ? '16px' : '12px',
                backgroundColor: 'var(--song-bar-color)',
                animationDelay: `${(i % 7) * 0.11}s`,
              }}
            />
          ))}
        </div>
      );
    }

    if (animation === 'out_elastic_arc') {
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <svg
            viewBox="0 0 240 32"
            preserveAspectRatio="none"
            className={`w-[200%] h-full ${isPlaying ? 'bar-anim-wave-svg' : ''}`}
          >
            <path
              d="M0 16 Q 15 1, 30 16 T 60 16 T 90 16 T 120 16 T 150 16 T 180 16 T 210 16 T 240 16"
              fill="none"
              stroke="var(--song-bar-color)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    if (animation === 'out_liquid_crest') {
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <svg
            viewBox="0 0 240 32"
            preserveAspectRatio="none"
            className={`w-[200%] h-full ${isPlaying ? 'bar-anim-wave-svg' : ''}`}
          >
            <path
              d="M0 17 Q 15 4, 30 17 T 60 17 T 90 17 T 120 17 T 150 17 T 180 17 T 210 17 T 240 17 L 240 24 L 0 24 Z"
              fill="var(--song-bar-color)"
              opacity="0.72"
            />
          </svg>
        </div>
      );
    }

    if (animation === 'out_heartbeat_ecg') {
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <svg
            viewBox="0 0 240 32"
            preserveAspectRatio="none"
            className={`w-[200%] h-full ${isPlaying ? 'bar-anim-wave-svg' : ''}`}
          >
            <path
              d="M0 16 L 14 16 L 20 5 L 26 27 L 32 10 L 38 16 L 60 16 L 74 16 L 80 5 L 86 27 L 92 10 L 98 16 L 120 16 L 134 16 L 140 5 L 146 27 L 152 10 L 158 16 L 180 16 L 194 16 L 200 5 L 206 27 L 212 10 L 218 16 L 240 16"
              fill="none"
              stroke="var(--song-bar-color)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }

    // out_float_wave & out_ribbon_loop
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <svg
          viewBox="0 0 240 32"
          preserveAspectRatio="none"
          className={`w-[200%] h-full ${isPlaying ? 'bar-anim-wave-svg' : ''}`}
        >
          <path
            d="M0 16 Q 15 3, 30 16 T 60 16 T 90 16 T 120 16 T 150 16 T 180 16 T 210 16 T 240 16"
            fill="none"
            stroke="var(--song-bar-color)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
        {animation === 'out_ribbon_loop' && (
          <svg
            viewBox="0 0 240 32"
            preserveAspectRatio="none"
            className={`absolute inset-0 w-[200%] h-full opacity-70 ${
              isPlaying ? 'bar-anim-wave-svg-reverse' : ''
            }`}
          >
            <path
              d="M0 16 Q 15 29, 30 16 T 60 16 T 90 16 T 120 16 T 150 16 T 180 16 T 210 16 T 240 16"
              fill="none"
              stroke="var(--song-bar-color)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="h-2 w-full bg-black/10 overflow-visible relative flex items-center">
        <div
          className={`h-1.5 relative overflow-hidden transition-all duration-200 ${barBgClass} ${
            isJelly && isPlaying ? 'bar-anim-jelly' : ''
          } ${animation === 'out_bounce_line' && isPlaying ? 'bar-anim-bounce-line' : ''}`}
          style={{
            width: `${pct}%`,
            backgroundColor: isRainbow || isPistachio ? undefined : 'var(--song-bar-color)',
          }}
        >
          {isPlaying && renderFillOverlay()}
        </div>
        {isOutOfLine && (
          <div className="pointer-events-none absolute -top-2 -bottom-2 left-0 right-0">
            {renderOutOfLineSvgLayer()}
          </div>
        )}
      </div>
    );
  }

  const renderThumb = () => {
    // Out-of-line emoji-free glowing pearl / sphere thumb
    if (isOutOfLine) {
      return (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md ${
            isPlaying ? 'bar-anim-orb-float' : '-translate-x-1/2 -translate-y-1/2'
          }`}
          style={{
            left: `${pct}%`,
            backgroundColor: 'var(--song-bar-color)',
          }}
        />
      );
    }

    const emojiThumb = (emoji: string, animClass: string) => (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 text-base leading-none select-none drop-shadow ${
          isPlaying ? animClass : '-translate-x-1/2 -translate-y-1/2'
        }`}
        style={{ left: `${pct}%` }}
      >
        {emoji}
      </span>
    );

    if (animation === 'heart_pulse') return emojiThumb('💕', 'bar-thumb-pulse');
    if (animation === 'bouncing_note') return emojiThumb('🎵', 'bar-thumb-bounce');
    if (animation === 'sakura_petals') return emojiThumb('🌸', 'bar-thumb-bounce');
    if (animation === 'cat_paw') return emojiThumb('🐾', 'bar-thumb-pulse');
    if (animation === 'floating_sparkles') return emojiThumb('🌟', 'bar-thumb-pulse');
    if (animation === 'starlight_stream') return emojiThumb('🌠', 'bar-thumb-glide');
    if (animation === 'butterfly_glide') return emojiThumb('🦋', 'bar-thumb-glide');
    if (animation === 'bunny_hop') return emojiThumb('🐰', 'bar-thumb-bounce');
    if (animation === 'wave_ribbon') return emojiThumb('🌊', 'bar-thumb-glide');
    if (animation === 'milk_splash') return emojiThumb('🫧', 'bar-thumb-glide');
    if (animation === 'pistachio_cream') return emojiThumb('🍵', 'bar-thumb-glide');

    if (animation === 'comet_trail') {
      return (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 w-4 h-4 rounded-full border border-white ${
            isPlaying ? 'bar-thumb-comet' : '-translate-x-1/2 -translate-y-1/2'
          }`}
          style={{
            left: `${pct}%`,
            backgroundColor: '#FFFFFF',
          }}
        />
      );
    }

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-4 h-4 rounded-full shadow border border-white/80 -translate-x-1/2 transition-transform group-hover:scale-110"
        style={{
          left: `${pct}%`,
          backgroundColor: isRainbow
            ? '#f9a8d4'
            : isPistachio
              ? '#b8dda1'
              : 'var(--song-bar-color)',
        }}
      />
    );
  };

  return (
    <div className="relative h-8 flex items-center group overflow-visible">
      {/* Baseline Rail */}
      <div
        className={`w-full rounded-full bg-black/10 relative ${
          isOutOfLine && animation !== 'out_bounce_line' && animation !== 'out_comet_orb'
            ? 'h-1.5 overflow-hidden'
            : 'h-3 overflow-hidden'
        } ${animation === 'out_bounce_line' && isPlaying ? 'bar-anim-bounce-line' : ''}`}
      >
        <div
          className={`h-full rounded-full relative overflow-hidden transition-all duration-100 ${barBgClass} ${
            isJelly && isPlaying ? 'bar-anim-jelly' : ''
          }`}
          style={{
            width: `${pct}%`,
            backgroundColor: isRainbow || isPistachio ? undefined : 'var(--song-bar-color)',
          }}
        >
          {renderFillOverlay()}
        </div>
      </div>

      {/* Out-of-line SVG / Bar layer overflowing vertically outside the baseline */}
      {isOutOfLine && (
        <div className="pointer-events-none absolute inset-0 overflow-visible">
          {renderOutOfLineSvgLayer()}
        </div>
      )}

      {renderThumb()}
      {onSeek && (
        <input
          type="range"
          min={0}
          max={Math.max(1, duration)}
          step={0.1}
          aria-label="Progreso de reproducción"
          value={Math.min(currentTime, duration || 1)}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
};
