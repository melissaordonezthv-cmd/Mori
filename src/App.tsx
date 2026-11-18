import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Share2, X } from 'lucide-react';
import { BottomPlayerBar } from './components/BottomPlayerBar';
import { CuteAvatarFrame } from './components/CuteAvatarFrame';
import { EmojiLockScreen } from './components/EmojiLockScreen';
import { EmojiLockSetupModal } from './components/EmojiLockSetupModal';
import { FloatingOverlayWidget } from './components/FloatingOverlayWidget';
import { type ActivePanelModal, HamburgerMenu } from './components/HamburgerMenu';
import { LibraryView } from './components/LibraryView';
import { NowPlayingPanel } from './components/NowPlayingPanel';
import { PlaylistModal } from './components/PlaylistModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SoundEffectsModal } from './components/SoundEffectsModal';
import { ThemeIntroOverlay } from './components/ThemeIntroOverlay';
import { ThemeModal } from './components/ThemeModal';
import { TrackEditModal } from './components/TrackEditModal';
import { UI_TEXT } from './constants/i18n';
import {
  DEFAULT_AVATAR_URL,
  DEFAULT_BANNER_URL,
  DIVIDER_SWATCHES,
  EQ_PRESETS,
  MOOD_AURAS,
  SONG_BAR_SWATCHES,
  SURFACE_SWATCHES,
  TEXT_SWATCHES,
} from './constants/themes';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useFloatingMiniPlayer } from './hooks/useFloatingMiniPlayer';
import type {
  AppLanguage,
  AppSettings,
  AudioTrack,
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
  extractTrackFromFile,
  isSupportedAudioFile,
  prepareAudioSnippetForAI,
} from './utils/audioMetadata';
import {
  deletePlaylistFromDB,
  deleteTrackFromDB,
  getAllPlaylists,
  getAllTracks,
  getTrackBlob,
  savePlaylist,
  saveTrack,
} from './utils/db';
import { generateStarterSampleTracks } from './utils/sampleTracks';

const STORAGE_THEME_KEY = 'morinote_theme_v1';
const STORAGE_PROFILE_KEY = 'morinote_profile_v1';
const STORAGE_SETTINGS_KEY = 'morinote_settings_v1';
const STORAGE_LOCK_KEY = 'morinote_lock_v1';
const STORAGE_SOUND_KEY = 'morinote_sounds_v1';
const STORAGE_INITIALIZED_KEY = 'morinote_seeded_v1';

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
  songBarColorId: 'auto',
  moodSyncEnabled: true,
};

