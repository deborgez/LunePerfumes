'use client';

import { useState } from 'react';
import { IconFlask, IconPlus, IconEdit, IconTrash, IconRefresh } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Btn, Card, CardHeader, Badge } from '@/components/shared/ui';
import EssenciaModal from '@/components/essencias/EssenciaModal';
import ReporModal from '@/components/shared/ReporModal';
import { fmt, fq } from '@/lib/format';
import type { Essencia, Genero } from '@/lib/types';

const GENERO_LABEL: Record<Genero, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
  compartilhavel: 'Compartilhável',
};
const GENERO_COLOR: Record<Genero, 'red' | 'purple' | 'gray'> = {
  feminino: 'red',
  masculino: 'purple',
  compartilhavel: 'gray',
};

export default function EssenciasPage() {
  const { essencias, deleteEssencia } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Essencia | null>(null);
  const [reporOpen, setReporOpen] = useState(false);
  const [reporItem, setReporItem] = useState<Essencia | null>(null);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(e: Essencia) {
    setEditing(e);
    setModalOpen(true);
  }
  function openRepor(e: Essencia) {
    setReporItem(e);
    setReporOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Excluir esta essência?')) return;
    await deleteEssencia(id);
  }

  return (
    <div>
      <Card>
        <CardHeader
          title="Essências"
          icon={<IconFlask size={17} />}
          action={
            <Btn variant="primary" size="sm" onClick={openNew}>
              <IconPlus size={16} /> Nova
            </Btn>
          }
        />

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-lg border border-[var(--border)] md:block">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Nome', 'Marca', 'Gênero', 'Fornecedor', 'Estoque', 'Custo global', 'Custo/ml', 'Ações'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-[var(--border)] bg-[var(--tbl-head)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-hint)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!essencias.length ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[13px] text-[var(--text-hint)]">
                    <IconFlask size={24} className="mx-auto mb-1.5" />
                    Nenhuma essência
                  </td>
                </tr>
              ) : (
                essencias.map((e) => (
                  <tr key={e.id} className="border-b border-[var(--tbl-border)] last:border-0 hover:bg-[var(--tbl-hover)]">
                    <td className="px-3 py-2.5 text-[var(--text)]">
                      <strong>{e.nome}</strong>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{e.marca || '—'}</td>
                    <td className="px-3 py-2.5">
                      <Badge color={GENERO_COLOR[e.genero]}>{GENERO_LABEL[e.genero]}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{e.fornecedor || '—'}</td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{fq(e.estoque, 'ml')}</td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{fmt(e.custo)}</td>
                    <td className="px-3 py-2.5 text-[var(--text)]">
                      <strong>{fmt(e.unit)}</strong>/ml
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1.5">
                        <Btn size="xs" onClick={() => openRepor(e)}>
                          <IconRefresh size={14} />
                        </Btn>
                        <Btn size="xs" onClick={() => openEdit(e)}>
                          <IconEdit size={14} />
                        </Btn>
                        <Btn size="xs" variant="danger" onClick={() => handleDelete(e.id)}>
                          <IconTrash size={14} />
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden">
          {!essencias.length ? (
            <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhuma essência cadastrada</p>
          ) : (
            essencias.map((e) => (
              <div key={e.id} className="mb-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{e.nome}</div>
                    <div className="mt-[3px] text-xs text-[var(--text-muted)]">
                      {e.marca || 'Sem marca'} · {e.fornecedor || 'Sem fornecedor'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge color="purple">{fmt(e.unit)}/ml</Badge>
                    <Badge color={GENERO_COLOR[e.genero]}>{GENERO_LABEL[e.genero]}</Badge>
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <div>
                    <div className="text-[11px] text-[var(--text-hint)]">Estoque</div>
                    <div className="mt-[1px] text-[13px] font-medium text-[var(--text)]">{fq(e.estoque, 'ml')}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--text-hint)]">Custo global</div>
                    <div className="mt-[1px] text-[13px] font-medium text-[var(--text)]">{fmt(e.custo)}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5 border-t border-[var(--border)] pt-2.5">
                  <Btn size="sm" className="flex-1" onClick={() => openRepor(e)}>
                    <IconRefresh size={14} /> Repor
                  </Btn>
                  <Btn size="sm" className="flex-1" onClick={() => openEdit(e)}>
                    <IconEdit size={14} /> Editar
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleDelete(e.id)}>
                    <IconTrash size={14} />
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <EssenciaModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
      <ReporModal open={reporOpen} onClose={() => setReporOpen(false)} tipo="essencia" item={reporItem} />
    </div>
  );
}
