import type { Genero } from './types';

export const GENERO_LABEL: Record<Genero, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
  compartilhavel: 'Compartilhável',
};

export const GENERO_COLOR: Record<Genero, 'red' | 'purple' | 'gray'> = {
  feminino: 'red',
  masculino: 'purple',
  compartilhavel: 'gray',
};

export const GENEROS: Genero[] = ['feminino', 'masculino', 'compartilhavel'];
