-- Adiciona campos de marca e gênero à tabela essencias já existente.
-- Rode no SQL Editor do projeto Supabase (não recria a tabela, não apaga dados).

alter table essencias add column if not exists marca text;
alter table essencias add column if not exists genero text not null default 'compartilhavel';
alter table essencias add constraint essencias_genero_check check (genero in ('feminino', 'masculino', 'compartilhavel'));
