"use client";

import { useMemo } from "react";

import { AppHeader } from "@/components/dashboard/app-header";
import { ExecutionsPanel } from "@/components/dashboard/executions-panel";
import { HomePanel } from "@/components/dashboard/home-panel";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { WorkflowsTable } from "@/components/dashboard/workflows-table";
import {
  buildDashboardStats,
  buildExecutionEntries,
  buildHealthSummary,
  buildTrendSeries,
} from "@/lib/dashboard";

export function DashboardView({
  activeSection,
  auth,
  dashboard,
  executionFilter,
  onOpenExecutionErrors,
  onSetActiveSection,
  onSetExecutionFilter,
}) {
  const summary = useMemo(
    () => buildDashboardStats(dashboard.workflows, dashboard.trendErrors),
    [dashboard.trendErrors, dashboard.workflows],
  );
  const health = useMemo(() => buildHealthSummary(dashboard.workflows), [dashboard.workflows]);
  const trend = useMemo(() => buildTrendSeries(dashboard.trendErrors), [dashboard.trendErrors]);
  const executionEntries = useMemo(
    () => buildExecutionEntries(dashboard.workflows, dashboard.errors),
    [dashboard.errors, dashboard.workflows],
  );
  const recentExecutions = executionEntries.slice(0, 5);

  const navCounts = {
    home: recentExecutions.length,
    workflows: dashboard.workflows.length,
    executions: executionEntries.length,
  };

  return (
    <div className="app-screen visible">
      <div className="app-shell">
        <SidebarNav
          activeSection={activeSection}
          counts={navCounts}
          currentProfile={auth.currentProfile}
          currentUser={auth.currentUser}
          onSelectSection={onSetActiveSection}
          onSignOut={() => {
            void auth.signOut();
          }}
        />
        <div className="workspace-shell">
          <AppHeader activeSection={activeSection} />

          <main className="main">
            {!auth.isAdmin ? (
              <div className="owner-banner">Owner scope</div>
            ) : null}

            {dashboard.loadError ? <div className="owner-banner owner-banner-error">{dashboard.loadError}</div> : null}

            {activeSection === "home" ? (
              <HomePanel
                health={health}
                onOpenExecutionErrors={onOpenExecutionErrors}
                recentExecutions={recentExecutions}
                summary={summary}
                trend={trend}
              />
            ) : null}

            {activeSection === "workflows" ? (
              <WorkflowsTable
                isAdmin={auth.isAdmin}
                onSelectWorkflow={dashboard.openWorkflow}
                workflows={dashboard.workflows}
              />
            ) : null}

            {activeSection === "executions" ? (
              <ExecutionsPanel
                entries={executionEntries}
                filter={executionFilter}
                onFilterChange={onSetExecutionFilter}
                onSelectWorkflow={dashboard.openWorkflow}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
