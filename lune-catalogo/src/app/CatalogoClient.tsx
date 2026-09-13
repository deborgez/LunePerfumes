'use client';

import { useMemo, useState } from 'react';

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
      <style>{`
        .catalogo-page {
          --bg: #f7f4ee;
          --surface: #ffffff;
          --surface-2: #f1ece2;
          --ink: #211e19;
          --muted: #8b8172;
          --line: #e7e1d4;
          --accent: #6e5b94;
          --accent-soft: #ede8f5;
          --accent-ink: #3c3160;
          --fem: #a8695a;
          --masc: #3f5866;
          --unis: #8a7434;
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font-work-sans), Arial, sans-serif;
          min-height: 100dvh;
        }
        @media (prefers-color-scheme: dark) {
          .catalogo-page {
            --bg: #16151a;
            --surface: #1e1c24;
            --surface-2: #26232c;
            --ink: #ece7dc;
            --muted: #a19a8c;
            --line: #322f3a;
            --accent: #b3a2de;
            --accent-soft: #2b2438;
            --accent-ink: #e4dcfa;
            --fem: #d9a695;
            --masc: #8fb0c0;
            --unis: #cbb35f;
          }
        }
        .catalogo-page .wrap { max-width: 760px; margin: 0 auto; padding: 0 20px 80px; }
        .catalogo-page header.top {
          position: sticky; top: 0; z-index: 20; background: var(--bg);
          padding: 28px 0 16px; border-bottom: 1px solid var(--line);
        }
        .catalogo-page .brandline { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
        .catalogo-page .wordmark { display: inline-flex; align-items: baseline; gap: 8px; }
        .catalogo-page .wordmark .logo { font-family: 'Panton', var(--font-work-sans), Arial, sans-serif; font-weight: 700; font-size: 28px; letter-spacing: 0.02em; text-transform: uppercase; }
        .catalogo-page .wordmark .sub { font-weight: 700; font-size: 15px; color: var(--muted); letter-spacing: 0.02em; }
        .catalogo-page .tagline { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.09em; }
        .catalogo-page .subhead { color: var(--muted); font-size: 14px; margin: 2px 0 16px; }
        .catalogo-page .controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .catalogo-page .search { flex: 1 1 220px; display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 9px 12px; }
        .catalogo-page .search svg { flex: none; color: var(--muted); }
        .catalogo-page .search input { border: none; outline: none; background: transparent; color: var(--ink); font-family: var(--font-work-sans), sans-serif; font-size: 14px; width: 100%; }
        .catalogo-page .search input::placeholder { color: var(--muted); }
        .catalogo-page .chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .catalogo-page .chip { font-family: var(--font-work-sans), sans-serif; font-size: 12.5px; font-weight: 500; padding: 8px 13px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--muted); cursor: pointer; transition: background 0.15s, color 0.15s, border-color 0.15s; white-space: nowrap; }
        .catalogo-page .chip:hover { border-color: var(--accent); }
        .catalogo-page .chip.active { background: var(--accent); border-color: var(--accent); color: white; }
        .catalogo-page .chip .n { opacity: 0.75; font-variant-numeric: tabular-nums; margin-left: 4px; }
        .catalogo-page main { padding-top: 24px; }
        .catalogo-page .genero-section { margin-bottom: 40px; }
        .catalogo-page .genero-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid var(--ink); }
        .catalogo-page .genero-head h2 { font-family: var(--font-fraunces), Georgia, serif; font-weight: 600; font-size: 26px; margin: 0; text-wrap: balance; }
        .catalogo-page .genero-count { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
        .catalogo-page .g-feminino .genero-head { border-bottom-color: var(--fem); }
        .catalogo-page .g-masculino .genero-head { border-bottom-color: var(--masc); }
        .catalogo-page .g-compartilhavel .genero-head { border-bottom-color: var(--unis); }
        .catalogo-page .brand-name { font-family: var(--font-work-sans), sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--accent-ink); background: var(--accent-soft); display: inline-block; padding: 3px 9px; border-radius: 5px; margin: 18px 0 6px; }
        .catalogo-page .item-list { list-style: none; margin: 0; padding: 0; }
        .catalogo-page .item-row { display: flex; align-items: baseline; gap: 10px; padding: 9px 4px; border-bottom: 1px solid var(--line); }
        .catalogo-page .item-row:last-child { border-bottom: none; }
        .catalogo-page .item-row:hover { background: var(--surface-2); margin: 0 -8px; padding: 9px 8px; border-radius: 6px; }
        .catalogo-page .item-name { flex: 1; font-size: 14.5px; font-weight: 500; }
        .catalogo-page .item-price { font-size: 14px; font-variant-numeric: tabular-nums; color: var(--muted); white-space: nowrap; }
        .catalogo-page .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 14px; }
        .catalogo-page footer { max-width: 760px; margin: 0 auto; padding: 24px 20px 40px; text-align: center; color: var(--muted); font-size: 12px; }
        @media (max-width: 480px) {
          .catalogo-page .wordmark .logo { font-size: 24px; }
          .catalogo-page .wordmark .sub { font-size: 13px; }
          .catalogo-page .genero-head h2 { font-size: 22px; }
        }
      `}</style>

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
