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

  const [formData, setFormData] = useState({
    id: mySlag,
    collateralType: "",
    collateralName: "",
    collateralDetails: "",
    propertyOwnerOne: "",
    propertyOwnerTwo: "",
    propertyAddress: "",
    propertyCurrentValue: "",
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
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepVII`,
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
      console.log(data);
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
                <span>Collateral Details</span>
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Collateral Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.collateralType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collateralType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select Collateral Category
                      </option>
                      <option value="Land">Land</option>
                      <option value="House">House</option>
                      <option value="Four Wheeler">Four Wheeler</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Company Shares">Company Shares</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Collateral Name
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.collateralName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            collateralName: e.target.value.slice(0, 20),
                          })
                        }
                      />
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Collateral Details
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.collateralDetails ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            collateralDetails: e.target.value.slice(0, 50),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Property Owner 1
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.propertyOwnerOne ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyOwnerOne: e.target.value.slice(0, 15),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Property Owner 2
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.propertyOwnerTwo ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyOwnerTwo: e.target.value.slice(0, 15),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Property Address
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.propertyAddress ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyAddress: e.target.value.slice(0, 30),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Property Value - Current
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.propertyCurrentValue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyCurrentValue: e.target.value.slice(0, 7),
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
                    Add Collateral Details
                  </button>
                  <Link
                    href={`/loggedInAdmin/loan/stepEight/${mySlag}`}
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
