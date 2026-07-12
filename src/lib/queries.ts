import { supabase } from './supabase';
import type { Essencia, Genero, Insumo, Perfume, ReceitaItem, Venda, VendaStatus } from './types';

export async function getEssencias(): Promise<Essencia[]> {
  const { data, error } = await supabase.from('essencias').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}
export async function getInsumos(): Promise<Insumo[]> {
  const { data, error } = await supabase.from('insumos').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}
export async function getPerfumes(): Promise<Perfume[]> {
  const { data, error } = await supabase.from('perfumes').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}
export async function getVendas(): Promise<Venda[]> {
  const { data, error } = await supabase.from('vendas').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createEssencia(body: Omit<Essencia, 'id' | 'created_at'>): Promise<Essencia> {
  const { data, error } = await supabase.from('essencias').insert(body).select();
  if (error) throw error;
  return data![0];
}
export async function updateEssencia(id: number, body: Partial<Essencia>): Promise<Essencia> {
  const { data, error } = await supabase.from('essencias').update(body).eq('id', id).select();
  if (error) throw error;
  return data![0];
}
export async function deleteEssencia(id: number): Promise<void> {
  const { error } = await supabase.from('essencias').delete().eq('id', id);
  if (error) throw error;
}

export async function createInsumo(body: Omit<Insumo, 'id' | 'created_at'>): Promise<Insumo> {
  const { data, error } = await supabase.from('insumos').insert(body).select();
  if (error) throw error;
  return data![0];
}
export async function updateInsumo(id: number, body: Partial<Insumo>): Promise<Insumo> {
  const { data, error } = await supabase.from('insumos').update(body).eq('id', id).select();
  if (error) throw error;
  return data![0];
}
export async function deleteInsumo(id: number): Promise<void> {
  const { error } = await supabase.from('insumos').delete().eq('id', id);
  if (error) throw error;
}

export async function createPerfume(body: {
  nome: string;
  marca: string;
  genero: Genero;
  ml: number;
  preco: number;
  receita: ReceitaItem[];
}): Promise<Perfume> {
  const { data, error } = await supabase.from('perfumes').insert(body).select();
  if (error) throw error;
  return data![0];
}
export async function updatePerfume(
  id: number,
  body: { nome: string; marca: string; genero: Genero; ml: number; preco: number; receita: ReceitaItem[] }
): Promise<Perfume> {
  const { data, error } = await supabase.from('perfumes').update(body).eq('id', id).select();
  if (error) throw error;
  return data![0];
}
export async function deletePerfume(id: number): Promise<void> {
  const { error } = await supabase.from('perfumes').delete().eq('id', id);
  if (error) throw error;
}

export async function createVenda(body: {
  perf_id: number;
  qty: number;
  tipo: string;
  cliente: string;
  data: string;
  status: string;
  venc: string | null;
  receita_valor: number;
  custo_valor: number;
  lucro_valor: number;
}): Promise<Venda> {
  const { data, error } = await supabase.from('vendas').insert(body).select();
  if (error) throw error;
  return data![0];
}
export async function updateVendaStatus(id: number, status: VendaStatus): Promise<void> {
  const { error } = await supabase.from('vendas').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function patchEstoque(
  tabela: 'essencias' | 'insumos',
  id: number,
  estoque: number
): Promise<void> {
  const { error } = await supabase.from(tabela).update({ estoque }).eq('id', id);
  if (error) throw error;
}

export async function repor(
  tabela: 'essencias' | 'insumos',
  id: number,
  body: { estoque: number; custo: number; unit: number }
): Promise<Essencia | Insumo> {
  const { data, error } = await supabase.from(tabela).update(body).eq('id', id).select();
  if (error) throw error;
  return data![0];
}
