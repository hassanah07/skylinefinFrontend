"use client";
import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import React, { useEffect } from "react";

const Page = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />

      <div className="flex relative">
        <SideBar />
        <section className="flex-1 p-6">
          <div className="w-[100%] md:w-1/2 lg:w-1/2 mx-auto my-10">
            <LineChart />
          </div>
          <div className="w-[100%] md:w-1/2 lg:w-1/2 mx-auto my-10">
            <BarChart />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
