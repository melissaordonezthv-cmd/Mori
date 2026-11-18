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

export type SettingsTextColorId = 'auto' | TextColorId | 'custom';

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

export type SongBarAnimationId =
  | 'wave_ribbon'
  | 'double_wave'
  | 'sound_eq_wave'
  | 'milk_splash'
  | 'pistachio_cream'
  | 'shimmer_glow'
  | 'rainbow_candy'
  | 'heart_pulse'
  | 'floating_sparkles'
  | 'candy_stripes'
  | 'bouncing_note'
  | 'sakura_petals'
  | 'cat_paw'
  | 'bubble_stream'
  | 'comet_trail'
  | 'jelly_ripple'
  | 'starlight_stream'
  | 'butterfly_glide'
  | 'bunny_hop'
  | 'out_float_wave'
  | 'out_elastic_arc'
  | 'out_pulse_bars'
  | 'out_ribbon_loop'
  | 'out_liquid_crest'
  | 'out_bounce_line'
  | 'out_comet_orb'
  | 'out_heartbeat_ecg'
  | 'none';

export type TrackCardStyleId =
  | 'classic_row'
  | 'soft_pill'
  | 'cloud_scallop'
  | 'lace_crochet'
  | 'ticket_stub'
  | 'ribbon_card'
  | 'notebook_lined'
  | 'polaroid_strip'
  | 'love_note'
  | 'chocolate_wafer'
  | 'espresso_noir'
  | 'pistachio_crepe'
  | 'strawberry_milk'
  | 'matcha_wave'
  | 'kitty_frame'
  | 'vinyl_sleeve'
  | 'crystal_glass'
  | 'double_stitch'
  | 'starry_dream'
  | 'washi_tape'
  | 'petal_corner'
  | 'retro_cassette'
  | 'bevel_3d'
  | 'clay_puff'
  | 'glass_prism_3d'
  | 'acrylic_block'
  | 'plush_cushion'
  | 'vinyl_box_3d'
  | 'piano_key_3d'
  | 'macaron_3d'
  | 'polaroid_tilt_3d'
  | 'jewelry_case_3d';

export type TrackCardColorId =
  | 'auto'
  | 'blanco'
  | 'negro'
  | 'crema'
  | 'rosa_pastel'
  | 'lila_nube'
  | 'pistacho'
  | 'chocolate'
  | 'celeste'
  | 'durazno'
  | 'menta'
  | 'vino'
  | 'custom';

export type TrackCardDecorId =
  | 'auto'
  | 'none'
  | 'bows'
  | 'hearts'
  | 'sakura'
  | 'stars'
  | 'notes'
  | 'paws'
  | 'pearls';

export type ButtonThemeId =
  | 'soft_pill'
  | 'cloud_puff_3d'
  | 'candy_gloss'
  | 'keycap_3d'
  | 'velvet_black'
  | 'porcelain_white'
  | 'lace_stitch'
  | 'pastel_bevel'
  | 'acrylic_glass'
  | 'mochi_squish'
  | 'pistachio_macaron'
  | 'cocoa_wafer'
  | 'pearl_rim'
  | 'petal_skew'
  | 'double_border'
  | 'ribbon_tab'
  | 'neon_soft'
  | 'champagne_gold'
  | 'sakura_frost'
  | 'mint_gel'
  | 'minimal_ink'
  | 'marshmallow_elevated';

export type PlaybackButton3DStyleId =
  | 'cushion_3d'
  | 'macaron_3d'
  | 'mechanical_key_3d'
  | 'crystal_jewel_3d'
  | 'pearl_cabochon_3d'
  | 'velvet_puck_3d'
  | 'acrylic_cube_3d'
  | 'vinyl_knob_3d'
  | 'chrome_dome_3d'
  | 'porcelain_sculpt_3d'
  | 'marshmallow_3d'
  | 'heart_locket_3d'
  | 'jelly_drop_3d'
  | 'wafer_biscuit_3d'
  | 'clover_petal_3d'
  | 'tape_deck_3d'
  | 'diamond_cut_3d'
  | 'orb_levitate_3d';

export type PlaybackButtonColorId =
  | 'auto'
  | 'porcelain_sakura'
  | 'noir_velvet'
  | 'pure_white'
  | 'chocolate_caramel'
  | 'pistachio_cream'
  | 'lavender_pearl'
  | 'strawberry_milk'
  | 'champagne_rose'
  | 'sky_ice'
  | 'cherry_noir'
  | 'custom';

