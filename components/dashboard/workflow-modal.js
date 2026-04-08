"use client";

import { useEffect } from "react";

import { buildWorkflowMetrics } from "@/lib/dashboard";
import { formatFullDate } from "@/lib/format";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function WorkflowModal({ dashboard }) {
  const workflow = dashboard.selectedWorkflow;

  useEffect(() => {
    if (!workflow) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        dashboard.closeWorkflow();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dashboard, workflow]);

  if (!workflow) {
    return null;
  }

  const metrics = buildWorkflowMetrics(workflow);

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
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{workflow.workflow_name}</div>
            <div className="modal-id">
              {`ID: ${workflow.workflow_id} / Owner: ${workflow["Workflow Owner"] || "\u2014"}`}
            </div>
          </div>
          <button className="btn-close" onClick={dashboard.closeWorkflow} type="button">
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-stats">
            <div className="modal-stat">
              <div className="modal-stat-label">Total Runs</div>
              <div className="modal-stat-value">{metrics.runs.toLocaleString()}</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Successful</div>
              <div className="modal-stat-value green">{metrics.successfulRuns.toLocaleString()}</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Errors</div>
              <div className="modal-stat-value red">{metrics.errorRuns.toLocaleString()}</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Success Rate</div>
              <div className={`modal-stat-value ${metrics.successRate >= 80 ? "green" : "red"}`}>
                {metrics.successRate}%
              </div>
            </div>
          </div>

          <div className="modal-section-title">Details</div>
          <div className="meta-grid">
            <div className="meta-item">
              <div className="meta-key">Status</div>
              <div className="meta-val">{workflow.is_active ? "Active" : "Inactive"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Owner</div>
              <div className="meta-val">{workflow["Workflow Owner"] || "\u2014"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Nodes</div>
              <div className="meta-val">{workflow.node_count || "\u2014"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Last Run</div>
              <div className="meta-val">{formatFullDate(workflow.last_execution_at)}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Last Success</div>
              <div className="meta-val">{formatFullDate(workflow.last_success_at)}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Last Error</div>
              <div className="meta-val">{formatFullDate(workflow.last_error_at)}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Created</div>
              <div className="meta-val">{formatFullDate(workflow.created_at)}</div>
            </div>
            <div className="meta-item">
              <div className="meta-key">Updated</div>
              <div className="meta-val">{formatFullDate(workflow.updated_at)}</div>
            </div>
            {workflow.description ? (
              <div className="meta-item meta-item-wide">
                <div className="meta-key">Description</div>
                <div className="meta-val">{workflow.description}</div>
              </div>
            ) : null}
            {workflow.documentation_link ? (
              <div className="meta-item">
                <div className="meta-key">Docs</div>
                <div className="meta-val">
                  <a href={workflow.documentation_link} rel="noreferrer" target="_blank">
                    Open Docs
                  </a>
                </div>
              </div>
            ) : null}
            {workflow.workflow_json_link ? (
              <div className="meta-item">
                <div className="meta-key">JSON File</div>
                <div className="meta-val">
                  <a href={workflow.workflow_json_link} rel="noreferrer" target="_blank">
                    Download
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          <div className="section-divider" />

          <div className="modal-section-title">Recent Errors ({dashboard.modalErrors.length})</div>

          {dashboard.modalLoading ? (
            <div className="empty-state">Loading workflow details...</div>
          ) : dashboard.modalErrors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{"\u2713"}</div>
              No errors for this workflow
            </div>
          ) : (
            dashboard.modalErrors.map((error, index) => (
              <div key={`${error.workflow_id}-${error.occurred_at}-${index}`} className="error-item">
                <div className="error-item-header">
                  <span className="error-node-lbl">{error.error_node || "Unknown node"}</span>
                  <span className="error-time">{formatFullDate(error.occurred_at)}</span>
                </div>
                <div className="error-msg">{error.error_message || "No message"}</div>
                {error.error_type ? <div className="error-type-lbl">{error.error_type}</div> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
