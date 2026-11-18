export type BackgroundColorId =
  | 'rosa'
  | 'sakura'
  | 'nube_rosa'
  | 'durazno'
  | 'melon'
  | 'coral'
  | 'mantequilla'
  | 'limon'
  | 'verde'
  | 'pistacho'
  | 'salvia'
  | 'agua'
  | 'celeste'
  | 'hielo'
  | 'azul'
  | 'lavanda'
  | 'lila'
  | 'malva'
  | 'orquidea'
  | 'crema'
  | 'perla'
  | 'latte'
  | 'avellana'
  | 'canela'
  | 'caramelo'
  | 'chocolate'
  | 'cacao'
  | 'espresso'
  | 'blanco'
  | 'negro';

export type DividerColorId =
  | 'suave'
  | 'rosa'
  | 'sakura'
  | 'durazno'
  | 'coral'
  | 'mantequilla'
  | 'verde'
  | 'salvia'
  | 'agua'
  | 'celeste'
  | 'azul'
  | 'lavanda'
  | 'lila'
  | 'orquidea'
  | 'crema'
  | 'latte'
  | 'avellana'
  | 'cacao'
  | 'blanco'
  | 'negro';

export type TextColorId =
  | 'negro'
  | 'blanco'
  | 'crema'
  | 'gris'
  | 'marron'
  | 'cafe'
  | 'verde'
  | 'amarillo'
  | 'dorado'
  | 'rosa'
  | 'coral'
  | 'azul'
  | 'morado';

export type SongBarColorId =
  | 'auto'
  | 'rosa_chicle'
  | 'sakura'
  | 'frambuesa'
  | 'coral'
  | 'durazno'
  | 'miel'
  | 'limon'
  | 'menta'
  | 'esmeralda'
  | 'turquesa'
  | 'celeste'
  | 'cielo'
  | 'indigo'
  | 'lavanda'
  | 'lila'
  | 'orquidea'
  | 'caramelo'
  | 'chocolate'
  | 'espresso'
  | 'blanco'
  | 'negro';

export type AppLanguage = 'es' | 'en' | 'zh' | 'ja' | 'ko';

export type MusicalMood =
  | 'serene'
  | 'joyful'
  | 'melancholic'
  | 'energetic'
  | 'romantic'
  | 'dreamy';

export interface LyricLine {
  timeSec: number;
  original: string;
  translated: string;
}

export interface TrackLyricsData {
  detectedLanguage: string;
  targetLanguage: AppLanguage;
  isInstrumental: boolean;
  mood: MusicalMood;
  moodLabel: string;
  moodDescription: string;
  suggestedAura: string;
  tempoFeeling: 'slow' | 'medium' | 'fast';
  lines: LyricLine[];
  updatedAt: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre?: string;
  year?: string;
  trackNumber?: string;
  notes?: string;
  duration: number;
  format: string;
  lossless: boolean;
  sampleRate?: number;
  bitDepth?: number;
  bitrate?: number;
  fileSize: number;
  coverUrl: string;
  originalCoverUrl?: string;
  isFavorite: boolean;
  playCount: number;
  createdAt: number;
  isSample?: boolean;
  lyrics?: TrackLyricsData;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ThemeConfig {
  backgroundColorId: BackgroundColorId;
  playerColorId: BackgroundColorId;
  dividerColorId: DividerColorId;
  textColorId: TextColorId;
  songBarColorId: SongBarColorId;
  moodSyncEnabled: boolean;
}

export type AvatarFrameId =
  | 'none'
  | 'sakura'
  | 'bunny'
  | 'kitty'
  | 'bear'
  | 'puppy'
  | 'panda'
  | 'frog'
  | 'pearl'
  | 'lace'
  | 'starry'
  | 'sparkles'
  | 'ribbon'
  | 'butterfly'
  | 'moon'
  | 'cloud_dream'
  | 'clover'
  | 'heart'
  | 'strawberry'
  | 'peach'
  | 'flower_crown'
  | 'crown'
  | 'angel'
  | 'headphones';

export type CharmStickerId =
  | 'cassette'
  | 'vinyl'
  | 'ribbon'
  | 'cloud'
  | 'matcha'
  | 'boba'
  | 'strawberry'
  | 'peach'
  | 'cherry'
  | 'cake'
  | 'spark'
  | 'crescent'
  | 'cat'
  | 'tulip'
  | 'letter'
  | 'headphones';

export interface ProfileConfig {
  displayName: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  avatarFrame: AvatarFrameId;
  activeCharms: CharmStickerId[];
  favoriteGenre: string;
  cityTag: string;
}

export type EqPresetId = 'flat' | 'pop' | 'acoustic' | 'bass' | 'vocal' | 'night';

export type AudioEngineMode =
  | 'apple_master'
  | 'spatial_3d'
  | 'studio_hall'
  | 'lossless_pure';

export interface AppSettings {
  language: AppLanguage;
  eqPreset: EqPresetId;
  eqBands: [number, number, number, number, number];
  audioMode: AudioEngineMode;
  soundCheckEnabled: boolean;
  spatialWidth: number;
  playbackSpeed: number;
  backgroundPlaybackEnabled: boolean;
  autoDetectLyrics: boolean;
}

export interface LockConfig {
  enabled: boolean;
  emojis: string[];
  hint?: string;
}

export type LockSoundId =
  | 'soft_bubbles'
  | 'creamy_bubbles'
  | 'rain_drops'
  | 'honey_drops'
  | 'jelly_pops'
  | 'music_box'
  | 'cloud_puffs'
  | 'off';

export type ButtonSoundId =
  | 'creamy_keycaps'
  | 'ice_cream_thock'
  | 'matcha_latte'
  | 'marshmallow_gasket'
  | 'butter_pbt'
  | 'cloud_foam'
  | 'mahjong_clack'
  | 'peach_switch'
  | 'milk_pudding'
  | 'bamboo_wood'
  | 'sugar_sparkles'
  | 'off';

export interface SoundConfig {
  enabled: boolean;
  lockSound: LockSoundId;
  buttonSound: ButtonSoundId;
  volume: number;
  playOnTextInputs: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';
