/** Funções puras de mês/referência (seguras para import em Client Components). */

export function mesCorrenteUtc(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function parseMesYYYYMM(mes: string): { y: number; m: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  return { y, m: mo };
}

export function formatMesReferenciaPt(mes: string): string {
  const p = parseMesYYYYMM(mes);
  if (!p) return mes;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(p.y, p.m - 1, 1)));
}

export function limitesMesUTC(y: number, m: number): { inicio: Date; fim: Date } {
  const inicio = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const fim = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
  return { inicio, fim };
}
