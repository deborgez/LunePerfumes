'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from './ToastContext';
import * as q from '@/lib/queries';
import { tod } from '@/lib/format';
import type { Cliente, Essencia, Genero, Insumo, Perfume, ReceitaItem, Venda, VendaStatus } from '@/lib/types';

type SyncStatus = 'spin' | 'ok' | 'err';

interface DataContextValue {
  essencias: Essencia[];
  insumos: Insumo[];
  perfumes: Perfume[];
  vendas: Venda[];
  clientes: Cliente[];
  syncStatus: SyncStatus;
  syncMsg: string;
  loading: boolean;
  loadAll: () => Promise<void>;

  saveEssencia: (id: number | null, body: Omit<Essencia, 'id' | 'created_at'>) => Promise<boolean>;
  deleteEssencia: (id: number) => Promise<void>;

  saveInsumo: (id: number | null, body: Omit<Insumo, 'id' | 'created_at'>) => Promise<boolean>;
  deleteInsumo: (id: number) => Promise<void>;

  reporEstoque: (
    tipo: 'essencia' | 'insumo',
    id: number,
    addQ: number,
    novoCusto: number
  ) => Promise<void>;

  savePerfume: (
    id: number | null,
    body: { nome: string; marca: string; genero: Genero; inspiracao: string; ml: number; preco: number; receita: ReceitaItem[] }
  ) => Promise<boolean>;
  deletePerfume: (id: number) => Promise<void>;

  saveCliente: (id: number | null, body: Omit<Cliente, 'id' | 'created_at'>) => Promise<boolean>;
  deleteCliente: (id: number) => Promise<void>;

  vender: (params: {
    perfId: number;
    qty: number;
    tipo: 'avista' | 'prazo';
    cliente: string;
    clienteId: number | null;
    venc: string;
    parcelado: boolean;
    parcelas: number;
  }) => Promise<boolean>;
  baixarVenda: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [essencias, setEssencias] = useState<Essencia[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('spin');
  const [syncMsg, setSyncMsg] = useState('Conectando...');
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setSyncStatus('spin');
    setSyncMsg('Sincronizando...');
    try {
      const [ess, ins, perf, vend, cli] = await Promise.all([
        q.getEssencias(),
        q.getInsumos(),
        q.getPerfumes(),
        q.getVendas(),
        q.getClientes(),
      ]);
      setEssencias(ess);
      setInsumos(ins);
      setPerfumes(perf);
      setVendas(vend);
      setClientes(cli);
      setSyncStatus('ok');
      setSyncMsg('Sincronizado');
      setLoading(false);
    } catch {
      setSyncStatus('err');
      setSyncMsg('Erro de conexão');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadAll();
  }, [loadAll]);

  async function saveEssencia(id: number | null, body: Omit<Essencia, 'id' | 'created_at'>) {
    try {
      if (id) {
        const r = await q.updateEssencia(id, body);
        setEssencias((prev) => prev.map((x) => (x.id === id ? r : x)));
        toast('Essência atualizada!', 'ok');
      } else {
        const r = await q.createEssencia(body);
        setEssencias((prev) => [...prev, r]);
        toast('Essência cadastrada!', 'ok');
      }
      return true;
    } catch (e) {
      toast('Erro: ' + (e as Error).message, 'err');
      return false;
    }
  }

  async function deleteEssenciaFn(id: number) {
    try {
      await q.deleteEssencia(id);
      setEssencias((prev) => prev.filter((x) => x.id !== id));
      toast('Removida');
    } catch {
      toast('Erro', 'err');
    }
  }

  async function saveInsumo(id: number | null, body: Omit<Insumo, 'id' | 'created_at'>) {
    try {
      if (id) {
        const r = await q.updateInsumo(id, body);
        setInsumos((prev) => prev.map((x) => (x.id === id ? r : x)));
        toast('Insumo atualizado!', 'ok');
      } else {
        const r = await q.createInsumo(body);
        setInsumos((prev) => [...prev, r]);
        toast('Insumo cadastrado!', 'ok');
      }
      return true;
    } catch (e) {
      toast('Erro: ' + (e as Error).message, 'err');
      return false;
    }
  }

  async function deleteInsumoFn(id: number) {
    try {
      await q.deleteInsumo(id);
      setInsumos((prev) => prev.filter((x) => x.id !== id));
      toast('Removido');
    } catch {
      toast('Erro', 'err');
    }
  }

  async function reporEstoque(tipo: 'essencia' | 'insumo', id: number, addQ: number, novoCusto: number) {
    const tabela = tipo === 'essencia' ? 'essencias' : 'insumos';
    const lista = tipo === 'essencia' ? essencias : insumos;
    const item = lista.find((x) => x.id === id);
    if (!item) return;
    const nEst = item.estoque + (addQ || 0);
    const nCstF = novoCusto > 0 ? novoCusto : item.custo;
    const nUnit = nEst > 0 ? nCstF / nEst : 0;
    try {
      const r = await q.repor(tabela, id, { estoque: nEst, custo: nCstF, unit: nUnit });
      if (tipo === 'essencia') {
        setEssencias((prev) => prev.map((x) => (x.id === id ? (r as Essencia) : x)));
      } else {
        setInsumos((prev) => prev.map((x) => (x.id === id ? (r as Insumo) : x)));
      }
      toast('Estoque atualizado!', 'ok');
    } catch {
      toast('Erro', 'err');
    }
  }

