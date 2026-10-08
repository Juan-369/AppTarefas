import { Prioridade, Tarefa, Subtarefa } from '../types';
import { dataValida, novoId } from './utils';

export interface DadosFormTarefa {
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  dataLimite: string;
  categoriaId: number | null;
}

export function validarTarefa(d: DadosFormTarefa) {
  const erros: { titulo?: string; dataLimite?: string; categoriaId?: string } = {};
  if (!d.titulo.trim()) erros.titulo = 'O título é obrigatório.';
  else if (d.titulo.trim().length < 3) erros.titulo = 'O título precisa ter ao menos 3 letras.';
  if (d.dataLimite && !dataValida(d.dataLimite)) erros.dataLimite = 'Use uma data válida: DD/MM/AAAA.';
  if (d.categoriaId === null) erros.categoriaId = 'Escolha uma categoria.';
  return erros;
}

export function criarTarefa(d: DadosFormTarefa): Tarefa {
  return {
    id: novoId(),
    titulo: d.titulo.trim(),
    descricao: d.descricao.trim(),
    prioridade: d.prioridade,
    dataLimite: d.dataLimite,
    concluida: false,
    categoriaId: d.categoriaId as number,
  };
}

export function criarSubtarefa(titulo: string, tarefaId: number): Subtarefa {
  return { id: novoId(), titulo: titulo.trim(), concluida: false, tarefaId };
}

export function progressoSubtarefas(subs: Subtarefa[]): number {
  if (subs.length === 0) return 0;
  return subs.filter((s) => s.concluida).length / subs.length;
}
