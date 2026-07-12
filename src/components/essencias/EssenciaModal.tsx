'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Hint, Input } from '@/components/shared/ui';
import { br, fmt } from '@/lib/format';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { Essencia } from '@/lib/types';

interface EssenciaModalProps {
  open: boolean;
  onClose: () => void;
  editing: Essencia | null;
}

export default function EssenciaModal({ open, onClose, editing }: EssenciaModalProps) {
  const { saveEssencia } = useData();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [forn, setForn] = useState('');
  const [est, setEst] = useState('');
  const [cst, setCst] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setForn(editing.fornecedor || '');
      setEst(editing.estoque.toString());
      setCst(editing.custo.toFixed(2).replace('.', ','));
    } else {
      setNome('');
      setForn('');
      setEst('');
      setCst('');
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, editing]);

  const estN = br(est);
  const cstN = br(cst);
  const showHint = estN > 0 && cstN > 0;

  async function handleSave() {
    const nomeT = nome.trim();
    const fornT = forn.trim();
    if (!nomeT || estN <= 0 || cstN <= 0) {
      toast('Preencha todos os campos', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveEssencia(editing ? editing.id : null, {
      nome: nomeT,
      fornecedor: fornT,
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
      title={editing ? 'Editar essência' : 'Nova essência'}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar essência
          </Btn>
        </>
      }
    >
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Nome da essência">
          <Input placeholder="Ex: Oud, Vanilla..." value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormGroup>
        <FormGroup label="Fornecedor (opcional)">
          <Input placeholder="Ex: Drom..." value={forn} onChange={(e) => setForn(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Estoque (ml)">
          <Input inputMode="decimal" placeholder="Ex: 500" value={est} onChange={(e) => setEst(e.target.value)} />
        </FormGroup>
        <FormGroup label="Custo global (R$)">
          <Input inputMode="decimal" placeholder="Ex: 150,00" value={cst} onChange={(e) => setCst(e.target.value)} />
        </FormGroup>
      </div>
      {showHint && (
        <Hint>
          Custo por ml: <strong>{fmt(cstN / estN)}</strong>
        </Hint>
      )}
    </Modal>
  );
}
