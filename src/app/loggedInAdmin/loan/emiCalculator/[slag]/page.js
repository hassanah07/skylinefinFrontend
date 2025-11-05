"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { useState, useMemo, use } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page({ params }) {
  // Inputs
  const [principal, setPrincipal] = useState(100000);
  const [annualRate, setAnnualRate] = useState(24); // percent per annum
  const [months, setMonths] = useState(12);
  const [email, setEmail] = useState("");
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);
  const toastOptions = {
    theme: "colored",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Helpers - deterministic formatting to avoid SSR/CSR locale mismatch
  const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  });
  const fmt = (v) => {
    if (v === null || v === undefined) return "-";
    const num = Number(v);
    if (isNaN(num)) return "-";
    return numberFormatter.format(num);
  };

  // Calculations
  const flat = useMemo(() => {
    const P = Number(principal) || 0;
    const r = (Number(annualRate) || 0) / 100;
    const n = Math.max(1, Number(months) || 1);
    const years = n / 12;
    const totalInterest = P * r * years; // flat interest
    const totalPayable = P + totalInterest;
    const emi = totalPayable / n;
    // schedule
    const monthlyPrincipal = P / n;
    const monthlyInterest = totalInterest / n;
    const schedule = [];
    let bal = P;
    for (let i = 1; i <= n; i++) {
      const interest = monthlyInterest;
      const principalPaid = monthlyPrincipal;
      const emiPaid = interest + principalPaid;
      const closing = Math.max(0, bal - principalPaid);
      schedule.push({
        m: i,
        opening: bal,
        emi: emiPaid,
        principal: principalPaid,
        interest,
        closing,
      });
      bal = closing;
    }
    return {
      emi,
      totalInterest,
      totalPayable,
      schedule,
    };
  }, [principal, annualRate, months]);

  const reducing = useMemo(() => {
    const P = Number(principal) || 0;
    const annual = (Number(annualRate) || 0) / 100;
    const n = Math.max(1, Number(months) || 1);
    const r = annual / 12; // monthly rate (decimal)
    let emi;
    if (r === 0) {
      emi = P / n;
    } else {
      const pow = Math.pow(1 + r, n);
      emi = (P * r * pow) / (pow - 1);
    }
    // schedule
    const schedule = [];
    let bal = P;
    let totalInterest = 0;
    for (let i = 1; i <= n; i++) {
      const interest = bal * r;
      const principalPaid = Math.min(bal, emi - interest);
      const emiPaid = principalPaid + interest;
      const closing = Math.max(0, bal - principalPaid);
      schedule.push({
        m: i,
        opening: bal,
        emi: emiPaid,
        principal: principalPaid,
        interest,
        closing,
      });
      bal = closing;
      totalInterest += interest;
    }
    const totalPayable = P + totalInterest;
    return {
      emi,
      totalInterest,
      totalPayable,
      schedule,
    };
  }, [principal, annualRate, months]);

  // NEW: capture the full table data into two variables
  // flatTableData and reducingTableData will contain arrays of plain objects
  // with the exact columns shown in the UI. Use these for export, upload, etc.
  const flatTableData = useMemo(() => {
    return flat.schedule.map((r) => ({
      m: r.m,
      opening: r.opening,
      emi: r.emi,
      principal: r.principal,
      interest: r.interest,
      closing: r.closing,
    }));
  }, [flat]);

  const reducingTableData = useMemo(() => {
    return reducing.schedule.map((r) => ({
      m: r.m,
      opening: r.opening,
      emi: r.emi,
      principal: r.principal,
      interest: r.interest,
      closing: r.closing,
    }));
  }, [reducing]);

  const exportCsv = (type = "both") => {
    const fmtNum = (v) => {
      const n = Number(v) || 0;
      return n.toFixed(2);
    };

    const buildScheduleSection = (title, obj) => {
      const lines = [];
      lines.push([title]);
      lines.push(["M", "Opening", "EMI", "Principal", "Interest", "Closing"]);
      obj.schedule.forEach((r) => {
        lines.push([
          r.m,
          fmtNum(r.opening),
          fmtNum(r.emi),
          fmtNum(r.principal),
          fmtNum(r.interest),
          fmtNum(r.closing),
        ]);
      });
      lines.push([
        "Total",
        "",
        fmtNum(obj.emi * months),
        fmtNum(principal),
        fmtNum(obj.totalInterest),
        "",
      ]);
      lines.push([""]); // blank line between sections
      return lines;
    };

    const rows = [];
    if (type === "flat" || type === "both") {
      rows.push(...buildScheduleSection("Flat Rate Schedule", flat));
    }
    if (type === "reducing" || type === "both") {
      rows.push(...buildScheduleSection("Reducing Rate Schedule", reducing));
    }

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emi-schedules-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const printAll = () => {
    window.print();
  };

  // small helper button to quickly inspect the two variables
  const reducingTableEmail = async (e) => {
    const data = {
      data: reducingTableData,
      loanAccountNumber: mySlag,
      type: "Reducing Balance",
      interest: annualRate,
      tenure: months,
    };
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/sendEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      // console.log(responseData);
      toast.success(responseData.msg, toastOptions);
    } catch (error) {
      toast.error(responseData.msg, toastOptions);
    }
  };
  const flatTableEmail = async (e) => {
    e.preventDefault();
    const data = {
      data: flatTableData,
      loanAccountNumber: mySlag,
      type: "Flat Rate",
      interest: annualRate,
      tenure: months,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/sendEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      toast.success(responseData.msg, toastOptions);
    } catch (error) {
      toast.error(responseData.msg, toastOptions);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-xl font-semibold">
                EMI Calculator (Flat & Reducing)
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={printAll}
                  className="print:hidden inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  Print / Save as PDF
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium">Loan Amount</span>
                  <input
                    type="number"
                    min="0"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">
                    Annual Interest Rate (%)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Tenure (months)</span>
                  <input
                    type="number"
                    min="1"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-600">
                    Flat Rate
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Monthly EMI</div>
                    <div className="text-right">{fmt(flat.emi)}</div>
                    <div className="font-medium">Total Interest</div>
                    <div className="text-right">{fmt(flat.totalInterest)}</div>
                    <div className="font-medium">Total Payable</div>
                    <div className="text-right">{fmt(flat.totalPayable)}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-600">
                    Reducing (Declining) Rate
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Monthly EMI</div>
                    <div className="text-right">{fmt(reducing.emi)}</div>
                    <div className="font-medium">Total Interest</div>
                    <div className="text-right">
                      {fmt(reducing.totalInterest)}
                    </div>
                    <div className="font-medium">Total Payable</div>
                    <div className="text-right">
                      {fmt(reducing.totalPayable)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">Amortization Schedules</h2>
                <div className="text-sm text-gray-500">
                  Printable table below (controls hidden on print)
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Flat schedule */}
                <div className="bg-white rounded shadow-sm overflow-auto">
                  <div className="p-3 border-b flex items-center justify-between">
                    <h3 className="font-medium">Flat Rate Schedule</h3>
                    <div className="text-sm text-gray-600">{months} months</div>
                  </div>
                  <table className="min-w-full text-sm divide-y">
                    <thead className="bg-gray-50 sticky top-0 print:sticky">
                      <tr>
                        <th className="p-2 text-left">M</th>
                        <th className="p-2 text-right">Opening</th>
                        <th className="p-2 text-right">EMI</th>
                        <th className="p-2 text-right">Principal</th>
                        <th className="p-2 text-right">Interest</th>
                        <th className="p-2 text-right">Closing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flat.schedule.map((row) => (
                        <tr key={row.m} className="border-b">
                          <td className="p-2">{row.m}</td>
                          <td className="p-2 text-right">
                            {fmt(row.opening.toFixed(2))}
                          </td>
                          <td className="p-2 text-right">{fmt(row.emi)}</td>
                          <td className="p-2 text-right">
                            {fmt(row.principal)}
                          </td>
                          <td className="p-2 text-right">
                            {fmt(row.interest)}
                          </td>
                          <td className="p-2 text-right">{fmt(row.closing)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="p-2 font-medium">Total</td>
                        <td />
                        <td className="p-2 text-right font-medium">
                          {fmt(flat.emi * months)}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {fmt(principal)}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {fmt(flat.totalInterest)}
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Reducing schedule */}
                <div className="bg-white rounded shadow-sm overflow-auto">
                  <div className="p-3 border-b flex items-center justify-between">
                    <h3 className="font-medium">Reducing Rate Schedule</h3>
                    <div className="text-sm text-gray-600">{months} months</div>
                  </div>
                  <table className="min-w-full text-sm divide-y">
                    <thead className="bg-gray-50 sticky top-0 print:sticky">
                      <tr>
                        <th className="p-2 text-left">M</th>
                        <th className="p-2 text-right">Opening</th>
                        <th className="p-2 text-right">EMI</th>
                        <th className="p-2 text-right">Principal</th>
                        <th className="p-2 text-right">Interest</th>
                        <th className="p-2 text-right">Closing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reducing.schedule.map((row) => (
                        <tr key={row.m} className="border-b">
                          <td className="p-2">{row.m}</td>
                          <td className="p-2 text-right">{fmt(row.opening)}</td>
                          <td className="p-2 text-right">{fmt(row.emi)}</td>
                          <td className="p-2 text-right">
                            {fmt(row.principal)}
                          </td>
                          <td className="p-2 text-right">
                            {fmt(row.interest)}
                          </td>
                          <td className="p-2 text-right">{fmt(row.closing)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="p-2 font-medium">Total</td>
                        <td />
                        <td className="p-2 text-right font-medium">
                          {fmt(reducing.emi * months)}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {fmt(principal)}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {fmt(reducing.totalInterest)}
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 flex gap-2 print:hidden">
                <button
                  onClick={() => {
                    setPrincipal(100000);
                    setAnnualRate(10);
                    setMonths(12);
                  }}
                  className="px-3 py-2 bg-gray-200 rounded text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={printAll}
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                >
                  Print / Save as PDF
                </button>
                <button
                  onClick={exportCsv}
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                >
                  CSV/Excel Export
                </button>
                {/* quick debug: logs the two variables to the console */}
                <button
                  onClick={flatTableEmail}
                  className="px-3 py-2 bg-gray-700 text-white rounded text-sm"
                >
                  Send EMI Data-Flat
                </button>
                <button
                  onClick={reducingTableEmail}
                  className="px-3 py-2 bg-gray-700 text-white rounded text-sm"
                >
                  Send EMI Data-Reducing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
