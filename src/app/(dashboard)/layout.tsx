import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = getNeonAuthOrNull();
  if (auth) {
    const session = await getSessionUser();
    if (session.error === "auth_not_configured") {
      /* deixa passar: ainda sem Neon Auth */
    } else if (!session.user || session.error === "unauthorized") {
      redirect("/login");
    } else if (!isUuidLike(session.user.id)) {
      redirect("/login");
    } else {
      const u = await ensureAppUser(session.user);
      const status = u.subscriptionStatus ?? "inactive";
      const liberado = status === "trialing" || status === "active";
      const pularChecagem = process.env.SUBSCRIPTION_CHECK_DISABLED === "true";
      if (!pularChecagem && !liberado) {
        redirect("/pagamento");
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 sm:flex-row">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
