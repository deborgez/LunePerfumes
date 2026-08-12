'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Btn, FormGroup, MaskedDecimalInput } from './ui';
import { fq } from '@/lib/format';
import { useData } from '@/context/DataContext';
import type { Essencia, Insumo } from '@/lib/types';

interface ReporModalProps {
  open: boolean;
  onClose: () => void;
  tipo: 'essencia' | 'insumo';
  item: Essencia | Insumo | null;
}

export default function ReporModal({ open, onClose, tipo, item }: ReporModalProps) {
  const { reporEstoque } = useData();
  const [qtd, setQtd] = useState(0);
  const [custo, setCusto] = useState(0);
  const [saving, setSaving] = useState(false);

  if (!item) return null;
  const unid = tipo === 'essencia' ? 'ml' : (item as Insumo).tipo || 'un';

  async function handleSave() {
    setSaving(true);
    await reporEstoque(tipo, item!.id, qtd, custo);
    setSaving(false);
    setQtd(0);
    setCusto(0);
    onClose();
  }

  function handleClose() {
    setQtd(0);
    setCusto(0);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Repor estoque"
      maxWidth={420}
      footer={
        <>
          <Btn onClick={handleClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Atualizar
          </Btn>
        </>
      }
    >
      <p className="mb-3 text-[13px] leading-relaxed text-[var(--text-muted)]">
        {item.nome} — estoque atual: {fq(item.estoque, unid)}
      </p>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label={`Adicionar ao estoque (${unid})`}>
          <MaskedDecimalInput value={qtd} onChange={setQtd} placeholder="0" decimals={0} />
        </FormGroup>
        <FormGroup label="Novo custo global (R$)">
          <MaskedDecimalInput value={custo} onChange={setCusto} placeholder="Opcional" />
        </FormGroup>
      </div>
    </Modal>
  );
}
