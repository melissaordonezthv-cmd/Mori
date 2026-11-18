import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Crop, Edit3, Share2, X } from 'lucide-react';
import type { Translations } from '../constants/i18n';
import type { AvatarFrameId, CharmStickerId, ProfileConfig } from '../types/music';
import {
  CHARM_LABELS,
  CharmIcon,
  CuteAvatarFrame,
  FRAME_LABELS,
} from './CuteAvatarFrame';
import { ImageEditorModal } from './ImageEditorModal';

interface ProfileModalProps {
  open: boolean;
  profile: ProfileConfig;
  stats: {
    tracks: number;
    playlists: number;
    lossless: number;
    totalPlays: number;
  };
  t: Translations;
  onChange: (next: ProfileConfig) => void;
  onShareLink: () => void;
  onClose: () => void;
}

const FRAME_OPTIONS: AvatarFrameId[] = [
  'sakura',
  'bunny',
  'kitty',
  'bear',
  'puppy',
  'panda',
  'frog',
  'pearl',
  'lace',
  'starry',
  'sparkles',
  'ribbon',
  'butterfly',
  'moon',
  'cloud_dream',
  'clover',
  'heart',
  'strawberry',
  'peach',
  'flower_crown',
  'crown',
  'angel',
  'headphones',
  'none',
];

