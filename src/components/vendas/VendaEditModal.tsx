'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Input, MaskedDecimalInput, Select } from '@/components/shared/ui';
import SearchSelect from '@/components/shared/SearchSelect';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { fmt } from '@/lib/format';
import type { Venda } from '@/lib/types';

interface VendaEditModalProps {
  itens: Venda[] | null;
  onClose: () => void;
}

export default function VendaEditModal({ itens, onClose }: VendaEditModalProps) {
  const { perfumes, clientes, vendedores, editarVendaCompra } = useData();
  const toast = useToast();

  const [perfId, setPerfId] = useState<number | ''>('');
  const [qty, setQty] = useState('1');
  const [preco, setPreco] = useState(0);
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [vendedorId, setVendedorId] = useState<number | ''>('');
  const [venc, setVenc] = useState('');
  const [saving, setSaving] = useState(false);

  const single = itens && itens.length === 1 ? itens[0] : null;

  useEffect(() => {
    if (!itens || !itens.length) return;
    /* eslint-disable react-hooks/set-state-in-effect -- populate form fields when a compra is selected for editing */
    const total = itens.reduce((s, v) => s + v.receita_valor, 0);
    setPerfId(itens[0].perf_id);
    setQty(String(itens[0].qty));
    setPreco(itens[0].qty > 0 ? total / itens[0].qty : 0);
    setClienteId(itens[0].cliente_id ?? '');
    setVendedorId(itens[0].vendedor_id ?? '');
    setVenc(itens[0].venc || '');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [itens]);

  const qtyN = parseInt(qty) || 1;

  async function handleSave() {
    if (!itens || !perfId) return;
    if (!clienteId) {
      toast('Selecione o cliente', 'err');
      return;
    }
    const cli = clientes.find((c) => c.id === clienteId);
    const vdr = vendedores.find((v) => v.id === vendedorId);
    setSaving(true);
    const ok = await editarVendaCompra(itens, {
      perfId,
      qty: qtyN,
      precoUnit: preco,
      cliente: cli?.nome || '',
      clienteId: clienteId || null,
      vendedor: vdr?.nome || '',
      vendedorId: vendedorId || null,
      venc: single && single.status === 'pendente' ? venc : undefined,
    });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open={!!itens}
      onClose={onClose}
      title="Editar venda"
      maxWidth={480}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar alterações
          </Btn>
        </>
      }
    >
      {itens && itens.length > 1 && (
        <p className="mb-2.5 text-[12px] text-[var(--text-hint)]">
          Venda parcelada em {itens.length}x — o valor será redistribuído igualmente entre as parcelas.
        </p>
      )}
      <div className="mb-2.5">
        <FormGroup label="Perfume">
          <SearchSelect
            options={perfumes.map((p) => ({ value: p.id, label: p.nome, sublabel: `${p.marca} — ${fmt(p.preco)}` }))}
            value={perfId}
            onChange={setPerfId}
            placeholder="Buscar perfume..."
            emptyMessage="Nenhum perfume encontrado"
          />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Quantidade">
          <Input type="number" min={1} inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
        </FormGroup>
        <FormGroup label="Valor unitário">
          <MaskedDecimalInput value={preco} onChange={setPreco} placeholder="0,00" />
        </FormGroup>
      </div>
      <div className="mb-2.5">
        <FormGroup label="Cliente">
          {!clientes.length ? (
            <Select disabled value="">
              <option value="">— Cadastre clientes primeiro —</option>
            </Select>
          ) : (
            <SearchSelect
              options={clientes.map((c) => ({ value: c.id, label: c.nome }))}
              value={clienteId}
              onChange={setClienteId}
              placeholder="Buscar cliente..."
              emptyMessage="Nenhum cliente encontrado"
              allowClear
            />
          )}
        </FormGroup>
      </div>
      <div className="mb-2.5">
        <FormGroup label="Vendedor (opcional)">
          {!vendedores.length ? (
            <Select disabled value="">
              <option value="">— Nenhum vendedor cadastrado —</option>
            </Select>
          ) : (
            <SearchSelect
              options={vendedores.map((v) => ({ value: v.id, label: v.nome }))}
              value={vendedorId}
              onChange={setVendedorId}
              placeholder="Buscar vendedor..."
              emptyMessage="Nenhum vendedor encontrado"
              allowClear
            />
          )}
        </FormGroup>
      </div>
      {single && single.status === 'pendente' && (
        <div>
          <FormGroup label="Vencimento">
            <Input type="date" value={venc} onChange={(e) => setVenc(e.target.value)} />
          </FormGroup>
        </div>
      )}
    </Modal>
  );
}
