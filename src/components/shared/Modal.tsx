'use client';

import { ReactNode } from 'react';
import { IconX } from '@tabler/icons-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}

export default function Modal({ open, onClose, title, children, footer, maxWidth = 560 }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[900] flex items-end justify-center bg-[rgba(10,8,30,0.55)]">
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[18px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_-4px_40px_rgba(0,0,0,0.2)] animate-slide-up md:max-h-[92vh]"
        style={{ maxWidth }}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--border)]" />
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 pb-3 pt-3.5">
          <h3 className="text-[15px] font-semibold text-[var(--text)]">{title}</h3>
          <button
            onClick={onClose}
            className="flex rounded-md p-1 text-[var(--text-hint)] hover:bg-[var(--surface2)]"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex gap-2 px-5 pb-5 pt-3">{footer}</div>}
      </div>
    </div>
  );
}
