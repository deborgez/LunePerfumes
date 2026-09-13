import type { Perfume, Venda } from './types';

export interface CompraGroup {
  key: string;
  perfumeNome: string;
  qty: number;
  parcelaTotal: number | null;
  itens: Venda[];
}

export interface ClienteGroup {
  key: string;
  clienteNome: string;
  compras: CompraGroup[];
}

// Uma parcela pertence à mesma compra quando perfume, cliente, data e total de
// parcelas coincidem — as parcelas de uma venda parcelada são criadas juntas.
export function chaveDaCompra(v: Venda): string {
  const clienteKey = v.cliente_id != null ? `id:${v.cliente_id}` : `nome:${v.cliente || '—'}`;
  return `${v.perf_id}|${clienteKey}|${v.parcela_total ?? 'unica'}|${v.data}`;
}

export function contarVendasDistintas(vendas: Venda[]): number {
  return new Set(vendas.map(chaveDaCompra)).size;
}

export function agruparPorClienteECompra(vendas: Venda[], perfumes: Perfume[]): ClienteGroup[] {
  const clientesMap = new Map<string, ClienteGroup>();

  for (const v of vendas) {
    const clienteKey = v.cliente_id != null ? `id:${v.cliente_id}` : `nome:${v.cliente || '—'}`;
    if (!clientesMap.has(clienteKey)) {
      clientesMap.set(clienteKey, { key: clienteKey, clienteNome: v.cliente || '—', compras: [] });
    }
    const clienteGroup = clientesMap.get(clienteKey)!;

    const compraKey = chaveDaCompra(v);
    let compra = clienteGroup.compras.find((c) => c.key === compraKey);
    if (!compra) {
      const p = perfumes.find((p) => p.id === v.perf_id);
      compra = { key: compraKey, perfumeNome: p ? p.nome : '—', qty: v.qty, parcelaTotal: v.parcela_total, itens: [] };
      clienteGroup.compras.push(compra);
    }
    compra.itens.push(v);
  }

  const clientes = [...clientesMap.values()];
  clientes.forEach((c) => {
    c.compras.forEach((compra) => compra.itens.sort((a, b) => (a.parcela_num || 0) - (b.parcela_num || 0)));
    c.compras.sort((a, b) => (a.itens[0]?.venc || '').localeCompare(b.itens[0]?.venc || ''));
  });
  clientes.sort((a, b) => a.clienteNome.localeCompare(b.clienteNome, 'pt-BR'));
  return clientes;
}
