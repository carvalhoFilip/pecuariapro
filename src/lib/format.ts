import { parseMesYYYYMM } from "@/lib/mes-calculo";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatBRL(value: number): string {
  return money.format(value);
}

export function formatDataLonga(d: Date): string {
  return longDate.format(d);
}

/** Ex.: "Domingo, 12 de abril de 2026" */
export function formatDataSemanaLonga(hoje: Date = new Date()): string {
  const s = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(hoje);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ex.: "12 abr" */
export function formatDataCurta(d: Date): string {
  const dia = d.getDate();
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(d)
    .replace(/\./g, "")
    .toLowerCase();
  return `${dia} ${mes}`;
}

/** Nome do mês em minúsculas (referência `YYYY-MM`, UTC). */
export function formatMesNomeLowerPt(mes: string): string {
  const p = parseMesYYYYMM(mes);
  if (!p) return "mês anterior";
  return new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" })
    .format(new Date(Date.UTC(p.y, p.m - 1, 1)))
    .toLowerCase();
}

export function formatArrobas(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const MESES_ABREV_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

/** Ex.: "12 abr 2026" — sem Intl (consistente SSR/cliente). */
export function formatDataDiaMesAnoPt(d: Date): string {
  const dia = d.getDate();
  const mes = MESES_ABREV_PT[d.getMonth()];
  const y = d.getFullYear();
  return `${dia} ${mes} ${y}`;
}
