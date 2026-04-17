import { Beef, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NovaVendaModalButton } from "@/contexts/dashboard-quick-actions";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { formatArrobas, formatBRL, formatDataDiaMesAnoPt } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { getDb } from "@/db";
import { sales } from "@/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { ExcluirRegistroButton } from "@/components/ExcluirRegistroButton";
import { limitesMesUTC, parseMesYYYYMM, formatMesReferenciaPt, mesCorrenteUtc } from "@/lib/mes-calculo";

export const dynamic = "force-dynamic";

export default async function VendasPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const session = await getSessionUser();
  let lista: (typeof sales.$inferSelect)[] = [];
  let aviso: string | null = null;

  const q = await searchParams;
  const mesParam = q.mes;
  const mesFiltro = mesParam && parseMesYYYYMM(mesParam) ? mesParam : null;

  if (session.error === "auth_not_configured") {
    aviso = "Configure o Neon Auth para listar vendas reais.";
  } else if (!session.user) {
    aviso = "Faça login para ver suas vendas.";
  } else if (!isUuidLike(session.user.id)) {
    aviso =
      "O id da conta precisa ser UUID para bater com o banco. Ajuste a geração de IDs no Neon Auth (Better Auth).";
  } else {
    try {
      const user = await ensureAppUser(session.user);
      const db = getDb();
      if (mesFiltro) {
        const p = parseMesYYYYMM(mesFiltro)!;
        const { inicio, fim } = limitesMesUTC(p.y, p.m);
        lista = await db
          .select()
          .from(sales)
          .where(and(eq(sales.userId, user.id), gte(sales.date, inicio), lte(sales.date, fim)))
          .orderBy(desc(sales.date));
      } else {
        lista = await db
          .select()
          .from(sales)
          .where(eq(sales.userId, user.id))
          .orderBy(desc(sales.date));
      }
    } catch {
      aviso = "Não foi possível carregar o banco de dados.";
    }
  }

  const totalValor = lista.reduce((s, v) => s + Number(v.valorTotal), 0);
  const totalArrobas = lista.reduce((s, v) => s + Number(v.arrobas), 0);
  const totalAnimais = lista.reduce((s, v) => s + v.quantidadeAnimais, 0);
  const n = lista.length;

  let subtitulo = "";
  if (aviso) {
    subtitulo = "";
  } else if (mesFiltro) {
    subtitulo =
      n === 0
        ? `Nenhuma venda em ${formatMesReferenciaPt(mesFiltro)}`
        : `${n} ${n === 1 ? "venda" : "vendas"} · ${formatBRL(totalValor)} · ${formatArrobas(totalArrobas)} @`;
  } else {
    subtitulo = n === 0 ? "0 vendas registradas" : `${n} vendas registradas`;
  }

  const mesPickerValue = mesFiltro ?? mesCorrenteUtc();

  return (
    <div className="mx-auto min-h-0 w-full max-w-[1280px] flex-1 bg-[#fafaf9] px-4 pt-4 pb-8 md:px-8 md:pt-8">
      {aviso ? (
        <>
          <div className="mb-6 border-b border-terra-200 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-terra-900">Vendas</h1>
          </div>
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{aviso}</p>
          <div className="mt-4 flex justify-end">
            <NovaVendaModalButton className="h-10 rounded-lg bg-verde-700 px-4 font-semibold text-white hover:bg-verde-800">
              <Plus className="h-4 w-4" aria-hidden />
              Adicionar Venda
            </NovaVendaModalButton>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 border-b border-terra-200 pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-terra-900">Vendas</h1>
                <p className={cn("mt-0.5 text-sm", n === 0 ? "text-terra-400" : "text-terra-600")}>{subtitulo}</p>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <MonthPicker value={mesPickerValue} rota="/vendas" />
                {Boolean(mesFiltro) ? (
                  <Link href="/vendas" className="text-sm font-semibold text-verde-700 transition-interactive hover:text-verde-800">
                    Ver todas
                  </Link>
                ) : null}
                <NovaVendaModalButton className="ml-auto h-10 shrink-0 rounded-lg bg-verde-700 px-4 font-semibold text-white hover:bg-verde-800">
                  <Plus className="h-4 w-4" aria-hidden />
                  Adicionar Venda
                </NovaVendaModalButton>
              </div>
            </div>
          </div>

          {lista.length === 0 ? (
            <div className="overflow-hidden rounded-2xl border-[1.5px] border-terra-200 bg-white shadow-sm">
              <div className="flex flex-col items-center gap-4 px-5 py-16 text-center">
                <Beef className="h-12 w-12 text-terra-300" aria-hidden />
                <p className="text-base font-medium text-terra-700">Nenhuma venda registrada</p>
                <p className="max-w-md text-sm leading-relaxed text-terra-400">
                  Registre sua primeira venda para começar a acompanhar seu faturamento.
                </p>
                <NovaVendaModalButton
                  variant="outline"
                  className="h-10 rounded-lg border-2 border-verde-600 px-4 text-sm font-semibold text-verde-800 hover:bg-verde-50"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Registrar primeira venda
                </NovaVendaModalButton>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border-[1.5px] border-terra-200 bg-white shadow-sm">
              <div className="min-w-0 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b-[1.5px] border-terra-200 bg-terra-50">
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                        Data
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                        Animais
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                        Arrobas
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                        Preço/@
                      </th>
                      <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-terra-500">
                        Valor Total
                      </th>
                      <th className="w-14 px-2 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((v, idx) => (
                      <tr
                        key={v.id}
                        className={cn(
                          "group border-b border-terra-100 transition-interactive hover:bg-terra-50",
                          idx === lista.length - 1 ? "border-b-0" : undefined,
                        )}
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-terra-900">
                          {formatDataDiaMesAnoPt(new Date(v.date))}
                        </td>
                        <td className="px-5 py-3.5 text-terra-900">
                          <span className="font-medium">{v.quantidadeAnimais}</span>{" "}
                          <span className="text-xs text-terra-400">cab</span>
                        </td>
                        <td className="px-5 py-3.5 tabular-nums text-terra-900">
                          <span className="font-medium">
                            {Number(v.arrobas).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                          </span>{" "}
                          <span className="text-xs text-terra-400">@</span>
                        </td>
                        <td className="px-5 py-3.5 tabular-nums text-terra-700">
                          {formatBRL(Number(v.precoArroba))}
                        </td>
                        <td className="px-5 py-3.5 text-right text-base font-bold tabular-nums text-verde-700">
                          {formatBRL(Number(v.valorTotal))}
                        </td>
                        <td className="px-2 py-2 text-right opacity-0 transition-opacity group-hover:opacity-100">
                          <ExcluirRegistroButton id={v.id} tipo="venda" iconOnly />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-[1.5px] border-terra-200 bg-terra-50">
                      <td colSpan={6} className="px-5 py-3 text-[13px] font-medium text-terra-600">
                        Total: {formatBRL(totalValor)} · {formatArrobas(totalArrobas)} @ · {totalAnimais}{" "}
                        {totalAnimais === 1 ? "animal" : "animais"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
