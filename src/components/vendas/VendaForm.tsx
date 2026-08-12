'use client';

import { useState } from 'react';
import { IconCheck, IconShoppingCart } from '@tabler/icons-react';
import { Btn, Card, CardHeader, FormGroup, Input, Select } from '@/components/shared/ui';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { gi, receitaOf } from '@/lib/business';
import { fmt } from '@/lib/format';

export default function VendaForm() {
  const { perfumes, essencias, insumos, clientes, vender } = useData();
  const toast = useToast();

  const [perfId, setPerfId] = useState<number | ''>(perfumes[0]?.id ?? '');
  const [qty, setQty] = useState('1');
  const [tipo, setTipo] = useState<'avista' | 'prazo'>('avista');
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [venc, setVenc] = useState('');
  const [parcelado, setParcelado] = useState(false);
  const [parcelas, setParcelas] = useState('2');
  const [saving, setSaving] = useState(false);

  const currentPerfId = perfId === '' ? perfumes[0]?.id : perfId;
  const p = perfumes.find((x) => x.id === currentPerfId);
  const qtyN = parseInt(qty) || 1;
  const parcelasN = Math.max(2, parseInt(parcelas) || 2);

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
    if (tipo === 'prazo' && !clienteId) {
      toast('Selecione o cliente', 'err');
      return;
    }
    if (tipo === 'prazo' && !venc) {
      toast(parcelado ? 'Informe o vencimento da 1ª parcela' : 'Informe o vencimento', 'err');
      return;
    }
    const cli = clientes.find((c) => c.id === clienteId);
    setSaving(true);
    const ok = await vender({
      perfId: currentPerfId,
      qty: qtyN,
      tipo,
      cliente: cli?.nome || '',
      clienteId: clienteId || null,
      venc,
      parcelado,
      parcelas: parcelasN,
    });
    setSaving(false);
    if (ok) {
      setQty('1');
      setClienteId('');
      setVenc('');
      setParcelado(false);
      setParcelas('2');
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
              <Select value={clienteId} onChange={(e) => setClienteId(e.target.value ? parseInt(e.target.value) : '')}>
                <option value="">{clientes.length ? 'Selecione...' : '— Cadastre clientes primeiro —'}</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup label={parcelado ? '1ª parcela vence em' : 'Vencimento'}>
              <Input type="date" value={venc} onChange={(e) => setVenc(e.target.value)} />
            </FormGroup>
          </div>

          <label className="mb-2.5 flex items-center gap-2 text-[13px] text-[var(--text)]">
            <input type="checkbox" checked={parcelado} onChange={(e) => setParcelado(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
            Parcelado?
          </label>

          {parcelado && (
            <div className="mb-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
              <FormGroup label="Quantidade de parcelas">
                <Input type="number" min={2} inputMode="numeric" value={parcelas} onChange={(e) => setParcelas(e.target.value)} />
              </FormGroup>
            </div>
          )}
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
          {tipo === 'prazo' && parcelado && (
            <div className="mt-2.5 text-xs text-[var(--text-hint)]">
              {parcelasN}x de {fmt(resumo.receita / parcelasN)}, vencendo a cada 30 dias a partir da data informada.
            </div>
          )}
        </div>
      )}

      <Btn variant="success" full className="mt-3" onClick={handleVender} disabled={saving || !perfumes.length}>
        <IconCheck size={16} /> Confirmar venda
      </Btn>
    </Card>
  );
}
