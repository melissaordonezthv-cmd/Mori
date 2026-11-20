import { useCallback, useEffect, useRef, useState } from 'react';
import { AUDIO_MODE_PROFILES } from '../constants/themes';
import type { AudioEngineMode, AudioTrack, RepeatMode } from '../types/music';
import { getTrackBlob } from '../utils/db';

const EQ_FREQUENCIES = [60, 230, 910, 3600, 14000];

interface UseAudioEngineOptions {
  tracks: AudioTrack[];
  eqBands: [number, number, number, number, number];
  audioMode: AudioEngineMode;
  soundCheckEnabled: boolean;
  spatialWidth: number;
  playbackSpeed: number;
  backgroundPlaybackEnabled: boolean;
  onTrackPlayed?: (trackId: string) => void;
}

interface MasteringNodes {
  headroomGain: GainNode;
  subFilter: BiquadFilterNode;
  cleanFilter: BiquadFilterNode;
  presenceFilter: BiquadFilterNode;
  airFilter: BiquadFilterNode;
  sideWidthGain: GainNode;
  reverbWetGain: GainNode;
  compressor: DynamicsCompressorNode;
  makeupGain: GainNode;
}

function createStudioImpulseBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * 0.36);
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let seed = 1337;
  const nextRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed / 2147483647) * 2 - 1;
  };

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 14.5);
    left[i] = nextRand() * env * 0.2;
    right[i] = nextRand() * env * 0.2;
  }

  const tapsL = [0.011, 0.0185, 0.027, 0.038];
  const tapsR = [0.0125, 0.02, 0.0295, 0.041];
  tapsL.forEach((sec, idx) => {
    const pos = Math.min(length - 1, Math.floor(sec * sampleRate));
    left[pos] += 0.42 / (idx + 1);
  });
  tapsR.forEach((sec, idx) => {
    const pos = Math.min(length - 1, Math.floor(sec * sampleRate));
    right[pos] += 0.42 / (idx + 1);
  });

  return buffer;
}

