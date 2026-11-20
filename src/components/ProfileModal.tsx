import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Camera,
  Check,
  Clock,
  Crop,
  Edit3,
  Heart,
  Palette,
  Share2,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import type { Translations } from '../constants/i18n';
import {
  CUSTOM_FRAME_COLORS,
  formatRecordMinutesLabel,
  PREMIUM_FRAME_IDS,
  PREMIUM_FRAME_REQUIRED_MINUTES,
  PREMIUM_FRAME_REWARDS,
  PREMIUM_FRAME_SET,
  RECORD_BADGES,
} from '../constants/records';
import type {
  AvatarFrameId,
  CharmStickerId,
  NameShapeId,
  ProfileConfig,
  TimeRecordStats,
} from '../types/music';
import {
  CHARM_LABELS,
  CharmIcon,
  CuteAvatarFrame,
  FRAME_LABELS,
} from './CuteAvatarFrame';
import { ImageEditorModal } from './ImageEditorModal';
import { PreciousBadgeMedal } from './PreciousBadgeMedal';

interface ProfileModalProps {
  open: boolean;
  profile: ProfileConfig;
  stats: {
    tracks: number;
    playlists: number;
    lossless: number;
    totalPlays: number;
  };
  records: TimeRecordStats;
  sessionSeconds: number;
  unlockedFrameIds: AvatarFrameId[];
  t: Translations;
  onChange: (next: ProfileConfig) => void;
  onShareLink: () => void;
  onClose: () => void;
}

const FRAME_OPTIONS: AvatarFrameId[] = [
  ...PREMIUM_FRAME_IDS,
  'sakura',
  'double_sakura',
  'bunny',
  'mocha_bunny',
  'kitty',
  'noir_kitty',
  'bear',
  'caramel_bear',
  'puppy',
  'panda',
  'frog',
  'pearl',
  'pearl_tiara',
  'noir_pearls',
  'lace',
  'chocolate_lace',
  'starry',
  'galaxy_night',
  'sparkles',
  'ribbon',
  'latte_ribbon',
  'butterfly',
  'butterfly_royal',
  'moon',
  'gothic_moon',
  'cloud_dream',
  'clover',
  'pistachio_garden',
  'pistachio_cream',
  'matcha_bloom',
  'heart',
  'strawberry',
  'strawberry_lace',
  'cherry_cream',
  'peach',
  'flower_crown',
  'vintage_rose',
  'crown',
  'noir_crown',
  'royal_baroque',
  'angel',
  'angel_gold',
  'headphones',
  'espresso_gold',
  'noir_velvet',
  'lavender_dream',
  'honey_bee',
  'none',
];

const CHARM_OPTIONS: CharmStickerId[] = [
  'cassette',
  'vinyl',
  'ribbon',
  'black_bow',
  'cloud',
  'matcha',
  'boba',
  'iced_coffee',
  'strawberry',
  'peach',
  'cherry',
  'cake',
  'matcha_cake',
  'pistachio_macaron',
  'chocolate_bar',
  'croissant',
  'pudding',
  'milk_carton',
  'spark',
  'crescent',
  'cat',
  'black_cat',
  'bunny',
  'bear_latte',
  'butterfly',
  'clover',
  'tulip',
  'letter',
  'polaroid',
  'crystal_heart',
  'music_note',
  'headphones',
];

const NAME_SHAPE_OPTIONS: Array<{ id: NameShapeId; label: string; emoji: string }> = [
  { id: 'cloud', label: 'Nube esponjosa', emoji: '☁️' },
  { id: 'ribbon', label: 'Listón cute', emoji: '🎀' },
  { id: 'ticket', label: 'Ticket musical', emoji: '🎟️' },
  { id: 'heart_tag', label: 'Etiqueta corazón', emoji: '💕' },
  { id: 'minimal_glass', label: 'Placa suave', emoji: '✨' },
  { id: 'notebook', label: 'Hoja de libreta', emoji: '📝' },
  { id: 'polaroid', label: 'Foto Polaroid', emoji: '📸' },
  { id: 'love_letter', label: 'Carta sellada', emoji: '💌' },
  { id: 'bunny_ears', label: 'Orejitas conejo', emoji: '🐰' },
  { id: 'kitty_ears', label: 'Orejitas gatito', emoji: '🐱' },
  { id: 'sakura_petal', label: 'Marco sakura', emoji: '🌸' },
  { id: 'starry_banner', label: 'Banderín estelar', emoji: '🌟' },
  { id: 'strawberry_milk', label: 'Leche de fresa', emoji: '🍓' },
  { id: 'lace_frame', label: 'Encaje pastel', emoji: '🧁' },
];

