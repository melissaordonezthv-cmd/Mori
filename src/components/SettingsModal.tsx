import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Globe,
  Headphones,
  Layers,
  PictureInPicture2,
  Share2,
  Sliders,
  Sparkles,
  Timer,
  Volume2,
  X,
} from 'lucide-react';
import { LANGUAGE_OPTIONS, type Translations } from '../constants/i18n';
import { AUDIO_MODE_PROFILES, EQ_PRESETS } from '../constants/themes';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type { AppLanguage, AppSettings, AudioEngineMode, EqPresetId } from '../types/music';
import { getShareableAppUrl } from '../utils/shareLink';

interface SettingsModalProps {
  open: boolean;
  settings: AppSettings;
  sleepMinutesRemaining: number | null;
  sleepOnTrackEnd: boolean;
  isFloatingOpen: boolean;
  isWidgetOpen: boolean;
  floatingError: string | null;
  t: Translations;
  onChangeSettings: (next: AppSettings) => void;
  onSetSleepTimer: (minutes: number | null, onTrackEnd?: boolean) => void;
  onToggleFloating: () => void;
  onToggleWidget: () => void;
  onShareLink: () => void;
  linkCopied: boolean;
  onClose: () => void;
}

const BAND_LABELS = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz'];
const SPEED_OPTIONS = [0.75, 1, 1.15, 1.25, 1.5];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  settings,
  sleepMinutesRemaining,
  sleepOnTrackEnd,
  isFloatingOpen,
  isWidgetOpen,
  floatingError,
  t,
  onChangeSettings,
  onSetSleepTimer,
  onToggleFloating,
  onToggleWidget,
  onShareLink,
  linkCopied,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showHomeScreenGuide, setShowHomeScreenGuide] = useState(false);

  if (!open) return null;

  const appUrl = getShareableAppUrl();

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
        </div>
      </div>
    </div>
  );
};
