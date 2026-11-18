import React, { useEffect, useRef, useState } from 'react';
import { Check, Crop, ImagePlus, X } from 'lucide-react';
import type { Translations } from '../constants/i18n';
import { DEFAULT_COVER_CLOUD } from '../constants/themes';
import type { AudioTrack, Playlist } from '../types/music';
import { ImageEditorModal } from './ImageEditorModal';

interface PlaylistModalProps {
  open: boolean;
  playlist: Playlist | null;
  tracks: AudioTrack[];
  t: Translations;
  onSave: (playlist: Playlist) => void;
  onClose: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  open,
  playlist,
  tracks,
  t,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(playlist?.name ?? '');
  const [description, setDescription] = useState(playlist?.description ?? '');
  const [coverUrl, setCoverUrl] = useState(playlist?.coverUrl ?? DEFAULT_COVER_CLOUD);
  const [selectedIds, setSelectedIds] = useState<string[]>(playlist?.trackIds ?? []);
  const [pendingCover, setPendingCover] = useState<{ src: string; isBlob: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (pendingCover?.isBlob) {
        URL.revokeObjectURL(pendingCover.src);
      }
    };
  }, [pendingCover]);

  if (!open) return null;

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

  const toggleTrack = (trackId: string) => {
    setSelectedIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    const result: Playlist = {
      id: playlist?.id ?? crypto.randomUUID(),
      name: name.trim() || 'Mi Lista Pastel',
      description: description.trim() || 'Lista personalizada',
      coverUrl: coverUrl || DEFAULT_COVER_CLOUD,
      trackIds: selectedIds,
      createdAt: playlist?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(result);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={playlist ? t.renamePlaylist : t.newPlaylist}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border space-y-5"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">
            {playlist ? t.renamePlaylist : t.newPlaylist}
          </h2>
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

        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden border shrink-0"
            style={{
              borderColor: 'var(--divider-color)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <img
              src={coverUrl}
              alt={name || 'Portada'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border"
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
              className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Ajustar</span>
            </button>
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
            <span>Nombre de la lista</span>
            <input
              type="text"
              required
              placeholder="Ej. Noches de lluvia en FLAC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[42px] px-3.5 rounded-xl border text-sm focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
                color: 'var(--text-main)',
              }}
            />
          </label>

          <label className="block text-xs font-medium space-y-1.5">
            <span>Descripción corta</span>
            <input
              type="text"
              placeholder="Opcional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[42px] px-3.5 rounded-xl border text-sm focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
                color: 'var(--text-main)',
              }}
            />
          </label>
        </div>

        {tracks.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-medium">
                Seleccionar canciones ({selectedIds.length} / {tracks.length})
              </p>
              <button
                type="button"
                onClick={() =>
                  setSelectedIds(
                    selectedIds.length === tracks.length ? [] : tracks.map((tr) => tr.id)
                  )
                }
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border transition"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                {selectedIds.length === tracks.length ? 'Quitar todas' : 'Seleccionar todas'}
              </button>
            </div>
            <div
              className="max-h-48 overflow-y-auto rounded-2xl border divide-y"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {tracks.map((tr) => {
                const checked = selectedIds.includes(tr.id);
                return (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => toggleTrack(tr.id)}
                    className="w-full px-3 py-2.5 flex items-center justify-between gap-3 text-left text-xs"
                    style={{ borderColor: 'var(--divider-color)' }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={tr.coverUrl}
                        alt={tr.title}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{tr.title}</p>
                        <p className="truncate opacity-70">{tr.artist}</p>
                      </div>
                    </div>
                    <span
                      className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: checked ? 'var(--accent-color)' : 'transparent',
                        borderColor: checked ? 'var(--text-main)' : 'var(--divider-color)',
                        color: '#1C1B1F',
                      }}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5">
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
        title="Editar portada de lista"
        onCancel={closePendingCover}
        onApply={(editedUrl) => {
          setCoverUrl(editedUrl);
          closePendingCover();
        }}
      />
    </div>
  );
};
