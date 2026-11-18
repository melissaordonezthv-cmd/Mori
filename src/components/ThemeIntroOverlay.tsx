import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { SurfaceSwatch, TextSwatch } from '../constants/themes';

interface ThemeIntroOverlayProps {
  visible: boolean;
  bgSwatch: SurfaceSwatch;
  playerSwatch: SurfaceSwatch;
  textSwatch: TextSwatch;
  onComplete: () => void;
}

export const ThemeIntroOverlay: React.FC<ThemeIntroOverlayProps> = ({
  visible,
  bgSwatch,
  playerSwatch,
  textSwatch,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'gather' | 'part'>('gather');

  useEffect(() => {
    if (!visible) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPhase('gather');

    const partTimer = window.setTimeout(
      () => setPhase('part'),
      reduced ? 120 : 620
    );
    const doneTimer = window.setTimeout(
      () => onComplete(),
      reduced ? 380 : 1650
    );

    return () => {
      window.clearTimeout(partTimer);
      window.clearTimeout(doneTimer);
    };
  }, [visible, onComplete]);

  const isParting = phase === 'part';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="morinote-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: isParting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: isParting ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
          onClick={onComplete}
          aria-hidden="true"
          className={`fixed inset-0 z-[100] overflow-hidden flex items-center justify-center ${
            isParting ? 'pointer-events-none' : 'cursor-pointer'
          }`}
          style={{ backgroundColor: isParting ? 'transparent' : bgSwatch.bgApp }}
        >
          {/* Soft base veil that clears first so the app peeks through while manchas part */}
          <motion.div
            initial={{ opacity: 0.96 }}
            animate={{ opacity: isParting ? 0 : 0.96 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ backgroundColor: bgSwatch.bgApp }}
          />

          {/* Top-Left Organic Mancha */}
          <motion.div
            initial={{ x: '-4%', y: '-4%', scale: 1.05, rotate: -6, opacity: 0.95 }}
            animate={
              isParting
                ? { x: '-72%', y: '-68%', scale: 1.18, rotate: -22, opacity: 0 }
                : { x: '0%', y: '0%', scale: 1, rotate: 0, opacity: 0.95 }
            }
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-24 -left-24 w-[68vw] h-[68vw] max-w-[680px] max-h-[680px]"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
              <path
                fill={playerSwatch.accent}
                fillOpacity={bgSwatch.isDark ? 0.78 : 0.88}
                d="M44.7,-65.4C58.8,-56.9,71.7,-45.6,78.1,-31.4C84.5,-17.1,84.4,-0.1,79.8,15.3C75.2,30.8,66.2,44.7,54.1,56.3C42,67.9,26.9,77.1,10.5,80.3C-5.9,83.5,-23.6,80.7,-38.8,72.5C-54,64.4,-66.7,51,-74.1,35.3C-81.6,19.6,-83.8,1.7,-79.5,-14.3C-75.2,-30.3,-64.4,-44.4,-51,-53.2C-37.6,-62,-21.7,-65.6,-5.8,-58.6C10,-51.6,30.6,-73.8,44.7,-65.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>

          {/* Top-Right Organic Mancha */}
          <motion.div
            initial={{ x: '5%', y: '-5%', scale: 1.05, rotate: 8, opacity: 0.92 }}
            animate={
              isParting
                ? { x: '76%', y: '-65%', scale: 1.18, rotate: 24, opacity: 0 }
                : { x: '0%', y: '0%', scale: 1, rotate: 0, opacity: 0.92 }
            }
            transition={{ duration: 0.98, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-20 -right-24 w-[66vw] h-[66vw] max-w-[660px] max-h-[660px]"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                fill={bgSwatch.swatchPreview}
                fillOpacity={bgSwatch.isDark ? 0.85 : 0.94}
                d="M41.3,-60.6C54.2,-52.7,65.7,-41.8,72.5,-28.3C79.2,-14.7,81.2,1.5,76.9,16.1C72.7,30.7,62.3,43.7,49.8,54.4C37.3,65.1,22.8,73.5,6.8,77.1C-9.3,80.7,-26.8,79.6,-41.4,71.4C-56,63.1,-67.7,47.8,-74.3,30.9C-81,14,-82.6,-4.4,-77.1,-20.7C-71.5,-36.9,-58.9,-51,-44.4,-58.5C-29.8,-66,-14.9,-67,0.2,-67.3C15.3,-67.6,28.4,-68.6,41.3,-60.6Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>

          {/* Bottom-Left Organic Mancha */}
          <motion.div
            initial={{ x: '-5%', y: '5%', scale: 1.04, rotate: 5, opacity: 0.92 }}
            animate={
              isParting
                ? { x: '-74%', y: '72%', scale: 1.15, rotate: -20, opacity: 0 }
                : { x: '0%', y: '0%', scale: 1, rotate: 0, opacity: 0.92 }
            }
            transition={{ duration: 1.02, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-24 -left-20 w-[68vw] h-[68vw] max-w-[680px] max-h-[680px]"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                fill={bgSwatch.bgSurface}
                fillOpacity={0.95}
                d="M47.6,-67.5C61.2,-59.8,71.6,-45.5,77.5,-29.7C83.3,-13.9,84.6,3.4,79.6,18.9C74.6,34.4,63.3,48.1,49.7,58.6C36.1,69.1,20.2,76.4,3.1,78.5C-14,80.5,-32.3,77.3,-46.8,67.7C-61.3,58.1,-72.1,42.1,-76.8,24.8C-81.5,7.5,-80.2,-11,-72.6,-26.5C-65.1,-42,-51.4,-54.4,-36.7,-61.9C-22,-69.4,-6.3,-72,8.9,-70.7C24.1,-69.4,34,-75.2,47.6,-67.5Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>

          {/* Bottom-Right Organic Mancha */}
          <motion.div
            initial={{ x: '4%', y: '5%', scale: 1.05, rotate: -6, opacity: 0.94 }}
            animate={
              isParting
                ? { x: '75%', y: '70%', scale: 1.16, rotate: 22, opacity: 0 }
                : { x: '0%', y: '0%', scale: 1, rotate: 0, opacity: 0.94 }
            }
            transition={{ duration: 0.96, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-24 -right-24 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px]"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                fill={playerSwatch.swatchPreview}
                fillOpacity={bgSwatch.isDark ? 0.72 : 0.9}
                d="M39.9,-59.8C52.9,-51.4,65.5,-41.7,72.9,-28.9C80.3,-16.1,82.5,-0.2,78.8,14.5C75.1,29.2,65.5,42.7,53.3,53.4C41.1,64.1,26.3,72,10.2,75.5C-5.9,79,-23.4,78.1,-38.2,70.4C-53,62.7,-65.1,48.2,-72.4,31.7C-79.7,15.2,-82.2,-3.2,-77,-19.8C-71.8,-36.4,-58.9,-51.1,-44.1,-59C-29.3,-66.9,-12.7,-68,1.5,-70.1C15.7,-72.2,26.9,-68.2,39.9,-59.8Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>

          {/* Center Soft Mist Blotch (splits smoothly) */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0.88 }}
            animate={
              isParting
                ? { scale: 1.45, opacity: 0 }
                : { scale: 1.04, opacity: 0.88 }
            }
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: playerSwatch.accent }}
          />

          {/* Center Brand Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={
              isParting
                ? { opacity: 0, scale: 1.06, y: -10 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center px-6 py-5 rounded-3xl backdrop-blur-md border shadow-sm"
            style={{
              backgroundColor: bgSwatch.isDark ? 'rgba(24, 25, 30, 0.65)' : 'rgba(255, 255, 255, 0.65)',
              borderColor: playerSwatch.accent,
              color: textSwatch.hex,
            }}
          >
            <div
              className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: playerSwatch.accent }}
            >
              <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none" aria-hidden="true">
                <path
                  d="M22 9v14.2a4.5 4.5 0 11-2.5-4V12l7-2v3.5L22 15z"
                  fill={bgSwatch.isDark ? '#FFFFFF' : '#1C1B1F'}
                />
              </svg>
            </div>
            <p className="text-xl font-extrabold tracking-tight font-display">
              MoriNote · 茉莉音
            </p>
            <p className="text-xs mt-1 opacity-75">
              Tono {bgSwatch.label} · {playerSwatch.label}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
