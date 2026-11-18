import React, { useEffect, useRef, useState } from 'react';
import { Lock, Menu, Palette, Settings, User, Volume2, X } from 'lucide-react';
import type { Translations } from '../constants/i18n';

export type ActivePanelModal = 'profile' | 'theme' | 'settings' | 'lock' | 'sounds' | null;

interface HamburgerMenuProps {
  t: Translations;
  onSelect: (panel: ActivePanelModal) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ t, onSelect }) => {
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
        aria-label="Abrir menú principal"
        aria-expanded={open}
        className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center transition-transform active:scale-95 border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors hover:opacity-80 text-left"
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <Settings className="w-4 h-4" />
            </span>
            <span className="whitespace-nowrap">{t.menuSettings}</span>
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
