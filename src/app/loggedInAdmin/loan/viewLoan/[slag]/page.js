"use client";
import CustomerLoanTable from "@/app/components/CustomerLoanTable";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const Page = ({ params }) => {
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);

  const router = useRouter();
  const [customerLoanData, setCustomerLoanData] = useState([]);
  const data = async () => {
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
    setCustomerLoanData(fetchRespose.data);
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
          <div className="sm:rounded-lg w-3/4 mx-auto pt-16 relative">
            <div className="relative overflow-x-auto">
              <CustomerLoanTable customerLoanData={customerLoanData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
