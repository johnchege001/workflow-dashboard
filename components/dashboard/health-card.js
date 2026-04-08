"use client";

import { useEffect, useRef } from "react";

import Chart from "chart.js/auto";

export function HealthCard({ health }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [health.successful, health.hasErrors, health.noRuns],
            backgroundColor: ["#1a7a4a", "#c0392b", "#d4d0c8"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: "72%",
        plugins: {
          legend: {
            display: false,
          },
        },
        animation: {
          duration: 500,
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [health.hasErrors, health.noRuns, health.successRate, health.successful]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Overall Health</div>
        <span className="card-badge">{health.label}</span>
      </div>
      <div className="card-body">
        <div className="donut-wrap">
          <div className="donut-container">
            <canvas ref={canvasRef} />
            <div className="donut-center">
              <div className="donut-center-val">{health.successRate}%</div>
              <div className="donut-center-label">success</div>
            </div>
          </div>
          <div className="donut-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--green)" }} />
              <div className="legend-label">Successful</div>
              <div className="legend-val">{health.successful}</div>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--red)" }} />
              <div className="legend-label">Has Errors</div>
              <div className="legend-val">{health.hasErrors}</div>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--border2)" }} />
              <div className="legend-label">No Runs</div>
              <div className="legend-val">{health.noRuns}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
