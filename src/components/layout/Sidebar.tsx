'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { NAV_ITEMS } from './nav-items';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { dark, toggleTheme } = useTheme();
  const { syncStatus, syncMsg } = useData();

  const dotColor =
    syncStatus === 'ok' ? 'bg-[var(--green)]' : syncStatus === 'err' ? 'bg-[var(--red)]' : 'bg-[var(--amber)] animate-blink';

  return (
    <aside className="hidden w-[220px] flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-colors md:flex">
      <div className="border-b border-[var(--border)] px-[18px] pb-3.5 pt-5">
        <div className="text-lg font-semibold text-[var(--text)]">
          Lune <em className="not-italic text-[var(--brand)]">Perfumes</em>
        </div>
        <div className="mt-0.5 text-[11px] text-[var(--text-hint)]">Estoque &amp; Vendas</div>
      </div>
      <div className="px-3 pb-1 pt-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-hint)]">
        Menu
      </div>
      <nav className="flex flex-col">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-2 my-[1px] flex select-none items-center gap-[9px] rounded-lg px-3.5 py-2.5 text-[13px] transition-colors ${
                active
                  ? 'bg-[var(--brand-light)] font-medium text-[var(--brand-dark)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-dark)]'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-[var(--border)] p-2">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-[9px] rounded-lg px-3.5 py-2.5 text-[13px] text-[var(--text-muted)] transition-colors hover:bg-[var(--brand-light)] hover:text-[var(--brand-dark)]"
        >
          {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
          <span>{dark ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
      </div>
      <div className="flex items-center gap-1.5 px-[18px] py-1 text-[11px] text-[var(--text-hint)]">
        <div className={`h-[7px] w-[7px] flex-shrink-0 rounded-full ${dotColor}`} />
        <span>{syncMsg}</span>
      </div>
      <div className="px-[18px] pb-3.5 pt-1.5 text-[11px] text-[var(--text-hint)]">v3.0 · Lune Perfumes</div>
    </aside>
  );
}
