import React, { useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Crop,
  Image as ImageIcon,
  Layers,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import {
  BUTTON_THEMES,
  DEFAULT_COVER_SAKURA,
  DIVIDER_SWATCHES,
  PLAYBACK_BUTTON_3D_STYLES,
  PLAYBACK_BUTTON_COLOR_PRESETS,
  SONG_BAR_ANIMATIONS,
  SONG_BAR_OUT_OF_LINE_ANIMATIONS,
  SONG_BAR_SWATCHES,
  SONG_TITLE_COLOR_PRESETS,
  SONG_TITLE_SHAPES,
  SURFACE_SWATCHES,
  TEXT_SWATCHES,
  TRACK_CARD_COLOR_PRESETS,
  TRACK_CARD_DECORS,
  TRACK_CARD_STYLES,
} from '../constants/themes';
import type { ThemeConfig } from '../types/music';
import { resizeImageFileToDataUrl } from '../utils/audioMetadata';
import { getPlaybackControlPresentation } from '../utils/playbackButtons3D';
import { getTrackCardPresentation } from '../utils/trackCardStyles';
import { ImageEditorModal } from './ImageEditorModal';
import { SongProgressBar } from './SongProgressBar';
import { SongTitleDisplay } from './SongTitleDisplay';

interface ThemeModalProps {
  open: boolean;
  theme: ThemeConfig;
  onChange: (next: ThemeConfig) => void;
  onPreviewIntro: () => void;
  onOpenMusicCardSettings?: () => void;
  onClose: () => void;
}

type SectionKey =
  | 'bg'
  | 'player'
  | 'bar'
  | 'songTitle'
  | 'banner'
  | 'cards'
  | 'playback3d'
  | 'buttons'
  | 'dividers'
  | 'text';

type SubListKey =
  | 'bgColors'
  | 'playerColors'
  | 'barOutAnims'
  | 'barAnims'
  | 'barColors'
  | 'songTitleShapes'
  | 'songTitleColors'
  | 'cardColors'
  | 'cardStyles'
  | 'pbColors'
  | 'pbStyles'
  | 'btnThemes'
  | 'divColors'
  | 'textColors';

function sliceWithActive<T>(
  items: T[],
  limit: number,
  showAll: boolean,
  isSelected: (item: T) => boolean
): { visible: T[]; hasMore: boolean; remaining: number } {
  if (showAll || items.length <= limit) {
    return { visible: items, hasMore: false, remaining: 0 };
  }
  const head = items.slice(0, limit);
  if (!head.some(isSelected)) {
    const active = items.find(isSelected);
    if (active) {
      return {
        visible: [active, ...items.slice(0, limit - 1)],
        hasMore: true,
        remaining: items.length - limit,
      };
    }
  }
  return {
    visible: head,
    hasMore: true,
    remaining: items.length - limit,
  };
}

function isLightHexColor(hexStr?: string): boolean {
  if (!hexStr) return false;
  const clean = hexStr.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return false;
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  open,
  theme,
  onChange,
  onPreviewIntro,
  onOpenMusicCardSettings,
  onClose,
}) => {
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingBanner, setPendingBanner] = useState<{ src: string; isBlob: boolean } | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(true);
  const [openSections, setOpenSections] = useState<Partial<Record<SectionKey, boolean>>>({});
  const [expandedSubLists, setExpandedSubLists] = useState<Partial<Record<SubListKey, boolean>>>({});

  if (!open) return null;

  const isCompactMode = theme.compactThemeLists ?? true;
  const activeBg = SURFACE_SWATCHES.find((s) => s.id === theme.backgroundColorId);
  const activePlayer = SURFACE_SWATCHES.find((s) => s.id === theme.playerColorId);
  const activeText = TEXT_SWATCHES.find((t) => t.id === theme.textColorId);
  const activeDivider = DIVIDER_SWATCHES.find((d) => d.id === theme.dividerColorId);
  const activeBarColor = SONG_BAR_SWATCHES.find((b) => b.id === (theme.songBarColorId ?? 'auto'));

  const isTextLight = isLightHexColor(activeText?.hex);
  const lowContrastTip =
    (activeBg?.isDark && !isTextLight) || (!activeBg?.isDark && isTextLight);

  const activeBarAnim = theme.songBarAnimationId ?? 'shimmer_glow';
  const activeBarMeta =
    [...SONG_BAR_OUT_OF_LINE_ANIMATIONS, ...SONG_BAR_ANIMATIONS].find(
      (a) => a.id === activeBarAnim
    ) ?? SONG_BAR_ANIMATIONS[0];

  const activeCardStyle = theme.trackCardStyleId ?? 'soft_pill';
  const activeCardStyleMeta =
    TRACK_CARD_STYLES.find((c) => c.id === activeCardStyle) ?? TRACK_CARD_STYLES[0];
  const activeCardColor = theme.trackCardColorId ?? 'auto';
  const activeCardColorMeta =
    TRACK_CARD_COLOR_PRESETS.find((c) => c.id === activeCardColor) ?? TRACK_CARD_COLOR_PRESETS[0];
  const activeCardDecor = theme.trackCardDecorId ?? 'auto';

  const activeButtonTheme = theme.buttonThemeId ?? 'soft_pill';
  const activeButtonMeta =
    BUTTON_THEMES.find((b) => b.id === activeButtonTheme) ?? BUTTON_THEMES[0];

  const activePbStyle = theme.playbackBtnStyleId ?? 'cushion_3d';
  const activePbStyleMeta =
    PLAYBACK_BUTTON_3D_STYLES.find((p) => p.id === activePbStyle) ?? PLAYBACK_BUTTON_3D_STYLES[0];
  const activePbColor = theme.playbackBtnColorId ?? 'auto';
  const activePbColorMeta =
    PLAYBACK_BUTTON_COLOR_PRESETS.find((p) => p.id === activePbColor) ??
    PLAYBACK_BUTTON_COLOR_PRESETS[0];

  const activeTitleShape = theme.songTitleShapeId ?? 'cloud_plush';
  const activeTitleShapeMeta =
    SONG_TITLE_SHAPES.find((s) => s.id === activeTitleShape) ?? SONG_TITLE_SHAPES[1];
  const activeTitleColor = theme.songTitleColorId ?? 'auto';
  const activeTitleColorMeta =
    SONG_TITLE_COLOR_PRESETS.find((c) => c.id === activeTitleColor) ?? SONG_TITLE_COLOR_PRESETS[0];

  const cardPreview = getTrackCardPresentation(activeCardStyle, activeCardDecor, true, true, {
    colorId: activeCardColor,
    customBg: theme.trackCardCustomBg,
    customText: theme.trackCardCustomText,
  });

  const isSectionOpen = (key: SectionKey) => !isCompactMode || Boolean(openSections[key]);
  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSubExpanded = (key: SubListKey) => !isCompactMode || Boolean(expandedSubLists[key]);
  const toggleSubList = (key: SubListKey) => {
    setExpandedSubLists((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderExpandButton = (
    key: SubListKey,
    totalCount: number,
    hasMore: boolean,
    labelPlural: string
  ) => {
    if (!isCompactMode) return null;
    const expanded = Boolean(expandedSubLists[key]);
    if (!hasMore && !expanded) return null;
    return (
      <button
        type="button"
        onClick={() => toggleSubList(key)}
        className="btn-raw mt-2.5 w-full min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
      >
        <span>
          {expanded
            ? `Mostrar solo una parte`
            : `Ver todos los ${totalCount} ${labelPlural}`}
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    );
  };

  const renderSectionHeader = (
    key: SectionKey,
    title: string,
    summaryText: string,
    badgeNode: React.ReactNode,
    countHint?: string
  ) => {
    const opened = isSectionOpen(key);
    if (!isCompactMode) {
      return (
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {badgeNode}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">{title}</h3>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                {summaryText}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => toggleSection(key)}
        aria-expanded={opened}
        className="btn-raw w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {badgeNode}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">{title}</h3>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              Actual: {summaryText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {countHint && (
            <span
              className="text-[11px] font-medium hidden sm:inline"
              style={{ color: 'var(--text-muted)' }}
            >
              {countHint}
            </span>
          )}
          <span
            className="w-8 h-8 rounded-xl border flex items-center justify-center"
            style={{
              backgroundColor: opened ? 'var(--accent-soft)' : 'var(--bg-elevated)',
              borderColor: 'var(--divider-color)',
            }}
          >
            {opened ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </div>
      </button>
    );
  };

  const closePendingBanner = () => {
    if (pendingBanner?.isBlob) {
      URL.revokeObjectURL(pendingBanner.src);
    }
    setPendingBanner(null);
  };

  const bgSlice = sliceWithActive(
    SURFACE_SWATCHES,
    6,
    isSubExpanded('bgColors'),
    (s) => s.id === theme.backgroundColorId
  );
  const playerSlice = sliceWithActive(
    SURFACE_SWATCHES,
    6,
    isSubExpanded('playerColors'),
    (s) => s.id === theme.playerColorId
  );
  const outBarSlice = sliceWithActive(
    SONG_BAR_OUT_OF_LINE_ANIMATIONS,
    4,
    isSubExpanded('barOutAnims'),
    (a) => a.id === activeBarAnim
  );
  const barAnimSlice = sliceWithActive(
    SONG_BAR_ANIMATIONS,
    6,
    isSubExpanded('barAnims'),
    (a) => a.id === activeBarAnim
  );
  const barColorSlice = sliceWithActive(
    SONG_BAR_SWATCHES,
    6,
    isSubExpanded('barColors'),
    (b) => b.id === (theme.songBarColorId ?? 'auto')
  );
  const cardColorSlice = sliceWithActive(
    TRACK_CARD_COLOR_PRESETS,
    6,
    isSubExpanded('cardColors'),
    (c) => c.id === activeCardColor
  );
  const cardStyleSlice = sliceWithActive(
    TRACK_CARD_STYLES,
    6,
    isSubExpanded('cardStyles'),
    (c) => c.id === activeCardStyle
  );
  const pbColorSlice = sliceWithActive(
    PLAYBACK_BUTTON_COLOR_PRESETS,
    6,
    isSubExpanded('pbColors'),
    (c) => c.id === activePbColor
  );
  const pbStyleSlice = sliceWithActive(
    PLAYBACK_BUTTON_3D_STYLES,
    6,
    isSubExpanded('pbStyles'),
    (c) => c.id === activePbStyle
  );
  const btnThemeSlice = sliceWithActive(
    BUTTON_THEMES,
    6,
    isSubExpanded('btnThemes'),
    (b) => b.id === activeButtonTheme
  );
  const divSlice = sliceWithActive(
    DIVIDER_SWATCHES,
    6,
    isSubExpanded('divColors'),
    (d) => d.id === theme.dividerColorId
  );
  const textSlice = sliceWithActive(
    TEXT_SWATCHES,
    6,
    isSubExpanded('textColors'),
    (t) => t.id === theme.textColorId
  );
  const songTitleShapeSlice = sliceWithActive(
    SONG_TITLE_SHAPES,
    6,
    isSubExpanded('songTitleShapes'),
    (s) => s.id === activeTitleShape
  );
  const songTitleColorSlice = sliceWithActive(
    SONG_TITLE_COLOR_PRESETS,
    6,
    isSubExpanded('songTitleColors'),
    (c) => c.id === activeTitleColor
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Personalizar tema"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-2xl border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-4 pb-4 border-b"
          style={{ borderColor: 'var(--divider-color)' }}
        >
          <div>
            <h2 className="text-xl font-bold tracking-tight">Personalizar tema</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Elige tus colores, estilos 3D, botones y animaciones sin saturar la vista
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onPreviewIntro}
              className="min-h-[40px] px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 border transition active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Ver intro</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center border transition-transform active:scale-95"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--divider-color)',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Display Mode Option: Compact Lists (show part + open on tap) vs Show Everything */}
        <div
          className="mt-4 p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2.5"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--divider-color)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Layers className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold">Vista de opciones y colores</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {isCompactMode
                  ? 'Muestra solo una parte y despliega cada lista al tocarla'
                  : 'Mostrando todas las listas y colores completos'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onChange({ ...theme, compactThemeLists: true })}
              className="btn-raw min-h-[34px] px-3 py-1 rounded-xl border text-xs font-semibold transition"
              style={{
                backgroundColor: isCompactMode ? 'var(--accent-color)' : 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
                color: isCompactMode ? '#1C1B1F' : 'var(--text-main)',
              }}
            >
              Por partes
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...theme, compactThemeLists: false })}
              className="btn-raw min-h-[34px] px-3 py-1 rounded-xl border text-xs font-semibold transition"
              style={{
                backgroundColor: !isCompactMode ? 'var(--accent-color)' : 'var(--bg-elevated)',
                borderColor: 'var(--divider-color)',
                color: !isCompactMode ? '#1C1B1F' : 'var(--text-main)',
              }}
            >
              Ver todo
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {/* 1. Background Color */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-1'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'bg',
              'Fondo de la app',
              activeBg?.label ?? 'Rosa',
              <span
                className="w-7 h-7 rounded-full border shrink-0"
                style={{
                  backgroundColor: activeBg?.swatchPreview ?? '#F8D4E0',
                  borderColor: 'rgba(128,128,128,0.35)',
                }}
              />,
              `${SURFACE_SWATCHES.length} colores`
            )}
            {isSectionOpen('bg') && (
              <div className={isCompactMode ? 'px-4 pb-4 pt-1 border-t' : ''} style={{ borderColor: 'var(--divider-color)' }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {bgSlice.visible.map((swatch) => {
                    const selected = theme.backgroundColorId === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => onChange({ ...theme, backgroundColorId: swatch.id })}
                        className="min-h-[42px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                        style={{
                          backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                          style={{
                            backgroundColor: swatch.swatchPreview,
                            borderColor: 'rgba(128,128,128,0.28)',
                          }}
                        >
                          {selected && (
                            <Check
                              className="w-3 h-3"
                              style={{ color: swatch.isDark ? '#FFFFFF' : '#1C1B1F' }}
                            />
                          )}
                        </span>
                        <span className="truncate">{swatch.label}</span>
                      </button>
                    );
                  })}
                </div>
                {renderExpandButton('bgColors', SURFACE_SWATCHES.length, bgSlice.hasMore, 'colores')}
              </div>
            )}
          </section>

          {/* 2. Player & Card Surface Color */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'player',
              'Color del reproductor y acentos',
              activePlayer?.label ?? 'Rosa',
              <span
                className="w-7 h-7 rounded-full border shrink-0"
                style={{
                  backgroundColor: activePlayer?.accent ?? '#F4B8CC',
                  borderColor: 'rgba(128,128,128,0.35)',
                }}
              />,
              `${SURFACE_SWATCHES.length} colores`
            )}
            {isSectionOpen('player') && (
              <div className={isCompactMode ? 'px-4 pb-4 pt-1 border-t' : ''} style={{ borderColor: 'var(--divider-color)' }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {playerSlice.visible.map((swatch) => {
                    const selected = theme.playerColorId === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => onChange({ ...theme, playerColorId: swatch.id })}
                        className="min-h-[42px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                        style={{
                          backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                          style={{
                            backgroundColor: swatch.accent,
                            borderColor: 'rgba(128,128,128,0.28)',
                          }}
                        >
                          {selected && (
                            <Check
                              className="w-3 h-3"
                              style={{ color: isLightHexColor(swatch.accent) ? '#1C1B1F' : '#FFFFFF' }}
                            />
                          )}
                        </span>
                        <span className="truncate">{swatch.label}</span>
                      </button>
                    );
                  })}
                </div>
                {renderExpandButton('playerColors', SURFACE_SWATCHES.length, playerSlice.hasMore, 'colores')}
              </div>
            )}
          </section>

          {/* 3. Song Progress Bar Color + Cute & Out-of-Line Animations */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'bar',
              'Barra de la canción y animaciones',
              `${activeBarMeta.label} · ${activeBarColor?.label ?? 'Auto'}`,
              <span
                className="w-7 h-7 rounded-full border shrink-0 flex items-center justify-center text-xs"
                style={{
                  backgroundColor:
                    activeBarColor && activeBarColor.color !== 'auto'
                      ? activeBarColor.color
                      : 'var(--accent-color)',
                  borderColor: 'rgba(128,128,128,0.35)',
                }}
              >
                {activeBarMeta.emoji || '〰'}
              </span>,
              `${SONG_BAR_OUT_OF_LINE_ANIMATIONS.length + SONG_BAR_ANIMATIONS.length} estilos`
            )}
            {isSectionOpen('bar') && (
              <div
                className={isCompactMode ? 'px-4 pb-4 pt-3 border-t space-y-4' : 'space-y-4'}
                style={{ borderColor: 'var(--divider-color)' }}
              >
                <div
                  className="p-3.5 rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                    <span>Vista previa en vivo</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {activeBarMeta.emoji ? `${activeBarMeta.emoji} ` : ''}
                      {activeBarMeta.label}
                    </span>
                  </div>
                  <SongProgressBar
                    currentTime={58}
                    duration={100}
                    animation={activeBarAnim}
                    isPlaying
                  />
                </div>

                {/* Out-of-Line Emoji-Free Animations */}
                <div>
                  <p className="text-xs font-semibold mb-2">
                    Movimiento fuera de su línea (Sin emojis)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {outBarSlice.visible.map((anim) => {
                      const selected = activeBarAnim === anim.id;
                      return (
                        <button
                          key={anim.id}
                          type="button"
                          onClick={() => onChange({ ...theme, songBarAnimationId: anim.id })}
                          className="min-h-[44px] px-3 py-2 rounded-2xl border text-left flex items-center gap-2 transition-all"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            aria-hidden="true"
                            className="w-6 h-4 rounded-md border flex items-center justify-center shrink-0"
                            style={{ borderColor: 'var(--accent-color)' }}
                          >
                            <svg viewBox="0 0 24 12" className="w-5 h-3">
                              <path
                                d="M1 7 Q 6 1, 12 7 T 23 5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{anim.label}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                              {anim.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton(
                    'barOutAnims',
                    SONG_BAR_OUT_OF_LINE_ANIMATIONS.length,
                    outBarSlice.hasMore,
                    'efectos sin emoji'
                  )}
                </div>

                {/* Classic Cute Bar Animations */}
                <div>
                  <p className="text-xs font-semibold mb-2">Olas e íconos cute sobre la barra</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {barAnimSlice.visible.map((anim) => {
                      const selected = activeBarAnim === anim.id;
                      return (
                        <button
                          key={anim.id}
                          type="button"
                          onClick={() => onChange({ ...theme, songBarAnimationId: anim.id })}
                          className="min-h-[44px] px-2.5 py-2 rounded-2xl border text-left flex items-center gap-2 transition-all"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span className="text-base leading-none shrink-0">{anim.emoji}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{anim.label}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                              {anim.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton(
                    'barAnims',
                    SONG_BAR_ANIMATIONS.length,
                    barAnimSlice.hasMore,
                    'animaciones'
                  )}
                </div>

                {/* Bar Color Swatches */}
                <div>
                  <p className="text-xs font-semibold mb-2">Color de la barra</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {barColorSlice.visible.map((bar) => {
                      const selected = (theme.songBarColorId ?? 'auto') === bar.id;
                      const dotColor = bar.id === 'auto' ? 'var(--accent-color)' : bar.color;
                      return (
                        <button
                          key={bar.id}
                          type="button"
                          onClick={() => onChange({ ...theme, songBarColorId: bar.id })}
                          className="min-h-[42px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                            style={{
                              backgroundColor: dotColor,
                              borderColor: 'rgba(128,128,128,0.28)',
                            }}
                          >
                            {selected && (
                              <Check
                                className="w-3 h-3"
                                style={{
                                  color: bar.isLight || bar.id === 'auto' ? '#1C1B1F' : '#FFFFFF',
                                }}
                              />
                            )}
                          </span>
                          <span className="truncate">{bar.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton('barColors', SONG_BAR_SWATCHES.length, barColorSlice.hasMore, 'colores')}
                </div>
              </div>
            )}
          </section>

          {/* 3b. Song Title Shapes & Varied Colors (including Solo el título) */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'songTitle',
              'Título de la canción (formas y colores)',
              `${activeTitleShapeMeta.label} · ${activeTitleColorMeta.label}`,
              <span
                className="w-7 h-7 rounded-xl border shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <Type className="w-3.5 h-3.5" />
              </span>,
              `${SONG_TITLE_SHAPES.length} formas`
            )}
            {isSectionOpen('songTitle') && (
              <div
                className={isCompactMode ? 'px-4 pb-4 pt-3 border-t space-y-4' : 'space-y-4'}
                style={{ borderColor: 'var(--divider-color)' }}
              >
                {/* Live Song Title Preview */}
                <div
                  className="p-4 rounded-2xl border space-y-2"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      Vista previa en tu reproductor
                    </p>
                    <button
                      type="button"
                      onClick={() => onChange({ ...theme, songTitleShapeId: 'title_only' })}
                      className="btn-raw min-h-[30px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition"
                      style={{
                        backgroundColor:
                          activeTitleShape === 'title_only'
                            ? 'var(--accent-color)'
                            : 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                        color:
                          activeTitleShape === 'title_only' ? '#1C1B1F' : 'var(--text-main)',
                      }}
                    >
                      Solo el título
                    </button>
                  </div>
                  <div className="pt-1">
                    <SongTitleDisplay
                      title="Sakura Rain (Hi-Res)"
                      shapeId={activeTitleShape}
                      colorId={activeTitleColor}
                      customBg={theme.songTitleCustomBg}
                      customText={theme.songTitleCustomText}
                      compact
                    />
                  </div>
                </div>

                {/* Varied Shapes Grid */}
                <div>
                  <p className="text-xs font-semibold mb-2">
                    Forma del título (elige “Solo el título” si no quieres detalle)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {songTitleShapeSlice.visible.map((shapeOpt) => {
                      const selected = activeTitleShape === shapeOpt.id;
                      return (
                        <button
                          key={shapeOpt.id}
                          type="button"
                          onClick={() => onChange({ ...theme, songTitleShapeId: shapeOpt.id })}
                          className="btn-raw min-h-[44px] px-3 py-2 rounded-2xl border text-left transition-all"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <p className="text-xs font-semibold truncate">{shapeOpt.label}</p>
                          <p
                            className="text-[10px] truncate mt-0.5"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {shapeOpt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton(
                    'songTitleShapes',
                    SONG_TITLE_SHAPES.length,
                    songTitleShapeSlice.hasMore,
                    'formas'
                  )}
                </div>

                {/* Varied Colors Grid */}
                <div
                  className="p-3.5 rounded-2xl border space-y-2.5"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <p className="text-xs font-semibold">Colores del título de la canción</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {songTitleColorSlice.visible.map((cp) => {
                      const selected = activeTitleColor === cp.id;
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => onChange({ ...theme, songTitleColorId: cp.id })}
                          className="btn-raw min-h-[38px] px-2 py-1.5 rounded-xl border flex items-center gap-2 text-[11px] font-medium transition"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full border shrink-0"
                            style={{
                              background: cp.preview,
                              borderColor: 'rgba(128,128,128,0.35)',
                            }}
                          />
                          <span className="truncate">{cp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton(
                    'songTitleColors',
                    SONG_TITLE_COLOR_PRESETS.length,
                    songTitleColorSlice.hasMore,
                    'colores'
                  )}

                  {activeTitleColor === 'custom' && (
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 font-medium">
                        <span>Fondo:</span>
                        <input
                          type="color"
                          value={theme.songTitleCustomBg || '#FFF2F6'}
                          onChange={(e) =>
                            onChange({ ...theme, songTitleCustomBg: e.target.value })
                          }
                          className="w-8 h-8 rounded-lg border cursor-pointer"
                        />
                      </label>
                      <label className="flex items-center gap-2 font-medium">
                        <span>Letra:</span>
                        <input
                          type="color"
                          value={theme.songTitleCustomText || '#1C1B1F'}
                          onChange={(e) =>
                            onChange({ ...theme, songTitleCustomText: e.target.value })
                          }
                          className="w-8 h-8 rounded-lg border cursor-pointer"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 4. Theme-only Editable Decorative Library Banner */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'banner',
              'Banner decorativo',
              theme.bannerImageUrl || theme.bannerText ? 'Personalizado' : 'Opcional (foto o frase)',
              <span
                className="w-7 h-7 rounded-xl border shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </span>
            )}
            {isSectionOpen('banner') && (
              <div
                className={`${isCompactMode ? 'px-4 pb-4 pt-3 border-t' : 'p-4 rounded-2xl border'} space-y-3`}
                style={{
                  backgroundColor: isCompactMode ? undefined : 'var(--bg-surface)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                {(theme.bannerImageUrl || theme.bannerText?.trim()) && (
                  <div
                    className="relative h-28 rounded-2xl overflow-hidden border flex items-end"
                    style={{
                      borderColor: 'var(--divider-color)',
                      background: theme.bannerImageUrl
                        ? undefined
                        : 'linear-gradient(125deg, var(--accent-soft), var(--bg-elevated))',
                    }}
                  >
                    {theme.bannerImageUrl && (
                      <img
                        src={theme.bannerImageUrl}
                        alt="Vista previa del banner"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div
                      className="relative z-10 w-full px-4 py-2.5"
                      style={{
                        background: theme.bannerImageUrl
                          ? 'linear-gradient(to top, rgba(20,16,24,0.68), transparent)'
                          : 'transparent',
                        color: theme.bannerImageUrl ? '#FFFFFF' : 'var(--text-main)',
                      }}
                    >
                      <p className="text-xs sm:text-sm font-semibold truncate">
                        {theme.bannerText?.trim() || 'Tu rincón musical ✨'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: 'var(--accent-soft)',
                      borderColor: 'var(--divider-color)',
                    }}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{theme.bannerImageUrl ? 'Cambiar foto' : 'Elegir foto de banner'}</span>
                  </button>

                  {theme.bannerImageUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingBanner({ src: theme.bannerImageUrl!, isBlob: false })
                        }
                        className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--divider-color)',
                        }}
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Recortar / girar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ ...theme, bannerImageUrl: '' })}
                        className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--divider-color)',
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar foto</span>
                      </button>
                    </>
                  )}

                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      e.target.value = '';
                      if (!f) return;
                      try {
                        const objectUrl = URL.createObjectURL(f);
                        setPendingBanner({ src: objectUrl, isBlob: true });
                      } catch {
                        const dataUrl = await resizeImageFileToDataUrl(f, 1280);
                        onChange({ ...theme, bannerImageUrl: dataUrl });
                      }
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" />
                    <span>Palabras o frase en el banner</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={90}
                      value={theme.bannerText ?? ''}
                      placeholder="Ej: Tardes de lluvia, té matcha y mis canciones favoritas"
                      onChange={(e) => onChange({ ...theme, bannerText: e.target.value })}
                      className="flex-1 min-h-[40px] px-3 rounded-xl border text-xs sm:text-sm focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                        color: 'var(--text-main)',
                      }}
                    />
                    {theme.bannerText && (
                      <button
                        type="button"
                        onClick={() => onChange({ ...theme, bannerText: '' })}
                        aria-label="Borrar palabras del banner"
                        className="min-w-[40px] min-h-[40px] rounded-xl border flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--divider-color)',
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 5. Song Cards Style, 3D Designs & Own Colors */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'cards',
              'Tarjetas de canciones en fila',
              `${activeCardStyleMeta.label} · ${activeCardColorMeta.label}`,
              <span
                className="w-7 h-7 rounded-xl border shrink-0 flex items-center justify-center text-sm"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                {activeCardStyleMeta.emoji}
              </span>,
              `${TRACK_CARD_STYLES.length} diseños`
            )}
            {isSectionOpen('cards') && (
              <div
                className={isCompactMode ? 'px-4 pb-4 pt-3 border-t space-y-4' : 'space-y-4'}
                style={{ borderColor: 'var(--divider-color)' }}
              >
                {/* Live Preview Song Card */}
                <div
                  className="p-3.5 rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Vista previa de tarjeta
                  </p>
                  <div
                    className={cardPreview.containerClassName}
                    style={{
                      ...cardPreview.containerStyle,
                      color: cardPreview.textColorOverride || 'var(--text-main)',
                    }}
                  >
                    {cardPreview.topAccentElement}
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <img
                        src={DEFAULT_COVER_SAKURA}
                        alt="Vista previa"
                        className={`${cardPreview.coverClassName} object-cover shrink-0 border`}
                        style={{ borderColor: 'var(--divider-color)' }}
                      />
                      <div className="min-w-0 flex-1 flex items-center gap-1.5">
                        {cardPreview.decorBadge && (
                          <span aria-hidden="true" className="shrink-0 text-xs">
                            {cardPreview.decorBadge}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <SongTitleDisplay
                            title="Sakura Rain (Hi-Res)"
                            shapeId={activeTitleShape}
                            colorId={activeTitleColor}
                            customBg={theme.songTitleCustomBg}
                            customText={theme.songTitleCustomText}
                            size="row"
                            fallbackTextColor={cardPreview.textColorOverride}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pl-0 sm:pl-[60px]">
                      <p
                        className="text-xs truncate font-mono-nums"
                        style={{ color: cardPreview.mutedColorOverride || 'var(--text-muted)' }}
                      >
                        MoriNote · FLAC Sin pérdida · 24b/96kHz · 3:42
                      </p>
                      <span className="text-sm opacity-75 shrink-0" aria-hidden="true">
                        ♥
                      </span>
                    </div>
                  </div>
                </div>

                {/* Own Card Color Palette */}
                <div
                  className="p-3.5 rounded-2xl border space-y-2.5"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <p className="text-xs font-semibold">Color propio de las tarjetas</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {cardColorSlice.visible.map((cp) => {
                      const selected = activeCardColor === cp.id;
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => onChange({ ...theme, trackCardColorId: cp.id })}
                          className="min-h-[38px] px-2 py-1.5 rounded-xl border flex items-center gap-2 text-[11px] font-medium transition"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full border shrink-0"
                            style={{
                              background: cp.preview,
                              borderColor: 'rgba(128,128,128,0.35)',
                            }}
                          />
                          <span className="truncate">{cp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton('cardColors', TRACK_CARD_COLOR_PRESETS.length, cardColorSlice.hasMore, 'colores')}

                  {activeCardColor === 'custom' && (
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 font-medium">
                        <span>Fondo:</span>
                        <input
                          type="color"
                          value={theme.trackCardCustomBg || '#FFFFFF'}
                          onChange={(e) =>
                            onChange({ ...theme, trackCardCustomBg: e.target.value })
                          }
                          className="w-8 h-8 rounded-lg border cursor-pointer"
                        />
                      </label>
                      <label className="flex items-center gap-2 font-medium">
                        <span>Texto:</span>
                        <input
                          type="color"
                          value={theme.trackCardCustomText || '#1C1B1F'}
                          onChange={(e) =>
                            onChange({ ...theme, trackCardCustomText: e.target.value })
                          }
                          className="w-8 h-8 rounded-lg border cursor-pointer"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* 32 Card Designs Grid */}
                <div>
                  <p className="text-xs font-semibold mb-2">Estilo y relieve 3D de tarjetas</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cardStyleSlice.visible.map((cardOpt) => {
                      const selected = activeCardStyle === cardOpt.id;
                      return (
                        <button
                          key={cardOpt.id}
                          type="button"
                          onClick={() => onChange({ ...theme, trackCardStyleId: cardOpt.id })}
                          className="min-h-[44px] px-2.5 py-2 rounded-2xl border text-left flex items-center gap-2 transition-all"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span className="text-base leading-none shrink-0">{cardOpt.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate">{cardOpt.label}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                              {cardOpt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton('cardStyles', TRACK_CARD_STYLES.length, cardStyleSlice.hasMore, 'diseños')}
                </div>

                {/* Cute Corner Ornament Selector */}
                <div>
                  <p className="text-xs font-semibold mb-2">Adorno cute de las tarjetas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TRACK_CARD_DECORS.map((dec) => {
                      const selected = activeCardDecor === dec.id;
                      return (
                        <button
                          key={dec.id}
                          type="button"
                          onClick={() => onChange({ ...theme, trackCardDecorId: dec.id })}
                          className="min-h-[36px] px-2.5 py-1 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span>{dec.emoji}</span>
                          <span>{dec.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 5b. Dedicated 3D Playback Control Buttons (Cambiar y Pausar/Reproducir) */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'playback3d',
              'Botones 3D de reproducir, pausar y cambiar',
              `${activePbStyleMeta.label} · ${activePbColorMeta.label}`,
              (() => {
                const mini = getPlaybackControlPresentation('play', theme);
                return (
                  <span
                    aria-hidden="true"
                    className={`w-7 h-7 shrink-0 pointer-events-none ${mini.className}`}
                    style={mini.style}
                  >
                    <Play className="w-3 h-3 ml-0.5" />
                  </span>
                );
              })(),
              `${PLAYBACK_BUTTON_3D_STYLES.length} estilos 3D`
            )}
            {isSectionOpen('playback3d') && (
              <div
                className={isCompactMode ? 'px-4 pb-4 pt-3 border-t space-y-4' : 'space-y-4'}
                style={{ borderColor: 'var(--divider-color)' }}
              >
                {onOpenMusicCardSettings && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenMusicCardSettings();
                      }}
                      className="btn-raw min-h-[32px] px-3 py-1 rounded-xl border text-[11px] font-semibold"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      Editar portada / vinilo 3D →
                    </button>
                  </div>
                )}

                {/* Interactive Live 3D Playback Preview */}
                {(() => {
                  const prevCtrl = getPlaybackControlPresentation('nav', theme);
                  const playCtrl = getPlaybackControlPresentation('play', theme);
                  const nextCtrl = getPlaybackControlPresentation('nav', theme);
                  return (
                    <div
                      className="p-4 rounded-2xl border flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                        Toca los botones para probar su relieve 3D
                      </p>
                      <div className="flex items-center justify-center gap-4 py-1">
                        <button
                          type="button"
                          onClick={() => setPreviewPlaying(true)}
                          aria-label="Prueba anterior"
                          className={`w-11 h-11 ${prevCtrl.className}`}
                          style={prevCtrl.style}
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPlaying((v) => !v)}
                          aria-label="Prueba reproducir o pausar"
                          className={`w-14 h-14 ${playCtrl.className}`}
                          style={playCtrl.style}
                        >
                          {previewPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-0.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPlaying(true)}
                          aria-label="Prueba siguiente"
                          className={`w-11 h-11 ${nextCtrl.className}`}
                          style={nextCtrl.style}
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Own Color Palettes */}
                <div
                  className="p-3.5 rounded-2xl border space-y-2.5"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <p className="text-xs font-semibold">Colores propios de reproducir, pausar y cambiar</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {pbColorSlice.visible.map((cp) => {
                      const active = activePbColor === cp.id;
                      const swatchBg =
                        cp.id === 'auto'
                          ? 'var(--accent-color)'
                          : cp.id === 'custom'
                            ? 'linear-gradient(135deg,#F4A6C1,#7CC3F7,#9BD27E)'
                            : cp.playBg;
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => onChange({ ...theme, playbackBtnColorId: cp.id })}
                          className="btn-raw min-h-[38px] px-2 py-1.5 rounded-xl border flex items-center gap-2 text-[11px] font-medium transition"
                          style={{
                            backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface)',
                            borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full border shrink-0"
                            style={{
                              background: swatchBg,
                              borderColor: 'rgba(128,128,128,0.35)',
                            }}
                          />
                          <span className="truncate">{cp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton('pbColors', PLAYBACK_BUTTON_COLOR_PRESETS.length, pbColorSlice.hasMore, 'colores')}

                  {activePbColor === 'custom' && (
                    <div
                      className="pt-2.5 border-t grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]"
                      style={{ borderColor: 'var(--divider-color)' }}
                    >
                      <label className="flex items-center justify-between gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }}>
                        <span>Play / Pausa</span>
                        <input
                          type="color"
                          value={theme.playbackPlayBg || '#F4A6C1'}
                          onChange={(e) => onChange({ ...theme, playbackPlayBg: e.target.value })}
                          className="w-7 h-7 rounded-lg border cursor-pointer shrink-0"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }}>
                        <span>Ícono Pausa</span>
                        <input
                          type="color"
                          value={theme.playbackPlayIcon || '#1C1B1F'}
                          onChange={(e) => onChange({ ...theme, playbackPlayIcon: e.target.value })}
                          className="w-7 h-7 rounded-lg border cursor-pointer shrink-0"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }}>
                        <span>Cambiar ⏮⏭</span>
                        <input
                          type="color"
                          value={theme.playbackNavBg || '#FFFFFF'}
                          onChange={(e) => onChange({ ...theme, playbackNavBg: e.target.value })}
                          className="w-7 h-7 rounded-lg border cursor-pointer shrink-0"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }}>
                        <span>Ícono ⏮⏭</span>
                        <input
                          type="color"
                          value={theme.playbackNavIcon || '#1C1B1F'}
                          onChange={(e) => onChange({ ...theme, playbackNavIcon: e.target.value })}
                          className="w-7 h-7 rounded-lg border cursor-pointer shrink-0"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }}>
                        <span>Relieve / Borde 3D</span>
                        <input
                          type="color"
                          value={theme.playbackRimColor || '#CF7A99'}
                          onChange={(e) => onChange({ ...theme, playbackRimColor: e.target.value })}
                          className="w-7 h-7 rounded-lg border cursor-pointer shrink-0"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* 18 Tactile 3D Designs Grid */}
                <div>
                  <p className="text-xs font-semibold mb-2">Estilos 3D de botones de música</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {pbStyleSlice.visible.map((pb) => {
                      const active = activePbStyle === pb.id;
                      const sample = getPlaybackControlPresentation('play', {
                        ...theme,
                        playbackBtnStyleId: pb.id,
                      });
                      return (
                        <button
                          key={pb.id}
                          type="button"
                          onClick={() => onChange({ ...theme, playbackBtnStyleId: pb.id })}
                          className="btn-raw p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all"
                          style={{
                            backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: active ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-9 h-9 shrink-0 pointer-events-none ${sample.className}`}
                            style={sample.style}
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate">{pb.label}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                              {pb.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton('pbStyles', PLAYBACK_BUTTON_3D_STYLES.length, pbStyleSlice.hasMore, 'estilos 3D')}
                </div>
              </div>
            )}
          </section>

          {/* 5c. Editable Cute Emoji-Free General Button Themes (22 themes) */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'buttons',
              'Temas de botones generales (sin emojis)',
              activeButtonMeta.label,
              <span
                className="w-7 h-7 rounded-xl border shrink-0 flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: activeButtonMeta.previewBg,
                  border: activeButtonMeta.previewBorder,
                  color: activeButtonMeta.previewText,
                }}
              >
                Ok
              </span>,
              `${BUTTON_THEMES.length} diseños`
            )}
            {isSectionOpen('buttons') && (
              <div
                className={isCompactMode ? 'px-4 pb-4 pt-3 border-t space-y-3' : 'space-y-3'}
                style={{ borderColor: 'var(--divider-color)' }}
              >
                {/* Editable Custom Button Color Bar */}
                <div
                  className="p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--divider-color)',
                  }}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-semibold">Color propio del botón:</span>
                    <label className="flex items-center gap-1.5">
                      <span>Fondo</span>
                      <input
                        type="color"
                        value={theme.buttonCustomBg || '#F4B8CC'}
                        onChange={(e) =>
                          onChange({
                            ...theme,
                            buttonCustomBg: e.target.value,
                            buttonCustomText: theme.buttonCustomText || '#1C1B1F',
                          })
                        }
                        className="w-7 h-7 rounded-lg border cursor-pointer"
                      />
                    </label>
                    <label className="flex items-center gap-1.5">
                      <span>Letra</span>
                      <input
                        type="color"
                        value={theme.buttonCustomText || '#1C1B1F'}
                        onChange={(e) =>
                          onChange({
                            ...theme,
                            buttonCustomBg: theme.buttonCustomBg || '#F4B8CC',
                            buttonCustomText: e.target.value,
                          })
                        }
                        className="w-7 h-7 rounded-lg border cursor-pointer"
                      />
                    </label>
                  </div>
                  {theme.buttonCustomBg && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({ ...theme, buttonCustomBg: '', buttonCustomText: '' })
                      }
                      className="min-h-[34px] px-3 py-1 rounded-xl border text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--divider-color)',
                      }}
                    >
                      Usar color del tema
                    </button>
                  )}
                </div>

                {/* 22 Emoji-Free Cute Button Themes Grid */}
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {btnThemeSlice.visible.map((bt) => {
                      const selected = activeButtonTheme === bt.id;
                      return (
                        <button
                          key={bt.id}
                          type="button"
                          onClick={() => onChange({ ...theme, buttonThemeId: bt.id })}
                          className="btn-raw p-2.5 rounded-2xl border text-left flex flex-col gap-2 transition-all"
                          style={{
                            backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                            borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                          }}
                        >
                          <span
                            className="inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-semibold self-start"
                            style={{
                              background: bt.previewBg,
                              border: bt.previewBorder,
                              color: bt.previewText,
                              borderRadius: bt.previewRadius,
                              boxShadow: bt.previewShadow,
                            }}
                          >
                            Botón muestra
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{bt.label}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                              {bt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {renderExpandButton('btnThemes', BUTTON_THEMES.length, btnThemeSlice.hasMore, 'temas')}
                </div>
              </div>
            )}
          </section>

          {/* 6. Song Divider Color */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'dividers',
              'Separadores de canciones',
              activeDivider?.label ?? 'Rosa',
              <span
                className="w-7 h-7 rounded-full border shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--divider-color)',
                }}
              >
                <span
                  className="w-4 h-1.5 rounded-full"
                  style={{ backgroundColor: activeDivider?.color ?? '#F5C4D4' }}
                />
              </span>,
              `${DIVIDER_SWATCHES.length} tonos`
            )}
            {isSectionOpen('dividers') && (
              <div className={isCompactMode ? 'px-4 pb-4 pt-1 border-t' : ''} style={{ borderColor: 'var(--divider-color)' }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {divSlice.visible.map((div) => {
                    const selected = theme.dividerColorId === div.id;
                    return (
                      <button
                        key={div.id}
                        type="button"
                        onClick={() => onChange({ ...theme, dividerColorId: div.id })}
                        className="min-h-[42px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-medium transition-all"
                        style={{
                          backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <span
                          className="w-5 h-1.5 rounded-full shrink-0 border"
                          style={{
                            backgroundColor: div.color,
                            borderColor: 'rgba(128,128,128,0.25)',
                          }}
                        />
                        <span className="truncate">{div.label}</span>
                      </button>
                    );
                  })}
                </div>
                {renderExpandButton('divColors', DIVIDER_SWATCHES.length, divSlice.hasMore, 'tonos')}
              </div>
            )}
          </section>

          {/* 7. Text / Lyrics Color */}
          <section
            className={isCompactMode ? 'rounded-2xl border overflow-hidden' : 'pt-2'}
            style={
              isCompactMode
                ? { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--divider-color)' }
                : undefined
            }
          >
            {renderSectionHeader(
              'text',
              'Color de letra y textos',
              activeText?.label ?? 'Negro',
              <span
                className="w-7 h-7 rounded-full border shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: activeText?.hex ?? '#1C1B1F',
                  borderColor: 'rgba(128,128,128,0.35)',
                  color: isLightHexColor(activeText?.hex) ? '#1C1B1F' : '#FFFFFF',
                }}
              >
                A
              </span>,
              `${TEXT_SWATCHES.length} colores`
            )}
            {isSectionOpen('text') && (
              <div className={isCompactMode ? 'px-4 pb-4 pt-1 border-t' : ''} style={{ borderColor: 'var(--divider-color)' }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {textSlice.visible.map((txt) => {
                    const selected = theme.textColorId === txt.id;
                    const isLightTextSwatch = isLightHexColor(txt.hex);
                    return (
                      <button
                        key={txt.id}
                        type="button"
                        onClick={() => onChange({ ...theme, textColorId: txt.id })}
                        className="min-h-[42px] px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                          borderColor: selected ? 'var(--text-main)' : 'var(--divider-color)',
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: txt.hex,
                            borderColor: 'rgba(128,128,128,0.35)',
                            color: isLightTextSwatch ? '#1C1B1F' : '#FFFFFF',
                          }}
                        >
                          A
                        </span>
                        <span className="truncate">{txt.label}</span>
                      </button>
                    );
                  })}
                </div>
                {renderExpandButton('textColors', TEXT_SWATCHES.length, textSlice.hasMore, 'colores')}
                {lowContrastTip && (
                  <p
                    className="mt-2.5 text-xs px-3 py-2 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--divider-color)',
                      color: activeText?.hex,
                    }}
                  >
                    Nota de lectura: elegiste letra {activeText?.label.toLowerCase()} sobre fondo{' '}
                    {activeBg?.label.toLowerCase()}; puedes cambiar cualquiera de los dos en segundos.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* 8. Mood Sync Toggle */}
          <section
            className="p-4 rounded-2xl border flex items-center justify-between gap-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--accent-soft)' }}
              >
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Interfaz sincronizada con el ánimo musical</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Suaviza el halo ambiental y el ritmo del visualizador según la emoción detectada por la IA
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme.moodSyncEnabled}
              onClick={() => onChange({ ...theme, moodSyncEnabled: !theme.moodSyncEnabled })}
              className="w-13 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center"
              style={{
                backgroundColor: theme.moodSyncEnabled ? 'var(--accent-color)' : 'rgba(128,128,128,0.28)',
              }}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  theme.moodSyncEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </section>
        </div>
      </div>

      <ImageEditorModal
        open={Boolean(pendingBanner)}
        imageSrc={pendingBanner?.src ?? null}
        aspect="wide"
        title="Ajustar banner decorativo"
        onCancel={closePendingBanner}
        onApply={(editedDataUrl) => {
          onChange({ ...theme, bannerImageUrl: editedDataUrl });
          closePendingBanner();
        }}
      />
    </div>
  );
};
