import type { AudioTrack, Playlist } from '../types/music';

const DB_NAME = 'morinote-audio-db';
const DB_VERSION = 2;

const STORE_TRACKS = 'tracks';
const STORE_BLOBS = 'audioBlobs';
const STORE_PLAYLISTS = 'playlists';
const STORE_HANDLES = 'handles';
const MUSIC_DIR_KEY = 'music_directory_handle';

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryBlobCache = new Map<string, Blob>();

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
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
      if (!db.objectStoreNames.contains(STORE_HANDLES)) {
        db.createObjectStore(STORE_HANDLES);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      db.onclose = () => {
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

export function registerMemoryBlob(trackId: string, blob: Blob): void {
  memoryBlobCache.set(trackId, blob);
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
  if (blob) {
    memoryBlobCache.set(track.id, blob);
  }
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

export async function saveTracksBatch(
  items: Array<{ track: AudioTrack; blob?: Blob }>
): Promise<void> {
  if (items.length === 0) return;

  for (const item of items) {
    if (item.blob) {
      memoryBlobCache.set(item.track.id, item.blob);
    }
  }

  const db = await openDB();
  const hasBlobs = items.some((item) => Boolean(item.blob));

  try {
    await new Promise<void>((resolve, reject) => {
      const stores = hasBlobs ? [STORE_TRACKS, STORE_BLOBS] : [STORE_TRACKS];
      const tx = db.transaction(stores, 'readwrite');
      const trackStore = tx.objectStore(STORE_TRACKS);
      const blobStore = hasBlobs ? tx.objectStore(STORE_BLOBS) : null;

      for (const item of items) {
        trackStore.put(item.track);
        if (item.blob && blobStore) {
          blobStore.put(item.blob, item.track.id);
        }
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB batch transaction aborted'));
    });
  } catch {
    // Fallback if browser storage quota rejects large audio blobs: persist track entries cleanly
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_TRACKS], 'readwrite');
      const trackStore = tx.objectStore(STORE_TRACKS);
      for (const item of items) {
        trackStore.put(item.track);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export async function getTrackBlob(trackId: string): Promise<Blob | undefined> {
  const cached = memoryBlobCache.get(trackId);
  if (cached) return cached;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BLOBS, 'readonly');
    const req = tx.objectStore(STORE_BLOBS).get(trackId);
    req.onsuccess = () => {
      const result = req.result as Blob | undefined;
      if (result) {
        memoryBlobCache.set(trackId, result);
      }
      resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteTrackFromDB(trackId: string): Promise<void> {
  memoryBlobCache.delete(trackId);
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

export interface PersistableDirectoryHandle extends FileSystemDirectoryHandle {
  queryPermission?: (descriptor?: { mode?: 'read' | 'readwrite' }) => Promise<PermissionState>;
  requestPermission?: (descriptor?: { mode?: 'read' | 'readwrite' }) => Promise<PermissionState>;
}

export async function saveMusicDirHandle(handle: PersistableDirectoryHandle): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HANDLES, 'readwrite');
    tx.objectStore(STORE_HANDLES).put(handle, MUSIC_DIR_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMusicDirHandle(): Promise<PersistableDirectoryHandle | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HANDLES, 'readonly');
    const req = tx.objectStore(STORE_HANDLES).get(MUSIC_DIR_KEY);
    req.onsuccess = () => resolve((req.result as PersistableDirectoryHandle | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearMusicDirHandle(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HANDLES, 'readwrite');
    tx.objectStore(STORE_HANDLES).delete(MUSIC_DIR_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
