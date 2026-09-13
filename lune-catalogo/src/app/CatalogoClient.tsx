'use client';

import { useMemo, useState } from 'react';
import './catalogo.css';

type Genero = 'feminino' | 'masculino' | 'compartilhavel';
interface Perfume {
  id: number;
  nome: string;
  marca: string | null;
  genero: Genero;
  preco: number;
}

const GENERO_LABEL: Record<Genero, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
  compartilhavel: 'Compartilhável',
};
const GENERO_ORDER: Genero[] = ['feminino', 'masculino', 'compartilhavel'];

type GeneroFiltro = Genero | 'all';

function fmtPreco(v: number) {
  return v.toFixed(2).replace('.', ',');
}

function groupByMarca(perfumes: Perfume[]) {
  const marcas = new Map<string, Perfume[]>();
  for (const p of perfumes) {
    const key = p.marca && p.marca !== 'Não identificada' ? p.marca : 'Outras fragrâncias';
    if (!marcas.has(key)) marcas.set(key, []);
    marcas.get(key)!.push(p);
  }
  return [...marcas.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
}

export default function CatalogoClient({ perfumes }: { perfumes: Perfume[] }) {
  const [q, setQ] = useState('');
  const [activeGenero, setActiveGenero] = useState<GeneroFiltro>('all');

  const counts = useMemo(() => {
    const c: Record<GeneroFiltro, number> = { all: perfumes.length, feminino: 0, masculino: 0, compartilhavel: 0 };
    perfumes.forEach((p) => {
      c[p.genero] = (c[p.genero] || 0) + 1;
    });
    return c;
  }, [perfumes]);

  const term = q.trim().toLowerCase();

  const sections = useMemo(() => {
    return GENERO_ORDER.map((genero) => {
      const doGenero = perfumes
        .filter((p) => p.genero === genero)
        .filter((p) => !term || p.nome.toLowerCase().includes(term) || (p.marca || '').toLowerCase().includes(term))
        .sort((a, b) => {
          const ma = a.marca && a.marca !== 'Não identificada' ? a.marca : 'zzz';
          const mb = b.marca && b.marca !== 'Não identificada' ? b.marca : 'zzz';
          if (ma !== mb) return ma.localeCompare(mb, 'pt-BR');
          return a.nome.localeCompare(b.nome, 'pt-BR');
        });
      return { genero, itens: doGenero, marcas: groupByMarca(doGenero) };
    }).filter((s) => activeGenero === 'all' || activeGenero === s.genero);
  }, [perfumes, term, activeGenero]);

  const anyVisible = sections.some((s) => s.itens.length > 0);

  return (
    <div className="catalogo-page">
      <div className="wrap">
        <header className="top">
          <div className="brandline">
            <span className="wordmark">
              <span className="logo">LUNE</span>
              <span className="sub">Perfumes</span>
            </span>
            <span className="tagline">Catálogo</span>
          </div>
          <p className="subhead">Fragrâncias inspiradas nas grandes casas de perfumaria — {perfumes.length} opções.</p>
          <div className="controls">
            <label className="search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar perfume ou marca…"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <div className="chips" role="group" aria-label="Filtrar por gênero">
              <button className={`chip${activeGenero === 'all' ? ' active' : ''}`} onClick={() => setActiveGenero('all')}>
                Todos <span className="n">{counts.all}</span>
              </button>
              {GENERO_ORDER.map((g) => (
                <button key={g} className={`chip${activeGenero === g ? ' active' : ''}`} onClick={() => setActiveGenero(g)}>
                  {GENERO_LABEL[g]} <span className="n">{counts[g]}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <main>
          {!anyVisible ? (
            <p className="empty-state">Nenhuma fragrância encontrada para essa busca.</p>
          ) : (
            sections.map((sec) =>
              sec.itens.length === 0 ? null : (
                <section key={sec.genero} className={`genero-section g-${sec.genero}`}>
                  <div className="genero-head">
                    <h2>{GENERO_LABEL[sec.genero]}</h2>
                    <span className="genero-count">{sec.itens.length} fragrâncias</span>
                  </div>
                  {sec.marcas.map(([marca, itens]) => (
                    <div key={marca}>
                      <h3 className="brand-name">{marca}</h3>
                      <ul className="item-list">
                        {itens.map((p) => (
                          <li key={p.id} className="item-row">
                            <span className="item-name">{p.nome}</span>
                            <span className="item-price">R$ {fmtPreco(p.preco)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )
            )
          )}
        </main>
      </div>

      <footer>Lune Perfumes · preços sujeitos a alteração sem aviso prévio</footer>
    </div>
  );
}
