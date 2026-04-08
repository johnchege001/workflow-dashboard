import { ErrorTrendCard } from "@/components/dashboard/error-trend-card";
import { ErrorsTable } from "@/components/dashboard/errors-table";
import { AppHeader } from "@/components/dashboard/app-header";
import { HealthCard } from "@/components/dashboard/health-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { WorkflowsTable } from "@/components/dashboard/workflows-table";
import { buildDashboardStats, buildHealthSummary, buildTrendSeries } from "@/lib/dashboard";

export function DashboardView({ auth, dashboard }) {
  const summary = buildDashboardStats(dashboard.workflows, dashboard.trendErrors);
  const health = buildHealthSummary(dashboard.workflows);
  const trend = buildTrendSeries(dashboard.trendErrors);

  return (
    <div className="app-screen visible">
      <div className="countdown-bar">
        <div className="countdown-fill" style={{ width: `${dashboard.countdownPercent}%` }} />
      </div>

      <AppHeader
        currentProfile={auth.currentProfile}
        currentUser={auth.currentUser}
        lastUpdated={dashboard.lastUpdated}
        onRefresh={dashboard.loadAll}
        onSignOut={() => {
          void auth.signOut();
        }}
        refreshing={dashboard.refreshing}
      />

      <main className="main">
        {!auth.isAdmin ? (
          <div className="owner-banner">
            Showing only workflows where you are listed as the owner. Contact an Admin to update ownership.
          </div>
        ) : null}

        {dashboard.loadError ? <div className="owner-banner owner-banner-error">{dashboard.loadError}</div> : null}

        <StatsRow summary={summary} />

        <div className="grid-2">
          <HealthCard health={health} />
          <ErrorTrendCard trend={trend} />
        </div>

        <WorkflowsTable isAdmin={auth.isAdmin} onSelectWorkflow={dashboard.openWorkflow} workflows={dashboard.workflows} />
        <ErrorsTable errors={dashboard.errors} />
      </main>
    </div>
  );
}
