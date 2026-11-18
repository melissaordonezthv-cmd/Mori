import React, { useEffect, useState } from 'react';
import { Check, Delete, HelpCircle, Lock, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import type { SurfaceSwatch, TextSwatch } from '../constants/themes';
import type { ProfileConfig, SoundConfig } from '../types/music';
import {
  playLockEraseSound,
  playLockErrorSound,
  playLockKeySound,
  playLockUnlockSound,
} from '../utils/asmrSounds';
import { CuteAvatarFrame } from './CuteAvatarFrame';

export const CUTE_LOCK_EMOJIS: string[] = [
  '🌸',
  '🍓',
  '🧸',
  '🎀',
  '☁️',
  '🍵',
  '🌙',
  '⭐',
  '🐱',
  '🐰',
  '🍑',
  '🍒',
  '🦋',
  '💌',
  '🌷',
  '🍰',
  '🎧',
  '✨',
  '🫧',
  '🐾',
];

interface EmojiLockScreenProps {
  open: boolean;
  expectedEmojis: string[];
  hint?: string;
  profile: ProfileConfig;
  soundConfig: SoundConfig;
  bgSwatch: SurfaceSwatch;
  playerSwatch: SurfaceSwatch;
  textSwatch: TextSwatch;
  onUnlock: () => void;
  onResetLock: () => void;
}

export const EmojiLockScreen: React.FC<EmojiLockScreenProps> = ({
  open,
  expectedEmojis,
  hint,
  profile,
  soundConfig,
  bgSwatch,
  playerSwatch,
  textSwatch,
  onUnlock,
  onResetLock,
}) => {
  const [entered, setEntered] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (open) {
      setEntered([]);
      setStatus('idle');
      setAttempts(0);
      setShowHint(false);
      setConfirmReset(false);
    }
  }, [open]);

  const handlePickEmoji = (emoji: string) => {
    if (!open || status !== 'idle' || entered.length >= 4) return;
    const slotIdx = entered.length;
    const next = [...entered, emoji];
    setEntered(next);

    if (soundConfig.enabled) {
      playLockKeySound(soundConfig.lockSound, slotIdx, soundConfig.volume);
    }

    if (next.length === 4) {
      const matches =
        expectedEmojis.length === 4 &&
        next.every((item, idx) => item === expectedEmojis[idx]);

      if (matches) {
        setStatus('success');
        if (soundConfig.enabled) {
          window.setTimeout(() => {
            playLockUnlockSound(soundConfig.lockSound, soundConfig.volume);
          }, 95);
        }
        window.setTimeout(() => {
          onUnlock();
        }, 230);
      } else {
        setStatus('error');
        setAttempts((prev) => prev + 1);
        if (soundConfig.enabled) {
          window.setTimeout(() => {
            playLockErrorSound(soundConfig.lockSound, soundConfig.volume);
          }, 95);
        }
        window.setTimeout(() => {
          setEntered([]);
          setStatus('idle');
        }, 460);
      }
    }
  };

  const handleBackspace = () => {
    if (status !== 'idle' || entered.length === 0) return;
    if (soundConfig.enabled) {
      playLockEraseSound(soundConfig.lockSound, soundConfig.volume);
    }
    setEntered((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (status !== 'idle' || entered.length === 0) return;
    if (soundConfig.enabled) {
      playLockEraseSound(soundConfig.lockSound, soundConfig.volume);
    }
    setEntered([]);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] overflow-y-auto flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pantalla de bloqueo con clave de emojis"
      style={{
        backgroundColor: bgSwatch.bgApp,
        color: textSwatch.hex,
      }}
    >
      {/* Decorative theme-matched watercolor ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-3xl opacity-65"
          style={{ backgroundColor: playerSwatch.accentSoft }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full blur-3xl opacity-65"
          style={{ backgroundColor: bgSwatch.accentSoft }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-3xl p-6 border shadow-2xl text-center"
        style={{
          backgroundColor: playerSwatch.bgElevated,
          borderColor: 'var(--divider-color)',
        }}
      >
        <div className="flex flex-col items-center">
          <CuteAvatarFrame
            avatarUrl={profile.avatarUrl}
            displayName={profile.displayName}
            frame={profile.avatarFrame}
            size="lg"
          />

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold opacity-75">
            <Lock className="w-3.5 h-3.5" style={{ color: playerSwatch.accent }} />
            <span>MoriNote · 茉莉音</span>
          </div>

          <h2 className="text-lg font-extrabold tracking-tight mt-1 font-display">
            Hola, {profile.displayName}
          </h2>
          <p className="text-xs mt-1" style={{ color: textSwatch.mutedHex }}>
            {status === 'success'
              ? '¡Listo! Entrando a tu música...'
              : status === 'error'
                ? 'Ups, esa combinación no coincide'
                : 'Ingresa tu clave de 4 emojis cute'}
          </p>
        </div>

        {/* 4-Emoji Passcode Slots */}
        <motion.div
          animate={
            status === 'error'
              ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.4 }}
          className="mt-5 flex items-center justify-center gap-3"
        >
          {[0, 1, 2, 3].map((slotIndex) => {
            const value = entered[slotIndex];
            const isFilled = Boolean(value);
            return (
              <div
                key={slotIndex}
                className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-2xl border-2 flex items-center justify-center text-2xl select-none transition-colors"
                style={{
                  backgroundColor:
                    status === 'success'
                      ? 'rgba(34, 197, 94, 0.14)'
                      : status === 'error'
                        ? 'rgba(239, 68, 68, 0.12)'
                        : isFilled
                          ? playerSwatch.accentSoft
                          : playerSwatch.bgSurface,
                  borderColor:
                    status === 'success'
                      ? '#22C55E'
                      : status === 'error'
                        ? '#EF4444'
                        : isFilled
                          ? playerSwatch.accent
                          : 'var(--divider-color)',
                }}
              >
                {status === 'success' && slotIndex === 3 ? (
                  <Check className="w-6 h-6 text-emerald-500" />
                ) : value ? (
                  <motion.span
                    key={`${slotIndex}-${value}`}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                  >
                    {value}
                  </motion.span>
                ) : (
                  <span
                    className="w-2.5 h-2.5 rounded-full opacity-35"
                    style={{ backgroundColor: textSwatch.mutedHex }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Optional Hint Toggle */}
        {hint && hint.trim().length > 0 && (
          <div className="mt-3">
            {showHint ? (
              <p
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border"
                style={{
                  backgroundColor: playerSwatch.bgSurface,
                  borderColor: 'var(--divider-color)',
                  color: textSwatch.mutedHex,
                }}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: playerSwatch.accent }} />
                <span>Pista: {hint}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1 text-xs font-medium opacity-75 hover:opacity-100 py-1 px-2"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ver pista</span>
              </button>
            )}
          </div>
        )}

        {/* 20-Emoji Cute Keypad (5x4) */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          {CUTE_LOCK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              data-sound-role="lock-key"
              onClick={() => handlePickEmoji(emoji)}
              disabled={status !== 'idle' || entered.length >= 4}
              aria-label={`Emoji ${emoji}`}
              className="min-h-[50px] rounded-2xl border text-2xl flex items-center justify-center transition-transform active:scale-90 hover:scale-[1.04] disabled:opacity-60 select-none"
              style={{
                backgroundColor: playerSwatch.bgSurface,
                borderColor: 'var(--divider-color)',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Keypad Utility Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            data-sound-role="lock-key"
            onClick={handleClear}
            disabled={status !== 'idle' || entered.length === 0}
            className="min-h-[42px] rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-45"
            style={{
              backgroundColor: playerSwatch.bgSurface,
              borderColor: 'var(--divider-color)',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>

          <button
            type="button"
            data-sound-role="lock-key"
            onClick={handleBackspace}
            disabled={status !== 'idle' || entered.length === 0}
            className="min-h-[42px] rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-45"
            style={{
              backgroundColor: playerSwatch.bgSurface,
              borderColor: 'var(--divider-color)',
            }}
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Borrar</span>
          </button>
        </div>

        {/* Safe Reset Recovery after 3 failed attempts */}
        {attempts >= 3 && (
          <div
            className="mt-4 pt-3 border-t text-xs"
            style={{ borderColor: 'var(--divider-color)' }}
          >
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="font-semibold underline underline-offset-2 opacity-80 hover:opacity-100 py-1"
              >
                ¿Olvidaste tu clave? Restablecer
              </button>
            ) : (
              <div className="space-y-2">
                <p style={{ color: textSwatch.mutedHex }}>
                  Se quitará la clave actual sin borrar tus canciones.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-[38px] px-3 rounded-xl border font-semibold"
                    style={{
                      backgroundColor: playerSwatch.bgSurface,
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onResetLock}
                    className="min-h-[38px] px-3.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition"
                  >
                    Confirmar desbloqueo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
