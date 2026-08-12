'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import { Btn, FormGroup, MaskedDecimalInput } from './ui';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
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
  const toast = useToast();
  const [valor, setValor] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !venda) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pre-fill with full amount when a new venda is opened for baixa
    setValor(venda.receita_valor);
  }, [open, venda]);

  if (!venda) return null;
  const p = perfumes.find((p) => p.id === venda.perf_id);
  const parcial = valor > 0 && valor < venda.receita_valor;
  const restante = Math.max(0, venda.receita_valor - valor);

  async function handleConfirm() {
    if (valor <= 0) {
      toast('Informe o valor recebido', 'err');
      return;
    }
    setSaving(true);
    const ok = await baixarVenda(venda!.id, valor);
    setSaving(false);
    if (ok) onClose();
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
      <p className="mb-3 text-sm leading-relaxed text-[var(--text-muted)]">
        Recebimento de {venda.cliente || '—'} referente a {p ? p.nome : ''} × {venda.qty}
        {venda.parcela_num && venda.parcela_total ? ` (parcela ${venda.parcela_num}/${venda.parcela_total})` : ''} — total em aberto:{' '}
        <strong>{fmt(venda.receita_valor)}</strong>
      </p>
      <FormGroup label="Valor recebido (R$)">
        <MaskedDecimalInput value={valor} onChange={setValor} placeholder="0,00" />
      </FormGroup>
      {parcial && (
        <p className="mt-2.5 text-xs text-[var(--amber)]">
          Recebimento parcial: {fmt(restante)} continuam em aberto para essa parcela.
        </p>
      )}
    </Modal>
  );
}
