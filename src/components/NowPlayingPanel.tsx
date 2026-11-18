import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Disc3,
  Edit3,
  Heart,
  Languages,
  Layers,
  ListMusic,
  Loader2,
  Pause,
  PictureInPicture2,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Sliders,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { LANGUAGE_OPTIONS, type Translations } from '../constants/i18n';
import { AUDIO_MODE_PROFILES, EQ_PRESETS, MOOD_AURAS } from '../constants/themes';
import type {
  AppLanguage,
  AppSettings,
  AudioEngineMode,
  AudioTrack,
  EqPresetId,
  RepeatMode,
} from '../types/music';
import { formatDuration } from '../utils/audioMetadata';
import { AudioVisualizer } from './AudioVisualizer';
import { ImageEditorModal } from './ImageEditorModal';

interface NowPlayingPanelProps {
  track: AudioTrack | null;
  tracks: AudioTrack[];
  queueIds: string[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  moodSyncEnabled: boolean;
  isFloatingOpen: boolean;
  isWidgetOpen: boolean;
  isAnalyzingLyrics: boolean;
  aiError: string | null;
  settings: AppSettings;
  analyserRef: React.RefObject<AnalyserNode | null>;
  accentColor: string;
  t: Translations;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (sec: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleFavorite: (trackId: string) => void;
  onEditTrack: (track: AudioTrack) => void;
  onQuickUpdateCover: (track: AudioTrack, newCoverUrl: string) => void;
  onDetectLyrics: (track: AudioTrack, manualText?: string) => void;
  onRetranslateLyrics: (track: AudioTrack, targetLang: AppLanguage) => void;
  onChangeTargetLanguage: (lang: AppLanguage) => void;
  onPlayTrack: (trackId: string) => void;
  onRemoveFromQueue: (trackId: string) => void;
  onChangeEqPreset: (preset: EqPresetId) => void;
  onChangeAudioSettings: (partial: Partial<AppSettings>) => void;
  onToggleFloating: () => void;
  onToggleWidget: () => void;
}

export const NowPlayingPanel: React.FC<NowPlayingPanelProps> = ({
  track,
  tracks,
  queueIds,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  shuffle,
  repeat,
  moodSyncEnabled,
  isFloatingOpen,
  isWidgetOpen,
  isAnalyzingLyrics,
  aiError,
  settings,
  analyserRef,
  accentColor,
  t,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onCycleRepeat,
  onToggleFavorite,
  onEditTrack,
  onQuickUpdateCover,
  onDetectLyrics,
  onRetranslateLyrics,
  onChangeTargetLanguage,
  onPlayTrack,
  onRemoveFromQueue,
  onChangeEqPreset,
  onChangeAudioSettings,
  onToggleFloating,
  onToggleWidget,
}) => {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'queue' | 'eq'>('lyrics');
  const [showOriginalLyrics, setShowOriginalLyrics] = useState(true);
  const [manualLyricsOpen, setManualLyricsOpen] = useState(false);
  const [manualLyricsInput, setManualLyricsInput] = useState('');
  const [pendingQuickCover, setPendingQuickCover] = useState<{
    src: string;
    trackId: string;
  } | null>(null);
  const quickCoverInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (pendingQuickCover) {
        URL.revokeObjectURL(pendingQuickCover.src);
      }
    };
  }, [pendingQuickCover]);

  const closePendingQuickCover = () => {
    setPendingQuickCover((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.src);
      }
      return null;
    });
  };

  const moodMeta = track?.lyrics?.mood ? MOOD_AURAS[track.lyrics.mood] : null;
  const activeAuraColor =
    moodSyncEnabled && track?.lyrics?.suggestedAura
      ? track.lyrics.suggestedAura
      : accentColor;

  const activeLineIndex = useMemo(() => {
    const lines = track?.lyrics?.lines ?? [];
    if (lines.length === 0) return -1;
    let idx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (currentTime >= lines[i].timeSec) {
        idx = i;
      }
    }
    return idx;
  }, [track?.lyrics?.lines, currentTime]);

  const queueTracks = useMemo(() => {
    const map = new Map(tracks.map((tr) => [tr.id, tr]));
    return queueIds.map((id) => map.get(id)).filter((tr): tr is AudioTrack => Boolean(tr));
  }, [queueIds, tracks]);

  const handleQuickCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !track) return;
    const objectUrl = URL.createObjectURL(file);
    setPendingQuickCover({ src: objectUrl, trackId: track.id });
    e.target.value = '';
  };

  if (!track) {
    return (
      <div
        className="rounded-3xl border p-8 flex flex-col items-center justify-center text-center min-h-[420px]"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--accent-soft)' }}
        >
          <Disc3 className="w-10 h-10 opacity-75" />
        </div>
        <h3 className="text-lg font-bold tracking-tight">{t.nowPlaying}</h3>
        <p className="text-sm mt-1 max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Elige una canción de tu biblioteca o importa tus archivos sin pérdida para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl border overflow-hidden relative transition-all duration-700"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor:
          moodSyncEnabled && track.lyrics?.suggestedAura
            ? track.lyrics.suggestedAura
            : 'var(--divider-color)',
        backgroundImage:
          moodSyncEnabled && moodMeta
            ? `radial-gradient(circle at 20% 0%, ${moodMeta.aura1}, transparent 60%), radial-gradient(circle at 90% 25%, ${moodMeta.aura2}, transparent 54%)`
            : undefined,
      }}
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top Track Header & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium font-mono-nums truncate" style={{ color: 'var(--text-muted)' }}>
              {track.format}
              {track.lossless ? ' · Sin pérdida' : ''}
              {track.bitDepth && track.sampleRate
                ? ` · ${track.bitDepth}-bit/${Math.round(track.sampleRate / 1000)}kHz`
                : ''}
              {track.year ? ` · ${track.year}` : ''}
              {track.genre ? ` · ${track.genre}` : ''}
            </p>
            <h2 className="text-xl font-bold tracking-tight truncate mt-0.5">{track.title}</h2>
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
              {track.artist} · {track.album}
            </p>
            {track.notes && (
              <p className="text-xs italic truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                “{track.notes}”
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavorite(track.id)}
              aria-label="Favorita"
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border transition"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Heart className="w-4 h-4" fill={track.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={() => onEditTrack(track)}
              aria-label={t.editTrack}
              title={t.editTrack}
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border transition"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleWidget}
              aria-label="Controles flotantes"
              title="Mini controles flotantes"
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border transition"
              style={{
                backgroundColor: isWidgetOpen ? 'var(--accent-color)' : 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
                color: isWidgetOpen ? '#1C1B1F' : 'var(--text-main)',
              }}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleFloating}
              aria-label={t.floatingPlayer}
              title={t.floatingPlayer}
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border transition"
              style={{
                backgroundColor: isFloatingOpen ? 'var(--accent-color)' : 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
                color: isFloatingOpen ? '#1C1B1F' : 'var(--text-main)',
              }}
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cover Art + Mood Aura + Direct Gallery Cover Change */}
        <div className="flex flex-col items-center">
          <div className="relative w-52 h-52 sm:w-56 sm:h-56">
            {/* Mood-synced breathing halo */}
            {moodSyncEnabled && (
              <div
                className="absolute -inset-3 rounded-[2rem] blur-xl opacity-55 transition-all duration-700 pointer-events-none"
                style={{
                  backgroundColor: activeAuraColor,
                  transform: isPlaying ? 'scale(1.03)' : 'scale(0.96)',
                }}
              />
            )}

            {/* Rotating disc edge */}
            <div
              className={`absolute inset-2 rounded-full border shadow-inner flex items-center justify-center ${
                isPlaying ? 'vinyl-spin' : 'vinyl-spin-paused'
              }`}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full border"
                style={{ borderColor: 'var(--divider-color)' }}
              />
            </div>

            <div
              className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-lg border group"
              style={{
                borderColor: 'var(--divider-color)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <img
                src={track.coverUrl}
                alt={track.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => quickCoverInputRef.current?.click()}
                title={t.changeCover}
                aria-label={t.changeCover}
                className="absolute bottom-2.5 right-2.5 z-20 min-w-[38px] min-h-[38px] px-2.5 rounded-xl bg-black/55 text-white backdrop-blur-md flex items-center gap-1.5 text-[11px] font-medium opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Portada</span>
              </button>
              <input
                ref={quickCoverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQuickCoverChange}
              />
            </div>
          </div>

          {track.lyrics && (
            <div className="mt-3 text-center">
              <p className="text-xs font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  Ánimo: {track.lyrics.moodLabel} · Idioma detectado: {track.lyrics.detectedLanguage}
                </span>
              </p>
              <p className="text-xs mt-0.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>
                {track.lyrics.moodDescription}
              </p>
            </div>
          )}
        </div>

        {/* Real-Time Audio Spectrum */}
        <AudioVisualizer
          analyserRef={analyserRef}
          isPlaying={isPlaying}
          accentColor={activeAuraColor}
          tempoFeeling={track.lyrics?.tempoFeeling ?? 'medium'}
        />

        {/* Progress Scrubber */}
        <div className="space-y-1.5">
          <div className="relative h-6 flex items-center group">
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%`,
                  backgroundColor: 'var(--song-bar-color)',
                }}
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute w-4 h-4 rounded-full shadow border border-white/80 -translate-x-1/2 transition-transform group-hover:scale-110"
              style={{
                left: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%`,
                backgroundColor: 'var(--song-bar-color)',
              }}
            />
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
          </div>
          <div
            className="flex items-center justify-between text-xs font-mono-nums"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Main Playback Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onToggleShuffle}
            aria-label="Aleatorio"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition"
            style={{
              backgroundColor: shuffle ? 'var(--accent-soft)' : 'transparent',
            }}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Anterior"
              className="min-w-[46px] min-h-[46px] rounded-2xl flex items-center justify-center border transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform active:scale-95"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: '#1C1B1F',
              }}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={onNext}
              aria-label="Siguiente"
              className="min-w-[46px] min-h-[46px] rounded-2xl flex items-center justify-center border transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onCycleRepeat}
            aria-label="Repetir"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition"
            style={{
              backgroundColor: repeat !== 'off' ? 'var(--accent-soft)' : 'transparent',
            }}
          >
            {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 px-1">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            aria-label="Volumen"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 accent-current cursor-pointer"
          />
          <span
            className="text-xs font-mono-nums w-9 text-right"
            style={{ color: 'var(--text-muted)' }}
          >
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Segmented Tabs: AI Lyrics / Queue / Equalizer */}
        <div
          className="grid grid-cols-3 gap-1 p-1 rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--divider-color)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className="min-h-[40px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            style={{
              backgroundColor: activeTab === 'lyrics' ? 'var(--bg-elevated)' : 'transparent',
            }}
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{t.lyricsTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className="min-h-[40px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            style={{
              backgroundColor: activeTab === 'queue' ? 'var(--bg-elevated)' : 'transparent',
            }}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">
              {t.queueTab} ({queueTracks.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('eq')}
            className="min-h-[40px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            style={{
              backgroundColor: activeTab === 'eq' ? 'var(--bg-elevated)' : 'transparent',
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{t.eqTab}</span>
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'lyrics' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                disabled={isAnalyzingLyrics}
                onClick={() => onDetectLyrics(track)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition disabled:opacity-60"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: '#1C1B1F',
                }}
              >
                {isAnalyzingLyrics ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isAnalyzingLyrics ? t.analyzingAI : t.detectLyricsAI}</span>
              </button>

              <div className="flex items-center gap-2">
                <select
                  aria-label="Idioma de traducción instantánea"
                  value={settings.language}
                  disabled={isAnalyzingLyrics}
                  onChange={(e) => {
                    const nextLang = e.target.value as AppLanguage;
                    onChangeTargetLanguage(nextLang);
                    if (track.lyrics) {
                      onRetranslateLyrics(track, nextLang);
                    }
                  }}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-medium border focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                    color: 'var(--text-main)',
                  }}
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      → {lang.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowOriginalLyrics((v) => !v)}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  {showOriginalLyrics ? 'Bilingüe' : 'Traducción'}
                </button>
              </div>
            </div>

            {aiError && (
              <p
                className="text-xs px-3 py-2 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                {aiError}
              </p>
            )}

            {/* Optional Paste Lyrics Helper */}
            <div>
              <button
                type="button"
                onClick={() => setManualLyricsOpen((v) => !v)}
                className="text-xs underline underline-offset-4"
                style={{ color: 'var(--text-muted)' }}
              >
                {manualLyricsOpen
                  ? 'Ocultar entrada manual'
                  : '¿Tienes la letra? Pégala para detectar idioma y traducir al instante'}
              </button>
              {manualLyricsOpen && (
                <div className="mt-2 space-y-2">
                  <textarea
                    rows={3}
                    value={manualLyricsInput}
                    onChange={(e) => setManualLyricsInput(e.target.value)}
                    placeholder="Pega aquí la letra original en cualquier idioma…"
                    className="w-full p-3 rounded-xl border text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                  <button
                    type="button"
                    disabled={isAnalyzingLyrics || !manualLyricsInput.trim()}
                    onClick={() => {
                      onDetectLyrics(track, manualLyricsInput.trim());
                      setManualLyricsOpen(false);
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      color: '#1C1B1F',
                    }}
                  >
                    Traducir con IA ahora
                  </button>
                </div>
              )}
            </div>

            {/* Lyrics Display */}
            <div
              className="max-h-60 overflow-y-auto rounded-2xl border p-4 space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {track.lyrics && track.lyrics.lines.length > 0 ? (
                track.lyrics.lines.map((line, i) => {
                  const isActive = i === activeLineIndex;
                  return (
                    <button
                      key={`${line.timeSec}-${i}`}
                      type="button"
                      onClick={() => onSeek(line.timeSec)}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 transition-all block"
                      style={{
                        backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                        opacity: isActive ? 1 : 0.72,
                      }}
                    >
                      {showOriginalLyrics && (
                        <p className="text-sm font-semibold leading-snug">{line.original}</p>
                      )}
                      <p
                        className="text-xs mt-0.5 leading-snug"
                        style={{
                          color: showOriginalLyrics ? 'var(--text-muted)' : 'var(--text-main)',
                        }}
                      >
                        {line.translated}
                      </p>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>
                  Pulsa “{t.detectLyricsAI}” para que la IA escuche el audio, detecte el idioma, sincronice el ánimo y traduzca automáticamente al idioma elegido.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div
            className="max-h-60 overflow-y-auto rounded-2xl border divide-y"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            {queueTracks.map((qt, idx) => {
              const current = qt.id === track.id;
              return (
                <div
                  key={`${qt.id}-${idx}`}
                  className="px-3 py-2.5 flex items-center justify-between gap-2"
                  style={{
                    borderColor: 'var(--divider-color)',
                    backgroundColor: current ? 'var(--accent-soft)' : 'transparent',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onPlayTrack(qt.id)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    <img
                      src={qt.coverUrl}
                      alt={qt.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{qt.title}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {qt.artist} · {formatDuration(qt.duration)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveFromQueue(qt.id)}
                    aria-label="Quitar de cola"
                    className="min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center opacity-70 hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'eq' && (
          <div
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold">Motor Hi-Fi y Audio Espacial</p>
                <button
                  type="button"
                  onClick={() =>
                    onChangeAudioSettings({
                      soundCheckEnabled: !(settings.soundCheckEnabled ?? true),
                    })
                  }
                  className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition"
                  style={{
                    backgroundColor:
                      (settings.soundCheckEnabled ?? true)
                        ? 'var(--accent-soft)'
                        : 'var(--bg-elevated)',
                    borderColor:
                      (settings.soundCheckEnabled ?? true)
                        ? 'var(--text-main)'
                        : 'var(--divider-color)',
                  }}
                >
                  Sound Check {(settings.soundCheckEnabled ?? true) ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(AUDIO_MODE_PROFILES) as AudioEngineMode[]).map((modeId) => {
                  const active = (settings.audioMode ?? 'apple_master') === modeId;
                  return (
                    <button
                      key={modeId}
                      type="button"
                      onClick={() => onChangeAudioSettings({ audioMode: modeId })}
                      className="min-h-[38px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition"
                      style={{
                        backgroundColor: active ? 'var(--accent-color)' : 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                        color: active ? '#1C1B1F' : 'var(--text-main)',
                      }}
                    >
                      {AUDIO_MODE_PROFILES[modeId].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t space-y-2.5" style={{ borderColor: 'var(--divider-color)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Ecualización rápida (personaliza las 5 bandas y amplitud en Ajustes)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(EQ_PRESETS) as EqPresetId[]).map((presetId) => {
                  const active = settings.eqPreset === presetId;
                  return (
                    <button
                      key={presetId}
                      type="button"
                      onClick={() => onChangeEqPreset(presetId)}
                      className="min-h-[40px] px-3 py-2 rounded-xl border text-xs font-semibold transition"
                      style={{
                        backgroundColor: active ? 'var(--accent-color)' : 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                        color: active ? '#1C1B1F' : 'var(--text-main)',
                      }}
                    >
                      {EQ_PRESETS[presetId].label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <ImageEditorModal
        open={Boolean(pendingQuickCover)}
        imageSrc={pendingQuickCover?.src ?? null}
        aspect="square"
        title="Editar portada de canción"
        onCancel={closePendingQuickCover}
        onApply={(editedUrl) => {
          if (track && pendingQuickCover?.trackId === track.id) {
            onQuickUpdateCover(track, editedUrl);
          }
          closePendingQuickCover();
        }}
      />
    </div>
  );
};
