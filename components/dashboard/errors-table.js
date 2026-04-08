import { formatRelativeDate, truncateText } from "@/lib/format";

export function ErrorsTable({ errors }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Recent Errors</div>
        <span className="card-badge">
          {errors.length} error{errors.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="card-body-flush">
        <table className="data-table">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Error Node</th>
              <th>Error Type</th>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {errors.length === 0 ? (
              <tr>
                <td className="empty-state" colSpan="5">
                  <div className="empty-icon">{"\u2713"}</div>
                  No errors - all workflows healthy!
                </td>
              </tr>
            ) : (
              errors.map((error, index) => (
                <tr key={`${error.workflow_id}-${error.occurred_at}-${index}`}>
                  <td className="wf-name">{error.workflows?.workflow_name || error.workflow_id || "\u2014"}</td>
                  <td>
                    <span className="badge error">{error.error_node || "\u2014"}</span>
                  </td>
                  <td className="mono muted-cell">{error.error_type || "\u2014"}</td>
                  <td className="error-message-cell" data-tooltip={error.error_message || ""}>
                    {truncateText(error.error_message, 60)}
                  </td>
                  <td className="mono muted-cell">{formatRelativeDate(error.occurred_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
