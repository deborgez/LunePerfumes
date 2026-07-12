'use client';

import { createContext, useContext, useRef, useState, ReactNode } from 'react';

type ToastKind = 'ok' | 'err' | 'info';

interface ToastState {
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toast(message: string, kind: ToastKind = 'info') {
    setState({ message, kind });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState(null), 2800);
  }

  const bg = state?.kind === 'err' ? '#993C1D' : state?.kind === 'ok' ? '#085041' : '#1a1a2e';

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {state && (
        <div
          className="fixed bottom-20 left-1/2 z-[9999] max-w-[90vw] -translate-x-1/2 whitespace-nowrap rounded-[10px] px-5 py-[11px] text-[13px] text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] animate-slide-up md:bottom-20"
          style={{ background: bg }}
        >
          {state.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
