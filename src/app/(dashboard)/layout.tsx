import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { userHasValidSubscriptionAccess, paywallRedirectQuery } from "@/lib/subscription-access";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { DashboardQuickActionsProvider } from "@/contexts/dashboard-quick-actions";
import { PreventSwipeBack } from "@/components/layout/PreventSwipeBack";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();
  const userEmail = session.user?.email ?? null;
  const auth = getNeonAuthOrNull();

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
    }
  }

  return (
    <DashboardQuickActionsProvider>
      <PreventSwipeBack />
      {/*
        Layout padrão PWA:
        - Desktop: sidebar fixa à esquerda + conteúdo à direita
        - Mobile: sidebar como drawer + conteúdo ocupa tela toda
      */}
      <div
        style={{
          display: "flex",
          minHeight: "100dvh",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Sidebar userEmail={userEmail} />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            minWidth: 0,
            paddingLeft: 0,
          }}
          className="md:pl-[240px]"
        >
          {children}
        </div>
      </div>
    </DashboardQuickActionsProvider>
  );
}
