'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Btn, FormGroup, Input, MaskedDecimalInput, Select } from '@/components/shared/ui';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { fmt } from '@/lib/format';
import { allItems, buildDefaultReceita, gi } from '@/lib/business';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { Genero, Perfume, ReceitaItem } from '@/lib/types';

interface PerfumeModalProps {
  open: boolean;
  onClose: () => void;
  editing: Perfume | null;
}

export default function PerfumeModal({ open, onClose, editing }: PerfumeModalProps) {
  const { essencias, insumos, savePerfume } = useData();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [genero, setGenero] = useState<Genero>('compartilhavel');
  const [inspiracao, setInspiracao] = useState('');
  const [ml, setMl] = useState(0);
  const [preco, setPreco] = useState(0);
  const [recRows, setRecRows] = useState<ReceitaItem[]>([]);
  const [saving, setSaving] = useState(false);

  const items = allItems(essencias, insumos);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinitialize form fields when modal opens for create/edit */
    if (editing) {
      setNome(editing.nome);
      setMarca(editing.marca);
      setGenero(editing.genero || 'compartilhavel');
      setInspiracao(editing.inspiracao || '');
      setMl(editing.ml);
      setPreco(editing.preco);
      const rec: ReceitaItem[] = Array.isArray(editing.receita)
        ? editing.receita
        : JSON.parse((editing.receita as unknown as string) || '[]');
      setRecRows(rec.map((r) => ({ tipo: r.tipo, itemId: r.itemId ?? r.item_id ?? 0, qtd: r.qtd })));
    } else {
      setNome('');
      setMarca('');
      setGenero('compartilhavel');
      setInspiracao('');
      setMl(0);
      setPreco(0);
      setRecRows(buildDefaultReceita(essencias, insumos));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- essencias/insumos intentionally excluded: only reinitialize on open/editing change, not on background data refresh
  }, [open, editing]);

  function addRow() {
    if (!items.length) {
      toast('Cadastre essências ou insumos primeiro', 'err');
      return;
    }
    setRecRows((prev) => [...prev, { tipo: items[0].tipo, itemId: items[0].id, qtd: 0 }]);
  }
  function updateRowItem(i: number, value: string) {
    const [tipo, id] = value.split('|');
    setRecRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, tipo: tipo as ReceitaItem['tipo'], itemId: parseInt(id) } : r)));
  }
  function updateRowQtd(i: number, qtd: number) {
    setRecRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, qtd } : r)));
  }
  function removeRow(i: number) {
    setRecRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  const custo = recRows.reduce((c, r) => {
    const it = gi(r.tipo, r.itemId, essencias, insumos);
    return it ? c + it.unit * r.qtd : c;
  }, 0);
  const lucro = preco - custo;
  const margem = preco <= 0 ? 0 : Math.round((lucro / preco) * 100);

  async function handleSave() {
    const nomeT = nome.trim();
    const marcaT = marca.trim();
    if (!nomeT || !marcaT) {
      toast('Preencha todos os campos', 'err');
      return;
    }
    setSaving(true);
    const ok = await savePerfume(editing ? editing.id : null, {
      nome: nomeT,
      marca: marcaT,
      genero,
      inspiracao: inspiracao.trim(),
      ml,
      preco,
      receita: recRows.map((r) => ({ tipo: r.tipo, itemId: r.itemId, qtd: r.qtd })),
    });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Editar perfume' : 'Novo perfume'}
      maxWidth={600}
      footer={
        <>
          <Btn onClick={onClose} className="flex-1 max-md:py-3.5">
            Cancelar
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} className="flex-1 max-md:py-3.5">
            Salvar perfume
          </Btn>
        </>
      }
    >
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Nome">
          <Input placeholder="Ex: Midnight Rose" value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormGroup>
        <FormGroup label="Marca">
          <Input placeholder="Ex: Lune" value={marca} onChange={(e) => setMarca(e.target.value)} />
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Volume (ml)">
          <MaskedDecimalInput value={ml} onChange={setMl} placeholder="0,00" />
        </FormGroup>
        <FormGroup label="Preço de venda (R$)">
          <MaskedDecimalInput value={preco} onChange={setPreco} placeholder="0,00" />
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
        <FormGroup label="Inspiração (opcional)">
          <Input placeholder="Ex: Bleu de Chanel" value={inspiracao} onChange={(e) => setInspiracao(e.target.value)} />
        </FormGroup>
      </div>

      <div className="my-3.5 h-px bg-[var(--border)]" />

      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[var(--text)]">Receita de produção</span>
        <Btn size="xs" onClick={addRow}>
          <IconPlus size={14} /> Adicionar item
        </Btn>
      </div>

      <div>
        {recRows.map((r, i) => {
          const cur = items.find((x) => x.tipo === r.tipo && x.id === r.itemId);
          return (
            <div key={i} className="mb-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-2.5 md:flex-nowrap">
              <select
                className="w-full flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-[7px] text-[13px] text-[var(--text)] outline-none md:w-auto"
                value={`${r.tipo}|${r.itemId}`}
                onChange={(e) => updateRowItem(i, e.target.value)}
              >
                {items.map((x) => (
                  <option key={`${x.tipo}|${x.id}`} value={`${x.tipo}|${x.id}`}>
                    {x.nome}
                  </option>
                ))}
              </select>
              <MaskedDecimalInput
                size="sm"
                value={r.qtd}
                onChange={(v) => updateRowQtd(i, v)}
                placeholder="0,00"
                className="w-[100px] md:w-20"
              />
              <span className="min-w-6 text-center text-[11px] text-[var(--text-hint)]">{cur?.tu || 'un'}</span>
              <Btn size="xs" variant="danger" onClick={() => removeRow(i)}>
                <IconTrash size={14} />
              </Btn>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 rounded-lg border border-[var(--hint-border)] bg-[var(--hint-bg)] px-3 py-2.5 text-[13px] text-[var(--hint-text)]">
        Custo: <strong>{fmt(custo)}</strong>&nbsp;·&nbsp;
        Lucro: <strong style={{ color: lucro >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(lucro)}</strong>&nbsp;·&nbsp;
        Margem: <strong>{margem}%</strong>
      </div>
    </Modal>
  );
}
