"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Select option");

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
    <>
      <header className="flex items-center justify-between bg-white dark:bg-slate-700 px-4 py-3 text-black dark:text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex dark:bg-blue-400 items-center justify-center text-sm font-medium">
            <Image src="/Logo.PNG" width={40} height={40} alt="logo" />
          </div>
          <h1 className="text-xl font-semibold">Skylinee Admin</h1>
        </div>
        <div className="gap-2 flex">
          <FaPeopleRoof
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl mr-2 my-1 cursor-pointer"
          />

          {/* Dropdown Menu */}
          {isOpen && (
            <ul className="absolute top-14 right-10 z-10 mt-1 bg-gray-300 dark:bg-gray-700 text-black  dark:text-white border border-gray-300 rounded-md shadow-lg">
              <li
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-400"
              >
                Create Customer
              </li>
              <li
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-400"
              >
                View Customer
              </li>
            </ul>
          )}
          <Link href="/loggedInAdmin/profile" className="flex">
            <FaUserCircle className="text-2xl mr-2 my-1" />
          </Link>
          <a href="#" className="flex" onClick={logout}>
            <IoLogOut className="text-2xl mr-2 my-1" />{" "}
          </a>
        </div>
      </header>
      <ToastContainer />
      {/* dorpdown menu for customer */}
    </>
  );
};

export default TopBar;
