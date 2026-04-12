export function calcularArrobas(pesoLiquido: number): number {
  return pesoLiquido / 15;
}

export function calcularValorTotal(arrobas: number, precoArroba: number): number {
  return arrobas * precoArroba;
}

export function calcularLucro(faturamento: number, custos: number): number {
  return faturamento - custos;
}

export const CATEGORIAS_CUSTO = [
  { value: "racao", label: "Ração" },
  { value: "vacina", label: "Vacina" },
  { value: "medicamento", label: "Medicamento" },
  { value: "funcionarios", label: "Funcionários" },
  { value: "outros", label: "Outros" },
] as const;

export type CategoriaCusto = (typeof CATEGORIAS_CUSTO)[number]["value"];
