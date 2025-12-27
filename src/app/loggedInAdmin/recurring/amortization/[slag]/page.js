"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoanAmortizationPage({ params }) {
  const router = useRouter();
  const { slag } = use(params); // ✅ use() is not needed; just use params directly
  const mySlag = decodeURIComponent(slag);
  const printableRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paidPeriods, setPaidPeriods] = useState({});
  const toastOptions = useMemo(
    () => ({
      theme: "colored",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }),
    []
  );
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/recurring/schedule`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "admin-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ id: mySlag }),
          }
        );

        const json = await res.json();
        // console.log(json.data);
        setData(json.data);

        // Initialize paidPeriods from recurringPayment
        const paid = {};
        json.data?.recurringPayment.forEach((p) => {
          if (p.status) {
            paid[p.month] = {
              txnNumber: p.txnNumber,
              paymentDate: new Date(p.paymentDate),
            };
          }
        });

        setPaidPeriods(paid);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [mySlag]);
  const totalPayableAmount = data?.recurringPayment.reduce(
    (sum, p) => sum + p.principal,
    0
  );
  const remainingAmount = data?.recurringPayment
    .filter((p) => !p.status) // only unpaid
    .reduce((sum, p) => sum + p.recurring + p.fine, 0);

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

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
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
          <div
            className="bg-blue-600 text-white w-14 px-2 rounded cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </div>
          No amortization data found for this customer.
        </p>
      </div>
    );
  }
  // Paynow button functioning
  const handlePayNow = async (period, event, amount) => {
    event.preventDefault();
    const txnNumber = `TXN_${Date.now()}`;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/recurring/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            id: mySlag,
            recurringNumber: Number(period),
            txnNumber: txnNumber,
            amount: amount,
          }),
        }
      );

      const json = await res.json();
      if (json.success === true) {
        toast.success(json.message, toastOptions);
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
      if (!json.success) {
        toast.info(json.message, toastOptions);
        return;
      }

      // ✅ Update UI immediately
      setPaidPeriods((prev) => ({
        ...prev,
        [period]: {
          txnNumber, // txnNumber is not defined at here
          paymentDate: new Date(),
        },
      }));
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  const handleMarkUnpaid = async (period, event) => {
    event.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/recurring/unpay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            id: mySlag,
            recurringNumber: period,
          }),
        }
      );

      const json = await res.json();
      if (json.success === true) {
        toast.success(json.message, toastOptions);
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
      if (!json.success) {
        alert(json.message);
        return;
      }

      // ✅ Update UI
      setPaidPeriods((prev) => {
        const updated = { ...prev };
        delete updated[period];
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 print:p-0">
      <span className="print:hidden">
        <TopBar />
      </span>
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
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InfoCard title="Customer ID" value={data.customerId} />
                <InfoCard title="Recurring Id" value={data.recurringId} />
                <InfoCard
                  title="Loan Type"
                  value={
                    data.frequency === 1
                      ? "Monthly"
                      : data.frequency === 2
                      ? "Weekly"
                      : "Daily"
                  }
                />
                <InfoCard
                  title="Tenure"
                  value={`${data.repaymentPeriod} Months`}
                />
              </section>

              {/* Loan Summary */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryBox
                  title="Recurring Amount"
                  value={`₹ ${formatMoney(data.amount)}`}
                />
                <SummaryBox
                  title="Interest Rate"
                  value={`${data.interestPercentage}%`}
                />
                <SummaryBox
                  title="Total Payable"
                  value={`₹ ${formatMoney(totalPayableAmount)}`}
                />
                <SummaryBox
                  title="Remaining Payable"
                  value={`₹ ${formatMoney(remainingAmount)}`}
                />
                <SummaryBox
                  title="Due Date"
                  value={formatDate(data.nextPaymentDate)}
                />
                <SummaryBox
                  title="Total Paid"
                  value={`₹ ${formatMoney(
                    totalPayableAmount - remainingAmount
                  )}`}
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
                          "SL",
                          "Opening",
                          "Month",
                          "Principal",
                          "Interest",
                          "Closing",
                          "#",
                        ].map((h, i) => (
                          <th
                            key={i}
                            className="px-4 py-2 text-left text-sm text-slate-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {data?.schedule.map((row, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-sm text-slate-700">
                            {row.period}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.balance - row.payment)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            {row.period}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.payment)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.interest)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            ₹ {formatMoney(row.balance)}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            {paidPeriods[row.period] ? (
                              <button
                                className="bg-green-600 text-white py-1 px-3 rounded text-sm"
                                onClick={(event) =>
                                  handleMarkUnpaid(row.period, event)
                                }
                              >
                                Paid
                              </button>
                            ) : (
                              <button
                                className="bg-red-700 text-white py-1 px-2 rounded hover:bg-blue-600"
                                onClick={(event) =>
                                  handlePayNow(row.period, event, row.payment)
                                }
                              >
                                Pay Now
                              </button>
                            )}
                          </td>
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
                  src="/Logo.png"
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
  <div className="p-4 border shadow-2xl shadow-blue-600 rounded-md">
    <h2 className="text-sm text-slate-500">{title}</h2>
    <div className="text-lg font-medium text-slate-800">{value}</div>
  </div>
);

const SummaryBox = ({ title, value }) => (
  <div className="p-4 bg-slate-50 shadow-2xl shadow-amber-700 rounded-md text-center">
    <div className="text-sm text-slate-500">{title}</div>
    <div className="text-2xl font-semibold text-slate-900">{value}</div>
  </div>
);
