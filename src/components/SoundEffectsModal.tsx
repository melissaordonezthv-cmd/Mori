import React, { useState } from 'react';
import { Keyboard, Lock, Sparkles, Volume2, X } from 'lucide-react';
import type { ButtonSoundId, LockSoundId, SoundConfig } from '../types/music';
import {
  BUTTON_SOUND_OPTIONS,
  LOCK_SOUND_OPTIONS,
  playButtonSound,
  playLockKeySound,
} from '../utils/asmrSounds';

interface SoundEffectsModalProps {
  open: boolean;
  soundConfig: SoundConfig;
  onChange: (next: SoundConfig) => void;
  onClose: () => void;
}

const TEST_KEYS = ['M', 'o', 'r', 'i', '🌸', '音', '♫'];

export const SoundEffectsModal: React.FC<SoundEffectsModalProps> = ({
  open,
  soundConfig,
  onChange,
  onClose,
}) => {
  const [lockPreviewSlot, setLockPreviewSlot] = useState(0);
  const [pressedKeyIdx, setPressedKeyIdx] = useState<number | null>(null);

  if (!open) return null;

  const handleSelectLockSound = (id: LockSoundId) => {
    const nextConfig: SoundConfig = {
      ...soundConfig,
      enabled: id !== 'off' ? true : soundConfig.enabled,
      lockSound: id,
    };
    onChange(nextConfig);
    if (id !== 'off') {
      playLockKeySound(id, lockPreviewSlot, soundConfig.volume);
      setLockPreviewSlot((prev) => (prev + 1) % 4);
    }
  };

  const handleSelectButtonSound = (id: ButtonSoundId) => {
    const nextConfig: SoundConfig = {
      ...soundConfig,
      enabled: id !== 'off' ? true : soundConfig.enabled,
      buttonSound: id,
    };
    onChange(nextConfig);
    if (id !== 'off') {
      playButtonSound(id, soundConfig.volume);
    }
  };

  const handleTestKeyPress = (idx: number) => {
    setPressedKeyIdx(idx);
    if (soundConfig.enabled && soundConfig.buttonSound !== 'off') {
      playButtonSound(soundConfig.buttonSound, soundConfig.volume);
    }
    window.setTimeout(() => {
      setPressedKeyIdx((curr) => (curr === idx ? null : curr));
    }, 110);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Sonidos cute y ASMR"
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
        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 pb-4 border-b"
          style={{ borderColor: 'var(--divider-color)' }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <Volume2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Sonidos cute y ASMR</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Burbujas suaves para tu clave y teclados cremosos estilo chino al tocar botones
              </p>
            </div>
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

        <div className="mt-5 space-y-6">
          {/* Master Switch + Volume */}
          <div
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Activar sonidos ASMR al presionar</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Toca cualquier estilo abajo para escucharlo en vivo
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={soundConfig.enabled}
                onClick={() =>
                  onChange({ ...soundConfig, enabled: !soundConfig.enabled })
                }
                className="w-14 h-8 rounded-full p-1 transition-colors shrink-0 flex items-center"
                style={{
                  backgroundColor: soundConfig.enabled
                    ? 'var(--accent-color)'
                    : 'var(--divider-color)',
                  justifyContent: soundConfig.enabled ? 'flex-end' : 'flex-start',
                }}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Volumen ASMR</span>
                <span>{Math.round(soundConfig.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.15}
                max={1}
                step={0.05}
                value={soundConfig.volume}
                onChange={(e) =>
                  onChange({ ...soundConfig, volume: parseFloat(e.target.value) })
                }
                aria-label="Volumen ASMR"
                className="w-full accent-[var(--song-bar-color)]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 border-t" style={{ borderColor: 'var(--divider-color)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Sonar también al escribir en buscador y textos
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={soundConfig.playOnTextInputs}
                onClick={() =>
                  onChange({
                    ...soundConfig,
                    playOnTextInputs: !soundConfig.playOnTextInputs,
                  })
                }
                className="w-12 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
                style={{
                  backgroundColor: soundConfig.playOnTextInputs
                    ? 'var(--accent-color)'
                    : 'var(--divider-color)',
                  justifyContent: soundConfig.playOnTextInputs
                    ? 'flex-end'
                    : 'flex-start',
                }}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          </div>

          {/* Section 1: Lock Screen Typing Sounds */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <h3 className="text-sm font-bold">
                  Al escribir la clave de pantalla (4 emojis)
                </h3>
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                Toca para probar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOCK_SOUND_OPTIONS.map((item) => {
                const selected = soundConfig.lockSound === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-sound-role="preview"
                    onClick={() => handleSelectLockSound(item.id)}
                    className="p-3.5 rounded-2xl border text-left transition active:scale-[0.98] flex items-start gap-3"
                    style={{
                      backgroundColor: selected
                        ? 'var(--accent-soft)'
                        : 'var(--bg-surface)',
                      borderColor: selected
                        ? 'var(--accent-color)'
                        : 'var(--divider-color)',
                    }}
                  >
                    <span className="text-2xl leading-none shrink-0 mt-0.5">
                      {item.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold">{item.label}</div>
                      <p
                        className="text-xs mt-0.5 leading-snug"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: Creamy Chinese Keyboards & Button Sounds */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <h3 className="text-sm font-bold">
                  Al presionar botones (teclados cremosos ASMR)
                </h3>
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                Varios estilos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BUTTON_SOUND_OPTIONS.map((item) => {
                const selected = soundConfig.buttonSound === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-sound-role="preview"
                    onClick={() => handleSelectButtonSound(item.id)}
                    className="p-3.5 rounded-2xl border text-left transition active:scale-[0.98] flex items-start gap-3"
                    style={{
                      backgroundColor: selected
                        ? 'var(--accent-soft)'
                        : 'var(--bg-surface)',
                      borderColor: selected
                        ? 'var(--accent-color)'
                        : 'var(--divider-color)',
                    }}
                  >
                    <span className="text-2xl leading-none shrink-0 mt-0.5">
                      {item.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold truncate">{item.label}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5 leading-snug"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Creamy Mini Keyboard Tester */}
            <div
              className="p-4 rounded-2xl border space-y-2.5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Tecladito de prueba ASMR</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  Presiona rápido para sentir el sonido
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {TEST_KEYS.map((label, idx) => {
                  const isDown = pressedKeyIdx === idx;
                  return (
                    <button
                      key={label}
                      type="button"
                      data-sound-role="preview"
                      onPointerDown={() => handleTestKeyPress(idx)}
                      className="min-h-[46px] rounded-xl border-b-4 border text-sm font-bold transition-all select-none"
                      style={{
                        backgroundColor: isDown
                          ? 'var(--accent-soft)'
                          : 'var(--bg-elevated)',
                        borderColor: isDown
                          ? 'var(--accent-color)'
                          : 'var(--divider-color)',
                        transform: isDown ? 'translateY(2px)' : 'translateY(0)',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
