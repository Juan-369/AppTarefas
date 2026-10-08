import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVES = {
  usuarios: '@kairolume:usuarios',
  sessao: '@kairolume:sessao',
  tema: '@kairolume:tema',
};


export const chavesDoUsuario = (usuarioId: number) => ({
  categorias: `@kairolume:u${usuarioId}:categorias`,
  tarefas: `@kairolume:u${usuarioId}:tarefas`,
  subtarefas: `@kairolume:u${usuarioId}:subtarefas`,
});


const CHAVES_ANTIGAS = {
  categorias: '@kairolume:categorias',
  tarefas: '@kairolume:tarefas',
  subtarefas: '@kairolume:subtarefas',
};

export async function carregar<T>(chave: string, padrao: T): Promise<T> {
  try {
    const bruto = await AsyncStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

export async function salvar<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function remover(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}



export async function migrarDadosAntigos(usuarioId: number): Promise<void> {
  const novas = chavesDoUsuario(usuarioId);
  for (const tipo of ['categorias', 'tarefas', 'subtarefas'] as const) {
    const bruto = await AsyncStorage.getItem(CHAVES_ANTIGAS[tipo]);
    if (bruto !== null) {
      await AsyncStorage.setItem(novas[tipo], bruto);
      await AsyncStorage.removeItem(CHAVES_ANTIGAS[tipo]);
    }
  }
}
