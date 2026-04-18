import { parseMesYYYYMM, TIMEZONE_BR } from "@/lib/mes-calculo";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIMEZONE_BR,
});

export function formatBRL(value: number): string {
  return money.format(value);
}

export function formatDataLonga(d: Date): string {
  return longDate.format(d);
}

/** Ex.: "Domingo, 12 de abril de 2026" — calendário de Brasília (evita SSR em UTC mostrar dia errado). */
export function formatDataSemanaLonga(hoje: Date = new Date()): string {
  const s = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE_BR,
  }).format(hoje);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ex.: "12 abr" — dia/mês no fuso de Brasília. */
export function formatDataCurta(d: Date): string {
  const s = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    timeZone: TIMEZONE_BR,
  }).format(d);
  const t = s.replace(/\./g, "").replace(/\s*de\s*/gi, " ").trim().toLowerCase();
  return t.replace(/\s+/g, " ");
}

/** Nome do mês em minúsculas (referência `YYYY-MM`, calendário Brasília). */
export function formatMesNomeLowerPt(mes: string): string {
  const p = parseMesYYYYMM(mes);
  if (!p) return "mês anterior";
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: TIMEZONE_BR,
  })
    .format(new Date(`${p.y}-${String(p.m).padStart(2, "0")}-01T12:00:00.000-03:00`))
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

/** Ex.: "12 abr 2026" — componentes no fuso de Brasília. */
export function formatDataDiaMesAnoPt(d: Date): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: TIMEZONE_BR,
  }).formatToParts(d);
  const dia = parts.find((p) => p.type === "day")?.value ?? "";
  const mi = Number(parts.find((p) => p.type === "month")?.value ?? "1");
  const mes = MESES_ABREV_PT[mi - 1] ?? "???";
  const y = parts.find((p) => p.type === "year")?.value ?? "";
  return `${dia} ${mes} ${y}`;
}
