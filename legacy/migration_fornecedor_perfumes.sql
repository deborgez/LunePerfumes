-- Adiciona o campo "fornecedor" (origem do catálogo importado: Big Essências / By New York)
-- na tabela perfumes. Rode este script no SQL Editor do Supabase antes de importar o catálogo.

alter table perfumes add column if not exists fornecedor text;
