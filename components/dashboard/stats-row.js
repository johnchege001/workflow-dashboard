export function StatsRow({ summary }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Total Workflows</div>
        <div className="stat-value">{summary.total}</div>
        <div className="stat-sub">{summary.active} active</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">Total Runs</div>
        <div className="stat-value">{summary.runs.toLocaleString()}</div>
        <div className="stat-sub">all time</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">Success Rate</div>
        <div className="stat-value">{summary.successRate}%</div>
        <div className="stat-sub">across workflows</div>
      </div>
      <div className="stat-card red">
        <div className="stat-label">Total Errors</div>
        <div className="stat-value">{summary.errorRuns.toLocaleString()}</div>
        <div className="stat-sub">all time</div>
      </div>
      <div className="stat-card amber">
        <div className="stat-label">Recent Errors</div>
        <div className="stat-value">{summary.recentErrors}</div>
        <div className="stat-sub">last 24 hours</div>
      </div>
    </div>
  );
}
