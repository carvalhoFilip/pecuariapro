import { getNeonAuthOrNull } from "@/lib/auth";
import { getCheckoutEmail } from "@/lib/stripe-subscription";
import { redirect } from "next/navigation";
import { SignUpPanel } from "./SignUpPanel";

export const metadata = {
  title: "Criar conta | Pecuária Pro",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; session_id?: string }>;
}) {
  const configured = getNeonAuthOrNull() !== null;
  const { checkout, session_id: sessionId } = await searchParams;
  const checkoutOk = checkout === "ok";

  if (!checkoutOk) {
    redirect("/pagamento?motivo=inativo");
  }

  let checkoutEmail: string | null = null;
  if (sessionId) {
    try {
      checkoutEmail = await getCheckoutEmail(sessionId);
    } catch (e) {
      console.warn("Não foi possível obter e-mail do checkout:", e);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-3 sm:py-6">
      <SignUpPanel configured={configured} checkoutEmail={checkoutEmail} />
    </div>
  );
}
