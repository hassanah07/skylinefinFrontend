"use client";
import React, { useMemo } from "react";

const DashMain = () => {
  const metrics = useMemo(
    () => [
      { id: 1, label: "Total Employees", value: 128, change: "+6%" },
      { id: 2, label: "Customers", value: 24, change: "-2%" },
      { id: 3, label: "Investors", value: "$48,500", change: "-3%" },
      { id: 4, label: "Marchants", value: "$48,500", change: "-3%" },
      { id: 5, label: "Active Loan", value: "$48,500", change: "-3%" },
      { id: 6, label: "Active Recurring", value: "$48,500", change: "-3%" },
      { id: 7, label: "Pending Loan", value: "$48,500", change: "-3%" },
      { id: 8, label: "Pending Recurring", value: 14, change: "+12%" },
    ],
    []
  );
  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 dark:text-white">
                  {m.label}
                </div>
                <div className="text-2xl font-semibold">{m.value}</div>
              </div>
              <div
                className={`text-sm font-medium ${
                  m.change.startsWith("+")
                    ? "text-white"
                    : "text-red-200 font-semibold"
                }`}
              >
                {m.change}
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500"
                style={{
                  width: `${Math.min(100, (parseFloat(m.value) || 50) % 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default DashMain;
