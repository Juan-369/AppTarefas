import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { temaClaro, temaEscuro, Tema } from './theme';
import { CHAVES, carregar, salvar } from '../storage/storage';

interface ThemeCtx {
  tema: Tema;
  escuro: boolean;
  alternarTema: () => void;
}

const Ctx = createContext<ThemeCtx>({
  tema: temaClaro,
  escuro: false,
  alternarTema: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const sistema = useColorScheme();
  const [escuro, setEscuro] = useState(sistema === 'dark');


  useEffect(() => {
    let ativo = true;
    carregar<'claro' | 'escuro' | null>(CHAVES.tema, null).then((salvo) => {
      if (ativo && salvo) setEscuro(salvo === 'escuro');
    });
    return () => { ativo = false; };
  }, []);

  const alternarTema = () => {
    const novo = !escuro;
    setEscuro(novo);
    salvar(CHAVES.tema, novo ? 'escuro' : 'claro').catch(() => {});
  };

  return (
    <Ctx.Provider value={{ tema: escuro ? temaEscuro : temaClaro, escuro, alternarTema }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTema = () => useContext(Ctx);
