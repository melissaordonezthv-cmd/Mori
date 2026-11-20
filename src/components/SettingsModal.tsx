import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Disc3,
  Download,
  Droplets,
  FolderHeart,
  Globe,
  Headphones,
  ImagePlus,
  KeyRound,
  Layers,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Share2,
  Sliders,
  Smartphone,
  Sparkles,
  Tablet,
  Timer,
  Trash2,
  Type,
  Volume2,
  X,
} from 'lucide-react';
import { LANGUAGE_OPTIONS, type Translations } from '../constants/i18n';
import {
  AUDIO_MODE_PROFILES,
  DEFAULT_COVER_SAKURA,
  EQ_PRESETS,
  MUSIC_CARD_OUTER_ICONS,
  NOW_PLAYING_COLOR_PRESETS,
  NOW_PLAYING_VISUAL_OPTIONS,
  SCREEN_OVERLAY_FILTER_OPTIONS,
  TEXT_SWATCHES,
  WALLPAPER_FILTER_OPTIONS,
  WALLPAPER_MOTION_OPTIONS,
} from '../constants/themes';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type {
  AppLanguage,
  AppSettings,
  AudioEngineMode,
  EqPresetId,
  LayoutOrientation,
  MusicCardOuterIconId,
  ProfileConfig,
  SettingsTextColorId,
  ThemeConfig,
} from '../types/music';
import { copyTextSafely, getShareableAppUrl } from '../utils/shareLink';
import {
  compressWallpaperImage,
  decodeStyleCode,
  encodeStyleCode,
} from '../utils/styleCode';
import { applyOpacityToColorValue } from '../utils/trackCardStyles';
import { MusicCardOuterIcon, MusicCardOuterSvg } from './MusicCardOuterIcon';
import { NowPlayingVisualStage } from './NowPlayingVisualStage';

function hexToMutedRgba(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 'rgba(128, 128, 128, 0.72)';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return 'rgba(128, 128, 128, 0.72)';
  return `rgba(${r}, ${g}, ${b}, 0.72)`;
}

interface SettingsModalProps {
  open: boolean;
  settings: AppSettings;
  theme: ThemeConfig;
  profile: ProfileConfig;
  sleepMinutesRemaining: number | null;
  sleepOnTrackEnd: boolean;
  isFloatingOpen: boolean;
  isWidgetOpen: boolean;
  floatingError: string | null;
  isSplitActive: boolean;
  isFullscreen?: boolean;
  fullscreenError?: string | null;
  t: Translations;
  onChangeSettings: (next: AppSettings) => void;
  onChangeTheme?: (next: ThemeConfig) => void;
  onApplyStyleCode: (
    nextTheme: ThemeConfig,
    nextProfile: ProfileConfig,
    nextSettings: AppSettings
  ) => void;
  onSetSleepTimer: (minutes: number | null, onTrackEnd?: boolean) => void;
  onToggleFloating: () => void;
  onToggleWidget: () => void;
  onToggleFullscreen?: () => void;
  onOpenMusicPermission?: () => void;
  onOpenTheme?: () => void;
  onResetAppearance?: () => void;
  onShareLink: () => void;
  linkCopied: boolean;
  hasUpdate?: boolean;
  isUpdating?: boolean;
  updateMessage?: string | null;
  onApplyUpdate?: (forceReload?: boolean) => void;
  onClose: () => void;
}

const BAND_LABELS = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz'];
const SPEED_OPTIONS = [0.75, 1, 1.15, 1.25, 1.5];

