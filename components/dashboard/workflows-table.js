import { buildWorkflowMetrics } from "@/lib/dashboard";
import { formatRelativeDate } from "@/lib/format";

export function WorkflowsTable({ isAdmin, onSelectWorkflow, workflows }) {
  return (
    <div className="card workflow-card">
      <div className="card-header">
        <div className="card-title">Workflows</div>
        <span className="card-badge">
          {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="card-body-flush">
        <table className="data-table">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Total Runs</th>
              <th>Success / Error</th>
              <th>Nodes</th>
              <th>Last Run</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {workflows.length === 0 ? (
              <tr>
                <td className="empty-state" colSpan="8">
                  <div className="empty-icon">{"\u2699"}</div>
                  {isAdmin ? "No workflows found" : "No workflows assigned to you as owner"}
                </td>
              </tr>
            ) : (
              workflows.map((workflow) => {
                const metrics = buildWorkflowMetrics(workflow);
                const badgeClass =
                  metrics.runs === 0 ? "info" : metrics.successRate >= 90 ? "success" : "error";

                return (
                  <tr key={workflow.workflow_id} onClick={() => onSelectWorkflow(workflow.workflow_id)}>
                    <td>
                      <div className="wf-name">{workflow.workflow_name}</div>
                      {workflow.documentation_link ? (
                        <a
                          className="wf-link"
                          href={workflow.documentation_link}
                          onClick={(event) => event.stopPropagation()}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Docs
                        </a>
                      ) : null}
                    </td>
                    <td className="mono muted-cell">{workflow["Workflow Owner"] || "\u2014"}</td>
                    <td>
                      {workflow.is_active ? (
                        <span className="badge active">
                          <span className="badge-dot" />
                          Active
                        </span>
                      ) : (
                        <span className="badge inactive">Inactive</span>
                      )}
                    </td>
                    <td className="mono">{metrics.runs.toLocaleString()}</td>
                    <td>
                      <div className="run-split">
                        <span className="run-success">{metrics.successfulRuns.toLocaleString()}</span>
                        <span className="run-divider">/</span>
                        <span className="run-error">{metrics.errorRuns.toLocaleString()}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${metrics.successRate >= 80 ? "green" : "red"}`}
                          style={{ width: `${metrics.successRate}%` }}
                        />
                      </div>
                    </td>
                    <td className="mono">{workflow.node_count || "\u2014"}</td>
                    <td className="mono muted-cell">{formatRelativeDate(workflow.last_execution_at)}</td>
                    <td>
                      {metrics.runs === 0 ? (
                        <span className={`badge ${badgeClass}`}>No data</span>
                      ) : (
                        <span className={`badge ${badgeClass}`}>
                          <span className="badge-dot" />
                          {metrics.successRate}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
