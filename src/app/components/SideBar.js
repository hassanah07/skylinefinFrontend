"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  FaUserFriends,
  FaUserCircle,
  FaTachometerAlt,
  FaCalculator,
  FaHome,
} from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { FaPeopleGroup, FaPeopleRoof } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import { GiWallet } from "react-icons/gi";
import { IoLogOut } from "react-icons/io5";
import { redirect } from "next/navigation";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toastOptions = {
    theme: "dark",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Redirecting To Login Page", toastOptions);
    setTimeout(() => {
      redirect("/");
    }, 3000);
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen((s) => !s)}
        className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none absolute transition-all duration-150  ${
          sidebarOpen ? "left-56" : "left-14"
        }`}
        aria-label="Toggle sidebar"
      >
        {/* Menu icon */}
        <GiHamburgerMenu className="text-2xl" />
      </button>
      <aside
        className={`bg-white dark:bg-slate-700 text-black dark:text-white border-r transition-all duration-150 shadow-2xl ${
          sidebarOpen ? "w-64" : "w-16"
        } min-h-[calc(100vh-64px)] rounded`}
      >
        {/* min-h-[calc(100vh-64px)] */}
        <ToastContainer />
        <nav className="p-4 space-y-4 text-black dark:text-white">
          <Link
            href="/loggedInAdmin/dashboard"
            open={sidebarOpen}
            className="flex"
          >
            <MdDashboard className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Dashboard" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/investor"
            open={sidebarOpen}
            className="flex"
          >
            <FaPeopleGroup className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Branch" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/employee"
            open={sidebarOpen}
            className="flex"
          >
            <GrUserWorker className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Employee" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/marchant"
            open={sidebarOpen}
            className="flex"
          >
            <FaUserFriends className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Dealer" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/customer"
            open={sidebarOpen}
            className="flex"
          >
            <FaPeopleRoof className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Customer" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/marchant"
            open={sidebarOpen}
            className="flex"
          >
            <FaTachometerAlt className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Cradit History" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/emiCalculator"
            open={sidebarOpen}
            className="flex"
          >
            <FaCalculator className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "EMI Calculator" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/wallet"
            open={sidebarOpen}
            className="flex"
          >
            <GiWallet className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Wallet" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/transaction"
            open={sidebarOpen}
            className="flex"
          >
            <AiOutlineTransaction className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Transaction" : ""}
          </Link>
          <Link
            href="/loggedInAdmin/profile"
            open={sidebarOpen}
            className="flex"
          >
            <FaUserCircle className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Profile" : ""}
          </Link>
          <a href="#" open={sidebarOpen} className="flex" onClick={logout}>
            <IoLogOut className="text-2xl mr-2 my-1" />{" "}
            {sidebarOpen ? "Logout" : ""}
          </a>
          {/* <NavItem icon={<HomeIcon />} label="Overview" open={sidebarOpen} />
          <NavItem icon={<UsersIcon />} label="Employees" open={sidebarOpen} />
          <NavItem
            icon={<BriefcaseIcon />}
            label="Projects"
            open={sidebarOpen}
          />
          <NavItem icon={<TicketIcon />} label="Tickets" open={sidebarOpen} />
          <NavItem icon={<CogIcon />} label="Settings" open={sidebarOpen} /> */}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;

/* Inline SVG icons */
function HomeIcon() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z"
      />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" strokeWidth="1.5" />
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 21v-2a4 4 0 0 0-3-3.87"
      />
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <rect
        x="2"
        y="7"
        width="20"
        height="13"
        rx="2"
        ry="2"
        strokeWidth="1.5"
      />
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 10v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4"
      />
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"
      />
    </svg>
  );
}
function CogIcon() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
      />
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.68 0 1.27-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 4.3A2 2 0 1 1 7.12 1.47l.06.06a1.65 1.65 0 0 0 1.82.33h.09c.68 0 1.27-.4 1.51-1V1a2 2 0 1 1 4 0v.09c.24.6.83 1 1.51 1h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 21.7 4.3l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c0 .68.4 1.27 1 1.51H21a2 2 0 1 1 0 4h-.09c-.6 0-1.27.4-1.51 1z"
      />
    </svg>
  );
}
