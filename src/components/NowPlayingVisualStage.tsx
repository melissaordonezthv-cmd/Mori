import React from 'react';
import { Camera } from 'lucide-react';
import type { NowPlayingVisualId } from '../types/music';

interface NowPlayingVisualStageProps {
  visualId: NowPlayingVisualId;
  colorMode: 'theme' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  stageAccentColor?: string;
  stageDetailColor?: string;
  hideCover?: boolean;
  coverUrl: string;
  trackTitle: string;
  trackArtist: string;
  isPlaying: boolean;
  moodSyncEnabled: boolean;
  activeAuraColor: string;
  compactSplit?: boolean;
  onChangeCoverClick: () => void;
  changeCoverLabel: string;
}

function pickContrastInk(hexOrCss: string): string {
  if (!hexOrCss.startsWith('#')) return '#1C1B1F';
  let hex = hexOrCss.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (hex.length !== 6) return '#1C1B1F';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.52 ? '#FAF8FB' : '#1C1B1F';
}

export const NowPlayingVisualStage: React.FC<NowPlayingVisualStageProps> = ({
  visualId,
  colorMode,
  primaryColor,
  secondaryColor,
  stageAccentColor = '#E5C185',
  stageDetailColor = '#2E2A36',
  hideCover = false,
  coverUrl,
  trackTitle,
  trackArtist,
  isPlaying,
  moodSyncEnabled,
  activeAuraColor,
  compactSplit = false,
  onChangeCoverClick,
  changeCoverLabel,
}) => {
  const isCustom = colorMode === 'custom';
  const mainCol = isCustom ? primaryColor : 'var(--accent-color)';
  const subCol = isCustom ? secondaryColor : 'var(--bg-elevated)';
  const accCol = isCustom ? stageAccentColor : 'var(--accent-color)';
  const detCol = isCustom ? stageDetailColor : 'var(--bg-surface)';

  const inkOnMain = isCustom ? pickContrastInk(primaryColor) : '#1C1B1F';
  const inkOnSub = isCustom ? pickContrastInk(secondaryColor) : 'var(--text-main)';
  const showCoverOnDisc = !hideCover && visualId !== 'vinyl_color_only';

  const boxSize = compactSplit
    ? 'w-44 h-44 sm:w-48 sm:h-48'
    : 'w-56 h-56 sm:w-60 sm:h-60';

  const spinCls = isPlaying ? 'vinyl-spin' : 'vinyl-spin-paused';

  const renderCameraAction = () => (
    <button
      type="button"
      onClick={onChangeCoverClick}
      title={changeCoverLabel}
      aria-label={changeCoverLabel}
      className="btn-raw absolute bottom-2 right-2 z-40 min-w-[36px] min-h-[36px] px-2.5 rounded-xl bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5 text-[11px] font-medium opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md"
    >
      <Camera className="w-3.5 h-3.5" />
      <span>Portada</span>
    </button>
  );

  // Shared 3D soft ground shadow under objects
  const stageFloorShadow = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[78%] h-4 rounded-full blur-md opacity-45"
      style={{ backgroundColor: isCustom ? stageDetailColor : 'rgba(15,15,24,0.45)' }}
    />
  );

  // 1. Estuche Portada 3D
  if (visualId === 'cover_classic') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '950px' }}>
        {moodSyncEnabled && (
          <div
            className="absolute -inset-3 rounded-[2rem] blur-xl opacity-55 transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: isCustom ? primaryColor : activeAuraColor,
              transform: isPlaying ? 'scale(1.04)' : 'scale(0.95)',
            }}
          />
        )}
        {stageFloorShadow}
        <div
          className="relative z-10 w-[92%] h-[92%] rounded-3xl overflow-hidden transition-transform duration-700"
          style={{
            backgroundColor: subCol,
            border: `2px solid ${accCol}`,
            transform: isPlaying
              ? 'rotateY(-6deg) rotateX(4deg) translateY(-2px)'
              : 'rotateY(-2deg) rotateX(1deg)',
            boxShadow: `6px 8px 0 ${detCol}, 0 20px 30px -10px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.75)`,
          }}
        >
          {/* Left Spine Ridge */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-3 z-20 opacity-85"
            style={{
              background: `linear-gradient(90deg, ${mainCol}, rgba(255,255,255,0.45) 55%, rgba(0,0,0,0.12))`,
            }}
          />
          {showCoverOnDisc ? (
            <img
              src={coverUrl}
              alt={trackTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-5 text-center"
              style={{
                background: `radial-gradient(circle at 30% 25%, ${subCol}, ${mainCol})`,
                color: inkOnMain,
              }}
            >
              <span
                className="w-12 h-12 rounded-full border-2 mb-2 flex items-center justify-center text-sm font-bold shadow"
                style={{ borderColor: accCol, backgroundColor: subCol, color: inkOnSub }}
              >
                ♪
              </span>
              <p className="text-xs font-extrabold truncate w-full">{trackTitle}</p>
              <p className="text-[10px] opacity-80 truncate w-full">{trackArtist}</p>
            </div>
          )}
          {/* Specular Glass Glaze Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                'linear-gradient(125deg, rgba(255,255,255,0.36) 0%, transparent 38%, transparent 72%, rgba(255,255,255,0.16) 100%)',
            }}
          />
          {renderCameraAction()}
        </div>
      </div>
    );
  }

  // 2. Vinilo Realista 3D / Solo Vinilo / Cristal / Gramofono 3D / Tocadiscos 3D
  if (
    visualId === 'vinyl_disc' ||
    visualId === 'vinyl_color_only' ||
    visualId === 'vinyl_transparent' ||
    visualId === 'gramophone_gold' ||
    visualId === 'turntable_arm'
  ) {
    const isTransparent = visualId === 'vinyl_transparent';
    const isGold = visualId === 'gramophone_gold';
    const isTurntable = visualId === 'turntable_arm';

    const discColor = isTransparent
      ? 'rgba(255,255,255,0.22)'
      : isGold && !isCustom
        ? '#1C1714'
        : mainCol;
    const metalColor = isGold && !isCustom ? '#E5BA64' : accCol;
    const plinthColor = isCustom ? stageDetailColor : 'var(--bg-surface)';
    const grooveColor = isTransparent ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.16)';

    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {moodSyncEnabled && (
          <div
            className="absolute -inset-3 rounded-full blur-xl opacity-45 pointer-events-none"
            style={{ backgroundColor: isCustom ? primaryColor : activeAuraColor }}
          />
        )}
        {stageFloorShadow}

        {/* 3D Layered Turntable or Gramophone Plinth */}
        {(isTurntable || isGold) && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[26px] border"
            style={{
              backgroundColor: plinthColor,
              borderColor: metalColor,
              boxShadow: `0 9px 0 ${isGold ? '#7C5A24' : 'rgba(0,0,0,0.24)'}, 0 22px 30px -10px rgba(0,0,0,0.34), inset 0 2px 4px rgba(255,255,255,0.35)`,
            }}
          >
            {/* Corner Brass/Metal Feet Pins */}
            {[
              'top-2 left-2',
              'top-2 right-2',
              'bottom-2 left-2',
              'bottom-2 right-2',
            ].map((pos) => (
              <span
                key={pos}
                className={`absolute ${pos} w-2.5 h-2.5 rounded-full shadow-inner`}
                style={{
                  background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${metalColor})`,
                }}
              />
            ))}
          </div>
        )}

        {/* Gramophone Acoustic 3D Horn */}
        {isGold && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 -right-2 z-30 w-20 h-20"
            style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.32))' }}
          >
            <svg viewBox="0 0 90 90" className="w-full h-full">
              <defs>
                <radialGradient id="hornGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFF7DF" />
                  <stop offset="45%" stopColor={metalColor} />
                  <stop offset="100%" stopColor="#7A5618" />
                </radialGradient>
              </defs>
              <path
                d="M78 14 C86 24 80 46 66 56 L46 64 C42 66 36 58 38 52 L48 30 C56 14 70 6 78 14 Z"
                fill="url(#hornGrad)"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
              />
              <ellipse cx="66" cy="33" rx="11" ry="18" transform="rotate(-36 66 33)" fill="rgba(40,24,10,0.42)" stroke="#FFF3D0" strokeWidth="1" />
              <path d="M40 58 L28 74" stroke={metalColor} strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Recessed Platter Ring beneath the Vinyl for true 3D thickness */}
        <div
          aria-hidden="true"
          className="absolute w-[90%] h-[90%] rounded-full"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.3), ${detCol})`,
            transform: 'translateY(4px)',
            boxShadow: '0 14px 24px rgba(0,0,0,0.35)',
          }}
        />

        {/* Spinning Realistic Vinyl Disc */}
        <div
          className={`relative z-10 w-[88%] h-[88%] rounded-full flex items-center justify-center border-2 ${spinCls}`}
          style={{
            backgroundColor: discColor,
            borderColor: metalColor,
            backdropFilter: isTransparent ? 'blur(8px)' : undefined,
            backgroundImage: isTransparent
              ? `conic-gradient(from 15deg, rgba(255,255,255,0.52), transparent 28%, ${mainCol}88 50%, transparent 72%, rgba(255,255,255,0.55))`
              : `repeating-radial-gradient(circle at center, transparent 0px, transparent 3.5px, ${grooveColor} 4.2px, transparent 5px), radial-gradient(circle at center, rgba(0,0,0,0.22) 22%, transparent 23%)`,
            boxShadow: isTransparent
              ? `inset 0 0 18px rgba(255,255,255,0.7), 0 8px 20px rgba(0,0,0,0.2)`
              : `inset 0 0 0 3px rgba(255,255,255,0.22), inset 0 0 22px rgba(0,0,0,0.36)`,
          }}
        >
          {/* Center Printed Record Label */}
          <div
            className="relative w-[40%] h-[40%] rounded-full overflow-hidden border-2 flex items-center justify-center"
            style={{
              backgroundColor: subCol,
              borderColor: metalColor,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 0 0 1.5px rgba(255,255,255,0.6)',
            }}
          >
            {showCoverOnDisc ? (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center px-2 leading-tight">
                <p
                  className="text-[7px] font-bold uppercase tracking-widest opacity-65"
                  style={{ color: inkOnSub }}
                >
                  HI-RES · 33⅓
                </p>
                <p
                  className="text-[9px] font-extrabold truncate mt-0.5"
                  style={{ color: inkOnSub }}
                >
                  {trackTitle.slice(0, 14)}
                </p>
                <p className="text-[7px] truncate opacity-75" style={{ color: inkOnSub }}>
                  {trackArtist.slice(0, 14)}
                </p>
              </div>
            )}
            {/* 3D Metallic Spindle Center */}
            <span
              aria-hidden="true"
              className="absolute w-4 h-4 rounded-full border"
              style={{
                background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${metalColor})`,
                borderColor: 'rgba(0,0,0,0.3)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.45)',
              }}
            />
          </div>
        </div>

        {/* Stationary Conical 3D Gloss Reflection (stays still while record grooves spin!) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 w-[88%] h-[88%] rounded-full"
          style={{
            background:
              'conic-gradient(from 32deg, rgba(255,255,255,0.28) 0deg, transparent 42deg, transparent 145deg, rgba(255,255,255,0.22) 195deg, transparent 235deg, transparent 360deg)',
          }}
        />

        {/* Articulated 3D Turntable Tonearm */}
        {isTurntable && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 right-2 z-30 origin-top-right transition-transform duration-700"
            style={{
              transform: isPlaying ? 'rotate(20deg)' : 'rotate(-6deg)',
              filter: 'drop-shadow(0 5px 6px rgba(0,0,0,0.34))',
            }}
          >
            {/* Gimbal Base & Counterweight */}
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${metalColor})`,
                borderColor: detCol,
              }}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-black/35 border border-white/50" />
            </div>
            {/* S-shaped Metallic Arm */}
            <div
              className="w-2 h-24 rounded-full mx-auto -mt-2"
              style={{
                background: `linear-gradient(90deg, ${metalColor}, #FFFFFF 45%, ${metalColor})`,
              }}
            />
            {/* Headshell Cartridge */}
            <div
              className="w-4 h-6 rounded-md mx-auto -mt-1 border flex items-end justify-center pb-0.5"
              style={{
                backgroundColor: mainCol,
                borderColor: metalColor,
              }}
            >
              <span className="w-2 h-1 rounded-full bg-white/80" />
            </div>
          </div>
        )}

        {renderCameraAction()}
      </div>
    );
  }

  // 3. Funda + Vinilo Saliendo 3D
  if (visualId === 'vinyl_gatefold_3d') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '950px' }}>
        {stageFloorShadow}
        {/* Spinning Vinyl Peeking Out Right */}
        <div
          className="absolute right-0 w-[68%] h-[68%] rounded-full flex items-center justify-center z-10"
          style={{ transform: 'translateX(6px)' }}
        >
          <div
            className={`w-full h-full rounded-full border-2 flex items-center justify-center shadow-xl ${spinCls}`}
            style={{
              backgroundColor: mainCol,
              borderColor: accCol,
              backgroundImage:
                'repeating-radial-gradient(circle at center, transparent 0px, transparent 3.5px, rgba(255,255,255,0.2) 4px, transparent 5px)',
            }}
          >
            <div
              className="w-[38%] h-[38%] rounded-full border-2 flex items-center justify-center"
              style={{ backgroundColor: subCol, borderColor: accCol }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: detCol }} />
            </div>
          </div>
        </div>

        {/* Left Collector Album Jacket in 3D */}
        <div
          className="relative z-20 mr-auto ml-1 w-[70%] h-[76%] rounded-2xl overflow-hidden border-2 transition-transform duration-500"
          style={{
            backgroundColor: subCol,
            borderColor: accCol,
            transform: 'rotateY(-8deg)',
            boxShadow: `-4px 6px 0 ${detCol}, 8px 14px 24px rgba(0,0,0,0.28)`,
          }}
        >
          {showCoverOnDisc ? (
            <img
              src={coverUrl}
              alt={trackTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full p-3 flex flex-col justify-between"
              style={{
                background: `linear-gradient(155deg, ${subCol}, ${mainCol})`,
                color: inkOnMain,
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                EDICIÓN ESPECIAL
              </span>
              <div>
                <p className="text-xs font-extrabold leading-tight line-clamp-2">{trackTitle}</p>
                <p className="text-[10px] opacity-80 truncate">{trackArtist}</p>
              </div>
            </div>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(130deg, rgba(255,255,255,0.35), transparent 45%)',
            }}
          />
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 4. CD Holográfico 3D
  if (visualId === 'cd_holographic') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="relative z-10 w-[88%] h-[88%] rounded-full p-1"
          style={{
            boxShadow: `0 8px 0 ${detCol}, 0 20px 30px rgba(0,0,0,0.25)`,
          }}
        >
          <div
            className={`w-full h-full rounded-full border-2 flex items-center justify-center relative ${spinCls}`}
            style={{
              borderColor: 'rgba(255,255,255,0.92)',
              background: `conic-gradient(from 0deg, ${mainCol}, #fbcfe8, #93c5fd, #a7f3d0, #fde68a, ${accCol}, ${subCol}, ${mainCol})`,
            }}
          >
            {/* Polycarbonate Clear Hub */}
            <div
              className="w-[38%] h-[38%] rounded-full border-4 overflow-hidden flex items-center justify-center shadow-inner"
              style={{
                backgroundColor: subCol,
                borderColor: accCol,
              }}
            >
              {showCoverOnDisc ? (
                <img
                  src={coverUrl}
                  alt={trackTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[9px] font-extrabold tracking-widest" style={{ color: inkOnSub }}>
                  CD
                </span>
              )}
              <span
                aria-hidden="true"
                className="absolute w-6 h-6 rounded-full border-2 backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.45)',
                  borderColor: accCol,
                }}
              />
            </div>
          </div>
          {/* Fixed Prismatic Sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(125deg, rgba(255,255,255,0.45) 0%, transparent 40%, rgba(255,255,255,0.2) 100%)',
            }}
          />
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 5. Estuche CD Cristal 3D (Jewel Case)
  if (visualId === 'jewel_case_3d') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="relative z-10 w-[94%] h-[86%] rounded-2xl border-2 p-2 flex gap-1.5 shadow-2xl"
          style={{
            backgroundColor: 'rgba(255,255,255,0.34)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255,255,255,0.88)',
            transform: isPlaying ? 'rotateY(-5deg) rotateX(3deg)' : 'none',
            boxShadow: `5px 7px 0 ${detCol}, 0 18px 28px rgba(0,0,0,0.26), inset 0 1px 0 #FFFFFF`,
          }}
        >
          {/* Left Ribbed Jewel Tray Spine */}
          <div
            className="w-5 h-full rounded-lg border flex flex-col justify-between py-2 px-0.5 shrink-0"
            style={{
              backgroundColor: mainCol,
              borderColor: accCol,
              backgroundImage:
                'repeating-linear-gradient(180deg, rgba(255,255,255,0.45) 0px, rgba(255,255,255,0.45) 2px, transparent 2px, transparent 5px)',
            }}
          />
          {/* Booklet / Cover Inside Clear Acrylic */}
          <div
            className="flex-1 h-full rounded-xl overflow-hidden border relative flex items-center justify-center"
            style={{ backgroundColor: subCol, borderColor: accCol }}
          >
            {showCoverOnDisc ? (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-3" style={{ color: inkOnSub }}>
                <p className="text-xs font-extrabold truncate">{trackTitle}</p>
                <p className="text-[10px] opacity-75 truncate">{trackArtist}</p>
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 45%, rgba(255,255,255,0.18) 100%)',
              }}
            />
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 6. Casete Retro 3D
  if (visualId === 'cassette_deck') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="w-full h-[78%] rounded-2xl border-2 p-3 flex flex-col justify-between relative overflow-hidden"
          style={{
            backgroundColor: mainCol,
            borderColor: accCol,
            backgroundImage: 'linear-gradient(175deg, rgba(255,255,255,0.32) 0%, transparent 45%, rgba(0,0,0,0.16) 100%)',
            boxShadow: `0 9px 0 ${detCol}, 0 20px 28px rgba(0,0,0,0.28), inset 0 2px 3px rgba(255,255,255,0.65)`,
          }}
        >
          {/* 4 Corner Metallic Screws */}
          {['top-1.5 left-1.5', 'top-1.5 right-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'].map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute ${pos} w-2 h-2 rounded-full border`}
              style={{ backgroundColor: accCol, borderColor: 'rgba(0,0,0,0.3)' }}
            />
          ))}

          {/* Sticker Label */}
          <div
            className="rounded-xl p-2 border flex items-center justify-between gap-2 shadow-sm"
            style={{
              backgroundColor: subCol,
              borderColor: accCol,
              color: inkOnSub,
            }}
          >
            {showCoverOnDisc && (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover shrink-0 border"
                style={{ borderColor: accCol }}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold truncate">{trackTitle}</p>
              <p className="text-[9px] font-mono-nums opacity-75 truncate">{trackArtist}</p>
            </div>
            <span
              className="text-[8px] font-mono-nums font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: accCol, color: pickContrastInk(accCol) }}
            >
              A·90
            </span>
          </div>

          {/* Recessed Acrylic Tape Window */}
          <div
            className="mx-3 h-12 rounded-xl border-2 flex items-center justify-around px-3 shadow-inner relative"
            style={{ backgroundColor: detCol, borderColor: accCol }}
          >
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center ${spinCls}`}
                style={{ borderColor: subCol }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accCol }} />
              </div>
            ))}
          </div>

          {/* Bottom Raised Bridge */}
          <div
            className="mx-9 h-3.5 rounded-t-lg border border-b-0 flex items-center justify-around px-3"
            style={{ backgroundColor: detCol, borderColor: accCol }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/75" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/75" />
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 7. Carrete de Cinta 3D (Reel to Reel)
  if (visualId === 'reel_to_reel') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="w-full h-[88%] rounded-3xl border-2 p-3 flex flex-col justify-between"
          style={{
            backgroundColor: subCol,
            borderColor: accCol,
            backgroundImage: 'linear-gradient(170deg, rgba(255,255,255,0.45) 0%, transparent 55%, rgba(0,0,0,0.08) 100%)',
            boxShadow: `0 9px 0 ${detCol}, 0 20px 30px rgba(0,0,0,0.26)`,
          }}
        >
          <div className="flex items-center justify-around pt-1">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center relative shadow-lg ${spinCls}`}
                style={{
                  backgroundColor: mainCol,
                  borderColor: accCol,
                  boxShadow: `0 4px 0 ${detCol}, inset 0 2px 6px rgba(255,255,255,0.55)`,
                }}
              >
                <span className="w-11 h-1.5 rounded-full bg-white/75 absolute" />
                <span className="w-11 h-1.5 rounded-full bg-white/75 absolute rotate-60" />
                <span className="w-11 h-1.5 rounded-full bg-white/75 absolute -rotate-60" />
                <span
                  className="w-5 h-5 rounded-full border-2 z-10 shadow"
                  style={{ backgroundColor: subCol, borderColor: accCol }}
                />
              </div>
            ))}
          </div>
          <div
            className="rounded-xl px-3 py-1.5 border flex items-center gap-2 shadow-inner"
            style={{ backgroundColor: detCol, borderColor: accCol, color: pickContrastInk(detCol) }}
          >
            {showCoverOnDisc && (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-md object-cover shrink-0 border"
                style={{ borderColor: accCol }}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold truncate">{trackTitle}</p>
              <p className="text-[9px] opacity-75 truncate">{trackArtist}</p>
            </div>
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 8. Reproductor Classic 3D (Pocket iPod)
  if (visualId === 'pocket_player') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="w-[74%] h-[96%] rounded-3xl border-2 p-2.5 flex flex-col justify-between items-center"
          style={{
            backgroundColor: mainCol,
            borderColor: accCol,
            backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.42) 0%, transparent 55%, rgba(0,0,0,0.12) 100%)',
            boxShadow: `5px 8px 0 ${detCol}, 0 20px 28px rgba(0,0,0,0.26), inset 0 2px 3px rgba(255,255,255,0.75)`,
          }}
        >
          {/* Glossy Recessed Display */}
          <div
            className="w-full h-[50%] rounded-xl overflow-hidden border-2 relative shadow-inner"
            style={{ backgroundColor: detCol, borderColor: accCol }}
          >
            {showCoverOnDisc ? (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
                style={{ backgroundColor: subCol, color: inkOnSub }}
              >
                <p className="text-[11px] font-bold truncate w-full">{trackTitle}</p>
                <p className="text-[9px] opacity-75 truncate w-full">{trackArtist}</p>
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.32), transparent 50%)',
              }}
            />
          </div>

          {/* 3D Raised Click Wheel */}
          <div
            className="w-[72px] h-[72px] rounded-full border-2 flex items-center justify-center relative"
            style={{
              backgroundColor: subCol,
              borderColor: accCol,
              color: inkOnSub,
              boxShadow: `0 4px 0 ${detCol}, inset 0 2px 4px rgba(255,255,255,0.7)`,
            }}
          >
            <span className="absolute top-1 text-[7px] font-bold opacity-60">MENU</span>
            <span className="absolute bottom-1 text-[7px] font-bold opacity-60">▶⏸</span>
            <span
              className="w-7 h-7 rounded-full border-2 shadow"
              style={{
                background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${mainCol})`,
                borderColor: accCol,
              }}
            />
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 9. Mini Estéreo Vintage 3D (Boombox)
  if (visualId === 'boombox_pastel_3d') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div className="w-full flex flex-col items-center">
          {/* Metallic Top Handle */}
          <div
            aria-hidden="true"
            className="w-[62%] h-5 rounded-t-2xl border-4 border-b-0 -mb-0.5 z-0"
            style={{ borderColor: accCol, backgroundColor: 'transparent' }}
          />
          <div
            className="relative z-10 w-full h-36 rounded-3xl border-2 p-2.5 flex items-center justify-between gap-2"
            style={{
              backgroundColor: mainCol,
              borderColor: accCol,
              boxShadow: `0 9px 0 ${detCol}, 0 18px 26px rgba(0,0,0,0.24), inset 0 2px 4px rgba(255,255,255,0.7)`,
            }}
          >
            {/* Left & Right 3D Speakers */}
            {[0, 1].map((side) => (
              <div
                key={side}
                className="w-12 h-24 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-inner"
                style={{ backgroundColor: detCol, borderColor: accCol }}
              >
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform`}
                  style={{
                    backgroundColor: subCol,
                    borderColor: accCol,
                    backgroundImage:
                      'radial-gradient(circle, rgba(0,0,0,0.18) 25%, transparent 28%)',
                  }}
                />
              </div>
            ))}
            {/* Center Deck Display */}
            <div
              className="flex-1 h-24 rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center p-1.5 text-center shadow-inner"
              style={{ backgroundColor: subCol, borderColor: accCol, color: inkOnSub }}
            >
              {showCoverOnDisc ? (
                <img
                  src={coverUrl}
                  alt={trackTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <p className="text-[10px] font-extrabold truncate w-full">{trackTitle}</p>
                  <p className="text-[8px] opacity-75 truncate w-full">{trackArtist}</p>
                </>
              )}
            </div>
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 10. Caja de Música 3D
  if (visualId === 'music_box') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        {/* Winding Brass Key on Side */}
        <div
          aria-hidden="true"
          className={`absolute -right-1 top-1/2 -translate-y-1/2 w-5 h-10 rounded-r-xl border-2 z-0 ${isPlaying ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: accCol, borderColor: detCol }}
        />
        <div
          className="relative z-10 w-[88%] h-[88%] rounded-3xl border-2 p-3 flex flex-col items-center justify-center gap-2"
          style={{
            backgroundColor: subCol,
            borderColor: accCol,
            boxShadow: `0 9px 0 ${detCol}, inset 0 3px 10px rgba(255,255,255,0.85), inset 0 -6px 14px ${mainCol}44`,
          }}
        >
          {/* Inner Velvet Recessed Dish */}
          <div
            className="w-28 h-28 rounded-full border-2 flex items-center justify-center shadow-inner"
            style={{ backgroundColor: detCol, borderColor: accCol }}
          >
            <div
              className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden shadow-lg ${spinCls}`}
              style={{ borderColor: accCol, backgroundColor: mainCol }}
            >
              {showCoverOnDisc ? (
                <img
                  src={coverUrl}
                  alt={trackTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="w-10 h-10 rounded-full border-4 flex items-center justify-center text-xs font-bold"
                  style={{ borderColor: accCol, color: inkOnMain }}
                >
                  ♪
                </span>
              )}
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-85" style={{ color: inkOnSub }}>
            {isPlaying ? 'Melodía activa' : 'En pausa'}
          </p>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 11. Polaroid 3D Flotante
  if (visualId === 'polaroid_float') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="w-[88%] h-[92%] p-3 pb-7 rounded-2xl border-2 transition-transform duration-500"
          style={{
            backgroundColor: subCol,
            borderColor: accCol,
            transform: isPlaying ? 'rotate(-3deg) rotateY(-4deg) translateY(-2px)' : 'rotate(-1deg)',
            boxShadow: `6px 8px 0 ${mainCol}, 10px 16px 26px rgba(0,0,0,0.24), inset 0 2px 0 rgba(255,255,255,0.9)`,
          }}
        >
          <div
            className="w-full h-full rounded-xl overflow-hidden border relative"
            style={{ borderColor: accCol, backgroundColor: detCol }}
          >
            {showCoverOnDisc ? (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: mainCol, color: inkOnMain }}
              >
                ♪
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(125deg, rgba(255,255,255,0.28), transparent 48%)',
              }}
            />
          </div>
          <p className="text-[11px] font-bold truncate text-center mt-1.5" style={{ color: inkOnSub }}>
            {trackTitle}
          </p>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 12. Relicario Corazón 3D
  if (visualId === 'heart_locket_3d') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="relative z-10 w-[86%] h-[86%] rounded-full border-4 flex items-center justify-center p-2.5"
          style={{
            backgroundColor: mainCol,
            borderColor: accCol,
            boxShadow: `0 9px 0 ${detCol}, 0 20px 28px rgba(0,0,0,0.28), inset 0 4px 8px rgba(255,255,255,0.75)`,
          }}
        >
          {/* Scalloped inner ring */}
          <div
            className="w-full h-full rounded-full border-2 border-dotted p-2 flex items-center justify-center relative"
            style={{ borderColor: subCol, backgroundColor: subCol }}
          >
            <div
              className="w-[76%] h-[76%] rounded-full overflow-hidden border-2 flex items-center justify-center shadow-inner"
              style={{ borderColor: accCol, backgroundColor: mainCol }}
            >
              {showCoverOnDisc ? (
                <img
                  src={coverUrl}
                  alt={trackTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 64 64" className="w-14 h-14">
                  <path
                    d="M32 54 C32 54 10 39 10 23 C10 15 16 10 23 10 C27.5 10 30.5 12.5 32 15.5 C33.5 12.5 36.5 10 41 10 C48 10 54 15 54 23 C54 39 32 54 32 54 Z"
                    fill={accCol}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                </svg>
              )}
            </div>
            {/* Top Clasp Pearl */}
            <span
              aria-hidden="true"
              className="absolute -top-3 w-5 h-5 rounded-full border-2 shadow"
              style={{
                background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${accCol})`,
                borderColor: detCol,
              }}
            />
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 13. Esfera de Cristal 3D (Snow Globe)
  if (visualId === 'snow_globe_3d') {
    return (
      <div className={`relative ${boxSize} flex flex-col items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        {/* Glass Sphere Dome */}
        <div
          className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 overflow-hidden flex items-center justify-center"
          style={{
            borderColor: 'rgba(255,255,255,0.9)',
            background: `radial-gradient(circle at 32% 24%, rgba(255,255,255,0.85), ${subCol} 42%, ${mainCol} 100%)`,
            boxShadow: `inset 0 -10px 20px ${mainCol}, inset 0 6px 14px rgba(255,255,255,0.9), 0 10px 24px rgba(0,0,0,0.22)`,
          }}
        >
          {showCoverOnDisc ? (
            <img
              src={coverUrl}
              alt={trackTitle}
              referrerPolicy="no-referrer"
              className={`w-[58%] h-[58%] rounded-full object-cover border-2 shadow-lg ${spinCls}`}
              style={{ borderColor: accCol }}
            />
          ) : (
            <div
              className="w-[56%] h-[56%] rounded-full border-2 flex items-center justify-center font-extrabold text-sm shadow-lg"
              style={{ backgroundColor: subCol, borderColor: accCol, color: inkOnSub }}
            >
              ♪
            </div>
          )}
          {/* Specular Glass Arc */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-3 left-5 w-10 h-5 rounded-full -rotate-30 bg-white/70 blur-[1px]"
          />
        </div>
        {/* Pedestal Base */}
        <div
          className="relative z-20 -mt-4 w-28 h-8 rounded-2xl border-2 flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: detCol,
            borderColor: accCol,
            color: pickContrastInk(detCol),
            boxShadow: `0 5px 0 rgba(0,0,0,0.28)`,
          }}
        >
          <span className="text-[9px] font-bold truncate px-2">{trackTitle}</span>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 14. Prisma Acrílico 3D
  if (visualId === 'prism_crystal_3d') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="relative z-10 w-[86%] h-[92%] rounded-3xl border-[3px] p-3 flex items-center justify-center"
          style={{
            borderColor: 'rgba(255,255,255,0.92)',
            background: `linear-gradient(145deg, rgba(255,255,255,0.72), ${subCol}cc 50%, ${mainCol}aa)`,
            boxShadow: `7px 9px 0 ${accCol}, 0 22px 30px rgba(0,0,0,0.25), inset 0 2px 6px #FFFFFF`,
          }}
        >
          {/* 4 Acrylic Stand-off Bolts */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute ${pos} w-2.5 h-2.5 rounded-full border`}
              style={{
                background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${accCol})`,
                borderColor: detCol,
              }}
            />
          ))}
          <div
            className="w-[78%] h-[78%] rounded-2xl overflow-hidden border-2 shadow-xl flex items-center justify-center"
            style={{ borderColor: accCol, backgroundColor: mainCol }}
          >
            {showCoverOnDisc ? (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-xs font-extrabold text-center px-2" style={{ color: inkOnMain }}>
                {trackTitle}
              </p>
            )}
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 15. Frasco Joya Musical 3D
  if (visualId === 'perfume_stage_3d') {
    return (
      <div className={`relative ${boxSize} flex flex-col items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        {/* Sculpted Faceted Cap */}
        <div
          className="w-12 h-8 rounded-t-2xl border-2 z-20 -mb-1"
          style={{
            background: `linear-gradient(135deg, #FFFFFF, ${accCol} 55%, ${detCol})`,
            borderColor: accCol,
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.85)',
          }}
        />
        {/* Neck Collar */}
        <div
          className="w-10 h-2.5 rounded-sm border z-20"
          style={{ backgroundColor: accCol, borderColor: detCol }}
        />
        {/* Faceted Glass Bottle Body */}
        <div
          className="relative z-10 w-36 h-32 sm:w-40 sm:h-36 rounded-[28px] border-2 p-3 flex items-center justify-center"
          style={{
            background: `linear-gradient(160deg, ${subCol}, ${mainCol})`,
            borderColor: 'rgba(255,255,255,0.85)',
            boxShadow: `0 8px 0 ${detCol}, 0 18px 28px rgba(0,0,0,0.24), inset 0 4px 10px rgba(255,255,255,0.85)`,
          }}
        >
          <div
            className="w-[74%] h-[78%] rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center shadow-inner"
            style={{ backgroundColor: subCol, borderColor: accCol, color: inkOnSub }}
          >
            {showCoverOnDisc ? (
              <img
                src={coverUrl}
                alt={trackTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-2 text-center">
                <p className="text-[10px] font-extrabold truncate w-full">{trackTitle}</p>
                <p className="text-[8px] opacity-75 truncate w-full">{trackArtist}</p>
              </div>
            )}
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 16. Espejo Compacto 3D
  if (visualId === 'sakura_mirror_3d') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        <div
          className="relative z-10 w-[86%] h-[86%] rounded-full border-4 p-2.5 flex items-center justify-center"
          style={{
            backgroundColor: mainCol,
            borderColor: accCol,
            boxShadow: `0 9px 0 ${detCol}, 0 20px 28px rgba(0,0,0,0.26), inset 0 3px 6px rgba(255,255,255,0.8)`,
          }}
        >
          <div
            className="w-full h-full rounded-full border-4 border-dashed p-1.5 flex items-center justify-center relative"
            style={{ borderColor: subCol, backgroundColor: subCol }}
          >
            <div
              className="w-[82%] h-[82%] rounded-full overflow-hidden border-2 flex items-center justify-center relative shadow-inner"
              style={{ borderColor: accCol, backgroundColor: detCol }}
            >
              {showCoverOnDisc ? (
                <img
                  src={coverUrl}
                  alt={trackTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-[10px] font-extrabold text-center px-2" style={{ color: pickContrastInk(detCol) }}>
                  {trackTitle}
                </p>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.42), transparent 46%)',
                }}
              />
            </div>
          </div>
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 17. Orbe Cristal 3D
  if (visualId === 'aura_orb') {
    return (
      <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
        {stageFloorShadow}
        {/* Orbital Ring in 3D perspective */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-[104%] h-[36%] rounded-full border-2 z-20"
          style={{
            borderColor: accCol,
            transform: isPlaying ? 'rotate(-16deg) scale(1.03)' : 'rotate(-12deg)',
            boxShadow: `0 0 12px ${accCol}`,
          }}
        />
        <div
          className={`relative z-10 w-[82%] h-[82%] rounded-full flex items-center justify-center transition-all duration-700 border-2 ${
            isPlaying ? 'scale-105' : 'scale-95'
          }`}
          style={{
            borderColor: 'rgba(255,255,255,0.85)',
            background: `radial-gradient(circle at 30% 25%, #FFFFFF 0%, ${subCol} 22%, ${mainCol} 75%, ${detCol} 100%)`,
            boxShadow: `0 0 32px ${mainCol}88, inset 0 -10px 18px rgba(0,0,0,0.22)`,
          }}
        >
          {showCoverOnDisc && (
            <img
              src={coverUrl}
              alt={trackTitle}
              referrerPolicy="no-referrer"
              className="w-[54%] h-[54%] rounded-full object-cover border-2 border-white/80 shadow-xl"
            />
          )}
        </div>
        {renderCameraAction()}
      </div>
    );
  }

  // 18. Consola EQ 3D & Ondas en Relieve 3D
  return (
    <div className={`relative ${boxSize} flex items-center justify-center group`} style={{ perspective: '900px' }}>
      {stageFloorShadow}
      <div
        className="w-full h-[90%] rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-3 overflow-hidden"
        style={{
          backgroundColor: subCol,
          borderColor: accCol,
          boxShadow: `0 8px 0 ${detCol}, 0 20px 28px rgba(0,0,0,0.22), inset 0 2px 6px rgba(255,255,255,0.8)`,
        }}
      >
        {showCoverOnDisc && (
          <img
            src={coverUrl}
            alt={trackTitle}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border-2 shadow-lg"
            style={{ borderColor: accCol }}
          />
        )}
        {visualId === 'equalizer_stage' ? (
          <div className="flex items-end justify-center gap-1.5 h-12">
            {[0.55, 0.92, 0.68, 1, 0.78, 0.95, 0.6].map((h, i) => (
              <span
                key={i}
                className={`w-3 rounded-full border ${isPlaying ? 'bar-anim-eq-bar' : ''}`}
                style={{
                  height: `${Math.round(h * 44)}px`,
                  background: `linear-gradient(180deg, ${accCol}, ${mainCol})`,
                  borderColor: 'rgba(255,255,255,0.65)',
                  boxShadow: `0 3px 0 ${detCol}`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center relative w-28 h-14">
            {[0, 1, 2].map((ring) => (
              <span
                key={ring}
                className={`absolute rounded-full border-[3px] ${isPlaying ? 'bar-thumb-pulse' : ''}`}
                style={{
                  width: `${34 + ring * 24}px`,
                  height: `${24 + ring * 16}px`,
                  borderColor: ring % 2 === 0 ? mainCol : accCol,
                  boxShadow: `0 2px 6px ${detCol}55`,
                  opacity: 0.92 - ring * 0.22,
                  animationDelay: `${ring * 0.25}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      {renderCameraAction()}
    </div>
  );
};
