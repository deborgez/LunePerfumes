'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from './ToastContext';
import * as q from '@/lib/queries';
import { custo1 } from '@/lib/business';
import { tod } from '@/lib/format';
import type { Essencia, Insumo, Perfume, ReceitaItem, Venda, VendaStatus } from '@/lib/types';

type SyncStatus = 'spin' | 'ok' | 'err';

interface DataContextValue {
  essencias: Essencia[];
  insumos: Insumo[];
  perfumes: Perfume[];
  vendas: Venda[];
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
    body: { nome: string; marca: string; ml: number; preco: number; receita: ReceitaItem[] }
  ) => Promise<boolean>;
  deletePerfume: (id: number) => Promise<void>;

  vender: (params: {
    perfId: number;
    qty: number;
    tipo: 'avista' | 'prazo';
    cliente: string;
    venc: string;
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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('spin');
  const [syncMsg, setSyncMsg] = useState('Conectando...');
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setSyncStatus('spin');
    setSyncMsg('Sincronizando...');
    try {
      const [ess, ins, perf, vend] = await Promise.all([
        q.getEssencias(),
        q.getInsumos(),
        q.getPerfumes(),
        q.getVendas(),
      ]);
      setEssencias(ess);
      setInsumos(ins);
      setPerfumes(perf);
      setVendas(vend);
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
    const nUnit = nCstF / nEst;
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
    body: { nome: string; marca: string; ml: number; preco: number; receita: ReceitaItem[] }
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

  async function vender(params: {
    perfId: number;
    qty: number;
    tipo: 'avista' | 'prazo';
    cliente: string;
    venc: string;
  }) {
    const { perfId, qty, tipo, cliente, venc } = params;
    const p = perfumes.find((x) => x.id === perfId);
    if (!p) return false;
    const c = custo1(p, essencias, insumos) * qty;
    const rv = p.preco * qty;
    const lv = rv - c;
    try {
      const vr = await q.createVenda({
        perf_id: perfId,
        qty,
        tipo,
        cliente: cliente || '',
        data: tod(),
        status: tipo === 'avista' ? 'pago' : 'pendente',
        venc: venc || null,
        receita_valor: rv,
        custo_valor: c,
        lucro_valor: lv,
      });
      setVendas((prev) => [vr, ...prev]);

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
      toast(tipo === 'avista' ? 'Venda realizada! ✓' : 'Venda a prazo registrada!', 'ok');
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
