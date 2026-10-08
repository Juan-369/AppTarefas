import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Usuario, UsuarioLogado } from '../types';
import { CHAVES, carregar, migrarDadosAntigos, remover, salvar } from '../storage/storage';
import { criarUsuario, normalizarEmail, senhaConfere } from '../services/authService';

interface AuthCtx {
  carregando: boolean;
  usuario: UsuarioLogado | null;

  entrar: (email: string, senha: string) => Promise<string | null>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<string | null>;
  atualizarNome: (nome: string) => Promise<string | null>;
  sair: () => Promise<void>;
}

const MSG_ARMAZENAMENTO = 'Não foi possível acessar os dados do aparelho. Tente novamente.';

const Ctx = createContext<AuthCtx>({
  carregando: true,
  usuario: null,
  entrar: async () => null,
  cadastrar: async () => null,
  atualizarNome: async () => null,
  sair: async () => {},
});

const publico = (u: Usuario): UsuarioLogado => ({ id: u.id, nome: u.nome, email: u.email });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);


  useEffect(() => {
    let ativo = true;
    (async () => {
      const idSessao = await carregar<number | null>(CHAVES.sessao, null);
      const usuarios = await carregar<Usuario[]>(CHAVES.usuarios, []);
      const encontrado = idSessao !== null ? usuarios.find((u) => u.id === idSessao) : undefined;
      if (!ativo) return;
      setUsuario(encontrado ? publico(encontrado) : null);
      setCarregando(false);
    })();
    return () => { ativo = false; };
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    try {
      const usuarios = await carregar<Usuario[]>(CHAVES.usuarios, []);
      const encontrado = usuarios.find((u) => u.email === normalizarEmail(email));

      if (!encontrado || !senhaConfere(encontrado, senha)) return 'E-mail ou senha incorretos.';
      await salvar(CHAVES.sessao, encontrado.id);
      setUsuario(publico(encontrado));
      return null;
    } catch {
      return MSG_ARMAZENAMENTO;
    }
  }, []);

  const cadastrar = useCallback(async (nome: string, email: string, senha: string) => {
    try {
      const usuarios = await carregar<Usuario[]>(CHAVES.usuarios, []);
      if (usuarios.some((u) => u.email === normalizarEmail(email))) return 'Já existe uma conta com esse e-mail.';
      const novo = criarUsuario(nome, email, senha);
      await salvar(CHAVES.usuarios, [...usuarios, novo]);
      if (usuarios.length === 0) await migrarDadosAntigos(novo.id);
      await salvar(CHAVES.sessao, novo.id);
      setUsuario(publico(novo));
      return null;
    } catch {
      return MSG_ARMAZENAMENTO;
    }
  }, []);

  const atualizarNome = useCallback(
    async (nome: string) => {
      if (!usuario) return null;
      try {
        const usuarios = await carregar<Usuario[]>(CHAVES.usuarios, []);
        const limpo = nome.trim();
        await salvar(CHAVES.usuarios, usuarios.map((u) => (u.id === usuario.id ? { ...u, nome: limpo } : u)));
        setUsuario({ ...usuario, nome: limpo });
        return null;
      } catch {
        return MSG_ARMAZENAMENTO;
      }
    },
    [usuario]
  );

  const sair = useCallback(async () => {
    try {
      await remover(CHAVES.sessao);
    } catch {

    }
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ carregando, usuario, entrar, cadastrar, atualizarNome, sair }),
    [carregando, usuario, entrar, cadastrar, atualizarNome, sair]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
