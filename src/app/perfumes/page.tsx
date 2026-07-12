'use client';

import { useState } from 'react';
import { IconDroplet, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useData } from '@/context/DataContext';
import { Btn, Card, CardHeader, Badge } from '@/components/shared/ui';
import PerfumeModal from '@/components/perfumes/PerfumeModal';
import { custo1 } from '@/lib/business';
import { fmt } from '@/lib/format';
import { GENERO_COLOR, GENERO_LABEL } from '@/lib/genero';
import type { Perfume } from '@/lib/types';

export default function PerfumesPage() {
  const { perfumes, essencias, insumos, deletePerfume } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Perfume | null>(null);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(p: Perfume) {
    setEditing(p);
    setModalOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Excluir este perfume?')) return;
    await deletePerfume(id);
  }

  return (
    <div>
      <Card>
        <CardHeader
          title="Perfumes"
          icon={<IconDroplet size={17} />}
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
                {['Nome', 'Marca', 'Gênero', 'Volume', 'Preço', 'Custo', 'Margem', 'Lucro', 'Ações'].map((h) => (
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
              {!perfumes.length ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[13px] text-[var(--text-hint)]">
                    <IconDroplet size={24} className="mx-auto mb-1.5" />
                    Nenhum perfume
                  </td>
                </tr>
              ) : (
                perfumes.map((p) => {
                  const c = custo1(p, essencias, insumos);
                  const l = p.preco - c;
                  const mg = p.preco > 0 ? Math.round((l / p.preco) * 100) : 0;
                  return (
                    <tr key={p.id} className="border-b border-[var(--tbl-border)] last:border-0 hover:bg-[var(--tbl-hover)]">
                      <td className="px-3 py-2.5 text-[var(--text)]">
                        <strong>{p.nome}</strong>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text)]">{p.marca}</td>
                      <td className="px-3 py-2.5">
                        <Badge color={GENERO_COLOR[p.genero]}>{GENERO_LABEL[p.genero]}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text)]">{p.ml} ml</td>
                      <td className="px-3 py-2.5 text-[var(--text)]">{fmt(p.preco)}</td>
                      <td className="px-3 py-2.5" style={{ color: 'var(--red)' }}>
                        {fmt(c)}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge color={mg >= 30 ? 'green' : mg >= 10 ? 'amber' : 'red'}>{mg}%</Badge>
                      </td>
                      <td className="px-3 py-2.5 font-semibold" style={{ color: l >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {fmt(l)}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          <Btn size="xs" onClick={() => openEdit(p)}>
                            <IconEdit size={14} />
                          </Btn>
                          <Btn size="xs" variant="danger" onClick={() => handleDelete(p.id)}>
                            <IconTrash size={14} />
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden">
          {!perfumes.length ? (
            <p className="py-5 text-center text-[13px] text-[var(--text-hint)]">Nenhum perfume cadastrado</p>
          ) : (
            perfumes.map((p) => {
              const c = custo1(p, essencias, insumos);
              const l = p.preco - c;
              const mg = p.preco > 0 ? Math.round((l / p.preco) * 100) : 0;
              return (
                <div key={p.id} className="mb-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)]">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">{p.nome}</div>
                      <div className="mt-[3px] text-xs text-[var(--text-muted)]">
                        {p.marca} · {p.ml} ml
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge color={mg >= 30 ? 'green' : mg >= 10 ? 'amber' : 'red'}>{mg}% margem</Badge>
                      <Badge color={GENERO_COLOR[p.genero]}>{GENERO_LABEL[p.genero]}</Badge>
                    </div>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Preço venda</div>
                      <div className="mt-[1px] text-[13px] font-medium text-[var(--text)]">{fmt(p.preco)}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Custo produção</div>
                      <div className="mt-[1px] text-[13px] font-medium" style={{ color: 'var(--red)' }}>
                        {fmt(c)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-hint)]">Lucro unit.</div>
                      <div className="mt-[1px] text-[13px] font-medium" style={{ color: l >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {fmt(l)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5 border-t border-[var(--border)] pt-2.5">
                    <Btn size="sm" className="flex-1" onClick={() => openEdit(p)}>
                      <IconEdit size={14} /> Editar
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                      <IconTrash size={14} />
                    </Btn>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <PerfumeModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
