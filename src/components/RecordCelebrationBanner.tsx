import React, { useEffect, useState } from 'react';
import { Award, Check, Sparkles, X } from 'lucide-react';
import { CUSTOM_FRAME_COLORS } from '../constants/records';
import type { RecordCelebrationEvent } from '../hooks/useListeningRecords';
import type { AvatarFrameId } from '../types/music';
import { CuteAvatarFrame } from './CuteAvatarFrame';
import { PreciousBadgeMedal } from './PreciousBadgeMedal';

interface RecordCelebrationBannerProps {
  event: RecordCelebrationEvent | null;
  avatarUrl: string;
  displayName: string;
  currentFrameColor?: string;
  onEquipFrame: (frameId: AvatarFrameId, color: string) => void;
  onDismiss: () => void;
}

export const RecordCelebrationBanner: React.FC<RecordCelebrationBannerProps> = ({
  event,
  avatarUrl,
  displayName,
  currentFrameColor,
  onEquipFrame,
  onDismiss,
}) => {
  const frames = event?.unlockedFrames ?? [];
  const badges = event?.unlockedBadges ?? [];

  const [selectedFrameId, setSelectedFrameId] = useState<AvatarFrameId | null>(
    frames.length > 0 ? frames[frames.length - 1].frameId : null
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    currentFrameColor ||
      (frames.length > 0 ? frames[frames.length - 1].defaultColor : '#F472B6')
  );

  useEffect(() => {
    if (!event) return;
    const latestFrame = event.unlockedFrames[event.unlockedFrames.length - 1];
    if (latestFrame) {
      setSelectedFrameId(latestFrame.frameId);
      setSelectedColor((prev) => currentFrameColor || latestFrame.defaultColor || prev);
    } else if (event.unlockedBadges.length > 0) {
      setSelectedColor(currentFrameColor || event.unlockedBadges[0].accentHex);
    }
  }, [event, currentFrameColor]);

  if (!event || (frames.length === 0 && badges.length === 0)) return null;

  const activeFrame =
    frames.find((f) => f.frameId === selectedFrameId) ??
    frames[frames.length - 1] ??
    null;
  const activeColor =
    selectedColor ||
    activeFrame?.defaultColor ||
    badges[badges.length - 1]?.accentHex ||
    '#F472B6';

  const isMultiReward = frames.length > 1 || badges.length > 1;
  const headlineText = isMultiReward
    ? `¡${frames.length} ${frames.length === 1 ? 'marco' : 'marcos'}${
        badges.length > 0
          ? ` y ${badges.length} ${badges.length === 1 ? 'insignia' : 'insignias'}`
          : ''
      } acumulados!`
    : event.isFirstRecord
      ? '¡Primer récord logrado!'
      : '¡Nuevo récord superado!';

  return (
    <div
      className="fixed inset-x-0 top-3 z-[95] px-3 sm:px-4 flex justify-center pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto anim-badge-pop w-full max-w-lg max-h-[86vh] overflow-y-auto rounded-3xl border p-4 shadow-2xl backdrop-blur-xl space-y-3"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-elevated) 95%, transparent)',
          borderColor: activeColor,
          color: 'var(--text-main)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 shrink-0" style={{ color: activeColor }} />
              <span>{headlineText}</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold mt-0.5">
              Nuevo récord: {event.newRecordMinutes} min de música
            </h3>
            <p className="text-[11px] opacity-80">
              {frames.length > 1
                ? 'Todo el tiempo que escuchaste se acumuló en estos premios exclusivos.'
                : activeFrame
                  ? `Desbloqueaste el marco único: ${activeFrame.frameLabel}`
                  : 'Premio especial por tu racha de escucha.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar aviso"
            className="min-w-[32px] min-h-[32px] rounded-xl flex items-center justify-center opacity-70 hover:opacity-100 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simultaneous Animated Precious Badges */}
        {badges.length > 0 && (
          <div
            className="rounded-2xl border p-3 space-y-2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <p className="text-[11px] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: activeColor }} />
              <span>
                {badges.length === 1
                  ? 'Insignia preciosa desbloqueada:'
                  : `Insignias preciosas ganadas (${badges.length}):`}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, idx) => (
                <div
                  key={badge.id}
                  className="anim-badge-pop flex items-center gap-2 rounded-2xl border px-2.5 py-1.5 shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: badge.accentHex,
                    animationDelay: `${Math.min(idx * 90, 450)}ms`,
                  }}
                >
                  <div className="anim-badge-float shrink-0">
                    <PreciousBadgeMedal badge={badge} earned size="sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold leading-tight truncate max-w-[140px]">
                      {badge.title}
                    </p>
                    <p className="text-[10px] opacity-75 leading-tight">{badge.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simultaneous Unlocked Frames Carousel + Live Color Customizer */}
        {frames.length > 0 && activeFrame && (
          <div
            className="rounded-2xl border p-3 space-y-3"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            {frames.length > 1 && (
              <div>
                <p className="text-[11px] font-bold mb-2">
                  Marcos exclusivos ganados ({frames.length}) — toca uno para probarlo:
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1.5 pt-2 px-1">
                  {frames.map((fr, idx) => {
                    const isPicked = fr.frameId === activeFrame.frameId;
                    return (
                      <button
                        key={fr.frameId}
                        type="button"
                        onClick={() => setSelectedFrameId(fr.frameId)}
                        className="btn-raw anim-badge-pop shrink-0 pt-3 pb-2 px-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition"
                        style={{
                          backgroundColor: isPicked ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: isPicked ? activeColor : 'var(--divider-color)',
                          animationDelay: `${Math.min(idx * 70, 500)}ms`,
                        }}
                      >
                        <CuteAvatarFrame
                          avatarUrl={avatarUrl}
                          displayName={displayName}
                          frame={fr.frameId}
                          frameColor={activeColor}
                          size="sm"
                          alwaysShowFrame
                        />
                        <span className="text-[10px] font-bold max-w-[78px] truncate">
                          {fr.frameLabel}
                        </span>
                        <span className="text-[9px] opacity-75">{fr.minutes} min</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="shrink-0 pl-1">
                <CuteAvatarFrame
                  avatarUrl={avatarUrl}
                  displayName={displayName}
                  frame={activeFrame.frameId}
                  frameColor={activeColor}
                  size="md"
                  alwaysShowFrame
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" style={{ color: activeColor }} />
                  <span className="truncate">
                    {activeFrame.frameLabel} ({activeFrame.minutes}m) · cualquier color:
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {CUSTOM_FRAME_COLORS.slice(0, 7).map((sw) => (
                    <button
                      key={sw.hex}
                      type="button"
                      title={sw.label}
                      aria-label={sw.label}
                      onClick={() => setSelectedColor(sw.hex)}
                      className="btn-raw w-5 h-5 rounded-full border transition-transform hover:scale-110"
                      style={{
                        backgroundColor: sw.hex,
                        borderColor:
                          activeColor.toLowerCase() === sw.hex.toLowerCase()
                            ? 'var(--text-main)'
                            : 'rgba(255,255,255,0.7)',
                        transform:
                          activeColor.toLowerCase() === sw.hex.toLowerCase()
                            ? 'scale(1.15)'
                            : undefined,
                      }}
                    />
                  ))}
                  <label
                    title="Elegir cualquier color"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold cursor-pointer"
                    style={{ borderColor: 'var(--divider-color)' }}
                  >
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-4 h-4 rounded border-0 p-0 bg-transparent cursor-pointer"
                    />
                    <span>Otro</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            Guardar en mi colección
          </button>
          {activeFrame && (
            <button
              type="button"
              onClick={() => {
                onEquipFrame(activeFrame.frameId, activeColor);
                onDismiss();
              }}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: '#1C1B1F',
              }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Equipar {frames.length > 1 ? 'este marco' : 'marco único'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
