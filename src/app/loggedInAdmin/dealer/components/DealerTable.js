"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Image from "next/image";

const DealerTable = ({ dealerData = [] }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  // employee datas

  const dealers = useMemo(() => dealerData || [], [dealerData]);

  const filtered = dealers.filter((e) =>
    [e?.name, e?.email, e?.location, e?.mobile]
      .map((v) => String(v ?? "").toLowerCase())
      .some((v) => v.includes(query.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div className="lg:col-span-2 bg-white dark:bg-gray-500 border rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium mb-3">Dealer Data</h2>
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

          {/* <div className="flex items-center gap-3">
            <button className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Create New Dealer
            </button>
          </div> */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Dealer Id</th>
                <th className="py-2 px-3">Location</th>
                <th className="py-2 px-3">Email</th>
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
                  const key = e._id ?? index;
                  const host = process.env.NEXT_PUBLIC_HOST?.replace(/\/$/, "");
                  const img = e?.image?.replace(/^\//, "");
                  return (
                    <tr
                      key={e._id}
                      className="bg-gray-100 dark:bg-gray-500 hover:bg-gray-600 text-black hover:text-white"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                            <Image
                              src={`${host}/${img}`}
                              alt="Profile Photo"
                              width={200}
                              height={200}
                              className="w-10 h-10 rounded-md items-center justify-center"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{e.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">{e.dealerId}</td>
                      <td className="py-3 px-3">{e.location}</td>
                      <td className="py-3 px-3 text-sm">{e.email}</td>
                      <td className="py-3 px-3 text-sm">{e.mobile}</td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/loggedInAdmin/dealer/profile/${e._id}`}
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <FaUserEdit className="text-2xl" />
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
    </>
  );
};

export default DealerTable;

function statusColor(status) {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "On Leave") return "bg-yellow-100 text-yellow-700";
  if (status === "Inactive") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
}
