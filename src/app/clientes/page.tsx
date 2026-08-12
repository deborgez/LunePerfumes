'use client';

import { useState } from 'react';
import { IconUsers, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Btn, Card, CardHeader } from '@/components/shared/ui';
import ClienteModal from '@/components/clientes/ClienteModal';
import type { Cliente } from '@/lib/types';

export default function ClientesPage() {
  const { clientes, deleteCliente } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(c: Cliente) {
    setEditing(c);
    setModalOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Excluir este cliente?')) return;
    await deleteCliente(id);
  }

  return (
    <div>
      <Card>
        <CardHeader
          title="Clientes"
          icon={<IconUsers size={17} />}
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
              {!clientes.length ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-[13px] text-[var(--text-hint)]">
                    <IconUsers size={24} className="mx-auto mb-1.5" />
                    Nenhum cliente
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--tbl-border)] last:border-0 hover:bg-[var(--tbl-hover)]">
                    <td className="px-3 py-2.5 text-[var(--text)]">
                      <strong>{c.nome}</strong>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text)]">{c.telefone || '—'}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1.5">
                        <Btn size="xs" onClick={() => openEdit(c)}>
                          <IconEdit size={14} />
                        </Btn>
                        <Btn size="xs" variant="danger" onClick={() => handleDelete(c.id)}>
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
          {!clientes.length ? (
            <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhum cliente cadastrado</p>
          ) : (
            clientes.map((c) => (
              <div key={c.id} className="mb-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)]">
                <div className="text-sm font-semibold text-[var(--text)]">{c.nome}</div>
                <div className="mt-[3px] text-xs text-[var(--text-muted)]">{c.telefone || 'Sem telefone'}</div>
                <div className="mt-3 flex gap-1.5 border-t border-[var(--border)] pt-2.5">
                  <Btn size="sm" className="flex-1" onClick={() => openEdit(c)}>
                    <IconEdit size={14} /> Editar
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleDelete(c.id)}>
                    <IconTrash size={14} />
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <ClienteModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
