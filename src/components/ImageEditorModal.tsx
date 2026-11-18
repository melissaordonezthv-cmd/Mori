import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  FlipHorizontal2,
  Move,
  RotateCcw,
  RotateCw,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface ImageEditorModalProps {
  open: boolean;
  imageSrc: string | null;
  aspect?: 'square' | 'wide';
  circularGuide?: boolean;
  title?: string;
  onCancel: () => void;
  onApply: (croppedDataUrl: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  open,
  imageSrc,
  aspect = 'square',
  circularGuide = false,
  title = 'Ajustar fotografía',
  onCancel,
  onApply,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const [imgReady, setImgReady] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [baseRotation, setBaseRotation] = useState(0); // multiples of 90
  const [fineRotation, setFineRotation] = useState(0); // -45 .. 45
  const [flipX, setFlipX] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const previewWidth = aspect === 'wide' ? 448 : 300;
  const previewHeight = aspect === 'wide' ? 252 : 300;
  const exportWidth = aspect === 'wide' ? 1280 : 720;
  const exportHeight = aspect === 'wide' ? 720 : 720;

  const resetTransforms = useCallback(() => {
    setZoom(1);
    setBaseRotation(0);
    setFineRotation(0);
    setFlipX(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open || !imageSrc) {
      setImgReady(false);
      setImgError(false);
      imgRef.current = null;
      return;
    }

    let cancelled = false;
    setImgReady(false);
    setImgError(false);
    resetTransforms();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img;
      setImgReady(true);
    };
    img.onerror = () => {
      if (cancelled) return;
      setImgError(true);
    };
    img.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [open, imageSrc, resetTransforms]);

  const drawScene = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      pixelMultiplier: number
    ) => {
      const img = imgRef.current;
      if (!img) return;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Soft warm neutral backdrop visible if user shrinks image < 100%
      ctx.fillStyle = '#F6F2F4';
      ctx.fillRect(0, 0, width, height);

      const totalDeg = baseRotation + fineRotation;
      const rad = (totalDeg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));

      // Calculate base scale so the image covers the target frame neatly at zoom = 1
      const rotatedW = img.naturalWidth * cos + img.naturalHeight * sin;
      const rotatedH = img.naturalWidth * sin + img.naturalHeight * cos;
      const coverScale = Math.max(width / rotatedW, height / rotatedH);
      const effectiveScale = coverScale * zoom;

      ctx.translate(
        width / 2 + offset.x * pixelMultiplier,
        height / 2 + offset.y * pixelMultiplier
      );
      ctx.rotate(rad);
      if (flipX) {
        ctx.scale(-1, 1);
      }
      ctx.scale(effectiveScale, effectiveScale);
      ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2,
        img.naturalWidth,
        img.naturalHeight
      );
      ctx.restore();
    },
    [baseRotation, fineRotation, flipX, offset.x, offset.y, zoom]
  );

  useEffect(() => {
    if (!open || !imgReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = previewWidth * dpr;
    canvas.height = previewHeight * dpr;
    drawScene(ctx, canvas.width, canvas.height, dpr);
  }, [open, imgReady, previewWidth, previewHeight, drawScene]);

  if (!open || !imageSrc) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragStateRef.current.dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = previewWidth / Math.max(rect.width, 1);
    const scaleY = previewHeight / Math.max(rect.height, 1);
    const dx = (e.clientX - dragStateRef.current.startX) * scaleX;
    const dy = (e.clientY - dragStateRef.current.startY) * scaleY;
    setOffset({
      x: dragStateRef.current.originX + dx,
      y: dragStateRef.current.originY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current.dragging) {
      dragStateRef.current.dragging = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  const handleApply = () => {
    if (!imgRef.current) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const ratio = exportWidth / previewWidth;
    drawScene(ctx, exportWidth, exportHeight, ratio);
    const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.9);
    onApply(dataUrl);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-2xl border space-y-4"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">{title}</h3>
            <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              <Move className="w-3.5 h-3.5" />
              <span>Arrastra la foto para moverla, ajusta el tamaño o gírala</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancelar edición"
            className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border shrink-0"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Preview */}
        <div className="flex justify-center">
          <div
            className="relative rounded-2xl overflow-hidden border shadow-inner select-none"
            style={{
              width: aspect === 'wide' ? '100%' : 'min(300px, 100%)',
              maxWidth: `${previewWidth}px`,
              aspectRatio: aspect === 'wide' ? '16 / 9' : '1 / 1',
              borderColor: 'var(--divider-color)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No se pudo cargar la imagen seleccionada. Prueba con otra fotografía.
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
              />
            )}

            {circularGuide && !imgError && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[88%] h-[88%] rounded-full border-2 border-dashed border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div
          className="p-4 rounded-2xl border space-y-3.5"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--divider-color)',
          }}
        >
          {/* Zoom / Resize */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Tamaño / Zoom</span>
              </span>
              <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                aria-label="Alejar foto"
                className="min-w-[36px] min-h-[36px] rounded-xl border flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min={0.4}
                max={3}
                step={0.02}
                aria-label="Tamaño de la foto"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-current cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
                aria-label="Acercar foto"
                className="min-w-[36px] min-h-[36px] rounded-xl border flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Fine Rotation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span>Inclinación suave</span>
              <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                {baseRotation + fineRotation}°
              </span>
            </div>
            <input
              type="range"
              min={-45}
              max={45}
              step={1}
              aria-label="Ángulo de rotación"
              value={fineRotation}
              onChange={(e) => setFineRotation(Number(e.target.value))}
              className="w-full accent-current cursor-pointer"
            />
          </div>

          {/* Quick Rotate 90, Flip & Reset */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setBaseRotation((r) => (r - 90) % 360)}
              className="min-h-[40px] px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-90°</span>
            </button>
            <button
              type="button"
              onClick={() => setBaseRotation((r) => (r + 90) % 360)}
              className="min-h-[40px] px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>+90°</span>
            </button>
            <button
              type="button"
              onClick={() => setFlipX((f) => !f)}
              className="min-h-[40px] px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95"
              style={{
                backgroundColor: flipX ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                borderColor: flipX ? 'var(--text-main)' : 'var(--divider-color)',
              }}
            >
              <FlipHorizontal2 className="w-3.5 h-3.5" />
              <span>Voltear</span>
            </button>
            <button
              type="button"
              onClick={resetTransforms}
              className="min-h-[40px] px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-medium border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!imgReady || imgError}
            onClick={handleApply}
            className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#1C1B1F',
            }}
          >
            <Check className="w-4 h-4" />
            <span>Aplicar foto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
