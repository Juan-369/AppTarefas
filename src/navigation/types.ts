export type RootStackParamList = {

  Login: undefined;
  Cadastro: undefined;

  Inicio: undefined;
  ListaTarefas: { categoriaId?: number } | undefined;
  FormTarefa: { tarefaId?: number } | undefined;
  DetalhesTarefa: { tarefaId: number };
  Categorias: undefined;
  FormCategoria: undefined;
  Perfil: undefined;
};