const DEFAULT_PROFILE: ProfileConfig = {
  displayName: 'Mei · 茉莉',
  handle: 'meimelody',
  bio: 'Coleccionando melodías sin pérdida en tardes de lluvia y té matcha.',
  avatarUrl: DEFAULT_AVATAR_URL,
  bannerUrl: DEFAULT_BANNER_URL,
  avatarFrame: 'sakura',
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
  autoDetectLyrics: true,
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
  const [isAnalyzingLyrics, setIsAnalyzingLyrics] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean>(initialHasLock);
  const [showIntro, setShowIntro] = useState<boolean>(!initialHasLock);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LOCK_KEY, JSON.stringify(lockConfig));
  }, [lockConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SOUND_KEY, JSON.stringify(soundConfig));
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

  // Apply CSS variables to :root
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

  const autoAnalyzedIdsRef = useRef<Set<string>>(new Set());

  const handleImportFiles = async (fileList: FileList | File[]) => {
    const supported = Array.from(fileList).filter(isSupportedAudioFile);
    if (supported.length === 0) return;

    // Deduplicate against already imported tracks (same file size + matching cleaned filename)
    const existingKeys = new Set(
      tracks.map((tr) => `${tr.fileSize}:${tr.title.trim().toLowerCase()}`)
    );
    const files = supported.filter((file) => {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_]+/g, ' ')
        .trim()
        .toLowerCase();
      return !existingKeys.has(`${file.size}:${cleanName}`);
    });

    if (files.length === 0) {
      setImportSummary('Esas canciones ya estaban en tu biblioteca.');
      window.setTimeout(() => setImportSummary(null), 3500);
      return;
    }

    setIsImporting(true);
    setImportSummary(null);
    setImportProgress({ done: 0, total: files.length });

    try {
      const importedTracks: AudioTrack[] = [];
      const CHUNK_SIZE = 4;

      for (let start = 0; start < files.length; start += CHUNK_SIZE) {
        const slice = files.slice(start, start + CHUNK_SIZE);
        const extracted = await Promise.all(
          slice.map((file, offset) => extractTrackFromFile(file, start + offset))
        );
        for (const item of extracted) {
          await saveTrack(item.track, item.blob);
          importedTracks.push(item.track);
        }
        setImportProgress({
          done: Math.min(files.length, start + slice.length),
          total: files.length,
        });
      }

      setTracks((prev) => [...importedTracks, ...prev]);
      if (!audio.currentTrackId && importedTracks.length > 0) {
        audio.loadAndPlayTrack(importedTracks[0].id, importedTracks.map((tr) => tr.id));
      }
      setImportSummary(
        importedTracks.length === 1
          ? 'Se agregó 1 canción a tu biblioteca.'
          : `Se agregaron ${importedTracks.length} canciones a tu biblioteca.`
      );
      window.setTimeout(() => setImportSummary(null), 4000);
    } catch (err) {
      console.error('Error importing audio files:', err);
    } finally {
      setIsImporting(false);
      setImportProgress(null);
    }
  };

  const handleLoadSampleTracks = async () => {
    const starter = generateStarterSampleTracks();
    for (const item of starter.tracks) {
      await saveTrack(item.track, item.blob);
    }
    setTracks((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const fresh = starter.tracks.map((s) => s.track).filter((tr) => !existingIds.has(tr.id));
      return [...fresh, ...prev];
    });
  };

  const handleSaveEditedTrack = async (updated: AudioTrack) => {
    await saveTrack(updated);
    setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
  };

  const handleDeleteTrack = async (trackId: string) => {
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
  };

  const handleSavePlaylist = async (playlist: Playlist) => {
    await savePlaylist(playlist);
    setPlaylists((prev) => {
      const exists = prev.some((p) => p.id === playlist.id);
      return exists ? prev.map((p) => (p.id === playlist.id ? playlist : p)) : [playlist, ...prev];
    });
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    await deletePlaylistFromDB(playlistId);
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const handleAddTrackToPlaylist = async (playlistId: string, trackId: string) => {
    const target = playlists.find((p) => p.id === playlistId);
    if (!target || target.trackIds.includes(trackId)) return;
    const updated: Playlist = {
      ...target,
      trackIds: [...target.trackIds, trackId],
      updatedAt: Date.now(),
    };
    await savePlaylist(updated);
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? updated : p)));
  };

  const handleAddTracksToPlaylist = async (playlistId: string, trackIds: string[]) => {
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
  };

  const handleRemoveTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    const target = playlists.find((p) => p.id === playlistId);
    if (!target) return;
    const updated: Playlist = {
      ...target,
      trackIds: target.trackIds.filter((id) => id !== trackId),
      updatedAt: Date.now(),
    };
    await savePlaylist(updated);
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? updated : p)));
  };

  const handleQuickUpdateCover = async (track: AudioTrack, newCoverUrl: string) => {
    const updated = { ...track, coverUrl: newCoverUrl };
    await saveTrack(updated);
    setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
  };

  const handleDetectLyricsAI = useCallback(
    async (track: AudioTrack, manualText?: string) => {
      setIsAnalyzingLyrics(true);
      setAiError(null);
      try {
      let audioSnippet: { base64: string; mimeType: string } | null = null;
      if (!manualText) {
        const blob = await getTrackBlob(track.id);
        if (blob) {
          audioSnippet = await prepareAudioSnippetForAI(blob);
        }
      }

      const res = await fetch('/api/ai/analyze-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration || 180,
          targetLanguage: settings.language,
          audioBase64: audioSnippet?.base64,
          mimeType: audioSnippet?.mimeType,
          existingLyrics: manualText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo analizar la letra con la IA.');
      }

      const updated: AudioTrack = {
        ...track,
        lyrics: {
          detectedLanguage: data.detectedLanguage || 'Desconocido',
          targetLanguage: settings.language,
          isInstrumental: Boolean(data.isInstrumental),
          mood: data.mood || 'serene',
          moodLabel: data.moodLabel || 'Sereno',
          moodDescription: data.moodDescription || '',
          suggestedAura: data.suggestedAura || playerSwatch.accent,
          tempoFeeling: data.tempoFeeling || 'medium',
          lines: Array.isArray(data.lines) ? data.lines : [],
          updatedAt: Date.now(),
        },
      };
      await saveTrack(updated);
      setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Error al conectar con el servicio IA.');
    } finally {
      setIsAnalyzingLyrics(false);
    }
  }, [playerSwatch.accent, settings.language]);

  // Auto-detect lyrics & musical mood when playing a track without lyrics if enabled
  useEffect(() => {
    const tr = audio.currentTrack;
    if (
      !settings.autoDetectLyrics ||
      !audio.isPlaying ||
      !tr ||
      tr.isSample ||
      tr.lyrics ||
      isAnalyzingLyrics ||
      autoAnalyzedIdsRef.current.has(tr.id)
    ) {
      return;
    }
    autoAnalyzedIdsRef.current.add(tr.id);
    handleDetectLyricsAI(tr);
  }, [
    audio.currentTrack,
    audio.isPlaying,
    handleDetectLyricsAI,
    isAnalyzingLyrics,
    settings.autoDetectLyrics,
  ]);

  const handleRetranslateLyrics = async (track: AudioTrack, targetLang: AppLanguage) => {
    if (!track.lyrics?.lines?.length) return;
    setIsAnalyzingLyrics(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/translate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: track.lyrics.lines,
          targetLanguage: targetLang,
          title: track.title,
          artist: track.artist,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error traduciendo letra');

      const updated: AudioTrack = {
        ...track,
        lyrics: {
          ...track.lyrics,
          targetLanguage: targetLang,
          moodLabel: data.moodLabel || track.lyrics.moodLabel,
          moodDescription: data.moodDescription || track.lyrics.moodDescription,
          lines: Array.isArray(data.lines) ? data.lines : track.lyrics.lines,
          updatedAt: Date.now(),
        },
      };
      await saveTrack(updated);
      setTracks((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Error al traducir la letra.');
    } finally {
      setIsAnalyzingLyrics(false);
    }
  };

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

  const stats = useMemo(
    () => ({
      tracks: tracks.length,
      playlists: playlists.length,
      lossless: tracks.filter((tr) => tr.lossless).length,
      totalPlays: tracks.reduce((sum, tr) => sum + (tr.playCount || 0), 0),
    }),
    [tracks, playlists]
  );

  return (
    <div
      className="min-h-screen pb-24 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-main)',
        backgroundImage: theme.moodSyncEnabled
          ? 'radial-gradient(circle at 12% 8%, var(--mood-aura-1), transparent 45%), radial-gradient(circle at 88% 12%, var(--mood-aura-2), transparent 42%)'
          : undefined,
      }}
    >
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
      {/* Top Bar: 3-line corner hamburger menu + Brand wordmark + Profile/Share */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-app)',
          borderColor: 'var(--divider-color)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Corner Three-Line Menu + Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerMenu t={t} onSelect={(panel) => setActiveModal(panel)} />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight truncate font-display">
                MoriNote · 茉莉音
              </h1>
            </div>
          </div>

          {/* Right Quick Actions: Share Link + Cute Profile Avatar */}
          <div className="flex items-center gap-2.5 shrink-0">
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
                size="sm"
              />
              <span className="hidden md:inline text-xs font-semibold max-w-[110px] truncate">
                {profile.displayName}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Workspace: Library + Now Playing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        <LibraryView
          tracks={tracks}
          playlists={playlists}
          currentTrackId={audio.currentTrackId}
          isPlaying={audio.isPlaying}
          isImporting={isImporting}
          importProgress={importProgress}
          importSummary={importSummary}
          t={t}
          onImportFiles={handleImportFiles}
          onLoadSampleTracks={handleLoadSampleTracks}
          onPlayTrack={(trackId, q) => audio.loadAndPlayTrack(trackId, q)}
          onTogglePlay={audio.togglePlay}
          onToggleFavorite={handleToggleFavorite}
          onEditTrack={(tr) => setEditingTrack(tr)}
          onDeleteTrack={handleDeleteTrack}
          onCreatePlaylist={() => {
            setEditingPlaylist(null);
            setPlaylistModalOpen(true);
          }}
          onEditPlaylist={(pl) => {
            setEditingPlaylist(pl);
            setPlaylistModalOpen(true);
          }}
          onDeletePlaylist={handleDeletePlaylist}
          onAddTrackToPlaylist={handleAddTrackToPlaylist}
          onAddTracksToPlaylist={handleAddTracksToPlaylist}
          onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
        />

        {/* Desktop Anchored Now Playing Panel */}
        <aside className="hidden lg:block sticky top-22">
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
            isFloatingOpen={floating.isFloatingOpen}
            isWidgetOpen={floating.isWidgetOpen}
            isAnalyzingLyrics={isAnalyzingLyrics}
            aiError={aiError}
            settings={settings}
            analyserRef={audio.analyserRef}
            accentColor={playerSwatch.accent}
            t={t}
            onTogglePlay={audio.togglePlay}
            onNext={() => audio.playNext(false)}
            onPrev={audio.playPrev}
            onSeek={audio.seekTo}
            onVolumeChange={audio.setVolume}
            onToggleMute={() => audio.setIsMuted((m) => !m)}
            onToggleShuffle={() => audio.setShuffle((s) => !s)}
            onCycleRepeat={() =>
              audio.setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
            }
            onToggleFavorite={handleToggleFavorite}
            onEditTrack={(tr) => setEditingTrack(tr)}
            onQuickUpdateCover={handleQuickUpdateCover}
            onDetectLyrics={handleDetectLyricsAI}
            onRetranslateLyrics={handleRetranslateLyrics}
            onChangeTargetLanguage={(lang) =>
              setSettings((prev) => ({ ...prev, language: lang }))
            }
            onPlayTrack={(id) => audio.loadAndPlayTrack(id)}
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
      </main>

      {/* Mobile Full Now Playing Sheet */}
      {mobilePlayerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden overflow-y-auto p-4"
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
            isFloatingOpen={floating.isFloatingOpen}
            isWidgetOpen={floating.isWidgetOpen}
            isAnalyzingLyrics={isAnalyzingLyrics}
            aiError={aiError}
            settings={settings}
            analyserRef={audio.analyserRef}
            accentColor={playerSwatch.accent}
            t={t}
            onTogglePlay={audio.togglePlay}
            onNext={() => audio.playNext(false)}
            onPrev={audio.playPrev}
            onSeek={audio.seekTo}
            onVolumeChange={audio.setVolume}
            onToggleMute={() => audio.setIsMuted((m) => !m)}
            onToggleShuffle={() => audio.setShuffle((s) => !s)}
            onCycleRepeat={() =>
              audio.setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
            }
            onToggleFavorite={handleToggleFavorite}
            onEditTrack={(tr) => setEditingTrack(tr)}
            onQuickUpdateCover={handleQuickUpdateCover}
            onDetectLyrics={handleDetectLyricsAI}
            onRetranslateLyrics={handleRetranslateLyrics}
            onChangeTargetLanguage={(lang) =>
              setSettings((prev) => ({ ...prev, language: lang }))
            }
            onPlayTrack={(id) => audio.loadAndPlayTrack(id)}
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

      {/* Persistent Compact Bottom Mini Player */}
      <BottomPlayerBar
        track={audio.currentTrack}
        isPlaying={audio.isPlaying}
        currentTime={audio.currentTime}
        duration={audio.duration}
        isFloatingOpen={floating.isFloatingOpen}
        onTogglePlay={audio.togglePlay}
        onNext={() => audio.playNext(false)}
        onPrev={audio.playPrev}
        onOpenMobilePlayer={() => setMobilePlayerOpen(true)}
        onToggleFloating={floating.openFloating}
      />

      {/* Corner Menu Modals: Perfil, Tema, Ajustes */}
      <ProfileModal
        open={activeModal === 'profile'}
        profile={profile}
        stats={stats}
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
        onTogglePlay={audio.togglePlay}
        onPrev={audio.playPrev}
        onNext={() => audio.playNext(false)}
        onPopOutOS={floating.openFloating}
        onClose={() => floating.setIsWidgetOpen(false)}
      />

      <SettingsModal
        open={activeModal === 'settings'}
        settings={settings}
        sleepMinutesRemaining={audio.sleepMinutesRemaining}
        sleepOnTrackEnd={audio.sleepOnTrackEnd}
        isFloatingOpen={floating.isFloatingOpen}
        isWidgetOpen={floating.isWidgetOpen}
        floatingError={floating.floatingError}
        t={t}
        onChangeSettings={setSettings}
        onSetSleepTimer={(mins, onEnd) => {
          audio.setSleepMinutesRemaining(mins);
          audio.setSleepOnTrackEnd(Boolean(onEnd));
        }}
        onToggleFloating={floating.openFloating}
        onToggleWidget={() => floating.setIsWidgetOpen((v) => !v)}
        onShareLink={handleShareLink}
        linkCopied={linkCopied}
        onClose={() => setActiveModal(null)}
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
        key={editingTrack?.id ?? 'closed'}
        track={editingTrack}
        t={t}
        onSave={handleSaveEditedTrack}
        onClose={() => setEditingTrack(null)}
      />

      <PlaylistModal
        key={editingPlaylist?.id ?? (playlistModalOpen ? 'new' : 'closed')}
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
