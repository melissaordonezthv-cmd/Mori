import React from 'react';
import { Check, Play, Sparkles, X } from 'lucide-react';
import {
  DIVIDER_SWATCHES,
  SONG_BAR_SWATCHES,
  SURFACE_SWATCHES,
  TEXT_SWATCHES,
} from '../constants/themes';
import type { ThemeConfig } from '../types/music';

interface ThemeModalProps {
  open: boolean;
  theme: ThemeConfig;
  onChange: (next: ThemeConfig) => void;
  onPreviewIntro: () => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  open,
  theme,
  onChange,
  onPreviewIntro,
  onClose,
}) => {
  if (!open) return null;

  const activeBg = SURFACE_SWATCHES.find((s) => s.id === theme.backgroundColorId);
  const activeText = TEXT_SWATCHES.find((t) => t.id === theme.textColorId);
  const lowContrastTip =
    (activeBg?.isDark && theme.textColorId === 'negro') ||
    (!activeBg?.isDark && theme.textColorId === 'blanco');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Personalizar tema"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--divider-color)' }}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Personalizar tema</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Pasteles claros, tonos oscuros en marrón, blanco y negro para toda la interfaz
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onPreviewIntro}
              className="min-h-[40px] px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 border transition active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Ver intro</span>
            </button>
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
        </div>

        <div className="space-y-6 pt-5">
          {/* 1. Background Color */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Fondo de la app</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SURFACE_SWATCHES.map((swatch) => {
                const selected = theme.backgroundColorId === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => onChange({ ...theme, backgroundColorId: swatch.id })}
                    className="min-h-[44px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: swatch.swatchPreview,
                        borderColor: 'rgba(128,128,128,0.28)',
                      }}
                    >
                      {selected && (
                        <Check
                          className="w-3 h-3"
                          style={{ color: swatch.isDark ? '#FFFFFF' : '#1C1B1F' }}
                        />
                      )}
                    </span>
                    <span className="truncate">{swatch.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Player & Card Surface Color */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Color del reproductor y tarjetas</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SURFACE_SWATCHES.map((swatch) => {
                const selected = theme.playerColorId === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => onChange({ ...theme, playerColorId: swatch.id })}
                    className="min-h-[44px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: swatch.accent,
                        borderColor: 'rgba(128,128,128,0.28)',
                      }}
                    >
                      {selected && (
                        <Check
                          className="w-3 h-3"
                          style={{ color: swatch.isDark ? '#FFFFFF' : '#1C1B1F' }}
                        />
                      )}
                    </span>
                    <span className="truncate">{swatch.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Song Progress Bar Color */}
          <section>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold">Barra de la canción</h3>
              <div className="w-24 h-2 rounded-full overflow-hidden bg-black/10 shrink-0 flex items-center">
                <div
                  className="h-full w-2/3 rounded-full transition-colors"
                  style={{ backgroundColor: 'var(--song-bar-color)' }}
                />
              </div>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Personaliza el color de la barra de progreso de la canción
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SONG_BAR_SWATCHES.map((bar) => {
                const selected = (theme.songBarColorId ?? 'auto') === bar.id;
                const dotColor = bar.id === 'auto' ? 'var(--accent-color)' : bar.color;
                return (
                  <button
                    key={bar.id}
                    type="button"
                    onClick={() => onChange({ ...theme, songBarColorId: bar.id })}
                    className="min-h-[44px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: dotColor,
                        borderColor: 'rgba(128,128,128,0.28)',
                      }}
                    >
                      {selected && (
                        <Check
                          className="w-3 h-3"
                          style={{ color: bar.isLight || bar.id === 'auto' ? '#1C1B1F' : '#FFFFFF' }}
                        />
                      )}
                    </span>
                    <span className="truncate">{bar.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Song Divider Color */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Separadores de canciones</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DIVIDER_SWATCHES.map((div) => {
                const selected = theme.dividerColorId === div.id;
                return (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => onChange({ ...theme, dividerColorId: div.id })}
                    className="min-h-[44px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <span
                      className="w-5 h-1.5 rounded-full shrink-0 border"
                      style={{
                        backgroundColor: div.color,
                        borderColor: 'rgba(128,128,128,0.25)',
                      }}
                    />
                    <span className="truncate">{div.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Text / Lyrics Color */}
          <section>
            <h3 className="text-sm font-semibold mb-1">Color de letra y textos</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Elige entre tonos clásicos, cálidos, pastel o profundos para letras e interfaz
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TEXT_SWATCHES.map((txt) => {
                const selected = theme.textColorId === txt.id;
                const isLightTextSwatch =
                  txt.id === 'blanco' || txt.id === 'crema' || txt.id === 'amarillo';
                return (
                  <button
                    key={txt.id}
                    type="button"
                    onClick={() => onChange({ ...theme, textColorId: txt.id })}
                    className="min-h-[44px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: txt.hex,
                        borderColor: 'rgba(128,128,128,0.35)',
                        color: isLightTextSwatch ? '#1C1B1F' : '#FFFFFF',
                      }}
                    >
                      A
                    </span>
                    <span className="truncate">{txt.label}</span>
                  </button>
                );
              })}
            </div>
            {lowContrastTip && (
              <p
                className="mt-2.5 text-xs px-3 py-2 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: activeText?.hex,
                }}
              >
                Nota de lectura: elegiste letra {activeText?.label.toLowerCase()} sobre fondo{' '}
                {activeBg?.label.toLowerCase()}; puedes cambiar cualquiera de los dos en segundos.
              </p>
            )}
          </section>

          {/* 5. Mood Sync Toggle */}
          <section
            className="p-4 rounded-2xl border flex items-center justify-between gap-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--accent-soft)' }}
              >
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Interfaz sincronizada con el ánimo musical</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Suaviza el halo ambiental y el ritmo del visualizador según la emoción detectada por la IA
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme.moodSyncEnabled}
              onClick={() => onChange({ ...theme, moodSyncEnabled: !theme.moodSyncEnabled })}
              className="w-13 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
              style={{
                backgroundColor: theme.moodSyncEnabled ? 'var(--accent-color)' : 'rgba(128,128,128,0.28)',
              }}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  theme.moodSyncEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
