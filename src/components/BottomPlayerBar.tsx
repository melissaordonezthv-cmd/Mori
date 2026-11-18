import React from 'react';
import {
  ChevronUp,
  Pause,
  PictureInPicture2,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import type { AudioTrack, SongBarAnimationId, ThemeConfig } from '../types/music';
import { formatDuration } from '../utils/audioMetadata';
import { getPlaybackControlPresentation } from '../utils/playbackButtons3D';
import { SongProgressBar } from './SongProgressBar';

interface BottomPlayerBarProps {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  songBarAnimation?: SongBarAnimationId;
  theme?: ThemeConfig;
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
  songBarAnimation = 'shimmer_glow',
  theme,
  isFloatingOpen,
  onTogglePlay,
  onNext,
  onPrev,
  onOpenMobilePlayer,
  onToggleFloating,
}) => {
  if (!track) return null;
  const navCtrl = getPlaybackControlPresentation('nav', theme);
  const playCtrl = getPlaybackControlPresentation('play', theme);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--divider-color)',
      }}
    >
      {/* Slim animated song progress bar */}
      <SongProgressBar
        currentTime={currentTime}
        duration={duration}
        animation={songBarAnimation}
        isPlaying={isPlaying}
        compact
      />

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

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Anterior"
            className={`hidden sm:flex min-w-[38px] min-h-[38px] ${navCtrl.className}`}
            style={navCtrl.style}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className={`w-11 h-11 ${playCtrl.className}`}
            style={playCtrl.style}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="Siguiente"
            className={`min-w-[38px] min-h-[38px] ${navCtrl.className}`}
            style={navCtrl.style}
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
            className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
