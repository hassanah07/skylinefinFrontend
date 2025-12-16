"use client";
import Activity from "@/app/components/Activity";
import DashMain from "@/app/components/DashMain";
import DonutChart from "@/app/components/DonutChart";
import EmployeeTable from "@/app/components/EmployeeTable";
import InvestorTable from "@/app/components/Investor";
import MarchantTable from "@/app/loggedInAdmin/marchant/components/DealerTable";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

export default function AdminDashboard() {
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(0);
  const [employee, setEmployee] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [marhcant, setMarhcant] = useState(0);
  const [loan, setLoan] = useState(0);
  const [pendingLoan, setPendingLoan] = useState(0);
  const [recurring, setRecurring] = useState(0);
  const [pendingRecurring, setPendingRecurring] = useState(0);
  const [investor, setInvestor] = useState(0);

  const adminCount = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/adminCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      console.log(res);
      if (res.login === true) {
        setAdmin(res.getData.length);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const employeeCount = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/employeeCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      if (res.login === true) {
        setEmployee(res.getData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const customerCount = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/customerCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      if (res.login === true) {
        setCustomer(res.getData.length);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const marchantCount = async () => {
    let res = await fetch("http://localhost:3000/api/admin/employeeCount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(),
    });
    res = await res.json();
    if (res.login === true) {
      setMarhcant(res.getData);
    } else {
      localStorage.removeItem("token");
    }
  };
  const loanCount = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/loanCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      if (res.login === true) {
        setLoan(res.getData);
        setCustomer(res.getData.length);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const pendingLoanCount = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/tellyCount/pendingLoanCount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(),
        }
      );
      res = await res.json();
      if (res.login === true) {
        setPendingLoan(res.getData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const recurringCount = async () => {
    let res = await fetch("http://localhost:3000/api/admin/employeeCount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(),
    });
    res = await res.json();
    if (res.login === true) {
      setRecurring(res.getData);
    } else {
      localStorage.removeItem("token");
    }
  };
  const pendingRecurringCount = async () => {
    let res = await fetch("http://localhost:3000/api/admin/employeeCount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(),
    });
    res = await res.json();
    if (res.login === true) {
      setPendingRecurring(res.getData);
    } else {
      localStorage.removeItem("token");
    }
  };
  const investorCount = async () => {
    let res = await fetch("http://localhost:3000/api/admin/employeeCount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(),
    });
    res = await res.json();
    if (res.login === true) {
      setInvestor(res.getData);
    } else {
      localStorage.removeItem("token");
    }
  };

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
    // console.log(fetchRespose);
    setInvestorData(fetchRespose.getInvestor);
  };
  useEffect(() => {
    data();
    adminCount();
    customerCount();
    employeeCount();
    loanCount();
    pendingLoanCount();
  }, []);

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
          <DashMain
            telly={{
              admin: admin,
              employee: employee.length,
              customer: customer,
              // marhcant: marhcant.length,
              loan: loan.length,
              // recurring: recurring.length,
              pendingLoan: pendingLoan.length,
              // pendingRecurring: pendingRecurring.length,
              // investor: investor.length,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Employee table */}
            <EmployeeTable employeeData={employee} />

            {/* Right: Quick stats / chart */}
            <DonutChart />
          </div>
          <div className="my-6">
            <MarchantTable />
          </div>
          <div className="my-6">
            <InvestorTable investorData={investorData} />
          </div>

          {/* Activity feed */}
          {/* <Activity /> */}
        </main>
      </div>
    </div>
  );
}

/* Donut chart using SVG */
