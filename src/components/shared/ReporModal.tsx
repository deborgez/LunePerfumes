'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Btn, FormGroup, Input } from './ui';
import { br, fq } from '@/lib/format';
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
  const [qtd, setQtd] = useState('');
  const [custo, setCusto] = useState('');
  const [saving, setSaving] = useState(false);

  if (!item) return null;
  const unid = tipo === 'essencia' ? 'ml' : (item as Insumo).tipo || 'un';

  async function handleSave() {
    setSaving(true);
    await reporEstoque(tipo, item!.id, br(qtd) || 0, br(custo));
    setSaving(false);
    setQtd('');
    setCusto('');
    onClose();
  }

  function handleClose() {
    setQtd('');
    setCusto('');
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
          <Input inputMode="decimal" placeholder="0" value={qtd} onChange={(e) => setQtd(e.target.value)} />
        </FormGroup>
        <FormGroup label="Novo custo global (R$)">
          <Input inputMode="decimal" placeholder="Opcional" value={custo} onChange={(e) => setCusto(e.target.value)} />
        </FormGroup>
      </div>
    </Modal>
  );
}
