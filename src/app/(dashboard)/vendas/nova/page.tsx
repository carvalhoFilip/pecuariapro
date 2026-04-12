import { Header } from "@/components/layout/Header";
import { SaleForm } from "@/components/forms/SaleForm";

export const metadata = {
  title: "Adicionar Venda | Pecuária Pro",
};

export default function NovaVendaPage() {
  return (
    <>
      <Header titulo="Adicionar Venda" subtitulo="O sistema calcula arrobas e valor total para você." />
      <div className="flex-1 px-4 py-6 sm:px-8">
        <SaleForm />
      </div>
    </>
  );
}
