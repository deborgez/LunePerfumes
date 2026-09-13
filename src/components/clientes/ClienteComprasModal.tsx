'use client';

import Modal from '@/components/shared/Modal';
import { Badge } from '@/components/shared/ui';
import { fd, fmt } from '@/lib/format';
import { agruparPorClienteECompra } from '@/lib/vendasGrouping';
import type { Cliente, Perfume, Venda } from '@/lib/types';

interface ClienteComprasModalProps {
  cliente: Cliente | null;
  vendas: Venda[];
  perfumes: Perfume[];
  onClose: () => void;
}

export default function ClienteComprasModal({ cliente, vendas, perfumes, onClose }: ClienteComprasModalProps) {
  const vendasDoCliente = cliente ? vendas.filter((v) => v.cliente_id === cliente.id) : [];
  const compras = cliente ? agruparPorClienteECompra(vendasDoCliente, perfumes)[0]?.compras || [] : [];

  return (
    <Modal open={!!cliente} onClose={onClose} title={cliente ? `Compras de ${cliente.nome}` : 'Compras'} maxWidth={560}>
      {!compras.length ? (
        <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhuma compra registrada.</p>
      ) : (
        compras.map((compra) => {
          const totalCompra = compra.itens.reduce((s, v) => s + v.receita_valor, 0);
          return (
            <div key={compra.key} className="mb-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3 last:mb-0">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[var(--text)]">
                  {compra.perfumeNome}&nbsp;×{compra.qty}
                  {compra.itens[0]?.vendedor ? (
                    <span className="ml-1.5 text-[11px] font-normal text-[var(--text-hint)]">· vendido por {compra.itens[0].vendedor}</span>
                  ) : null}
                </span>
                <Badge color="purple">{fmt(totalCompra)}</Badge>
              </div>
              {compra.itens.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-2.5 py-1 text-[12px]">
                  <span className="text-[var(--text-hint)]">
                    {v.parcela_num && v.parcela_total ? `Parcela ${v.parcela_num}/${v.parcela_total} · ` : ''}
                    {fd(v.data)}
                    {v.status === 'pendente' && v.venc ? ` · Vence ${fd(v.venc)}` : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[var(--text)]">{fmt(v.receita_valor)}</span>
                    <Badge color={v.status === 'pago' ? 'green' : 'amber'}>{v.status === 'pago' ? 'Pago' : 'Pendente'}</Badge>
                  </span>
                </div>
              ))}
            </div>
          );
        })
      )}
    </Modal>
  );
}
