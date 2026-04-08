import { percent } from "@/lib/format";

export function buildDashboardStats(workflows, recentErrorEvents) {
  const total = workflows.length;
  const active = workflows.filter((workflow) => workflow.is_active).length;
  const runs = workflows.reduce((sum, workflow) => sum + (workflow.total_runs || 0), 0);
  const successfulRuns = workflows.reduce(
    (sum, workflow) => sum + (workflow.successful_runs || 0),
    0,
  );
  const errorRuns = workflows.reduce((sum, workflow) => sum + (workflow.error_runs || 0), 0);
  const cutoff = new Date(Date.now() - 86400000).toISOString();
  const recentErrors = recentErrorEvents.filter((entry) => entry.occurred_at > cutoff).length;

  return {
    total,
    active,
    runs,
    successfulRuns,
    errorRuns,
    successRate: percent(successfulRuns, runs),
    recentErrors,
  };
}

export function buildHealthSummary(workflows) {
  const successful = workflows.filter(
    (workflow) => (workflow.successful_runs || 0) > 0 && (workflow.error_runs || 0) === 0,
  ).length;
  const hasErrors = workflows.filter((workflow) => (workflow.error_runs || 0) > 0).length;
  const noRuns = workflows.filter((workflow) => (workflow.total_runs || 0) === 0).length;
  const successRate = percent(successful, workflows.length);

  let label = "Issues";
  if (successRate >= 90) {
    label = "Healthy";
  } else if (successRate >= 70) {
    label = "Degraded";
  }

  return {
    successful,
    hasErrors,
    noRuns,
    successRate,
    label,
  };
}

export function buildTrendSeries(entries) {
  const labels = [];
  const counts = [];
  const now = new Date();

  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - index);

    const key = date.toISOString().slice(0, 10);
    labels.push(index === 0 ? "Today" : key.slice(5));
    counts.push(entries.filter((entry) => entry.occurred_at?.slice(0, 10) === key).length);
  }

  return {
    labels,
    counts,
    total: counts.reduce((sum, count) => sum + count, 0),
  };
}

export function buildWorkflowMetrics(workflow) {
  const runs = workflow.total_runs || 0;
  const successfulRuns = workflow.successful_runs || 0;
  const errorRuns = workflow.error_runs || 0;

  return {
    runs,
    successfulRuns,
    errorRuns,
    successRate: percent(successfulRuns, runs),
  };
}
