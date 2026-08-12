-- Adiciona CPF, e-mail, Instagram e endereço à tabela clientes já existente.
-- Rode no SQL Editor do projeto Supabase (não apaga dados existentes).

alter table clientes add column if not exists cpf text;
alter table clientes add column if not exists email text;
alter table clientes add column if not exists instagram text;
alter table clientes add column if not exists endereco text;
