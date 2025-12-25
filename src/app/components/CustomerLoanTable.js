"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  FaTrashAlt,
  FaCalculator,
  FaThList,
  FaPrint,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { HiDocumentCurrencyRupee } from "react-icons/hi2";
import { LuView } from "react-icons/lu";
import { TiTickOutline } from "react-icons/ti";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { redirect, useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdViewCompactAlt } from "react-icons/md";

const CustomerLoanTable = ({ customerLoanData = [] }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loanId, setLoanId] = useState("");
  const [otpValue, setOtpValue] = useState(); // OTP entered by the user
  const pageSize = 5;
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

  // Keep customerLoan derived from props
  const customerLoan = useMemo(
    () => customerLoanData || [],
    [customerLoanData]
  );
  const handleChange = (e) => {
    if (e.target.name == "otp") {
      setOtpValue(e.target.value.slice(0, 6));
    }
  };
  // reset page when data changes
  useEffect(() => {
    setPage(1);
  }, [customerLoanData]);

  // normalize query once
  const q = query.trim().toLowerCase();

  // Filter using the actual keys your UI shows (fullName, fatherName, customerId, mobile, email, role)
  const filtered = customerLoan.filter((e) => {
    if (!q) return true; // no query => keep all
    // create searchable string from the record (coerce to string and lowercase)
    const fields = [
      e.customerId,
      e.loanAccountNumber, // keep both if some records use "name"
      e.amount,
      // e.customerId,
      // e.mobile,
      // e.email,
      // e.role,
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
  const generateOtp = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/generateotptoDelete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: id }),
      }
    );
    const fetchRespose = await res.json();
    console.log(fetchRespose);
    if (fetchRespose.status === true) {
      setIsOpen(true);
      setLoanId(fetchRespose.id);
    }
  };
  const handleDelete = async () => {
    // setIsOpen(true);
    const data = { id: loanId, otp: otpValue };
    console.log(data);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/otpVerify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );
    const fetchRespose = await res.json();
    console.log(fetchRespose);
    if (fetchRespose.status === true) {
      setIsOpen(false);
      toast.success(fetchRespose.msg, toastOptions);
    }
    if (fetchRespose.status === false) {
      toast.info(fetchRespose.msg, toastOptions);
    }
  };
  const getAdminProfile = async () => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/admin/getadmindetail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        // body: JSON.stringify({ email }),
      }
    );
    response = await response.json();
    if (response.login === false) {
      localStorage.removeItem("token");
      redirect("/");
    } else {
    }
  };
  useEffect(() => {
    getAdminProfile();
  }, []);

  return (
    <div className="mb-20">
      <ToastContainer />
      <div className="lg:col-span-2 bg-white dark:bg-gray-500 border rounded-lg shadow-sm p-4">
        {/* Header + Search */}

        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium mb-3 uppercase">
            <button
              onClick={() => router.back()}
              className="bg-blue-800 px-2 pb-1 text-white rounded cursor-pointer hover:bg-blue-900"
            >
              ◀️Back
            </button>{" "}
            Customer&apos;s Loan Data
          </h2>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-56 pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search ..."
            />
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm">
                {/* <th className="py-2 px-3">CIF</th> */}
                <th className="py-2 px-3">Loan A/C</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Calc</th>
                <th className="py-2 px-3">Amortization</th>
                <th className="py-2 px-3">Agreement</th>
                <th className="py-2 px-3">Delete</th>
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
                  const key = e._id ?? e.customerId ?? index;
                  return (
                    <tr
                      key={key}
                      className="bg-gray-100 dark:bg-gray-500 hover:bg-gray-600 text-black hover:text-white"
                    >
                      <td className="py-3 px-3 text-sm uppercase">
                        <Link
                          href={`/loggedInAdmin/loan/statement/${e.loanAccountNumber}`}
                        >
                          {e.loanAccountNumber || "-"}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/loggedInAdmin/loan/viewCustomerLoan/${e._id}`}
                        >
                          {e.amount ?? "-"}
                        </Link>
                      </td>
                      <td className="py-3 px-3">{e.loanType ?? "-"}</td>

                      <td className="py-3 px-3">
                        <Link
                          href={`/loggedInAdmin/loan/emiCalculator/${e.loanAccountNumber}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <FaCalculator
                            className="text-2xl"
                            title="EMI Calculator"
                          />
                        </Link>
                      </td>

                      <td className="py-3 px-3">
                        <Link
                          href={`/loggedInAdmin/loan/amortization/${e.loanAccountNumber}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <FaThList
                            className="text-2xl mx-auto"
                            title="EMI Amortization List"
                          />
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/loggedInAdmin/loan/loanAgreement/${e._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <FaPrint
                            className="text-2xl mx-auto"
                            title="Get Loan Agreement"
                          />
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          className="mx-4"
                          onClick={() => {
                            const id = e._id; // store it in a temp variable
                            setLoanId(id);
                            generateOtp(id); // pass the same id immediately
                          }}
                        >
                          <FaTrashAlt
                            className="text-blue-900 cursor-pointer hover:text-black text-2xl"
                            title="Delete"
                          />
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/loggedInAdmin/loan/viewCustomerLoan/${e.loanAccountNumber}`}
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <MdViewCompactAlt
                              className="text-4xl"
                              title="View"
                            />
                          </Link>
                          <Link
                            href={`/loggedInAdmin/loan/statement/${e.loanAccountNumber}`}
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <HiDocumentCurrencyRupee
                              className="text-3xl"
                              title="View"
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-blue-50 rounded-lg p-8 max-w-md w-full transform transition-all duration-300
                                 animate-[slideIn_0.3s_ease-out] opacity-100 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Warning!</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <p className="text-gray-900">Enter OTP To Delete Loan Account:</p>
              <div className="p-4 rounded-lg">
                <input
                  type="number"
                  className="w-full h-full text-blue-600 rounded border-2 border-gray-900 focus:ring-blue-500"
                  name="otp"
                  value={otpValue ?? ""}
                  onChange={handleChange}
                />
              </div>
              <small className="text-gray-900">
                Account Can Not Be retrive later
              </small>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all hover:scale-105"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLoanTable;
