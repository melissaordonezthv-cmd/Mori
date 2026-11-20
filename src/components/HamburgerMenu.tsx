import React, { useEffect, useRef, useState } from 'react';
import { Lock, Menu, Palette, Settings, User, Volume2, X } from 'lucide-react';
import type { Translations } from '../constants/i18n';

export type ActivePanelModal = 'profile' | 'theme' | 'settings' | 'lock' | 'sounds' | null;

interface HamburgerMenuProps {
  t: Translations;
  hasUpdate?: boolean;
  onSelect: (panel: ActivePanelModal) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  t,
  hasUpdate = false,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleChoose = (panel: ActivePanelModal) => {
    setOpen(false);
    onSelect(panel);
  };

  return (
    <div ref={containerRef} className="relative z-40">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={hasUpdate ? 'Abrir menú principal (hay una actualización disponible)' : 'Abrir menú principal'}
        aria-expanded={open}
        className="relative min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center transition-transform active:scale-95 border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        {hasUpdate && (
          <span
            aria-label="Actualización disponible"
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: '#A3E635',
              boxShadow: '0 0 8px rgba(163, 230, 53, 0.9), 0 0 0 2px var(--bg-elevated)',
            }}
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-13 w-52 rounded-2xl p-2 shadow-xl border backdrop-blur-md transition-all"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--divider-color)',
            color: 'var(--text-main)',
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleChoose('profile')}
            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors hover:opacity-80 text-left"
            style={{ backgroundColor: 'transparent' }}
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <User className="w-4 h-4" />
            </span>
            <span className="whitespace-nowrap">{t.menuProfile}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleChoose('theme')}
            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors hover:opacity-80 text-left"
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <Palette className="w-4 h-4" />
            </span>
            <span className="whitespace-nowrap">{t.menuTheme}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleChoose('settings')}
            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 text-sm font-medium transition-colors hover:opacity-80 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--accent-soft)' }}
              >
                <Settings className="w-4 h-4" />
              </span>
              <span className="whitespace-nowrap">{t.menuSettings}</span>
            </div>
            {hasUpdate && (
              <span
                title="Hay un cambio nuevo para actualizar"
                className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                style={{
                  backgroundColor: '#A3E635',
                  boxShadow: '0 0 7px rgba(163, 230, 53, 0.85)',
                }}
              />
            )}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleChoose('lock')}
            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors hover:opacity-80 text-left"
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <Lock className="w-4 h-4" />
            </span>
            <span className="whitespace-nowrap">{t.menuLock}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleChoose('sounds')}
            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors hover:opacity-80 text-left"
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <Volume2 className="w-4 h-4" />
            </span>
            <span className="whitespace-nowrap">{t.menuSounds}</span>
          </button>
        </div>
      )}
    </div>
  );
};
