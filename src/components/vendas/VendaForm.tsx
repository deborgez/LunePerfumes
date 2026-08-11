'use client';

import { useState } from 'react';
import { IconCheck, IconShoppingCart } from '@tabler/icons-react';
import { Btn, Card, CardHeader, FormGroup, Input, Select } from '@/components/shared/ui';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { gi, receitaOf } from '@/lib/business';
import { fmt } from '@/lib/format';

export default function VendaForm() {
  const { perfumes, essencias, insumos, vender } = useData();
  const toast = useToast();

  const [perfId, setPerfId] = useState<number | ''>(perfumes[0]?.id ?? '');
  const [qty, setQty] = useState('1');
  const [tipo, setTipo] = useState<'avista' | 'prazo'>('avista');
  const [cliente, setCliente] = useState('');
  const [venc, setVenc] = useState('');
  const [saving, setSaving] = useState(false);

  const currentPerfId = perfId === '' ? perfumes[0]?.id : perfId;
  const p = perfumes.find((x) => x.id === currentPerfId);
  const qtyN = parseInt(qty) || 1;

  let resumo: { itens: { nome: string; qtd: string }[]; receita: number; custo: number; lucro: number } | null = null;
  if (p) {
    let custo = 0;
    const rec = receitaOf(p);
    const itens = rec
      .map((r) => {
        const it = gi(r.tipo, r.itemId ?? r.item_id ?? 0, essencias, insumos);
        if (!it) return null;
        custo += it.unit * r.qtd;
        const unidade = r.tipo === 'essencia' || (it as { tipo?: string }).tipo === 'ml' ? ' ml' : ' un';
        return { nome: it.nome.split(' (')[0], qtd: `${r.qtd * qtyN}${unidade}` };
      })
      .filter((x): x is { nome: string; qtd: string } => x !== null);
    custo *= qtyN;
    const receita = p.preco * qtyN;
    resumo = { itens, receita, custo, lucro: receita - custo };
  }

  async function handleVender() {
    if (!currentPerfId) {
      toast('Selecione um perfume', 'err');
      return;
    }
    if (tipo === 'prazo' && !cliente.trim()) {
      toast('Informe o cliente', 'err');
      return;
    }
    if (tipo === 'prazo' && !venc) {
      toast('Informe o vencimento', 'err');
      return;
    }
    setSaving(true);
    const ok = await vender({ perfId: currentPerfId, qty: qtyN, tipo, cliente: cliente.trim(), venc });
    setSaving(false);
    if (ok) {
      setQty('1');
      setCliente('');
      setVenc('');
    }
  }

  return (
    <Card>
      <CardHeader title="Nova venda" icon={<IconShoppingCart size={17} />} />
      <div className="mb-2.5">
        <FormGroup label="Perfume">
          <Select
            value={currentPerfId ?? ''}
            onChange={(e) => setPerfId(parseInt(e.target.value))}
          >
            {!perfumes.length ? (
              <option value="">— Cadastre perfumes primeiro —</option>
            ) : (
              perfumes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {fmt(p.preco)}
                </option>
              ))
            )}
          </Select>
        </FormGroup>
      </div>
      <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <FormGroup label="Quantidade">
          <Input type="number" min={1} inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
        </FormGroup>
        <FormGroup label="Modalidade">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value as 'avista' | 'prazo')}>
            <option value="avista">À vista</option>
            <option value="prazo">A prazo</option>
          </Select>
        </FormGroup>
      </div>

      {tipo === 'prazo' && (
        <div>
          <div className="my-3.5 h-px bg-[var(--border)]" />
          <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
            <FormGroup label="Cliente">
              <Input placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </FormGroup>
            <FormGroup label="Vencimento">
              <Input type="date" value={venc} onChange={(e) => setVenc(e.target.value)} />
            </FormGroup>
          </div>
        </div>
      )}

      {resumo && (
        <div className="my-2.5 rounded-[10px] border border-[var(--resumo-border)] bg-[var(--resumo-bg)] p-3.5 text-[13px]">
          <div className="mb-2 text-xs text-[var(--text-muted)]">
            Insumos consumidos <span className="text-[var(--text-hint)]">(custo/lucro abaixo são apenas referência — o Caixa contabiliza só a receita)</span>:
          </div>
          <div className="mb-2.5">
            {resumo.itens.map((it, i) => (
              <span
                key={i}
                className="mr-1 mb-1 inline-block rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-[3px] text-xs text-[var(--text)]"
              >
                {it.nome}: {it.qtd}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <div className="mb-[3px] text-[11px] text-[var(--text-hint)]">Receita</div>
              <div className="text-base font-semibold" style={{ color: 'var(--green)' }}>
                {fmt(resumo.receita)}
              </div>
            </div>
            <div>
              <div className="mb-[3px] text-[11px] text-[var(--text-hint)]">Custo</div>
              <div className="text-base font-semibold" style={{ color: 'var(--red)' }}>
                {fmt(resumo.custo)}
              </div>
            </div>
            <div>
              <div className="mb-[3px] text-[11px] text-[var(--text-hint)]">Lucro</div>
              <div className="text-base font-semibold" style={{ color: resumo.lucro >= 0 ? 'var(--brand)' : 'var(--red)' }}>
                {fmt(resumo.lucro)}
              </div>
            </div>
          </div>
        </div>
      )}

      <Btn variant="success" full className="mt-3" onClick={handleVender} disabled={saving || !perfumes.length}>
        <IconCheck size={16} /> Confirmar venda
      </Btn>
    </Card>
  );
}
