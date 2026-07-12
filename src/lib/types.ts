export type ItemTipo = 'essencia' | 'insumo';
export type InsumoTipo = 'ml' | 'un';
export type VendaTipo = 'avista' | 'prazo';
export type VendaStatus = 'pago' | 'pendente';

export interface Essencia {
  id: number;
  nome: string;
  fornecedor: string | null;
  estoque: number;
  estoque_inicial: number;
  custo: number;
  unit: number;
  created_at?: string;
}

export interface Insumo {
  id: number;
  nome: string;
  tipo: InsumoTipo;
  estoque: number;
  estoque_inicial: number;
  custo: number;
  unit: number;
  created_at?: string;
}

export interface ReceitaItem {
  tipo: ItemTipo;
  itemId: number;
  item_id?: number;
  qtd: number;
}

export interface Perfume {
  id: number;
  nome: string;
  marca: string;
  ml: number;
  preco: number;
  receita: ReceitaItem[];
  created_at?: string;
}

export interface Venda {
  id: number;
  perf_id: number;
  qty: number;
  tipo: VendaTipo;
  cliente: string | null;
  data: string;
  status: VendaStatus;
  venc: string | null;
  receita_valor: number;
  custo_valor: number;
  lucro_valor: number;
  created_at?: string;
}

export interface AllItem {
  tipo: ItemTipo;
  id: number;
  nome: string;
  unit: number;
  tu: string;
}
