import { Btn, Badge } from '@/components/shared/ui';
import { IconCash } from '@tabler/icons-react';
import { fd, fmt } from '@/lib/format';
import type { Perfume, Venda } from '@/lib/types';

interface CompraGroup {
  key: string;
  perfumeNome: string;
  qty: number;
  parcelaTotal: number | null;
  itens: Venda[];
}

interface ClienteGroup {
  key: string;
  clienteNome: string;
  compras: CompraGroup[];
}

function agrupar(pendentes: Venda[], perfumes: Perfume[]): ClienteGroup[] {
  const clientesMap = new Map<string, ClienteGroup>();

  for (const v of pendentes) {
    const clienteKey = v.cliente_id != null ? `id:${v.cliente_id}` : `nome:${v.cliente || '—'}`;
    if (!clientesMap.has(clienteKey)) {
      clientesMap.set(clienteKey, { key: clienteKey, clienteNome: v.cliente || '—', compras: [] });
    }
    const clienteGroup = clientesMap.get(clienteKey)!;

    const compraKey = `${v.perf_id}|${v.parcela_total ?? 'unica'}|${v.data}`;
    let compra = clienteGroup.compras.find((c) => c.key === compraKey);
    if (!compra) {
      const p = perfumes.find((p) => p.id === v.perf_id);
      compra = { key: compraKey, perfumeNome: p ? p.nome : '—', qty: v.qty, parcelaTotal: v.parcela_total, itens: [] };
      clienteGroup.compras.push(compra);
    }
    compra.itens.push(v);
  }

  const clientes = [...clientesMap.values()];
  clientes.forEach((c) => {
    c.compras.forEach((compra) => compra.itens.sort((a, b) => (a.parcela_num || 0) - (b.parcela_num || 0)));
    c.compras.sort((a, b) => (a.itens[0]?.venc || '').localeCompare(b.itens[0]?.venc || ''));
  });
  clientes.sort((a, b) => a.clienteNome.localeCompare(b.clienteNome, 'pt-BR'));
  return clientes;
}

export default function PrazoPendentesList({
  vendas,
  perfumes,
  onReceber,
}: {
  vendas: Venda[];
  perfumes: Perfume[];
  onReceber: (v: Venda) => void;
}) {
  const pendentes = vendas.filter((v) => v.status === 'pendente');
  if (!pendentes.length) {
    return <p className="py-2 text-[13px] text-[var(--text-hint)]">Nenhuma conta pendente.</p>;
  }
  const clientes = agrupar(pendentes, perfumes);

  return (
    <div>
      {clientes.map((c) => {
        const totalCliente = c.compras.reduce((s, compra) => s + compra.itens.reduce((s2, v) => s2 + v.receita_valor, 0), 0);
        return (
          <div key={c.key} className="border-b border-[var(--border)] py-3 last:border-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text)]">{c.clienteNome}</span>
              <Badge color="amber">{fmt(totalCliente)}</Badge>
            </div>
            {c.compras.map((compra) => (
              <div key={compra.key} className="mb-2 rounded-lg bg-[var(--surface2)] p-2.5 last:mb-0">
                <div className="mb-1.5 text-[12px] font-medium text-[var(--text)]">
                  {compra.perfumeNome}&nbsp;×{compra.qty}
                  {compra.parcelaTotal && compra.parcelaTotal > 1 ? (
                    <span className="ml-1.5 text-[11px] font-normal text-[var(--text-hint)]">
                      · {compra.itens.length} de {compra.parcelaTotal} parcela{compra.parcelaTotal > 1 ? 's' : ''} em aberto
                    </span>
                  ) : null}
                </div>
                {compra.itens.map((v) => (
                  <div key={v.id} className="flex items-center gap-2.5 py-1">
                    <div className="flex-1 text-[11px] text-[var(--text-hint)]">
                      {v.parcela_num && v.parcela_total ? `Parcela ${v.parcela_num}/${v.parcela_total} · ` : ''}
                      Vence {fd(v.venc)}
                    </div>
                    <Badge color="amber">{fmt(v.receita_valor)}</Badge>
                    <Btn size="xs" variant="success" onClick={() => onReceber(v)}>
                      <IconCash size={14} /> Receber
                    </Btn>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
