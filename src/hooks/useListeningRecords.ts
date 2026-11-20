import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PREMIUM_FRAME_REWARDS,
  type PremiumFrameReward,
  RECORD_BADGES,
  type RecordBadge,
} from '../constants/records';
import type { AvatarFrameId, TimeRecordStats } from '../types/music';

const STORAGE_RECORDS_KEY = 'morinote_records_v1';

const DEFAULT_RECORDS: TimeRecordStats = {
  bestSessionSeconds: 0,
  totalSecondsInApp: 0,
  unlockedBadgeIds: [],
  unlockedFrameIds: [],
};

const OLD_BADGE_MINUTES_MAP: Record<string, number> = {
  rec_5m: 5,
  rec_12m: 15,
  rec_20m: 20,
  rec_30m: 30,
  rec_45m: 45,
  rec_60m: 60,
  rec_90m: 90,
  rec_120m: 120,
};

function readStoredRecords(): TimeRecordStats {
  try {
    const raw = localStorage.getItem(STORAGE_RECORDS_KEY);
    if (!raw) return DEFAULT_RECORDS;
    const parsed = JSON.parse(raw) as Partial<TimeRecordStats>;
    const bestSessionSeconds =
      typeof parsed.bestSessionSeconds === 'number' && parsed.bestSessionSeconds >= 0
        ? Math.floor(parsed.bestSessionSeconds)
        : 0;
    const bestMin = Math.floor(bestSessionSeconds / 60);

    // Preserve and migrate any prior unlocked badges into the 22-badge & 50-frame system
    const storedBadgeIds = Array.isArray(parsed.unlockedBadgeIds)
      ? parsed.unlockedBadgeIds.filter((id): id is string => typeof id === 'string')
      : [];

    let maxMigratedMin = bestMin;
    for (const id of storedBadgeIds) {
      const m = OLD_BADGE_MINUTES_MAP[id];
      if (m && m > maxMigratedMin) maxMigratedMin = m;
    }

    const badgeSet = new Set(storedBadgeIds.filter((id) => !id.startsWith('rec_')));
    for (const b of RECORD_BADGES) {
      if (b.minutes <= bestMin) {
        badgeSet.add(b.id);
      }
    }

    const storedFrameIds = Array.isArray(parsed.unlockedFrameIds)
      ? parsed.unlockedFrameIds.filter((id): id is AvatarFrameId => typeof id === 'string')
      : [];
    const frameSet = new Set<AvatarFrameId>(storedFrameIds);
    for (const f of PREMIUM_FRAME_REWARDS) {
      if (f.minutes <= bestMin) {
        frameSet.add(f.frameId);
      }
    }

    return {
      bestSessionSeconds,
      totalSecondsInApp:
        typeof parsed.totalSecondsInApp === 'number' && parsed.totalSecondsInApp >= 0
          ? Math.floor(parsed.totalSecondsInApp)
          : 0,
      unlockedBadgeIds: Array.from(badgeSet),
      unlockedFrameIds: Array.from(frameSet),
      lastRecordAt: typeof parsed.lastRecordAt === 'number' ? parsed.lastRecordAt : undefined,
    };
  } catch {
    return DEFAULT_RECORDS;
  }
}

