create table if not exists vendedores (
  id bigint generated always as identity primary key,
  nome text not null,
  telefone text,
  created_at timestamptz not null default now()
);

alter table vendas add column if not exists vendedor text;
alter table vendas add column if not exists vendedor_id bigint references vendedores(id) on delete set null;

alter table vendedores enable row level security;
create policy "anon full access" on vendedores for all to anon using (true) with check (true);
