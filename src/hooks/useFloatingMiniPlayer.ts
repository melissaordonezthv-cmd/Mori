import { useCallback, useEffect, useRef, useState } from 'react';
import type { AudioTrack } from '../types/music';
import { formatDuration } from '../utils/audioMetadata';

interface FloatingPlayerOptions {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeLyric: string;
  accentColor: string;
  bgSurface: string;
  textColor: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (sec: number) => void;
  onToggleFavorite: (trackId: string) => void;
}

export function useFloatingMiniPlayer(options: FloatingPlayerOptions) {
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [floatingError, setFloatingError] = useState<string | null>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updateDocumentPiP = useCallback(() => {
    const win = pipWindowRef.current;
    if (!win || win.closed) return;
    const opts = optionsRef.current;
    const doc = win.document;

    doc.body.style.background = opts.bgSurface;
    doc.body.style.color = opts.textColor;

    const coverEl = doc.getElementById('pip-cover') as HTMLImageElement | null;
    const titleEl = doc.getElementById('pip-title');
    const artistEl = doc.getElementById('pip-artist');
    const lyricEl = doc.getElementById('pip-lyric');
    const timeEl = doc.getElementById('pip-time');
    const playBtn = doc.getElementById('pip-play');
    const favBtn = doc.getElementById('pip-fav');
    const barFill = doc.getElementById('pip-bar-fill');

    if (coverEl && opts.currentTrack?.coverUrl && coverEl.src !== opts.currentTrack.coverUrl) {
      coverEl.src = opts.currentTrack.coverUrl;
    }
    if (titleEl) titleEl.textContent = opts.currentTrack?.title ?? 'MoriNote';
    if (artistEl) artistEl.textContent = opts.currentTrack?.artist ?? 'Sin pista activa';
    if (lyricEl) lyricEl.textContent = opts.activeLyric || '♪ Reproduciendo sobre otras apps';
    if (timeEl) {
      timeEl.textContent = `${formatDuration(opts.currentTime)} / ${formatDuration(opts.duration)}`;
    }
    if (playBtn) {
      playBtn.textContent = opts.isPlaying ? '⏸' : '▶';
    }
    if (favBtn) {
      favBtn.textContent = opts.currentTrack?.isFavorite ? '♥' : '♡';
    }
    if (barFill) {
      const pct = opts.duration > 0 ? Math.min(100, (opts.currentTime / opts.duration) * 100) : 0;
      barFill.style.width = `${pct}%`;
      barFill.style.background = opts.accentColor;
    }
  }, []);

  useEffect(() => {
    if (isFloatingOpen && pipWindowRef.current) {
      updateDocumentPiP();
    }
  }, [
    isFloatingOpen,
    options.currentTrack,
    options.isPlaying,
    options.currentTime,
    options.duration,
    options.activeLyric,
    options.bgSurface,
    options.textColor,
    options.accentColor,
    updateDocumentPiP,
  ]);

  const closeFloating = useCallback(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
      pipWindowRef.current = null;
    }
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsFloatingOpen(false);
  }, []);

  const openFloating = useCallback(async () => {
    setFloatingError(null);

    if (isFloatingOpen) {
      closeFloating();
      return;
    }

    const docPiP = (
      window as unknown as {
        documentPictureInPicture?: {
          requestWindow: (opts: { width: number; height: number }) => Promise<Window>;
        };
      }
    ).documentPictureInPicture;

    // 1. Document Picture-in-Picture API (interactive controls floating over all apps)
    if (docPiP) {
      try {
        const pipWin = await docPiP.requestWindow({ width: 350, height: 235 });
        pipWindowRef.current = pipWin;
        const opts = optionsRef.current;

        pipWin.document.head.innerHTML = `
          <title>MoriNote · Reproductor Flotante</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
            body { padding: 14px; display: flex; flex-direction: column; justify-content: space-between; height: 100vh; overflow: hidden; transition: background 0.3s, color 0.3s; }
            .row { display: flex; align-items: center; gap: 12px; }
            img { width: 58px; height: 58px; border-radius: 14px; object-fit: cover; flex-shrink: 0; }
            .meta { min-width: 0; flex: 1; }
            .title { font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .artist { font-size: 12px; opacity: 0.72; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
            .lyric { font-size: 12px; opacity: 0.88; line-height: 1.35; max-height: 34px; overflow: hidden; margin: 8px 0; font-style: italic; }
            .bar { height: 6px; width: 100%; border-radius: 99px; background: rgba(128,128,128,0.22); overflow: hidden; cursor: pointer; }
            .fill { height: 100%; width: 0%; transition: width 0.2s linear; }
            .controls { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
            .btns { display: flex; align-items: center; gap: 8px; }
            button { border: none; background: rgba(128,128,128,0.14); color: inherit; width: 34px; height: 34px; border-radius: 99px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
            button:hover { background: rgba(128,128,128,0.25); }
            .time { font-size: 11px; opacity: 0.72; font-variant-numeric: tabular-nums; }
          </style>
        `;

        pipWin.document.body.innerHTML = `
          <div class="row">
            <img id="pip-cover" src="${opts.currentTrack?.coverUrl ?? ''}" alt="cover" />
            <div class="meta">
              <div id="pip-title" class="title"></div>
              <div id="pip-artist" class="artist"></div>
            </div>
            <button id="pip-fav" title="Favorito">♡</button>
          </div>
          <div id="pip-lyric" class="lyric"></div>
          <div>
            <div id="pip-bar" class="bar" title="Buscar posición"><div id="pip-bar-fill" class="fill"></div></div>
            <div class="controls">
              <span id="pip-time" class="time">0:00 / 0:00</span>
              <div class="btns">
                <button id="pip-prev" title="Anterior">⏮</button>
                <button id="pip-play" title="Reproducir/Pausar">▶</button>
                <button id="pip-next" title="Siguiente">⏭</button>
              </div>
            </div>
          </div>
        `;

        pipWin.document.getElementById('pip-play')?.addEventListener('click', () => optionsRef.current.onTogglePlay());
        pipWin.document.getElementById('pip-prev')?.addEventListener('click', () => optionsRef.current.onPrev());
        pipWin.document.getElementById('pip-next')?.addEventListener('click', () => optionsRef.current.onNext());
        pipWin.document.getElementById('pip-fav')?.addEventListener('click', () => {
          const id = optionsRef.current.currentTrack?.id;
          if (id) optionsRef.current.onToggleFavorite(id);
        });
        pipWin.document.getElementById('pip-bar')?.addEventListener('click', (ev) => {
          const bar = ev.currentTarget as HTMLElement;
          const rect = bar.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
          optionsRef.current.onSeek(ratio * (optionsRef.current.duration || 0));
        });

        pipWin.addEventListener('pagehide', () => {
          pipWindowRef.current = null;
          setIsFloatingOpen(false);
        });

        setIsFloatingOpen(true);
        updateDocumentPiP();
        return;
      } catch {
        // Fallback to Canvas Video Picture-in-Picture below
      }
    }

    // 2. Fallback: Canvas-streamed Video Picture-in-Picture
    try {
      if (!canvasRef.current) {
        const c = document.createElement('canvas');
        c.width = 480;
        c.height = 270;
        canvasRef.current = c;
      }
      if (!videoRef.current) {
        const v = document.createElement('video');
        v.muted = true;
        v.playsInline = true;
        v.style.position = 'fixed';
        v.style.opacity = '0';
        v.style.pointerEvents = 'none';
        v.style.width = '1px';
        v.style.height = '1px';
        document.body.appendChild(v);
        videoRef.current = v;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;
      if (!ctx || !video.requestPictureInPicture) {
        setIsWidgetOpen(true);
        setFloatingError(
          'Activamos el mini-reproductor flotante aquí; para flotar sobre otras apps del sistema abre la app en su propia pestaña o instálala como PWA.'
        );
        return;
      }

      let loadedCoverSrc = '';
      const coverImg = new Image();
      coverImg.crossOrigin = 'anonymous';

      const drawFrame = () => {
        const opts = optionsRef.current;
        if (opts.currentTrack?.coverUrl && loadedCoverSrc !== opts.currentTrack.coverUrl) {
          loadedCoverSrc = opts.currentTrack.coverUrl;
          coverImg.src = loadedCoverSrc;
        }

        ctx.fillStyle = opts.bgSurface;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (coverImg.complete && coverImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(28, 45, 140, 140, 20);
          ctx.clip();
          ctx.drawImage(coverImg, 28, 45, 140, 140);
          ctx.restore();
        }

        ctx.fillStyle = opts.textColor;
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText((opts.currentTrack?.title ?? 'MoriNote').slice(0, 24), 190, 86);
        ctx.globalAlpha = 0.72;
        ctx.font = '16px sans-serif';
        ctx.fillText((opts.currentTrack?.artist ?? 'Sin pista').slice(0, 28), 190, 114);
        ctx.globalAlpha = 0.9;
        ctx.font = 'italic 15px sans-serif';
        ctx.fillText((opts.activeLyric || '♪ Audio sin pérdida').slice(0, 32), 190, 152);
        ctx.globalAlpha = 1;

        ctx.fillStyle = 'rgba(128,128,128,0.22)';
        ctx.beginPath();
        ctx.roundRect(28, 214, 424, 8, 4);
        ctx.fill();

        const pct = opts.duration > 0 ? Math.min(1, opts.currentTime / opts.duration) : 0;
        ctx.fillStyle = opts.accentColor;
        ctx.beginPath();
        ctx.roundRect(28, 214, Math.max(8, 424 * pct), 8, 4);
        ctx.fill();

        ctx.fillStyle = opts.textColor;
        ctx.font = '13px monospace';
        ctx.fillText(
          `${formatDuration(opts.currentTime)} / ${formatDuration(opts.duration)}  ·  ${
            opts.isPlaying ? 'Reproduciendo' : 'Pausado'
          }`,
          28,
          246
        );

        animFrameRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();
      const stream = canvas.captureStream(12);
      video.srcObject = stream;
      await video.play();
      await video.requestPictureInPicture();
      setIsFloatingOpen(true);

      video.addEventListener(
        'leavepictureinpicture',
        () => {
          setIsFloatingOpen(false);
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
        },
        { once: true }
      );
    } catch {
      setIsWidgetOpen(true);
      setFloatingError(
        'Activamos el mini-reproductor flotante en pantalla; para flotar sobre otras apps del sistema abre la app fuera del marco previo o instálala como PWA.'
      );
    }
  }, [closeFloating, isFloatingOpen, updateDocumentPiP]);

  useEffect(() => {
    return () => closeFloating();
  }, [closeFloating]);

  return {
    isFloatingOpen,
    isWidgetOpen,
    setIsWidgetOpen,
    floatingError,
    openFloating,
    closeFloating,
  };
}
