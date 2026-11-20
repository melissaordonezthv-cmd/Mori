import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlaying: boolean;
  accentColor: string;
  tempoFeeling?: 'slow' | 'medium' | 'fast';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = React.memo(({
  analyserRef,
  isPlaying,
  accentColor,
  tempoFeeling = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const freqBufRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let phase = 0;
    let lastDrawTime = 0;
    let disposed = false;

    const draw = (now: number) => {
      if (disposed) return;

      if (isPlaying && !prefersReducedMotion && document.hidden) {
        return;
      }

      if (isPlaying && !prefersReducedMotion && lastDrawTime > 0 && now - lastDrawTime < 32) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = now;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barCount = 32;
      const gap = 4;
      const barW = (w - gap * (barCount - 1)) / barCount;

      let freqData: Uint8Array<ArrayBuffer> | null = null;
      const analyser = analyserRef.current;
      if (analyser && isPlaying) {
        const binCount = analyser.frequencyBinCount;
        if (!freqBufRef.current || freqBufRef.current.length !== binCount) {
          freqBufRef.current = new Uint8Array(new ArrayBuffer(binCount));
        }
        freqData = freqBufRef.current;
        analyser.getByteFrequencyData(freqData);
      }

      const speedStep = tempoFeeling === 'fast' ? 0.14 : tempoFeeling === 'slow' ? 0.05 : 0.09;
      if (isPlaying && !prefersReducedMotion) phase += speedStep;

      ctx.fillStyle = accentColor;

      for (let i = 0; i < barCount; i++) {
        let amplitude = 0.14;
        if (freqData && freqData.length > 0) {
          const binIdx = Math.min(freqData.length - 1, Math.floor((i / barCount) * (freqData.length * 0.75)));
          amplitude = Math.max(0.12, freqData[binIdx] / 255);
        } else if (isPlaying && !prefersReducedMotion) {
          amplitude = 0.22 + 0.18 * Math.abs(Math.sin(phase + i * 0.45));
        }

        const barH = Math.max(4, amplitude * (h - 6));
        const x = i * (barW + gap);
        const y = h - barH;

        ctx.globalAlpha = 0.35 + amplitude * 0.55;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, barW / 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (isPlaying && !prefersReducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && isPlaying && !prefersReducedMotion && !disposed) {
        lastDrawTime = 0;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    rafId = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [analyserRef, isPlaying, accentColor, tempoFeeling]);

  return (
    <canvas
      ref={canvasRef}
      width={384}
      height={44}
      className="w-full h-11 block"
      aria-hidden="true"
    />
  );
});

