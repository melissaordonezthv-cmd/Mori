import React, { useRef, useState } from 'react';
import {
  GripHorizontal,
  Pause,
  PictureInPicture2,
  Play,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import type { AudioTrack } from '../types/music';
import { formatDuration } from '../utils/audioMetadata';

interface FloatingOverlayWidgetProps {
  open: boolean;
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeLyric: string;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPopOutOS: () => void;
  onClose: () => void;
}

export const FloatingOverlayWidget: React.FC<FloatingOverlayWidgetProps> = ({
  open,
  track,
  isPlaying,
  currentTime,
  duration,
  activeLyric,
  onTogglePlay,
  onPrev,
  onNext,
  onPopOutOS,
  onClose,
}) => {
  const [pos, setPos] = useState({ x: 20, y: 84 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  if (!open || !track) return null;

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: Math.max(8, Math.min(window.innerWidth - 290, dragRef.current.origX + dx)),
      y: Math.max(8, Math.min(window.innerHeight - 170, dragRef.current.origY + dy)),
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--divider-color)',
        color: 'var(--text-main)',
      }}
      className="fixed z-50 w-72 rounded-2xl border shadow-2xl backdrop-blur-md overflow-hidden select-none"
      role="region"
      aria-label="Controles flotantes"
    >
      {/* Drag Handle Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="px-3 py-1.5 flex items-center justify-between border-b cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--divider-color)',
        }}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <GripHorizontal className="w-3.5 h-3.5 opacity-60" />
          <span>Mini flotante</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPopOutOS}
            title="Ventana flotante sobre otras apps (PiP)"
            aria-label="Abrir ventana flotante del sistema"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80"
          >
            <PictureInPicture2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar mini flotante"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src={track.coverUrl}
            alt={track.title}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover shrink-0 border"
            style={{ borderColor: 'var(--divider-color)' }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">{track.title}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {track.artist}
            </p>
          </div>
        </div>

        {activeLyric && (
          <p className="text-[11px] italic line-clamp-2 leading-snug" style={{ color: 'var(--text-muted)' }}>
            {activeLyric}
          </p>
        )}

        <div className="h-1.5 w-full rounded-full overflow-hidden bg-black/10">
          <div
            className="h-full transition-all duration-200"
            style={{ width: `${pct}%`, backgroundColor: 'var(--song-bar-color)' }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-nums" style={{ color: 'var(--text-muted)' }}>
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Anterior"
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: '#1C1B1F',
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Siguiente"
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
