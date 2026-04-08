"use client";

import { useMemo, useState } from "react";

import { filterExecutionEntries, getExecutionVisitLink, sortExecutionEntries } from "@/lib/dashboard";
import { formatFullDate, truncateText } from "@/lib/format";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "error", label: "Errors" },
  { id: "success", label: "Success" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "errors-first", label: "Errors first" },
  { id: "success-first", label: "Success first" },
];

function statusLabel(status) {
  return status === "success" ? "Successful" : "Error";
}

export function ExecutionsPanel({ entries, filter, onFilterChange, onSelectWorkflow }) {
  const [sortBy, setSortBy] = useState("newest");

  const visibleEntries = useMemo(() => {
    const filtered = filterExecutionEntries(entries, filter);
    return sortExecutionEntries(filtered, sortBy);
  }, [entries, filter, sortBy]);

  return (
    <div className="card">
      <div className="card-header card-header-stack">
        <div className="card-title">Execution Activity</div>
        <div className="table-controls">
          <div className="segmented-control" role="tablist" aria-label="Execution outcome filter">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                className={`segmented-control-button ${filter === item.id ? "active" : ""}`}
                onClick={() => onFilterChange(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="select-wrap">
            <span>Sort</span>
            <select className="table-select" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="card-body-flush">
        <table className="data-table">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Status</th>
              <th>Node / Type</th>
              <th>Message</th>
              <th>Occurred</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleEntries.length === 0 ? (
              <tr>
                <td className="empty-state" colSpan="6">
                  No matching entries
                </td>
              </tr>
            ) : (
              visibleEntries.map((entry) => {
                const visitLink = getExecutionVisitLink(entry);

                return (
                  <tr key={entry.id}>
                    <td>
                      <div className="wf-name">{entry.workflowName}</div>
                      <div className="muted-cell mono">{entry.workflowId}</div>
                    </td>
                    <td>
                      <span className={`badge ${entry.status}`}>
                        <span className="badge-dot" />
                        {statusLabel(entry.status)}
                      </span>
                    </td>
                    <td>
                      <div className="wf-name">{entry.node}</div>
                      <div className="muted-cell mono">{entry.type}</div>
                    </td>
                    <td className="error-message-cell" data-tooltip={entry.message}>
                      {truncateText(entry.message, 72)}
                    </td>
                    <td className="mono muted-cell">{formatFullDate(entry.occurredAt)}</td>
                    <td>
                      <div className="table-actions">
                        {entry.workflowId ? (
                          <button className="btn-inline" onClick={() => onSelectWorkflow(entry.workflowId)} type="button">
                            Details
                          </button>
                        ) : null}
                        {visitLink ? (
                          <a className="btn-inline" href={visitLink} rel="noreferrer" target="_blank">
                            Open in n8n
                          </a>
                        ) : null}
                      </div>
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
