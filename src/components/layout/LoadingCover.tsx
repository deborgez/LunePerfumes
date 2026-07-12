'use client';

import { IconWifiOff } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';

export default function LoadingCover() {
  const { loading, syncStatus, loadAll } = useData();
  if (!loading) return null;

  if (syncStatus === 'err') {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3.5 bg-[rgba(10,8,30,0.75)] text-sm text-white">
        <div className="text-[40px] text-[#F0997B]">
          <IconWifiOff size={40} />
        </div>
        <div className="text-[15px] text-white">Erro ao conectar</div>
        <div className="mt-1.5 text-xs text-[#aaa]">Verifique sua internet</div>
        <button
          onClick={() => loadAll()}
          className="mt-4 rounded-[10px] bg-[var(--brand)] px-6 py-3 text-sm text-white"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3.5 bg-[rgba(10,8,30,0.75)] text-sm text-white">
      <div className="h-[38px] w-[38px] animate-spin-slow rounded-full border-[3px] border-white/20 border-t-white" />
      <div>Conectando ao banco...</div>
    </div>
  );
}
