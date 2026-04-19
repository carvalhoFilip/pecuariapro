import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { userHasValidSubscriptionAccess, paywallRedirectQuery } from "@/lib/subscription-access";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { DashboardQuickActionsProvider } from "@/contexts/dashboard-quick-actions";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { PreventSwipeBack } from "@/components/layout/PreventSwipeBack";
import { TrialBanner } from "@/components/dashboard/TrialBanner";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();
  const userEmail = session.user?.email ?? null;
  const auth = getNeonAuthOrNull();

  let trialBannerTrialEndsAt: Date | string | null = null;
  let trialBannerSubscriptionStatus: string | null = null;

  if (auth) {
    if (session.error === "auth_not_configured") {
      // deixa passar
    } else if (!session.user || session.error === "unauthorized") {
      redirect("/login");
    } else if (!isUuidLike(session.user.id)) {
      redirect("/login");
    } else {
      const u = await ensureAppUser(session.user);
      if (!userHasValidSubscriptionAccess(u.subscriptionStatus, u.trialEndsAt)) {
        redirect(`/pagamento${paywallRedirectQuery(u.subscriptionStatus, u.trialEndsAt)}`);
      }
      trialBannerTrialEndsAt = u.trialEndsAt ?? null;
      trialBannerSubscriptionStatus = u.subscriptionStatus ?? null;
    }
  }

  return (
    <DashboardQuickActionsProvider>
      <SidebarProvider>
        <PreventSwipeBack />
        <div className="flex min-h-screen bg-terra-50">
          <Sidebar userEmail={userEmail} />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col md:pl-[240px]">
            <MobileHeader />
            <TrialBanner
              trialEndsAt={trialBannerTrialEndsAt}
              subscriptionStatus={trialBannerSubscriptionStatus}
            />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </DashboardQuickActionsProvider>
  );
}
