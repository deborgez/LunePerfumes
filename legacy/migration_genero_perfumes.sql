-- Adiciona campo de gênero à tabela perfumes já existente.
-- Rode no SQL Editor do projeto Supabase (não recria a tabela, não apaga dados).

alter table perfumes add column if not exists genero text not null default 'compartilhavel';
alter table perfumes add constraint perfumes_genero_check check (genero in ('feminino', 'masculino', 'compartilhavel'));
