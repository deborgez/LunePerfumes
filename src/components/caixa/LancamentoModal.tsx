'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Input, MaskedDecimalInput, Select } from '@/components/shared/ui';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { tod } from '@/lib/format';
import type { LancamentoTipo } from '@/lib/types';

interface LancamentoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LancamentoModal({ open, onClose }: LancamentoModalProps) {
  const { saveLancamento } = useData();
  const toast = useToast();
  const [tipo, setTipo] = useState<LancamentoTipo>('entrada');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [data, setData] = useState(tod());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens */
    setTipo('entrada');
    setDescricao('');
    setValor(0);
    setData(tod());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open]);

  async function handleSave() {
    if (valor <= 0) {
      toast('Informe um valor maior que zero', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveLancamento({ tipo, descricao: descricao.trim(), valor, data });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo lançamento"
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar lançamento
          </Btn>
        </>
      }
    >
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Tipo">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value as LancamentoTipo)}>
            <option value="entrada">Entrada</option>
            <option value="despesa">Despesa</option>
          </Select>
        </FormGroup>
        <FormGroup label="Valor (R$)">
          <MaskedDecimalInput value={valor} onChange={setValor} placeholder="0,00" />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Data">
          <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </FormGroup>
        <FormGroup label="Descrição (opcional)">
          <Input placeholder="Ex: Aporte inicial" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </FormGroup>
      </div>
    </Modal>
  );
}
