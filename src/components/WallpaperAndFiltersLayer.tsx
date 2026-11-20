import React, { Suspense, lazy, useEffect, useRef } from 'react';
import type {
  ScreenOverlayFilterId,
  WallpaperFilterId,
  WallpaperMotionId,
} from '../types/music';

const RainyWindowWebGL = lazy(() =>
  import('./RainyWindowWebGL').then((m) => ({ default: m.RainyWindowWebGL }))
);

interface BackgroundWallpaperLayerProps {
  wallpaperUrl?: string;
  opacity?: number;
  filterId?: WallpaperFilterId;
  motionId?: WallpaperMotionId;
}

const FLOWER_ITEMS = [
  { left: '6%', delay: '0s', dur: '16s', size: 22, color: '#F7B7CF' },
  { left: '16%', delay: '-5s', dur: '19s', size: 18, color: '#FDE2EC' },
  { left: '28%', delay: '-9s', dur: '15s', size: 24, color: '#F4A6C1' },
  { left: '42%', delay: '-3s', dur: '21s', size: 20, color: '#FBD3E2' },
  { left: '56%', delay: '-11s', dur: '17s', size: 25, color: '#F7B7CF' },
  { left: '69%', delay: '-6s', dur: '20s', size: 19, color: '#FFF0F5' },
  { left: '81%', delay: '-14s', dur: '16s', size: 23, color: '#F4A6C1' },
  { left: '92%', delay: '-2s', dur: '18s', size: 21, color: '#FDE2EC' },
];

const LEAF_ITEMS = [
  { left: '8%', delay: '-1s', dur: '14s', size: 22, color: '#9BD27E' },
  { left: '21%', delay: '-6s', dur: '17s', size: 26, color: '#79B473' },
  { left: '35%', delay: '-10s', dur: '15s', size: 20, color: '#C5DF9B' },
  { left: '49%', delay: '-4s', dur: '18s', size: 24, color: '#E2A76F' },
  { left: '63%', delay: '-9s', dur: '16s', size: 22, color: '#88C480' },
  { left: '77%', delay: '-2s', dur: '19s', size: 25, color: '#D49A6A' },
  { left: '90%', delay: '-7s', dur: '15s', size: 20, color: '#A3D58E' },
];

const CHAIN_ITEMS = [
  { left: '4%', len: 160, dur: '6.5s', delay: '0s', charm: 'heart' as const },
  { left: '11%', len: 115, dur: '5.5s', delay: '-2s', charm: 'star' as const },
  { left: '22%', len: 88, dur: '7.2s', delay: '-1s', charm: 'bead' as const },
  { left: '78%', len: 95, dur: '6.8s', delay: '-3s', charm: 'bead' as const },
  { left: '88%', len: 135, dur: '5.8s', delay: '-1.5s', charm: 'star' as const },
  { left: '95%', len: 175, dur: '6.2s', delay: '-2.6s', charm: 'heart' as const },
];

const SPARKLE_ITEMS = [
  { left: '10%', top: '18%', delay: '0s', dur: '4.5s', size: 16 },
  { left: '24%', top: '66%', delay: '-1.8s', dur: '5.2s', size: 14 },
  { left: '38%', top: '32%', delay: '-0.9s', dur: '3.9s', size: 18 },
  { left: '54%', top: '78%', delay: '-2.5s', dur: '4.8s', size: 15 },
  { left: '68%', top: '24%', delay: '-3.1s', dur: '4.2s', size: 19 },
  { left: '82%', top: '54%', delay: '-1.2s', dur: '5.4s', size: 15 },
  { left: '91%', top: '84%', delay: '-2.2s', dur: '4.6s', size: 17 },
  { left: '15%', top: '86%', delay: '-3.6s', dur: '5.0s', size: 14 },
];

const BUTTERFLY_ITEMS = [
  { top: '18%', delay: '0s', dur: '19s', size: 26, color: '#F4A6C1' },
  { top: '38%', delay: '-6s', dur: '23s', size: 22, color: '#B5D9F8' },
  { top: '58%', delay: '-12s', dur: '21s', size: 24, color: '#D3B5F8' },
  { top: '76%', delay: '-4s', dur: '25s', size: 20, color: '#BCE6B5' },
];

const DROP_ITEMS = [
  { left: '9%', delay: '0s', dur: '4.2s', h: 24 },
  { left: '18%', delay: '-1.5s', dur: '3.7s', h: 30 },
  { left: '29%', delay: '-2.8s', dur: '4.5s', h: 20 },
  { left: '41%', delay: '-0.9s', dur: '3.9s', h: 28 },
  { left: '53%', delay: '-2.1s', dur: '4.4s', h: 22 },
  { left: '66%', delay: '-3.2s', dur: '3.6s', h: 32 },
  { left: '78%', delay: '-1.1s', dur: '4.1s', h: 26 },
  { left: '89%', delay: '-2.4s', dur: '3.8s', h: 24 },
];

