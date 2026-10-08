import { Usuario } from '../types';
import { gerarSalt, hashSenha, hashesIguais } from './seguranca';
import { novoId } from './utils';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SENHA_MINIMA = 6;

export const normalizarEmail = (email: string) => email.trim().toLowerCase();

function erroEmail(email: string): string | undefined {
  if (!email.trim()) return 'O e-mail é obrigatório.';
  if (!REGEX_EMAIL.test(email.trim())) return 'Digite um e-mail válido, como nome@email.com.';
  return undefined;
}

function erroNome(nome: string): string | undefined {
  const limpo = nome.trim();
  if (!limpo) return 'Informe seu nome.';
  if (limpo.length < 2) return 'Use pelo menos 2 letras.';
  return undefined;
}

export function validarNome(nome: string) {
  const erros: { nome?: string } = {};
  const e = erroNome(nome);
  if (e) erros.nome = e;
  return erros;
}

export function validarLogin(d: { email: string; senha: string }) {
  const erros: { email?: string; senha?: string } = {};
  const e = erroEmail(d.email);
  if (e) erros.email = e;
  if (!d.senha) erros.senha = 'A senha é obrigatória.';
  return erros;
}

export function validarCadastro(d: { nome: string; email: string; senha: string; confirmacao: string }) {
  const erros: { nome?: string; email?: string; senha?: string; confirmacao?: string } = {};
  const en = erroNome(d.nome);
  if (en) erros.nome = en;
  const ee = erroEmail(d.email);
  if (ee) erros.email = ee;
  if (!d.senha) erros.senha = 'A senha é obrigatória.';
  else if (d.senha.length < SENHA_MINIMA) erros.senha = `A senha precisa ter ao menos ${SENHA_MINIMA} caracteres.`;
  if (!d.confirmacao) erros.confirmacao = 'Repita a senha para confirmar.';
  else if (d.confirmacao !== d.senha) erros.confirmacao = 'As senhas não conferem.';
  return erros;
}

export function criarUsuario(nome: string, email: string, senha: string): Usuario {
  const salt = gerarSalt();
  return {
    id: novoId(),
    nome: nome.trim(),
    email: normalizarEmail(email),
    salt,
    senhaHash: hashSenha(senha, salt),
  };
}

export function senhaConfere(usuario: Usuario, senha: string): boolean {
  return hashesIguais(usuario.senhaHash, hashSenha(senha, usuario.salt));
}
