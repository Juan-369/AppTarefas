export const novoId = () => Date.now() + Math.floor(Math.random() * 1000);


export function mascaraData(texto: string): string {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

export function dataParaObjeto(data: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  if (!m) return null;
  const [, d, mes, a] = m;
  const obj = new Date(Number(a), Number(mes) - 1, Number(d));
  const valida =
    obj.getFullYear() === Number(a) &&
    obj.getMonth() === Number(mes) - 1 &&
    obj.getDate() === Number(d);
  return valida ? obj : null;
}

export function dataValida(data: string): boolean {
  return dataParaObjeto(data) !== null;
}

export function atrasada(data: string, concluida: boolean): boolean {
  if (concluida) return false;
  const obj = dataParaObjeto(data);
  if (!obj) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return obj < hoje;
}

export function saudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? '';
}

export function inicial(nome: string): string {
  return nome.trim().charAt(0).toUpperCase() || '?';
}


export function corTextoSobre(cor: string): string {
  const h = cor.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#1B1A2E' : '#FFFFFF';
}
