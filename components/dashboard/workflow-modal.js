"use client";

import { useEffect, useState } from "react";

import { buildWorkflowMetrics, getWorkflowVisitLink } from "@/lib/dashboard";
import { formatFullDate } from "@/lib/format";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function WorkflowModal({ dashboard, onOpenExecutionErrors }) {
  const workflow = dashboard.selectedWorkflow;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const workflowId = workflow?.workflow_id;

  useEffect(() => {
    if (!workflow) {
      return undefined;
    }

    setDetailsOpen(false);

    function onKeyDown(event) {
      if (event.key === "Escape") {
        dashboard.closeWorkflow();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dashboard, workflowId]);

  if (!workflow) {
    return null;
  }

  const metrics = buildWorkflowMetrics(workflow);
  const visitLink = getWorkflowVisitLink(workflow);
  const statusLabel = workflow.is_active ? "Active" : "Inactive";

  return (
    <div
      className="modal-overlay open"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dashboard.closeWorkflow();
        }
      }}
      role="presentation"
    >
      <div className="modal modal-compact">
        <div className="modal-header">
          <div className="modal-header-copy">
            <div className="modal-title">{workflow.workflow_name}</div>
            <div className="modal-inline-meta">
              <span>Execution ID: {workflow.workflow_id}</span>
              <span>Status: {statusLabel}</span>
              <span>Last run: {formatFullDate(workflow.last_execution_at)}</span>
            </div>
          </div>
          <div className="modal-header-actions">
            <span className={`badge ${metrics.successRate >= 80 ? "success" : "error"}`}>
              <span className="badge-dot" />
              {metrics.successRate}% success
            </span>
            <button className="btn-close" onClick={dashboard.closeWorkflow} type="button">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-inline-stats">
            <div className="modal-inline-stat">
              <span className="modal-inline-label">Runs</span>
              <span className="modal-inline-value">{metrics.runs.toLocaleString()}</span>
            </div>
            <div className="modal-inline-stat">
              <span className="modal-inline-label">Success</span>
              <span className="modal-inline-value green">{metrics.successfulRuns.toLocaleString()}</span>
            </div>
            <div className="modal-inline-stat">
              <span className="modal-inline-label">Errors</span>
              <span className="modal-inline-value red">{metrics.errorRuns.toLocaleString()}</span>
            </div>
            <div className="modal-inline-stat">
              <span className="modal-inline-label">Nodes</span>
              <span className="modal-inline-value">{workflow.node_count || "\u2014"}</span>
            </div>
          </div>

          <div className="modal-action-row">
            {visitLink ? (
              <a className="btn-inline" href={visitLink} rel="noreferrer" target="_blank">
                Open in n8n
              </a>
            ) : null}
            {metrics.errorRuns > 0 ? (
              <button
                className="btn-inline"
                onClick={() => {
                  onOpenExecutionErrors();
                  dashboard.closeWorkflow();
                }}
                type="button"
              >
                View errors
              </button>
            ) : null}
            <button
              className="btn-inline"
              onClick={() => setDetailsOpen((current) => !current)}
              type="button"
            >
              View details
              <ChevronIcon open={detailsOpen} />
            </button>
          </div>

          {detailsOpen ? (
            <div className="modal-details-grid">
              <div className="modal-detail-item">
                <div className="modal-detail-key">Owner</div>
                <div className="modal-detail-value">{workflow["Workflow Owner"] || "\u2014"}</div>
              </div>
              <div className="modal-detail-item">
                <div className="modal-detail-key">Created</div>
                <div className="modal-detail-value">{formatFullDate(workflow.created_at)}</div>
              </div>
              <div className="modal-detail-item">
                <div className="modal-detail-key">Updated</div>
                <div className="modal-detail-value">{formatFullDate(workflow.updated_at)}</div>
              </div>
              <div className="modal-detail-item">
                <div className="modal-detail-key">Last Error</div>
                <div className="modal-detail-value">{formatFullDate(workflow.last_error_at)}</div>
              </div>
              <div className="modal-detail-item">
                <div className="modal-detail-key">Last Success</div>
                <div className="modal-detail-value">{formatFullDate(workflow.last_success_at)}</div>
              </div>
              {workflow.description ? (
                <div className="modal-detail-item modal-detail-item-wide">
                  <div className="modal-detail-key">Description</div>
                  <div className="modal-detail-value">{workflow.description}</div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
