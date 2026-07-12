import type { AllItem, Essencia, Insumo, ItemTipo, Perfume, ReceitaItem } from './types';

// Referência fixa de estoque "cheio" para essências, usada para sinalizar
// e priorizar itens com pouco estoque (independente do estoque_inicial de cada uma).
export const ESSENCIA_ESTOQUE_REF = 500;

export function sortByEstoqueAsc<T extends { estoque: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => a.estoque - b.estoque);
}

export function gi(tipo: ItemTipo, id: number, ess: Essencia[], ins: Insumo[]): Essencia | Insumo | undefined {
  return tipo === 'essencia' ? ess.find((x) => x.id === id) : ins.find((x) => x.id === id);
}

export function allItems(ess: Essencia[], ins: Insumo[]): AllItem[] {
  return [
    ...ess.map((e) => ({ tipo: 'essencia' as const, id: e.id, nome: e.nome + ' (ess.)', unit: e.unit, tu: 'ml' })),
    ...ins.map((i) => ({ tipo: 'insumo' as const, id: i.id, nome: i.nome, unit: i.unit, tu: i.tipo })),
  ];
}

export function receitaOf(p: Perfume): ReceitaItem[] {
  return Array.isArray(p.receita) ? p.receita : JSON.parse((p.receita as unknown as string) || '[]');
}

export function custo1(p: Perfume, ess: Essencia[], ins: Insumo[]): number {
  let c = 0;
  const rec = receitaOf(p);
  rec.forEach((r) => {
    const it = gi(r.tipo, r.itemId ?? r.item_id ?? 0, ess, ins);
    if (it) c += it.unit * (r.qtd || 0);
  });
  return c;
}
