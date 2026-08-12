'use client';

import { useState } from 'react';
import { IconHistory, IconCash, IconMinus, IconTrendingUp } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { StatCard, Card, CardHeader, Badge, Select } from '@/components/shared/ui';
import { fd, fmt } from '@/lib/format';

type Filtro = 'todos' | 'avista' | 'prazo' | 'pago' | 'pendente';

export default function CaixaPage() {
  const { vendas, perfumes } = useData();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  let cx = 0,
    lu = 0,
    cu = 0;
  vendas
    .filter((v) => v.status === 'pago')
    .forEach((v) => {
      cx += v.receita_valor || 0;
      lu += v.lucro_valor || 0;
      cu += v.custo_valor || 0;
    });

  const lista = vendas.filter((v) => {
    if (filtro === 'avista') return v.tipo === 'avista';
    if (filtro === 'prazo') return v.tipo === 'prazo';
    if (filtro === 'pago') return v.status === 'pago';
    if (filtro === 'pendente') return v.status === 'pendente';
    return true;
  });

  return (
    <div>
      <div className="mb-3.5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Total em caixa" value={fmt(cx)} icon={<IconCash size={14} />} sub="vendas pagas" color="green" />
        <StatCard label="Custo acumulado" value={fmt(cu)} icon={<IconMinus size={14} />} sub="insumos consumidos" color="red" />
        <StatCard label="Lucro líquido" value={fmt(lu)} icon={<IconTrendingUp size={14} />} sub="receita − custo" color="purple" />
      </div>

      <Card>
        <CardHeader
          title="Histórico"
          icon={<IconHistory size={17} />}
          action={
            <Select value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)} className="!py-[7px] !pr-8 !text-xs">
              <option value="todos">Todos</option>
              <option value="avista">À vista</option>
              <option value="prazo">A prazo</option>
              <option value="pago">Pagos</option>
              <option value="pendente">Pendentes</option>
            </Select>
          }
        />

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-lg border border-[var(--border)] md:block">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Data', 'Perfume', 'Qtd', 'Tipo', 'Cliente', 'Receita', 'Custo', 'Lucro', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-[var(--border)] bg-[var(--tbl-head)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-hint)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!lista.length ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[13px] text-[var(--text-hint)]">
                    Nenhuma venda
                  </td>
                </tr>
              ) : (
                lista.map((v) => {
                  const p = perfumes.find((p) => p.id === v.perf_id);
                  return (
                    <tr key={v.id} className="border-b border-[var(--tbl-border)] last:border-0 hover:bg-[var(--tbl-hover)]">
                      <td className="px-3 py-2.5 text-[var(--text)]">{fd(v.data)}</td>
                      <td className="px-3 py-2.5 text-[var(--text)]">
                        <strong>{p ? p.nome : '—'}</strong>
                        {v.parcela_num && v.parcela_total ? (
                          <div className="mt-0.5 text-[11px] text-[var(--text-hint)]">Parcela {v.parcela_num}/{v.parcela_total}</div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text)]">{v.qty}</td>
                      <td className="px-3 py-2.5">
                        <Badge color={v.tipo === 'avista' ? 'green' : 'amber'}>{v.tipo === 'avista' ? 'À vista' : 'A prazo'}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text)]">{v.cliente || '—'}</td>
                      <td className="px-3 py-2.5 text-[var(--text)]">{fmt(v.receita_valor)}</td>
                      <td className="px-3 py-2.5" style={{ color: 'var(--red)' }}>
                        {fmt(v.custo_valor)}
                      </td>
                      <td className="px-3 py-2.5 font-semibold" style={{ color: v.lucro_valor >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {fmt(v.lucro_valor)}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge color={v.status === 'pago' ? 'green' : 'red'}>{v.status === 'pago' ? 'Pago' : 'Pendente'}</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden">
          {!lista.length ? (
            <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhuma venda</p>
          ) : (
            lista.map((v) => {
              const p = perfumes.find((p) => p.id === v.perf_id);
              return (
                <div key={v.id} className="mb-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)]">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">{p ? p.nome : '—'}</div>
                      <div className="mt-[3px] text-xs text-[var(--text-muted)]">
                        {fd(v.data)}
                        {v.cliente ? ` · ${v.cliente}` : ''}
                        {v.parcela_num && v.parcela_total ? ` · Parcela ${v.parcela_num}/${v.parcela_total}` : ''}
                      </div>
                    </div>
                    <Badge color={v.status === 'pago' ? 'green' : 'amber'}>{v.status === 'pago' ? 'Pago' : 'Pendente'}</Badge>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Receita</div>
                      <div className="mt-[1px] text-[13px] font-medium" style={{ color: 'var(--green)' }}>
                        {fmt(v.receita_valor)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Custo</div>
                      <div className="mt-[1px] text-[13px] font-medium" style={{ color: 'var(--red)' }}>
                        {fmt(v.custo_valor)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Lucro</div>
                      <div className="mt-[1px] text-[13px] font-medium" style={{ color: v.lucro_valor >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {fmt(v.lucro_valor)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Tipo</div>
                      <div className="mt-[1px]">
                        <Badge color={v.tipo === 'avista' ? 'green' : 'amber'}>{v.tipo === 'avista' ? 'À vista' : 'A prazo'}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
