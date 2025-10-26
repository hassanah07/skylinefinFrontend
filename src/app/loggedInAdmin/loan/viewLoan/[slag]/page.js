"use client";
import CustomerLoanTable from "@/app/components/CustomerLoanTable";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

const Page = ({ params }) => {
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);

  const router = useRouter();
  const myData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/getCustomerLoans`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ customerId: mySlag }),
      }
    );
    const fetchRespose = await res.json();
    console.log(fetchRespose);
  };
  useEffect(() => {
    myData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <main className="flex-1 p-6">
          <div className="sm:rounded-lg w-2/3 mx-auto pt-16 relative">
            <div className="relative overflow-x-auto">
              <CustomerLoanTable customerLoanData={mySlag} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
