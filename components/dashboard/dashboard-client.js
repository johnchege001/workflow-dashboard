"use client";

import { useState } from "react";

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
  const [activeSection, setActiveSection] = useState("home");
  const [executionFilter, setExecutionFilter] = useState("all");

  if (!auth.currentUser) {
    return <AuthView controller={auth} />;
  }

  return (
    <>
      <DashboardView
        activeSection={activeSection}
        auth={auth}
        dashboard={dashboard}
        executionFilter={executionFilter}
        onOpenExecutionErrors={() => {
          setExecutionFilter("error");
          setActiveSection("executions");
        }}
        onSetActiveSection={setActiveSection}
        onSetExecutionFilter={setExecutionFilter}
      />
      <WorkflowModal
        dashboard={dashboard}
        onOpenExecutionErrors={() => {
          setExecutionFilter("error");
          setActiveSection("executions");
        }}
      />
    </>
  );
}
