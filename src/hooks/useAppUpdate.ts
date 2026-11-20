import { useCallback, useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

interface VersionCheckResult {
  hasNewVersion: boolean;
  serverBuildId: string | null;
}

export function useAppUpdate() {
  const [swNeedRefresh, setSwNeedRefresh] = useState(false);
  const [versionMismatch, setVersionMismatch] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);

  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const initialDevBootIdRef = useRef<string | null>(null);
  const lastCheckMsRef = useRef<number>(0);

  const checkServerVersion = useCallback(async (): Promise<VersionCheckResult> => {
    try {
      const res = await fetch(`/api/app-version?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return { hasNewVersion: false, serverBuildId: null };
      const data = (await res.json()) as { buildId?: string; bootId?: string };
      const clientBuildId = typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev';
      const serverBuildId = typeof data.buildId === 'string' ? data.buildId : null;
      const serverBootId = typeof data.bootId === 'string' ? data.bootId : null;

      let mismatch = false;
      if (clientBuildId !== 'dev' && serverBuildId && serverBuildId !== 'dev') {
        mismatch = serverBuildId !== clientBuildId;
      } else if (serverBootId) {
        if (!initialDevBootIdRef.current) {
          initialDevBootIdRef.current = serverBootId;
        } else if (serverBootId !== initialDevBootIdRef.current) {
          mismatch = true;
        }
      }

      if (mismatch) {
        setVersionMismatch(true);
      }
      setLastCheckedAt(Date.now());
      return { hasNewVersion: mismatch, serverBuildId };
    } catch {
      return { hasNewVersion: false, serverBuildId: null };
    }
  }, []);

  const checkForUpdates = useCallback(
    async (force = false): Promise<boolean> => {
      const now = Date.now();
      if (!force && now - lastCheckMsRef.current < 15000) {
        return swNeedRefresh || versionMismatch;
      }
      lastCheckMsRef.current = now;

      let swHasWaiting = swNeedRefresh;
      try {
        const reg = registrationRef.current;
        if (reg) {
          await reg.update();
          if (reg.waiting) {
            swHasWaiting = true;
            setSwNeedRefresh(true);
          }
        }
      } catch {
        // Ignore offline SW check errors
      }

      const { hasNewVersion } = await checkServerVersion();
      return swHasWaiting || hasNewVersion || swNeedRefresh || versionMismatch;
    },
    [checkServerVersion, swNeedRefresh, versionMismatch]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          setSwNeedRefresh(true);
        },
        onRegisteredSW(_swUrl, registration) {
          registrationRef.current = registration;
          if (registration?.waiting) {
            setSwNeedRefresh(true);
          }
        },
      });
      updateSWRef.current = updateSW;
    } catch {
      // Fallback safely if SW registration is blocked in private/restricted context
    }

    // Initial check shortly after startup
    const startupTimer = window.setTimeout(() => {
      void checkForUpdates(true);
    }, 2500);

    // Periodic check every 90s while app is open
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void checkForUpdates(false);
      }
    }, 90_000);

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        void checkForUpdates(false);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      window.clearTimeout(startupTimer);
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [checkForUpdates]);

  const applyUpdate = useCallback(
    async (forceReload = false) => {
      setIsUpdating(true);
      setUpdateMessage(null);
      try {
        const foundUpdate = forceReload ? true : await checkForUpdates(true);

        if (!foundUpdate && !forceReload) {
          setUpdateMessage(
            'Ya estás usando la versión más reciente. Si acabas de hacer un cambio, espera unos segundos y vuelve a tocar.'
          );
          setIsUpdating(false);
          return;
        }

        // Clear static asset caches without touching IndexedDB (songs/playlists) or localStorage (themes/profile)
        if ('caches' in window) {
          try {
            const keys = await window.caches.keys();
            await Promise.all(keys.map((key) => window.caches.delete(key)));
          } catch {
            // Continue even if CacheStorage is unavailable
          }
        }

        // Tell any waiting service worker to activate immediately
        if (registrationRef.current?.waiting) {
          registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        if (updateSWRef.current && swNeedRefresh) {
          await updateSWRef.current(true);
        }

        // Clean reload to pick up freshly deployed assets
        window.setTimeout(() => {
          window.location.reload();
        }, 250);
      } catch {
        setUpdateMessage('No se pudo comprobar la actualización. Verifica tu conexión e intenta de nuevo.');
        setIsUpdating(false);
      }
    },
    [checkForUpdates, swNeedRefresh]
  );

  const hasUpdate = swNeedRefresh || versionMismatch;

  return {
    hasUpdate,
    isUpdating,
    updateMessage,
    lastCheckedAt,
    checkForUpdates,
    applyUpdate,
    clearUpdateMessage: () => setUpdateMessage(null),
  };
}
