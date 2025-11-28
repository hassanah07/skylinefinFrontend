"use client";
import React, { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import logo from "../../../public/Logo.PNG";

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
      redirect("/loggedInAdmin/dashboard");
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
        <div className="container px-5 mx-auto my-8 md:w-[70%] shadow-2xl shadow-popover-foreground dark:shadow-blue-400">
          <div className="flex flex-col text-center w-full relative gap-2">
            <Image
              src="/Logo.PNG
              "
              width={60}
              height={90}
              alt="logo"
              className="absolute top-4 left-4 rounded-lg p-1 dark:bg-amber-50"
            />
            <h1 className="sm:text-4xl text-3xl font-extrabold title-font my-4 text-gray-700 dark:text-slate-100">
              Skylinee Login
            </h1>
          </div>
          <hr />
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm dark:text-slate-100"
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
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 dark:text-white focus:ring-pink-400 outline-none font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    autoComplete="off"
                    autoSave="off"
                    aria-autocomplete="none"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  className="cursor-pointer dark:text-white border-2 bg-yellow-600 dark:bg-slate-600 py-2 px-8 focus:outline-none hover:bg-yellow-500 hover:text-pink-900 dark:hover:bg-red-700 text-lg font-semibold shadow-2xl w-full justify-center rounded-md hover:border-0"
                  onClick={handleSubmit}
                >
                  Request OTP
                </button>
              </div>
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <small className="text-red-700 dark:text-white font-semibold capitalize">
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
