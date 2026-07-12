'use client';

import { IconCash, IconClock, IconTrendingUp, IconChartBar, IconFlask, IconPackage } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { StatCard, Card, CardHeader } from '@/components/shared/ui';
import RevenueChart from '@/components/dashboard/RevenueChart';
import PrazoList from '@/components/dashboard/PrazoList';
import StockBars from '@/components/dashboard/StockBars';
import { fmt } from '@/lib/format';
import { ESSENCIA_ESTOQUE_REF, sortByEstoqueAsc } from '@/lib/business';

export default function DashboardPage() {
  const { vendas, essencias, insumos, perfumes } = useData();
  const essenciasOrdenadas = sortByEstoqueAsc(essencias);

  let cx = 0,
    lu = 0,
    pend = 0,
    tot = 0;
  vendas.forEach((v) => {
    tot += v.receita_valor || 0;
    if (v.status === 'pago') {
      cx += v.receita_valor || 0;
      lu += v.lucro_valor || 0;
    } else {
      pend += v.receita_valor || 0;
    }
  });

  return (
    <div>
      <div className="mb-3.5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Caixa"
          value={fmt(cx)}
          icon={<IconCash size={14} />}
          sub={`${vendas.filter((v) => v.status === 'pago').length} vendas pagas`}
          color="green"
        />
        <StatCard
          label="A receber"
          value={fmt(pend)}
          icon={<IconClock size={14} />}
          sub={`${vendas.filter((v) => v.status === 'pendente').length} pendentes`}
          color="amber"
        />
        <StatCard label="Lucro" value={fmt(lu)} icon={<IconTrendingUp size={14} />} sub="vendas pagas" color="purple" />
        <StatCard label="Faturamento" value={fmt(tot)} icon={<IconChartBar size={14} />} sub={`${vendas.length} vendas`} />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <CardHeader title="Receita por mês" icon={<IconChartBar size={17} />} />
          <RevenueChart vendas={vendas} />
        </Card>
        <Card>
          <CardHeader title="A receber" icon={<IconClock size={17} />} />
          <PrazoList vendas={vendas} perfumes={perfumes} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <CardHeader title="Estoque essências" icon={<IconFlask size={17} />} />
          <StockBars list={essenciasOrdenadas} forceTipo="ml" refValue={ESSENCIA_ESTOQUE_REF} />
        </Card>
        <Card>
          <CardHeader title="Estoque insumos" icon={<IconPackage size={17} />} />
          <StockBars list={insumos} />
        </Card>
      </div>
    </div>
  );
}