function writeStoredRecords(stats: TimeRecordStats): void {
  try {
    localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
}

export interface RecordCelebrationEvent {
  unlockedFrames: PremiumFrameReward[];
  unlockedBadges: RecordBadge[];
  newRecordMinutes: number;
  isFirstRecord: boolean;
}

export function useListeningRecords(options: {
  isLocked: boolean;
  isPlaying: boolean;
  liveDisplayActive: boolean;
}) {
  const { isLocked, isPlaying, liveDisplayActive } = options;

  const [records, setRecords] = useState<TimeRecordStats>(() => readStoredRecords());
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [celebration, setCelebration] = useState<RecordCelebrationEvent | null>(null);

  // Refs avoid causing App.tsx re-renders every second when Profile is closed
  const recordsRef = useRef<TimeRecordStats>(records);
  const sessionSecRef = useRef<number>(0);
  const liveDisplayRef = useRef<boolean>(liveDisplayActive);
  liveDisplayRef.current = liveDisplayActive;
  const isLockedRef = useRef<boolean>(isLocked);
  isLockedRef.current = isLocked;
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  // Wall-clock reference so listening continues counting accurately in background / locked screen
  const lastWallMsRef = useRef<number>(Date.now());
  const wasCountingRef = useRef<boolean>(!document.hidden && !isLocked);

  // Pending rewards queue when earned in background / locked screen -> pops simultaneously on app entry
  const pendingRef = useRef<{
    frames: PremiumFrameReward[];
    badges: RecordBadge[];
    newRecordMinutes: number;
    isFirstRecord: boolean;
  } | null>(null);

  const flushCelebrationIfVisible = useCallback(() => {
    if (document.hidden || isLockedRef.current) return;
    const pending = pendingRef.current;
    if (!pending) return;
    if (pending.frames.length === 0 && pending.badges.length === 0) {
      pendingRef.current = null;
      return;
    }
    pendingRef.current = null;

    setCelebration((prev) => {
      if (!prev) {
        return {
          unlockedFrames: pending.frames,
          unlockedBadges: pending.badges,
          newRecordMinutes: pending.newRecordMinutes,
          isFirstRecord: pending.isFirstRecord,
        };
      }
      // Merge into currently open celebration so multiple simultaneous rewards stack cleanly
      const frameMap = new Map(prev.unlockedFrames.map((f) => [f.frameId, f]));
      for (const f of pending.frames) frameMap.set(f.frameId, f);
      const badgeMap = new Map(prev.unlockedBadges.map((b) => [b.id, b]));
      for (const b of pending.badges) badgeMap.set(b.id, b);
      return {
        unlockedFrames: Array.from(frameMap.values()),
        unlockedBadges: Array.from(badgeMap.values()),
        newRecordMinutes: Math.max(prev.newRecordMinutes, pending.newRecordMinutes),
        isFirstRecord: prev.isFirstRecord || pending.isFirstRecord,
      };
    });
  }, []);

  const advanceByWallClock = useCallback(() => {
    const now = Date.now();
    const shouldCountNow = (!document.hidden && !isLockedRef.current) || isPlayingRef.current;

    if (!wasCountingRef.current) {
      wasCountingRef.current = shouldCountNow;
      lastWallMsRef.current = now;
      return;
    }

    const deltaSec = Math.max(0, Math.min(28800, Math.floor((now - lastWallMsRef.current) / 1000)));
    if (deltaSec <= 0) {
      wasCountingRef.current = shouldCountNow;
      return;
    }

    // Consume only whole elapsed seconds to preserve sub-second precision
    lastWallMsRef.current += deltaSec * 1000;
    wasCountingRef.current = shouldCountNow;

    sessionSecRef.current += deltaSec;
    const curSec = sessionSecRef.current;
    const curMin = Math.floor(curSec / 60);

    const prev = recordsRef.current;
    const prevBestMin = Math.floor(prev.bestSessionSeconds / 60);
    const nextTotal = prev.totalSecondsInApp + deltaSec;

    let nextBest = prev.bestSessionSeconds;
    let nextBadges = prev.unlockedBadgeIds;
    let nextFrames = prev.unlockedFrameIds;
    let nextLastRecordAt = prev.lastRecordAt;
    let hitNewRecordMinute = false;
    let earnedFramesNow: PremiumFrameReward[] = [];
    let earnedBadgesNow: RecordBadge[] = [];

    // Game rule: 5 minutes starts records; every 5 min unlocks 1 exclusive custom-color frame
    // and key long milestones (5 min -> 30 min -> 1h -> ... 8h) award precious medal badges.
    // If a session doesn't surpass saved personal best, previously earned rewards don't repeat.
    if (curMin >= 5 && curSec > prev.bestSessionSeconds) {
      nextBest = curSec;
      if (curMin > prevBestMin) {
        hitNewRecordMinute = true;
        nextLastRecordAt = now;

        const existingFrameSet = new Set(prev.unlockedFrameIds);
        earnedFramesNow = PREMIUM_FRAME_REWARDS.filter(
          (f) => f.minutes <= curMin && !existingFrameSet.has(f.frameId)
        );
        if (earnedFramesNow.length > 0) {
          nextFrames = [...prev.unlockedFrameIds, ...earnedFramesNow.map((f) => f.frameId)];
        }

        const existingBadgeSet = new Set(prev.unlockedBadgeIds);
        earnedBadgesNow = RECORD_BADGES.filter(
          (b) => b.minutes <= curMin && !existingBadgeSet.has(b.id)
        );
        if (earnedBadgesNow.length > 0) {
          nextBadges = [...prev.unlockedBadgeIds, ...earnedBadgesNow.map((b) => b.id)];
        }
      }
    }

    const updated: TimeRecordStats = {
      bestSessionSeconds: nextBest,
      totalSecondsInApp: nextTotal,
      unlockedBadgeIds: nextBadges,
      unlockedFrameIds: nextFrames,
      lastRecordAt: nextLastRecordAt,
    };
    recordsRef.current = updated;

    const unlockedAnything = earnedFramesNow.length > 0 || earnedBadgesNow.length > 0;
    if (unlockedAnything) {
      writeStoredRecords(updated);
      const curPending = pendingRef.current;
      const mergedFrames = curPending ? [...curPending.frames] : [];
      for (const f of earnedFramesNow) {
        if (!mergedFrames.some((x) => x.frameId === f.frameId)) mergedFrames.push(f);
      }
      const mergedBadges = curPending ? [...curPending.badges] : [];
      for (const b of earnedBadgesNow) {
        if (!mergedBadges.some((x) => x.id === b.id)) mergedBadges.push(b);
      }
      pendingRef.current = {
        frames: mergedFrames,
        badges: mergedBadges,
        newRecordMinutes: curMin,
        isFirstRecord: (curPending?.isFirstRecord ?? false) || prevBestMin < 5,
      };
      setRecords(updated);
      setSessionSeconds(curSec);
      flushCelebrationIfVisible();
    } else if (hitNewRecordMinute || deltaSec > 1 || curSec % 15 === 0 || liveDisplayRef.current) {
      if (curSec % 15 === 0 || hitNewRecordMinute || deltaSec > 1) {
        writeStoredRecords(updated);
      }
      if (liveDisplayRef.current || hitNewRecordMinute || deltaSec > 1) {
        setRecords(updated);
        setSessionSeconds(curSec);
      }
    }
  }, [flushCelebrationIfVisible]);

  // Sync UI & flush any accumulated rewards immediately when Profile opens, lock unlocks, or play state toggles
  useEffect(() => {
    advanceByWallClock();
    flushCelebrationIfVisible();
    if (liveDisplayActive) {
      setSessionSeconds(sessionSecRef.current);
      setRecords({ ...recordsRef.current });
    }
  }, [liveDisplayActive, isLocked, isPlaying, advanceByWallClock, flushCelebrationIfVisible]);

  useEffect(() => {
    const persistNow = () => {
      advanceByWallClock();
      writeStoredRecords(recordsRef.current);
    };

    const tickInterval = window.setInterval(() => {
      advanceByWallClock();
    }, 1000);

    const handleVisibility = () => {
      if (document.hidden) {
        persistNow();
      } else {
        advanceByWallClock();
        flushCelebrationIfVisible();
      }
    };

    const handleFocus = () => {
      advanceByWallClock();
      flushCelebrationIfVisible();
    };

    window.addEventListener('pagehide', persistNow);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(tickInterval);
      window.removeEventListener('pagehide', persistNow);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      persistNow();
    };
  }, [advanceByWallClock, flushCelebrationIfVisible]);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
  }, []);

  return {
    records,
    sessionSeconds,
    unlockedFrameIds: records.unlockedFrameIds,
    celebration,
    dismissCelebration,
  };
}
