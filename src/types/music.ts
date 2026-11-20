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
  | 'marfil'
  | 'trigo'
  | 'perla'
  | 'latte'
  | 'avellana'
  | 'canela'
  | 'caramelo'
  | 'chocolate'
  | 'cacao'
  | 'espresso'
  | 'blanco'
  | 'gris_perla'
  | 'gris_pizarra'
  | 'negro'
  | 'rosa_intenso'
  | 'rojo'
  | 'rojo_rubi'
  | 'cereza'
  | 'vino_oscuro'
  | 'terracota'
  | 'coral_oscuro'
  | 'oro_antiguo'
  | 'menta_profundo'
  | 'azul_pastel_medio'
  | 'azul_rey'
  | 'azul_marino'
  | 'azul_medianoche'
  | 'azul_zafiro'
  | 'azul_electrico'
  | 'esmeralda_oscuro'
  | 'lavanda_oscuro'
  | 'morado_intenso'
  | 'ciruela_oscuro'
  | 'magenta';

export type DividerColorId =
  | 'suave'
  | 'rosa'
  | 'sakura'
  | 'rosa_intenso'
  | 'durazno'
  | 'coral'
  | 'mantequilla'
  | 'verde'
  | 'salvia'
  | 'menta_oscuro'
  | 'agua'
  | 'celeste'
  | 'azul'
  | 'azul_cielo_medio'
  | 'lavanda'
  | 'lila'
  | 'orquidea'
  | 'lavanda_oscuro'
  | 'marfil'
  | 'crema'
  | 'latte'
  | 'avellana'
  | 'caramelo'
  | 'cacao'
  | 'marron_oscuro'
  | 'blanco'
  | 'gris_medio'
  | 'negro'
  | 'rojo'
  | 'carmesi'
  | 'azul_rey'
  | 'azul_marino'
  | 'esmeralda'
  | 'purpura'
  | 'fucsia'
  | 'dorado';

export type TextColorId =
  | 'negro'
  | 'blanco'
  | 'marfil'
  | 'vainilla'
  | 'crema'
  | 'crema_tibia'
  | 'almendra'
  | 'latte_claro'
  | 'arena'
  | 'caramelo_claro'
  | 'canela'
  | 'avellana'
  | 'marron'
  | 'cafe'
  | 'gris_claro'
  | 'gris'
  | 'gris_oscuro'
  | 'rosa_claro'
  | 'rosa_palo'
  | 'rosa'
  | 'durazno_claro'
  | 'coral'
  | 'rojo_claro'
  | 'rojo'
  | 'carmesi'
  | 'amarillo'
  | 'dorado'
  | 'menta_claro'
  | 'verde'
  | 'esmeralda'
  | 'verde_bosque'
  | 'celeste_vivo'
  | 'azul'
  | 'azul_rey'
  | 'azul_marino'
  | 'lavanda_claro'
  | 'morado'
  | 'morado_oscuro'
  | 'fucsia';

export type SettingsTextColorId = 'auto' | TextColorId | 'custom';

export type AppTitleColorId =
  | 'auto'
  | 'blanco'
  | 'marfil'
  | 'crema'
  | 'latte_claro'
  | 'rosa_claro'
  | 'durazno_claro'
  | 'menta_claro'
  | 'celeste_claro'
  | 'lavanda_claro'
  | 'gris_claro'
  | 'dorado'
  | 'canela'
  | 'caramelo'
  | 'rosa_medio'
  | 'rojo_intenso'
  | 'esmeralda'
  | 'azul_rey'
  | 'purpura'
  | 'chocolate'
  | 'vino'
  | 'verde_oscuro'
  | 'azul_marino'
  | 'negro'
  | 'custom';

export type SongBarColorId =
  | 'auto'
  | 'crema'
  | 'vainilla'
  | 'avellana'
  | 'rosa_claro'
  | 'rosa_chicle'
  | 'sakura'
  | 'frambuesa'
  | 'rosa_vino'
  | 'coral'
  | 'durazno'
  | 'miel'
  | 'limon'
  | 'menta'
  | 'esmeralda'
  | 'turquesa'
  | 'celeste_claro'
  | 'celeste'
  | 'cielo'
  | 'indigo'
  | 'lavanda_claro'
  | 'lavanda'
  | 'lila'
  | 'orquidea'
  | 'caramelo'
  | 'chocolate'
  | 'espresso'
  | 'blanco'
  | 'gris_plata'
  | 'negro'
  | 'rojo_intenso'
  | 'rojo_carmesi'
  | 'vino_profundo'
  | 'azul_rey'
  | 'azul_marino'
  | 'azul_electrico'
  | 'cyan_intenso'
  | 'verde_bosque'
  | 'purpura_real'
  | 'fucsia'
  | 'dorado_intenso';

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
  | 'gris_claro'
  | 'gris_oscuro'
  | 'negro'
  | 'marfil'
  | 'crema'
  | 'latte'
  | 'canela'
  | 'caramelo'
  | 'chocolate'
  | 'rosa_pastel'
  | 'rosa_oscuro'
  | 'lila_nube'
  | 'lavanda_oscuro'
  | 'pistacho'
  | 'celeste'
  | 'azul_cielo'
  | 'durazno'
  | 'menta'
  | 'vino'
  | 'rojo_intenso'
  | 'rojo_oscuro'
  | 'azul_rey'
  | 'azul_marino'
  | 'azul_cobalto'
  | 'verde_esmeralda'
  | 'morado_noche'
  | 'fucsia_intenso'
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
  | 'crema_dorada'
  | 'latte_miel'
  | 'gris_plata'
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
  | 'rosa_vino'
  | 'rojo_carmesi'
  | 'rojo_oscuro'
  | 'azul_cielo_suave'
  | 'azul_rey'
  | 'azul_marino'
  | 'menta_oscuro'
  | 'esmeralda_oro'
  | 'lila_oscuro'
  | 'purpura_real'
  | 'fucsia_vivo'
  | 'custom';

