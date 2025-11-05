"use client";
import Activity from "@/app/components/Activity";
import DashMain from "@/app/components/DashMain";
import DonutChart from "@/app/components/DonutChart";
import EmployeeTable from "@/app/components/EmployeeTable";
import InvestorTable from "@/app/components/Investor";
import MarchantTable from "@/app/components/MarchantTable";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { useState, useMemo } from "react";

export default function AdminDashboard() {
  // const [sidebarOpen, setSidebarOpen] = useState(true);

  // employee data end

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Topbar */}
      <TopBar />

      <div className="flex relative ">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Metrics */}
          <DashMain />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Employee table */}
            <EmployeeTable />

            {/* Right: Quick stats / chart */}
            <DonutChart />
          </div>
          <div className="my-6">
            <MarchantTable />
          </div>
          <div className="my-6">
            <InvestorTable />
          </div>

          {/* Activity feed */}
          {/* <Activity /> */}
        </main>
      </div>
    </div>
  );
}

/* Donut chart using SVG */
