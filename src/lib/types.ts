export type ItemTipo = 'essencia' | 'insumo';
export type InsumoTipo = 'ml' | 'un';
export type VendaTipo = 'avista' | 'prazo';
export type VendaStatus = 'pago' | 'pendente';
export type Genero = 'feminino' | 'masculino' | 'compartilhavel';

export interface Essencia {
  id: number;
  nome: string;
  marca: string | null;
  genero: Genero;
  inspiracao: string | null;
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
  genero: Genero;
  inspiracao: string | null;
  fornecedor: string | null;
  ml: number;
  preco: number;
  receita: ReceitaItem[];
  created_at?: string;
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string | null;
  cpf: string | null;
  email: string | null;
  instagram: string | null;
  endereco: string | null;
  created_at?: string;
}

export interface Venda {
  id: number;
  perf_id: number;
  qty: number;
  tipo: VendaTipo;
  cliente: string | null;
  cliente_id: number | null;
  data: string;
  status: VendaStatus;
  venc: string | null;
  parcela_num: number | null;
  parcela_total: number | null;
  receita_valor: number;
  custo_valor: number;
  lucro_valor: number;
  created_at?: string;
}

export type LancamentoTipo = 'entrada' | 'despesa';

export interface Lancamento {
  id: number;
  tipo: LancamentoTipo;
  descricao: string | null;
  valor: number;
  data: string;
  created_at?: string;
}

export interface AllItem {
  tipo: ItemTipo;
  id: number;
  nome: string;
  unit: number;
  tu: string;
}
