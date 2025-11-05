"use client";
import React, { useMemo, useState, useEffect } from "react";
import { FaUserEdit, FaPlusCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";

const CustomerTable = ({ customerData = [] }) => {
  // For debugging
  // console.log(customerData);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Keep customers derived from props
  const customers = useMemo(() => customerData || [], [customerData]);

  // reset page when data changes
  useEffect(() => {
    setPage(1);
  }, [customerData]);

  // normalize query once
  const q = query.trim().toLowerCase();

  // Filter using the actual keys your UI shows (fullName, fatherName, customerId, mobile, email, role)
  const filtered = customers.filter((e) => {
    if (!q) return true; // no query => keep all
    // create searchable string from the record (coerce to string and lowercase)
    const fields = [
      e.fullName,
      e.name, // keep both if some records use "name"
      e.fatherName,
      e.customerId,
      e.mobile,
      e.email,
      e.role,
    ];
    const joined = fields
      .map((f) =>
        f === undefined || f === null ? "" : String(f).toLowerCase()
      )
      .join(" ");
    return joined.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mb-20">
      <div className="lg:col-span-2 bg-white dark:bg-gray-500 border rounded-lg shadow-sm p-4">
        {/* Header + Search */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium mb-3 uppercase">Customer Data</h2>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-56 pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search name, father, id, mobile, email..."
            />
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm">
                <th className="py-2 px-3">Name</th>
                {/* <th className="py-2 px-3">Father&apos;s Name</th> */}
                <th className="py-2 px-3">Customer ID</th>
                <th className="py-2 px-3">Mobile</th>
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
                paginated.map((e, index) => {
                  const key = e.id ?? e.customerId ?? index;
                  return (
                    <tr
                      key={key}
                      className="bg-gray-100 dark:bg-gray-500 hover:bg-gray-600 text-black hover:text-white"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                            {(e.fullName || e.name || "")
                              .split(" ")
                              .map((x) => x[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium uppercase">
                              {e.fullName || e.name || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* <td className="py-3 px-3 text-sm uppercase">
                        {e.fatherName || "-"}
                      </td> */}
                      <td className="py-3 px-3">
                        <Link
                          href={`/loggedInAdmin/loan/viewLoan/${
                            e.customerId ?? "-"
                          }`}
                        >
                          {e.customerId ?? "-"}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-sm">{e.mobile ?? "-"}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/loggedInAdmin/customer/profile/${e._id}`}
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <FaUserEdit
                              className="text-2xl"
                              title="Edit Customer Profile"
                            />
                          </Link>
                          <Link
                            href={`/loggedInAdmin/loan/stepOne/${e._id}`}
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <FaPlusCircle
                              className="text-2xl"
                              title="Process Loan"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
    </div>
  );
};

export default CustomerTable;
