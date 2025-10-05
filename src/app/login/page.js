"use client";
import React, { useState, useEffect } from "react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const handleChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    }
  };
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
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      redirect("/loggedInAdmin/home");
    }
  }, []);
  const handleSubmit = async (e) => {
    // redirect("/loggedInAdmin/home");
    e.preventDefault();
    const data = { email };
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/generateotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      res = await res.json();
      if (res.type == "success") {
        toast.success(`${res.msg}`, toastOptions);
        router.push(`/login/${email}`);
      } else {
        toast.error(`${res.msg}`, toastOptions);
      }
    } catch (error) {
      toast.error(error, toastOptions);
      console.log(error);
    }
  };

  return (
    <div className="text-black body-font bg-white dark:bg-slate-700 dark:text-white flex items-center justify-center min-h-screen">
      <ToastContainer />
      <section className="text-black body-font relative md:w-[70%]">
        <div className="container px-5 mx-auto my-8 md:w-[50%] shadow-2xl shadow-popover-foreground">
          <div className="flex flex-col text-center w-full">
            <h1 className="sm:text-4xl text-3xl font-extrabold title-font my-4 text-gray-700 dark:text-slate-100">
              Skyline Admin Login
            </h1>
          </div>
          <hr />
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-100"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="username"
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 focus:ring-pink-400 outline-none text-yellow-500 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    autoComplete="off"
                    autoSave="off"
                    aria-autocomplete="none"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  className="text-slate-700 cursor-pointer dark:text-white border-2 bg-white dark:bg-slate-600 py-2 px-8 focus:outline-none hover:bg-slate-300 hover:text-pink-900 dark:hover:bg-slate-700 text-lg font-semibold shadow-2xl shadow-popover-foreground dark:shadow-white w-full justify-center"
                  onClick={handleSubmit}
                >
                  Request OTP
                </button>
              </div>
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <small className="text-red-700 font-semibold capitalize">
                  Never Share Your credentials with anyone
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="absolute right-4 bottom-4">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Page;
