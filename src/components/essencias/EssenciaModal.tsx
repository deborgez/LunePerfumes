'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Hint, Input, Select } from '@/components/shared/ui';
import { br, fmt } from '@/lib/format';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { Essencia, Genero } from '@/lib/types';

interface EssenciaModalProps {
  open: boolean;
  onClose: () => void;
  editing: Essencia | null;
}

export default function EssenciaModal({ open, onClose, editing }: EssenciaModalProps) {
  const { saveEssencia } = useData();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [genero, setGenero] = useState<Genero>('compartilhavel');
  const [inspiracao, setInspiracao] = useState('');
  const [forn, setForn] = useState('');
  const [est, setEst] = useState('');
  const [cst, setCst] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setMarca(editing.marca || '');
      setGenero(editing.genero || 'compartilhavel');
      setInspiracao(editing.inspiracao || '');
      setForn(editing.fornecedor || '');
      setEst(editing.estoque.toString());
      setCst(editing.custo.toFixed(2).replace('.', ','));
    } else {
      setNome('');
      setMarca('');
      setGenero('compartilhavel');
      setInspiracao('');
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
    const marcaT = marca.trim();
    const inspiracaoT = inspiracao.trim();
    const fornT = forn.trim();
    if (!nomeT || estN < 0 || cstN < 0) {
      toast('Preencha o nome da essência', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveEssencia(editing ? editing.id : null, {
      nome: nomeT,
      marca: marcaT,
      genero,
      inspiracao: inspiracaoT,
      fornecedor: fornT,
      estoque: estN,
      estoque_inicial: editing ? editing.estoque_inicial : estN,
      custo: cstN,
      unit: estN > 0 ? cstN / estN : 0,
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
        <FormGroup label="Marca (opcional)">
          <Input placeholder="Ex: Drom, Firmenich..." value={marca} onChange={(e) => setMarca(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Gênero">
          <Select value={genero} onChange={(e) => setGenero(e.target.value as Genero)}>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="compartilhavel">Compartilhável</option>
          </Select>
        </FormGroup>
        <FormGroup label="Fornecedor (opcional)">
          <Input placeholder="Ex: Distribuidor X..." value={forn} onChange={(e) => setForn(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5">
        <FormGroup label="Inspiração (opcional)">
          <Input placeholder="Ex: Bleu de Chanel" value={inspiracao} onChange={(e) => setInspiracao(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Estoque (ml)">
          <Input inputMode="decimal" placeholder="Ex: 500 (ou 0 para só cadastrar)" value={est} onChange={(e) => setEst(e.target.value)} />
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
