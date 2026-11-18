import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlaying: boolean;
  accentColor: string;
  tempoFeeling?: 'slow' | 'medium' | 'fast';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyserRef,
  isPlaying,
  accentColor,
  tempoFeeling = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let phase = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barCount = 32;
      const gap = 4;
      const barW = (w - gap * (barCount - 1)) / barCount;

      let freqData: Uint8Array<ArrayBuffer> | null = null;
      if (analyserRef.current && isPlaying) {
        freqData = new Uint8Array(new ArrayBuffer(analyserRef.current.frequencyBinCount));
        analyserRef.current.getByteFrequencyData(freqData);
      }

      const speedStep = tempoFeeling === 'fast' ? 0.09 : tempoFeeling === 'slow' ? 0.03 : 0.055;
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

    draw();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
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
};
