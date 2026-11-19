import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
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
  SongBarAnimationId,
  ThemeConfig,
} from '../types/music';
import { formatDuration } from '../utils/audioMetadata';
import { getPlaybackControlPresentation } from '../utils/playbackButtons3D';
import { AudioVisualizer } from './AudioVisualizer';
import { ImageEditorModal } from './ImageEditorModal';
import { MusicCardOuterIcon } from './MusicCardOuterIcon';
import { NowPlayingVisualStage } from './NowPlayingVisualStage';
import { SongProgressBar } from './SongProgressBar';
import { SongTitleDisplay } from './SongTitleDisplay';

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
  songBarAnimation?: SongBarAnimationId;
  theme?: ThemeConfig;
  isFloatingOpen: boolean;
  isWidgetOpen: boolean;
  isAnalyzingLyrics: boolean;
  aiError: string | null;
  settings: AppSettings;
  analyserRef: React.RefObject<AnalyserNode | null>;
  accentColor: string;
  compactSplit?: boolean;
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
  songBarAnimation = 'shimmer_glow',
  theme,
  isFloatingOpen,
  isWidgetOpen,
  isAnalyzingLyrics,
  aiError,
  settings,
  analyserRef,
  accentColor,
  compactSplit = false,
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
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLyricBtnRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    if (!isPlaying || activeTab !== 'lyrics' || activeLineIndex < 0) return;
    const container = lyricsContainerRef.current;
    const item = activeLyricBtnRef.current;
    if (!container || !item) return;
    const targetTop =
      item.offsetTop - container.offsetTop - container.clientHeight / 2 + item.clientHeight / 2;
    container.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }, [activeLineIndex, activeTab, isPlaying]);

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

  const outerIconId = settings.musicCardOuterIcon ?? 'note_sparkle';
  const hasOuterIcon = outerIconId !== 'none';

  if (!track) {
    return (
      <div className={`relative ${hasOuterIcon ? 'pt-4' : ''}`}>
        <MusicCardOuterIcon
          iconId={outerIconId}
          color={settings.musicCardOuterIconColor}
        />
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
      </div>
    );
  }

  return (
    <div className={`relative ${hasOuterIcon ? 'pt-4' : ''}`}>
      <MusicCardOuterIcon
        iconId={outerIconId}
        color={settings.musicCardOuterIconColor}
      />
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
        <div className={compactSplit ? 'p-4 space-y-3.5' : 'p-5 sm:p-6 space-y-5'}>
          {/* Top Utility Row: Format Metadata + Quick Actions */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium font-mono-nums truncate min-w-0" style={{ color: 'var(--text-muted)' }}>
                {track.format}
                {track.lossless ? ' · Sin pérdida' : ''}
                {track.bitDepth && track.sampleRate
                  ? ` · ${track.bitDepth}-bit/${Math.round(track.sampleRate / 1000)}kHz`
                  : ''}
                {track.year ? ` · ${track.year}` : ''}
                {track.genre ? ` · ${track.genre}` : ''}
              </p>

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

            {/* Full-Width Customizable Song Title Shape & Colors */}
            <div className="space-y-1">
              <SongTitleDisplay
                title={track.title}
                shapeId={theme?.songTitleShapeId ?? 'cloud_plush'}
                colorId={theme?.songTitleColorId ?? 'auto'}
                customBg={theme?.songTitleCustomBg}
                customText={theme?.songTitleCustomText}
                compact={compactSplit}
              />
              <p className="text-sm truncate pt-0.5" style={{ color: 'var(--text-muted)' }}>
                {track.artist} · {track.album}
              </p>
              {track.notes && (
                <p className="text-xs italic truncate" style={{ color: 'var(--text-muted)' }}>
                  “{track.notes}”
                </p>
              )}
            </div>
        </div>

        {/* Customizable Visual Stage (Cover / Vinyl / CD / Cassette / Equalizer / etc.) */}
        <div className="flex flex-col items-center">
          <NowPlayingVisualStage
            visualId={settings.nowPlayingVisual ?? 'cover_classic'}
            colorMode={settings.nowPlayingColorMode ?? 'theme'}
            primaryColor={settings.nowPlayingPrimaryColor || accentColor}
            secondaryColor={settings.nowPlayingSecondaryColor || '#FFF5F8'}
            stageAccentColor={settings.nowPlayingAccentColor || '#E5C185'}
            stageDetailColor={settings.nowPlayingDetailColor || '#2E2A36'}
            hideCover={settings.nowPlayingHideCover ?? false}
            coverUrl={track.coverUrl}
            trackTitle={track.title}
            trackArtist={track.artist}
            isPlaying={isPlaying}
            moodSyncEnabled={moodSyncEnabled}
            activeAuraColor={activeAuraColor}
            compactSplit={compactSplit}
            onChangeCoverClick={() => quickCoverInputRef.current?.click()}
            changeCoverLabel={t.changeCover}
          />
          <input
            ref={quickCoverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleQuickCoverChange}
          />

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
          <SongProgressBar
            currentTime={currentTime}
            duration={duration}
            animation={songBarAnimation}
            isPlaying={isPlaying}
            onSeek={onSeek}
          />
          <div
            className="flex items-center justify-between text-xs font-mono-nums"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Main 3D Customizable Playback Controls */}
        {(() => {
          const shuffleCtrl = getPlaybackControlPresentation('aux', theme, shuffle);
          const navCtrl = getPlaybackControlPresentation('nav', theme);
          const playCtrl = getPlaybackControlPresentation('play', theme);
          const repeatCtrl = getPlaybackControlPresentation('aux', theme, repeat !== 'off');
          return (
            <div className="flex items-center justify-between gap-2 pt-1 pb-1">
              <button
                type="button"
                onClick={onToggleShuffle}
                aria-label="Aleatorio"
                className={`min-w-[42px] min-h-[42px] ${shuffleCtrl.className}`}
                style={shuffleCtrl.style}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Anterior"
                  className={`min-w-[48px] min-h-[48px] ${navCtrl.className}`}
                  style={navCtrl.style}
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  className={`w-[60px] h-[60px] ${playCtrl.className}`}
                  style={playCtrl.style}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Siguiente"
                  className={`min-w-[48px] min-h-[48px] ${navCtrl.className}`}
                  style={navCtrl.style}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={onCycleRepeat}
                aria-label="Repetir"
                className={`min-w-[42px] min-h-[42px] ${repeatCtrl.className}`}
                style={repeatCtrl.style}
              >
                {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>
          );
        })()}

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
                  : '¿Tienes la letra? Pégala para sincronizarla con la canción y traducirla'}
              </button>
              {manualLyricsOpen && (
                <div className="mt-2 space-y-2">
                  <textarea
                    rows={5}
                    value={manualLyricsInput}
                    onChange={(e) => setManualLyricsInput(e.target.value)}
                    placeholder="Pega aquí la letra completa en su idioma original (con o sin marcas [mm:ss]). La IA escuchará la canción para sincronizar cada verso y traducirla completa…"
                    className="w-full p-3 rounded-xl border text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isAnalyzingLyrics || !manualLyricsInput.trim()}
                      onClick={() => {
                        onDetectLyrics(track, manualLyricsInput.trim());
                        setManualLyricsOpen(false);
                      }}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
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
                      <span>
                        {isAnalyzingLyrics
                          ? 'Sincronizando y traduciendo…'
                          : 'Sincronizar con el audio y traducir'}
                      </span>
                    </button>
                    {manualLyricsInput.trim() && (
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {manualLyricsInput.split(/\r?\n/).filter((l) => l.trim()).length} líneas listas
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Lyrics Display */}
            <div
              ref={lyricsContainerRef}
              className="max-h-60 overflow-y-auto rounded-2xl border p-4 space-y-2.5 relative"
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
                      ref={isActive ? activeLyricBtnRef : undefined}
                      type="button"
                      onClick={() => onSeek(line.timeSec)}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 transition-all flex items-start gap-2.5"
                      style={{
                        backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                        opacity: isActive ? 1 : 0.74,
                      }}
                    >
                      <span
                        className="text-[10px] font-mono-nums pt-0.5 shrink-0 opacity-70"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {formatDuration(line.timeSec)}
                      </span>
                      <div className="min-w-0 flex-1">
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
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>
                  Pulsa “{t.detectLyricsAI}” para que la IA escuche la canción completa, detecte la letra y la traduzca, o pega la letra arriba para sincronizarla con el audio.
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
    </div>
  );
};
