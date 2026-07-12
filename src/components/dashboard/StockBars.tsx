import { fq } from '@/lib/format';

interface StockItem {
  nome: string;
  estoque: number;
  estoque_inicial: number;
  tipo?: string;
}

export default function StockBars({ list, forceTipo, refValue }: { list: StockItem[]; forceTipo?: string; refValue?: number }) {
  if (!list.length) {
    return <p className="text-[13px] text-[var(--text-hint)]">Nenhum item cadastrado</p>;
  }
  return (
    <div>
      {list.map((x, i) => {
        const t = forceTipo || x.tipo;
        const max = refValue || x.estoque_inicial || x.estoque || 1;
        const pct = Math.min(100, Math.round((x.estoque / max) * 100));
        const col = pct > 50 ? 'var(--green)' : pct > 20 ? 'var(--amber)' : 'var(--red)';
        return (
          <div className="mb-3.5" key={i}>
            <div className="mb-[5px] flex justify-between text-[13px]">
              <span className="font-medium text-[var(--text)]">{x.nome}</span>
              <span className="text-xs text-[var(--text-muted)]">{fq(x.estoque, t)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface2)]">
              <div
                className="h-full rounded-[20px] transition-[width] duration-400"
                style={{ width: `${pct}%`, background: col }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
