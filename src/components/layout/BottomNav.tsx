'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './nav-items';

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[800] flex border-t border-[var(--nav-border)] bg-[var(--nav-bg)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-[3px] px-1 pb-1.5 pt-2 text-[10px] font-medium ${
              active ? 'text-[var(--brand)]' : 'text-[var(--text-hint)]'
            }`}
          >
            <Icon size={22} />
            <span>{item.mobileLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
