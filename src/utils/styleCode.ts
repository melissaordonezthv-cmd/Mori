import type {
  AppSettings,
  ProfileConfig,
  ThemeConfig,
} from '../types/music';

const CODE_PREFIX = 'MORI1-';

interface StyleBundlePayload {
  v: 1;
  theme: Omit<ThemeConfig, 'bannerImageUrl' | 'bannerText'>;
  profileStyle: {
    avatarFrame: ProfileConfig['avatarFrame'];
    nameShape?: ProfileConfig['nameShape'];
    activeCharms: ProfileConfig['activeCharms'];
  };
  screenStyle: Pick<
    AppSettings,
    | 'nowPlayingVisual'
    | 'nowPlayingColorMode'
    | 'nowPlayingPrimaryColor'
    | 'nowPlayingSecondaryColor'
    | 'nowPlayingAccentColor'
    | 'nowPlayingDetailColor'
    | 'nowPlayingHideCover'
    | 'musicCardOuterIcon'
    | 'musicCardOuterIconColor'
    | 'settingsTextColorId'
    | 'settingsTextCustomHex'
    | 'trackCardWidthPercent'
    | 'trackCardHeightPx'
    | 'wallpaperOpacity'
    | 'wallpaperFilter'
    | 'wallpaperMotion'
    | 'screenOverlayFilter'
    | 'screenOverlayIntensity'
  >;
}

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUtf8(b64url: string): string {
  const normalized = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Generates a shareable style code containing ALL theme, main-screen,
 * card dimensions, 3D visual, filters, and profile frame/charm styles —
 * explicitly excluding banners, profile photos, personal bio/name, and wallpaper photos.
 */
export function encodeStyleCode(
  theme: ThemeConfig,
  profile: ProfileConfig,
  settings: AppSettings
): string {
  const { bannerImageUrl: _bImg, bannerText: _bTxt, ...themeWithoutBanner } = theme;

  const payload: StyleBundlePayload = {
    v: 1,
    theme: themeWithoutBanner,
    profileStyle: {
      avatarFrame: profile.avatarFrame,
      nameShape: profile.nameShape,
      activeCharms: Array.isArray(profile.activeCharms) ? profile.activeCharms : [],
    },
    screenStyle: {
      nowPlayingVisual: settings.nowPlayingVisual,
      nowPlayingColorMode: settings.nowPlayingColorMode,
      nowPlayingPrimaryColor: settings.nowPlayingPrimaryColor,
      nowPlayingSecondaryColor: settings.nowPlayingSecondaryColor,
      nowPlayingAccentColor: settings.nowPlayingAccentColor,
      nowPlayingDetailColor: settings.nowPlayingDetailColor,
      nowPlayingHideCover: settings.nowPlayingHideCover,
      musicCardOuterIcon: settings.musicCardOuterIcon,
      musicCardOuterIconColor: settings.musicCardOuterIconColor,
      settingsTextColorId: settings.settingsTextColorId,
      settingsTextCustomHex: settings.settingsTextCustomHex,
      trackCardWidthPercent: settings.trackCardWidthPercent,
      trackCardHeightPx: settings.trackCardHeightPx,
      wallpaperOpacity: settings.wallpaperOpacity,
      wallpaperFilter: settings.wallpaperFilter,
      wallpaperMotion: settings.wallpaperMotion,
      screenOverlayFilter: settings.screenOverlayFilter,
      screenOverlayIntensity: settings.screenOverlayIntensity,
    },
  };

  return CODE_PREFIX + utf8ToBase64Url(JSON.stringify(payload));
}

export type DecodeStyleResult =
  | {
      ok: true;
      nextTheme: ThemeConfig;
      nextProfile: ProfileConfig;
      nextSettings: AppSettings;
    }
  | {
      ok: false;
      error: string;
    };

/**
 * Parses a shared MORI1-... style code and merges it onto the recipient's state
 * while preserving the recipient's own banners, profile picture, display name, and wallpaper photo.
 */
export function decodeStyleCode(
  rawCode: string,
  currentTheme: ThemeConfig,
  currentProfile: ProfileConfig,
  currentSettings: AppSettings
): DecodeStyleResult {
  const trimmed = rawCode.trim();
  if (!trimmed) {
    return { ok: false, error: 'Pega un código de estilo primero.' };
  }

  const token = trimmed.startsWith(CODE_PREFIX)
    ? trimmed.slice(CODE_PREFIX.length)
    : trimmed;

  try {
    const jsonStr = base64UrlToUtf8(token);
    const parsed = JSON.parse(jsonStr) as Partial<StyleBundlePayload>;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.v !== 1 ||
      !parsed.theme ||
      typeof parsed.theme !== 'object'
    ) {
      return { ok: false, error: 'El código no tiene un formato de estilo válido.' };
    }

    const incomingTheme = parsed.theme as Record<string, unknown>;
    const cleanTheme: ThemeConfig = {
      ...currentTheme,
      ...parsed.theme,
      // Always preserve recipient's personal banner!
      bannerImageUrl: currentTheme.bannerImageUrl,
      bannerText: currentTheme.bannerText,
    };

    // Defensive check so malicious/broken string doesn't overwrite backgroundColorId with non-string
    if (typeof incomingTheme.backgroundColorId !== 'string') {
      cleanTheme.backgroundColorId = currentTheme.backgroundColorId;
    }

    const incomingProfile = parsed.profileStyle;
    const nextProfile: ProfileConfig = {
      ...currentProfile,
      avatarFrame: incomingProfile?.avatarFrame ?? currentProfile.avatarFrame,
      nameShape: incomingProfile?.nameShape ?? currentProfile.nameShape,
      activeCharms: Array.isArray(incomingProfile?.activeCharms)
        ? incomingProfile.activeCharms
        : currentProfile.activeCharms,
      // Always preserve recipient's personal avatar & banner photos & bio!
      avatarUrl: currentProfile.avatarUrl,
      bannerUrl: currentProfile.bannerUrl,
    };

    const incomingScreen = parsed.screenStyle ?? {};
    const nextSettings: AppSettings = {
      ...currentSettings,
      nowPlayingVisual: incomingScreen.nowPlayingVisual ?? currentSettings.nowPlayingVisual,
      nowPlayingColorMode: incomingScreen.nowPlayingColorMode ?? currentSettings.nowPlayingColorMode,
      nowPlayingPrimaryColor:
        incomingScreen.nowPlayingPrimaryColor ?? currentSettings.nowPlayingPrimaryColor,
      nowPlayingSecondaryColor:
        incomingScreen.nowPlayingSecondaryColor ?? currentSettings.nowPlayingSecondaryColor,
      nowPlayingAccentColor:
        incomingScreen.nowPlayingAccentColor ?? currentSettings.nowPlayingAccentColor,
      nowPlayingDetailColor:
        incomingScreen.nowPlayingDetailColor ?? currentSettings.nowPlayingDetailColor,
      nowPlayingHideCover:
        incomingScreen.nowPlayingHideCover ?? currentSettings.nowPlayingHideCover,
      musicCardOuterIcon:
        incomingScreen.musicCardOuterIcon ?? currentSettings.musicCardOuterIcon,
      musicCardOuterIconColor:
        incomingScreen.musicCardOuterIconColor ?? currentSettings.musicCardOuterIconColor,
      settingsTextColorId:
        incomingScreen.settingsTextColorId ?? currentSettings.settingsTextColorId,
      settingsTextCustomHex:
        incomingScreen.settingsTextCustomHex ?? currentSettings.settingsTextCustomHex,
      trackCardWidthPercent:
        typeof incomingScreen.trackCardWidthPercent === 'number'
          ? Math.min(100, Math.max(58, incomingScreen.trackCardWidthPercent))
          : currentSettings.trackCardWidthPercent,
      trackCardHeightPx:
        typeof incomingScreen.trackCardHeightPx === 'number'
          ? Math.min(176, Math.max(56, incomingScreen.trackCardHeightPx))
          : currentSettings.trackCardHeightPx,
      wallpaperOpacity:
        typeof incomingScreen.wallpaperOpacity === 'number'
          ? incomingScreen.wallpaperOpacity
          : currentSettings.wallpaperOpacity,
      wallpaperFilter:
        incomingScreen.wallpaperFilter === 'blur_soft' ||
        (incomingScreen.wallpaperFilter as string | undefined) === 'blur_deep' ||
        (incomingScreen.wallpaperFilter as string | undefined) === 'blur_drops'
          ? 'blur_soft'
          : incomingScreen.wallpaperFilter
            ? 'none'
            : currentSettings.wallpaperFilter,
      wallpaperMotion: incomingScreen.wallpaperMotion ?? currentSettings.wallpaperMotion,
      screenOverlayFilter:
        incomingScreen.screenOverlayFilter ?? currentSettings.screenOverlayFilter,
      screenOverlayIntensity:
        typeof incomingScreen.screenOverlayIntensity === 'number'
          ? incomingScreen.screenOverlayIntensity
          : currentSettings.screenOverlayIntensity,
      // Preserve recipient's own uploaded wallpaper image & audio/language prefs
      wallpaperUrl: currentSettings.wallpaperUrl,
    };

    return {
      ok: true,
      nextTheme: cleanTheme,
      nextProfile,
      nextSettings,
    };
  } catch {
    return {
      ok: false,
      error: 'No se pudo leer el código. Verifica que lo copiaste completo sin cortar letras.',
    };
  }
}

/**
 * Compresses an uploaded gallery image into a lightweight JPEG dataURL
 * so custom wallpapers stay crisp and fit comfortably in localStorage.
 */
export function compressWallpaperImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxSide = 1440;
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          const ratio = Math.min(maxSide / width, maxSide / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('No se pudo procesar la imagen'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Formato de imagen no compatible'));
    };
    img.src = objectUrl;
  });
}