export type SongTitleShapeId =
  | 'title_only'
  | 'cloud_plush'
  | 'ribbon_banner'
  | 'ticket_stub'
  | 'heart_plaque'
  | 'capsule_3d'
  | 'notebook_tab'
  | 'polaroid_tag'
  | 'crystal_glass'
  | 'sakura_frame'
  | 'starry_plaque'
  | 'double_lace'
  | 'kitty_ears'
  | 'bunny_ears'
  | 'wave_underline'
  | 'gold_velvet';

export type SongTitleColorId =
  | 'auto'
  | 'negro'
  | 'blanco'
  | 'gris_claro'
  | 'gris_oscuro'
  | 'marfil'
  | 'crema'
  | 'latte'
  | 'canela'
  | 'caramelo'
  | 'rosa_pastel'
  | 'frambuesa'
  | 'rosa_fuerte'
  | 'sakura'
  | 'pistacho'
  | 'menta'
  | 'verde_claro'
  | 'celeste'
  | 'lavanda'
  | 'durazno'
  | 'chocolate'
  | 'vino'
  | 'oro_negro'
  | 'rojo_intenso'
  | 'carmesi_oscuro'
  | 'azul_rey'
  | 'azul_marino'
  | 'azul_cobalto'
  | 'verde_bosque'
  | 'purpura_real'
  | 'fucsia_vivo'
  | 'custom';

export interface ThemeConfig {
  backgroundColorId: BackgroundColorId;
  playerColorId: BackgroundColorId;
  dividerColorId: DividerColorId;
  textColorId: TextColorId;
  appTitleColorId?: AppTitleColorId;
  appTitleCustomHex?: string;
  songBarColorId: SongBarColorId;
  songBarAnimationId?: SongBarAnimationId;
  songTitleShapeId?: SongTitleShapeId;
  songTitleColorId?: SongTitleColorId;
  songTitleCustomBg?: string;
  songTitleCustomText?: string;
  trackCardStyleId?: TrackCardStyleId;
  trackCardColorId?: TrackCardColorId;
  trackCardCustomBg?: string;
  trackCardCustomText?: string;
  trackCardDecorId?: TrackCardDecorId;
  trackCardOpacity?: number;
  trackCardBlur?: number;
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

export type MusicCardOuterIconId =
  | 'none'
  | 'bow_ribbon'
  | 'note_sparkle'
  | 'kitty_silhouette'
  | 'bunny_silhouette'
  | 'bear_silhouette'
  | 'sakura_flower'
  | 'tulip_bloom'
  | 'crescent_moon'
  | 'cloud_dream'
  | 'crystal_heart'
  | 'butterfly_wing'
  | 'crown_mini'
  | 'headphones_cute'
  | 'vinyl_mini'
  | 'teacup_steam'
  | 'clover_leaf'
  | 'cherry_twin'
  | 'star_gem';

export type WallpaperFilterId = 'none' | 'blur_soft';

export type WallpaperMotionId =
  | 'none'
  | 'flowers'
  | 'leaves'
  | 'chains'
  | 'rain_drops'
  | 'sparkles'
  | 'butterflies'
  | 'ribbons';

export type ScreenOverlayFilterId =
  | 'none'
  | 'crystal_drops_tilt'
  | 'fluid_bottom_water'
  | 'rainy_window'
  | 'water_ripples'
  | 'soap_bubbles'
  | 'liquid_mercury'
  | 'plastic_bag'
  | 'crushed_ice'
  | 'frosted_glass'
  | 'silk_veil'
  | 'gold_dust'
  | 'sakura_glass'
  | 'snow_crystal'
  | 'cd_prism'
  | 'vintage_film'
  | 'crt_scanlines';

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
  musicCardOuterIcon?: MusicCardOuterIconId;
  musicCardOuterIconColor?: string;
  settingsTextColorId?: SettingsTextColorId;
  settingsTextCustomHex?: string;
  trackCardWidthPercent?: number;
  trackCardHeightPx?: number;
  wallpaperUrl?: string;
  wallpaperOpacity?: number;
  wallpaperFilter?: WallpaperFilterId;
  wallpaperMotion?: WallpaperMotionId;
  screenOverlayFilter?: ScreenOverlayFilterId;
  screenOverlayIntensity?: number;
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
