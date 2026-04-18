/** Funções puras de mês/referência (seguras para import em Client Components). */

/** Fuso usado no app para calendário e filtros (Brasil, sem DST). */
export const TIMEZONE_BR = "America/Sao_Paulo" as const;

/** Referência `YYYY-MM` do mês corrente no calendário de São Paulo (não UTC do servidor). */
export function mesCorrenteUtc(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE_BR,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const mo = parts.find((p) => p.type === "month")?.value;
  if (!y || !mo) return "1970-01";
  return `${y}-${mo.padStart(2, "0")}`;
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
    timeZone: TIMEZONE_BR,
  }).format(new Date(`${p.y}-${String(p.m).padStart(2, "0")}-01T12:00:00.000-03:00`));
}

/** Início e fim do mês civil `m` (1–12) em `y`, no horário de Brasília (-03), como `Date` em UTC. */
export function limitesMesUTC(y: number, m: number): { inicio: Date; fim: Date } {
  const mm = String(m).padStart(2, "0");
  const inicio = new Date(`${y}-${mm}-01T00:00:00.000-03:00`);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const fim = new Date(`${y}-${mm}-${String(lastDay).padStart(2, "0")}T23:59:59.999-03:00`);
  return { inicio, fim };
}
