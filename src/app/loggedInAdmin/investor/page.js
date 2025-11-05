//page: "/loggedInAdmin/customer"
"use client";
import CustomerTable from "@/app/components/CustomerTable";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [customerData, setCustomerData] = useState([]);
  const salary = 250000;
  const router = useRouter();
  const data = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/getLoanUsers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(),
      }
    );
    const fetchRespose = await res.json();
    // console.log(fetchRespose.getUser[0]);
    setCustomerData(fetchRespose.getUser);
  };
  useEffect(() => {
    data();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <main className="flex-1 p-6">
          <div className="sm:rounded-lg w-full mx-auto pt-16 relative">
            
            <span className="absolute right-0 top-5">
              <Link
                href="/loggedInAdmin/customer/initialCheck"
                className="bg-blue-500 text-white px-4 py-2 rounded m-4 hover:bg-blue-600"
              >
                Add Loan User
              </Link>
            </span>
            <div className="relative overflow-x-auto">
              <CustomerTable customerData={customerData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
