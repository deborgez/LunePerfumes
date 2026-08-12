-- Adiciona tabela de clientes e suporte a venda parcelada.
-- Rode no SQL Editor do projeto Supabase (não apaga dados existentes).

create table if not exists clientes (
  id bigint generated always as identity primary key,
  nome text not null,
  telefone text,
  created_at timestamptz not null default now()
);

alter table clientes enable row level security;
create policy "anon full access" on clientes for all to anon using (true) with check (true);

alter table vendas add column if not exists cliente_id bigint references clientes(id) on delete set null;
alter table vendas add column if not exists parcela_num integer;
alter table vendas add column if not exists parcela_total integer;
