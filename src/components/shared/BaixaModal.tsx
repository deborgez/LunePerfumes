'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Btn } from './ui';
import { useData } from '@/context/DataContext';
import { fmt } from '@/lib/format';
import type { Perfume, Venda } from '@/lib/types';

interface BaixaModalProps {
  open: boolean;
  onClose: () => void;
  venda: Venda | null;
  perfumes: Perfume[];
}

export default function BaixaModal({ open, onClose, venda, perfumes }: BaixaModalProps) {
  const { baixarVenda } = useData();
  const [saving, setSaving] = useState(false);

  if (!venda) return null;
  const p = perfumes.find((p) => p.id === venda.perf_id);

  async function handleConfirm() {
    setSaving(true);
    await baixarVenda(venda!.id);
    setSaving(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirmar recebimento"
      maxWidth={420}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="success" onClick={handleConfirm} disabled={saving} className="flex-1 max-md:py-3.5">
            Confirmar
          </Btn>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        Confirmar recebimento de {fmt(venda.receita_valor)} de {venda.cliente || '—'} referente a {p ? p.nome : ''} × {venda.qty}
        {venda.parcela_num && venda.parcela_total ? ` (parcela ${venda.parcela_num}/${venda.parcela_total})` : ''}?
      </p>
    </Modal>
  );
}
