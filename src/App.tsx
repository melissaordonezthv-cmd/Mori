import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Maximize2, Minimize2, Share2, X } from 'lucide-react';
import { BottomPlayerBar } from './components/BottomPlayerBar';
import { CuteAvatarFrame } from './components/CuteAvatarFrame';
import { EmojiLockScreen } from './components/EmojiLockScreen';
import { EmojiLockSetupModal } from './components/EmojiLockSetupModal';
import { FloatingOverlayWidget } from './components/FloatingOverlayWidget';
import { type ActivePanelModal, HamburgerMenu } from './components/HamburgerMenu';
import { LibraryView } from './components/LibraryView';
import { MusicPermissionModal } from './components/MusicPermissionModal';
import { NowPlayingPanel } from './components/NowPlayingPanel';
import { PlaylistModal } from './components/PlaylistModal';
import { ProfileModal } from './components/ProfileModal';
import { RecordCelebrationBanner } from './components/RecordCelebrationBanner';
import { SettingsModal } from './components/SettingsModal';
import { SoundEffectsModal } from './components/SoundEffectsModal';
import { ThemeIntroOverlay } from './components/ThemeIntroOverlay';
import { ThemeModal } from './components/ThemeModal';
import { TrackEditModal } from './components/TrackEditModal';
import {
  BackgroundWallpaperLayer,
  ScreenOverlayFilterLayer,
} from './components/WallpaperAndFiltersLayer';
import { UI_TEXT } from './constants/i18n';
import {
  APP_TITLE_COLOR_PRESETS,
  DEFAULT_AVATAR_URL,
  DEFAULT_BANNER_URL,
  DIVIDER_SWATCHES,
  EQ_PRESETS,
  MOOD_AURAS,
  SCREEN_OVERLAY_FILTER_OPTIONS,
  SONG_BAR_SWATCHES,
  SURFACE_SWATCHES,
  TEXT_SWATCHES,
} from './constants/themes';
import { useAppUpdate } from './hooks/useAppUpdate';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useFloatingMiniPlayer } from './hooks/useFloatingMiniPlayer';
import { useListeningRecords } from './hooks/useListeningRecords';
import type {
  AppSettings,
  AudioTrack,
  AvatarFrameId,
  EqPresetId,
  LockConfig,
  Playlist,
  ProfileConfig,
  SoundConfig,
  ThemeConfig,
} from './types/music';
import { playButtonSound } from './utils/asmrSounds';
import { copyTextSafely, getShareableAppUrl } from './utils/shareLink';
import {
  collectAudioFilesFromDirectory,
  createInstantTrackPlaceholder,
  extractTrackMetadataIntoTrack,
  isSupportedAudioFile,
} from './utils/audioMetadata';
import {
  deletePlaylistFromDB,
  deleteTrackFromDB,
  getAllPlaylists,
  getAllTracks,
  getMusicDirHandle,
  type PersistableDirectoryHandle,
  registerMemoryBlob,
  saveMusicDirHandle,
  savePlaylist,
  saveTrack,
  saveTracksBatch,
} from './utils/db';
import { generateStarterSampleTracks } from './utils/sampleTracks';

const STORAGE_THEME_KEY = 'morinote_theme_v1';
const STORAGE_PROFILE_KEY = 'morinote_profile_v1';
const STORAGE_SETTINGS_KEY = 'morinote_settings_v1';
const STORAGE_LOCK_KEY = 'morinote_lock_v1';
const STORAGE_SOUND_KEY = 'morinote_sounds_v1';
const STORAGE_INITIALIZED_KEY = 'morinote_seeded_v1';
const STORAGE_PERMISSION_DISMISSED_KEY = 'morinote_music_perm_dismissed_v1';

const DEFAULT_LOCK_CONFIG: LockConfig = {
  enabled: false,
  emojis: [],
  hint: '',
};

const DEFAULT_SOUND_CONFIG: SoundConfig = {
  enabled: true,
  lockSound: 'soft_bubbles',
  buttonSound: 'creamy_keycaps',
  volume: 0.75,
  playOnTextInputs: true,
};

const DEFAULT_THEME: ThemeConfig = {
  backgroundColorId: 'rosa',
  playerColorId: 'rosa',
  dividerColorId: 'rosa',
  textColorId: 'negro',
  appTitleColorId: 'auto',
  appTitleCustomHex: '',
  songBarColorId: 'auto',
  songBarAnimationId: 'shimmer_glow',
  songTitleShapeId: 'cloud_plush',
  songTitleColorId: 'auto',
  songTitleCustomBg: '',
  songTitleCustomText: '',
  trackCardStyleId: 'classic_row',
  trackCardDecorId: 'auto',
  trackCardColorId: 'auto',
  trackCardCustomBg: '',
  trackCardCustomText: '',
  trackCardOpacity: 100,
  trackCardBlur: 0,
  buttonThemeId: 'soft_pill',
  buttonCustomBg: '',
  buttonCustomText: '',
  playbackBtnStyleId: 'cushion_3d',
  playbackBtnColorId: 'auto',
  playbackPlayBg: '',
  playbackNavBg: '',
  playbackPlayIcon: '',
  playbackNavIcon: '',
  playbackRimColor: '',
  bannerImageUrl: '',
  bannerText: '',
  compactThemeLists: true,
  moodSyncEnabled: true,
};

const DEFAULT_PROFILE: ProfileConfig = {
  displayName: 'Mei · 茉莉',
  handle: 'meimelody',
  bio: 'Coleccionando melodías sin pérdida en tardes de lluvia y té matcha.',
  avatarUrl: DEFAULT_AVATAR_URL,
  bannerUrl: DEFAULT_BANNER_URL,
  avatarFrame: 'sakura',
  nameShape: 'cloud',
  activeCharms: ['cassette', 'ribbon', 'matcha', 'cloud'],
  favoriteGenre: 'Indie Pastel · Lo-Fi',
  cityTag: 'Nube Suave',
};