export function useAudioEngine({
  tracks,
  eqBands,
  audioMode,
  soundCheckEnabled,
  spatialWidth,
  playbackSpeed,
  backgroundPlaybackEnabled,
  onTrackPlayed,
}: UseAudioEngineOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const masteringRef = useRef<MasteringNodes | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('all');
  const [sleepMinutesRemaining, setSleepMinutesRemaining] = useState<number | null>(null);
  const [sleepOnTrackEnd, setSleepOnTrackEnd] = useState(false);

  const currentTrack = tracks.find((t) => t.id === currentTrackId) ?? null;

  // Ensure audio element exists once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const applyDspParameters = useCallback(
    (
      ctx: AudioContext,
      filters: BiquadFilterNode[],
      mastering: MasteringNodes,
      immediate = false
    ) => {
      const now = ctx.currentTime;
      const setSmooth = (param: AudioParam, val: number) => {
        if (immediate) {
          param.setValueAtTime(val, now);
        } else {
          param.setTargetAtTime(val, now, 0.025);
        }
      };

      const profile = AUDIO_MODE_PROFILES[audioMode] ?? AUDIO_MODE_PROFILES.apple_master;
      const isPure = audioMode === 'lossless_pure';

      // Automatic headroom compensation prevents any digital clipping when boosting EQ/Master
      const maxPosEq = Math.max(0, ...eqBands);
      const masterBoostDb = isPure ? 0 : 1.6;
      const headroomDb = -Math.min(6.5, maxPosEq * 0.42 + masterBoostDb);
      setSmooth(mastering.headroomGain.gain, Math.pow(10, headroomDb / 20));

      // Master clarity contour
      setSmooth(mastering.subFilter.gain, profile.subGain);
      setSmooth(mastering.cleanFilter.gain, profile.cleanGain);
      setSmooth(mastering.presenceFilter.gain, profile.presenceGain);
      setSmooth(mastering.airFilter.gain, profile.airGain);

      // User 5-band EQ
      filters.forEach((filter, idx) => {
        setSmooth(filter.gain, eqBands[idx] ?? 0);
      });

      // Mid/Side spatial stereo width
      const widthScale = Math.max(0, Math.min(1.5, spatialWidth / 65));
      const targetWidth = isPure
        ? 1.0
        : Math.max(1.0, Math.min(1.65, 1.0 + (profile.baseWidth - 1.0) * widthScale));
      setSmooth(mastering.sideWidthGain.gain, targetWidth);

      // Early-reflection studio air wet mix
      const targetWet = isPure ? 0 : Math.min(0.28, profile.reverbWet * widthScale);
      setSmooth(mastering.reverbWetGain.gain, targetWet);

      // Sound Check loudness leveling vs Transparent True-Peak Safety Limiter
      if (soundCheckEnabled) {
        setSmooth(mastering.compressor.threshold, -18);
        setSmooth(mastering.compressor.knee, 14);
        setSmooth(mastering.compressor.ratio, 2.4);
        setSmooth(mastering.compressor.attack, 0.008);
        setSmooth(mastering.compressor.release, 0.18);
        setSmooth(mastering.makeupGain.gain, 1.24);
      } else {
        setSmooth(mastering.compressor.threshold, -1.5);
        setSmooth(mastering.compressor.knee, 2);
        setSmooth(mastering.compressor.ratio, 12);
        setSmooth(mastering.compressor.attack, 0.002);
        setSmooth(mastering.compressor.release, 0.08);
        setSmooth(mastering.makeupGain.gain, 1.0);
      }
    },
    [audioMode, eqBands, soundCheckEnabled, spatialWidth]
  );

  const ensureWebAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx({ latencyHint: 'playback' });
      const source = ctx.createMediaElementSource(audio);
      source.channelCount = 2;
      source.channelInterpretation = 'speakers';

      // 1. Headroom Trim
      const headroomGain = ctx.createGain();

      // 2. Studio Master Clarity Contour
      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowshelf';
      subFilter.frequency.value = 55;

      const cleanFilter = ctx.createBiquadFilter();
      cleanFilter.type = 'peaking';
      cleanFilter.frequency.value = 260;
      cleanFilter.Q.value = 0.9;

      const presenceFilter = ctx.createBiquadFilter();
      presenceFilter.type = 'peaking';
      presenceFilter.frequency.value = 3400;
      presenceFilter.Q.value = 0.75;

      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'highshelf';
      airFilter.frequency.value = 11500;

      // 3. User 5-Band EQ
      const filters: BiquadFilterNode[] = EQ_FREQUENCIES.map((freq, idx) => {
        const filter = ctx.createBiquadFilter();
        filter.type =
          idx === 0 ? 'lowshelf' : idx === EQ_FREQUENCIES.length - 1 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.0;
        filter.gain.value = eqBands[idx] ?? 0;
        return filter;
      });

      // 4. Mid / Side Spatial Stereo Widener
      const splitter = ctx.createChannelSplitter(2);
      const midGainL = ctx.createGain();
      midGainL.gain.value = 0.5;
      const midGainR = ctx.createGain();
      midGainR.gain.value = 0.5;
      const midSum = ctx.createGain();

      const sideGainL = ctx.createGain();
      sideGainL.gain.value = 0.5;
      const sideGainR = ctx.createGain();
      sideGainR.gain.value = -0.5;
      const sideSum = ctx.createGain();

      const sideWidthGain = ctx.createGain();
      const sideInvert = ctx.createGain();
      sideInvert.gain.value = -1;
      const merger = ctx.createChannelMerger(2);

      // 5. Parallel Binaural Early-Reflection Studio Air
      const postStageBus = ctx.createGain();
      const reverbHighPass = ctx.createBiquadFilter();
      reverbHighPass.type = 'highpass';
      reverbHighPass.frequency.value = 240;

      const convolver = ctx.createConvolver();
      convolver.buffer = createStudioImpulseBuffer(ctx);
      const reverbWetGain = ctx.createGain();

      // 6. Sound Check & True-Peak Mastering Limiter
      const compressor = ctx.createDynamicsCompressor();
      const makeupGain = ctx.createGain();

      // 7. Analyser -> Destination
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.82;

      // Wire Serial Chain: Source -> Headroom -> Master Contour -> 5-Band EQ
      source.connect(headroomGain);
      headroomGain.connect(subFilter);
      subFilter.connect(cleanFilter);
      cleanFilter.connect(presenceFilter);
      presenceFilter.connect(airFilter);

      let prev: AudioNode = airFilter;
      for (const f of filters) {
        prev.connect(f);
        prev = f;
      }

      // Wire Mid / Side Stereo Stage
      prev.connect(splitter);
      splitter.connect(midGainL, 0);
      splitter.connect(midGainR, 1);
      midGainL.connect(midSum);
      midGainR.connect(midSum);

      splitter.connect(sideGainL, 0);
      splitter.connect(sideGainR, 1);
      sideGainL.connect(sideSum);
      sideGainR.connect(sideSum);

      sideSum.connect(sideWidthGain);
      midSum.connect(merger, 0, 0);
      midSum.connect(merger, 0, 1);
      sideWidthGain.connect(merger, 0, 0);
      sideWidthGain.connect(sideInvert);
      sideInvert.connect(merger, 0, 1);

      // Dry + Spatial Wet -> Compressor -> Makeup -> Analyser -> Output
      merger.connect(postStageBus);
      merger.connect(reverbHighPass);
      reverbHighPass.connect(convolver);
      convolver.connect(reverbWetGain);
      reverbWetGain.connect(postStageBus);

      postStageBus.connect(compressor);
      compressor.connect(makeupGain);
      makeupGain.connect(analyser);
      analyser.connect(ctx.destination);

      const mastering: MasteringNodes = {
        headroomGain,
        subFilter,
        cleanFilter,
        presenceFilter,
        airFilter,
        sideWidthGain,
        reverbWetGain,
        compressor,
        makeupGain,
      };

      applyDspParameters(ctx, filters, mastering, true);

      audioCtxRef.current = ctx;
      filtersRef.current = filters;
      masteringRef.current = mastering;
      analyserRef.current = analyser;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, [applyDspParameters, eqBands]);

  // Apply EQ, Spatial Mode & Sound Check changes live with smooth ramping
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const mastering = masteringRef.current;
    if (!ctx || !mastering) return;
    applyDspParameters(ctx, filtersRef.current, mastering, false);
  }, [applyDspParameters]);

  // Apply volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Apply playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const loadAndPlayTrack = useCallback(
    async (trackId: string, newQueueIds?: string[]) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (newQueueIds && newQueueIds.length > 0) {
        setQueueIds(newQueueIds);
      } else if (!queueIds.includes(trackId)) {
        setQueueIds(tracks.map((t) => t.id));
      }

      const blob = await getTrackBlob(trackId);
      if (!blob) return;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      setCurrentTrackId(trackId);
      setCurrentTime(0);

      audio.src = url;
      audio.playbackRate = playbackSpeed;
      audio.volume = isMuted ? 0 : volume;

      ensureWebAudioGraph();
      try {
        await audio.play();
        setIsPlaying(true);
        onTrackPlayed?.(trackId);
      } catch (err) {
        console.warn('Playback blocked or interrupted:', err);
        setIsPlaying(false);
      }
    },
    [ensureWebAudioGraph, isMuted, onTrackPlayed, playbackSpeed, queueIds, tracks, volume]
  );

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrackId) {
      if (tracks.length > 0) {
        await loadAndPlayTrack(tracks[0].id, tracks.map((t) => t.id));
      }
      return;
    }

    ensureWebAudioGraph();
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentTrackId, ensureWebAudioGraph, loadAndPlayTrack, tracks]);

  const lastTimeEmitRef = useRef<number>(0);

  const seekTo = useCallback((sec: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(sec)) return;
    const clamped = Math.max(0, Math.min(audio.duration || 0, sec));
    audio.currentTime = clamped;
    lastTimeEmitRef.current = clamped;
    setCurrentTime(clamped);
  }, []);

  const getActiveQueue = useCallback(() => {
    const validSet = new Set(tracks.map((t) => t.id));
    const filtered = queueIds.filter((id) => validSet.has(id));
    return filtered.length > 0 ? filtered : tracks.map((t) => t.id);
  }, [queueIds, tracks]);

  const playNext = useCallback(
    async (fromAutoEnd = false) => {
      const q = getActiveQueue();
      if (q.length === 0) return;

      if (fromAutoEnd && sleepOnTrackEnd) {
        setSleepOnTrackEnd(false);
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
        return;
      }

      if (fromAutoEnd && repeat === 'one' && currentTrackId) {
        seekTo(0);
        await audioRef.current?.play().catch(() => {});
        setIsPlaying(true);
        return;
      }

      if (shuffle && q.length > 1) {
        const candidates = q.filter((id) => id !== currentTrackId);
        const nextId = candidates[Math.floor(Math.random() * candidates.length)];
        await loadAndPlayTrack(nextId, q);
        return;
      }

      const idx = currentTrackId ? q.indexOf(currentTrackId) : -1;
      const nextIdx = idx + 1;
      if (nextIdx < q.length) {
        await loadAndPlayTrack(q[nextIdx], q);
      } else if (repeat === 'all') {
        await loadAndPlayTrack(q[0], q);
      } else {
        setIsPlaying(false);
      }
    },
    [currentTrackId, getActiveQueue, loadAndPlayTrack, repeat, seekTo, shuffle, sleepOnTrackEnd]
  );

  const playPrev = useCallback(async () => {
    if (audioRef.current && audioRef.current.currentTime > 4) {
      seekTo(0);
      return;
    }
    const q = getActiveQueue();
    if (q.length === 0) return;
    const idx = currentTrackId ? q.indexOf(currentTrackId) : 0;
    const prevIdx = idx - 1 >= 0 ? idx - 1 : q.length - 1;
    await loadAndPlayTrack(q[prevIdx], q);
  }, [currentTrackId, getActiveQueue, loadAndPlayTrack, seekTo]);

  // Attach audio element listeners (throttled timeupdate prevents 5Hz full-app re-render churn)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const t = audio.currentTime || 0;
      if (Math.abs(t - lastTimeEmitRef.current) >= 0.28 || t === 0) {
        lastTimeEmitRef.current = t;
        setCurrentTime(t);
      }
    };
    const onLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      lastTimeEmitRef.current = 0;
      playNext(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playNext]);

  // Sleep timer countdown (tick every 60s)
  useEffect(() => {
    if (sleepMinutesRemaining === null) return;
    if (sleepMinutesRemaining <= 0) {
      setSleepMinutesRemaining(null);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
    const timer = window.setTimeout(() => {
      setSleepMinutesRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 60_000);
    return () => window.clearTimeout(timer);
  }, [sleepMinutesRemaining]);

  // Media Session API: register metadata and action handlers only when track or handlers change
  useEffect(() => {
    if (!('mediaSession' in navigator) || !backgroundPlaybackEnabled) return;

    if (currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: currentTrack.coverUrl
          ? [{ src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' }]
          : [],
      });
    }

    navigator.mediaSession.setActionHandler('play', () => {
      if (audioRef.current?.paused) togglePlay();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (audioRef.current && !audioRef.current.paused) togglePlay();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrev();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNext(false);
    });
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number') {
        seekTo(details.seekTime);
      }
    });
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const offset = details.seekOffset ?? 10;
      seekTo((audioRef.current?.currentTime ?? 0) - offset);
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const offset = details.seekOffset ?? 10;
      seekTo((audioRef.current?.currentTime ?? 0) + offset);
    });

    return () => {
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
      } catch {
        // Ignore browser support quirks
      }
    };
  }, [
    backgroundPlaybackEnabled,
    currentTrack,
    playNext,
    playPrev,
    seekTo,
    togglePlay,
  ]);

  // Update Media Session playbackState & throttled positionState without tearing down handlers
  const lastMediaSessionPosSyncRef = useRef<number>(0);
  useEffect(() => {
    if (!('mediaSession' in navigator) || !backgroundPlaybackEnabled) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [backgroundPlaybackEnabled, isPlaying]);

  useEffect(() => {
    if (!('mediaSession' in navigator) || !backgroundPlaybackEnabled) return;
    if (typeof navigator.mediaSession.setPositionState !== 'function') return;

    const now = performance.now();
    if (now - lastMediaSessionPosSyncRef.current < 1800 && currentTime > 0.5) return;
    lastMediaSessionPosSyncRef.current = now;

    const safeDuration =
      Number.isFinite(duration) && duration > 0 ? duration : currentTrack?.duration || 0;
    if (safeDuration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: safeDuration,
          playbackRate: playbackSpeed || 1,
          position: Math.min(safeDuration, Math.max(0, currentTime)),
        });
      } catch {
        // Ignore transient duration mismatches
      }
    }
  }, [backgroundPlaybackEnabled, currentTime, currentTrack?.duration, duration, playbackSpeed]);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueueIds((prev) => prev.filter((id) => id !== trackId));
  }, []);

  const addToQueueNext = useCallback(
    (trackId: string) => {
      setQueueIds((prev) => {
        const filtered = prev.filter((id) => id !== trackId);
        const curIdx = currentTrackId ? filtered.indexOf(currentTrackId) : -1;
        if (curIdx >= 0) {
          filtered.splice(curIdx + 1, 0, trackId);
          return [...filtered];
        }
        return [trackId, ...filtered];
      });
    },
    [currentTrackId]
  );

  return {
    currentTrack,
    currentTrackId,
    isPlaying,
    currentTime,
    duration: duration || currentTrack?.duration || 0,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    queueIds: getActiveQueue(),
    setQueueIds,
    removeFromQueue,
    addToQueueNext,
    sleepMinutesRemaining,
    setSleepMinutesRemaining,
    sleepOnTrackEnd,
    setSleepOnTrackEnd,
    analyserRef,
    loadAndPlayTrack,
    togglePlay,
    seekTo,
    playNext,
    playPrev,
  };
}
