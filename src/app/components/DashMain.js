"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const DashMain = ({ telly = [] }) => {
  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Admins count data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Admins
              </div>
              <div className="text-2xl font-semibold">{telly?.admin}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.admin}
            </div>
          </div>
          <Link href="/loggedInAdmin/admin">
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500"
                style={{
                  width: `${Math.min(
                    100,
                    (parseFloat(telly?.admin) || 50) % 100
                  )}%`,
                }}
              />
            </div>
          </Link>
        </div>
        {/* customer count data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Customers
              </div>
              <div className="text-2xl font-semibold">{telly?.customer}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.customer}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.customer) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/* Employee Count Data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-red-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Employees
              </div>
              <div className="text-2xl font-semibold">{telly?.employee}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.employee}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.employee) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Total Onboard Marchant */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Marchant
              </div>
              <div className="text-2xl font-semibold">{telly?.employee}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.employee}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.employee) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/* total onboard Investor */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Investor
              </div>
              <div className="text-2xl font-semibold">{telly?.employee}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.employee}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.employee) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/* Loan Count Data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-green-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Loan
              </div>
              <div className="text-2xl font-semibold">{telly?.loan}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.loan}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.loan) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/* pending loan count data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-purple-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Pending Loans
              </div>
              <div className="text-2xl font-semibold">{telly?.pendingLoan}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.pendingLoan}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.pendingLoan) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/* pending loan count data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Total Recurring
              </div>
              <div className="text-2xl font-semibold">{telly?.pendingLoan}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.pendingLoan}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.pendingLoan) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/* pending loan count data */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-green-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Pending Recurring
              </div>
              <div className="text-2xl font-semibold">{telly?.pendingLoan}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.pendingLoan}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.pendingLoan) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        {/*  */}
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-indigo-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                customer grievance
              </div>
              <div className="text-2xl font-semibold">{telly?.pendingLoan}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.pendingLoan}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.pendingLoan) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-500 border rounded-lg shadow-2xl dark:shadow-cyan-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-white">
                Contacts
              </div>
              <div className="text-2xl font-semibold">{telly?.pendingLoan}</div>
            </div>
            <div className="text-sm font-medium text-red-200">
              {telly?.pendingLoan}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  100,
                  (parseFloat(telly?.pendingLoan) || 50) % 100
                )}%`,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default DashMain;
