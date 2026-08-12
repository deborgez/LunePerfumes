'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Input, MaskedCPFInput, MaskedPhoneInput } from '@/components/shared/ui';
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
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [endereco, setEndereco] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setTelefone((editing.telefone || '').replace(/\D/g, ''));
      setCpf((editing.cpf || '').replace(/\D/g, ''));
      setEmail(editing.email || '');
      setInstagram(editing.instagram || '');
      setEndereco(editing.endereco || '');
    } else {
      setNome('');
      setTelefone('');
      setCpf('');
      setEmail('');
      setInstagram('');
      setEndereco('');
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
      cpf: cpf.trim(),
      email: email.trim(),
      instagram: instagram.trim(),
      endereco: endereco.trim(),
    });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Editar cliente' : 'Novo cliente'}
      maxWidth={480}
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
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Telefone/WhatsApp (opcional)">
          <MaskedPhoneInput placeholder="(11) 99999-9999" value={telefone} onChange={setTelefone} />
        </FormGroup>
        <FormGroup label="CPF (opcional)">
          <MaskedCPFInput placeholder="000.000.000-00" value={cpf} onChange={setCpf} />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="E-mail (opcional)">
          <Input type="email" placeholder="ex@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormGroup>
        <FormGroup label="Instagram (opcional)">
          <Input placeholder="@usuario" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </FormGroup>
      </div>
      <div>
        <FormGroup label="Endereço (opcional)">
          <Input placeholder="Rua, número, bairro, cidade" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        </FormGroup>
      </div>
    </Modal>
  );
}
