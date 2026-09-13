'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Input, MaskedPhoneInput } from '@/components/shared/ui';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { Vendedor } from '@/lib/types';

interface VendedorModalProps {
  open: boolean;
  onClose: () => void;
  editing: Vendedor | null;
}

export default function VendedorModal({ open, onClose, editing }: VendedorModalProps) {
  const { saveVendedor } = useData();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setTelefone((editing.telefone || '').replace(/\D/g, ''));
    } else {
      setNome('');
      setTelefone('');
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, editing]);

  async function handleSave() {
    const nomeT = nome.trim();
    if (!nomeT) {
      toast('Informe o nome do vendedor', 'err');
      return;
    }
    setSaving(true);
    const ok = await saveVendedor(editing ? editing.id : null, {
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
      title={editing ? 'Editar vendedor' : 'Novo vendedor'}
      maxWidth={420}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar vendedor
          </Btn>
        </>
      }
    >
      <div className="mb-2.5">
        <FormGroup label="Nome do vendedor">
          <Input placeholder="Ex: João Souza" value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormGroup>
      </div>
      <div>
        <FormGroup label="Telefone/WhatsApp (opcional)">
          <MaskedPhoneInput placeholder="(11) 99999-9999" value={telefone} onChange={setTelefone} />
        </FormGroup>
      </div>
    </Modal>
  );
}
