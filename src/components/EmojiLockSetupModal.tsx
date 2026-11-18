import React, { useEffect, useState } from 'react';
import {
  Check,
  Delete,
  Eye,
  EyeOff,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { LockConfig, SoundConfig } from '../types/music';
import { playLockEraseSound, playLockKeySound } from '../utils/asmrSounds';
import { CUTE_LOCK_EMOJIS } from './EmojiLockScreen';

interface EmojiLockSetupModalProps {
  open: boolean;
  lockConfig: LockConfig;
  soundConfig: SoundConfig;
  onChange: (next: LockConfig) => void;
  onLockNow: () => void;
  onClose: () => void;
}

export const EmojiLockSetupModal: React.FC<EmojiLockSetupModalProps> = ({
  open,
  lockConfig,
  soundConfig,
  onChange,
  onLockNow,
  onClose,
}) => {
  const [draftEmojis, setDraftEmojis] = useState<string[]>(lockConfig.emojis);
  const [draftHint, setDraftHint] = useState(lockConfig.hint ?? '');
  const [showCurrentEmojis, setShowCurrentEmojis] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [needsPasscodeHint, setNeedsPasscodeHint] = useState(false);

  useEffect(() => {
    if (open) {
      setDraftEmojis(lockConfig.emojis);
      setDraftHint(lockConfig.hint ?? '');
      setShowCurrentEmojis(false);
      setSavedNotice(false);
      setNeedsPasscodeHint(false);
    }
  }, [open, lockConfig]);

  if (!open) return null;

  const hasSavedPasscode = lockConfig.emojis.length === 4;
  const isLockActive = lockConfig.enabled && hasSavedPasscode;

  const handleToggleLock = () => {
    if (lockConfig.enabled) {
      onChange({ ...lockConfig, enabled: false });
      setNeedsPasscodeHint(false);
    } else if (hasSavedPasscode) {
      onChange({ ...lockConfig, enabled: true });
      setNeedsPasscodeHint(false);
    } else if (draftEmojis.length === 4) {
      onChange({
        enabled: true,
        emojis: draftEmojis,
        hint: draftHint.trim() || undefined,
      });
      setSavedNotice(true);
      setNeedsPasscodeHint(false);
      window.setTimeout(() => setSavedNotice(false), 2200);
    } else {
      setNeedsPasscodeHint(true);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    if (draftEmojis.length >= 4) return;
    if (soundConfig.enabled) {
      playLockKeySound(soundConfig.lockSound, draftEmojis.length, soundConfig.volume);
    }
    setDraftEmojis((prev) => [...prev, emoji]);
    setNeedsPasscodeHint(false);
    setSavedNotice(false);
  };

  const handleBackspace = () => {
    if (draftEmojis.length > 0 && soundConfig.enabled) {
      playLockEraseSound(soundConfig.lockSound, soundConfig.volume);
    }
    setDraftEmojis((prev) => prev.slice(0, -1));
    setSavedNotice(false);
  };

  const handleClearDraft = () => {
    if (draftEmojis.length > 0 && soundConfig.enabled) {
      playLockEraseSound(soundConfig.lockSound, soundConfig.volume);
    }
    setDraftEmojis([]);
    setSavedNotice(false);
  };

  const handleSavePasscode = () => {
    if (draftEmojis.length !== 4) return;
    onChange({
      enabled: true,
      emojis: draftEmojis,
      hint: draftHint.trim() || undefined,
    });
    setSavedNotice(true);
    setNeedsPasscodeHint(false);
    window.setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleRemovePasscode = () => {
    setDraftEmojis([]);
    setDraftHint('');
    setSavedNotice(false);
    setNeedsPasscodeHint(false);
    onChange({
      enabled: false,
      emojis: [],
      hint: '',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Clave de pantalla con emojis"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border"
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
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Clave de pantalla</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Protege tu entrada con 4 emojis cute antes de ver la intro
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

        <div className="mt-5 space-y-5">
          {/* Enable/Disable Switch Card */}
          <div
            className="p-4 rounded-2xl border flex items-center justify-between gap-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Activar bloqueo al entrar</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {isLockActive
                  ? 'Activo: primero pide tu clave y luego muestra la intro.'
                  : 'Desactivado: entras directo a la intro y tu biblioteca.'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isLockActive}
              onClick={handleToggleLock}
              className="w-14 h-8 rounded-full p-1 transition-colors shrink-0 flex items-center"
              style={{
                backgroundColor: isLockActive ? 'var(--accent-color)' : 'var(--divider-color)',
                justifyContent: isLockActive ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow" />
            </button>
          </div>

          {needsPasscodeHint && (
            <p
              className="text-xs font-medium px-3.5 py-2.5 rounded-xl border"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--accent-color)',
              }}
            >
              Elige 4 emojis abajo y toca &ldquo;Guardar clave&rdquo; para activar el bloqueo.
            </p>
          )}

          {/* Current Saved Passcode Summary */}
          {hasSavedPasscode && (
            <div
              className="p-4 rounded-2xl border space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Clave guardada
                </span>
                <button
                  type="button"
                  onClick={() => setShowCurrentEmojis((v) => !v)}
                  className="text-xs font-semibold flex items-center gap-1 opacity-80 hover:opacity-100 py-1 px-2 rounded-lg"
                >
                  {showCurrentEmojis ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver clave</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {lockConfig.emojis.map((em, i) => (
                  <span
                    key={i}
                    className="w-11 h-11 rounded-xl border flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    {showCurrentEmojis ? em : '•'}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={onLockNow}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Probar bloqueo ahora</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePasscode}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 text-rose-500 transition active:scale-95"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar clave</span>
                </button>
              </div>
            </div>
          )}

          {/* 4-Emoji Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{hasSavedPasscode ? 'Cambiar clave (4 emojis)' : 'Elige 4 emojis cute'}</span>
              </h3>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                {draftEmojis.length}/4
              </span>
            </div>

            {/* 4 Draft Slots + Backspace/Clear */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {[0, 1, 2, 3].map((idx) => {
                  const emoji = draftEmojis[idx];
                  return (
                    <div
                      key={idx}
                      className="w-13 h-13 rounded-2xl border-2 flex items-center justify-center text-2xl select-none"
                      style={{
                        backgroundColor: emoji ? 'var(--accent-soft)' : 'var(--bg-surface)',
                        borderColor: emoji ? 'var(--accent-color)' : 'var(--divider-color)',
                      }}
                    >
                      {emoji || (
                        <span
                          className="w-2 h-2 rounded-full opacity-35"
                          style={{ backgroundColor: 'var(--text-muted)' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  data-sound-role="lock-key"
                  onClick={handleBackspace}
                  disabled={draftEmojis.length === 0}
                  aria-label="Borrar último emoji"
                  className="min-w-[42px] min-h-[42px] rounded-xl border flex items-center justify-center disabled:opacity-40"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-sound-role="lock-key"
                  onClick={handleClearDraft}
                  disabled={draftEmojis.length === 0}
                  aria-label="Limpiar selección"
                  className="min-w-[42px] min-h-[42px] rounded-xl border flex items-center justify-center disabled:opacity-40"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 20 Cute Emojis Grid */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {CUTE_LOCK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  data-sound-role="lock-key"
                  onClick={() => handleAddEmoji(emoji)}
                  disabled={draftEmojis.length >= 4}
                  aria-label={`Elegir ${emoji}`}
                  className="min-h-[46px] rounded-2xl border text-2xl flex items-center justify-center transition-transform active:scale-90 hover:scale-[1.04] disabled:opacity-50 select-none"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Optional Hint Input */}
            <div className="pt-1">
              <label className="block text-xs font-semibold mb-1.5">
                Pista para recordar (opcional)
              </label>
              <input
                type="text"
                value={draftHint}
                onChange={(e) => setDraftHint(e.target.value)}
                maxLength={50}
                placeholder="Ej. Mi té favorito y flores..."
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-sm outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs font-semibold flex items-center gap-1 text-emerald-600">
                {savedNotice && (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Clave guardada y activada!</span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={handleSavePasscode}
                disabled={draftEmojis.length !== 4}
                className="min-h-[44px] px-5 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 disabled:opacity-45"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: '#1F1B1D',
                }}
              >
                Guardar clave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
