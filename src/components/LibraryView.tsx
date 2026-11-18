import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Disc,
  Edit3,
  FolderPlus,
  Heart,
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
import type { AudioTrack, Playlist } from '../types/music';
import { collectAudioFilesFromDirectory, formatDuration } from '../utils/audioMetadata';

export type LibraryTab = 'all' | 'lossless' | 'favorites' | 'playlists';

interface LibraryViewProps {
  tracks: AudioTrack[];
  playlists: Playlist[];
  currentTrackId: string | null;
  isPlaying: boolean;
  isImporting: boolean;
  importProgress: { done: number; total: number } | null;
  importSummary: string | null;
  t: Translations;
  onImportFiles: (files: FileList | File[]) => void;
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
  t,
  onImportFiles,
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
        const files = await collectAudioFilesFromDirectory(dirHandle);
        if (files.length > 0) {
          onImportFiles(files);
        }
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        // Fall back to standard webkitdirectory input if blocked in iframe/mobile
      }
    }
    folderInputRef.current?.click();
  };

  return (
    <div
      className="space-y-4"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Import & Action Toolbar */}
      <div
        className="rounded-3xl border p-4 sm:p-5 space-y-4 transition-colors"
        style={{
          backgroundColor: isDragging ? 'var(--accent-soft)' : 'var(--bg-elevated)',
          borderColor: isDragging ? 'var(--text-main)' : 'var(--divider-color)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isImporting}
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: '#1C1B1F',
              }}
            >
              <Upload className="w-4 h-4" />
              <span>
                {isImporting && importProgress
                  ? `Importando ${importProgress.done}/${importProgress.total}…`
                  : t.importFiles}
              </span>
            </button>

            <button
              type="button"
              disabled={isImporting}
              onClick={handleImportWholeFolder}
              title="Importar todas las canciones de una carpeta de una sola vez"
              className="min-h-[44px] px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2 transition whitespace-nowrap"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Importar carpeta (todas)</span>
            </button>

            <button
              type="button"
              onClick={onCreatePlaylist}
              className="min-h-[44px] px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2 transition whitespace-nowrap"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Plus className="w-4 h-4" />
              <span>{t.newPlaylist}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.flac,.wav,.alac,.aiff,.aif,.m4a,.mp3,.ogg,.opus,.aac"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) onImportFiles(e.target.files);
              e.target.value = '';
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
              if (e.target.files?.length) onImportFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {/* Search Input */}
        <div className="relative">
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
            className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl border text-sm focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Filter Tabs + Batch Add All to Playlist */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {(
              [
                { id: 'all', label: `${t.tabAll} (${tracks.length})` },
                {
                  id: 'lossless',
                  label: `${t.tabLossless} (${tracks.filter((tr) => tr.lossless).length})`,
                },
                {
                  id: 'favorites',
                  label: `${t.tabFavorites} (${tracks.filter((tr) => tr.isFavorite).length})`,
                },
                { id: 'playlists', label: `${t.tabPlaylists} (${playlists.length})` },
              ] as Array<{ id: LibraryTab; label: string }>
            ).map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    if (item.id !== 'playlists') setSelectedPlaylistId(null);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap shrink-0 border"
                  style={{
                    backgroundColor: active ? 'var(--accent-color)' : 'var(--bg-surface)',
                    borderColor: active ? 'transparent' : 'var(--divider-color)',
                    color: active ? '#1C1B1F' : 'var(--text-main)',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab !== 'playlists' && filteredTracks.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setBulkPlaylistOpen((v) => !v)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>Agregar todas a lista</span>
              </button>

              {bulkPlaylistOpen && (
                <div
                  className="absolute right-0 top-11 z-30 w-56 rounded-2xl p-2 border shadow-xl"
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
          )}
        </div>

        {/* Batch Import Progress / Summary */}
        {importProgress && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <span>Cargando canciones a tu biblioteca…</span>
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
                    className="flex items-center gap-3.5 min-w-0 flex-1 text-left"
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

      {/* Track List (with customizable song dividers!) */}
      {(tab !== 'playlists' || selectedPlaylist) && (
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--divider-color)',
          }}
        >
          {filteredTracks.length === 0 ? (
            <div className="p-10 text-center space-y-4">
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
            <div>
              {filteredTracks.map((track, idx) => {
                const isCurrent = track.id === currentTrackId;
                const queueSlice = filteredTracks.map((tr) => tr.id);

                return (
                  <div
                    key={track.id}
                    style={{
                      borderTopWidth: idx === 0 ? 0 : '1.5px',
                      borderTopStyle: 'solid',
                      borderTopColor: 'var(--divider-color)',
                      backgroundColor: isCurrent ? 'var(--accent-soft)' : 'transparent',
                    }}
                    className="px-4 py-3 flex items-center justify-between gap-3 transition-colors relative"
                  >
                    {/* Playable Track Row Left */}
                    <button
                      type="button"
                      onClick={() =>
                        isCurrent ? onTogglePlay() : onPlayTrack(track.id, queueSlice)
                      }
                      className="flex items-center gap-3.5 min-w-0 flex-1 text-left"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: 'var(--divider-color)' }}>
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

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{track.title}</p>
                        {/* Zero-pill clean typographic metadata */}
                        <p
                          className="text-xs truncate mt-0.5 font-mono-nums"
                          style={{ color: 'var(--text-muted)' }}
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
                      </div>
                    </button>

                    {/* Row Actions */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(track.id)}
                        aria-label="Favorita"
                        className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:opacity-80"
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
                          className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:opacity-80"
                        >
                          <ListPlus className="w-4 h-4" />
                        </button>

                        {playlistPickerTrackId === track.id && (
                          <div
                            className="absolute right-0 top-11 z-30 w-48 rounded-2xl p-2 border shadow-xl"
                            style={{
                              backgroundColor: 'var(--bg-elevated)',
                              borderColor: 'var(--divider-color)',
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
                        className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:opacity-80"
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
                          className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center opacity-70 hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDeleteTrack(track.id)}
                          aria-label={t.delete}
                          title={t.delete}
                          className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center opacity-70 hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