export interface ThemeConfig {
  backgroundColorId: BackgroundColorId;
  playerColorId: BackgroundColorId;
  dividerColorId: DividerColorId;
  textColorId: TextColorId;
  songBarColorId: SongBarColorId;
  songBarAnimationId?: SongBarAnimationId;
  trackCardStyleId?: TrackCardStyleId;
  trackCardColorId?: TrackCardColorId;
  trackCardCustomBg?: string;
  trackCardCustomText?: string;
  trackCardDecorId?: TrackCardDecorId;
  buttonThemeId?: ButtonThemeId;
  buttonCustomBg?: string;
  buttonCustomText?: string;
  playbackBtnStyleId?: PlaybackButton3DStyleId;
  playbackBtnColorId?: PlaybackButtonColorId;
  playbackPlayBg?: string;
  playbackNavBg?: string;
  playbackPlayIcon?: string;
  playbackNavIcon?: string;
  playbackRimColor?: string;
  bannerImageUrl?: string;
  bannerText?: string;
  compactThemeLists?: boolean;
  moodSyncEnabled: boolean;
}

export type AvatarFrameId =
  | 'none'
  | 'sakura'
  | 'double_sakura'
  | 'bunny'
  | 'mocha_bunny'
  | 'kitty'
  | 'noir_kitty'
  | 'bear'
  | 'caramel_bear'
  | 'puppy'
  | 'panda'
  | 'frog'
  | 'pearl'
  | 'pearl_tiara'
  | 'noir_pearls'
  | 'lace'
  | 'chocolate_lace'
  | 'starry'
  | 'galaxy_night'
  | 'sparkles'
  | 'ribbon'
  | 'latte_ribbon'
  | 'butterfly'
  | 'butterfly_royal'
  | 'moon'
  | 'gothic_moon'
  | 'cloud_dream'
  | 'clover'
  | 'pistachio_garden'
  | 'pistachio_cream'
  | 'matcha_bloom'
  | 'heart'
  | 'strawberry'
  | 'strawberry_lace'
  | 'cherry_cream'
  | 'peach'
  | 'flower_crown'
  | 'vintage_rose'
  | 'crown'
  | 'noir_crown'
  | 'royal_baroque'
  | 'angel'
  | 'angel_gold'
  | 'headphones'
  | 'espresso_gold'
  | 'noir_velvet'
  | 'lavender_dream'
  | 'honey_bee';

export type CharmStickerId =
  | 'cassette'
  | 'vinyl'
  | 'ribbon'
  | 'black_bow'
  | 'cloud'
  | 'matcha'
  | 'boba'
  | 'iced_coffee'
  | 'strawberry'
  | 'peach'
  | 'cherry'
  | 'cake'
  | 'matcha_cake'
  | 'pistachio_macaron'
  | 'chocolate_bar'
  | 'croissant'
  | 'pudding'
  | 'milk_carton'
  | 'spark'
  | 'crescent'
  | 'cat'
  | 'black_cat'
  | 'bunny'
  | 'bear_latte'
  | 'butterfly'
  | 'clover'
  | 'tulip'
  | 'letter'
  | 'polaroid'
  | 'crystal_heart'
  | 'music_note'
  | 'headphones';

export type NameShapeId =
  | 'cloud'
  | 'ribbon'
  | 'ticket'
  | 'heart_tag'
  | 'minimal_glass'
  | 'notebook'
  | 'polaroid'
  | 'love_letter'
  | 'bunny_ears'
  | 'kitty_ears'
  | 'sakura_petal'
  | 'starry_banner'
  | 'strawberry_milk'
  | 'lace_frame';

export interface ProfileConfig {
  displayName: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  avatarFrame: AvatarFrameId;
  nameShape?: NameShapeId;
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

export type LayoutOrientation = 'auto' | 'landscape' | 'portrait';

export type NowPlayingVisualId =
  | 'cover_classic'
  | 'vinyl_disc'
  | 'vinyl_color_only'
  | 'vinyl_transparent'
  | 'cd_holographic'
  | 'turntable_arm'
  | 'vinyl_gatefold_3d'
  | 'jewel_case_3d'
  | 'cassette_deck'
  | 'reel_to_reel'
  | 'gramophone_gold'
  | 'music_box'
  | 'pocket_player'
  | 'polaroid_float'
  | 'heart_locket_3d'
  | 'snow_globe_3d'
  | 'prism_crystal_3d'
  | 'perfume_stage_3d'
  | 'sakura_mirror_3d'
  | 'boombox_pastel_3d'
  | 'aura_orb'
  | 'equalizer_stage'
  | 'harmonic_waves';

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
  layoutOrientation?: LayoutOrientation;
  nowPlayingVisual?: NowPlayingVisualId;
  nowPlayingColorMode?: 'theme' | 'custom';
  nowPlayingPrimaryColor?: string;
  nowPlayingSecondaryColor?: string;
  nowPlayingAccentColor?: string;
  nowPlayingDetailColor?: string;
  nowPlayingHideCover?: boolean;
  settingsTextColorId?: SettingsTextColorId;
  settingsTextCustomHex?: string;
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
