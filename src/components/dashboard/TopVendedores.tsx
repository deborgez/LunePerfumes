import { Badge } from '@/components/shared/ui';
import { fmt } from '@/lib/format';
import { statsPorVendedor } from '@/lib/vendasGrouping';
import type { Vendedor, Venda } from '@/lib/types';

export default function TopVendedores({ vendedores, vendas }: { vendedores: Vendedor[]; vendas: Venda[] }) {
  const stats = statsPorVendedor(vendas);
  const ranking = vendedores
    .map((v) => ({ vendedor: v, s: stats.get(v.id) || { perfumesComprados: 0, totalRecebido: 0 } }))
    .filter((r) => r.s.perfumesComprados > 0)
    .sort((a, b) => b.s.totalRecebido - a.s.totalRecebido)
    .slice(0, 5);

  if (!ranking.length) {
    return <p className="py-2 text-[13px] text-[var(--text-hint)]">Nenhuma venda com vendedor registrada ainda.</p>;
  }

  return (
    <div>
      {ranking.map(({ vendedor, s }, i) => (
        <div key={vendedor.id} className="flex items-center gap-2.5 border-b border-[var(--border)] py-3 last:border-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface2)] text-[11px] font-semibold text-[var(--text-hint)]">
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-[var(--text)]">{vendedor.nome}</div>
            <div className="mt-0.5 text-[11px] text-[var(--text-hint)]">{s.perfumesComprados} perfume{s.perfumesComprados > 1 ? 's' : ''} vendido{s.perfumesComprados > 1 ? 's' : ''}</div>
          </div>
          <Badge color="green">{fmt(s.totalRecebido)}</Badge>
        </div>
      ))}
    </div>
  );
}
