"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const salary = 250000;
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
        <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6 mt-8 sm:rounded-lg w-2/3 mx-auto pt-16 relative">
          <button
            className="absolute left-2 top-0 bg-red-500 text-white px-4 py-2 rounded m-4 text-xl hover:bg-blue-600"
            onClick={() => {
              router.back();
            }}
          >
            🔙
          </button>
          <Link
            href="/loggedInAdmin/employee/addEmployee"
            className="absolute right-2 top-0 bg-blue-500 text-white px-4 py-2 rounded m-4 hover:bg-blue-600"
          >
            Add Employee ➕
          </Link>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-hidden">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Employee name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Designation
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Salary
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Office
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Attandance
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
                  <td className="px-6 py-4">General Manager</td>
                  <td className="px-6 py-4">Assam</td>
                  <td className="px-6 py-4">
                    <span className="text-xl">₹</span>
                    {salary.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">Head Office</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`./employee/viewAttandance/myslag`}
                      className=""
                    >
                      21 Days
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`./employee/viewEmployee/myslag`}
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
      </div>
    </div>
  );
};

export default Page;
