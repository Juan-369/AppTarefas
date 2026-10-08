import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Categoria, Subtarefa, Tarefa } from '../types';
import { chavesDoUsuario, carregar, salvar } from '../storage/storage';
import { categoriasIniciais, criarCategoria } from '../services/categoriaService';
import { criarSubtarefa, criarTarefa, DadosFormTarefa } from '../services/tarefaService';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';

interface DadosCtx {
  carregando: boolean;
  categorias: Categoria[];
  tarefas: Tarefa[];
  subtarefas: Subtarefa[];
  adicionarCategoria: (nome: string, cor: string) => Promise<void>;
  excluirCategoria: (id: number) => Promise<void>;
  adicionarTarefa: (d: DadosFormTarefa) => Promise<void>;
  editarTarefa: (id: number, d: DadosFormTarefa) => Promise<void>;
  excluirTarefa: (id: number) => Promise<void>;
  alternarTarefa: (id: number) => Promise<void>;
  limparConcluidas: () => Promise<void>;
  adicionarSubtarefa: (tarefaId: number, titulo: string) => Promise<void>;
  alternarSubtarefa: (id: number) => Promise<void>;
  excluirSubtarefa: (id: number) => Promise<void>;
}

const Ctx = createContext<DadosCtx>({} as DadosCtx);

export function DadosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const { mostrar } = useFeedback();
  const usuarioId = usuario?.id ?? null;



  const [carregadoPara, setCarregadoPara] = useState<number | null>(null);
  const carregando = usuarioId !== null && carregadoPara !== usuarioId;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [subtarefas, setSubtarefas] = useState<Subtarefa[]>([]);


  useEffect(() => {
    let ativo = true;
    if (usuarioId === null) {
      setCategorias([]);
      setTarefas([]);
      setSubtarefas([]);
      setCarregadoPara(null);
      return;
    }
    const chaves = chavesDoUsuario(usuarioId);
    (async () => {
      const [c, t, s] = await Promise.all([
        carregar<Categoria[]>(chaves.categorias, categoriasIniciais),
        carregar<Tarefa[]>(chaves.tarefas, []),
        carregar<Subtarefa[]>(chaves.subtarefas, []),
      ]);
      if (!ativo) return;
      setCategorias(c);
      setTarefas(t);
      setSubtarefas(s);
      setCarregadoPara(usuarioId);
    })();
    return () => { ativo = false; };
  }, [usuarioId]);

  async function persistir(tipo: 'categorias' | 'tarefas' | 'subtarefas', valor: unknown) {
    if (usuarioId === null) return;
    try {
      await salvar(chavesDoUsuario(usuarioId)[tipo], valor);
    } catch {
      mostrar('Não foi possível salvar no aparelho. Tente novamente.', 'erro');
    }
  }

  const gravarCategorias = async (v: Categoria[]) => { setCategorias(v); await persistir('categorias', v); };
  const gravarTarefas = async (v: Tarefa[]) => { setTarefas(v); await persistir('tarefas', v); };
  const gravarSubs = async (v: Subtarefa[]) => { setSubtarefas(v); await persistir('subtarefas', v); };

  const valor: DadosCtx = {
    carregando, categorias, tarefas, subtarefas,
    adicionarCategoria: (nome, cor) => gravarCategorias([...categorias, criarCategoria(nome, cor)]),
    excluirCategoria: async (id) => {

      const idsTarefas = tarefas.filter((t) => t.categoriaId === id).map((t) => t.id);
      await gravarSubs(subtarefas.filter((s) => !idsTarefas.includes(s.tarefaId)));
      await gravarTarefas(tarefas.filter((t) => t.categoriaId !== id));
      await gravarCategorias(categorias.filter((c) => c.id !== id));
    },
    adicionarTarefa: (d) => gravarTarefas([criarTarefa(d), ...tarefas]),
    editarTarefa: (id, d) =>
      gravarTarefas(
        tarefas.map((t) =>
          t.id === id
            ? { ...t, titulo: d.titulo.trim(), descricao: d.descricao.trim(), prioridade: d.prioridade,
                dataLimite: d.dataLimite, categoriaId: d.categoriaId as number }
            : t
        )
      ),
    excluirTarefa: async (id) => {
      await gravarSubs(subtarefas.filter((s) => s.tarefaId !== id));
      await gravarTarefas(tarefas.filter((t) => t.id !== id));
    },
    alternarTarefa: (id) =>
      gravarTarefas(tarefas.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))),
    limparConcluidas: async () => {
      const ids = tarefas.filter((t) => t.concluida).map((t) => t.id);
      await gravarSubs(subtarefas.filter((s) => !ids.includes(s.tarefaId)));
      await gravarTarefas(tarefas.filter((t) => !t.concluida));
    },
    adicionarSubtarefa: (tarefaId, titulo) => gravarSubs([...subtarefas, criarSubtarefa(titulo, tarefaId)]),
    alternarSubtarefa: (id) =>
      gravarSubs(subtarefas.map((s) => (s.id === id ? { ...s, concluida: !s.concluida } : s))),
    excluirSubtarefa: (id) => gravarSubs(subtarefas.filter((s) => s.id !== id)),
  };

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export const useDados = () => useContext(Ctx);
