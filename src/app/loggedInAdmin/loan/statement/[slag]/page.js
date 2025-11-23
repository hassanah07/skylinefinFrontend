"use client";
import React, { useRef, useState } from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";

/**
 * Loan Transaction Statement Page (Next.js app route)
 * - Responsive Tailwind CSS layout
 * - Print button (window.print)
 * - Download as PDF (html2canvas + jsPDF via dynamic import)
 *
 * Save this file as:
 * /C:/Users/ANOWARUL HASSAN/Desktop/current/HR Management/Admin/myapp/src/app/loggedInAdmin/loan/statement/[slag]/page.js
 */

export default function Page() {
  const statementRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  // Example data (replace with real data / fetch)
  const account = {
    name: "John Doe",
    id: "LN-2025-001",
    product: "Home Loan",
    period: "01 Jan 2025 - 31 Oct 2025",
    balance: 12650.75,
  };

  const transactions = [
    {
      date: "2025-10-25",
      desc: "Monthly Installment",
      debit: 0,
      credit: 750.0,
      balance: 12650.75,
    },
    {
      date: "2025-09-25",
      desc: "Penalty Fee",
      debit: 25.0,
      credit: 0,
      balance: 13400.75,
    },
    {
      date: "2025-08-25",
      desc: "Monthly Installment",
      debit: 0,
      credit: 750.0,
      balance: 13425.75,
    },
    {
      date: "2025-07-25",
      desc: "Disbursement",
      debit: 15000.0,
      credit: 0,
      balance: 14175.75,
    },
  ];

  const formatCurrency = (v) =>
    v === 0
      ? "-"
      : v
      ? v.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "-";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!statementRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const node = statementRef.current;
      // Increase scale for better quality
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 size in mm: 210 x 297
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;

      // convert canvas px to mm for height
      const pxPerMm = canvas.width / imgWidth;
      const imgHeight = canvas.height / pxPerMm;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`loan-statement-${account.id}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setExporting(false);
    }
  };
  const printStyles = `
        @media print {
            .no-print { display: none !important; }
            .page { margin: 0; box-shadow: 10px; -webkit-print-color-adjust: exact; }
            html, body { height: auto; zoom:95%; }
            .bg-logo { opacity: 0.04 !important; }
            .pagebreak { page-break-after: always; break-after: page; }
        }

        /* page-level layout */
        .page { position: relative; overflow: hidden; }

        /* background logo: centered and scaled to always fit nicely */
        .bg-logo {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 65%;
            max-width: 900px;
            height: auto;
            max-height: 900px;
            opacity: 0.08;
            pointer-events: none;
            user-select: none;
            z-index: 0;
            object-fit: contain;
        }

        /* slightly smaller on smaller screens */
        @media (max-width: 768px) {
            .bg-logo { width: 80%; max-width: 600px; max-height: 600px; opacity: 0.06; }
        }

        /* ensure page content sits above the logo */
        .page > .page-content { position: relative; z-index: 10; }
    `;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black print:dark:bg-white">
      <span className="no-print">
        <TopBar />
      </span>
      <div className="flex relative">
        <span className="no-print">
          <SideBar />
        </span>
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Loan Statement
              </h1>

              <div className="space-x-2">
                <button
                  onClick={handlePrint}
                  className="print:hidden inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 cursor-pointer hover:border-none hover:my-[1px] dark:hover:bg-gray-600 border border-gray-300 rounded shadow-sm text-sm hover:bg-gray-50"
                  title="Print statement"
                >
                  Print
                </button>

                {/* <button
                  onClick={handleDownloadPdf}
                  disabled={exporting}
                  className="print:hidden inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded shadow-sm text-sm disabled:opacity-60"
                  title="Download as PDF"
                >
                  {exporting ? "Preparing..." : "Download PDF"}
                </button> */}
              </div>
            </div>

            <div
              ref={statementRef}
              className="bg-white dark:bg-gray-700 border shadow-blue-500 shadow-2xl rounded-lg p-6 print:shadow-none print:dark:bg-white print:border-0"
              style={{ color: "#111827" }}
            >
              {/* Header */}
              <style>{printStyles}</style>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-sm dark:text-white">Account</div>
                  <div className="text-lg font-medium dark:text-white">
                    {account.name}
                  </div>
                  <div className="text-sm dark:text-white">
                    {account.product} • {account.id}
                  </div>
                </div>

                <div className="flex gap-4 mt-2 md:mt-0">
                  <div className="text-right">
                    <div className="text-sm dark:text-white">
                      Statement Period
                    </div>
                    <div className="font-medium dark:text-white">
                      {account.period}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm dark:text-white">
                      Outstanding Balance
                    </div>
                    <div className="text-xl font-semibold text-rose-600 dark:text-rose-400">
                      ₹{formatCurrency(account.balance)}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-dashed" />

              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-black dark:text-white rounded">
                  <div className="text-xs ">Total Disbursed</div>
                  <div className="font-medium">৳ 15,000.00</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-black dark:text-white rounded">
                  <div className="text-xs ">Total Paid</div>
                  <div className="font-medium">৳ 350.00</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-black dark:text-white rounded">
                  <div className="text-xs ">Next Due Date</div>
                  <div className="font-medium">25 Nov 2025</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-black dark:text-white rounded">
                  <div className="text-xs ">Status</div>
                  <div className="font-medium text-emerald-600">Active</div>
                </div>
              </div>

              {/* Transactions table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Debit (₹)</th>
                      <th className="text-right p-3">Credit (₹)</th>
                      <th className="text-right p-3">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-500"
                            : "bg-gray-400"
                        }
                      >
                        <td className="p-3 align-top dark:text-white">
                          {t.date}
                        </td>
                        <td className="p-3 align-top dark:text-white">
                          {t.desc}
                        </td>
                        <td className="p-3 text-right align-top dark:text-white">
                          {formatCurrency(t.debit)}
                        </td>
                        <td className="p-3 text-right align-top dark:text-white">
                          {formatCurrency(t.credit)}
                        </td>
                        <td className="p-3 text-right align-top dark:text-white">
                          {formatCurrency(t.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-sm dark:text-white">
                Note: This statement is computer generated and does not require
                a signature.
              </div>
            </div>

            <div className="mt-6 text-xs print:hidden">
              Tip: Use the{" "}
              <b>
                <u>Print</u>
              </b>{" "}
              button (choose{" "}
              <b>
                <u>Save as PDF</u>
              </b>{" "}
              ) if you prefer to print or save as pdf.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
