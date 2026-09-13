-- Lançamentos manuais de caixa (entradas e despesas avulsas).
-- Rode este script no SQL Editor do Supabase.

create table if not exists lancamentos (
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('entrada', 'despesa')),
  descricao text,
  valor numeric not null default 0,
  data date not null default current_date,
  created_at timestamptz not null default now()
);

alter table lancamentos enable row level security;
create policy "anon full access" on lancamentos for all to anon using (true) with check (true);
