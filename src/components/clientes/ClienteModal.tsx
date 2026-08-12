'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Input } from '@/components/shared/ui';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { Cliente } from '@/lib/types';

interface ClienteModalProps {
  open: boolean;
  onClose: () => void;
  editing: Cliente | null;
}

export default function ClienteModal({ open, onClose, editing }: ClienteModalProps) {
  const { saveCliente } = useData();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setTelefone(editing.telefone || '');
    } else {
      setNome('');
      setTelefone('');
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, editing]);

  async function handleSave() {
    const nomeT = nome.trim();
    if (!nomeT) {
      toast('Informe o nome do cliente', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveCliente(editing ? editing.id : null, {
      nome: nomeT,
      telefone: telefone.trim(),
    });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Editar cliente' : 'Novo cliente'}
      maxWidth={420}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar cliente
          </Btn>
        </>
      }
    >
      <div className="mb-2.5">
        <FormGroup label="Nome do cliente">
          <Input placeholder="Ex: Maria Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormGroup>
      </div>
      <div>
        <FormGroup label="Telefone/WhatsApp (opcional)">
          <Input placeholder="Ex: (11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </FormGroup>
      </div>
    </Modal>
  );
}
