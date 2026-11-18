import React from 'react';
import {
  ChevronUp,
  Pause,
  PictureInPicture2,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import type { AudioTrack } from '../types/music';
import { formatDuration } from '../utils/audioMetadata';

interface BottomPlayerBarProps {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFloatingOpen: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenMobilePlayer: () => void;
  onToggleFloating: () => void;
}

export const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  isFloatingOpen,
  onTogglePlay,
  onNext,
  onPrev,
  onOpenMobilePlayer,
  onToggleFloating,
}) => {
  if (!track) return null;

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--divider-color)',
      }}
    >
      {/* Slim song progress bar */}
      <div className="h-1 w-full bg-black/10">
        <div
          className="h-full transition-all duration-200"
          style={{
            width: `${pct}%`,
            backgroundColor: 'var(--song-bar-color)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenMobilePlayer}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
        >
          <img
            src={track.coverUrl}
            alt={track.title}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover shrink-0 border"
            style={{ borderColor: 'var(--divider-color)' }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{track.title}</p>
            <p className="text-xs truncate font-mono-nums" style={{ color: 'var(--text-muted)' }}>
              {track.artist} · {formatDuration(currentTime)} / {formatDuration(duration)}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Anterior"
            className="hidden sm:flex min-w-[40px] min-h-[40px] rounded-xl items-center justify-center"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#1C1B1F',
            }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="Siguiente"
            className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleFloating}
            aria-label="Reproductor flotante"
            title="Escuchar sobre otras apps"
            className="hidden sm:flex min-w-[40px] min-h-[40px] rounded-xl items-center justify-center border"
            style={{
              backgroundColor: isFloatingOpen ? 'var(--accent-soft)' : 'transparent',
              borderColor: 'var(--divider-color)',
            }}
          >
            <PictureInPicture2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenMobilePlayer}
            aria-label="Expandir reproductor"
            className="lg:hidden min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
