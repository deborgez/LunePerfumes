-- Lune Perfumes — schema Supabase
-- Rode este script inteiro no SQL Editor de um projeto Supabase novo.

create table if not exists essencias (
  id bigint generated always as identity primary key,
  nome text not null,
  marca text,
  genero text not null default 'compartilhavel' check (genero in ('feminino', 'masculino', 'compartilhavel')),
  inspiracao text,
  fornecedor text,
  estoque numeric not null default 0,
  estoque_inicial numeric not null default 0,
  custo numeric not null default 0,
  unit numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists insumos (
  id bigint generated always as identity primary key,
  nome text not null,
  tipo text not null default 'un' check (tipo in ('ml', 'un')),
  estoque numeric not null default 0,
  estoque_inicial numeric not null default 0,
  custo numeric not null default 0,
  unit numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists perfumes (
  id bigint generated always as identity primary key,
  nome text not null,
  marca text not null,
  genero text not null default 'compartilhavel' check (genero in ('feminino', 'masculino', 'compartilhavel')),
  inspiracao text,
  ml numeric not null,
  preco numeric not null default 0,
  receita jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists clientes (
  id bigint generated always as identity primary key,
  nome text not null,
  telefone text,
  cpf text,
  email text,
  instagram text,
  endereco text,
  created_at timestamptz not null default now()
);

create table if not exists vendas (
  id bigint generated always as identity primary key,
  perf_id bigint not null references perfumes(id) on delete restrict,
  qty numeric not null default 1,
  tipo text not null check (tipo in ('avista', 'prazo')),
  cliente text,
  cliente_id bigint references clientes(id) on delete set null,
  data date not null default current_date,
  status text not null default 'pendente' check (status in ('pago', 'pendente')),
  venc date,
  parcela_num integer,
  parcela_total integer,
  receita_valor numeric not null default 0,
  custo_valor numeric not null default 0,
  lucro_valor numeric not null default 0,
  created_at timestamptz not null default now()
);

-- RLS: app de uso interno acessado só com a anon key (sem login de usuário),
-- então liberamos leitura/escrita total para o role "anon" nessas tabelas.
alter table essencias enable row level security;
alter table insumos enable row level security;
alter table perfumes enable row level security;
alter table clientes enable row level security;
alter table vendas enable row level security;

create policy "anon full access" on essencias for all to anon using (true) with check (true);
create policy "anon full access" on insumos for all to anon using (true) with check (true);
create policy "anon full access" on perfumes for all to anon using (true) with check (true);
create policy "anon full access" on clientes for all to anon using (true) with check (true);
create policy "anon full access" on vendas for all to anon using (true) with check (true);
