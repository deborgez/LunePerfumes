'use client';

import { Btn, Badge } from '@/components/shared/ui';
import { IconCash, IconTag } from '@tabler/icons-react';
import { fd, fmt } from '@/lib/format';
import { agruparPorClienteECompra } from '@/lib/vendasGrouping';
import { baixarEtiqueta } from '@/lib/etiqueta';
import { useToast } from '@/context/ToastContext';
import type { Perfume, Venda } from '@/lib/types';

export default function VendasList({
  vendas,
  perfumes,
  tipo,
  onReceber,
}: {
  vendas: Venda[];
  perfumes: Perfume[];
  tipo: 'avista' | 'prazo';
  onReceber?: (v: Venda) => void;
}) {
  const toast = useToast();
  const filtradas = vendas.filter((v) => v.tipo === tipo);
  if (!filtradas.length) {
    return <p className="py-2 text-[13px] text-[var(--text-hint)]">Nenhuma venda {tipo === 'avista' ? 'à vista' : 'a prazo'}.</p>;
  }
  const clientes = agruparPorClienteECompra(filtradas, perfumes);

  async function handleEtiqueta(clienteNome: string, perfumeNome: string) {
    try {
      await baixarEtiqueta(clienteNome, perfumeNome);
    } catch {
      toast('Falha ao gerar a etiqueta', 'err');
    }
  }

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
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-[var(--text)]">
                    {compra.perfumeNome}&nbsp;×{compra.qty}
                    {compra.parcelaTotal && compra.parcelaTotal > 1 ? (
                      <span className="ml-1.5 text-[11px] font-normal text-[var(--text-hint)]">· {compra.parcelaTotal}x</span>
                    ) : null}
                  </div>
                  <Btn size="xs" onClick={() => handleEtiqueta(c.clienteNome, compra.perfumeNome)}>
                    <IconTag size={14} /> Etiqueta
                  </Btn>
                </div>
                {compra.itens.map((v) => (
                  <div key={v.id} className="flex items-center gap-2.5 py-1">
                    <div className="flex-1 text-[11px] text-[var(--text-hint)]">
                      {v.parcela_num && v.parcela_total ? `Parcela ${v.parcela_num}/${v.parcela_total} · ` : ''}
                      {v.status === 'pendente' ? `Vence ${fd(v.venc)}` : fd(v.data)}
                    </div>
                    <Badge color={v.status === 'pago' ? 'green' : 'amber'}>{fmt(v.receita_valor)}</Badge>
                    {v.status === 'pendente' && onReceber && (
                      <Btn size="xs" variant="success" onClick={() => onReceber(v)}>
                        <IconCash size={14} /> Receber
                      </Btn>
                    )}
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
