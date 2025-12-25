"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DealerTable from "@/app/loggedInAdmin/dealer/components/DealerTable";

const Page = () => {
  const router = useRouter();
  const [dealer, setDealer] = useState([]);
  const data = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/dealer/getDealer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
      }
    );
    const fetchRespose = await res.json();
    setDealer(fetchRespose.dealer);
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
            <button
              className="absolute left-0 top-0 bg-red-500 text-white px-4 py-2 rounded m-4 text-xl hover:bg-blue-600"
              onClick={() => {
                router.back();
              }}
            >
              🔙
            </button>
            <span className="absolute right-0 top-5">
              <Link
                href="/loggedInAdmin/dealer/addDealer"
                className="bg-blue-500 text-white px-4 py-2 rounded m-4 hover:bg-blue-600"
              >
                Create New Dealer
              </Link>
            </span>
            <div className="relative overflow-x-auto">
              <DealerTable dealerData={dealer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
