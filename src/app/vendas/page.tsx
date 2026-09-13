'use client';

import { useState } from 'react';
import { IconReceipt } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, Badge } from '@/components/shared/ui';
import { fmt } from '@/lib/format';
import VendaForm from '@/components/vendas/VendaForm';
import PrazoPendentesList from '@/components/vendas/PrazoPendentesList';
import BaixaModal from '@/components/shared/BaixaModal';
import type { Venda } from '@/lib/types';

export default function VendasPage() {
  const { vendas, perfumes } = useData();
  const [baixaOpen, setBaixaOpen] = useState(false);
  const [baixaVenda, setBaixaVenda] = useState<Venda | null>(null);

  function openBaixa(v: Venda) {
    setBaixaVenda(v);
    setBaixaOpen(true);
  }

  const totalPendente = vendas.filter((v) => v.status === 'pendente').reduce((s, v) => s + v.receita_valor, 0);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <VendaForm />
      <Card>
        <CardHeader
          title="A prazo pendentes"
          icon={<IconReceipt size={17} />}
          action={totalPendente > 0 ? <Badge color="amber">Total: {fmt(totalPendente)}</Badge> : undefined}
        />
        <PrazoPendentesList vendas={vendas} perfumes={perfumes} onReceber={openBaixa} />
      </Card>

      <BaixaModal open={baixaOpen} onClose={() => setBaixaOpen(false)} venda={baixaVenda} perfumes={perfumes} />
    </div>
  );
}
