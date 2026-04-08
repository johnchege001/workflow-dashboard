"use client";

import { AuthView } from "@/components/auth/auth-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { WorkflowModal } from "@/components/dashboard/workflow-modal";
import { useAuthController } from "@/hooks/use-auth-controller";
import { useDashboardController } from "@/hooks/use-dashboard-controller";

export function DashboardClient() {
  const auth = useAuthController();
  const dashboard = useDashboardController({
    currentUser: auth.currentUser,
    currentProfile: auth.currentProfile,
    isAdmin: auth.isAdmin,
  });

  if (!auth.currentUser) {
    return <AuthView controller={auth} />;
  }

  return (
    <>
      <DashboardView auth={auth} dashboard={dashboard} />
      <WorkflowModal dashboard={dashboard} />
    </>
  );
}
