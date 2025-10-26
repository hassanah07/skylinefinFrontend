import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import React from "react";

const Page = () => {
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
