"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoanAmortizationPage({ params }) {
  const router = useRouter();
  const { slag } = use(params); // ✅ use() is not needed; just use params directly
  const mySlag = decodeURIComponent(slag);
  const printableRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnDisable, setBtnDisable] = useState(false);

  const getData = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/getCustomerAmortizationData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ loanAccountNumber: mySlag }),
        }
      );

      const json = await res.json();
      if (json.status) {
        setData(json.data);
      } else {
        // console.error("Error:", json.msg);
      }
    } catch (err) {
      // console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [mySlag]);
  const toastOptions = {
    theme: "dark",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const payNow = async (installmentNo, dueDate, amount) => {
    const data = {
      loanAccountNumber: mySlag,
      isCustomer: true,
      installmentNo,
      amount,
      dueDate,
    };
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/adminTxn/txn`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        "admin-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    res = await res.json();
    if (res.status === true) {
      toast.success(res.msg, toastOptions);
      setTimeout(() => {
        location.reload();
      }, 3000);
    } else {
      toast.info(res.msg, toastOptions);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const formatMoney = (n) =>
    n == null
      ? "-"
      : Number(n).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const d = new Date(isoDate);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const handlePrint = () => window.print();

  // 🟡 Wait until data loads
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600 text-lg">Loading amortization data...</p>
      </div>
    );
  }

  // 🔴 Handle missing or invalid data
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          No amortization data found for this customer.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 print:p-0">
      <span className="print:hidden">
        <TopBar />
      </span>
      <ToastContainer />
      <div className="flex relative">
        <span className="print:hidden">
          <SideBar />
        </span>
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="sticky top-6 z-50 flex items-center justify-between bg-transparent mb-6 print:hidden">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
                onClick={() => router.back()}
              >
                Back
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
              >
                Print
              </button>
            </div>

            <div
              ref={printableRef}
              className="bg-white rounded-lg shadow p-6 space-y-6 print:shadow-none print:p-2"
            >
              {/* Header Info */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard title="Customer ID" value={data.customerId} />
                <InfoCard title="Loan Type" value={data.type} />
                <InfoCard title="Tenure" value={`${data.tenure} months`} />
              </section>

              {/* Loan Summary */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryBox
                  title="Loan Amount"
                  value={`₹ ${formatMoney(data.loanAmount)}`}
                />
                <SummaryBox title="Interest Rate" value={`${data.interest}%`} />
                <SummaryBox
                  title="Payable Amount"
                  value={`₹ ${formatMoney(data.payableAmount)}`}
                />
              </section>

              {/* Amortization Table */}
              <section className="pt-2 relative">
                <h3 className="text-lg font-medium mb-3">
                  Amortization Schedule
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 border">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          "Month",
                          "Opening",
                          "EMI",
                          "Principal",
                          "Interest",
                          "Closing",
                          "isOverdue",
                          "#",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2 text-left text-sm text-slate-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {data.emiPayment.map((row, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-sm text-slate-700">
                            {row.month}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.opening)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.emi)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.principal)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.interest)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.closing)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            {new Date(row.dueDate).getTime() < Date.now() ? (
                              <span className="text-red-600 font-semibold text-red-600">
                                Overdue
                              </span>
                            ) : (
                              <span className="text-green-600 font-semibold">
                                Ok
                              </span>
                            )}
                          </td>
                          {btnDisable === false ? (
                            <td className="px-4 py-2 text-sm text-slate-700">
                              {row.status === true ? (
                                <button className="btn bg-purple-400 rounded p-1 px-2 text-black">
                                  Paid
                                </button>
                              ) : (
                                <button
                                  className="btn bg-red-600 rounded hover:bg-amber-500 p-1 px-2 text-white"
                                  onClick={() =>
                                    payNow(row.month, row.dueDate, row.emi)
                                  }
                                >
                                  Pay Now
                                </button>
                              )}
                            </td>
                          ) : (
                            <td>...</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-medium">
                      <tr>
                        <td className="px-4 py-2">Totals</td>
                        <td />
                        <td className="px-4 py-2 text-slate-700">
                          ₹ {formatMoney(data.payableAmount)}
                        </td>
                        <td />
                        <td className="px-4 py-2 text-slate-700">
                          ₹ {formatMoney(data.totalInterest)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <Image
                  src="/Logo.PNG"
                  alt="Watermark"
                  className="w-full absolute top-0 opacity-10 hidden print:block"
                  fill
                />
              </section>

              {/* Footer */}
              <section className="text-sm text-slate-500 relative">
                <div>Record ID: {data._id}</div>
                <div>Created At: {formatDate(data.createdAt)}</div>
                <div>Updated At: {formatDate(data.updatedAt)}</div>
                <div className="italic absolute right-0 top-10">
                  Signature of Customer
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const InfoCard = ({ title, value }) => (
  <div className="p-4 border rounded-md">
    <h2 className="text-sm text-slate-500">{title}</h2>
    <div className="text-lg font-medium text-slate-800">{value}</div>
  </div>
);

const SummaryBox = ({ title, value }) => (
  <div className="p-4 bg-slate-50 rounded-md text-center">
    <div className="text-sm text-slate-500">{title}</div>
    <div className="text-2xl font-semibold text-slate-900">{value}</div>
  </div>
);
