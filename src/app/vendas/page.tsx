'use client';

import { useState } from 'react';
import { IconReceipt } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader } from '@/components/shared/ui';
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

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <VendaForm />
      <Card>
        <CardHeader title="A prazo pendentes" icon={<IconReceipt size={17} />} />
        <PrazoPendentesList vendas={vendas} perfumes={perfumes} onReceber={openBaixa} />
      </Card>

      <BaixaModal open={baixaOpen} onClose={() => setBaixaOpen(false)} venda={baixaVenda} perfumes={perfumes} />
    </div>
  );
}