  async function savePerfume(
    id: number | null,
    body: { nome: string; marca: string; genero: Genero; inspiracao: string; ml: number; preco: number; receita: ReceitaItem[] }
  ) {
    try {
      if (id) {
        const r = await q.updatePerfume(id, body);
        setPerfumes((prev) => prev.map((x) => (x.id === id ? r : x)));
        toast('Perfume atualizado!', 'ok');
      } else {
        const r = await q.createPerfume(body);
        setPerfumes((prev) => [...prev, r]);
        toast('Perfume cadastrado!', 'ok');
      }
      return true;
    } catch (e) {
      toast('Erro: ' + (e as Error).message, 'err');
      return false;
    }
  }

  async function deletePerfumeFn(id: number) {
    try {
      await q.deletePerfume(id);
      setPerfumes((prev) => prev.filter((x) => x.id !== id));
      toast('Removido');
    } catch {
      toast('Erro', 'err');
    }
  }

  async function saveCliente(id: number | null, body: Omit<Cliente, 'id' | 'created_at'>) {
    try {
      if (id) {
        const r = await q.updateCliente(id, body);
        setClientes((prev) => prev.map((x) => (x.id === id ? r : x)));
        toast('Cliente atualizado!', 'ok');
      } else {
        const r = await q.createCliente(body);
        setClientes((prev) => [...prev, r]);
        toast('Cliente cadastrado!', 'ok');
      }
      return true;
    } catch (e) {
      toast('Erro: ' + (e as Error).message, 'err');
      return false;
    }
  }

  async function deleteClienteFn(id: number) {
    try {
      await q.deleteCliente(id);
      setClientes((prev) => prev.filter((x) => x.id !== id));
      toast('Removido');
    } catch {
      toast('Erro', 'err');
    }
  }

  async function vender(params: {
    perfId: number;
    qty: number;
    tipo: 'avista' | 'prazo';
    cliente: string;
    clienteId: number | null;
    venc: string;
    parcelado: boolean;
    parcelas: number;
  }) {
    const { perfId, qty, tipo, cliente, clienteId, venc, parcelado, parcelas } = params;
    const p = perfumes.find((x) => x.id === perfId);
    if (!p) return false;
    // O custo da receita não é mais deduzido automaticamente na venda — o valor
    // contabilizado é a receita bruta. Custos entram separadamente no Caixa.
    const rv = p.preco * qty;
    const numParcelas = tipo === 'prazo' && parcelado && parcelas > 1 ? parcelas : 1;

    try {
      let bodies: q.VendaInsert[];
      if (numParcelas > 1) {
        const totalCents = Math.round(rv * 100);
        const baseCents = Math.floor(totalCents / numParcelas);
        const remainderCents = totalCents - baseCents * numParcelas;
        const vencBase = new Date(venc + 'T00:00:00');
        bodies = Array.from({ length: numParcelas }, (_, i) => {
          const cents = baseCents + (i === 0 ? remainderCents : 0);
          const d = new Date(vencBase);
          d.setDate(d.getDate() + 30 * i);
          return {
            perf_id: perfId,
            qty,
            tipo,
            cliente: cliente || '',
            cliente_id: clienteId,
            data: tod(),
            status: 'pendente',
            venc: d.toISOString().split('T')[0],
            parcela_num: i + 1,
            parcela_total: numParcelas,
            receita_valor: cents / 100,
            custo_valor: 0,
            lucro_valor: cents / 100,
          };
        });
      } else {
        bodies = [
          {
            perf_id: perfId,
            qty,
            tipo,
            cliente: cliente || '',
            cliente_id: clienteId,
            data: tod(),
            status: tipo === 'avista' ? 'pago' : 'pendente',
            venc: venc || null,
            parcela_num: null,
            parcela_total: null,
            receita_valor: rv,
            custo_valor: 0,
            lucro_valor: rv,
          },
        ];
      }

      const vrs = await q.createVendas(bodies);
      setVendas((prev) => [...vrs, ...prev]);

      const rec = Array.isArray(p.receita) ? p.receita : JSON.parse((p.receita as unknown as string) || '[]');
      for (const r of rec) {
        const itemId = r.itemId ?? r.item_id;
        const lista = r.tipo === 'essencia' ? essencias : insumos;
        const it = lista.find((x) => x.id === itemId);
        if (it) {
          const ne = Math.max(0, it.estoque - r.qtd * qty);
          await q.patchEstoque(r.tipo === 'essencia' ? 'essencias' : 'insumos', it.id, ne);
          if (r.tipo === 'essencia') {
            setEssencias((prev) => prev.map((x) => (x.id === it.id ? { ...x, estoque: ne } : x)));
          } else {
            setInsumos((prev) => prev.map((x) => (x.id === it.id ? { ...x, estoque: ne } : x)));
          }
        }
      }
      toast(tipo === 'avista' ? 'Venda realizada! ✓' : numParcelas > 1 ? `Venda parcelada em ${numParcelas}x registrada!` : 'Venda a prazo registrada!', 'ok');
      return true;
    } catch (e) {
      toast('Erro: ' + (e as Error).message, 'err');
      return false;
    }
  }

  async function baixarVenda(id: number) {
    try {
      const status: VendaStatus = 'pago';
      await q.updateVendaStatus(id, status);
      setVendas((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      toast('Recebido! Caixa atualizado.', 'ok');
    } catch {
      toast('Erro', 'err');
    }
  }

  return (
    <DataContext.Provider
      value={{
        essencias,
        insumos,
        perfumes,
        vendas,
        clientes,
        syncStatus,
        syncMsg,
        loading,
        loadAll,
        saveEssencia,
        deleteEssencia: deleteEssenciaFn,
        saveInsumo,
        deleteInsumo: deleteInsumoFn,
        reporEstoque,
        savePerfume,
        deletePerfume: deletePerfumeFn,
        saveCliente,
        deleteCliente: deleteClienteFn,
        vender,
        baixarVenda,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
