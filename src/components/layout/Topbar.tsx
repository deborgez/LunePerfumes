'use client';

import { usePathname } from 'next/navigation';
import { IconMoon, IconSun, IconRefresh } from '@tabler/icons-react';
import { PAGE_TITLES } from './nav-items';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';

export default function Topbar() {
  const pathname = usePathname();
  const { dark, toggleTheme } = useTheme();
  const { loadAll, syncStatus } = useData();

  const dotColor =
    syncStatus === 'ok' ? 'bg-[var(--green)]' : syncStatus === 'err' ? 'bg-[var(--red)]' : 'bg-[var(--amber)] animate-blink';

  return (
    <div className="flex h-[50px] flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 md:h-[54px] md:px-5">
      <div className="text-[15px] font-semibold text-[var(--text)]">{PAGE_TITLES[pathname] ?? ''}</div>
      <div className="flex items-center gap-2">
        <div className={`h-[7px] w-[7px] rounded-full ${dotColor} md:hidden`} />
        <button
          onClick={() => loadAll()}
          className="inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[7px] text-xs font-medium text-[var(--text)] transition-[background,transform] hover:bg-[var(--surface2)] active:scale-[0.97]"
        >
          <IconRefresh size={16} />
          <span className="hidden md:inline"> Atualizar</span>
        </button>
        <button
          onClick={toggleTheme}
          className="inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[7px] text-xs font-medium text-[var(--text)] transition-[background,transform] hover:bg-[var(--surface2)] active:scale-[0.97]"
        >
          {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
        </button>
      </div>
    </div>
  );
}
