import { Btn, Badge } from '@/components/shared/ui';
import { IconCash } from '@tabler/icons-react';
import { fd, fmt } from '@/lib/format';
import type { Perfume, Venda } from '@/lib/types';

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
  return (
    <div>
      {pendentes.map((v) => {
        const p = perfumes.find((p) => p.id === v.perf_id);
        return (
          <div key={v.id} className="flex items-center gap-2.5 border-b border-[var(--border)] py-3 last:border-0">
            <div className="flex-1">
              <div className="text-[13px] font-medium text-[var(--text)]">{v.cliente || '—'}</div>
              <div className="mt-0.5 text-[11px] text-[var(--text-hint)]">
                {p ? p.nome : ''}&nbsp;×{v.qty}
                {v.parcela_num && v.parcela_total ? ` · Parcela ${v.parcela_num}/${v.parcela_total}` : ''}
                &nbsp;·&nbsp;Vence {fd(v.venc)}
              </div>
            </div>
            <Badge color="amber">{fmt(v.receita_valor)}</Badge>
            <Btn size="xs" variant="success" onClick={() => onReceber(v)}>
              <IconCash size={14} /> Receber
            </Btn>
          </div>
        );
      })}
    </div>
  );
}
