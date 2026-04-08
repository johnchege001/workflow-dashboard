"use client";

import { useEffect, useRef } from "react";

import Chart from "chart.js/auto";

export function ErrorTrendCard({ trend }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const context = canvasRef.current.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, "rgba(192,57,43,.15)");
    gradient.addColorStop(1, "rgba(192,57,43,0)");

    const chart = new Chart(context, {
      type: "line",
      data: {
        labels: trend.labels,
        datasets: [
          {
            data: trend.counts,
            borderColor: "#c0392b",
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 6,
              font: {
                family: "DM Sans",
                size: 10,
              },
              color: "#64748b",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(48, 63, 159, 0.08)",
            },
            ticks: {
              stepSize: 1,
              font: {
                family: "DM Sans",
                size: 10,
              },
              color: "#64748b",
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [trend.counts, trend.labels]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Error Trend (30 days)</div>
        <span className="card-badge">{trend.total} total</span>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
