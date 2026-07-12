'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Hint, Input, Select } from '@/components/shared/ui';
import { br, fmt } from '@/lib/format';
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
  const [est, setEst] = useState('');
  const [cst, setCst] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setTipo(editing.tipo);
      setEst(editing.estoque.toString());
      setCst(editing.custo.toFixed(2).replace('.', ','));
    } else {
      setNome('');
      setTipo('ml');
      setEst('');
      setCst('');
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, editing]);

  const estN = br(est);
  const cstN = br(cst);
  const showHint = estN > 0 && cstN > 0;
  const estLabel = tipo === 'ml' ? 'Estoque total (ml)' : 'Quantidade em estoque';

  async function handleSave() {
    const nomeT = nome.trim();
    if (!nomeT || estN <= 0 || cstN <= 0) {
      toast('Preencha todos os campos', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveInsumo(editing ? editing.id : null, {
      nome: nomeT,
      tipo,
      estoque: estN,
      estoque_inicial: editing ? editing.estoque_inicial : estN,
      custo: cstN,
      unit: cstN / estN,
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
          <Input inputMode="decimal" placeholder="Ex: 1000" value={est} onChange={(e) => setEst(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5">
        <FormGroup label="Custo global (R$)">
          <Input inputMode="decimal" placeholder="Ex: 120,00" value={cst} onChange={(e) => setCst(e.target.value)} />
        </FormGroup>
      </div>
      {showHint && (
        <Hint>
          Custo por {tipo === 'ml' ? 'ml' : 'unidade'}: <strong>{fmt(cstN / estN)}</strong>
        </Hint>
      )}
    </Modal>
  );
}
