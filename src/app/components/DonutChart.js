"use client";
import React from "react";

const DonutChart = () => {
  return (
    <>
      <div className="bg-white dark:bg-gray-500 border rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-3">Team utilization</h3>
        <div className="flex items-center justify-center">
          <DonutChartFunction percent={72} size={160} />
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div>On Track</div>
            <div className="font-medium">72%</div>
          </div>
          <div className="flex items-center justify-between">
            <div>At Risk</div>
            <div className="font-medium">18%</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Delayed</div>
            <div className="font-medium">10%</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonutChart;

function DonutChartFunction({ percent = 60, size = 120 }) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="mx-auto">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
        <circle
          r={radius}
          fill="none"
          stroke="url(#g)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={-circumference * 0.25}
          transform="rotate(-90)"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill="#111827"
        >
          {percent}%
        </text>
      </g>
    </svg>
  );
}
