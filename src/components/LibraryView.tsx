import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Disc,
  Disc3,
  Edit3,
  FolderPlus,
  Heart,
  Layers,
  ListMusic,
  ListPlus,
  Music,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import type { Translations } from '../constants/i18n';
import type {
  AudioTrack,
  Playlist,
  SongTitleColorId,
  SongTitleShapeId,
  TrackCardColorId,
  TrackCardDecorId,
  TrackCardStyleId,
} from '../types/music';
import { collectAudioFilesFromDirectory, formatDuration } from '../utils/audioMetadata';
import { getTrackCardPresentation } from '../utils/trackCardStyles';
import { SongTitleDisplay } from './SongTitleDisplay';

export type LibraryTab = 'all' | 'lossless' | 'favorites' | 'playlists';

interface LibraryViewProps {
  tracks: AudioTrack[];
  playlists: Playlist[];
  currentTrackId: string | null;
  isPlaying: boolean;
  isImporting: boolean;
  importProgress: { done: number; total: number } | null;
  importSummary: string | null;
  bannerImageUrl?: string;
  bannerText?: string;
  trackCardStyleId?: TrackCardStyleId;
  trackCardColorId?: TrackCardColorId;
  trackCardCustomBg?: string;
  trackCardCustomText?: string;
  trackCardDecorId?: TrackCardDecorId;
  songTitleShapeId?: SongTitleShapeId;
  songTitleColorId?: SongTitleColorId;
  songTitleCustomBg?: string;
  songTitleCustomText?: string;
  trackCardWidthPercent?: number;
  trackCardHeightPx?: number;
  t: Translations;
  onImportFiles: (files: FileList | File[]) => void;
  onSaveDirHandle?: (handle: FileSystemDirectoryHandle) => void;
  onLoadSampleTracks: () => void;
  onPlayTrack: (trackId: string, queueIds?: string[]) => void;
  onTogglePlay: () => void;
  onToggleFavorite: (trackId: string) => void;
  onEditTrack: (track: AudioTrack) => void;
  onDeleteTrack: (trackId: string) => void;
  onCreatePlaylist: () => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onAddTrackToPlaylist: (playlistId: string, trackId: string) => void;
  onAddTracksToPlaylist: (playlistId: string, trackIds: string[]) => void;
  onRemoveTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  playlists,
  currentTrackId,
  isPlaying,
  isImporting,
  importProgress,
  importSummary,
  bannerImageUrl,
  bannerText,
  trackCardStyleId = 'classic_row',
  trackCardColorId = 'auto',
  trackCardCustomBg,
  trackCardCustomText,
  trackCardDecorId = 'auto',
  songTitleShapeId = 'cloud_plush',
  songTitleColorId = 'auto',
  songTitleCustomBg,
  songTitleCustomText,
  trackCardWidthPercent = 78,
  trackCardHeightPx = 118,
  t,
  onImportFiles,
  onSaveDirHandle,
  onLoadSampleTracks,
  onPlayTrack,
  onTogglePlay,
  onToggleFavorite,
  onEditTrack,
  onDeleteTrack,
  onCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  onAddTrackToPlaylist,
  onAddTracksToPlaylist,
  onRemoveTrackFromPlaylist,
}) => {
  const [tab, setTab] = useState<LibraryTab>('all');
  const [search, setSearch] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlistPickerTrackId, setPlaylistPickerTrackId] = useState<string | null>(null);
  const [bulkPlaylistOpen, setBulkPlaylistOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId) ?? null;

  const filteredTracks = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = tracks;

    if (tab === 'lossless') {
      list = list.filter((tr) => tr.lossless);
    } else if (tab === 'favorites') {
      list = list.filter((tr) => tr.isFavorite);
    } else if (tab === 'playlists' && selectedPlaylist) {
      const map = new Map(tracks.map((tr) => [tr.id, tr]));
      list = selectedPlaylist.trackIds
        .map((id) => map.get(id))
        .filter((tr): tr is AudioTrack => Boolean(tr));
    }

    if (q) {
      list = list.filter(
        (tr) =>
          tr.title.toLowerCase().includes(q) ||
          tr.artist.toLowerCase().includes(q) ||
          tr.album.toLowerCase().includes(q) ||
          tr.format.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tracks, tab, selectedPlaylist, search]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImportFiles(e.dataTransfer.files);
    }
  };

  const handleImportWholeFolder = async () => {
    const picker = (
      window as unknown as { showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle> }
    ).showDirectoryPicker;
    if (typeof picker === 'function') {
      try {
        const dirHandle = await picker();
        onSaveDirHandle?.(dirHandle);
        const files = await collectAudioFilesFromDirectory(dirHandle);
        if (files.length > 0) {
          onImportFiles(files);
        }
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        // Fall back below if blocked in iframe/mobile
      }
    }
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      fileInputRef.current?.click();
    } else {
      folderInputRef.current?.click();
    }
  };

  const hasBanner = Boolean(bannerImageUrl?.trim() || bannerText?.trim());
  const losslessCount = tracks.filter((tr) => tr.lossless).length;
  const favCount = tracks.filter((tr) => tr.isFavorite).length;

  const railFilterItems: Array<{
    id: LibraryTab;
    shortLabel: string;
    fullTitle: string;
    count: number;
    icon: React.ReactNode;
  }> = [
    {
      id: 'all',
      shortLabel: 'Todas',
      fullTitle: `${t.tabAll} (${tracks.length})`,
      count: tracks.length,
      icon: <ListMusic className="w-4 h-4" />,
    },
    {
      id: 'lossless',
      shortLabel: 'Hi-Res',
      fullTitle: `${t.tabLossless} (${losslessCount})`,
      count: losslessCount,
      icon: <Disc3 className="w-4 h-4" />,
    },
    {
      id: 'favorites',
      shortLabel: 'Favs',
      fullTitle: `${t.tabFavorites} (${favCount})`,
      count: favCount,
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: 'playlists',
      shortLabel: 'Listas',
      fullTitle: `${t.tabPlaylists} (${playlists.length})`,
      count: playlists.length,
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const isGroupedListStyle = trackCardStyleId === 'classic_row';

  return (
    <div
      className="h-full min-h-0 flex flex-col gap-2.5 sm:gap-3"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Standalone Fixed Search Bar Alone Above Banner & Library */}
      <div className="shrink-0 relative">
        <Search
          className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl border text-sm shadow-xs focus:outline-none"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--divider-color)',
            color: 'var(--text-main)',
          }}
        />
      </div>

      {/* Immobile Left 1-Line Rail + Independently Scrolling Right Banner & Song List */}
      <div className="flex-1 min-h-0 flex items-stretch gap-2 sm:gap-3 overflow-hidden">
        {/* Immobile Left Vertical 1-Line Rail Wrapper (unclipped relative box so +Todas popover sits outside) */}
        <div className="relative shrink-0 h-full flex">
          <nav
            aria-label="Filtros y acciones de biblioteca"
            className="h-full overflow-y-auto no-scrollbar flex flex-col items-center gap-1.5 p-1.5 rounded-3xl border shadow-sm"
            style={{
              backgroundColor: isDragging ? 'var(--accent-soft)' : 'var(--bg-elevated)',
              borderColor: isDragging ? 'var(--text-main)' : 'var(--divider-color)',
            }}
          >
            {/* Library Filter Tabs moved into the immobile side rail */}
            {railFilterItems.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    setBulkPlaylistOpen(false);
                    if (item.id !== 'playlists') setSelectedPlaylistId(null);
                  }}
                  title={item.fullTitle}
                  aria-label={item.fullTitle}
                  aria-pressed={active}
                  className="relative w-12 min-h-[44px] py-1 px-0.5 rounded-2xl border flex flex-col items-center justify-center shrink-0 transition active:scale-95"
                  style={{
                    backgroundColor: active ? 'var(--accent-color)' : 'var(--bg-surface)',
                    borderColor: active ? 'transparent' : 'var(--divider-color)',
                    color: active ? '#1C1B1F' : 'var(--text-main)',
                  }}
                >
                  {item.icon}
                  <span className="text-[9px] font-bold leading-none mt-0.5 truncate max-w-full">
                    {item.shortLabel}
                  </span>
                  {item.count > 0 && (
                    <span
                      className="text-[8px] font-mono-nums leading-none mt-0.5 opacity-75"
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Divider between Filters and Import/List Actions */}
            <div
              className="w-7 h-px my-0.5 shrink-0"
              style={{ backgroundColor: 'var(--divider-color)' }}
            />

            {/* Quick Action Buttons */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title={t.importFiles}
              aria-label={t.importFiles}
              className="w-12 min-h-[44px] py-1 rounded-2xl flex flex-col items-center justify-center shrink-0 transition active:scale-95 shadow-xs"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: '#1C1B1F',
              }}
            >
              <Upload className="w-4 h-4" />
              <span className="text-[9px] font-bold leading-none mt-0.5">Audio</span>
            </button>

            <button
              type="button"
              onClick={handleImportWholeFolder}
              title="Importar carpeta (todas)"
              aria-label="Importar carpeta (todas)"
              className="w-12 min-h-[44px] py-1 rounded-2xl border flex flex-col items-center justify-center shrink-0 transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <FolderPlus className="w-4 h-4" />
              <span className="text-[9px] font-semibold leading-none mt-0.5">Carpeta</span>
            </button>

            <button
              type="button"
              onClick={onCreatePlaylist}
              title={t.newPlaylist}
              aria-label={t.newPlaylist}
              className="w-12 min-h-[44px] py-1 rounded-2xl border flex flex-col items-center justify-center shrink-0 transition active:scale-95"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-[9px] font-semibold leading-none mt-0.5">Lista</span>
            </button>

            {tab !== 'playlists' && filteredTracks.length > 0 && (
              <button
                type="button"
                onClick={() => setBulkPlaylistOpen((v) => !v)}
                title="Agregar todas a una lista"
                aria-label="Agregar todas a una lista"
                className="w-12 min-h-[44px] py-1 rounded-2xl border flex flex-col items-center justify-center shrink-0 transition active:scale-95"
                style={{
                  backgroundColor: bulkPlaylistOpen ? 'var(--accent-soft)' : 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <ListPlus className="w-4 h-4" />
                <span className="text-[9px] font-semibold leading-none mt-0.5">+Todas</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*,.flac,.wav,.alac,.aiff,.aif,.m4a,.m4b,.mp3,.ogg,.opus,.aac,.wma,.webm,.mp4"
              className="hidden"
              onChange={(e) => {
                const picked = e.target.files ? Array.from(e.target.files) : [];
                e.target.value = '';
                if (picked.length > 0) onImportFiles(picked);
              }}
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              // @ts-expect-error webkitdirectory is standard in Chromium/Safari for local folder access
              webkitdirectory=""
              className="hidden"
              onChange={(e) => {
                const picked = e.target.files ? Array.from(e.target.files) : [];
                e.target.value = '';
                if (picked.length > 0) onImportFiles(picked);
              }}
            />
          </nav>

          {/* Non-clipped Popover for "+Todas" action */}
          {bulkPlaylistOpen && tab !== 'playlists' && filteredTracks.length > 0 && (
            <div
              className="absolute left-full ml-2 bottom-2 z-40 w-56 rounded-2xl p-2 border shadow-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <p className="text-[11px] font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                Agregar {filteredTracks.length} canciones a:
              </p>
              {playlists.length === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setBulkPlaylistOpen(false);
                    onCreatePlaylist();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium"
                >
                  + {t.newPlaylist}
                </button>
              ) : (
                playlists.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => {
                      onAddTracksToPlaylist(
                        pl.id,
                        filteredTracks.map((tr) => tr.id)
                      );
                      setBulkPlaylistOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-2 hover:opacity-80"
                  >
                    <span className="truncate">{pl.name}</span>
                    <span className="text-[11px] opacity-65">{pl.trackIds.length}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Independently Scrollable Right Pane: Banner right under Search + Playlists/Songs */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto overscroll-y-contain touch-pan-y space-y-3 pr-0.5 pb-4">
          {/* Theme-only Decorative Banner (sits directly beneath standalone search bar) */}
          {hasBanner && (
            <div
              className={`relative rounded-3xl overflow-hidden border shadow-sm flex items-end ${
                bannerImageUrl ? 'h-28 sm:h-36' : 'min-h-[68px]'
              }`}
              style={{
                borderColor: 'var(--divider-color)',
                background: bannerImageUrl
                  ? undefined
                  : 'linear-gradient(125deg, var(--accent-soft), var(--bg-elevated))',
              }}
            >
              {bannerImageUrl && (
                <img
                  src={bannerImageUrl}
                  alt={bannerText?.trim() || 'Banner decorativo'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {bannerText?.trim() && (
                <div
                  className="relative z-10 w-full px-4 sm:px-5 py-3"
                  style={{
                    background: bannerImageUrl
                      ? 'linear-gradient(to top, rgba(18,14,22,0.72), transparent)'
                      : 'transparent',
                    color: bannerImageUrl ? '#FFFFFF' : 'var(--text-main)',
                  }}
                >
                  <p className="text-sm sm:text-base font-bold tracking-tight leading-snug drop-shadow-sm">
                    {bannerText.trim()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Batch Import Progress / Summary */}
          {(importProgress || (!importProgress && importSummary)) && (
            <div
              className="rounded-2xl border p-3 space-y-1.5"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {importProgress && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>¡Listas para reproducir! Guardando portadas…</span>
                    <span className="font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                      {importProgress.done} / {importProgress.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden bg-black/10">
                    <div
                      className="h-full transition-all duration-150"
                      style={{
                        width: `${Math.round((importProgress.done / Math.max(1, importProgress.total)) * 100)}%`,
                        backgroundColor: 'var(--song-bar-color)',
                      }}
                    />
                  </div>
                </div>
              )}

              {!importProgress && importSummary && (
                <p
                  className="text-xs px-3 py-2 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  {importSummary}
                </p>
              )}
            </div>
          )}

          {/* Playlists Grid View */}
          {tab === 'playlists' && !selectedPlaylist && (
            <div
              className="rounded-3xl border p-4 sm:p-5"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              {playlists.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-sm font-medium">Aún no tienes listas personalizadas</p>
                  <button
                    type="button"
                    onClick={onCreatePlaylist}
                    className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      color: '#1C1B1F',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.newPlaylist}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {playlists.map((pl) => (
                    <div
                      key={pl.id}
                      className="rounded-2xl border p-3 flex items-center gap-3.5 transition"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPlaylistId(pl.id)}
                        className="btn-raw flex items-center gap-3.5 min-w-0 flex-1 text-left"
                      >
                        <img
                          src={pl.coverUrl}
                          alt={pl.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                          style={{ borderColor: 'var(--divider-color)' }}
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold truncate">{pl.name}</h3>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {pl.trackIds.length} canciones · {pl.description}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        {pl.trackIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onPlayTrack(pl.trackIds[0], pl.trackIds)}
                            aria-label={`Reproducir ${pl.name}`}
                            className="min-w-[38px] min-h-[38px] rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: 'var(--accent-color)',
                              color: '#1C1B1F',
                            }}
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditPlaylist(pl)}
                          aria-label={t.renamePlaylist}
                          title={t.renamePlaylist}
                          className="min-w-[38px] min-h-[38px] rounded-xl flex items-center justify-center opacity-80 hover:opacity-100"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePlaylist(pl.id)}
                          aria-label={t.delete}
                          className="min-w-[38px] min-h-[38px] rounded-xl flex items-center justify-center opacity-70 hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Playlist Header */}
          {tab === 'playlists' && selectedPlaylist && (
            <div
              className="rounded-3xl border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedPlaylistId(null)}
                  aria-label="Volver a listas"
                  className="min-w-[42px] min-h-[42px] rounded-xl border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <img
                  src={selectedPlaylist.coverUrl}
                  alt={selectedPlaylist.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border"
                  style={{ borderColor: 'var(--divider-color)' }}
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold truncate">{selectedPlaylist.name}</h3>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {filteredTracks.length} canciones · {selectedPlaylist.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {filteredTracks.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      onPlayTrack(
                        filteredTracks[0].id,
                        filteredTracks.map((tr) => tr.id)
                      )
                    }
                    className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      color: '#1C1B1F',
                    }}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Reproducir lista</span>
                  </button>
                )}
                {tracks.length > selectedPlaylist.trackIds.length && (
                  <button
                    type="button"
                    onClick={() =>
                      onAddTracksToPlaylist(
                        selectedPlaylist.id,
                        tracks.map((tr) => tr.id)
                      )
                    }
                    className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Agregar todas</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEditPlaylist(selectedPlaylist)}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          )}

          {/* Track List (customizable card row styles + cute ornaments) */}
          {(tab !== 'playlists' || selectedPlaylist) && (
            <>
              {filteredTracks.length === 0 ? (
                <div
                  className="rounded-3xl border p-10 text-center space-y-4"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-soft)' }}
                  >
                    <Music className="w-7 h-7 opacity-80" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{t.noTracksTitle}</h3>
                    <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                      {t.noTracksSubtitle}
                    </p>
                  </div>
                  {tracks.length === 0 && (
                    <button
                      type="button"
                      onClick={onLoadSampleTracks}
                      className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border inline-flex items-center gap-2"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <Disc className="w-4 h-4" />
                      <span>{t.loadSampleWav}</span>
                    </button>
                  )}
                </div>
              ) : (
                (() => {
                  const safeCardWidth = Math.min(100, Math.max(58, trackCardWidthPercent));
                  const safeCardHeight = Math.min(176, Math.max(56, trackCardHeightPx));
                  const isVerySlimHeight = safeCardHeight <= 76;
                  const isTallCard = safeCardHeight >= 112;
                  return (
                <div
                  className={
                    isGroupedListStyle
                      ? 'rounded-3xl border overflow-hidden mx-auto transition-[width] duration-200'
                      : 'space-y-2.5 pt-2.5 px-1 mx-auto transition-[width] duration-200'
                  }
                  style={{
                    ...(isGroupedListStyle
                      ? {
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--divider-color)',
                        }
                      : {}),
                    width: `${safeCardWidth}%`,
                    maxWidth: '500px',
                  }}
                >
                  {filteredTracks.map((track, idx) => {
                    const isCurrent = track.id === currentTrackId;
                    const queueSlice = filteredTracks.map((tr) => tr.id);
                    const pres = getTrackCardPresentation(
                      trackCardStyleId,
                      trackCardDecorId,
                      isCurrent,
                      idx === 0,
                      {
                        colorId: trackCardColorId,
                        customBg: trackCardCustomBg,
                        customText: trackCardCustomText,
                      }
                    );

                    return (
                      <div
                        key={track.id}
                        style={{
                          ...pres.containerStyle,
                          minHeight: `${safeCardHeight}px`,
                          justifyContent: 'space-between',
                          ...(isVerySlimHeight
                            ? { paddingTop: '0.45rem', paddingBottom: '0.45rem' }
                            : isTallCard
                              ? { paddingTop: '0.9rem', paddingBottom: '0.9rem' }
                              : {}),
                        }}
                        className={pres.containerClassName}
                      >
                        {pres.topAccentElement}

                        {/* Full-Width Playable Header: Cover + Complete Song Title */}
                        <button
                          type="button"
                          onClick={() =>
                            isCurrent ? onTogglePlay() : onPlayTrack(track.id, queueSlice)
                          }
                          className="btn-raw flex items-center gap-2.5 sm:gap-3 w-full min-w-0 text-left"
                        >
                          <div
                            className={`relative overflow-hidden shrink-0 border ${
                              isVerySlimHeight
                                ? 'w-9 h-9 rounded-lg'
                                : pres.coverClassName
                            }`}
                            style={{ borderColor: 'var(--divider-color)' }}
                          >
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {isCurrent && (
                              <span className="absolute inset-0 bg-black/35 text-white flex items-center justify-center">
                                {isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4 ml-0.5" />
                                )}
                              </span>
                            )}
                          </div>

                          <div
                            className="min-w-0 flex-1 flex items-center gap-1.5"
                            style={{ color: pres.textColorOverride || 'inherit' }}
                          >
                            {pres.decorBadge && (
                              <span aria-hidden="true" className="shrink-0 text-xs">
                                {pres.decorBadge}
                              </span>
                            )}
                            <div className="min-w-0 flex-1 overflow-x-clip">
                              <SongTitleDisplay
                                title={track.title}
                                shapeId={songTitleShapeId}
                                colorId={songTitleColorId}
                                customBg={songTitleCustomBg}
                                customText={songTitleCustomText}
                                size="row"
                                fallbackTextColor={pres.textColorOverride}
                              />
                            </div>
                          </div>
                        </button>

                        {/* Compact Sub-row: Artist/Format Metadata + Row Actions */}
                        <div
                          className={`flex items-center justify-between gap-1.5 pl-0 sm:pl-[56px] ${
                            safeCardWidth <= 68 ? 'flex-wrap' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              isCurrent ? onTogglePlay() : onPlayTrack(track.id, queueSlice)
                            }
                            className="btn-raw min-w-0 flex-1 text-left"
                          >
                            <p
                              className="text-xs truncate font-mono-nums"
                              style={{ color: pres.mutedColorOverride || 'var(--text-muted)' }}
                            >
                              {track.artist}
                              {' · '}
                              {track.format}
                              {track.lossless ? ' Sin pérdida' : ''}
                              {track.bitDepth && track.sampleRate
                                ? ` · ${track.bitDepth}b/${Math.round(track.sampleRate / 1000)}kHz`
                                : ''}
                              {' · '}
                              {formatDuration(track.duration)}
                            </p>
                            {isTallCard && track.album && track.album !== track.title && (
                              <p
                                className="text-[11px] truncate opacity-80 mt-0.5"
                                style={{ color: pres.mutedColorOverride || 'var(--text-muted)' }}
                              >
                                {track.album}
                              </p>
                            )}
                          </button>

                          {/* Row Actions */}
                          <div
                            className="flex items-center gap-0.5 shrink-0"
                            style={{ color: pres.textColorOverride || 'inherit' }}
                          >
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(track.id)}
                            aria-label="Favorita"
                            className="btn-raw min-w-[30px] min-h-[30px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center hover:opacity-80"
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={track.isFavorite ? 'currentColor' : 'none'}
                            />
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setPlaylistPickerTrackId((prev) =>
                                  prev === track.id ? null : track.id
                                )
                              }
                              aria-label={t.addToPlaylist}
                              title={t.addToPlaylist}
                              className="btn-raw min-w-[30px] min-h-[30px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center hover:opacity-80"
                            >
                              <ListPlus className="w-4 h-4" />
                            </button>

                            {playlistPickerTrackId === track.id && (
                              <div
                                className="absolute right-0 top-11 z-30 w-48 rounded-2xl p-2 border shadow-xl"
                                style={{
                                  backgroundColor: 'var(--bg-elevated)',
                                  borderColor: 'var(--divider-color)',
                                  color: 'var(--text-main)',
                                }}
                              >
                                <p className="text-[11px] font-semibold px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                                  {t.addToPlaylist}
                                </p>
                                {playlists.length === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPlaylistPickerTrackId(null);
                                      onCreatePlaylist();
                                    }}
                                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium"
                                  >
                                    + {t.newPlaylist}
                                  </button>
                                ) : (
                                  playlists.map((pl) => {
                                    const alreadyIn = pl.trackIds.includes(track.id);
                                    return (
                                      <button
                                        key={pl.id}
                                        type="button"
                                        onClick={() => {
                                          onAddTrackToPlaylist(pl.id, track.id);
                                          setPlaylistPickerTrackId(null);
                                        }}
                                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-2 hover:opacity-80"
                                      >
                                        <span className="truncate">{pl.name}</span>
                                        {alreadyIn && <span className="text-[10px]">✓</span>}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onEditTrack(track)}
                            aria-label={t.editTrack}
                            title={t.editTrack}
                            className="btn-raw min-w-[30px] min-h-[30px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center hover:opacity-80"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {selectedPlaylist ? (
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveTrackFromPlaylist(selectedPlaylist.id, track.id)
                              }
                              aria-label="Quitar de la lista"
                              title="Quitar de la lista"
                              className="btn-raw min-w-[30px] min-h-[30px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center opacity-70 hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onDeleteTrack(track.id)}
                              aria-label={t.delete}
                              title={t.delete}
                              className="btn-raw min-w-[30px] min-h-[30px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center opacity-70 hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                  );
                })()
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
