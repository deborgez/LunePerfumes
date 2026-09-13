'use client';

import { useState } from 'react';
import { IconUserStar, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Btn, Card, CardHeader, formatPhoneBR } from '@/components/shared/ui';
import VendedorModal from '@/components/vendedores/VendedorModal';
import type { Vendedor } from '@/lib/types';

export default function VendedoresPage() {
  const { vendedores, deleteVendedor } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vendedor | null>(null);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(v: Vendedor) {
    setEditing(v);
    setModalOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Excluir este vendedor?')) return;
    await deleteVendedor(id);
  }

  return (
    <div>
      <Card>
        <CardHeader
          title="Vendedores"
          icon={<IconUserStar size={17} />}
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
                {['Nome', 'Telefone', 'Ações'].map((h) => (
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
              {!vendedores.length ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-[13px] text-[var(--text-hint)]">
                    <IconUserStar size={24} className="mx-auto mb-1.5" />
                    Nenhum vendedor
                  </td>
                </tr>
              ) : (
                vendedores.map((v) => (
                  <tr key={v.id} className="border-b border-[var(--tbl-border)] last:border-0 hover:bg-[var(--tbl-hover)]">
                    <td className="px-3 py-2.5 text-[var(--text)]">
                      <strong>{v.nome}</strong>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{v.telefone ? formatPhoneBR(v.telefone) : '—'}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1.5">
                        <Btn size="xs" onClick={() => openEdit(v)}>
                          <IconEdit size={14} />
                        </Btn>
                        <Btn size="xs" variant="danger" onClick={() => handleDelete(v.id)}>
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
          {!vendedores.length ? (
            <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhum vendedor cadastrado</p>
          ) : (
            vendedores.map((v) => (
              <div key={v.id} className="mb-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)]">
                <div className="text-sm font-semibold text-[var(--text)]">{v.nome}</div>
                <div className="mt-[3px] text-xs text-[var(--text-muted)]">{v.telefone ? formatPhoneBR(v.telefone) : 'Sem telefone'}</div>
                <div className="mt-3 flex gap-1.5 border-t border-[var(--border)] pt-2.5">
                  <Btn size="sm" className="flex-1" onClick={() => openEdit(v)}>
                    <IconEdit size={14} /> Editar
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleDelete(v.id)}>
                    <IconTrash size={14} />
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <VendedorModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
