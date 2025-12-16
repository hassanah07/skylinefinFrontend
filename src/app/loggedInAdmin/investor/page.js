//page: "/loggedInAdmin/customer"
"use client";
import CustomerTable from "@/app/components/CustomerTable";
import InvestorTable from "@/app/components/Investor";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState([]);
  const [investorData, setInvestorData] = useState([]);
  const data = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/investor/getInvestor`,
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
    console.log(fetchRespose);
    setInvestorData(fetchRespose.getInvestor);
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
                href="/loggedInAdmin/investor/initialCheck"
                className="bg-blue-500 text-white px-4 py-2 rounded m-4 hover:bg-blue-600"
              >
                Add New Branch
              </Link>
            </span>
            <div className="relative overflow-x-auto">
              <InvestorTable investorData={investorData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
