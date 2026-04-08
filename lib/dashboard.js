import { N8N_BASE_URL, SITE_URL } from "@/lib/constants";
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

export function getWorkflowVisitLink(workflow) {
  const explicitUrl =
    workflow.workflow_url ||
    workflow.workflow_link ||
    workflow.editor_url ||
    workflow.app_url ||
    workflow.url ||
    workflow.documentation_link;

  if (explicitUrl) {
    return explicitUrl;
  }

  if (!workflow.workflow_id) {
    return "";
  }

  const baseUrl = N8N_BASE_URL || buildInferredN8nBaseUrl(SITE_URL);
  if (!baseUrl) {
    return "";
  }

  return new URL(`/workflow/${workflow.workflow_id}`, ensureOrigin(baseUrl)).toString();
}

export function getExecutionVisitLink(entry) {
  const executionId =
    entry?.executionId ||
    entry?.execution_id ||
    entry?.workflow?.last_execution_id ||
    entry?.workflow?.lastExecutionId;

  if (executionId && entry?.workflowId) {
    return new URL(
      `/workflow/${entry.workflowId}/executions/${executionId}`,
      ensureOrigin(N8N_BASE_URL || buildInferredN8nBaseUrl(SITE_URL)),
    ).toString();
  }

  return entry?.workflow ? getWorkflowVisitLink(entry.workflow) : "";
}

function ensureOrigin(value) {
  if (!value) {
    return "";
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

function buildInferredN8nBaseUrl(siteUrl) {
  if (!siteUrl) {
    return "";
  }

  try {
    const url = new URL(ensureOrigin(siteUrl));
    if (url.hostname.startsWith("dashboard.")) {
      url.hostname = `n8n.${url.hostname.slice("dashboard.".length)}`;
      return url.origin;
    }

    return url.origin;
  } catch {
    return "";
  }
}

function compareIsoDates(left, right) {
  return new Date(right || 0).getTime() - new Date(left || 0).getTime();
}

export function buildExecutionEntries(workflows, errors) {
  const successEntries = workflows
    .filter((workflow) => workflow.last_success_at)
    .map((workflow) => ({
      id: `success-${workflow.workflow_id}-${workflow.last_success_at}`,
      workflowId: workflow.workflow_id,
      workflowName: workflow.workflow_name,
      owner: workflow["Workflow Owner"] || "\u2014",
      status: "success",
      occurredAt: workflow.last_success_at,
      source: "workflow",
      message: "Latest recorded successful execution.",
      node: "\u2014",
      type: "Success",
      workflow,
    }));

  const errorEntries = errors.map((error, index) => ({
    id: `error-${error.workflow_id}-${error.occurred_at}-${index}`,
    workflowId: error.workflow_id,
    workflowName: error.workflows?.workflow_name || error.workflow_name || error.workflow_id || "\u2014",
    owner: error["Workflow Owner"] || "\u2014",
    status: "error",
    occurredAt: error.occurred_at,
    source: "error",
    message: error.error_message || "No error message",
    node: error.error_node || "\u2014",
    type: error.error_type || "Error",
    workflow: workflows.find((workflow) => workflow.workflow_id === error.workflow_id) || null,
  }));

  return [...successEntries, ...errorEntries].sort((left, right) =>
    compareIsoDates(left.occurredAt, right.occurredAt),
  );
}

export function filterExecutionEntries(entries, status) {
  if (status === "all") {
    return entries;
  }

  return entries.filter((entry) => entry.status === status);
}

export function sortExecutionEntries(entries, sortBy) {
  const sorted = [...entries];

  if (sortBy === "oldest") {
    return sorted.sort((left, right) => compareIsoDates(right.occurredAt, left.occurredAt));
  }

  if (sortBy === "errors-first") {
    return sorted.sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "error" ? -1 : 1;
      }

      return compareIsoDates(left.occurredAt, right.occurredAt);
    });
  }

  if (sortBy === "success-first") {
    return sorted.sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "success" ? -1 : 1;
      }

      return compareIsoDates(left.occurredAt, right.occurredAt);
    });
  }

  return sorted.sort((left, right) => compareIsoDates(left.occurredAt, right.occurredAt));
}
