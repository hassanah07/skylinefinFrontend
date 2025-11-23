//page: "/loggedInAdmin/customer"
"use client";
import CustomerTable from "@/app/components/CustomerTable";
import EmployeeTable from "@/app/components/EmployeeTable";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [employee, setEmployee] = useState(0);

  const employeeCount = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/employeeCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      console.log(res);
      setEmployee(res);
    } catch (error) {
      console.log(error);
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
    employeeCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <main className="flex-1 p-6">
          <div className="sm:rounded-lg w-full mx-auto pt-16 relative">
            {/* <button
              className="absolute left-0 top-0 bg-red-500 text-white px-4 py-2 rounded m-4 text-xl hover:bg-blue-600"
              onClick={() => {
                router.back();
              }}
            >
              🔙
            </button>*/}
            <span className="absolute right-0 top-5">
              <Link
                href="/loggedInAdmin/employee/addEmployee"
                className="bg-blue-500 text-white px-4 py-2 rounded m-4 hover:bg-blue-600"
              >
                Add New Employee
              </Link>
            </span>
            <div className="relative overflow-x-auto">
              <EmployeeTable employeeData={employee} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
