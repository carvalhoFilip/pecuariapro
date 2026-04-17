import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { PreventSwipeBack } from "@/components/layout/PreventSwipeBack";
import { DashboardQuickActionsProvider } from "@/contexts/dashboard-quick-actions";
import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { paywallRedirectQuery, userHasValidSubscriptionAccess } from "@/lib/subscription-access";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  const userEmail = session.user?.email ?? null;
  const auth = getNeonAuthOrNull();

  if (auth) {
    if (session.error === "auth_not_configured") {
      /* deixa passar: ainda sem Neon Auth */
    } else if (!session.user || session.error === "unauthorized") {
      redirect("/login");
    } else if (!isUuidLike(session.user.id)) {
      redirect("/login");
    } else {
      const u = await ensureAppUser(session.user);
      if (!userHasValidSubscriptionAccess(u.subscriptionStatus, u.trialEndsAt)) {
        redirect(`/pagamento${paywallRedirectQuery(u.subscriptionStatus, u.trialEndsAt)}`);
      }
    }
  }

  return (
    <DashboardQuickActionsProvider>
      <PreventSwipeBack />
      <div className="flex h-screen w-full overflow-hidden bg-terra-50">
        <Sidebar userEmail={userEmail} />
        <main className="dashboard-content min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-none md:pl-[240px]">
          {children}
        </main>
      </div>
    </DashboardQuickActionsProvider>
  );
}
