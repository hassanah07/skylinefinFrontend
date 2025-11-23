"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const salary = 250000;
  const router = useRouter();
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
    <div className="sm:rounded-lg w-2/3 mx-auto pt-16 relative">
      <button
        className="absolute left-0 top-0 bg-red-500 text-white px-4 py-2 rounded m-4 text-xl hover:bg-blue-600"
        onClick={() => {
          router.back();
        }}
      >
        🔙
      </button>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-3">
                User ID
              </th>
              <th scope="col" className="px-6 py-3">
                Txn Method
              </th>
              <th scope="col" className="px-6 py-3">
                Date and Time
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
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
                46711355846
              </th>
              <td className="px-6 py-4">52992025271</td>
              <td className="px-6 py-4">52992025271</td>
              <td className="px-6 py-4">upi</td>
              <td className="px-6 py-4">
                <span className="text-xl">₹</span>
                {salary.toLocaleString("en-IN")}
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/loggedInAdmin/investor/viewTrans/myslag`}
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
