import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="w-[100%] md:w-1/2 lg:w-1/2 mx-auto my-10">
        <LineChart />
      </div>
      <div className="w-[100%] md:w-1/2 lg:w-1/2 mx-auto my-10">
        <BarChart />
      </div>
    </div>
  );
};

export default Page;
