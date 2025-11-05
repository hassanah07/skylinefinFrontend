"use client";
import { use, useState } from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = ({ params }) => {
  const router = useRouter();
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);

  const [permanentAddressYes, setPermanentAddressYes] = useState(false);
  const [permanentAddressNo, setPermanentAddressNo] = useState(true);

  const [formData, setFormData] = useState({
    id: mySlag,
    annualSalary: "",
    otherAnnualIncome: "",
    bankName: "",
    bankBranch: "",
    bankIfsc: "",
    bankAcNo: "",
    bankAcType: "",
    bankCustomerId: "",
  });
  const toastOptions = {
    theme: "dark",
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepIV`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.status === true) {
        toast.success(`${data.msg}`, toastOptions);
      } else {
        toast.error(`${data.msg}`, toastOptions);
      }
    } catch (error) {
      toast.error("Please Reload this Page", toastOptions);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <ToastContainer />
      <div className="flex relative">
        <SideBar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold uppercase mb-8 gap-5">
                <button
                  onClick={() => router.back()}
                  className="bg-blue-800 px-2 rounded cursor-pointer hover:bg-blue-900 mx-4"
                >
                  ◀️Back
                </button>
                <span>Income Details</span>
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Annual Salary/Income
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.annualSalary}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            annualSalary: e.target.value.slice(0, 7),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Other&apos;s Income-Annually
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.otherAnnualIncome}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherAnnualIncome: e.target.value.slice(0, 6),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Bank Name
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.bankName ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankName: e.target.value.slice(0, 25),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Bank Branch
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.bankBranch}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankBranch: e.target.value.slice(0, 16),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Bank Account No
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.bankAcNo ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankAcNo: e.target.value.slice(0, 25),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Bank Account Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.bankAcType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAcType: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Bank AC Type
                      </option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="Salary Account">Salary Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Customer ID
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.bankCustomerId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankCustomerId: e.target.value.slice(0, 12),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      IFSC Code
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.bankIfsc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankIfsc: e.target.value.slice(0, 11),
                          })
                        }
                      />
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-5">
                  <button
                    type="submit"
                    className="w-1/3 bg-blue-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 transition duration-300"
                    onClick={handleSubmit}
                  >
                    Update Bank Details
                  </button>
                  <Link
                    href={`/loggedInAdmin/loan/stepFive/${mySlag}`}
                    className="w-1/3 bg-yellow-600 hover:bg-blue-700 text-white font-bold py-2 px-4 text-center transition duration-300 cursor-pointer"
                  >
                    Next😍
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
