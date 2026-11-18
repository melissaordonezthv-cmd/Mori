import React, { useEffect, useRef, useState } from 'react';
import { Crop, ImagePlus, RotateCcw, X } from 'lucide-react';
import type { Translations } from '../constants/i18n';
import type { AudioTrack } from '../types/music';
import { formatFileSize } from '../utils/audioMetadata';
import { ImageEditorModal } from './ImageEditorModal';

interface TrackEditModalProps {
  track: AudioTrack | null;
  t: Translations;
  onSave: (updated: AudioTrack) => void;
  onClose: () => void;
}

export const TrackEditModal: React.FC<TrackEditModalProps> = ({
  track,
  t,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(track?.title ?? '');
  const [artist, setArtist] = useState(track?.artist ?? '');
  const [album, setAlbum] = useState(track?.album ?? '');
  const [genre, setGenre] = useState(track?.genre ?? '');
  const [year, setYear] = useState(track?.year ?? '');
  const [trackNumber, setTrackNumber] = useState(track?.trackNumber ?? '');
  const [notes, setNotes] = useState(track?.notes ?? '');
  const [coverUrl, setCoverUrl] = useState(track?.coverUrl ?? '');
  const [pendingCover, setPendingCover] = useState<{ src: string; isBlob: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (pendingCover?.isBlob) {
        URL.revokeObjectURL(pendingCover.src);
      }
    };
  }, [pendingCover]);

  if (!track) return null;

  const closePendingCover = () => {
    setPendingCover((prev) => {
      if (prev?.isBlob) {
        URL.revokeObjectURL(prev.src);
      }
      return null;
    });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPendingCover({ src: objectUrl, isBlob: true });
    e.target.value = '';
  };

  const handleResetCover = () => {
    if (track.originalCoverUrl) {
      setCoverUrl(track.originalCoverUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...track,
      title: title.trim() || track.title,
      artist: artist.trim() || track.artist,
      album: album.trim() || track.album,
      genre: genre.trim() || undefined,
      year: year.trim() || undefined,
      trackNumber: trackNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      coverUrl: coverUrl || track.coverUrl,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.editTrack}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border space-y-5"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">{t.editTrack}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cover Picker from Gallery */}
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden border shrink-0"
            style={{
              borderColor: 'var(--divider-color)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <img
              src={coverUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <ImagePlus className="w-4 h-4" />
                <span>{t.changeCover}</span>
              </button>

              <button
                type="button"
                onClick={() => setPendingCover({ src: coverUrl, isBlob: false })}
                className="min-h-[42px] px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Ajustar</span>
              </button>

              {track.originalCoverUrl && coverUrl !== track.originalCoverUrl && (
                <button
                  type="button"
                  onClick={handleResetCover}
                  title="Restaurar portada original"
                  className="min-h-[42px] px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Original</span>
                </button>
              )}
            </div>

            <p className="text-xs font-mono-nums" style={{ color: 'var(--text-muted)' }}>
              {track.format}
              {track.bitDepth && track.sampleRate
                ? ` · ${track.bitDepth}-bit / ${(track.sampleRate / 1000).toFixed(1)} kHz`
                : ''}
              {` · ${formatFileSize(track.fileSize)}`}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium space-y-1.5">
            <span>Nombre de la canción</span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-[42px] px-3.5 rounded-xl border text-sm focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
                color: 'var(--text-main)',
              }}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium space-y-1.5">
              <span>Artista</span>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full min-h-[42px] px-3.5 rounded-xl border text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
            </label>

            <label className="block text-xs font-medium space-y-1.5">
              <span>Álbum</span>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full min-h-[42px] px-3.5 rounded-xl border text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="col-span-3 sm:col-span-1 block text-xs font-medium space-y-1.5">
              <span>Género</span>
              <input
                type="text"
                placeholder="Ej. Indie Pop"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl border text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
            </label>

            <label className="col-span-2 sm:col-span-1 block text-xs font-medium space-y-1.5">
              <span>Año</span>
              <input
                type="text"
                placeholder="2026"
                maxLength={6}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl border text-sm font-mono-nums focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
            </label>

            <label className="col-span-1 block text-xs font-medium space-y-1.5">
              <span>N.º pista</span>
              <input
                type="text"
                placeholder="01"
                maxLength={4}
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl border text-sm font-mono-nums focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                  color: 'var(--text-main)',
                }}
              />
            </label>
          </div>

          <label className="block text-xs font-medium space-y-1.5">
            <span>Nota o recuerdo personal</span>
            <input
              type="text"
              placeholder="Ej. Escuchada durante la lluvia de otoño…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[42px] px-3.5 rounded-xl border text-sm focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
                color: 'var(--text-main)',
              }}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-medium border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#1C1B1F',
            }}
          >
            {t.save}
          </button>
        </div>
      </form>

      <ImageEditorModal
        open={Boolean(pendingCover)}
        imageSrc={pendingCover?.src ?? null}
        aspect="square"
        title="Editar portada de canción"
        onCancel={closePendingCover}
        onApply={(editedUrl) => {
          setCoverUrl(editedUrl);
          closePendingCover();
        }}
      />
    </div>
  );
};
