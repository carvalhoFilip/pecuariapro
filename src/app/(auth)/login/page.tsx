import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInPanel } from "./SignInPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar | Pecuária Pro",
};

export default async function LoginPage() {
  const configured = getNeonAuthOrNull() !== null;
  if (configured) {
    const session = await getSessionUser();
    if (session.user && session.error === null) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-3 sm:py-6">
      <SignInPanel configured={configured} />
    </div>
  );
}
