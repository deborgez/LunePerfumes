-- Adiciona campo de inspiração (nome do perfume/marca que serviu de referência)
-- às tabelas essencias e perfumes já existentes.
-- Rode no SQL Editor do projeto Supabase (não recria tabelas, não apaga dados).

alter table essencias add column if not exists inspiracao text;
alter table perfumes add column if not exists inspiracao text;
