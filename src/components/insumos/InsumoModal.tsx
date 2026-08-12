'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Hint, Input, MaskedDecimalInput, Select } from '@/components/shared/ui';
import { fmt } from '@/lib/format';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { Insumo, InsumoTipo } from '@/lib/types';

interface InsumoModalProps {
  open: boolean;
  onClose: () => void;
  editing: Insumo | null;
}

export default function InsumoModal({ open, onClose, editing }: InsumoModalProps) {
  const { saveInsumo } = useData();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<InsumoTipo>('ml');
  const [est, setEst] = useState(0);
  const [cst, setCst] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setTipo(editing.tipo);
      setEst(editing.estoque);
      setCst(editing.custo);
    } else {
      setNome('');
      setTipo('ml');
      setEst(0);
      setCst(0);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, editing]);

  const showHint = est > 0 && cst > 0;
  const estLabel = tipo === 'ml' ? 'Estoque total (ml)' : 'Quantidade em estoque';

  async function handleSave() {
    const nomeT = nome.trim();
    if (!nomeT || est <= 0 || cst <= 0) {
      toast('Preencha todos os campos', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveInsumo(editing ? editing.id : null, {
      nome: nomeT,
      tipo,
      estoque: est,
      estoque_inicial: editing ? editing.estoque_inicial : est,
      custo: cst,
      unit: cst / est,
    });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Editar insumo' : 'Novo insumo'}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar insumo
          </Btn>
        </>
      }
    >
      <div className="mb-2.5">
        <FormGroup label="Nome do insumo">
          <Input placeholder="Ex: Frasco 50ml, Tampa..." value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Tipo">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value as InsumoTipo)}>
            <option value="ml">Líquido (ml)</option>
            <option value="un">Unitário</option>
          </Select>
        </FormGroup>
        <FormGroup label={estLabel}>
          <MaskedDecimalInput value={est} onChange={setEst} placeholder="0,00" />
        </FormGroup>
      </div>
      <div className="mb-2.5">
        <FormGroup label="Custo global (R$)">
          <MaskedDecimalInput value={cst} onChange={setCst} placeholder="0,00" />
        </FormGroup>
      </div>
      {showHint && (
        <Hint>
          Custo por {tipo === 'ml' ? 'ml' : 'unidade'}: <strong>{fmt(cst / est)}</strong>
        </Hint>
      )}
    </Modal>
  );
}
