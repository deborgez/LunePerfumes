'use client';

import { useState } from 'react';
import { IconBox, IconPlus, IconEdit, IconTrash, IconRefresh } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Btn, Card, CardHeader, Badge } from '@/components/shared/ui';
import InsumoModal from '@/components/insumos/InsumoModal';
import ReporModal from '@/components/shared/ReporModal';
import { fmt, fq } from '@/lib/format';
import type { Insumo } from '@/lib/types';

export default function InsumosPage() {
  const { insumos, deleteInsumo } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Insumo | null>(null);
  const [reporOpen, setReporOpen] = useState(false);
  const [reporItem, setReporItem] = useState<Insumo | null>(null);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(i: Insumo) {
    setEditing(i);
    setModalOpen(true);
  }
  function openRepor(i: Insumo) {
    setReporItem(i);
    setReporOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Excluir este insumo?')) return;
    await deleteInsumo(id);
  }

  return (
    <div>
      <Card>
        <CardHeader
          title="Insumos"
          icon={<IconBox size={17} />}
          action={
            <Btn variant="primary" size="sm" onClick={openNew}>
              <IconPlus size={16} /> Novo
            </Btn>
          }
        />

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-lg border border-[var(--border)] md:block">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Nome', 'Tipo', 'Estoque', 'Custo global', 'Custo unit.', 'Ações'].map((h) => (
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
              {!insumos.length ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[13px] text-[var(--text-hint)]">
                    <IconBox size={24} className="mx-auto mb-1.5" />
                    Nenhum insumo
                  </td>
                </tr>
              ) : (
                insumos.map((i) => (
                  <tr key={i.id} className="border-b border-[var(--tbl-border)] last:border-0 hover:bg-[var(--tbl-hover)]">
                    <td className="px-3 py-2.5 text-[var(--text)]">
                      <strong>{i.nome}</strong>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge color={i.tipo === 'ml' ? 'purple' : 'gray'}>{i.tipo}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{fq(i.estoque, i.tipo)}</td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{fmt(i.custo)}</td>
                    <td className="px-3 py-2.5 text-[var(--text)]">
                      <strong>{fmt(i.unit)}</strong>/{i.tipo}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1.5">
                        <Btn size="xs" onClick={() => openRepor(i)}>
                          <IconRefresh size={14} />
                        </Btn>
                        <Btn size="xs" onClick={() => openEdit(i)}>
                          <IconEdit size={14} />
                        </Btn>
                        <Btn size="xs" variant="danger" onClick={() => handleDelete(i.id)}>
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
          {!insumos.length ? (
            <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhum insumo cadastrado</p>
          ) : (
            insumos.map((i) => (
              <div key={i.id} className="mb-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{i.nome}</div>
                    <div className="mt-[3px]">
                      <Badge color={i.tipo === 'ml' ? 'purple' : 'gray'}>{i.tipo}</Badge>
                    </div>
                  </div>
                  <Badge color="gray">
                    {fmt(i.unit)}/{i.tipo}
                  </Badge>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <div>
                    <div className="text-[11px] text-[var(--text-hint)]">Estoque</div>
                    <div className="mt-[1px] text-[13px] font-medium text-[var(--text)]">{fq(i.estoque, i.tipo)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--text-hint)]">Custo global</div>
                    <div className="mt-[1px] text-[13px] font-medium text-[var(--text)]">{fmt(i.custo)}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5 border-t border-[var(--border)] pt-2.5">
                  <Btn size="sm" className="flex-1" onClick={() => openRepor(i)}>
                    <IconRefresh size={14} /> Repor
                  </Btn>
                  <Btn size="sm" className="flex-1" onClick={() => openEdit(i)}>
                    <IconEdit size={14} /> Editar
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleDelete(i.id)}>
                    <IconTrash size={14} />
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <InsumoModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
      <ReporModal open={reporOpen} onClose={() => setReporOpen(false)} tipo="insumo" item={reporItem} />
    </div>
  );
}
