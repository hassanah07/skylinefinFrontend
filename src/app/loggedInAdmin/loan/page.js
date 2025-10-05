"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const salary = 250000;
  const router = useRouter();
  return (
    <div className="sm:rounded-lg w-2/3 mx-auto pt-16 relative">
      <button
        className="absolute left-0 top-0 bg-red-500 text-white px-4 py-2 rounded m-4 text-xl hover:bg-blue-600"
        onClick={() => {
          router.back();
        }}
      >
        🔙
      </button>
      <Link
        href="/loggedInAdmin/loan/addLoan"
        className="absolute right-0 top-0 bg-blue-500 text-white px-4 py-2 rounded m-4 hover:bg-blue-600"
      >
        Add Loan ➕
      </Link>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                customer name
              </th>
              <th scope="col" className="px-6 py-3">
                Loan ID
              </th>
              <th scope="col" className="px-6 py-3">
                Loan Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Total Emi
              </th>
              <th scope="col" className="px-6 py-3">
                Running Emi
              </th>
              <th scope="col" className="px-6 py-3">
                Failed Emi
              </th>
              <th scope="col" className="px-6 py-3">
                Interest Earned
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Asmot Hussain Khan
              </th>
              <td className="px-6 py-4">52992025271</td>
              <td className="px-6 py-4">₹1,50,000</td>
              <td className="px-6 py-4">36</td>
              <td className="px-6 py-4">17</td>
              <td className="px-6 py-4">0</td>
              <td className="px-6 py-4">₹4,900</td>

              <td className="px-6 py-4">
                <Link
                  href="{`./employee/viewEmployee/myslag`}"
                  className="text-2xl"
                >
                  👁️
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
