'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import LoadingCover from './LoadingCover';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Páginas públicas (voltadas pro cliente final) não usam o menu interno de gestão.
  if (pathname?.startsWith('/catalogo')) return <>{children}</>;

  return (
    <>
      <LoadingCover />
      <div className="flex h-screen overflow-hidden bg-[var(--bg)]" style={{ height: '100dvh' }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pb-16 md:pb-0">
          <Topbar />
          <div className="flex-1 overflow-y-auto p-3.5 md:p-5">{children}</div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
