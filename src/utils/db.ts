import type { AudioTrack, Playlist } from '../types/music';

const DB_NAME = 'morinote-audio-db';
const DB_VERSION = 1;

const STORE_TRACKS = 'tracks';
const STORE_BLOBS = 'audioBlobs';
const STORE_PLAYLISTS = 'playlists';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_TRACKS)) {
        db.createObjectStore(STORE_TRACKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BLOBS)) {
        db.createObjectStore(STORE_BLOBS);
      }
      if (!db.objectStoreNames.contains(STORE_PLAYLISTS)) {
        db.createObjectStore(STORE_PLAYLISTS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllTracks(): Promise<AudioTrack[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_TRACKS, 'readonly');
    const req = tx.objectStore(STORE_TRACKS).getAll();
    req.onsuccess = () => {
      const items = (req.result as AudioTrack[]) || [];
      items.sort((a, b) => b.createdAt - a.createdAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveTrack(track: AudioTrack, blob?: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const stores = blob ? [STORE_TRACKS, STORE_BLOBS] : [STORE_TRACKS];
    const tx = db.transaction(stores, 'readwrite');
    tx.objectStore(STORE_TRACKS).put(track);
    if (blob) {
      tx.objectStore(STORE_BLOBS).put(blob, track.id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getTrackBlob(trackId: string): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BLOBS, 'readonly');
    const req = tx.objectStore(STORE_BLOBS).get(trackId);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteTrackFromDB(trackId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_TRACKS, STORE_BLOBS], 'readwrite');
    tx.objectStore(STORE_TRACKS).delete(trackId);
    tx.objectStore(STORE_BLOBS).delete(trackId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PLAYLISTS, 'readonly');
    const req = tx.objectStore(STORE_PLAYLISTS).getAll();
    req.onsuccess = () => {
      const items = (req.result as Playlist[]) || [];
      items.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function savePlaylist(playlist: Playlist): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PLAYLISTS, 'readwrite');
    tx.objectStore(STORE_PLAYLISTS).put(playlist);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deletePlaylistFromDB(playlistId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PLAYLISTS, 'readwrite');
    tx.objectStore(STORE_PLAYLISTS).delete(playlistId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