const ORIENTATION_OPTIONS: Array<{
  id: LayoutOrientation;
  label: string;
  description: string;
  icon: 'auto' | 'landscape' | 'portrait';
}> = [
  {
    id: 'auto',
    label: 'Automático (al girar)',
    description: 'Se divide en 2 paneles al girar la tablet en horizontal',
    icon: 'auto',
  },
  {
    id: 'landscape',
    label: 'Horizontal (en 2)',
    description: 'Biblioteca a la izquierda y reproductor a la derecha',
    icon: 'landscape',
  },
  {
    id: 'portrait',
    label: 'Vertical (1 columna)',
    description: 'Una columna con barra inferior expandible',
    icon: 'portrait',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  settings,
  theme,
  profile,
  sleepMinutesRemaining,
  sleepOnTrackEnd,
  isFloatingOpen,
  isWidgetOpen,
  floatingError,
  isSplitActive,
  isFullscreen = false,
  fullscreenError = null,
  t,
  onChangeSettings,
  onChangeTheme,
  onApplyStyleCode,
  onSetSleepTimer,
  onToggleFloating,
  onToggleWidget,
  onToggleFullscreen,
  onOpenMusicPermission,
  onOpenTheme,
  onResetAppearance,
  onShareLink,
  linkCopied,
  hasUpdate = false,
  isUpdating = false,
  updateMessage = null,
  onApplyUpdate,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showHomeScreenGuide, setShowHomeScreenGuide] = useState(false);
  const [showAllTextColors, setShowAllTextColors] = useState(false);
  const [showAllOuterIcons, setShowAllOuterIcons] = useState(false);
  const [showAllScreenFilters, setShowAllScreenFilters] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [resetDoneMsg, setResetDoneMsg] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [importCodeInput, setImportCodeInput] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [wallpaperError, setWallpaperError] = useState<string | null>(null);
  const wallpaperFileRef = useRef<HTMLInputElement | null>(null);

  const generatedStyleCode = useMemo(
    () => encodeStyleCode(theme, profile, settings),
    [theme, profile, settings]
  );

  if (!open) return null;

  const handleCopyStyleCode = async () => {
    const ok = await copyTextSafely(generatedStyleCode);
    if (ok) {
      setCodeCopied(true);
      window.setTimeout(() => setCodeCopied(false), 2400);
    }
  };

  const handleApplyIncomingCode = () => {
    const res = decodeStyleCode(importCodeInput, theme, profile, settings);
    if (res.ok === false) {
      setCodeFeedback({ ok: false, msg: res.error });
      return;
    }
    onApplyStyleCode(res.nextTheme, res.nextProfile, res.nextSettings);
    setImportCodeInput('');
    setCodeFeedback({
      ok: true,
      msg: '¡Estilo aplicado a tu pantalla principal y perfil! Tus fotos de perfil, fondos y banners se conservaron.',
    });
  };

  const handleWallpaperPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setWallpaperError(null);
    try {
      const compressed = await compressWallpaperImage(file);
      onChangeSettings({
        ...settings,
        wallpaperUrl: compressed,
        wallpaperOpacity: settings.wallpaperOpacity ?? 85,
      });
    } catch (err) {
      setWallpaperError(
        err instanceof Error ? err.message : 'No se pudo cargar la imagen de fondo.'
      );
    }
  };

  const appUrl = getShareableAppUrl();

  const activeSettingsTextId: SettingsTextColorId = settings.settingsTextColorId ?? 'auto';
  const matchedTextSwatch = TEXT_SWATCHES.find((sw) => sw.id === activeSettingsTextId);
  const customSettingsHex = settings.settingsTextCustomHex || '#1C1B1F';
  const settingsTextOverrideStyle: React.CSSProperties =
    activeSettingsTextId === 'auto'
      ? {}
      : activeSettingsTextId === 'custom'
        ? ({
            '--text-main': customSettingsHex,
            '--text-muted': hexToMutedRgba(customSettingsHex),
            color: customSettingsHex,
          } as React.CSSProperties)
        : matchedTextSwatch
          ? ({
              '--text-main': matchedTextSwatch.hex,
              '--text-muted': matchedTextSwatch.mutedHex,
              color: matchedTextSwatch.hex,
            } as React.CSSProperties)
          : {};

  const applyPreset = (presetId: EqPresetId) => {
    onChangeSettings({
      ...settings,
      eqPreset: presetId,
      eqBands: [...EQ_PRESETS[presetId].bands] as [number, number, number, number, number],
    });
  };

  const updateBand = (index: number, value: number) => {
    const next = [...settings.eqBands] as [number, number, number, number, number];
    next[index] = value;
    onChangeSettings({
      ...settings,
      eqBands: next,
    });
  };

  const allTextOptions: Array<{ id: SettingsTextColorId; label: string; hex: string }> = [
    { id: 'auto', label: 'Del tema', hex: 'auto' },
    ...TEXT_SWATCHES.map((sw) => ({ id: sw.id as SettingsTextColorId, label: sw.label, hex: sw.hex })),
    { id: 'custom', label: 'Tu color', hex: 'custom' },
  ];
  const visibleTextOptions = (() => {
    if (showAllTextColors || allTextOptions.length <= 6) return allTextOptions;
    const head = allTextOptions.slice(0, 6);
    if (!head.some((opt) => opt.id === activeSettingsTextId)) {
      const selectedOpt = allTextOptions.find((opt) => opt.id === activeSettingsTextId);
      if (selectedOpt) return [selectedOpt, ...allTextOptions.slice(0, 5)];
    }
    return head;
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Ajustes"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
          ...settingsTextOverrideStyle,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-4 pb-4 border-b"
          style={{ borderColor: 'var(--divider-color)' }}
        >
          <div>
            <h2 className="text-xl font-bold tracking-tight">{t.menuSettings}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Idioma de traducción IA, ecualizador sin pérdida, enlace y reproducción flotante
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center border transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* App Update Button & Lime-Green Change Indicator */}
          {onApplyUpdate && (
            <section
              className="p-4 rounded-2xl border space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: hasUpdate ? '#84CC16' : 'var(--divider-color)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="relative mt-0.5 shrink-0">
                    <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
                    {hasUpdate && (
                      <span
                        aria-label="Hay cambios nuevos disponibles"
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{
                          backgroundColor: '#A3E635',
                          boxShadow: '0 0 8px rgba(163, 230, 53, 0.95)',
                        }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">Actualizar</h3>
                      {hasUpdate && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: 'rgba(163, 230, 53, 0.22)',
                            color: 'var(--text-main)',
                            border: '1px solid rgba(132, 204, 22, 0.6)',
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#A3E635' }}
                          />
                          Nuevo cambio disponible
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {hasUpdate
                        ? 'Hay cambios nuevos listos. Presiona Actualizar para recibirlos al instante sin desinstalar la app ni perder tus canciones o estilos.'
                        : 'Recibe las novedades y cambios publicados en la app instalada con un toque, sin desinstalar ni volver a instalar.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onApplyUpdate(false)}
                  className="btn-raw relative min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition active:scale-95 disabled:opacity-60"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: '#1C1B1F',
                  }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span>{isUpdating ? 'Actualizando…' : 'Actualizar'}</span>
                  {hasUpdate && !isUpdating && (
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: '#A3E635',
                        boxShadow: '0 0 6px rgba(132, 204, 22, 0.95)',
                      }}
                    />
                  )}
                </button>
              </div>

              {updateMessage && (
                <div
                  className="px-3 py-2.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <span className="leading-snug">{updateMessage}</span>
                  <button
                    type="button"
                    onClick={() => onApplyUpdate(true)}
                    className="btn-raw px-2.5 py-1 rounded-lg border text-[11px] font-semibold shrink-0"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    Recargar caché ahora
                  </button>
                </div>
              )}
            </section>
          )}

          {/* App Language (also drives instant AI lyrics translation) */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Idioma de la app y traducción IA</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = settings.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() =>
                      onChangeSettings({ ...settings, language: lang.id as AppLanguage })
                    }
                    className="min-h-[44px] px-3 py-2 rounded-2xl border text-xs font-semibold transition"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Style Share Code (Always active: Give & Receive without banners/profile photos) */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-start gap-2.5">
              <KeyRound className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold">Código de estilo (Dar y Recibir)</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Comparte o aplica todo tu diseño de pantalla principal y perfil (colores, formas, botones 3D, tarjetas, ícono exterior, marco, dijes y filtros). Nunca copia tus fotos de perfil, fondos ni banners.
                </p>
              </div>
            </div>

            {/* Give / Copy my code */}
            <div
              className="p-3 rounded-2xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <p className="text-xs font-semibold">Dar mi código de estilo</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedStyleCode}
                  aria-label="Código de estilo para compartir"
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 min-h-[40px] px-3 rounded-xl border text-[11px] font-mono-nums focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                    color: 'var(--text-main)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleCopyStyleCode}
                  className="btn-raw min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition active:scale-95"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: '#1C1B1F',
                  }}
                >
                  {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{codeCopied ? '¡Código copiado!' : 'Copiar mi código'}</span>
                </button>
              </div>
            </div>

            {/* Receive / Paste friend's code */}
            <div
              className="p-3 rounded-2xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <p className="text-xs font-semibold">Recibir código de otra persona</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={importCodeInput}
                  onChange={(e) => {
                    setImportCodeInput(e.target.value);
                    if (codeFeedback) setCodeFeedback(null);
                  }}
                  placeholder="Pega aquí el código MORI1-…"
                  aria-label="Pegar código de estilo"
                  className="flex-1 min-h-[40px] px-3 rounded-xl border text-xs font-mono-nums focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                    color: 'var(--text-main)',
                  }}
                />
                <button
                  type="button"
                  disabled={!importCodeInput.trim()}
                  onClick={handleApplyIncomingCode}
                  className="btn-raw min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold shrink-0 transition disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    borderColor: 'var(--divider-color)',
                    color: 'var(--text-main)',
                  }}
                >
                  Aplicar estilo
                </button>
              </div>

              {codeFeedback && (
                <p
                  className="text-xs px-3 py-2 rounded-xl border"
                  style={{
                    backgroundColor: codeFeedback.ok ? 'var(--accent-soft)' : 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  {codeFeedback.msg}
                </p>
              )}
            </div>
          </section>

          {/* Settings-only Letter Color Palette & Reset Colors Button */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Type className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">Color de letras en Ajustes</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Paleta exclusiva solo para este panel de Ajustes sin cambiar las letras del resto de la app
                  </p>
                </div>
              </div>
              {onResetAppearance && (
                <button
                  type="button"
                  onClick={() => {
                    setResetDoneMsg(false);
                    setConfirmResetOpen(true);
                  }}
                  className="btn-raw min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition active:scale-95"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                    color: 'var(--text-main)',
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer colores</span>
                </button>
              )}
            </div>

            {resetDoneMsg && (
              <div
                className="px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <span>Listo: los colores y personalizaciones volvieron a su estado original.</span>
                <button
                  type="button"
                  onClick={() => setResetDoneMsg(false)}
                  aria-label="Ocultar aviso"
                  className="btn-raw p-1 rounded-lg opacity-75 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {visibleTextOptions.map((opt) => {
                const selected = activeSettingsTextId === opt.id;
                const isLightHex = (hexStr: string) => {
                  const clean = hexStr.replace('#', '');
                  if (clean.length !== 6) return false;
                  const r = parseInt(clean.slice(0, 2), 16);
                  const g = parseInt(clean.slice(2, 4), 16);
                  const b = parseInt(clean.slice(4, 6), 16);
                  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
                };
                const isLightSwatch =
                  opt.id !== 'auto' &&
                  (opt.id === 'custom'
                    ? Boolean(settings.settingsTextCustomHex) && isLightHex(customSettingsHex)
                    : isLightHex(opt.hex));
                const dotBg =
                  opt.id === 'auto'
                    ? 'var(--bg-elevated)'
                    : opt.id === 'custom'
                      ? customSettingsHex
                      : opt.hex;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChangeSettings({
                        ...settings,
                        settingsTextColorId: opt.id,
                        settingsTextCustomHex:
                          opt.id === 'custom' ? settings.settingsTextCustomHex || '#1C1B1F' : settings.settingsTextCustomHex,
                      })
                    }
                    className="btn-raw min-h-[40px] px-2.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition"
                    style={{
                      backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background:
                          opt.id === 'custom' && !settings.settingsTextCustomHex
                            ? 'linear-gradient(135deg,#F4A6C1,#7CC3F7,#9BD27E)'
                            : dotBg,
                        borderColor: 'rgba(128,128,128,0.35)',
                        color:
                          opt.id === 'auto'
                            ? 'var(--text-main)'
                            : isLightSwatch
                              ? '#1C1B1F'
                              : '#FFFFFF',
                      }}
                    >
                      A
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {allTextOptions.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllTextColors((v) => !v)}
                className="btn-raw w-full min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              >
                <span>
                  {showAllTextColors
                    ? 'Mostrar solo una parte'
                    : `Ver todos los ${allTextOptions.length} colores de letra`}
                </span>
                {showAllTextColors ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {activeSettingsTextId === 'custom' && (
              <div
                className="pt-2.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
                style={{ borderColor: 'var(--divider-color)' }}
              >
                <label className="flex items-center gap-2 font-semibold">
                  <span>Elegir color exacto para las letras de Ajustes:</span>
                  <input
                    type="color"
                    value={customSettingsHex}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        settingsTextColorId: 'custom',
                        settingsTextCustomHex: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded-lg border cursor-pointer"
                  />
                </label>
                <span className="font-mono-nums text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {customSettingsHex.toUpperCase()}
                </span>
              </div>
            )}
          </section>

          {/* Tablet / Horizontal Dual-Pane Layout */}
          <section
            className="p-4 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Tablet className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">
                    Pantalla dividida / Horizontal (Tablet)
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Adapta la app en dos mitades naturales al girar tu tablet o forzar vista horizontal
                  </p>
                </div>
              </div>
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-xl border shrink-0"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                {isSplitActive ? '2 paneles' : '1 columna'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ORIENTATION_OPTIONS.map((opt) => {
                const current = settings.layoutOrientation ?? 'auto';
                const active = current === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChangeSettings({ ...settings, layoutOrientation: opt.id });
                      const orientationApi = (
                        window.screen?.orientation as unknown as {
                          lock?: (mode: string) => Promise<void>;
                          unlock?: () => void;
                        }
                      );
                      if (opt.id === 'landscape') {
                        orientationApi?.lock?.('landscape').catch(() => {});
                      } else if (opt.id === 'portrait') {
                        orientationApi?.lock?.('portrait').catch(() => {});
                      } else {
                        orientationApi?.unlock?.();
                      }
                    }}
                    className="p-3 rounded-2xl border text-left transition flex flex-col gap-1"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {opt.icon === 'auto' && <RotateCw className="w-3.5 h-3.5 shrink-0" />}
                      {opt.icon === 'landscape' && <Tablet className="w-3.5 h-3.5 shrink-0 rotate-90" />}
                      {opt.icon === 'portrait' && <Smartphone className="w-3.5 h-3.5 shrink-0" />}
                      <span>{opt.label}</span>
                    </div>
                    <p
                      className="text-[11px] leading-snug"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Fullscreen & Automatic Music Folder Sync Row */}
            <div
              className="pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              style={{ borderColor: 'var(--divider-color)' }}
            >
              {onToggleFullscreen && (
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition active:scale-[0.99]"
                  style={{
                    backgroundColor: isFullscreen ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                    borderColor: isFullscreen ? 'var(--text-main)' : 'var(--divider-color)',
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <Maximize2 className="w-4 h-4 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">Pantalla completa</p>
                      <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {isFullscreen ? 'Activa · Toca para salir' : 'Amplía sin barras del navegador'}
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {onOpenMusicPermission && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMusicPermission();
                  }}
                  className="min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition active:scale-[0.99]"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <FolderHeart className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">Acceso automático a música</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                      Conectar o sincronizar carpeta
                    </p>
                  </div>
                </button>
              )}
            </div>

            {fullscreenError && (
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                {fullscreenError}
              </p>
            )}

            {/* Optional Full-Screen Overlay Filters */}
            <div
              className="pt-3 border-t space-y-3"
              style={{ borderColor: 'var(--divider-color)' }}
            >
              <div className="flex items-start gap-2.5">
                <Droplets className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold">
                    Filtros sobre toda la pantalla (Opcional)
                  </h4>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Efecto visual translúcido en toda la app y en pantalla completa (no bloquea tus toques)
                  </p>
                </div>
              </div>

              {(() => {
                const activeScreenFilter = settings.screenOverlayFilter ?? 'none';
                const visibleScreenFilters = (() => {
                  if (showAllScreenFilters || SCREEN_OVERLAY_FILTER_OPTIONS.length <= 9) {
                    return SCREEN_OVERLAY_FILTER_OPTIONS;
                  }
                  const head = SCREEN_OVERLAY_FILTER_OPTIONS.slice(0, 9);
                  if (!head.some((opt) => opt.id === activeScreenFilter)) {
                    const found = SCREEN_OVERLAY_FILTER_OPTIONS.find(
                      (opt) => opt.id === activeScreenFilter
                    );
                    if (found) {
                      return [head[0], found, ...head.slice(1, 8)];
                    }
                  }
                  return head;
                })();

                const handleSelectScreenFilter = (filterId: typeof activeScreenFilter) => {
                  // On iOS 13+ browsers, request gyroscope permission within user tap gesture for fluid water tilt
                  if (
                    filterId === 'crystal_drops_tilt' ||
                    filterId === 'fluid_bottom_water' ||
                    filterId === 'rainy_window' ||
                    filterId === 'water_ripples'
                  ) {
                    const devOrient = window.DeviceOrientationEvent as unknown as {
                      requestPermission?: () => Promise<string>;
                    };
                    if (typeof devOrient?.requestPermission === 'function') {
                      devOrient.requestPermission().catch(() => {});
                    }
                    const devMotion = window.DeviceMotionEvent as unknown as {
                      requestPermission?: () => Promise<string>;
                    };
                    if (typeof devMotion?.requestPermission === 'function') {
                      devMotion.requestPermission().catch(() => {});
                    }
                  }
                  onChangeSettings({
                    ...settings,
                    screenOverlayFilter: filterId,
                  });
                };

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {visibleScreenFilters.map((opt) => {
                        const active = activeScreenFilter === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectScreenFilter(opt.id)}
                            className="btn-raw p-2.5 rounded-2xl border text-left transition flex flex-col gap-0.5"
                            style={{
                              backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                              borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                            }}
                          >
                            <span className="text-xs font-bold truncate">{opt.label}</span>
                            <span
                              className="text-[10px] leading-snug line-clamp-2"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {opt.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {SCREEN_OVERLAY_FILTER_OPTIONS.length > 9 && (
                      <button
                        type="button"
                        onClick={() => setShowAllScreenFilters((v) => !v)}
                        className="btn-raw w-full min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--divider-color)',
                          color: 'var(--text-main)',
                        }}
                      >
                        <span>
                          {showAllScreenFilters
                            ? 'Mostrar solo una parte'
                            : `Ver todos los ${SCREEN_OVERLAY_FILTER_OPTIONS.length} filtros de pantalla`}
                        </span>
                        {showAllScreenFilters ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </>
                );
              })()}

              {(settings.screenOverlayFilter ?? 'none') !== 'none' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>Intensidad del filtro de pantalla</span>
                    <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                      {settings.screenOverlayIntensity ?? 65}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    aria-label="Intensidad del filtro de pantalla"
                    value={settings.screenOverlayIntensity ?? 65}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        screenOverlayIntensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-current cursor-pointer"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Optional Background Wallpaper Behind All Accessories + Filters & Motion */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <ImagePlus className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">
                    Fondo de pantalla detrás de los accesorios (Opcional)
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Coloca tu imagen detrás de todas las tarjetas, adornos y reproductor, con filtro borroso o movimiento natural opcional
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => wallpaperFileRef.current?.click()}
                  className="btn-raw min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    borderColor: 'var(--divider-color)',
                    color: '#1C1B1F',
                  }}
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>{settings.wallpaperUrl ? 'Cambiar foto' : 'Elegir fondo'}</span>
                </button>
                {settings.wallpaperUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeSettings({
                        ...settings,
                        wallpaperUrl: '',
                      })
                    }
                    aria-label="Quitar fondo de pantalla"
                    className="btn-raw min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar</span>
                  </button>
                )}
              </div>
              <input
                ref={wallpaperFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleWallpaperPick}
              />
            </div>

            {wallpaperError && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {wallpaperError}
              </p>
            )}

            {settings.wallpaperUrl && (
              <div
                className="p-3 rounded-2xl border space-y-2.5"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <div className="relative h-28 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--divider-color)' }}>
                  <img
                    src={settings.wallpaperUrl}
                    alt="Vista previa del fondo"
                    className="w-full h-full object-cover"
                    style={{
                      opacity: Math.max(0.2, Math.min(1, (settings.wallpaperOpacity ?? 85) / 100)),
                      filter:
                        settings.wallpaperFilter === 'blur_soft'
                          ? 'blur(7px)'
                          : undefined,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="px-3 py-1.5 rounded-xl border text-[11px] font-semibold backdrop-blur-md"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      Tus accesorios y tarjetas van delante
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>Visibilidad del fondo</span>
                    <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                      {settings.wallpaperOpacity ?? 85}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={25}
                    max={100}
                    step={5}
                    aria-label="Visibilidad del fondo de pantalla"
                    value={settings.wallpaperOpacity ?? 85}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        wallpaperOpacity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-current cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Optional Blur Wallpaper Filter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold">Filtro del fondo (opcional)</p>
              <div className="grid grid-cols-2 gap-2">
                {WALLPAPER_FILTER_OPTIONS.map((fOpt) => {
                  const active = (settings.wallpaperFilter ?? 'none') === fOpt.id;
                  return (
                    <button
                      key={fOpt.id}
                      type="button"
                      onClick={() =>
                        onChangeSettings({
                          ...settings,
                          wallpaperFilter: fOpt.id,
                        })
                      }
                      className="btn-raw p-2 rounded-xl border text-left transition flex flex-col gap-0.5"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                        borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                      }}
                    >
                      <span className="text-[11px] font-bold truncate">{fOpt.label}</span>
                      <span
                        className="text-[10px] leading-snug line-clamp-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {fOpt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Moving Background Nature / Chains / Flowers (Optional) */}
            <div
              className="pt-3 border-t space-y-2"
              style={{ borderColor: 'var(--divider-color)' }}
            >
              <p className="text-xs font-semibold">
                Movimiento natural y adornos de fondo (opcional)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WALLPAPER_MOTION_OPTIONS.map((mOpt) => {
                  const active = (settings.wallpaperMotion ?? 'none') === mOpt.id;
                  return (
                    <button
                      key={mOpt.id}
                      type="button"
                      onClick={() =>
                        onChangeSettings({
                          ...settings,
                          wallpaperMotion: mOpt.id,
                        })
                      }
                      className="btn-raw p-2 rounded-xl border text-left transition flex flex-col gap-0.5"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                        borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                      }}
                    >
                      <span className="text-[11px] font-bold truncate">{mOpt.label}</span>
                      <span
                        className="text-[10px] leading-snug line-clamp-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {mOpt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Now Playing Music Card 3D Visual Style & 4-Part Editable Colors */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <Disc3 className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">
                    Portada y escenario 3D al reproducir ({NOW_PLAYING_VISUAL_OPTIONS.length} diseños)
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Vinilos 3D, fundas abiertas, relicarios, esferas de cristal, estuches y más; colorea cada parte a tu gusto
                  </p>
                </div>
              </div>
              {onOpenTheme && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTheme();
                  }}
                  className="btn-raw min-h-[34px] px-3 py-1 rounded-xl border text-[11px] font-semibold shrink-0"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  Botones 3D en Tema →
                </button>
              )}
            </div>

            {/* Live 3D Stage Preview */}
            <div
              className="p-5 rounded-2xl border flex flex-col items-center justify-center"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <NowPlayingVisualStage
                visualId={settings.nowPlayingVisual ?? 'cover_classic'}
                colorMode={settings.nowPlayingColorMode ?? 'theme'}
                primaryColor={settings.nowPlayingPrimaryColor || '#F4B8CC'}
                secondaryColor={settings.nowPlayingSecondaryColor || '#FFF5F8'}
                stageAccentColor={settings.nowPlayingAccentColor || '#E5C185'}
                stageDetailColor={settings.nowPlayingDetailColor || '#2E2A36'}
                hideCover={settings.nowPlayingHideCover ?? false}
                coverUrl={DEFAULT_COVER_SAKURA}
                trackTitle="Melodía en Hi-Res"
                trackArtist="MoriNote"
                isPlaying
                moodSyncEnabled={false}
                activeAuraColor="var(--accent-color)"
                compactSplit
                onChangeCoverClick={() => {}}
                changeCoverLabel="Vista previa"
              />
            </div>

            {/* 23 Realistic 3D Visual Style Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NOW_PLAYING_VISUAL_OPTIONS.map((vis) => {
                const active = (settings.nowPlayingVisual ?? 'cover_classic') === vis.id;
                return (
                  <button
                    key={vis.id}
                    type="button"
                    onClick={() => onChangeSettings({ ...settings, nowPlayingVisual: vis.id })}
                    className="btn-raw p-2.5 rounded-2xl border text-left transition flex flex-col gap-0.5"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <span className="text-xs font-bold truncate">{vis.label}</span>
                    <span
                      className="text-[10px] leading-snug line-clamp-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {vis.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 4-Part Editable Color Mode & Color Pickers */}
            <div
              className="pt-3 border-t space-y-3"
              style={{ borderColor: 'var(--divider-color)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold">Colorea cualquier parte del diseño 3D:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeSettings({ ...settings, nowPlayingColorMode: 'theme' })
                    }
                    className="min-h-[34px] px-3 py-1 rounded-xl border text-xs font-semibold transition"
                    style={{
                      backgroundColor:
                        (settings.nowPlayingColorMode ?? 'theme') === 'theme'
                          ? 'var(--accent-color)'
                          : 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color:
                        (settings.nowPlayingColorMode ?? 'theme') === 'theme'
                          ? '#1C1B1F'
                          : 'var(--text-main)',
                    }}
                  >
                    Color de tu tema
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeSettings({
                        ...settings,
                        nowPlayingColorMode: 'custom',
                        nowPlayingPrimaryColor: settings.nowPlayingPrimaryColor || '#F4B8CC',
                        nowPlayingSecondaryColor: settings.nowPlayingSecondaryColor || '#FFF5F8',
                        nowPlayingAccentColor: settings.nowPlayingAccentColor || '#E5C185',
                        nowPlayingDetailColor: settings.nowPlayingDetailColor || '#2E2A36',
                      })
                    }
                    className="min-h-[34px] px-3 py-1 rounded-xl border text-xs font-semibold transition"
                    style={{
                      backgroundColor:
                        settings.nowPlayingColorMode === 'custom'
                          ? 'var(--accent-color)'
                          : 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color:
                        settings.nowPlayingColorMode === 'custom' ? '#1C1B1F' : 'var(--text-main)',
                    }}
                  >
                    Editar cada parte
                  </button>
                </div>
              </div>

              {settings.nowPlayingColorMode === 'custom' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {NOW_PLAYING_COLOR_PRESETS.map((preset) => {
                      const active =
                        settings.nowPlayingPrimaryColor === preset.primary &&
                        settings.nowPlayingSecondaryColor === preset.secondary &&
                        settings.nowPlayingAccentColor === preset.accent &&
                        settings.nowPlayingDetailColor === preset.detail;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            onChangeSettings({
                              ...settings,
                              nowPlayingColorMode: 'custom',
                              nowPlayingPrimaryColor: preset.primary,
                              nowPlayingSecondaryColor: preset.secondary,
                              nowPlayingAccentColor: preset.accent,
                              nowPlayingDetailColor: preset.detail,
                            })
                          }
                          className="btn-raw min-h-[34px] px-2.5 py-1 rounded-xl border text-[11px] font-medium flex items-center gap-1.5"
                          style={{
                            backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span className="flex -space-x-1 shrink-0">
                            {[preset.primary, preset.secondary, preset.accent, preset.detail].map(
                              (col, i) => (
                                <span
                                  key={i}
                                  className="w-3 h-3 rounded-full border"
                                  style={{
                                    backgroundColor: col,
                                    borderColor: 'rgba(128,128,128,0.4)',
                                  }}
                                />
                              )
                            )}
                          </span>
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 4 Part Independent Color Pickers */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                    <label
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border font-medium"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <span>Disco / Carcasa</span>
                      <input
                        type="color"
                        value={settings.nowPlayingPrimaryColor || '#F4B8CC'}
                        onChange={(e) =>
                          onChangeSettings({
                            ...settings,
                            nowPlayingColorMode: 'custom',
                            nowPlayingPrimaryColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded-lg border cursor-pointer shrink-0"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border font-medium"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <span>Sello / Etiqueta / Interior</span>
                      <input
                        type="color"
                        value={settings.nowPlayingSecondaryColor || '#FFF5F8'}
                        onChange={(e) =>
                          onChangeSettings({
                            ...settings,
                            nowPlayingColorMode: 'custom',
                            nowPlayingSecondaryColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded-lg border cursor-pointer shrink-0"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border font-medium"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <span>Metales / Brazo / Aros</span>
                      <input
                        type="color"
                        value={settings.nowPlayingAccentColor || '#E5C185'}
                        onChange={(e) =>
                          onChangeSettings({
                            ...settings,
                            nowPlayingColorMode: 'custom',
                            nowPlayingAccentColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded-lg border cursor-pointer shrink-0"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border font-medium"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <span>Relieve / Base / Sombra 3D</span>
                      <input
                        type="color"
                        value={settings.nowPlayingDetailColor || '#2E2A36'}
                        onChange={(e) =>
                          onChangeSettings({
                            ...settings,
                            nowPlayingColorMode: 'custom',
                            nowPlayingDetailColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded-lg border cursor-pointer shrink-0"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Hide photo in disc center toggle */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-xs font-semibold">Centro de puro color (sin foto de portada)</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Ideal para ver únicamente el vinilo o el diseño 3D adaptado a tus colores
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(settings.nowPlayingHideCover)}
                  onClick={() =>
                    onChangeSettings({
                      ...settings,
                      nowPlayingHideCover: !settings.nowPlayingHideCover,
                    })
                  }
                  className="w-13 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
                  style={{
                    backgroundColor: settings.nowPlayingHideCover
                      ? 'var(--accent-color)'
                      : 'rgba(128,128,128,0.28)',
                  }}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.nowPlayingHideCover ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Cute Non-Sticker Outer Vector Icon for Music Card (Outside the Card Only) */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold">
                  Ícono exterior de la tarjeta de música (sin stickers)
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Se muestra únicamente por fuera del borde de la carta musical, nunca dentro de la portada. Íconos vectoriales limpios.
                </p>
              </div>
            </div>

            {/* Live Mini Card Preview Showing Icon OUTSIDE the Card */}
            {(() => {
              const activeOuterIcon: MusicCardOuterIconId =
                settings.musicCardOuterIcon ?? 'note_sparkle';
              const activeOuterColor = settings.musicCardOuterIconColor || 'auto';
              const iconQuickColors = [
                { id: 'auto', label: 'Del tema', hex: 'var(--text-main)' },
                { id: '#1C1B1F', label: 'Negro', hex: '#1C1B1F' },
                { id: '#FFFFFF', label: 'Blanco', hex: '#FFFFFF' },
                { id: '#C94D7C', label: 'Rosa', hex: '#C94D7C' },
                { id: '#B6852E', label: 'Dorado', hex: '#B6852E' },
                { id: '#4B6B3B', label: 'Pistacho', hex: '#4B6B3B' },
              ];
              const visibleIcons = (() => {
                if (showAllOuterIcons || MUSIC_CARD_OUTER_ICONS.length <= 9) {
                  return MUSIC_CARD_OUTER_ICONS;
                }
                const head = MUSIC_CARD_OUTER_ICONS.slice(0, 9);
                if (!head.some((ic) => ic.id === activeOuterIcon)) {
                  const found = MUSIC_CARD_OUTER_ICONS.find((ic) => ic.id === activeOuterIcon);
                  if (found) return [found, ...MUSIC_CARD_OUTER_ICONS.slice(0, 8)];
                }
                return head;
              })();

              return (
                <>
                  <div
                    className="p-4 rounded-2xl border flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    <div className={`relative w-full max-w-xs ${activeOuterIcon !== 'none' ? 'pt-4' : ''}`}>
                      <MusicCardOuterIcon iconId={activeOuterIcon} color={activeOuterColor} />
                      <div
                        className="rounded-2xl border p-3.5 flex items-center gap-3"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--divider-color)',
                        }}
                      >
                        <img
                          src={DEFAULT_COVER_SAKURA}
                          alt="Portada sin adorno interior"
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border"
                          style={{ borderColor: 'var(--divider-color)' }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">Sakura Rain</p>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                            {activeOuterIcon === 'none'
                              ? 'Tarjeta sin ícono exterior'
                              : 'Ícono fuera de la carta · portada limpia'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pure Vector Icons Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {visibleIcons.map((iconOpt) => {
                      const active = activeOuterIcon === iconOpt.id;
                      return (
                        <button
                          key={iconOpt.id}
                          type="button"
                          onClick={() =>
                            onChangeSettings({ ...settings, musicCardOuterIcon: iconOpt.id })
                          }
                          className="btn-raw min-h-[60px] p-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition"
                          style={{
                            backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                            color: 'var(--text-main)',
                          }}
                        >
                          {iconOpt.id === 'none' ? (
                            <X className="w-4 h-4 opacity-70" />
                          ) : (
                            <MusicCardOuterSvg iconId={iconOpt.id} className="w-5 h-5" />
                          )}
                          <span className="text-[10px] font-semibold leading-tight line-clamp-1">
                            {iconOpt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {MUSIC_CARD_OUTER_ICONS.length > 9 && (
                    <button
                      type="button"
                      onClick={() => setShowAllOuterIcons((v) => !v)}
                      className="btn-raw w-full min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <span>
                        {showAllOuterIcons
                          ? 'Mostrar solo una parte'
                          : `Ver todos los ${MUSIC_CARD_OUTER_ICONS.length} íconos`}
                      </span>
                      {showAllOuterIcons ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Outer Icon Color Options */}
                  {activeOuterIcon !== 'none' && (
                    <div
                      className="pt-2.5 border-t flex flex-wrap items-center justify-between gap-2"
                      style={{ borderColor: 'var(--divider-color)' }}
                    >
                      <span className="text-xs font-semibold">Color del ícono exterior:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {iconQuickColors.map((col) => {
                          const selected = activeOuterColor === col.id;
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() =>
                                onChangeSettings({
                                  ...settings,
                                  musicCardOuterIconColor: col.id,
                                })
                              }
                              className="btn-raw min-h-[32px] px-2.5 py-1 rounded-xl border text-[11px] font-medium flex items-center gap-1.5"
                              style={{
                                backgroundColor: selected
                                  ? 'var(--accent-soft)'
                                  : 'var(--bg-elevated)',
                                borderColor: selected
                                  ? 'var(--text-main)'
                                  : 'var(--divider-color)',
                              }}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border shrink-0"
                                style={{
                                  backgroundColor: col.hex,
                                  borderColor: 'rgba(128,128,128,0.4)',
                                }}
                              />
                              <span>{col.label}</span>
                            </button>
                          );
                        })}
                        <label
                          className="min-h-[32px] px-2 py-1 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--divider-color)',
                          }}
                        >
                          <span>Otro</span>
                          <input
                            type="color"
                            value={activeOuterColor === 'auto' ? '#C94D7C' : activeOuterColor}
                            onChange={(e) =>
                              onChangeSettings({
                                ...settings,
                                musicCardOuterIconColor: e.target.value,
                              })
                            }
                            className="w-5 h-5 rounded border cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </section>

          {/* Song Card Width & Vertical Length Controls */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            {(() => {
              const currentCardWidth = Math.min(
                100,
                Math.max(58, settings.trackCardWidthPercent ?? 78)
              );
              const currentCardHeight = Math.min(
                176,
                Math.max(56, settings.trackCardHeightPx ?? 118)
              );
              const currentCardOpacity = Math.min(
                100,
                Math.max(15, theme.trackCardOpacity ?? 100)
              );
              const currentCardBlur = Math.min(
                20,
                Math.max(0, theme.trackCardBlur ?? 0)
              );
              const widthPresets = [
                { value: 64, label: 'Muy delgada' },
                { value: 78, label: 'Delgada' },
                { value: 86, label: 'Compacta' },
                { value: 93, label: 'Media' },
                { value: 100, label: 'Ancha' },
              ];
              const heightPresets = [
                { value: 64, label: 'Fina' },
                { value: 86, label: 'Corta' },
                { value: 102, label: 'Normal' },
                { value: 118, label: 'Larga' },
                { value: 148, label: 'Muy larga' },
              ];
              const surfacePresets = [
                { label: 'Sólida', opacity: 100, blur: 0 },
                { label: 'Translúcida', opacity: 72, blur: 5 },
                { label: 'Borroso suave', opacity: 52, blur: 11 },
                { label: 'Cristal etéreo', opacity: 32, blur: 16 },
              ];
              return (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Layers className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold">
                          Tarjetas de música (Tamaño, Opacidad y Borroso)
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          Ajusta el tamaño, transparencia y efecto cristal borroso suave de cada tarjeta de canción
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-mono-nums font-semibold px-2.5 py-1 rounded-xl border shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      {currentCardWidth}% × {currentCardHeight}px
                    </span>
                  </div>

                  {/* Proportional Live Width + Length + Opacity + Blur Preview */}
                  <div
                    className="p-3.5 rounded-2xl border flex justify-center"
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      backgroundImage:
                        currentCardOpacity < 100 || currentCardBlur > 0
                          ? 'radial-gradient(circle at 22% 35%, var(--accent-color) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--accent-soft) 0%, transparent 50%)'
                          : undefined,
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    <div
                      className="rounded-2xl border p-3 flex flex-col justify-between gap-1.5 transition-all duration-200"
                      style={{
                        width: `${currentCardWidth}%`,
                        minHeight: `${currentCardHeight}px`,
                        backgroundColor: applyOpacityToColorValue(
                          'var(--bg-elevated)',
                          currentCardOpacity
                        ),
                        borderColor: 'var(--divider-color)',
                        ...(currentCardBlur > 0
                          ? {
                              backdropFilter: `blur(${currentCardBlur}px)`,
                              WebkitBackdropFilter: `blur(${currentCardBlur}px)`,
                              boxShadow:
                                'inset 0 1px 0 rgba(255,255,255,0.42), 0 6px 18px -6px rgba(0,0,0,0.1)',
                            }
                          : {}),
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={DEFAULT_COVER_SAKURA}
                          alt="Muestra de tamaño de tarjeta"
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border"
                          style={{ borderColor: 'var(--divider-color)' }}
                        />
                        <p className="text-xs font-bold truncate">Sakura Rain (Hi-Res)</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="truncate" style={{ color: 'var(--text-muted)' }}>
                          MoriNote · FLAC · {currentCardOpacity}% · {currentCardBlur}px
                        </span>
                        <span aria-hidden="true" className="opacity-70 shrink-0">
                          ♡ ✎
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 0. Card Opacity & Soft Frosted Blur */}
                  {onChangeTheme && (
                    <div
                      className="p-3 rounded-2xl border space-y-2.5"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                        <span>Opacidad y borroso suave (medio transparente)</span>
                        <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                          {currentCardOpacity}% · {currentCardBlur}px
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {surfacePresets.map((preset) => {
                          const active =
                            currentCardOpacity === preset.opacity &&
                            currentCardBlur === preset.blur;
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() =>
                                onChangeTheme({
                                  ...theme,
                                  trackCardOpacity: preset.opacity,
                                  trackCardBlur: preset.blur,
                                })
                              }
                              className="btn-raw min-h-[36px] px-2 py-1.5 rounded-xl border text-[11px] font-semibold transition"
                              style={{
                                backgroundColor: active
                                  ? 'var(--accent-soft)'
                                  : 'var(--bg-surface)',
                                borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                              }}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <label className="block space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span style={{ color: 'var(--text-muted)' }}>Opacidad</span>
                            <span className="font-mono-nums">{currentCardOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min={15}
                            max={100}
                            step={1}
                            aria-label="Opacidad de las tarjetas de música"
                            value={currentCardOpacity}
                            onChange={(e) =>
                              onChangeTheme({
                                ...theme,
                                trackCardOpacity: Number(e.target.value),
                              })
                            }
                            className="w-full accent-current cursor-pointer"
                          />
                        </label>

                        <label className="block space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span style={{ color: 'var(--text-muted)' }}>Borroso suave</span>
                            <span className="font-mono-nums">{currentCardBlur}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={20}
                            step={1}
                            aria-label="Borroso suave de las tarjetas de música"
                            value={currentCardBlur}
                            onChange={(e) => {
                              const nextBlur = Number(e.target.value);
                              const nextOpacity =
                                nextBlur > 0 && currentCardOpacity >= 96 ? 60 : currentCardOpacity;
                              onChangeTheme({
                                ...theme,
                                trackCardBlur: nextBlur,
                                trackCardOpacity: nextOpacity,
                              });
                            }}
                            className="w-full accent-current cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 1. Width (Ancho / Delgado) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Ancho (delgada ↔ ancha)</span>
                      <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                        {currentCardWidth}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {widthPresets.map((preset) => {
                        const active = currentCardWidth === preset.value;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() =>
                              onChangeSettings({
                                ...settings,
                                trackCardWidthPercent: preset.value,
                              })
                            }
                            className="btn-raw min-h-[38px] px-2 py-1.5 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center transition"
                            style={{
                              backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                              borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                            }}
                          >
                            <span>{preset.label}</span>
                            <span
                              className="text-[10px] font-mono-nums"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {preset.value}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-medium">
                        <span style={{ color: 'var(--text-muted)' }}>Más delgada (58%)</span>
                        <span style={{ color: 'var(--text-muted)' }}>Ancha (100%)</span>
                      </div>
                      <input
                        type="range"
                        min={58}
                        max={100}
                        step={2}
                        aria-label="Ancho de las tarjetas de canciones"
                        value={currentCardWidth}
                        onChange={(e) =>
                          onChangeSettings({
                            ...settings,
                            trackCardWidthPercent: Number(e.target.value),
                          })
                        }
                        className="w-full accent-current cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 2. Vertical Length (Largo / Alto) */}
                  <div
                    className="pt-3 border-t space-y-2"
                    style={{ borderColor: 'var(--divider-color)' }}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Largo vertical (fina ↔ larga)</span>
                      <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                        {currentCardHeight}px
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {heightPresets.map((preset) => {
                        const active = currentCardHeight === preset.value;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() =>
                              onChangeSettings({
                                ...settings,
                                trackCardHeightPx: preset.value,
                              })
                            }
                            className="btn-raw min-h-[38px] px-2 py-1.5 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center transition"
                            style={{
                              backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                              borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                            }}
                          >
                            <span>{preset.label}</span>
                            <span
                              className="text-[10px] font-mono-nums"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {preset.value}px
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-medium">
                        <span style={{ color: 'var(--text-muted)' }}>Fina (56px)</span>
                        <span style={{ color: 'var(--text-muted)' }}>Muy larga (176px)</span>
                      </div>
                      <input
                        type="range"
                        min={56}
                        max={176}
                        step={4}
                        aria-label="Largo vertical de las tarjetas de canciones"
                        value={currentCardHeight}
                        onChange={(e) =>
                          onChangeSettings({
                            ...settings,
                            trackCardHeightPx: Number(e.target.value),
                          })
                        }
                        className="w-full accent-current cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </section>

          {/* Background Playback & Over Other Apps */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Headphones className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Escuchar en segundo plano y sobre otras apps</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Activa controles multimedia del sistema (pantalla bloqueada / barra de notificaciones) y reproductor flotante
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.backgroundPlaybackEnabled}
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    backgroundPlaybackEnabled: !settings.backgroundPlaybackEnabled,
                  })
                }
                className="w-13 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
                style={{
                  backgroundColor: settings.backgroundPlaybackEnabled
                    ? 'var(--accent-color)'
                    : 'rgba(128,128,128,0.28)',
                }}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.backgroundPlaybackEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onToggleFloating}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition"
                style={{
                  backgroundColor: isFloatingOpen ? 'var(--accent-color)' : 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                  color: isFloatingOpen ? '#1C1B1F' : 'var(--text-main)',
                }}
              >
                <PictureInPicture2 className="w-4 h-4" />
                <span>
                  {isFloatingOpen
                    ? 'Cerrar ventana flotante (PiP)'
                    : 'Ventana flotante sobre otras apps (PiP)'}
                </span>
              </button>

              <button
                type="button"
                onClick={onToggleWidget}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition"
                style={{
                  backgroundColor: isWidgetOpen ? 'var(--accent-color)' : 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                  color: isWidgetOpen ? '#1C1B1F' : 'var(--text-main)',
                }}
              >
                <Layers className="w-4 h-4" />
                <span>{isWidgetOpen ? 'Ocultar mini-widget' : 'Mini-widget flotante'}</span>
              </button>

              {!isInstalled && isInstallable && (
                <button
                  type="button"
                  onClick={install}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: '#1C1B1F',
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar como app</span>
                </button>
              )}

              {!isInstalled && isIOS && (
                <button
                  type="button"
                  onClick={() => setShowIOSGuide((v) => !v)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar en iPhone / iPad</span>
                </button>
              )}
            </div>

            {showIOSGuide && (
              <p className="text-xs leading-relaxed p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--divider-color)' }}>
                1. Toca el botón <strong>Compartir</strong> en Safari. 2. Elige{' '}
                <strong>Añadir a pantalla de inicio</strong> para escuchar como app independiente.
              </p>
            )}

            {floatingError && (
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {floatingError}
              </p>
            )}

            <div
              className="pt-3 border-t flex items-center justify-between gap-4"
              style={{ borderColor: 'var(--divider-color)' }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Detectar y traducir letra automáticamente</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Al reproducir una canción nueva sin letra, la IA detecta su idioma, estado de ánimo y traduce al instante
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.autoDetectLyrics}
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    autoDetectLyrics: !settings.autoDetectLyrics,
                  })
                }
                className="w-13 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
                style={{
                  backgroundColor: settings.autoDetectLyrics
                    ? 'var(--accent-color)'
                    : 'rgba(128,128,128,0.28)',
                }}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.autoDetectLyrics ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Shareable App Link */}
          <section
            className="p-4 rounded-2xl border space-y-2.5"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Enlace de la aplicación</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                aria-label="Enlace de la app"
                className="flex-1 min-h-[42px] px-3 rounded-xl border text-xs font-mono-nums focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
              <button
                type="button"
                onClick={onShareLink}
                className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shrink-0 transition"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: '#1C1B1F',
                }}
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{linkCopied ? t.linkCopied : t.shareAppLink}</span>
              </button>
            </div>

            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Este enlace usa la dirección pública para compartir. Si la otra persona aún ve un error de permiso, activa el acceso público en el botón <strong>Share / Compartir</strong> del editor o publica la app. Cada persona agregará sus propias canciones desde su dispositivo.
            </p>

            <button
              type="button"
              onClick={() => setShowHomeScreenGuide((v) => !v)}
              className="text-xs underline underline-offset-4"
              style={{ color: 'var(--text-muted)' }}
            >
              {showHomeScreenGuide
                ? 'Ocultar pasos para pantalla principal'
                : '¿Cómo guardar en la pantalla principal de tu celular o PC?'}
            </button>

            {showHomeScreenGuide && (
              <div
                className="text-xs leading-relaxed p-3.5 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <p>
                  <strong>1. Abre el enlace en tu navegador</strong> (fuera de la vista previa): copia el enlace de arriba y ábrelo en Chrome o Safari.
                </p>
                <p>
                  <strong>2. En Android (Chrome):</strong> toca el menú <strong>⋮</strong> arriba a la derecha y elige <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.
                </p>
                <p>
                  <strong>3. En iPhone / iPad (Safari):</strong> toca el botón <strong>Compartir</strong> abajo y selecciona <strong>Añadir a pantalla de inicio</strong>.
                </p>
                <p>
                  <strong>4. En computadora (Chrome / Edge):</strong> haz clic en el ícono de <strong>Instalar</strong> en la barra de direcciones (arriba a la derecha).
                </p>
              </div>
            )}
          </section>

          {/* Hi-Fi Master Audio Engine (Apple Music-inspired Spatial & Clarity) */}
          <section
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold">Sonido Hi-Fi & Audio Espacial</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Motor de masterización en tiempo real: amplitud estéreo 3D, claridad vocal y protección sin distorsión
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(AUDIO_MODE_PROFILES) as AudioEngineMode[]).map((modeId) => {
                const profile = AUDIO_MODE_PROFILES[modeId];
                const active = (settings.audioMode ?? 'apple_master') === modeId;
                return (
                  <button
                    key={modeId}
                    type="button"
                    onClick={() => onChangeSettings({ ...settings, audioMode: modeId })}
                    className="p-3 rounded-2xl border text-left transition"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <div className="text-xs font-bold">{profile.label}</div>
                    <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>
                      {profile.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Sound Check Toggle */}
            <div
              className="pt-3 border-t flex items-center justify-between gap-4"
              style={{ borderColor: 'var(--divider-color)' }}
            >
              <div>
                <p className="text-xs font-semibold">Nivelación inteligente (Sound Check)</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Equilibra el volumen entre pistas suaves y potentes conservando nitidez y dinámica
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.soundCheckEnabled ?? true}
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    soundCheckEnabled: !(settings.soundCheckEnabled ?? true),
                  })
                }
                className="w-13 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
                style={{
                  backgroundColor:
                    (settings.soundCheckEnabled ?? true)
                      ? 'var(--accent-color)'
                      : 'rgba(128,128,128,0.28)',
                }}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    (settings.soundCheckEnabled ?? true) ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Spatial Width Slider */}
            {(settings.audioMode ?? 'apple_master') !== 'lossless_pure' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>Amplitud del escenario espacial</span>
                  <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                    {settings.spatialWidth ?? 65}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  aria-label="Amplitud espacial"
                  value={settings.spatialWidth ?? 65}
                  onChange={(e) =>
                    onChangeSettings({ ...settings, spatialWidth: Number(e.target.value) })
                  }
                  className="w-full accent-current cursor-pointer"
                />
              </div>
            )}
          </section>

          {/* Equalizer */}
          <section>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <h3 className="text-sm font-semibold">Ecualizador de 5 bandas</h3>
              </div>
              <button
                type="button"
                onClick={() => applyPreset('flat')}
                className="text-xs underline underline-offset-4"
                style={{ color: 'var(--text-muted)' }}
              >
                Restablecer
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(Object.keys(EQ_PRESETS) as EqPresetId[]).map((presetId) => {
                const active = settings.eqPreset === presetId;
                return (
                  <button
                    key={presetId}
                    type="button"
                    onClick={() => applyPreset(presetId)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium transition"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    {EQ_PRESETS[presetId].label}
                  </button>
                );
              })}
            </div>

            <div
              className="grid grid-cols-5 gap-3 p-4 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {BAND_LABELS.map((label, idx) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                    {settings.eqBands[idx] > 0 ? `+${settings.eqBands[idx]}` : settings.eqBands[idx]} dB
                  </span>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    aria-label={`Banda ${label}`}
                    value={settings.eqBands[idx]}
                    onChange={(e) => updateBand(idx, Number(e.target.value))}
                    className="w-full accent-current cursor-pointer"
                  />
                  <span className="text-[11px] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Playback Speed & Sleep Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section
              className="p-4 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <h3 className="text-sm font-semibold mb-2.5">{t.speed}</h3>
              <div className="flex flex-wrap gap-2">
                {SPEED_OPTIONS.map((spd) => {
                  const active = settings.playbackSpeed === spd;
                  return (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => onChangeSettings({ ...settings, playbackSpeed: spd })}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-mono-nums font-medium"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                        borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                      }}
                    >
                      {spd}x
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className="p-4 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Timer className="w-4 h-4" />
                <h3 className="text-sm font-semibold">{t.sleepTimer}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSetSleepTimer(null, false)}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium"
                  style={{
                    backgroundColor:
                      sleepMinutesRemaining === null && !sleepOnTrackEnd
                        ? 'var(--accent-soft)'
                        : 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  {t.off}
                </button>
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onSetSleepTimer(mins, false)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-mono-nums font-medium"
                    style={{
                      backgroundColor:
                        sleepMinutesRemaining === mins ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    {mins}m
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onSetSleepTimer(null, true)}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium"
                  style={{
                    backgroundColor: sleepOnTrackEnd ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  Fin de pista
                </button>
              </div>
            </section>
          </div>

          {/* Ideas Credit Footer at the End of Ajustes */}
          <footer
            className="p-4 rounded-2xl border text-center space-y-1"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <p className="text-xs font-bold tracking-tight">
              MoriNote · 茉莉音
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-main)' }}>
              Ideas por <span className="font-bold">Melissa</span>
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Aportes creativos, diseño y detalles pensados para disfrutar la música
            </p>
          </footer>
        </div>
      </div>

      {/* Confirmation Prompt Before Resetting All Colors & Customizations */}
      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reset-colors-title"
          onClick={() => setConfirmResetOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--divider-color)',
              color: 'var(--text-main)',
              ...settingsTextOverrideStyle,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <RotateCcw className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h4 id="reset-colors-title" className="text-base font-bold">
                  ¿Restablecer colores y personalización?
                </h4>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Se borrarán los colores, tema de botones, estilos de tarjetas, animaciones, banner y colores 3D que personalizaste para volver a como estaba antes. Tus canciones, listas y perfil no se borrarán.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="btn-raw min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold transition"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAppearance?.();
                  setConfirmResetOpen(false);
                  setResetDoneMsg(true);
                }}
                className="btn-raw min-h-[40px] px-4 py-2 rounded-xl border text-xs font-bold transition"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  borderColor: 'var(--divider-color)',
                  color: '#1C1B1F',
                }}
              >
                Sí, restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