const CHARM_OPTIONS: CharmStickerId[] = [
  'cassette',
  'vinyl',
  'ribbon',
  'cloud',
  'matcha',
  'boba',
  'strawberry',
  'peach',
  'cherry',
  'cake',
  'spark',
  'crescent',
  'cat',
  'tulip',
  'letter',
  'headphones',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  profile,
  stats,
  t,
  onChange,
  onShareLink,
  onClose,
}) => {
  const [editing, setEditing] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<{
    src: string;
    isBlob: boolean;
    field: 'avatarUrl' | 'bannerUrl';
  } | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (pendingPhoto?.isBlob) {
        URL.revokeObjectURL(pendingPhoto.src);
      }
    };
  }, [pendingPhoto]);

  if (!open) return null;

  const closePendingPhoto = () => {
    setPendingPhoto((prev) => {
      if (prev?.isBlob) {
        URL.revokeObjectURL(prev.src);
      }
      return null;
    });
  };

  const handleUploadImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'avatarUrl' | 'bannerUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPendingPhoto({ src: objectUrl, isBlob: true, field });
    e.target.value = '';
  };

  const toggleCharm = (charm: CharmStickerId) => {
    const exists = profile.activeCharms.includes(charm);
    const nextCharms = exists
      ? profile.activeCharms.filter((c) => c !== charm)
      : [...profile.activeCharms, charm];
    onChange({ ...profile, activeCharms: nextCharms });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Perfil aesthetic"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border overflow-x-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src={profile.bannerUrl}
            alt="Portada de perfil"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="min-w-[40px] min-h-[40px] rounded-xl bg-white/85 text-zinc-900 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUploadImage(e, 'bannerUrl')}
          />
        </div>

        {/* Avatar + Identity Header */}
        <div className="px-6 pb-6">
          <div className="relative -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <CuteAvatarFrame
                  avatarUrl={profile.avatarUrl}
                  displayName={profile.displayName}
                  frame={profile.avatarFrame}
                  size="lg"
                />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUploadImage(e, 'avatarUrl')}
                />
              </div>

              <div className="pt-2">
                <h2 className="text-xl font-bold tracking-tight">{profile.displayName}</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  <span>@{profile.handle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{profile.cityTag}</span>
                  <span aria-hidden="true">·</span>
                  <span>{profile.favoriteGenre}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onShareLink}
                className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shareAppLink}</span>
              </button>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: '#1C1B1F',
                }}
              >
                {editing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{editing ? 'Listo' : 'Editar perfil'}</span>
              </button>
            </div>
          </div>

          {/* Signature / Bio Note */}
          <div
            className="mt-5 p-4 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <p className="text-sm leading-relaxed italic">“{profile.bio}”</p>
            {profile.activeCharms.length > 0 && (
              <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--divider-color)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Mi colección:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {profile.activeCharms.map((charm) => (
                    <span
                      key={charm}
                      className="inline-flex items-center gap-1.5 text-xs"
                      title={CHARM_LABELS[charm]}
                    >
                      <CharmIcon charm={charm} className="w-6 h-6" />
                      <span>{CHARM_LABELS[charm]}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Listening Stats (Clean 4-column tabular grid) */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t.songsCount, value: stats.tracks },
              { label: t.playlistsCount, value: stats.playlists },
              { label: t.losslessCount, value: stats.lossless },
              { label: t.playsCount, value: stats.totalPlays },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-2xl border text-center"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <div className="text-2xl font-bold font-mono-nums">{item.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Decoration & Profile Editor */}
          {editing && (
            <div
              className="mt-5 p-5 rounded-2xl border space-y-5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {/* Photo & Banner Editing (only visible while editing profile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="p-3.5 rounded-xl border space-y-2.5"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <p className="text-xs font-semibold">Foto de perfil</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Cambiar foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingPhoto({
                          src: profile.avatarUrl,
                          isBlob: false,
                          field: 'avatarUrl',
                        })
                      }
                      className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Ajustar / girar</span>
                    </button>
                  </div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-2.5"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <p className="text-xs font-semibold">Portada de perfil</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Cambiar portada</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingPhoto({
                          src: profile.bannerUrl,
                          isBlob: false,
                          field: 'bannerUrl',
                        })
                      }
                      className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Ajustar / girar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-medium space-y-1.5">
                  <span>Nombre</span>
                  <input
                    type="text"
                    value={profile.displayName}
                    maxLength={28}
                    onChange={(e) => onChange({ ...profile, displayName: e.target.value })}
                    className="w-full min-h-[42px] px-3 rounded-xl border text-sm focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                </label>

                <label className="block text-xs font-medium space-y-1.5">
                  <span>Usuario (@)</span>
                  <input
                    type="text"
                    value={profile.handle}
                    maxLength={24}
                    onChange={(e) =>
                      onChange({ ...profile, handle: e.target.value.replace(/\s+/g, '') })
                    }
                    className="w-full min-h-[42px] px-3 rounded-xl border text-sm focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                </label>

                <label className="block text-xs font-medium space-y-1.5">
                  <span>Ciudad o rincón</span>
                  <input
                    type="text"
                    value={profile.cityTag}
                    maxLength={24}
                    onChange={(e) => onChange({ ...profile, cityTag: e.target.value })}
                    className="w-full min-h-[42px] px-3 rounded-xl border text-sm focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                </label>

                <label className="block text-xs font-medium space-y-1.5">
                  <span>Estilo favorito</span>
                  <input
                    type="text"
                    value={profile.favoriteGenre}
                    maxLength={24}
                    onChange={(e) => onChange({ ...profile, favoriteGenre: e.target.value })}
                    className="w-full min-h-[42px] px-3 rounded-xl border text-sm focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                </label>
              </div>

              <label className="block text-xs font-medium space-y-1.5">
                <span>Firma musical (estado)</span>
                <input
                  type="text"
                  value={profile.bio}
                  maxLength={90}
                  onChange={(e) => onChange({ ...profile, bio: e.target.value })}
                  className="w-full min-h-[42px] px-3 rounded-xl border text-sm focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                    color: 'var(--text-main)',
                  }}
                />
              </label>

              {/* Cute Avatar Frame Picker */}
              <div>
                <p className="text-xs font-medium mb-2.5">
                  Marco del avatar ({FRAME_OPTIONS.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {FRAME_OPTIONS.map((frameId) => {
                    const active = profile.avatarFrame === frameId;
                    return (
                      <button
                        key={frameId}
                        type="button"
                        onClick={() => onChange({ ...profile, avatarFrame: frameId })}
                        className="min-h-[42px] px-2.5 py-2 rounded-xl border text-xs font-medium transition truncate"
                        style={{
                          backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        {FRAME_LABELS[frameId]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cute Charm Stickers Picker */}
              <div>
                <p className="text-xs font-medium mb-2.5">
                  Stickers decorativos ({CHARM_OPTIONS.length})
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {CHARM_OPTIONS.map((charm) => {
                    const active = profile.activeCharms.includes(charm);
                    return (
                      <button
                        key={charm}
                        type="button"
                        onClick={() => toggleCharm(charm)}
                        className="min-h-[54px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition"
                        style={{
                          backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <CharmIcon charm={charm} className="w-6 h-6" />
                        <span className="truncate max-w-full">{CHARM_LABELS[charm]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ImageEditorModal
        open={Boolean(pendingPhoto)}
        imageSrc={pendingPhoto?.src ?? null}
        aspect={pendingPhoto?.field === 'bannerUrl' ? 'wide' : 'square'}
        circularGuide={pendingPhoto?.field === 'avatarUrl'}
        title={
          pendingPhoto?.field === 'bannerUrl'
            ? 'Editar fondo de perfil'
            : 'Editar foto de perfil'
        }
        onCancel={closePendingPhoto}
        onApply={(editedDataUrl) => {
          if (pendingPhoto) {
            onChange({ ...profile, [pendingPhoto.field]: editedDataUrl });
          }
          closePendingPhoto();
        }}
      />
    </div>
  );
};
