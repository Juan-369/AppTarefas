import { Categoria } from '../types';
import { novoId } from './utils';

export const categoriasIniciais: Categoria[] = [
  { id: 1, nome: 'Estudos', cor: '#4F6BFF' },
  { id: 2, nome: 'Casa', cor: '#20B39A' },
  { id: 3, nome: 'Trabalho', cor: '#7C5CFC' },
];

export function validarCategoria(nome: string, existentes: Categoria[]) {
  const erros: { nome?: string } = {};
  const limpo = nome.trim();
  if (!limpo) erros.nome = 'O nome da categoria é obrigatório.';
  else if (limpo.length < 2) erros.nome = 'Use pelo menos 2 letras.';
  else if (existentes.some((c) => c.nome.toLowerCase() === limpo.toLowerCase()))
    erros.nome = 'Já existe uma categoria com esse nome.';
  return erros;
}

export function criarCategoria(nome: string, cor: string): Categoria {
  return { id: novoId(), nome: nome.trim(), cor };
}