function getWallpaperCssFilter(filterId: WallpaperFilterId): string {
  if (filterId === 'blur_soft') {
    return 'blur(9px) brightness(1.02)';
  }
  return 'none';
}

export const BackgroundWallpaperLayer: React.FC<BackgroundWallpaperLayerProps> = ({
  wallpaperUrl,
  opacity = 85,
  filterId = 'none',
  motionId = 'none',
}) => {
  const hasWallpaper = Boolean(wallpaperUrl);
  const hasMotion = motionId !== 'none';
  if (!hasWallpaper && !hasMotion) return null;

  const imgOpacity = Math.max(0.2, Math.min(1, opacity / 100));
  const cssFilter = getWallpaperCssFilter(filterId);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Custom Background Wallpaper Photo + Optical Filter */}
      {hasWallpaper && (
        <div className="absolute inset-0">
          <img
            src={wallpaperUrl}
            alt=""
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              opacity: imgOpacity,
              filter: cssFilter,
              transform: filterId === 'blur_soft' ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        </div>
      )}

      {/* Animated Background Accessories & Nature Effects (Behind all UI cards) */}
      {motionId === 'flowers' && (
        <div className="absolute inset-0 overflow-hidden">
          {FLOWER_ITEMS.map((fl, i) => (
            <div
              key={i}
              className="absolute -top-10 bg-motion-fall"
              style={{
                left: fl.left,
                animationDuration: fl.dur,
                animationDelay: fl.delay,
              }}
            >
              <svg width={fl.size} height={fl.size} viewBox="0 0 24 24" className="opacity-85">
                {[0, 72, 144, 216, 288].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="12"
                    cy="6"
                    rx="3.4"
                    ry="5.2"
                    fill={fl.color}
                    transform={`rotate(${deg} 12 12)`}
                  />
                ))}
                <circle cx="12" cy="12" r="2.6" fill="#FFE699" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {motionId === 'leaves' && (
        <div className="absolute inset-0 overflow-hidden">
          {LEAF_ITEMS.map((lf, i) => (
            <div
              key={i}
              className="absolute -top-10 bg-motion-fall"
              style={{
                left: lf.left,
                animationDuration: lf.dur,
                animationDelay: lf.delay,
              }}
            >
              <svg width={lf.size} height={lf.size} viewBox="0 0 24 24" className="opacity-85">
                <path
                  d="M12 2C7 6.5 5 12 8.5 17.5C10 19.8 11.4 21 12 22C12.6 21 14 19.8 15.5 17.5C19 12 17 6.5 12 2Z"
                  fill={lf.color}
                />
                <path
                  d="M12 5V21M12 10L9 8.2M12 13.5L15.2 11.4"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {motionId === 'chains' && (
        <div className="absolute inset-x-0 top-0 h-64 overflow-hidden">
          {CHAIN_ITEMS.map((ch, i) => (
            <div
              key={i}
              className="absolute top-0 bg-motion-pendulum"
              style={{
                left: ch.left,
                animationDuration: ch.dur,
                animationDelay: ch.delay,
              }}
            >
              <svg width="24" height={ch.len + 26} viewBox={`0 0 24 ${ch.len + 26}`} className="opacity-80 drop-shadow-sm">
                {Array.from({ length: Math.floor(ch.len / 12) }).map((_, linkIdx) => (
                  <ellipse
                    key={linkIdx}
                    cx="12"
                    cy={6 + linkIdx * 12}
                    rx={linkIdx % 2 === 0 ? 2.4 : 1.5}
                    ry="5.2"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.4"
                  />
                ))}
                {ch.charm === 'heart' && (
                  <path
                    d={`M12 ${ch.len + 18}C9 ${ch.len + 15} 5 ${ch.len + 11} 5 ${ch.len + 7.5}C5 ${ch.len + 5.2} 6.8 ${ch.len + 3.5} 9 ${ch.len + 3.5}C10.4 ${ch.len + 3.5} 11.5 ${ch.len + 4.3} 12 ${ch.len + 5.5}C12.5 ${ch.len + 4.3} 13.6 ${ch.len + 3.5} 15 ${ch.len + 3.5}C17.2 ${ch.len + 3.5} 19 ${ch.len + 5.2} 19 ${ch.len + 7.5}C19 ${ch.len + 11} 15 ${ch.len + 15} 12 ${ch.len + 18}Z`}
                    fill="rgba(255,245,250,0.9)"
                    stroke="rgba(210,190,205,0.85)"
                    strokeWidth="1"
                  />
                )}
                {ch.charm === 'star' && (
                  <path
                    d={`M12 ${ch.len + 2}L14 ${ch.len + 8}L20 ${ch.len + 10}L14 ${ch.len + 12}L12 ${ch.len + 18}L10 ${ch.len + 12}L4 ${ch.len + 10}L10 ${ch.len + 8}Z`}
                    fill="rgba(255,248,220,0.92)"
                    stroke="rgba(218,195,140,0.85)"
                    strokeWidth="0.9"
                  />
                )}
                {ch.charm === 'bead' && (
                  <circle
                    cx="12"
                    cy={ch.len + 8}
                    r="4.5"
                    fill="rgba(255,255,255,0.92)"
                    stroke="rgba(210,210,220,0.9)"
                    strokeWidth="1"
                  />
                )}
              </svg>
            </div>
          ))}
        </div>
      )}

      {motionId === 'rain_drops' && (
        <div className="absolute inset-0 overflow-hidden">
          {DROP_ITEMS.map((dr, i) => (
            <div
              key={i}
              className="absolute -top-12 bg-motion-rain"
              style={{
                left: dr.left,
                animationDuration: dr.dur,
                animationDelay: dr.delay,
              }}
            >
              <div
                className="w-[2px] rounded-full"
                style={{
                  height: `${dr.h}px`,
                  background:
                    'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.68))',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {motionId === 'sparkles' && (
        <div className="absolute inset-0 overflow-hidden">
          {SPARKLE_ITEMS.map((sp, i) => (
            <div
              key={i}
              className="absolute bg-motion-sparkle"
              style={{
                left: sp.left,
                top: sp.top,
                animationDuration: sp.dur,
                animationDelay: sp.delay,
              }}
            >
              <svg width={sp.size} height={sp.size} viewBox="0 0 24 24">
                <path
                  d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5Z"
                  fill="rgba(255,250,220,0.92)"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {motionId === 'butterflies' && (
        <div className="absolute inset-0 overflow-hidden">
          {BUTTERFLY_ITEMS.map((bf, i) => (
            <div
              key={i}
              className="absolute -left-10 bg-motion-glide"
              style={{
                top: bf.top,
                animationDuration: bf.dur,
                animationDelay: bf.delay,
              }}
            >
              <svg width={bf.size} height={bf.size} viewBox="0 0 24 24" className="opacity-80">
                <path
                  d="M12 12C9 7 4 6 4 10.5C4 13.5 8.5 14.5 12 13C15.5 14.5 20 13.5 20 10.5C20 6 15 7 12 12Z"
                  fill={bf.color}
                />
                <path
                  d="M12 13C9.5 14.5 6 17.5 8 19.5C10 21 11.5 18 12 14.5C12.5 18 14 21 16 19.5C18 17.5 14.5 14.5 12 13Z"
                  fill={bf.color}
                  opacity="0.85"
                />
                <path d="M12 8V18" stroke="rgba(60,40,60,0.5)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {motionId === 'ribbons' && (
        <div className="absolute inset-0 overflow-hidden">
          {FLOWER_ITEMS.map((rb, i) => (
            <div
              key={i}
              className="absolute -top-10 bg-motion-fall"
              style={{
                left: rb.left,
                animationDuration: rb.dur,
                animationDelay: rb.delay,
              }}
            >
              <svg width={rb.size + 4} height={rb.size + 4} viewBox="0 0 28 28" className="opacity-80">
                <path
                  d="M14 14C9 9 4 11 5 15C6 19 11 16 14 14ZM14 14C19 9 24 11 23 15C22 19 17 16 14 14Z"
                  fill={rb.color}
                />
                <path
                  d="M13 15L9 23M15 15L19 23"
                  stroke={rb.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ScreenOverlayFilterLayerProps {
  filterId?: ScreenOverlayFilterId;
  intensity?: number;
}

const CANVAS_FILTERS = new Set<ScreenOverlayFilterId>([
  'crystal_drops_tilt',
  'fluid_bottom_water',
  'water_ripples',
  'soap_bubbles',
  'liquid_mercury',
  'gold_dust',
  'snow_crystal',
]);

interface StaticDrop {
  nx: number;
  ny: number;
  r: number;
  squish: number;
}

interface SlidingDrop {
  x: number;
  y: number;
  r: number;
  speed: number;
  wobblePhase: number;
  trailLen: number;
}

interface FloatingBubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  hue: number;
}

interface RippleWave {
  nx: number;
  ny: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

function drawCrystalWaterDroplet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  squish = 1.12
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, squish);

  // Subtle neutral cast shadow beneath crystal droplet so it pops cleanly on light & dark surfaces
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
  ctx.fill();

  // Colorless crystal-clear glass refractive body (zero blue tint)
  const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.08, 0, 0, r);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.36)');
  grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.03)');
  grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.16)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.54)');
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Crisp neutral lower rim refraction + upper crystal highlight rim
  ctx.beginPath();
  ctx.arc(0, 0, r, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = 'rgba(18, 18, 22, 0.26)';
  ctx.lineWidth = Math.max(0.9, r * 0.14);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.94, 1.05 * Math.PI, 1.95 * Math.PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.lineWidth = Math.max(0.8, r * 0.12);
  ctx.stroke();

  // Brilliant top-left specular glint dot
  ctx.beginPath();
  ctx.arc(-r * 0.34, -r * 0.34, Math.max(1.2, r * 0.24), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.fill();

  // Secondary inner bottom-right caustic crescent glint
  ctx.beginPath();
  ctx.arc(r * 0.26, r * 0.3, Math.max(0.8, r * 0.14), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.84)';
  ctx.fill();

  ctx.restore();
}

const InteractiveFluidOverlayCanvas: React.FC<{
  filterId: ScreenOverlayFilterId;
  strength: number;
}> = ({ filterId, strength }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    // Smooth tilt / motion / pointer state (frame-rate independent, no abrupt spikes)
    let rawTiltX = 0;
    let rawTiltY = 0;
    let pointerTiltX = 0;
    let pointerTiltY = 0;
    let lastPointerMs = 0;
    let hasOrientation = false;
    let lastOrientationMs = 0;
    let curTiltX = 0;
    let curTiltY = 0;
    let sloshAngle = 0;
    let sloshVelocity = 0;
    let wavePhase = 0;
    let smoothEnergy = 0;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (typeof e.gamma === 'number' || typeof e.beta === 'number') {
        hasOrientation = true;
        lastOrientationMs = performance.now();
      }
      if (typeof e.gamma === 'number') {
        const nextX = Math.max(-1, Math.min(1, e.gamma / 50));
        rawTiltX = rawTiltX * 0.72 + nextX * 0.28;
      }
      if (typeof e.beta === 'number') {
        const nextY = Math.max(-1, Math.min(1, (e.beta - 38) / 48));
        rawTiltY = rawTiltY * 0.72 + nextY * 0.28;
      }
    };

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      // Only act as a heavily smoothed fallback when orientation events aren't active
      if (hasOrientation && performance.now() - lastOrientationMs < 500) return;
      const acc = e.accelerationIncludingGravity;
      if (acc && typeof acc.x === 'number') {
        const gX = Math.max(-1, Math.min(1, -acc.x / 9.8));
        rawTiltX = rawTiltX * 0.88 + gX * 0.12;
      }
      if (acc && typeof acc.y === 'number') {
        const gY = Math.max(-1, Math.min(1, (acc.y - 6.2) / 9.8));
        rawTiltY = rawTiltY * 0.88 + gY * 0.12;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // On touch devices with orientation sensors, avoid jerking the water on taps/scrolls
      if (e.pointerType === 'touch' && hasOrientation) return;
      const nx = (e.clientX / Math.max(1, width) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, height) - 0.5) * 2;
      const targetPX = Math.max(-0.45, Math.min(0.45, nx * 0.42));
      const targetPY = Math.max(-0.35, Math.min(0.35, ny * 0.32));
      pointerTiltX = pointerTiltX * 0.8 + targetPX * 0.2;
      pointerTiltY = pointerTiltY * 0.8 + targetPY * 0.2;
      lastPointerMs = performance.now();
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleDeviceMotion);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Seed procedural particle sets
    const staticDrops: StaticDrop[] = Array.from({ length: 34 }, (_, i) => ({
      nx: ((i * 73 + 19) % 97) / 100 + 0.015,
      ny: ((i * 41 + 13) % 88) / 100 + 0.02,
      r: 2.2 + ((i * 17) % 10) * 0.48,
      squish: 1.04 + ((i * 7) % 5) * 0.04,
    }));

    const slidingDrops: SlidingDrop[] = Array.from({ length: 14 }, (_, i) => ({
      x: ((i * 79 + 11) % 94) / 100,
      y: -((i * 23) % 100) / 100,
      r: 4.4 + (i % 4) * 1.45,
      speed: 0.075 + (i % 5) * 0.028,
      wobblePhase: i * 1.37,
      trailLen: 48 + (i % 4) * 24,
    }));

    const bubbles: FloatingBubble[] = Array.from({ length: 18 }, (_, i) => ({
      x: ((i * 61 + 17) % 94) / 100 + 0.03,
      y: ((i * 37 + 9) % 100) / 100,
      r: 10 + (i % 5) * 7,
      vy: 0.038 + (i % 4) * 0.015,
      phase: i * 1.1,
      hue: (i * 43) % 360,
    }));

    const poolBubbles = Array.from({ length: 16 }, (_, i) => ({
      nx: ((i * 53 + 7) % 96) / 100 + 0.02,
      offset: (i * 0.19) % 1,
      r: 1.8 + (i % 4) * 1.1,
      speed: 0.12 + (i % 3) * 0.06,
    }));

    const ripples: RippleWave[] = Array.from({ length: 6 }, (_, i) => ({
      nx: ((i * 47 + 21) % 80) / 100 + 0.1,
      ny: ((i * 63 + 17) % 72) / 100 + 0.14,
      radius: i * 48,
      maxRadius: 210 + (i % 3) * 55,
      speed: 38 + (i % 3) * 10,
    }));

    const dustMotes = Array.from({ length: 36 }, (_, i) => ({
      nx: ((i * 67 + 11) % 98) / 100 + 0.01,
      ny: ((i * 43 + 7) % 98) / 100 + 0.01,
      r: 1.4 + (i % 4) * 1.15,
      speed: 0.016 + (i % 5) * 0.008,
      phase: i * 0.9,
    }));

    let lastTime = performance.now();

    const drawFluidBottomPool = (dt: number) => {
      // Softly damped liquid pendulum with gentle inertia (zero abrupt impulse spikes)
      const targetAngle = curTiltX * 0.25;
      const springForce = (targetAngle - sloshAngle) * 5.6 - sloshVelocity * 4.2;
      sloshVelocity = Math.max(-0.85, Math.min(0.85, sloshVelocity + springForce * dt));
      sloshAngle = Math.max(-0.34, Math.min(0.34, sloshAngle + sloshVelocity * dt));

      // Continuous traveling phase & smoothly modulated surface swell
      const targetEnergy = Math.min(1, Math.abs(sloshVelocity) * 1.45);
      smoothEnergy += (targetEnergy - smoothEnergy) * (1 - Math.exp(-3.0 * dt));
      wavePhase += dt * (1.25 + smoothEnergy * 1.15);

      const basePoolHeight = Math.max(76, height * (0.132 + curTiltY * 0.046));
      const baseSurfaceY = height - basePoolHeight;
      const tiltSpanY = -Math.tan(sloshAngle) * (width * 0.48);

      const segments = 36;
      const pts: Array<{ x: number; y: number }> = [];
      const innerPts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const x = u * width;
        const linearY = baseSurfaceY + (u - 0.5) * 2 * tiltSpanY;
        const wave1 =
          Math.sin(u * Math.PI * 2.4 + wavePhase) * (4.2 + smoothEnergy * 5.8);
        const wave2 =
          Math.cos(u * Math.PI * 4.1 - wavePhase * 0.72) * (2.2 + smoothEnergy * 2.4);
        const wave3 = Math.sin(u * Math.PI * 6.8 + wavePhase * 1.32) * 0.9;
        const y = Math.max(height * 0.58, Math.min(height - 18, linearY + wave1 + wave2 + wave3));
        pts.push({ x, y });

        const innerY = Math.min(
          height - 4,
          y + 11 + Math.sin(u * Math.PI * 3.2 - wavePhase * 0.85) * 3.4
        );
        innerPts.push({ x, y: innerY });
      }

      ctx.save();
      // Main clear crystal water body
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) * 0.5;
        const yc = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineTo(width, height);
      ctx.closePath();

      const waterGrad = ctx.createLinearGradient(0, baseSurfaceY - 24, 0, height);
      waterGrad.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
      waterGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.06)');
      waterGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.12)');
      waterGrad.addColorStop(1, 'rgba(255, 255, 255, 0.22)');
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Smooth deeper internal shimmer layer (smooth quadratic curve)
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(innerPts[0].x, innerPts[0].y);
      for (let i = 0; i < innerPts.length - 1; i++) {
        const xc = (innerPts[i].x + innerPts[i + 1].x) * 0.5;
        const yc = (innerPts[i].y + innerPts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(innerPts[i].x, innerPts[i].y, xc, yc);
      }
      ctx.lineTo(innerPts[innerPts.length - 1].x, innerPts[innerPts.length - 1].y);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.11)';
      ctx.fill();

      // Crisp colorless crystal specular surface meniscus line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) * 0.5;
        const yc = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 3.4;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.72)';
      ctx.shadowBlur = 7;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Tiny sparkling bubbles rising smoothly inside the bottom crystal pool
      const tSec = wavePhase * 0.7;
      for (const pb of poolBubbles) {
        const frac = (pb.offset + tSec * pb.speed) % 1;
        const bx = ((pb.nx + curTiltX * 0.1 * (1 - frac) + 1) % 1) * width;
        const segFloat = Math.min(segments, Math.max(0, (bx / Math.max(1, width)) * segments));
        const idx0 = Math.floor(segFloat);
        const idx1 = Math.min(segments, idx0 + 1);
        const segBlend = segFloat - idx0;
        const surfaceAtX = pts[idx0].y * (1 - segBlend) + pts[idx1].y * segBlend;
        const depth = Math.max(12, height - surfaceAtX);
        const by = height - frac * (depth - 6);
        drawCrystalWaterDroplet(ctx, bx, by, pb.r, 1);
      }
      ctx.restore();
    };

    const drawDropletsAndRain = (dt: number, denseAndBig: boolean) => {
      // Neutral subtle clear glass edge refraction
      const glassRim = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.34,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      glassRim.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glassRim.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
      ctx.fillStyle = glassRim;
      ctx.fillRect(0, 0, width, height);

      // Crisp static clinging crystal droplets
      for (const sd of staticDrops) {
        const r = denseAndBig ? sd.r * 1.28 : sd.r;
        drawCrystalWaterDroplet(ctx, sd.nx * width, sd.ny * height, r, sd.squish);
      }

      // Sliding water drops with curved wet trails reacting to phone tilt!
      for (const dr of slidingDrops) {
        dr.y += dr.speed * dt;
        dr.x += curTiltX * 0.14 * dt + Math.sin(dr.y * 12 + dr.wobblePhase) * 0.014 * dt;
        if (dr.x < 0.02) dr.x += 0.96;
        if (dr.x > 0.98) dr.x -= 0.96;
        if (dr.y > 1.08) {
          dr.y = -0.06;
        }

        const px = dr.x * width;
        const py = dr.y * height;
        const trailTiltDx = -curTiltX * 26;

        // Clear wet crystal trail behind drop
        const trailGrad = ctx.createLinearGradient(
          px + trailTiltDx,
          py - dr.trailLen,
          px,
          py
        );
        trailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        trailGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.34)');
        trailGrad.addColorStop(1, 'rgba(255, 255, 255, 0.78)');
        ctx.beginPath();
        ctx.moveTo(px + trailTiltDx, py - dr.trailLen);
        ctx.quadraticCurveTo(
          px + trailTiltDx * 0.35,
          py - dr.trailLen * 0.45,
          px,
          py - dr.r * 0.4
        );
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = Math.max(1.4, dr.r * 0.32);
        ctx.lineCap = 'round';
        ctx.stroke();

        // Main sliding crystal droplet head
        drawCrystalWaterDroplet(ctx, px, py, denseAndBig ? dr.r * 1.2 : dr.r, 1.18);
      }
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const tSec = now / 1000;

      // Gently decay pointer bias when idle so resting phone tilt stays undisturbed
      if (now - lastPointerMs > 1200) {
        const decay = Math.exp(-1.1 * dt);
        pointerTiltX *= decay;
        pointerTiltY *= decay;
      }

      // Frame-rate-independent silky exponential smoothing
      const desiredTiltX = Math.max(-1, Math.min(1, rawTiltX + pointerTiltX));
      const desiredTiltY = Math.max(-1, Math.min(1, rawTiltY + pointerTiltY));
      const tiltFollow = 1 - Math.exp(-3.1 * dt);
      curTiltX += (desiredTiltX - curTiltX) * tiltFollow;
      curTiltY += (desiredTiltY - curTiltY) * tiltFollow;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = strength;

      if (filterId === 'fluid_bottom_water') {
        drawFluidBottomPool(dt);
      } else if (filterId === 'crystal_drops_tilt') {
        drawDropletsAndRain(dt, true);
        drawFluidBottomPool(dt);
      } else if (filterId === 'water_ripples') {
        // Concentric interactive water ripples reacting to tilt
        for (const rp of ripples) {
          rp.radius += rp.speed * dt;
          if (rp.radius > rp.maxRadius) {
            rp.radius = 4;
          }
          const cx = (rp.nx + curTiltX * 0.06) * width;
          const cy = (rp.ny + curTiltY * 0.06) * height;
          const fade = 1 - rp.radius / rp.maxRadius;

          for (let ring = 0; ring < 2; ring++) {
            const rr = rp.radius - ring * 22;
            if (rr <= 2) continue;
            ctx.beginPath();
            ctx.arc(cx, cy, rr, 0, Math.PI * 2);
            if (ring === 0) {
              ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * fade})`;
              ctx.lineWidth = 3.2;
              ctx.stroke();
            }
            ctx.strokeStyle =
              ring === 0
                ? `rgba(255, 255, 255, ${0.62 * fade})`
                : `rgba(255, 255, 255, ${0.38 * fade})`;
            ctx.lineWidth = ring === 0 ? 1.8 : 1.2;
            ctx.stroke();
          }
        }
      } else if (filterId === 'soap_bubbles') {
        for (const b of bubbles) {
          b.y -= b.vy * dt;
          b.x += curTiltX * 0.04 * dt + Math.sin(tSec * 1.4 + b.phase) * 0.015 * dt;
          if (b.y < -0.1) {
            b.y = 1.1;
          }
          const bx = ((b.x + 1) % 1) * width;
          const by = b.y * height;

          const grad = ctx.createRadialGradient(-b.r * 0.25 + bx, -b.r * 0.25 + by, b.r * 0.1, bx, by, b.r);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
          grad.addColorStop(0.75, `hsla(${(b.hue + tSec * 30) % 360}, 85%, 78%, 0.18)`);
          grad.addColorStop(0.95, `hsla(${(b.hue + 90 + tSec * 30) % 360}, 90%, 82%, 0.55)`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.72)');

          ctx.beginPath();
          ctx.arc(bx, by, b.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(bx - b.r * 0.36, by - b.r * 0.36, Math.max(1.5, b.r * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        }
      } else if (filterId === 'liquid_mercury') {
        for (let i = 0; i < 10; i++) {
          const cx =
            ((Math.sin(tSec * (0.28 + i * 0.04) + i * 1.7) * 0.42 + 0.5 + curTiltX * 0.08) *
              width);
          const cy =
            ((Math.cos(tSec * (0.22 + i * 0.03) + i * 2.1) * 0.42 + 0.5 + curTiltY * 0.08) *
              height);
          const rad = 11 + (i % 4) * 5.5;
          drawCrystalWaterDroplet(ctx, cx, cy, rad, 1.04);
        }
      } else if (filterId === 'gold_dust') {
        for (const dm of dustMotes) {
          dm.ny -= dm.speed * dt;
          if (dm.ny < -0.02) dm.ny = 1.02;
          const x = (dm.nx + Math.sin(tSec * 1.2 + dm.phase) * 0.02 + curTiltX * 0.04) * width;
          const y = dm.ny * height;
          const pulse = 0.45 + 0.55 * Math.sin(tSec * 2.5 + dm.phase);
          ctx.beginPath();
          ctx.arc(x, y, dm.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 228, 152, ${0.75 * pulse})`;
          ctx.shadowColor = 'rgba(255, 215, 115, 0.8)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (filterId === 'snow_crystal') {
        for (const dm of dustMotes) {
          dm.ny += (dm.speed * 1.45) * dt;
          if (dm.ny > 1.03) dm.ny = -0.03;
          const x = (dm.nx + Math.sin(tSec * 1.4 + dm.phase) * 0.025 + curTiltX * 0.06) * width;
          const y = dm.ny * height;
          ctx.beginPath();
          ctx.arc(x, y, dm.r * 1.15, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.78)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [filterId, strength]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[75] pointer-events-none select-none"
      aria-hidden="true"
    />
  );
};

export const ScreenOverlayFilterLayer: React.FC<ScreenOverlayFilterLayerProps> = ({
  filterId = 'none',
  intensity = 65,
}) => {
  if (!filterId || filterId === 'none') return null;

  const strength = Math.max(0.15, Math.min(1, intensity / 100));

  if (filterId === 'rainy_window') {
    return (
      <Suspense fallback={null}>
        <RainyWindowWebGL strength={strength} />
      </Suspense>
    );
  }

  if (CANVAS_FILTERS.has(filterId)) {
    return <InteractiveFluidOverlayCanvas filterId={filterId} strength={strength} />;
  }

  return (
    <div
      className="fixed inset-0 z-[75] pointer-events-none overflow-hidden select-none"
      style={{ opacity: strength }}
      aria-hidden="true"
    >
      {/* Clear Plastic Bag / Cellophane Sleeve */}
      {filterId === 'plastic_bag' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(124deg, transparent 14%, rgba(255,255,255,0.46) 16.5%, rgba(255,255,255,0.06) 19%, transparent 25%),
                linear-gradient(38deg, transparent 28%, rgba(255,255,255,0.36) 30%, rgba(255,255,255,0.04) 32%, transparent 38%),
                linear-gradient(148deg, transparent 54%, rgba(255,255,255,0.40) 55.6%, rgba(255,255,255,0.05) 57.5%, transparent 62%),
                linear-gradient(72deg, transparent 68%, rgba(255,255,255,0.30) 69.5%, rgba(255,255,255,0.03) 71.5%, transparent 76%),
                radial-gradient(ellipse 65% 45% at 15% 15%, rgba(255,255,255,0.24), transparent 70%),
                radial-gradient(ellipse 55% 40% at 85% 82%, rgba(255,255,255,0.22), transparent 72%)
              `,
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="bagGlossA" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="48%" stopColor="rgba(255,255,255,0.52)" />
                <stop offset="52%" stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path d="M-20 180 Q 280 230 560 90 T 1040 240" stroke="url(#bagGlossA)" strokeWidth="14" fill="none" />
            <path d="M-20 620 Q 340 500 680 650 T 1040 480" stroke="url(#bagGlossA)" strokeWidth="11" fill="none" />
            <path d="M160 -20 Q 250 380 120 720 T 320 1040" stroke="url(#bagGlossA)" strokeWidth="9" fill="none" />
            <path d="M780 -20 Q 700 320 860 660 T 720 1040" stroke="url(#bagGlossA)" strokeWidth="10" fill="none" />
          </svg>
          <div
            className="absolute inset-1.5 rounded-2xl border"
            style={{
              borderColor: 'rgba(255,255,255,0.42)',
              boxShadow:
                'inset 0 0 32px rgba(255,255,255,0.24), inset 0 2px 10px rgba(255,255,255,0.38)',
            }}
          />
        </div>
      )}

      {/* Crushed Ice / Fractured Crystal Glass Facets */}
      {filterId === 'crushed_ice' && (
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full opacity-75"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 240,140 90,320 0,260" fill="rgba(225,246,255,0.24)" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
            <polygon points="1000,0 760,120 880,290 1000,220" fill="rgba(225,246,255,0.22)" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
            <polygon points="0,1000 190,820 340,940 240,1000" fill="rgba(225,246,255,0.24)" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
            <polygon points="1000,1000 810,830 710,950 860,1000" fill="rgba(225,246,255,0.24)" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
            <path d="M90 320 L210 380 M760 120 L690 210 M810 830 L740 760 M190 820 L260 750" stroke="rgba(255,255,255,0.62)" strokeWidth="1.2" />
          </svg>
          <div
            className="absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 65px rgba(215,244,255,0.42)',
            }}
          />
        </div>
      )}

      {/* Frosted Steamy Glass */}
      {filterId === 'frosted_glass' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 36%, rgba(245,250,255,0.48) 100%)',
            boxShadow: 'inset 0 0 85px rgba(255,255,255,0.52)',
          }}
        />
      )}

      {/* Swaying Translucent Silk / Tulle Veil */}
      {filterId === 'silk_veil' && (
        <div className="absolute -inset-12 bg-motion-sway">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 6px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 6px),
                radial-gradient(ellipse 50% 90% at 20% 40%, rgba(255,255,255,0.24), transparent 65%),
                radial-gradient(ellipse 45% 85% at 78% 60%, rgba(255,245,252,0.22), transparent 65%)
              `,
            }}
          />
        </div>
      )}

      {/* Iridescent CD Prism Sunlight */}
      {filterId === 'cd_prism' && (
        <div
          className="absolute -inset-8 bg-motion-sway"
          style={{
            backgroundImage:
              'linear-gradient(125deg, rgba(255,140,185,0.18) 0%, rgba(255,225,130,0.16) 18%, rgba(145,245,205,0.16) 34%, rgba(140,205,255,0.18) 52%, transparent 66%), radial-gradient(circle at 88% 12%, rgba(255,210,245,0.34), transparent 40%), radial-gradient(circle at 12% 88%, rgba(170,235,255,0.30), transparent 42%)',
          }}
        />
      )}

      {/* Vintage 35mm Film */}
      {filterId === 'vintage_film' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 8% 20%, rgba(255,168,92,0.24), transparent 44%), radial-gradient(circle at 50% 50%, transparent 56%, rgba(42,24,12,0.28) 100%)',
            boxShadow: 'inset 0 0 60px rgba(60,36,16,0.24)',
          }}
        />
      )}

      {/* Sakura Dew Glass */}
      {filterId === 'sakura_glass' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,220,235,0.20) 0%, transparent 45%, rgba(255,228,240,0.22) 100%)',
            }}
          />
          {FLOWER_ITEMS.slice(0, 5).map((fl, idx) => (
            <div
              key={idx}
              className="absolute -top-10 bg-motion-fall"
              style={{
                left: fl.left,
                animationDuration: fl.dur,
                animationDelay: fl.delay,
              }}
            >
              <svg width={fl.size} height={fl.size} viewBox="0 0 24 24" className="opacity-85">
                <ellipse cx="12" cy="12" rx="7" ry="4" transform="rotate(24 12 12)" fill={fl.color} />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Retro CRT Glass Scanlines */}
      {filterId === 'crt_scanlines' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0) 4px)',
            boxShadow: 'inset 0 0 70px rgba(0,0,0,0.24)',
          }}
        />
      )}
    </div>
  );
};