const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  eqPreset: 'flat',
  eqBands: [0, 0, 0, 0, 0],
  audioMode: 'apple_master',
  soundCheckEnabled: true,
  spatialWidth: 65,
  playbackSpeed: 1,
  backgroundPlaybackEnabled: true,
  layoutOrientation: 'auto',
  nowPlayingVisual: 'cover_classic',
  nowPlayingColorMode: 'theme',
  nowPlayingPrimaryColor: '#F4B8CC',
  nowPlayingSecondaryColor: '#FFF5F8',
  nowPlayingAccentColor: '#E5C185',
  nowPlayingDetailColor: '#2E2A36',
  nowPlayingHideCover: false,
  musicCardOuterIcon: 'note_sparkle',
  musicCardOuterIconColor: 'auto',
  settingsTextColorId: 'auto',
  settingsTextCustomHex: '',
  trackCardWidthPercent: 78,
  trackCardHeightPx: 118,
  wallpaperUrl: '',
  wallpaperOpacity: 85,
  wallpaperFilter: 'none',
  wallpaperMotion: 'none',
  screenOverlayFilter: 'none',
  screenOverlayIntensity: 65,
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not persist ${key} to localStorage:`, err);
  }
}

export default function App() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [theme, setTheme] = useState<ThemeConfig>(() =>
    readStored(STORAGE_THEME_KEY, DEFAULT_THEME)
  );
  const [profile, setProfile] = useState<ProfileConfig>(() =>
    readStored(STORAGE_PROFILE_KEY, DEFAULT_PROFILE)
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    readStored(STORAGE_SETTINGS_KEY, DEFAULT_SETTINGS)
  );
  const [lockConfig, setLockConfig] = useState<LockConfig>(() =>
    readStored(STORAGE_LOCK_KEY, DEFAULT_LOCK_CONFIG)
  );
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(() =>
    readStored(STORAGE_SOUND_KEY, DEFAULT_SOUND_CONFIG)
  );
  const initialHasLock =
    lockConfig.enabled && Array.isArray(lockConfig.emojis) && lockConfig.emojis.length === 4;

  const [activeModal, setActiveModal] = useState<ActivePanelModal>(null);
  const [editingTrack, setEditingTrack] = useState<AudioTrack | null>(null);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [mobilePlayerOpen, setMobilePlayerOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ done: number; total: number } | null>(null);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean>(initialHasLock);
  const [showIntro, setShowIntro] = useState<boolean>(!initialHasLock);
  const [dbReady, setDbReady] = useState(false);
  const [musicPermissionOpen, setMusicPermissionOpen] = useState(false);
  const [savedFolderName, setSavedFolderName] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(() =>
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const savedDirHandleRef = useRef<FileSystemDirectoryHandle | null>(null);
  const permissionFolderInputRef = useRef<HTMLInputElement | null>(null);
  const permissionFilesInputRef = useRef<HTMLInputElement | null>(null);
  const permCheckedRef = useRef(false);
  const tracksRef = useRef<AudioTrack[]>([]);
  tracksRef.current = tracks;
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isLandscape:
      typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : true,
  }));

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight,
      });
    };
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setFullscreenError(null);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    setFullscreenError(null);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        setFullscreenError(
          'Tu navegador no permite pantalla completa directa desde aquí; abre el enlace en una pestaña o instálala.'
        );
      }
    } catch {
      setFullscreenError(
        'Para pantalla completa, abre la app fuera de la vista previa o añade la app a tu pantalla de inicio.'
      );
    }
  }, []);

  const orientationPref = settings.layoutOrientation ?? 'auto';
  const isSplitLayout =
    orientationPref === 'landscape'
      ? true
      : orientationPref === 'portrait'
        ? false
        : (viewport.isLandscape && viewport.width >= 600) || viewport.width >= 1024;
  const isCompactSplit = isSplitLayout && viewport.height < 840;

  useEffect(() => {
    if (isSplitLayout && mobilePlayerOpen) {
      setMobilePlayerOpen(false);
    }
  }, [isSplitLayout, mobilePlayerOpen]);

  const t = UI_TEXT[settings.language] ?? UI_TEXT.es;

  // Apply dynamic theme CSS variables globally whenever user customizes Tema
  const bgSwatch = useMemo(
    () => SURFACE_SWATCHES.find((s) => s.id === theme.backgroundColorId) ?? SURFACE_SWATCHES[0],
    [theme.backgroundColorId]
  );
  const playerSwatch = useMemo(
    () => SURFACE_SWATCHES.find((s) => s.id === theme.playerColorId) ?? SURFACE_SWATCHES[0],
    [theme.playerColorId]
  );
  const textSwatch = useMemo(
    () => TEXT_SWATCHES.find((s) => s.id === theme.textColorId) ?? TEXT_SWATCHES[0],
    [theme.textColorId]
  );
  const dividerSwatch = useMemo(
    () => DIVIDER_SWATCHES.find((d) => d.id === theme.dividerColorId) ?? DIVIDER_SWATCHES[0],
    [theme.dividerColorId]
  );
  const songBarColor = useMemo(() => {
    const sw = SONG_BAR_SWATCHES.find((s) => s.id === theme.songBarColorId);
    if (!sw || sw.id === 'auto') return playerSwatch.accent;
    return sw.color;
  }, [theme.songBarColorId, playerSwatch.accent]);
  const appTitleColor = useMemo(() => {
    const titleId = theme.appTitleColorId ?? 'auto';
    if (titleId === 'custom') {
      return theme.appTitleCustomHex || 'var(--text-main)';
    }
    const preset = APP_TITLE_COLOR_PRESETS.find((c) => c.id === titleId);
    if (!preset || preset.hex === 'auto' || preset.hex === 'custom') {
      return 'var(--text-main)';
    }
    return preset.hex;
  }, [theme.appTitleColorId, theme.appTitleCustomHex]);

  useEffect(() => {
    writeStored(STORAGE_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    writeStored(STORAGE_PROFILE_KEY, profile);
  }, [profile]);

  useEffect(() => {
    writeStored(STORAGE_SETTINGS_KEY, settings);
  }, [settings]);

  useEffect(() => {
    writeStored(STORAGE_LOCK_KEY, lockConfig);
  }, [lockConfig]);

  useEffect(() => {
    writeStored(STORAGE_SOUND_KEY, soundConfig);
  }, [soundConfig]);

  // Global zero-latency tactile ASMR sounds for buttons and optional text typing
  useEffect(() => {
    if (!soundConfig.enabled || soundConfig.buttonSound === 'off') return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, [role="button"], [role="menuitem"], [role="switch"], [role="tab"], summary'
      ) as HTMLElement | null;
      if (!interactive) return;

      if (
        interactive instanceof HTMLButtonElement &&
        interactive.disabled
      ) {
        return;
      }

      const soundRole = interactive.closest('[data-sound-role]')?.getAttribute('data-sound-role');
      if (soundRole === 'lock-key' || soundRole === 'preview') return;
      if (interactive.closest('[data-no-global-sound="true"]')) return;

      playButtonSound(soundConfig.buttonSound, soundConfig.volume);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!soundConfig.playOnTextInputs) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        e.key === 'Shift' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab' ||
        e.key === 'Escape'
      ) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isTextField =
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLInputElement &&
          !['range', 'checkbox', 'radio', 'file', 'color'].includes(target.type));
      if (!isTextField) return;

      playButtonSound(soundConfig.buttonSound, soundConfig.volume * 0.85);
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [
    soundConfig.enabled,
    soundConfig.buttonSound,
    soundConfig.volume,
    soundConfig.playOnTextInputs,
  ]);

  // Hydrate library from IndexedDB on first mount
  useEffect(() => {
    let active = true;
    async function initLibrary() {
      try {
        const [storedTracks, storedPlaylists] = await Promise.all([
          getAllTracks(),
          getAllPlaylists(),
        ]);

        const alreadySeeded = localStorage.getItem(STORAGE_INITIALIZED_KEY);
        if (storedTracks.length === 0 && !alreadySeeded) {
          const starter = generateStarterSampleTracks();
          for (const item of starter.tracks) {
            await saveTrack(item.track, item.blob);
          }
          await savePlaylist(starter.defaultPlaylist);
          localStorage.setItem(STORAGE_INITIALIZED_KEY, '1');
          if (active) {
            setTracks(starter.tracks.map((s) => s.track));
            setPlaylists([starter.defaultPlaylist]);
          }
        } else if (active) {
          setTracks(storedTracks);
          setPlaylists(storedPlaylists);
        }
      } catch (err) {
        console.error('Error initializing local audio DB:', err);
      } finally {
        if (active) setDbReady(true);
      }
    }
    initLibrary();
    return () => {
      active = false;
    };
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleTrackPlayed = useCallback((trackId: string) => {
    setTracks((prev) =>
      prev.map((tr) => {
        if (tr.id !== trackId) return tr;
        const updated = { ...tr, playCount: tr.playCount + 1 };
        saveTrack(updated).catch(() => {});
        return updated;
      })
    );
  }, []);

  const audio = useAudioEngine({
    tracks,
    eqBands: settings.eqBands,
    audioMode: settings.audioMode ?? 'apple_master',
    soundCheckEnabled: settings.soundCheckEnabled ?? true,
    spatialWidth: settings.spatialWidth ?? 65,
    playbackSpeed: settings.playbackSpeed,
    backgroundPlaybackEnabled: settings.backgroundPlaybackEnabled,
    onTrackPlayed: handleTrackPlayed,
  });

  const appUpdate = useAppUpdate();
  const listeningRecords = useListeningRecords({
    isLocked,
    isPlaying: audio.isPlaying,
    liveDisplayActive: activeModal === 'profile',
  });

  // Apply CSS variables and dynamic browser edge theme-color whenever theme updates
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-app', bgSwatch.bgApp);
    root.style.setProperty('--bg-surface', playerSwatch.bgSurface);
    root.style.setProperty('--bg-elevated', playerSwatch.bgElevated);
    root.style.setProperty('--accent-color', playerSwatch.accent);
    root.style.setProperty('--accent-soft', playerSwatch.accentSoft);
    root.style.setProperty('--song-bar-color', songBarColor);
    root.style.setProperty('--text-main', textSwatch.hex);
    root.style.setProperty('--text-muted', textSwatch.mutedHex);
    root.style.setProperty('--divider-color', dividerSwatch.color);

    root.style.backgroundColor = bgSwatch.bgApp;
    document.body.style.backgroundColor = bgSwatch.bgApp;
    root.style.colorScheme = bgSwatch.isDark ? 'dark' : 'light';

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', bgSwatch.bgApp);
    }
    try {
      localStorage.setItem('morinote_last_bg_v1', bgSwatch.bgApp);
    } catch {
      // Ignore storage quota errors
    }

    const mood = audio.currentTrack?.lyrics?.mood;
    if (theme.moodSyncEnabled && mood) {
      const aura = MOOD_AURAS[mood];
      root.style.setProperty('--mood-aura-1', aura.aura1);
      root.style.setProperty('--mood-aura-2', aura.aura2);
    } else {
      root.style.setProperty('--mood-aura-1', playerSwatch.accentSoft);
      root.style.setProperty('--mood-aura-2', 'transparent');
    }
  }, [
    bgSwatch,
    playerSwatch,
    textSwatch,
    dividerSwatch,
    songBarColor,
    theme.moodSyncEnabled,
    audio.currentTrack?.lyrics?.mood,
  ]);

  const activeLyricText = useMemo(() => {
    const lines = audio.currentTrack?.lyrics?.lines ?? [];
    if (lines.length === 0) return '';
    let active = lines[0];
    for (const line of lines) {
      if (audio.currentTime >= line.timeSec) active = line;
    }
    return active?.translated || active?.original || '';
  }, [audio.currentTrack?.lyrics?.lines, audio.currentTime]);

  const handleToggleFavorite = useCallback(
    async (trackId: string) => {
      const target = tracks.find((tr) => tr.id === trackId);
      if (!target) return;
      const updated = { ...target, isFavorite: !target.isFavorite };
      await saveTrack(updated);
      setTracks((prev) => prev.map((tr) => (tr.id === trackId ? updated : tr)));
    },
    [tracks]
  );

  const floating = useFloatingMiniPlayer({
    currentTrack: audio.currentTrack,
    isPlaying: audio.isPlaying,
    currentTime: audio.currentTime,
    duration: audio.duration,
    activeLyric: activeLyricText,
    accentColor: playerSwatch.accent,
    bgSurface: playerSwatch.bgElevated,
    textColor: textSwatch.hex,
    onTogglePlay: audio.togglePlay,
    onNext: () => audio.playNext(false),
    onPrev: audio.playPrev,
    onSeek: audio.seekTo,
    onToggleFavorite: handleToggleFavorite,
  });

  const handleEquipRecordFrame = useCallback((frameId: AvatarFrameId, color: string) => {
    setProfile((prev) => ({
      ...prev,
      avatarFrame: frameId,
      avatarFrameColor: color,
    }));
  }, []);

  const handleImportFiles = useCallback(
    async (fileList: FileList | File[], silentIfAlreadyPresent = false) => {
      const rawFiles = Array.from(fileList);
      if (rawFiles.length === 0) return;

      const supported = rawFiles.filter(isSupportedAudioFile);
      if (supported.length === 0) {
        if (!silentIfAlreadyPresent) {
          setImportSummary('No se encontraron archivos de audio compatibles en tu selección.');
          window.setTimeout(() => setImportSummary(null), 4000);
        }
        return;
      }

      // Deduplicate against already imported tracks
      const existingKeys = new Set(
        tracksRef.current.map((tr) => `${tr.fileSize}:${tr.title.trim().toLowerCase()}`)
      );
      const files = supported.filter((file) => {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_]+/g, ' ')
          .trim()
          .toLowerCase();
        const dashIdx = cleanName.indexOf(' - ');
        const parsedTitle =
          dashIdx > 0 && dashIdx < cleanName.length - 3
            ? cleanName.slice(dashIdx + 3).trim()
            : cleanName;
        return (
          !existingKeys.has(`${file.size}:${cleanName}`) &&
          !existingKeys.has(`${file.size}:${parsedTitle}`)
        );
      });

      if (files.length === 0) {
        if (!silentIfAlreadyPresent) {
          setImportSummary('Esas canciones ya estaban en tu biblioteca.');
          window.setTimeout(() => setImportSummary(null), 3500);
        }
        return;
      }

      // 1. Add ALL tracks to UI & memory cache IMMEDIATELY so songs appear at once and play right away
      const instantPairs = files.map((file, idx) => {
        const track = createInstantTrackPlaceholder(file, idx);
        registerMemoryBlob(track.id, file);
        return { file, track };
      });
      const instantTracks = instantPairs.map((p) => p.track);

      setTracks((prev) => [...instantTracks, ...prev]);

      if (!audio.currentTrackId && instantTracks.length > 0) {
        audio.loadAndPlayTrack(
          instantTracks[0].id,
          instantTracks.map((tr) => tr.id)
        );
      }

      setIsImporting(true);
      setImportSummary(null);
      setImportProgress({ done: 0, total: instantPairs.length });

      // 2. Extract metadata, shrink cover thumbnails, and batch-save to IndexedDB in the background
      try {
        const CHUNK_SIZE = 6;
        for (let start = 0; start < instantPairs.length; start += CHUNK_SIZE) {
          const slice = instantPairs.slice(start, start + CHUNK_SIZE);
          const enrichedBatch = await Promise.all(
            slice.map(async ({ file, track }) => {
              const enriched = await extractTrackMetadataIntoTrack(file, track);
              return { track: enriched, blob: file };
            })
          );

          const enrichedMap = new Map(enrichedBatch.map((b) => [b.track.id, b.track]));
          setTracks((prev) => prev.map((tr) => enrichedMap.get(tr.id) ?? tr));

          await saveTracksBatch(enrichedBatch);

          setImportProgress({
            done: Math.min(instantPairs.length, start + slice.length),
            total: instantPairs.length,
          });
        }

        setImportSummary(
          instantTracks.length === 1
            ? 'Se agregó 1 canción a tu biblioteca.'
            : `Se agregaron ${instantTracks.length} canciones a tu biblioteca.`
        );
        window.setTimeout(() => setImportSummary(null), 4000);
      } catch (err) {
        console.error('Error importing audio files:', err);
      } finally {
        setIsImporting(false);
        setImportProgress(null);
      }
    },
    [audio]
  );

  const syncFromDirectoryHandle = useCallback(
    async (dirHandle: FileSystemDirectoryHandle, silentIfAlreadyPresent = false) => {
      try {
        const files = await collectAudioFilesFromDirectory(dirHandle);
        if (files.length > 0) {
          await handleImportFiles(files, silentIfAlreadyPresent);
        }
      } catch (err) {
        console.error('Error scanning music folder:', err);
      }
    },
    [handleImportFiles]
  );

  // Prompt or auto-sync saved music directory on entry (once unlocked and intro finishes)
  useEffect(() => {
    if (!dbReady || isLocked || showIntro || permCheckedRef.current) return;
    permCheckedRef.current = true;

    let active = true;
    async function checkSavedMusicFolder() {
      const handle = await getMusicDirHandle();
      if (!active) return;

      if (handle) {
        savedDirHandleRef.current = handle;
        setSavedFolderName(handle.name);
        try {
          const perm = await (handle as PersistableDirectoryHandle).queryPermission?.({
            mode: 'read',
          });
          if (!active) return;
          if (perm === 'granted') {
            await syncFromDirectoryHandle(handle, true);
            return;
          }
        } catch {
          // Fall through to prompt modal
        }
        if (!localStorage.getItem(STORAGE_PERMISSION_DISMISSED_KEY)) {
          setMusicPermissionOpen(true);
        }
      } else if (!localStorage.getItem(STORAGE_PERMISSION_DISMISSED_KEY)) {
        setSavedFolderName(null);
        setMusicPermissionOpen(true);
      }
    }

    checkSavedMusicFolder();
    return () => {
      active = false;
    };
  }, [dbReady, isLocked, showIntro, syncFromDirectoryHandle]);

  const handleSaveDirectoryHandle = useCallback((handle: FileSystemDirectoryHandle) => {
    savedDirHandleRef.current = handle;
    setSavedFolderName(handle.name);
    saveMusicDirHandle(handle).catch(() => {});
  }, []);

  const handleConnectMusicFolder = async () => {
    const saved = savedDirHandleRef.current as PersistableDirectoryHandle | null;
    if (saved && typeof saved.requestPermission === 'function') {
      try {
        const res = await saved.requestPermission({ mode: 'read' });
        if (res === 'granted') {
          setMusicPermissionOpen(false);
          await syncFromDirectoryHandle(saved, false);
          return;
        }
      } catch {
        // Fall through to fresh folder picker
      }
    }

    const picker = (
      window as unknown as { showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle> }
    ).showDirectoryPicker;
    if (typeof picker === 'function') {
      try {
        const dirHandle = await picker();
        handleSaveDirectoryHandle(dirHandle);
        setMusicPermissionOpen(false);
        await syncFromDirectoryHandle(dirHandle, false);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
      }
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      permissionFilesInputRef.current?.click();
    } else {
      permissionFolderInputRef.current?.click();
    }
  };

  const handleLoadSampleTracks = useCallback(async () => {
    const starter = generateStarterSampleTracks();
    for (const item of starter.tracks) {
      await saveTrack(item.track, item.blob);
    }
    setTracks((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const fresh = starter.tracks.map((s) => s.track).filter((tr) => !existingIds.has(tr.id));
      return [...fresh, ...prev];
    });
  }, []);

  const handleSaveEditedTrack = useCallback(async (updated: AudioTrack) => {
    await saveTrack(updated);
    setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
  }, []);

  const handleDeleteTrack = useCallback(async (trackId: string) => {
    await deleteTrackFromDB(trackId);
    setTracks((prev) => prev.filter((tr) => tr.id !== trackId));
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (!pl.trackIds.includes(trackId)) return pl;
        const nextPl = {
          ...pl,
          trackIds: pl.trackIds.filter((id) => id !== trackId),
          updatedAt: Date.now(),
        };
        savePlaylist(nextPl).catch(() => {});
        return nextPl;
      })
    );
  }, []);

  const handleSavePlaylist = useCallback(async (playlist: Playlist) => {
    await savePlaylist(playlist);
    setPlaylists((prev) => {
      const exists = prev.some((p) => p.id === playlist.id);
      return exists ? prev.map((p) => (p.id === playlist.id ? playlist : p)) : [playlist, ...prev];
    });
  }, []);

  const handleDeletePlaylist = useCallback(async (playlistId: string) => {
    await deletePlaylistFromDB(playlistId);
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }, []);

  const handleAddTrackToPlaylist = useCallback(
    async (playlistId: string, trackId: string) => {
      const target = playlists.find((p) => p.id === playlistId);
      if (!target || target.trackIds.includes(trackId)) return;
      const updated: Playlist = {
        ...target,
        trackIds: [...target.trackIds, trackId],
        updatedAt: Date.now(),
      };
      await savePlaylist(updated);
      setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? updated : p)));
    },
    [playlists]
  );

  const handleAddTracksToPlaylist = useCallback(
    async (playlistId: string, trackIds: string[]) => {
      const target = playlists.find((p) => p.id === playlistId);
      if (!target || trackIds.length === 0) return;
      const existingSet = new Set(target.trackIds);
      const additions = trackIds.filter((id) => !existingSet.has(id));
      if (additions.length === 0) return;
      const updated: Playlist = {
        ...target,
        trackIds: [...target.trackIds, ...additions],
        updatedAt: Date.now(),
      };
      await savePlaylist(updated);
      setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? updated : p)));
    },
    [playlists]
  );

  const handleRemoveTrackFromPlaylist = useCallback(
    async (playlistId: string, trackId: string) => {
      const target = playlists.find((p) => p.id === playlistId);
      if (!target) return;
      const updated: Playlist = {
        ...target,
        trackIds: target.trackIds.filter((id) => id !== trackId),
        updatedAt: Date.now(),
      };
      await savePlaylist(updated);
      setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? updated : p)));
    },
    [playlists]
  );

  const handleQuickUpdateCover = useCallback(async (track: AudioTrack, newCoverUrl: string) => {
    const updated = { ...track, coverUrl: newCoverUrl };
    await saveTrack(updated);
    setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
  }, []);

  const handleSaveManualLyrics = useCallback(
    async (track: AudioTrack, rawText: string) => {
      const rawLines = rawText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (rawLines.length === 0) return;

      const lrcRegex = /^\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/;
      const parsedTimestamped: Array<{ timeSec: number; original: string; translated: string }> = [];
      const plainLines: string[] = [];

      for (const row of rawLines) {
        const match = row.match(lrcRegex);
        if (match) {
          const mins = parseInt(match[1], 10);
          const secs = parseInt(match[2], 10);
          const frac = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) / 1000 : 0;
          const lyricText = match[4].trim();
          if (lyricText) {
            parsedTimestamped.push({
              timeSec: Math.max(0, mins * 60 + secs + frac),
              original: lyricText,
              translated: '',
            });
          }
        } else {
          plainLines.push(row);
        }
      }

      const totalDuration = Math.max(20, track.duration || audio.duration || 180);
      const finalLines =
        parsedTimestamped.length > 0
          ? parsedTimestamped.sort((a, b) => a.timeSec - b.timeSec)
          : plainLines.map((text, idx) => {
              const startSec = Math.min(4, totalDuration * 0.04);
              const endSec = Math.max(startSec + 4, totalDuration * 0.94);
              const ratio = plainLines.length <= 1 ? 0 : idx / (plainLines.length - 1);
              return {
                timeSec: Math.round((startSec + ratio * (endSec - startSec)) * 10) / 10,
                original: text,
                translated: '',
              };
            });

      const updated: AudioTrack = {
        ...track,
        lyrics: {
          detectedLanguage: 'Manual',
          targetLanguage: settings.language,
          isInstrumental: false,
          mood: track.lyrics?.mood || 'serene',
          moodLabel: 'Letra guardada',
          moodDescription: '',
          suggestedAura: playerSwatch.accent,
          tempoFeeling: 'medium',
          lines: finalLines,
          updatedAt: Date.now(),
        },
      };
      await saveTrack(updated);
      setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
    },
    [audio.duration, playerSwatch.accent, settings.language]
  );

  const handleClearLyrics = useCallback(async (track: AudioTrack) => {
    const updated: AudioTrack = { ...track, lyrics: undefined };
    await saveTrack(updated);
    setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
  }, []);

  const handlePlayFromLibrary = useCallback(
    (trackId: string, queueIds?: string[]) => {
      audio.loadAndPlayTrack(trackId, queueIds);
    },
    [audio]
  );

  const handleOpenCreatePlaylist = useCallback(() => {
    setEditingPlaylist(null);
    setPlaylistModalOpen(true);
  }, []);

  const handleOpenEditPlaylist = useCallback((pl: Playlist) => {
    setEditingPlaylist(pl);
    setPlaylistModalOpen(true);
  }, []);

  const handleNextTrack = useCallback(() => {
    audio.playNext(false);
  }, [audio]);

  const handleOpenMobilePlayer = useCallback(() => {
    setMobilePlayerOpen(true);
  }, []);

  const handleShareLink = async () => {
    const shareUrl = getShareableAppUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MoriNote · Música Sin Pérdida',
          text: `Escucha música en MoriNote — perfil de ${profile.displayName}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy if user cancels share dialog or iframe blocks navigator.share
      }
    }
    const ok = await copyTextSafely(shareUrl);
    if (ok) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2400);
    }
  };

  const handleResetAppearance = useCallback(() => {
    setTheme({ ...DEFAULT_THEME });
    setSettings((prev) => ({
      ...prev,
      nowPlayingVisual: DEFAULT_SETTINGS.nowPlayingVisual,
      nowPlayingColorMode: DEFAULT_SETTINGS.nowPlayingColorMode,
      nowPlayingPrimaryColor: DEFAULT_SETTINGS.nowPlayingPrimaryColor,
      nowPlayingSecondaryColor: DEFAULT_SETTINGS.nowPlayingSecondaryColor,
      nowPlayingAccentColor: DEFAULT_SETTINGS.nowPlayingAccentColor,
      nowPlayingDetailColor: DEFAULT_SETTINGS.nowPlayingDetailColor,
      nowPlayingHideCover: DEFAULT_SETTINGS.nowPlayingHideCover,
      musicCardOuterIcon: DEFAULT_SETTINGS.musicCardOuterIcon,
      musicCardOuterIconColor: DEFAULT_SETTINGS.musicCardOuterIconColor,
      settingsTextColorId: DEFAULT_SETTINGS.settingsTextColorId,
      settingsTextCustomHex: DEFAULT_SETTINGS.settingsTextCustomHex,
      trackCardWidthPercent: DEFAULT_SETTINGS.trackCardWidthPercent,
      trackCardHeightPx: DEFAULT_SETTINGS.trackCardHeightPx,
      wallpaperUrl: DEFAULT_SETTINGS.wallpaperUrl,
      wallpaperOpacity: DEFAULT_SETTINGS.wallpaperOpacity,
      wallpaperFilter: DEFAULT_SETTINGS.wallpaperFilter,
      wallpaperMotion: DEFAULT_SETTINGS.wallpaperMotion,
      screenOverlayFilter: DEFAULT_SETTINGS.screenOverlayFilter,
      screenOverlayIntensity: DEFAULT_SETTINGS.screenOverlayIntensity,
    }));
  }, []);

  const handleApplyStyleCode = useCallback(
    (nextTheme: ThemeConfig, nextProfile: ProfileConfig, nextSettings: AppSettings) => {
      setTheme(nextTheme);
      setProfile(nextProfile);
      setSettings(nextSettings);
    },
    []
  );

  const stats = useMemo(
    () => ({
      tracks: tracks.length,
      playlists: playlists.length,
      lossless: tracks.filter((tr) => tr.lossless).length,
      totalPlays: tracks.reduce((sum, tr) => sum + (tr.playCount || 0), 0),
    }),
    [tracks, playlists]
  );

  const hasAmbientBackground =
    Boolean(settings.wallpaperUrl) || (settings.wallpaperMotion ?? 'none') !== 'none';

  return (
    <div
      data-btn-theme={theme.buttonThemeId ?? 'soft_pill'}
      data-btn-custom={theme.buttonCustomBg ? 'true' : undefined}
      className="relative h-dvh overflow-hidden flex flex-col transition-colors duration-300"
      style={
        {
          backgroundColor: 'var(--bg-app)',
          color: 'var(--text-main)',
          backgroundImage:
            !settings.wallpaperUrl && theme.moodSyncEnabled
              ? 'radial-gradient(circle at 12% 8%, var(--mood-aura-1), transparent 45%), radial-gradient(circle at 88% 12%, var(--mood-aura-2), transparent 42%)'
              : undefined,
          '--btn-custom-bg': theme.buttonCustomBg || undefined,
          '--btn-custom-text': theme.buttonCustomText || '#1C1B1F',
        } as React.CSSProperties
      }
    >
      {/* Background Wallpaper + Nature/Chains Motion Layer Behind All Accessories */}
      <BackgroundWallpaperLayer
        wallpaperUrl={settings.wallpaperUrl}
        opacity={settings.wallpaperOpacity ?? 85}
        filterId={settings.wallpaperFilter ?? 'none'}
        motionId={settings.wallpaperMotion ?? 'none'}
      />

      {/* Full-Screen Optional Screen Overlay Filter (Plastic Bag, Rainy Window, etc.) */}
      <ScreenOverlayFilterLayer
        filterId={settings.screenOverlayFilter ?? 'none'}
        intensity={settings.screenOverlayIntensity ?? 65}
      />

      <EmojiLockScreen
        open={isLocked}
        expectedEmojis={lockConfig.emojis}
        hint={lockConfig.hint}
        profile={profile}
        soundConfig={soundConfig}
        bgSwatch={bgSwatch}
        playerSwatch={playerSwatch}
        textSwatch={textSwatch}
        onUnlock={() => {
          setIsLocked(false);
          setShowIntro(true);
        }}
        onResetLock={() => {
          setLockConfig({ enabled: false, emojis: [], hint: '' });
          setIsLocked(false);
          setShowIntro(true);
        }}
      />

      <ThemeIntroOverlay
        visible={showIntro && !isLocked}
        bgSwatch={bgSwatch}
        playerSwatch={playerSwatch}
        textSwatch={textSwatch}
        onComplete={handleIntroComplete}
      />

      <RecordCelebrationBanner
        event={listeningRecords.celebration}
        avatarUrl={profile.avatarUrl}
        displayName={profile.displayName}
        currentFrameColor={profile.avatarFrameColor}
        onEquipFrame={handleEquipRecordFrame}
        onDismiss={listeningRecords.dismissCelebration}
      />
      {/* Top Bar: 3-line corner hamburger menu + Brand wordmark + Profile/Share */}
      <header
        className="relative shrink-0 z-30 border-b backdrop-blur-md"
        style={{
          backgroundColor: hasAmbientBackground
            ? 'color-mix(in srgb, var(--bg-app) 76%, transparent)'
            : 'var(--bg-app)',
          borderColor: 'var(--divider-color)',
        }}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 ${
            isCompactSplit ? 'h-14' : 'h-16'
          }`}
        >
          {/* Corner Three-Line Menu + Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerMenu
              t={t}
              hasUpdate={appUpdate.hasUpdate}
              onSelect={(panel) => {
                if (panel === 'settings') {
                  void appUpdate.checkForUpdates(false);
                }
                setActiveModal(panel);
              }}
            />
            <div className="min-w-0">
              <h1
                className="text-base sm:text-xl font-extrabold tracking-tight leading-tight truncate font-display transition-colors"
                style={{ color: appTitleColor }}
              >
                MoriNote · 茉莉音
              </h1>
              <p
                className="text-[10px] sm:text-[11px] font-medium leading-tight truncate opacity-80"
                style={{ color: appTitleColor }}
              >
                Ideas por Melissa
              </p>
            </div>
          </div>

          {/* Right Quick Actions: Fullscreen + Share Link + Cute Profile Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              className="min-w-[42px] min-h-[42px] px-2.5 rounded-2xl border flex items-center justify-center transition"
              style={{
                backgroundColor: isFullscreen ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              className="min-h-[42px] px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {linkCopied ? t.linkCopied : t.shareAppLink}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('profile')}
              aria-label={t.menuProfile}
              className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border transition hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <CuteAvatarFrame
                avatarUrl={profile.avatarUrl}
                displayName={profile.displayName}
                frame={profile.avatarFrame}
                frameColor={profile.avatarFrameColor}
                size="sm"
              />
              <span className="hidden md:inline text-xs font-semibold max-w-[110px] truncate">
                {profile.displayName}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Workspace: Natural 2-pane split in tablet/horizontal mode or single column in portrait */}
      <main
        className={
          isSplitLayout
            ? `relative z-10 flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 sm:px-6 ${
                isCompactSplit ? 'pt-3' : 'pt-4'
              } grid grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-3 sm:gap-5 overflow-hidden items-stretch`
            : 'relative z-10 flex-1 min-h-0 w-full max-w-3xl mx-auto px-3 sm:px-6 pt-3 pb-[76px] flex flex-col overflow-hidden'
        }
      >
        <div
          className={
            isSplitLayout
              ? 'h-full min-h-0 flex flex-col pr-2 sm:pr-3 pb-3 min-w-0 border-r overflow-hidden'
              : 'flex-1 min-h-0 flex flex-col min-w-0 overflow-hidden'
          }
          style={isSplitLayout ? { borderColor: 'var(--divider-color)' } : undefined}
        >
          <LibraryView
            tracks={tracks}
            playlists={playlists}
            currentTrackId={audio.currentTrackId}
            isPlaying={audio.isPlaying}
            isImporting={isImporting}
            importProgress={importProgress}
            importSummary={importSummary}
            bannerImageUrl={theme.bannerImageUrl}
            bannerText={theme.bannerText}
            trackCardStyleId={theme.trackCardStyleId ?? 'classic_row'}
            trackCardDecorId={theme.trackCardDecorId ?? 'auto'}
            trackCardColorId={theme.trackCardColorId ?? 'auto'}
            trackCardCustomBg={theme.trackCardCustomBg}
            trackCardCustomText={theme.trackCardCustomText}
            trackCardOpacity={theme.trackCardOpacity ?? 100}
            trackCardBlur={theme.trackCardBlur ?? 0}
            songTitleShapeId={theme.songTitleShapeId ?? 'cloud_plush'}
            songTitleColorId={theme.songTitleColorId ?? 'auto'}
            songTitleCustomBg={theme.songTitleCustomBg}
            songTitleCustomText={theme.songTitleCustomText}
            trackCardWidthPercent={settings.trackCardWidthPercent ?? 78}
            trackCardHeightPx={settings.trackCardHeightPx ?? 118}
            t={t}
            onImportFiles={handleImportFiles}
            onSaveDirHandle={handleSaveDirectoryHandle}
            onLoadSampleTracks={handleLoadSampleTracks}
            onPlayTrack={handlePlayFromLibrary}
            onTogglePlay={audio.togglePlay}
            onToggleFavorite={handleToggleFavorite}
            onEditTrack={setEditingTrack}
            onDeleteTrack={handleDeleteTrack}
            onCreatePlaylist={handleOpenCreatePlaylist}
            onEditPlaylist={handleOpenEditPlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            onAddTrackToPlaylist={handleAddTrackToPlaylist}
            onAddTracksToPlaylist={handleAddTracksToPlaylist}
            onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
          />
        </div>

        {/* Tablet Horizontal / Desktop Side-by-Side Now Playing Panel */}
        {isSplitLayout && (
          <aside className="h-full min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y pl-0.5 pb-6 min-w-0">
            <NowPlayingPanel
              track={audio.currentTrack}
              tracks={tracks}
              queueIds={audio.queueIds}
              isPlaying={audio.isPlaying}
              currentTime={audio.currentTime}
              duration={audio.duration}
              volume={audio.volume}
              isMuted={audio.isMuted}
              shuffle={audio.shuffle}
              repeat={audio.repeat}
              moodSyncEnabled={theme.moodSyncEnabled}
              songBarAnimation={theme.songBarAnimationId ?? 'shimmer_glow'}
              theme={theme}
              isFloatingOpen={floating.isFloatingOpen}
              isWidgetOpen={floating.isWidgetOpen}
              settings={settings}
              analyserRef={audio.analyserRef}
              accentColor={playerSwatch.accent}
              compactSplit={isCompactSplit}
              t={t}
              onTogglePlay={audio.togglePlay}
              onNext={handleNextTrack}
              onPrev={audio.playPrev}
              onSeek={audio.seekTo}
              onVolumeChange={audio.setVolume}
              onToggleMute={() => audio.setIsMuted((m) => !m)}
              onToggleShuffle={() => audio.setShuffle((s) => !s)}
              onCycleRepeat={() =>
                audio.setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
              }
              onToggleFavorite={handleToggleFavorite}
              onEditTrack={setEditingTrack}
              onQuickUpdateCover={handleQuickUpdateCover}
              onSaveManualLyrics={handleSaveManualLyrics}
              onClearLyrics={handleClearLyrics}
              onPlayTrack={handlePlayFromLibrary}
              onRemoveFromQueue={audio.removeFromQueue}
              onChangeEqPreset={(preset: EqPresetId) =>
                setSettings((prev) => ({
                  ...prev,
                  eqPreset: preset,
                  eqBands: [...EQ_PRESETS[preset].bands] as [
                    number,
                    number,
                    number,
                    number,
                    number,
                  ],
                }))
              }
              onChangeAudioSettings={(partial) =>
                setSettings((prev) => ({ ...prev, ...partial }))
              }
              onToggleFloating={floating.openFloating}
              onToggleWidget={() => floating.setIsWidgetOpen((v) => !v)}
            />
          </aside>
        )}
      </main>

      {/* Portrait / Single-Column Expandable Now Playing Sheet */}
      {!isSplitLayout && mobilePlayerOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto p-4"
          style={{ backgroundColor: 'var(--bg-app)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold">{t.nowPlaying}</span>
            <button
              type="button"
              onClick={() => setMobilePlayerOpen(false)}
              aria-label="Cerrar reproductor"
              className="min-w-[44px] min-h-[44px] rounded-2xl border flex items-center justify-center"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <NowPlayingPanel
            track={audio.currentTrack}
            tracks={tracks}
            queueIds={audio.queueIds}
            isPlaying={audio.isPlaying}
            currentTime={audio.currentTime}
            duration={audio.duration}
            volume={audio.volume}
            isMuted={audio.isMuted}
            shuffle={audio.shuffle}
            repeat={audio.repeat}
            moodSyncEnabled={theme.moodSyncEnabled}
            songBarAnimation={theme.songBarAnimationId ?? 'shimmer_glow'}
            theme={theme}
            isFloatingOpen={floating.isFloatingOpen}
            isWidgetOpen={floating.isWidgetOpen}
            settings={settings}
            analyserRef={audio.analyserRef}
            accentColor={playerSwatch.accent}
            t={t}
            onTogglePlay={audio.togglePlay}
            onNext={handleNextTrack}
            onPrev={audio.playPrev}
            onSeek={audio.seekTo}
            onVolumeChange={audio.setVolume}
            onToggleMute={() => audio.setIsMuted((m) => !m)}
            onToggleShuffle={() => audio.setShuffle((s) => !s)}
            onCycleRepeat={() =>
              audio.setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
            }
            onToggleFavorite={handleToggleFavorite}
            onEditTrack={setEditingTrack}
            onQuickUpdateCover={handleQuickUpdateCover}
            onSaveManualLyrics={handleSaveManualLyrics}
            onClearLyrics={handleClearLyrics}
            onPlayTrack={handlePlayFromLibrary}
            onRemoveFromQueue={audio.removeFromQueue}
            onChangeEqPreset={(preset: EqPresetId) =>
              setSettings((prev) => ({
                ...prev,
                eqPreset: preset,
                eqBands: [...EQ_PRESETS[preset].bands] as [
                  number,
                  number,
                  number,
                  number,
                  number,
                ],
              }))
            }
            onChangeAudioSettings={(partial) =>
              setSettings((prev) => ({ ...prev, ...partial }))
            }
            onToggleFloating={floating.openFloating}
            onToggleWidget={() => floating.setIsWidgetOpen((v) => !v)}
          />
        </div>
      )}

      {/* Persistent Compact Bottom Mini Player (portrait / single-column mode) */}
      {!isSplitLayout && (
        <BottomPlayerBar
          track={audio.currentTrack}
          isPlaying={audio.isPlaying}
          currentTime={audio.currentTime}
          duration={audio.duration}
          songBarAnimation={theme.songBarAnimationId ?? 'shimmer_glow'}
          theme={theme}
          isFloatingOpen={floating.isFloatingOpen}
          onTogglePlay={audio.togglePlay}
          onNext={handleNextTrack}
          onPrev={audio.playPrev}
          onOpenMobilePlayer={handleOpenMobilePlayer}
          onToggleFloating={floating.openFloating}
        />
      )}

      {/* Corner Menu Modals: Perfil, Tema, Ajustes */}
      <ProfileModal
        open={activeModal === 'profile'}
        profile={profile}
        stats={stats}
        records={listeningRecords.records}
        sessionSeconds={listeningRecords.sessionSeconds}
        unlockedFrameIds={listeningRecords.unlockedFrameIds}
        t={t}
        onChange={setProfile}
        onShareLink={handleShareLink}
        onClose={() => setActiveModal(null)}
      />

      <ThemeModal
        open={activeModal === 'theme'}
        theme={theme}
        onChange={setTheme}
        onPreviewIntro={() => {
          setActiveModal(null);
          setShowIntro(true);
        }}
        onOpenMusicCardSettings={() => setActiveModal('settings')}
        onClose={() => setActiveModal(null)}
      />

      {/* Draggable Floating Mini-Controls Widget */}
      <FloatingOverlayWidget
        open={floating.isWidgetOpen}
        track={audio.currentTrack}
        isPlaying={audio.isPlaying}
        currentTime={audio.currentTime}
        duration={audio.duration}
        activeLyric={activeLyricText}
        theme={theme}
        onTogglePlay={audio.togglePlay}
        onPrev={audio.playPrev}
        onNext={() => audio.playNext(false)}
        onPopOutOS={floating.openFloating}
        onClose={() => floating.setIsWidgetOpen(false)}
      />

      <SettingsModal
        open={activeModal === 'settings'}
        settings={settings}
        theme={theme}
        profile={profile}
        sleepMinutesRemaining={audio.sleepMinutesRemaining}
        sleepOnTrackEnd={audio.sleepOnTrackEnd}
        isFloatingOpen={floating.isFloatingOpen}
        isWidgetOpen={floating.isWidgetOpen}
        floatingError={floating.floatingError}
        isSplitActive={isSplitLayout}
        isFullscreen={isFullscreen}
        fullscreenError={fullscreenError}
        t={t}
        onChangeSettings={setSettings}
        onChangeTheme={setTheme}
        onApplyStyleCode={handleApplyStyleCode}
        onSetSleepTimer={(mins, onEnd) => {
          audio.setSleepMinutesRemaining(mins);
          audio.setSleepOnTrackEnd(Boolean(onEnd));
        }}
        onToggleFloating={floating.openFloating}
        onToggleWidget={() => floating.setIsWidgetOpen((v) => !v)}
        onToggleFullscreen={toggleFullscreen}
        onOpenMusicPermission={() => setMusicPermissionOpen(true)}
        onOpenTheme={() => setActiveModal('theme')}
        onResetAppearance={handleResetAppearance}
        onShareLink={handleShareLink}
        linkCopied={linkCopied}
        hasUpdate={appUpdate.hasUpdate}
        isUpdating={appUpdate.isUpdating}
        updateMessage={appUpdate.updateMessage}
        onApplyUpdate={appUpdate.applyUpdate}
        onClose={() => {
          appUpdate.clearUpdateMessage();
          setActiveModal(null);
        }}
      />

      {/* Quick Optional Screen Filter Switcher Only Shown During Fullscreen Mode */}
      {isFullscreen && (
        <div
          className="fixed bottom-4 right-4 z-[80] flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border shadow-lg backdrop-blur-md"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg-elevated) 88%, transparent)',
            borderColor: 'var(--divider-color)',
          }}
        >
          <select
            aria-label="Filtro de pantalla completa"
            value={settings.screenOverlayFilter ?? 'none'}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                screenOverlayFilter: e.target.value as AppSettings['screenOverlayFilter'],
              }))
            }
            className="text-xs font-semibold bg-transparent focus:outline-none cursor-pointer pr-1"
            style={{ color: 'var(--text-main)' }}
          >
            {SCREEN_OVERLAY_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} style={{ color: '#1C1B1F' }}>
                Filtro: {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <MusicPermissionModal
        open={musicPermissionOpen && !isLocked && !showIntro}
        savedFolderName={savedFolderName}
        isImporting={isImporting}
        onConnectFolder={handleConnectMusicFolder}
        onSelectFallbackFiles={(files) => handleImportFiles(files)}
        onDismiss={(rememberDontAsk) => {
          if (rememberDontAsk) {
            localStorage.setItem(STORAGE_PERMISSION_DISMISSED_KEY, '1');
          }
          setMusicPermissionOpen(false);
        }}
      />

      <input
        ref={permissionFolderInputRef}
        type="file"
        multiple
        // @ts-expect-error webkitdirectory is standard in Chromium/Safari for local folder access
        webkitdirectory=""
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files ? Array.from(e.target.files) : [];
          e.target.value = '';
          if (picked.length > 0) {
            handleImportFiles(picked);
            setMusicPermissionOpen(false);
          }
        }}
      />

      <input
        ref={permissionFilesInputRef}
        type="file"
        multiple
        accept="audio/*,.flac,.wav,.alac,.aiff,.aif,.m4a,.m4b,.mp3,.ogg,.opus,.aac,.wma,.webm,.mp4"
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files ? Array.from(e.target.files) : [];
          e.target.value = '';
          if (picked.length > 0) {
            handleImportFiles(picked);
            setMusicPermissionOpen(false);
          }
        }}
      />

      <EmojiLockSetupModal
        open={activeModal === 'lock'}
        lockConfig={lockConfig}
        soundConfig={soundConfig}
        onChange={setLockConfig}
        onLockNow={() => {
          setActiveModal(null);
          setShowIntro(false);
          setIsLocked(true);
        }}
        onClose={() => setActiveModal(null)}
      />

      <SoundEffectsModal
        open={activeModal === 'sounds'}
        soundConfig={soundConfig}
        onChange={setSoundConfig}
        onClose={() => setActiveModal(null)}
      />

      {/* Track & Playlist Edit Modals */}
      <TrackEditModal
        key={editingTrack ? `track-${editingTrack.id}` : 'track-edit-closed'}
        track={editingTrack}
        t={t}
        onSave={handleSaveEditedTrack}
        onClose={() => setEditingTrack(null)}
      />

      <PlaylistModal
        key={
          editingPlaylist
            ? `playlist-${editingPlaylist.id}`
            : playlistModalOpen
              ? 'playlist-new'
              : 'playlist-closed'
        }
        open={playlistModalOpen}
        playlist={editingPlaylist}
        tracks={tracks}
        t={t}
        onSave={handleSavePlaylist}
        onClose={() => {
          setPlaylistModalOpen(false);
          setEditingPlaylist(null);
        }}
      />
    </div>
  );
}
