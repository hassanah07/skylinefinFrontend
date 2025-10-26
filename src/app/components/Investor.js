"use client";
import React, { useMemo, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

const InvestorTable = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // employee datas

  const employees = useMemo(
    () => [
      {
        id: 1,
        name: "Alice Johnson",
        role: "HR Manager",
        email: "alice@example.com",
        status: "Active",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Manager",
        email: "bob@example.com",
        status: "Active",
      },
      {
        id: 3,
        name: "Anowarul Hassan",
        role: "MERN Developer",
        email: "contact@hassan.dev",
        status: "Present",
      },
      {
        id: 4,
        name: "David Lee",
        role: "Field Officer",
        email: "david@example.com",
        status: "Active",
      },
      {
        id: 5,
        name: "Eve Turner",
        role: "EMI Collector",
        email: "eve@example.com",
        status: "Active",
      },
      {
        id: 6,
        name: "Frank Wu",
        role: "Loan Processor",
        email: "frank@example.com",
        status: "Active",
      },
      {
        id: 7,
        name: "Asmot Ali",
        role: "Recruiter",
        email: "asmot@eskylineefinance.com",
        status: "Active",
      },
      {
        id: 8,
        name: "Hiro Tanaka",
        role: "Sales Executive",
        email: "hiro@example.com",
        status: "Active",
      },
    ],
    []
  );

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.email.toLowerCase().includes(query.toLowerCase()) ||
      e.role.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <div className="lg:col-span-2 bg-white dark:bg-gray-500 border rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium mb-3">Investor</h2>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-56 pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search employees, roles, emails..."
            />
            <CiSearch className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              New Investor
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    No results
                  </td>
                </tr>
              ) : (
                paginated.map((e) => (
                  <tr
                    key={e.id}
                    className="bg-gray-100 dark:bg-gray-500 hover:bg-gray-600 text-black hover:text-white"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                          {e.name
                            .split(" ")
                            .map((x) => x[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium">{e.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">{e.role}</td>
                    <td className="py-3 px-3 text-sm">{e.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                          e.status
                        )}`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline">
                          <FaUserEdit className="text-2xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            Showing {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-yellow-500 cursor-pointer disabled:opacity-50"
            >
              Prev
            </button>
            <div className="px-3 py-1 border rounded-md">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-yellow-500 cursor-pointer disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorTable;

function statusColor(status) {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "On Leave") return "bg-yellow-100 text-yellow-700";
  if (status === "Inactive") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
}
