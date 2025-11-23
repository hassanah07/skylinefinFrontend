"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import React, { useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const DUMMY_CUSTOMERS = [
  { id: "c1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "c2", name: "Bob Martinez", email: "bob@example.com" },
  { id: "c3", name: "Clara Oswald", email: "clara@example.com" },
];

const DUMMY_MANAGERS = [
  { id: "m1", name: "Eve Thompson", email: "eve@company.com" },
  { id: "m2", name: "Frank Gilbert", email: "frank@company.com" },
];

const DUMMY_EMPLOYEES = [
  { id: "e1", name: "George King", email: "george@company.com" },
  { id: "e2", name: "Hannah Lee", email: "hannah@company.com" },
  { id: "e3", name: "Ian Scott", email: "ian@company.com" },
];

const INITIAL_TRANSACTIONS = [];

function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function Page() {
  const [customers] = useState(DUMMY_CUSTOMERS);
  const [managers] = useState(DUMMY_MANAGERS);
  const [employees] = useState(DUMMY_EMPLOYEES);

  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [customerToggle, setCustomerToggle] = useState(false);
  const [investorToggle, setInvestorToggle] = useState(false);
  const [marchantToggle, setMarchantToggle] = useState(false);
  const [employeeToggle, setEmployeeToggle] = useState(false);

  const handleSelect = (selected) => {
    setEmployeeToggle(selected === "employee");
    setInvestorToggle(selected === "investor");
    setMarchantToggle(selected === "marchant");
    setCustomerToggle(selected === "customer");
  };

  const [transactions, setTransactions] = useState(() => {
    // initialize dates on the client to avoid server/client hydration differences
    const now = Date.now();
    return [
      {
        id: uuidv4(),
        actorType: "customer",
        actorId: "c1",
        actorName: "Alice Johnson",
        type: "purchase",
        amount: 120.5,
        status: "pending",
        date: new Date(now).toISOString(),
        note: "Initial purchase",
      },
      {
        id: uuidv4(),
        actorType: "manager",
        actorId: "m1",
        actorName: "Eve Thompson",
        type: "refund",
        amount: 75,
        status: "approved",
        date: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        note: "Processed refund",
      },
      {
        id: uuidv4(),
        actorType: "employee",
        actorId: "e2",
        actorName: "Hannah Lee",
        type: "salary",
        amount: 2000,
        status: "approved",
        date: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
        note: "Monthly salary",
      },
    ];
  });

  const [filterType, setFilterType] = useState("all"); // all / customer / manager / employee
  const [filterStatus, setFilterStatus] = useState("all"); // all / pending / approved / rejected
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    actorType: "customer",
    actorId: customers[0]?.id || "",
    type: "transfer",
    amount: "",
    note: "",
  });

  const stats = useMemo(() => {
    const total = transactions.length;
    const pending = transactions.filter((t) => t.status === "pending").length;
    const approved = transactions.filter((t) => t.status === "approved").length;
    const rejected = transactions.filter((t) => t.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (filterType === "all" ? true : t.actorType === filterType))
      .filter((t) =>
        filterStatus === "all" ? true : t.status === filterStatus
      )
      .filter((t) => {
        if (search.trim() === "") return true;
        const s = search.toLowerCase();
        return (
          t.actorName.toLowerCase().includes(s) ||
          t.type.toLowerCase().includes(s) ||
          String(t.amount).toLowerCase().includes(s)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, filterStatus, search]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!form.actorId || !form.amount || Number(form.amount) <= 0) return;
    const actorList =
      form.actorType === "customer"
        ? customers
        : form.actorType === "manager"
        ? managers
        : employees;
    const actor = actorList.find((a) => a.id === form.actorId);
    const newTx = {
      id: uuidv4(),
      actorType: form.actorType,
      actorId: form.actorId,
      actorName: actor ? actor.name : "Unknown",
      type: form.type,
      amount: Number(form.amount),
      status: "pending",
      date: new Date().toISOString(),
      note: form.note,
    };
    setTransactions((t) => [newTx, ...t]);
    setForm((f) => ({ ...f, amount: "", note: "" }));
  }

  function changeStatus(id, status) {
    setTransactions((t) =>
      t.map((tx) => (tx.id === id ? { ...tx, status } : tx))
    );
  }

  function removeTransaction(id) {
    if (!confirm("Delete this transaction?")) return;
    setTransactions((t) => t.filter((tx) => tx.id !== id));
  }
  const getEmployee = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/employeeCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      console.log(res.getData);
      if (res.login === true) {
        setEmployeeData(res.getData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update actorId options when actorType changes
  useEffect(() => {
    const list =
      form.actorType === "customer"
        ? customers
        : form.actorType === "manager"
        ? managers
        : employees;
    if (list.length) setForm((f) => ({ ...f, actorId: list[0].id }));
  }, [form.actorType, customers, managers, employees]);

  useEffect(() => {
    getEmployee();
  }, [employeeToggle]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Transactions - Admin</h1>
                <p className="text-sm ">
                  Manage transactions for customers, managers, and employees.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-3 gap-2 bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
                  <div className="text-center px-3">
                    <div className="text-xs ">Total</div>
                    <div className="text-sm font-medium">{stats.total}</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-xs ">Pending</div>
                    <div className="text-sm font-medium text-amber-600">
                      {stats.pending}
                    </div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-xs ">Approved</div>
                    <div className="text-sm font-medium text-green-600">
                      {stats.approved}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form column */}
              <section className="col-span-1 lg:col-span-1 bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                <h2 className="text-lg font-medium mb-3">Create Transaction</h2>
                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <h3 className="mb-4 font-semibold text-heading">Action</h3>
                    <ul className="w-full bg-neutral-primary-soft border border-default rounded-base">
                      <li className="w-full border-b border-default">
                        <div className="flex items-center ps-3">
                          <input
                            id="list-radio-license"
                            type="radio"
                            value=""
                            checked={employeeToggle}
                            onChange={() => handleSelect("employee")}
                            name="list-radio"
                            className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                          />
                          <label
                            htmlFor="list-radio-license"
                            className="w-full py-3 select-none ms-2 text-sm font-medium text-heading"
                          >
                            Employee
                          </label>
                        </div>
                      </li>
                      <li className="w-full border-b border-default">
                        <div className="flex items-center ps-3">
                          <input
                            id="list-radio-id"
                            type="radio"
                            value=""
                            checked={marchantToggle}
                            onChange={() => handleSelect("marchant")}
                            name="list-radio"
                            className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                          />
                          <label
                            htmlFor="list-radio-id"
                            className="w-full py-3 select-none ms-2 text-sm font-medium text-heading"
                          >
                            Marchant
                          </label>
                        </div>
                      </li>
                      <li className="w-full border-b border-default">
                        <div className="flex items-center ps-3">
                          <input
                            id="list-radio-military"
                            type="radio"
                            value=""
                            checked={investorToggle}
                            onChange={() => handleSelect("investor")}
                            name="list-radio"
                            className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                          />
                          <label
                            htmlFor="list-radio-military"
                            className="w-full py-3 select-none ms-2 text-sm font-medium text-heading"
                          >
                            Investor
                          </label>
                        </div>
                      </li>
                      <li className="w-full border-b border-default">
                        <div className="flex items-center ps-3">
                          <input
                            id="list-radio-passport"
                            type="radio"
                            value=""
                            checked={customerToggle}
                            onChange={() => handleSelect("customer")}
                            name="list-radio"
                            className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                          />
                          <label
                            htmlFor="list-radio-passport"
                            className="w-full py-3 select-none ms-2 text-sm font-medium text-heading"
                          >
                            Customer
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {employeeToggle == true && (
                    <div>
                      <select
                        name="employee"
                        id="employee"
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      >
                        <option value="">Select Employee</option>
                        {employeeData?.map((data, index) => {
                          return (
                            <option value={data._id} key={index}>
                              {data.f_name} {data.l_name}
                            </option>
                          );
                        })}
                      </select>
                      <input type="text" value={selectedEmployeeId} readOnly />
                    </div>
                  )}
                  {marchantToggle == true && <div>good marchant</div>}
                  {investorToggle == true && <div>good Investor</div>}
                  {customerToggle == true && <div>good customert</div>}

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white">
                      Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2"
                    >
                      <option value="transfer">Transfer</option>
                      <option value="purchase">Purchase</option>
                      <option value="refund">Refund</option>
                      <option value="salary">Salary</option>
                      <option value="Commission">Commission</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white">
                      Amount
                    </label>
                    <input
                      name="amount"
                      value={form.amount}
                      onChange={handleFormChange}
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2"
                      placeholder="e.g., 99.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white">
                      Note
                    </label>
                    <input
                      name="note"
                      value={form.note}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2"
                      placeholder="Optional note"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </section>

              {/* Filters + list */}
              <section className="col-span-1 lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="rounded-md border-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2"
                      >
                        <option value="all">All Actors</option>
                        <option value="customer">Customers</option>
                        <option value="manager">Managers</option>
                        <option value="employee">Employees</option>
                      </select>

                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-md border-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, type or amount"
                        className="rounded-md border-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 min-w-[220px]"
                      />
                    </div>

                    <div className="text-sm ">
                      Showing{" "}
                      <span className="font-medium">{filtered.length}</span>{" "}
                      results
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {filtered.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                          {tx.actorName
                            .split(" ")
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">
                              {tx.actorName}
                            </div>
                            <div className="text-xs px-2 py-1 rounded">
                              {tx.actorType}
                            </div>
                            <div className="text-xs px-2 py-1 rounded border">
                              {tx.type}
                            </div>
                          </div>
                          <div className="text-sm text-slate-300">
                            {tx.note}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDate(tx.date)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-auto">
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ${tx.amount.toFixed(2)}
                          </div>
                          <div
                            className={`text-sm ${
                              tx.status === "pending"
                                ? "text-amber-600"
                                : tx.status === "approved"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.status}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {tx.status !== "approved" && (
                            <button
                              onClick={() => changeStatus(tx.id, "approved")}
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                            >
                              Approve
                            </button>
                          )}
                          {tx.status !== "rejected" && (
                            <button
                              onClick={() => changeStatus(tx.id, "rejected")}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => removeTransaction(tx.id)}
                            className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-yellow-900"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filtered.length === 0 && (
                    <div className="bg-white p-6 rounded-md text-center ">
                      No transactions found.
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
