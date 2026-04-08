import { ErrorTrendCard } from "@/components/dashboard/error-trend-card";
import { HealthCard } from "@/components/dashboard/health-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { getExecutionVisitLink } from "@/lib/dashboard";
import { formatFullDate, truncateText } from "@/lib/format";

function statusLabel(status) {
  return status === "success" ? "Successful" : "Error";
}

export function HomePanel({ onOpenExecutionErrors, recentExecutions, summary, health, trend }) {
  return (
    <>
      <StatsRow onOpenExecutionErrors={onOpenExecutionErrors} summary={summary} />

      <div className="grid-2">
        <HealthCard health={health} />
        <ErrorTrendCard trend={trend} />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Executions</div>
          <span className="card-badge">{recentExecutions.length}</span>
        </div>
        <div className="card-body">
          {recentExecutions.length === 0 ? (
            <div className="empty-state">
              No recent activity
            </div>
          ) : (
            <div className="execution-list">
              {recentExecutions.map((entry) => {
                const visitLink = getExecutionVisitLink(entry);

                return (
                  <div key={entry.id} className="execution-list-item">
                    <div className="execution-list-head">
                      <div>
                        <div className="wf-name">{entry.workflowName}</div>
                        <div className="execution-list-meta">{formatFullDate(entry.occurredAt)}</div>
                      </div>
                      <span className={`badge ${entry.status}`}>
                        <span className="badge-dot" />
                        {statusLabel(entry.status)}
                      </span>
                    </div>
                    <div className="execution-list-message">{truncateText(entry.message, 140)}</div>
                    <div className="execution-list-footer">
                      <span className="mono muted-cell">{entry.type}</span>
                      {visitLink ? (
                        <a className="btn-inline" href={visitLink} rel="noreferrer" target="_blank">
                          Open in n8n
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
