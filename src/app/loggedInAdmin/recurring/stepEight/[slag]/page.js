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
    referenceName: "",
    relationship: "",
    referanceAddress: "",
    referanceCity: "",
    referanceState: "",
    referancePIN: "",
    referenceMobile: "",
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
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepVIII`,
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
        setTimeout(() => {
          router.push("/loggedInAdmin/customer");
        }, 4000);
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
                <span>Personal Referance</span>
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Relationship with Customer
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationship: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select Relation Type
                      </option>
                      <option value="Brother-Brother">Brother-Brother</option>
                      <option value="Brother-Sister">Brother-Sister</option>
                      <option value="Sister-Sister">Sister-Sister</option>
                      <option value="Father-Children">Father-Children</option>
                      <option value="Mother-Children">Mother-Children</option>
                      <option value="Husband-Wife">Husband-Wife</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Friends-Not inside Family">
                        Friends-Not inside Family
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Referance Name
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.referenceName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referenceName: e.target.value.slice(0, 20),
                          })
                        }
                      />
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.referanceAddress ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referanceAddress: e.target.value.slice(0, 20),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">City</label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.referanceCity ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referanceCity: e.target.value.slice(0, 15),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">State</label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.referanceState ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referanceState: e.target.value.slice(0, 15),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      PIN Number
                    </label>
                    <span className="flex">
                      <input
                        type="Number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.referancePIN}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referancePIN: e.target.value.slice(0, 6),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Mobile Number
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.referenceMobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referenceMobile: e.target.value.slice(0, 10),
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
                    Add Referance Details
                  </button>
                  {/* <Link
                    href={`/loggedInAdmin/loan/stepEight/${mySlag}`}
                    className="w-1/3 bg-yellow-600 hover:bg-blue-700 text-white font-bold py-2 px-4 text-center transition duration-300 cursor-pointer"
                  >
                    Next😍
                  </Link> */}
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
