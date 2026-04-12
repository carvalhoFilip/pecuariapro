import { Header } from "@/components/layout/Header";
import { CostForm } from "@/components/forms/CostForm";

export const metadata = {
  title: "Adicionar custo | Pecuária Pro",
};

export default function NovoCustoPage() {
  return (
    <>
      <Header titulo="Adicionar custo" subtitulo="Escolha a categoria e o valor — observação é opcional." />
      <div className="flex-1 px-4 py-6 sm:px-8">
        <CostForm />
      </div>
    </>
  );
}