interface ProfileNamePlaqueProps {
  profile: ProfileConfig;
  shape: NameShapeId;
}

const ProfileNamePlaque: React.FC<ProfileNamePlaqueProps> = ({ profile, shape }) => {
  const baseMeta = (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs mt-1"
      style={{ color: 'var(--text-muted)' }}
    >
      <span className="font-semibold">@{profile.handle}</span>
      <span aria-hidden="true">·</span>
      <span>{profile.cityTag}</span>
      <span aria-hidden="true">·</span>
      <span>{profile.favoriteGenre}</span>
    </div>
  );

  if (shape === 'ribbon') {
    return (
      <div className="relative inline-flex max-w-full items-center">
        <span
          aria-hidden="true"
          className="hidden sm:block w-3 h-8 -mr-1.5 rounded-l-md border border-r-0 shrink-0"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-color)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 38% 50%)',
          }}
        />
        <div
          className="relative px-4 py-2.5 rounded-2xl border-2 shadow-sm max-w-full"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
            color: 'var(--text-main)',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute -top-2.5 right-3 text-sm leading-none select-none"
          >
            🎀
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
          {baseMeta}
        </div>
        <span
          aria-hidden="true"
          className="hidden sm:block w-3 h-8 -ml-1.5 rounded-r-md border border-l-0 shrink-0"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-color)',
            clipPath: 'polygon(0 0, 100% 0, 62% 50%, 100% 100%, 0 100%)',
          }}
        />
      </div>
    );
  }

  if (shape === 'ticket') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-2xl border-2 border-dashed shadow-sm"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-r-2"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-l-2"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
          }}
        />
        <div className="flex items-center gap-1.5">
          <span className="text-xs select-none" aria-hidden="true">
            ♪
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
        </div>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'heart_tag') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-[1.35rem] border-2 shadow-sm"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
          boxShadow: '0 4px 14px -4px var(--accent-soft)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--accent-soft)' }}
            aria-hidden="true"
          >
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
        </div>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'notebook') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-xl border shadow-sm"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
          borderLeftWidth: '5px',
          borderLeftColor: 'var(--accent-color)',
        }}
      >
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
          {profile.displayName}
        </h2>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'minimal_glass') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-2xl border shadow-sm backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-color)' }} />
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
        </div>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'polaroid') {
    return (
      <div
        className="relative inline-block max-w-full px-4 pt-2.5 pb-4 rounded-xl border-2 shadow-md -rotate-1"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm opacity-80"
          style={{ backgroundColor: 'var(--accent-color)' }}
        />
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
          {profile.displayName}
        </h2>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'love_letter') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-2xl border-2 shadow-sm"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-2.5 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm border"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-color)',
          }}
        >
          💌
        </span>
        <div
          className="pb-1 mb-1 border-b border-dashed flex items-center gap-1.5"
          style={{ borderColor: 'var(--divider-color)' }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Para ti ♪
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
          {profile.displayName}
        </h2>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'bunny_ears') {
    return (
      <div className="relative inline-block max-w-full pt-3">
        <span
          aria-hidden="true"
          className="absolute top-0 left-5 w-3.5 h-5 rounded-t-full border-2 border-b-0 -rotate-6"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute top-0 left-10 w-3.5 h-5 rounded-t-full border-2 border-b-0 rotate-6"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
          }}
        />
        <div
          className="relative px-4 py-2.5 rounded-[1.5rem] border-2 shadow-sm"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
            color: 'var(--text-main)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm select-none" aria-hidden="true">🐰</span>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
              {profile.displayName}
            </h2>
          </div>
          {baseMeta}
        </div>
      </div>
    );
  }

  if (shape === 'kitty_ears') {
    return (
      <div className="relative inline-block max-w-full pt-2.5">
        <span
          aria-hidden="true"
          className="absolute top-0 left-5 w-4 h-4 rotate-45 border-l-2 border-t-2"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute top-0 right-5 w-4 h-4 rotate-45 border-l-2 border-t-2"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
          }}
        />
        <div
          className="relative px-4 py-2.5 rounded-3xl border-2 shadow-sm"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-color)',
            color: 'var(--text-main)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm select-none" aria-hidden="true">🐾</span>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
              {profile.displayName}
            </h2>
          </div>
          {baseMeta}
        </div>
      </div>
    );
  }

  if (shape === 'sakura_petal') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-tl-[1.6rem] rounded-br-[1.6rem] rounded-tr-xl rounded-bl-xl border-2 shadow-sm"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
        }}
      >
        <span aria-hidden="true" className="absolute -top-2 -left-1.5 text-sm select-none">
          🌸
        </span>
        <span aria-hidden="true" className="absolute -bottom-2 -right-1 text-xs select-none">
          🌸
        </span>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
          {profile.displayName}
        </h2>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'starry_banner') {
    return (
      <div
        className="relative inline-block max-w-full px-5 py-2.5 rounded-2xl border-2 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, var(--bg-elevated), var(--accent-soft))',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
        }}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-sm select-none">🌟</span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
          <span aria-hidden="true" className="text-xs select-none">✦</span>
        </div>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'strawberry_milk') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-3xl border-2 shadow-sm"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
          boxShadow: 'inset 0 -5px 0 var(--accent-soft)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-sm select-none">🍓</span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
        </div>
        {baseMeta}
      </div>
    );
  }

  if (shape === 'lace_frame') {
    return (
      <div
        className="relative inline-block max-w-full px-4 py-2.5 rounded-2xl border-[3px] border-dotted shadow-sm"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
          color: 'var(--text-main)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-sm select-none">🧁</span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
            {profile.displayName}
          </h2>
        </div>
        {baseMeta}
      </div>
    );
  }

  // Default: 'cloud' — soft scalloped cloud plaque with clear contrast against any banner
  return (
    <div
      className="relative inline-block max-w-full px-4 py-2.5 rounded-[1.5rem] border-2 shadow-sm"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--accent-color)',
        color: 'var(--text-main)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 left-5 w-5 h-3 rounded-t-full border-t-2 border-l-2 border-r-2"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-9 w-6 h-3.5 rounded-t-full border-t-2 border-l-2 border-r-2"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--accent-color)',
        }}
      />
      <h2 className="relative text-lg sm:text-xl font-extrabold tracking-tight leading-tight break-words">
        {profile.displayName}
      </h2>
      {baseMeta}
    </div>
  );
};

function formatCompactTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins} min ${secs.toString().padStart(2, '0')}s`;
  return `${secs}s`;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  profile,
  stats,
  records,
  sessionSeconds,
  unlockedFrameIds,
  t,
  onChange,
  onShareLink,
  onClose,
}) => {
  const [editing, setEditing] = useState(false);
  const [showRecordsPanel, setShowRecordsPanel] = useState(false);
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border overflow-x-hidden relative"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Live Preview Bar while Editing (avoids scrolling up/down to check frames & name shapes) */}
        {editing && (
          <div
            className="sticky top-0 z-30 px-4 py-2.5 border-b backdrop-blur-md flex items-center justify-between gap-3 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <CuteAvatarFrame
                avatarUrl={profile.avatarUrl}
                displayName={profile.displayName}
                frame={profile.avatarFrame}
                frameColor={profile.avatarFrameColor}
                size="md"
                alwaysShowFrame
              />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{profile.displayName}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                  Marco: {FRAME_LABELS[profile.avatarFrame]}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: '#1C1B1F',
              }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Listo</span>
            </button>
          </div>
        )}

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
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3.5 min-w-0">
              <div className="relative -mt-12 shrink-0 self-start sm:self-auto">
                <CuteAvatarFrame
                  avatarUrl={profile.avatarUrl}
                  displayName={profile.displayName}
                  frame={profile.avatarFrame}
                  frameColor={profile.avatarFrameColor}
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

              <div className="pt-1 sm:pt-3 min-w-0">
                <ProfileNamePlaque
                  profile={profile}
                  shape={profile.nameShape ?? 'cloud'}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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

          {/* Game-like Time Records: 50 Unique Custom-Color Frames (every 5 min) & 22 Precious Badges */}
          {(() => {
            const bestMin = Math.floor(records.bestSessionSeconds / 60);
            const curMin = Math.floor(sessionSeconds / 60);
            const totalMin = Math.floor(records.totalSecondsInApp / 60);
            const unlockedSet = new Set(records.unlockedBadgeIds);
            const unlockedFrameSet = new Set(unlockedFrameIds);
            const nextFrameReward =
              PREMIUM_FRAME_REWARDS.find((f) => !unlockedFrameSet.has(f.frameId)) ?? null;
            const nextBadge = RECORD_BADGES.find((b) => !unlockedSet.has(b.id)) ?? null;
            const activeFrameColor = profile.avatarFrameColor || '#F472B6';

            return (
              <div
                className="mt-4 rounded-2xl border p-4 space-y-3"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-extrabold font-mono-nums">
                          Récord: {formatRecordMinutesLabel(bestMin)}
                        </span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--divider-color)',
                          }}
                        >
                          {records.unlockedBadgeIds.length}/{RECORD_BADGES.length} insignias
                        </span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--divider-color)',
                          }}
                        >
                          {unlockedFrameIds.length}/{PREMIUM_FRAME_REWARDS.length} marcos
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 flex flex-wrap items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <span className="inline-flex items-center gap-1 font-mono-nums">
                          <Clock className="w-3 h-3" />
                          Sesión: {formatCompactTime(sessionSeconds)}
                        </span>
                        <span>·</span>
                        <span className="font-mono-nums">
                          Total: {formatRecordMinutesLabel(totalMin)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRecordsPanel((v) => !v)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      color: '#1C1B1F',
                    }}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{showRecordsPanel ? 'Ocultar récords' : 'Ver récords'}</span>
                  </button>
                </div>

                {/* Progress bars toward next 5-min Frame & next Precious Badge */}
                <div className="space-y-2">
                  {nextFrameReward && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <span>
                          Siguiente marco (cada 5m): <strong style={{ color: 'var(--text-main)' }}>{nextFrameReward.frameLabel}</strong> ({formatRecordMinutesLabel(nextFrameReward.minutes)})
                        </span>
                        <span className="font-mono-nums">
                          {Math.min(curMin, nextFrameReward.minutes)}/{nextFrameReward.minutes}m
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden bg-black/10">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((sessionSeconds / (nextFrameReward.minutes * 60)) * 100)
                            )}%`,
                            backgroundColor: 'var(--accent-color)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {nextBadge && (
                    <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      <span>
                        Siguiente insignia preciosa: <strong style={{ color: 'var(--text-main)' }}>{nextBadge.title}</strong> ({formatRecordMinutesLabel(nextBadge.minutes)})
                      </span>
                      <span className="font-mono-nums">
                        {Math.min(curMin, nextBadge.minutes)}/{nextBadge.minutes}m
                      </span>
                    </div>
                  )}

                  {bestMin >= 5 && curMin <= bestMin && (
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Tu tiempo sigue contando incluso mientras escuchas en segundo plano o con pantalla bloqueada. Supera {formatRecordMinutesLabel(bestMin)} para desbloquear más premios.
                    </p>
                  )}
                </div>

                {showRecordsPanel && (
                  <div
                    className="pt-3 border-t space-y-5"
                    style={{ borderColor: 'var(--divider-color)' }}
                  >
                    {/* 22 Precious Badges Showcase */}
                    <div>
                      <p className="text-xs font-bold mb-2.5 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>
                          Insignias Preciosas ({records.unlockedBadgeIds.length}/{RECORD_BADGES.length})
                        </span>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-80 overflow-y-auto pr-1">
                        {RECORD_BADGES.map((badge) => {
                          const earned = unlockedSet.has(badge.id);
                          return (
                            <div
                              key={badge.id}
                              className="p-2.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition"
                              style={{
                                backgroundColor: earned
                                  ? 'var(--bg-elevated)'
                                  : 'rgba(128,128,128,0.06)',
                                borderColor: earned ? badge.accentHex : 'var(--divider-color)',
                                opacity: earned ? 1 : 0.65,
                              }}
                            >
                              <div className={earned ? 'anim-badge-float' : ''}>
                                <PreciousBadgeMedal badge={badge} earned={earned} size="sm" />
                              </div>
                              <p className="text-[11px] font-bold leading-tight truncate w-full">
                                {badge.title}
                              </p>
                              <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                                {earned ? `✓ ${formatRecordMinutesLabel(badge.minutes)}` : `Meta: ${formatRecordMinutesLabel(badge.minutes)}`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Color Picker + 50 Unique Premium Frames Showcase */}
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          <span>
                            50 Marcos Exclusivos (cada 5 min · {unlockedFrameIds.length}/50)
                          </span>
                        </p>
                        <label
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--divider-color)',
                          }}
                        >
                          <input
                            type="color"
                            value={activeFrameColor}
                            onChange={(e) =>
                              onChange({ ...profile, avatarFrameColor: e.target.value })
                            }
                            className="w-4 h-4 rounded border-0 p-0 bg-transparent cursor-pointer"
                          />
                          <span>Color libre</span>
                        </label>
                      </div>

                      {/* Quick Color Swatches */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {CUSTOM_FRAME_COLORS.map((sw) => (
                          <button
                            key={sw.hex}
                            type="button"
                            title={sw.label}
                            aria-label={sw.label}
                            onClick={() => onChange({ ...profile, avatarFrameColor: sw.hex })}
                            className="btn-raw w-6 h-6 rounded-full border transition-transform hover:scale-110"
                            style={{
                              backgroundColor: sw.hex,
                              borderColor:
                                activeFrameColor.toLowerCase() === sw.hex.toLowerCase()
                                  ? 'var(--text-main)'
                                  : 'rgba(255,255,255,0.75)',
                              transform:
                                activeFrameColor.toLowerCase() === sw.hex.toLowerCase()
                                  ? 'scale(1.16)'
                                  : undefined,
                            }}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-h-96 overflow-y-auto pr-1">
                        {PREMIUM_FRAME_REWARDS.map((reward) => {
                          const unlocked = unlockedFrameSet.has(reward.frameId);
                          const equipped = profile.avatarFrame === reward.frameId;
                          return (
                            <button
                              key={reward.frameId}
                              type="button"
                              disabled={!unlocked}
                              onClick={() =>
                                unlocked &&
                                onChange({
                                  ...profile,
                                  avatarFrame: reward.frameId,
                                  avatarFrameColor: profile.avatarFrameColor || reward.defaultColor,
                                })
                              }
                              className="btn-raw pt-4 pb-2.5 px-2 rounded-2xl border text-[11px] font-medium flex flex-col items-center justify-center gap-2 transition disabled:opacity-55 disabled:cursor-not-allowed"
                              style={{
                                backgroundColor: equipped
                                  ? 'var(--accent-soft)'
                                  : 'var(--bg-elevated)',
                                borderColor: equipped
                                  ? activeFrameColor
                                  : 'var(--divider-color)',
                              }}
                            >
                              <CuteAvatarFrame
                                avatarUrl={profile.avatarUrl}
                                displayName={profile.displayName}
                                frame={reward.frameId}
                                frameColor={activeFrameColor}
                                size="sm"
                                alwaysShowFrame
                              />
                              <span className="truncate max-w-full font-semibold">
                                {reward.frameLabel}
                              </span>
                              <span
                                className="text-[10px] leading-none"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {equipped
                                  ? '✓ Equipado'
                                  : unlocked
                                    ? 'Tocar para usar'
                                    : `🔒 ${formatRecordMinutesLabel(reward.minutes)}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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

              {/* Cute Name Shape Picker (only in Editar perfil) */}
              <div>
                <p className="text-xs font-medium mb-2.5">
                  Forma del nombre en tu perfil ({NAME_SHAPE_OPTIONS.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NAME_SHAPE_OPTIONS.map((opt) => {
                    const active = (profile.nameShape ?? 'cloud') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange({ ...profile, nameShape: opt.id })}
                        className="min-h-[42px] px-3 py-2 rounded-xl border text-xs font-medium transition flex items-center gap-2"
                        style={{
                          backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <span className="text-base leading-none">{opt.emoji}</span>
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cute Avatar Frame Picker (with Live Sample Miniature + Unlocked Unique Color Frames!) */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <p className="text-xs font-medium">
                    Marco del avatar ({FRAME_OPTIONS.length}) — vista previa directa en tu foto
                  </p>
                  {PREMIUM_FRAME_SET.has(profile.avatarFrame) && (
                    <label
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <input
                        type="color"
                        value={profile.avatarFrameColor || '#F472B6'}
                        onChange={(e) =>
                          onChange({ ...profile, avatarFrameColor: e.target.value })
                        }
                        className="w-4 h-4 rounded border-0 p-0 bg-transparent cursor-pointer"
                      />
                      <span>Color del marco</span>
                    </label>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {FRAME_OPTIONS.map((frameId) => {
                    const active = profile.avatarFrame === frameId;
                    const isPremium = PREMIUM_FRAME_SET.has(frameId);
                    const isUnlocked = !isPremium || unlockedFrameIds.includes(frameId);
                    const reqMins = PREMIUM_FRAME_REQUIRED_MINUTES[frameId];
                    return (
                      <button
                        key={frameId}
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => isUnlocked && onChange({ ...profile, avatarFrame: frameId })}
                        className="btn-raw pt-4 pb-2.5 px-2 rounded-2xl border text-[11px] font-medium transition flex flex-col items-center justify-center gap-2 overflow-visible disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <CuteAvatarFrame
                          avatarUrl={profile.avatarUrl}
                          displayName={profile.displayName}
                          frame={frameId}
                          frameColor={profile.avatarFrameColor}
                          size="sm"
                          alwaysShowFrame
                        />
                        <span className="truncate max-w-full leading-tight">
                          {FRAME_LABELS[frameId]}
                        </span>
                        {isPremium && (
                          <span className="text-[9px] font-bold leading-none opacity-80">
                            {isUnlocked ? '✨ Único' : `🔒 ${reqMins}m`}
                          </span>
                        )}
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
