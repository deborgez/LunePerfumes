import { fmt } from '@/lib/format';
import type { Venda } from '@/lib/types';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function SalesChart({ vendas }: { vendas: Venda[] }) {
  const ma = new Date().getMonth();
  const ano = new Date().getFullYear();
  const labels: string[] = [];
  const vals: number[] = [];
  for (let m = ma - 5; m <= ma; m++) {
    const idx = (m + 12) % 12;
    labels.push(MESES[idx]);
    let soma = 0;
    vendas.forEach((v) => {
      const vm = parseInt((v.data || '').split('-')[1] || '0') - 1;
      const vy = parseInt((v.data || '').split('-')[0]);
      if (vm === idx && vy === ano) soma += v.receita_valor || 0;
    });
    vals.push(soma);
  }
  const mx = Math.max(...vals) || 1;

  return (
    <div className="flex h-[90px] items-end gap-1.5 pt-2.5">
      {labels.map((m, i) => {
        const h = Math.max(4, Math.round((vals[i] / mx) * 80));
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="text-[9px] font-semibold text-[var(--brand)]">{fmt(vals[i]).replace('R$ ', '')}</div>
            <div className="w-full rounded-t min-h-[3px]" style={{ height: h, background: 'var(--brand)' }} />
            <div className="text-center text-[10px] leading-[1.4] text-[var(--text-hint)]">{m}</div>
          </div>
        );
      })}
    </div>
  );
}
