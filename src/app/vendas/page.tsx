'use client';

import { useState } from 'react';
import { IconReceipt, IconShoppingCart } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, Badge } from '@/components/shared/ui';
import { fmt } from '@/lib/format';
import VendaForm from '@/components/vendas/VendaForm';
import VendasList from '@/components/vendas/VendasList';
import BaixaModal from '@/components/shared/BaixaModal';
import type { Venda } from '@/lib/types';

export default function VendasPage() {
  const { vendas, perfumes, deleteVendaCompra } = useData();
  const [baixaOpen, setBaixaOpen] = useState(false);
  const [baixaVenda, setBaixaVenda] = useState<Venda | null>(null);

  function openBaixa(v: Venda) {
    setBaixaVenda(v);
    setBaixaOpen(true);
  }

  const totalPendente = vendas.filter((v) => v.status === 'pendente').reduce((s, v) => s + v.receita_valor, 0);

  return (
    <div>
      <VendaForm />

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <CardHeader title="Vendas à vista" icon={<IconShoppingCart size={17} />} />
          <VendasList vendas={vendas} perfumes={perfumes} tipo="avista" onExcluir={deleteVendaCompra} />
        </Card>
        <Card>
          <CardHeader
            title="Vendas a prazo"
            icon={<IconReceipt size={17} />}
            action={totalPendente > 0 ? <Badge color="amber">A receber: {fmt(totalPendente)}</Badge> : undefined}
          />
          <VendasList vendas={vendas} perfumes={perfumes} tipo="prazo" onReceber={openBaixa} onExcluir={deleteVendaCompra} />
        </Card>
      </div>

      <BaixaModal open={baixaOpen} onClose={() => setBaixaOpen(false)} venda={baixaVenda} perfumes={perfumes} />
    </div>
  );
}
