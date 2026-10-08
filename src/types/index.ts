export type Prioridade = 'Baixa' | 'Média' | 'Alta';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  salt: string;
  senhaHash: string;
}


export type UsuarioLogado = Pick<Usuario, 'id' | 'nome' | 'email'>;

export interface Categoria {
  id: number;
  nome: string;
  cor: string;
}

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  dataLimite: string;
  concluida: boolean;
  categoriaId: number;
}

export interface Subtarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  tarefaId: number;
}
