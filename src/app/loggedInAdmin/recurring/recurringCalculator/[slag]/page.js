"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";

const FREQUENCIES = [
  { label: "Daily", value: "daily", periodsPerYear: 365 },
  { label: "Weekly", value: "weekly", periodsPerYear: 52 },
  { label: "Monthly", value: "monthly", periodsPerYear: 12 },
  { label: "Quarterly", value: "quarterly", periodsPerYear: 4 },
  { label: "Yearly", value: "yearly", periodsPerYear: 1 },
];

function periodsPerYearFor(value) {
  return FREQUENCIES.find((f) => f.value === value)?.periodsPerYear || 12;
}

function futureValue(payment, ratePerPeriod, totalPeriods) {
  if (totalPeriods <= 0) return 0;
  if (Math.abs(ratePerPeriod) < 1e-12) return payment * totalPeriods;
  return (
    payment * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod)
  );
}

function paymentForGoal(goal, ratePerPeriod, totalPeriods) {
  if (totalPeriods <= 0) return 0;
  if (Math.abs(ratePerPeriod) < 1e-12) return goal / totalPeriods;
  const factor =
    (Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod;
  return goal / factor;
}

export default function RecurringCalculator() {
  const router = useRouter();
  const [mode, setMode] = useState("future");
  const [payment, setPayment] = useState(200);
  const [goal, setGoal] = useState(20000);
  const [annualRate, setAnnualRate] = useState(5);
  const [term, setTerm] = useState(5);
  const [termUnit, setTermUnit] = useState("years");
  const [freq, setFreq] = useState("monthly");
  const [scheduleData, setScheduleData] = useState([]);

  const periodsPerYear = periodsPerYearFor(freq);
  const years = termUnit === "months" ? term / 12 : term;
  const totalPeriods = Math.max(0, Math.round(years * periodsPerYear));
  const ratePerPeriod = annualRate / 100 / periodsPerYear;

  const computed = useMemo(() => {
    if (mode === "future") {
      const fv = futureValue(Number(payment) || 0, ratePerPeriod, totalPeriods);
      const contributed = (Number(payment) || 0) * totalPeriods;
      const interest = fv - contributed;
      return { fv, contributed, interest, paymentNeeded: null };
    } else {
      const p = paymentForGoal(Number(goal) || 0, ratePerPeriod, totalPeriods);
      const fv = futureValue(p, ratePerPeriod, totalPeriods);
      const contributed = p * totalPeriods;
      const interest = fv - contributed;
      return { fv, contributed, interest, paymentNeeded: p };
    }
  }, [mode, payment, goal, ratePerPeriod, totalPeriods]);
  const logoSrc = "/Logo.png";
  const Logo = () => (
    <Image
      src={logoSrc}
      alt="background_logo"
      aria-hidden="true"
      className="bg-logo fixed w-[80vw] top-24 opacity-10 z-0"
      fill
    />
  );

  useEffect(() => {
    const rows = [];
    const p =
      mode === "future"
        ? Number(payment) || 0
        : Number(computed.paymentNeeded || 0);
    let balance = 0;
    for (let i = 1; i <= totalPeriods; i++) {
      const interest = balance * ratePerPeriod;
      balance = balance + interest + p;
      rows.push({
        period: i,
        payment: Number(p.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        balance: Number(balance.toFixed(2)),
      });
    }
    setScheduleData(rows);
  }, [mode, payment, computed.paymentNeeded, ratePerPeriod, totalPeriods]);

  const printScheduleToConsole = () => {
    console.table(scheduleData);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <span className="print:hidden">
        <TopBar />
      </span>
      <style>{`
        table, th, td { border-color: #1f2937 !important; } /* dark borders */
        
      `}</style>

      <div className="flex relative">
        <span className="print:hidden">
          <SideBar />
        </span>
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden m-4">
            {/* Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between border-gray-400">
              <h1 className="text-lg font-semibold text-black">
                Recurring Payment Calculator
              </h1>
              <div className="flex gap-2 print:hidden">
                <button
                  onClick={() => router.back()}
                  className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm"
                >
                  Back
                </button>
                <button
                  onClick={printScheduleToConsole}
                  className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm"
                >
                  Set Recurring
                </button>
                <button
                  onClick={downloadJSON}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm"
                >
                  Download JSON
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
                >
                  Print
                </button>
              </div>
            </div>

            {/* Input Form */}
            <div className="p-6 border-b border-gray-400">
              <h2 className="text-sm font-medium mb-3">Inputs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="block text-gray-600 dark:text-black mb-1">
                    Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="border rounded text-black w-full px-2 py-1"
                  >
                    <option value="future">Find Future Value</option>
                    <option value="goal">Find Required Payment</option>
                  </select>
                </div>

                {mode === "future" ? (
                  <div>
                    <label className="block text-gray-600 dark:text-black mb-1">
                      Payment (₹)
                    </label>
                    <input
                      type="number"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      className="border rounded text-black w-full px-2 py-1"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-600 dark:text-black mb-1">
                      Goal (₹)
                    </label>
                    <input
                      type="number"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="border rounded text-black w-full px-2 py-1"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-600 dark:text-black mb-1">
                    Annual Rate (%)
                  </label>
                  <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="border rounded text-black w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-black mb-1">
                    Term
                  </label>
                  <input
                    type="number"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="border rounded text-black w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-black mb-1">
                    Term Unit
                  </label>
                  <select
                    value={termUnit}
                    onChange={(e) => setTermUnit(e.target.value)}
                    className="border rounded text-black w-full px-2 py-1"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-black mb-1">
                    Frequency
                  </label>
                  <select
                    value={freq}
                    onChange={(e) => setFreq(e.target.value)}
                    className="border rounded text-black w-full px-2 py-1"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="p-6">
              <div className="border border-gray-400 rounded p-4 bg-gray-50">
                <h2 className="text-sm font-medium mb-3 text-black">Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-black">
                      Total Periods
                    </p>
                    <p className="font-medium dark:text-black">
                      {totalPeriods}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-black">
                      Future Value
                    </p>
                    <p className="font-medium dark:text-black">
                      ₹
                      {computed.fv.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-black">
                      Interest Earned
                    </p>
                    <p className="font-medium dark:text-black text-green-700">
                      ₹
                      {computed.interest.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-black">
                      Total Contributed
                    </p>
                    <p className="font-medium dark:text-black text-blue-700">
                      ₹
                      {computed.contributed.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                {/* Full Schedule Table */}
                <div className="mt-6 relative">
                  {/* <div> <img src="/logo.PNG" alt="Logo"></div> */}
                  <div className="print-logo hidden print:block">
                    <Logo />
                  </div>
                  <h3 className="text-sm font-medium mb-2">
                    Full Schedule ({scheduleData.length} periods)
                  </h3>
                  <table className="min-w-full text-sm border border-gray-700 rounded">
                    <thead className="bg-gray-100 border-b border-gray-700">
                      <tr>
                        <th className="py-2 px-4 bg-green-700 text-white border-r border-gray-700">
                          Period
                        </th>
                        <th className="py-2 px-4 bg-green-700 text-white border-r border-gray-700">
                          Payment
                        </th>
                        <th className="py-2 px-4 bg-green-700 text-white border-r border-gray-700">
                          Interest
                        </th>
                        <th className="py-2 px-4 bg-green-700 text-white">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((r) => (
                        <tr key={r.period} className="border-t border-gray-700">
                          <td className="py-2 px-4 dark:text-black border-r border-gray-700">
                            {r.period}
                          </td>
                          <td className="py-2 px-4 dark:text-black border-r border-gray-700">
                            ₹
                            {r.payment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-2 px-4 dark:text-black border-r border-gray-700">
                            ₹
                            {r.interest.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-2 px-4 dark:text-black">
                            ₹
                            {r.balance.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                      {scheduleData.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-3 text-center">
                            No payments to show
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
