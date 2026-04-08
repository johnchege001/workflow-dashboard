export function StatsRow({ summary }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Workflows</div>
        <div className="stat-value">{summary.total}</div>
        <div className="stat-sub">{summary.active} active</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">Runs</div>
        <div className="stat-value">{summary.runs.toLocaleString()}</div>
        <div className="stat-sub">all-time</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">Success</div>
        <div className="stat-value">{summary.successRate}%</div>
        <div className="stat-sub">overall</div>
      </div>
      <div className="stat-card red">
        <div className="stat-label">Errors</div>
        <div className="stat-value">{summary.errorRuns.toLocaleString()}</div>
        <div className="stat-sub">all-time</div>
      </div>
      <div className="stat-card amber">
        <div className="stat-label">24h Errors</div>
        <div className="stat-value">{summary.recentErrors}</div>
        <div className="stat-sub">latest</div>
      </div>
    </div>
  );
}
