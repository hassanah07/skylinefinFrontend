"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoanApplicationForm() {
  const [gst, setGst] = useState(true);
  const [formData, setFormData] = useState({
    mobile: "",
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/investor/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      }
    );
    const check = await response.json();
    console.log(check);
    if (check.status === true) {
      toast.success(`${check.msg}`, toastOptions);
      setTimeout(() => {
        redirect("/loggedInAdmin/investor");
      }, 3000);
    } else {
      toast.success(`${check.msg}`, toastOptions);
      setTimeout(() => {
        redirect("/loggedInAdmin/investor/addInvestor");
      }, 3000);
    }
    if (check.login === false) {
      toast.error(`Access Denied`, toastOptions);
      setTimeout(() => {
        localStorage.removeItem("token");
      }, 3000);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <ToastContainer />

      <TopBar />
      <div className="flex relative">
        <SideBar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold uppercase text-center mb-8">
                Investor Initial Check
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Mobile No
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile: e.target.value.slice(0, 10),
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault(); // 🚫 Block keyboard increment/decrement
                          }
                        }}
                        required
                        placeholder="10 digit mobile number"
                      />
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-1/3 bg-yellow-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    onClick={handleSubmit}
                  >
                    Check☑️ & Next⏭️
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
