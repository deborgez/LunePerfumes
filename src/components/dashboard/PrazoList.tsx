import { Badge } from '@/components/shared/ui';
import { fd, fmt } from '@/lib/format';
import type { Perfume, Venda } from '@/lib/types';

export default function PrazoList({ vendas, perfumes }: { vendas: Venda[]; perfumes: Perfume[] }) {
  const pendentes = vendas.filter((v) => v.status === 'pendente');
  if (!pendentes.length) {
    return <p className="py-2 text-[13px] text-[var(--text-hint)]">Nenhuma conta pendente ✓</p>;
  }
  return (
    <div>
      {pendentes.map((v) => {
        const p = perfumes.find((p) => p.id === v.perf_id);
        return (
          <div key={v.id} className="flex items-center gap-2.5 border-b border-[var(--border)] py-3 last:border-0">
            <div className="flex-1">
              <div className="text-[13px] font-medium text-[var(--text)]">{v.cliente || '—'}</div>
              <div className="mt-0.5 text-[11px] text-[var(--text-hint)]">
                {p ? p.nome : ''}&nbsp;×{v.qty}&nbsp;·&nbsp;Vence {fd(v.venc)}
              </div>
            </div>
            <Badge color="amber">{fmt(v.receita_valor)}</Badge>
          </div>
        );
      })}
    </div>
  );
}
