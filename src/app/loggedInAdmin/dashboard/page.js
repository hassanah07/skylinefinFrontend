import React from "react";
import LineChart from "@/app/components/LineChart";
import DashboardSectionOne from "@/app/components/DashboardSectionOne";
import BarChart from "@/app/components/BarChart";

const page = () => {
  return (
    <div>
      <section className="text-gray-400 body-font">
        <DashboardSectionOne />
      </section>
    </div>
  );
};

export default page;
