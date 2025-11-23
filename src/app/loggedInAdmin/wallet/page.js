"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import React, { useEffect, useMemo, useState, useRef } from "react";

const STORAGE_KEY = "admin_wallet_demo_v1";

function formatCurrency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "INR" });
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// Create sample data on the client when needed to avoid server/client mismatches
function createSampleData() {
  return {
    balance: 12500,
    transactions: [
      {
        id: uid(),
        type: "income",
        amount: 5000,
        note: "Client payment",
        date: todayISO(),
      },
      {
        id: uid(),
        type: "expense",
        amount: 200,
        note: "Team lunch",
        date: todayISO(),
      },
      {
        id: uid(),
        type: "income",
        amount: 3000,
        note: "Subscription",
        date: todayISO(),
      },
    ],
  };
}

export default function Page() {
  // Start with null to ensure server and client initial render match; load actual data on mount
  const [state, setState] = useState(null);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [modal, setModal] = useState(null); // 'add' | 'withdraw' | 'transfer' | null
  const [form, setForm] = useState({ amount: "", note: "", target: "" });
  const [page, setPage] = useState(1);
  const perPage = 6;
  const mounted = useRef(false);

  useEffect(() => {
    // Load persisted state from localStorage on client only; if not present, create sample data here
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw));
      } else {
        setState(createSampleData());
      }
    } catch {
      setState(createSampleData());
    }
  }, []);

  useEffect(() => {
    if (mounted.current && state !== null) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    } else {
      mounted.current = true;
    }
  }, [state]);

  // While loading initial state, render a minimal placeholder so server/client HTML matches
  const totals = useMemo(() => {
    if (!state) return { balance: 0, income: 0, expense: 0 };
    const income = state.transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = state.transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { balance: state.balance, income, expense };
  }, [state]);

  const filtered = useMemo(() => {
    const transactions = state?.transactions || [];
    let arr = [...transactions];
    if (query)
      arr = arr.filter((t) =>
        (t.note || "").toLowerCase().includes(query.toLowerCase())
      );
    if (filterType !== "all") arr = arr.filter((t) => t.type === filterType);
    if (dateFrom) arr = arr.filter((t) => t.date >= dateFrom);
    if (dateTo) arr = arr.filter((t) => t.date <= dateTo);
    return arr;
  }, [state, query, filterType, dateFrom, dateTo]);

  if (state === null) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading...</div>
        </div>
      </div>
    );
  }

  function addTransaction(type, amount, note, extra = {}) {
    amount = Number(amount);
    if (!amount || amount <= 0) return false;
    const tx = { id: uid(), type, amount, note, date: todayISO(), ...extra };
    setState((prev) => {
      const nextBalance =
        type === "income" ? prev.balance + amount : prev.balance - amount;
      return {
        ...prev,
        balance: nextBalance,
        transactions: [tx, ...prev.transactions],
      };
    });
    return true;
  }

  function handleSubmit(kind) {
    const ok = addTransaction(
      kind === "add" ? "income" : "expense",
      form.amount,
      form.note,
      kind === "transfer" ? { target: form.target } : {}
    );
    if (ok) {
      setForm({ amount: "", note: "", target: "" });
      setModal(null);
    } else {
      alert("Enter a valid amount");
    }
  }

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  function exportCSV() {
    const header = ["id", "date", "type", "amount", "note", "target"];
    const rows = state.transactions.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amount,
      `"${(t.note || "").replace(/"/g, '""')}"`,
      t.target || "",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Admin Wallet</h1>
                <p className="text-sm">Overview and transaction management</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setModal("add");
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Funds
                </button>
                <button
                  onClick={() => {
                    setModal("withdraw");
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => {
                    setModal("transfer");
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Transfer
                </button>
              </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-2xl dark:shadow-blue-300">
                <div className="text-xs uppercase ">Balance</div>
                <div className="mt-2 text-2xl font-medium ">
                  {formatCurrency(totals.balance)}
                </div>
                <div className="mt-2 text-sm">Available funds in wallet</div>
              </div>

              <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-2xl dark:shadow-blue-500 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase">Total Income</div>
                  <div className="mt-2 text-xl font-medium">
                    {formatCurrency(totals.income)}
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  Including of all incoming transactions
                </div>
              </div>

              <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-2xl dark:shadow-yellow-500 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase">Total Expense</div>
                  <div className="mt-2 text-xl font-medium">
                    {formatCurrency(totals.expense)}
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  Including of all outgoing transactions
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-3 bg-white dark:bg-slate-700 p-4 rounded-lg shadow-xl dark:shadow-indigo-500">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search notes..."
                      className="px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500"
                    />
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 border rounded-md"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        setFilterType("all");
                        setQuery("");
                      }}
                      className="px-3 py-1 bg-green-600 rounded-md"
                    >
                      Reset
                    </button>
                    <button
                      onClick={exportCSV}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-500">
                <thead className="bg-gray-500 dark:text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-50">Date</th>
                    <th className="px-4 py-2 text-left text-gray-50">Note</th>
                    <th className="px-4 py-2 text-right text-gray-50">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-gray-50">Type</th>
                    <th className="px-4 py-2 text-left text-gray-50">Target</th>
                    <th className="px-4 py-2 text-center text-gray-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-400">
                  {current.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                  {current.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 text-sm">{tx.date}</td>
                      <td className="px-4 py-3 text-sm">{tx.note || "-"}</td>
                      <td
                        className={`px-4 py-3 text-sm font-medium text-right ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm">{tx.type}</td>
                      <td className="px-4 py-3 text-sm">{tx.target || "-"}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <button
                          onClick={() => removeTx(tx.id)}
                          className="px-2 py-1 text-sm text-white bg-blue-500 rounded-xs"
                        >
                          Refund
                        </button>

                        <button
                          onClick={() => removeTx(tx.id)}
                          className="px-2 py-1 text-sm text-white ml-2 bg-red-500 rounded-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between dark:bg-green-700 rounded-xl">
              <div className="text-sm pl-2">
                Showing {Math.min(filtered.length, (page - 1) * perPage + 1)}-
                {Math.min(filtered.length, page * perPage)} of {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded-md"
                  disabled={page === 1}
                >
                  Prev
                </button>
                <div className="px-3 py-1 text-sm">
                  {page}/{pages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="px-3 py-1 border rounded-md"
                  disabled={page === pages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setModal(null)}
          />
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <h2 className="text-lg font-medium mb-4">
              {modal === "add"
                ? "Add Funds"
                : modal === "withdraw"
                ? "Withdraw Funds"
                : "Transfer Funds"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Amount</label>
                <input
                  autoFocus
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Note</label>
                <input
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              {modal === "transfer" && (
                <div>
                  <label className="block text-sm text-gray-600">
                    Target (email or id)
                  </label>
                  <input
                    value={form.target}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, target: e.target.value }))
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="px-3 py-2 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(modal)}
                className={`px-3 py-2 rounded-md text-white ${
                  modal === "add"
                    ? "bg-green-600"
                    : modal === "withdraw"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
              >
                {modal === "add"
                  ? "Add"
                  : modal === "withdraw"
                  ? "Withdraw"
                  : "Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
