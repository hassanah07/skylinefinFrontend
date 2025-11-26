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
    partnerName: "",
    partnerPan: "",
    partnerMobile: "",
    partnerEmail: "",
    partnerDob: "",
    profitShare: "",
    partnerDob: "",
    dinNo: "",
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
    console.log(formData);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepIII`,
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
                <span>Company&apos;s Partners Details</span>
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Partner&apos;s Name
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.partnerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partnerName: e.target.value.slice(0, 25),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Partner&apos;s PAN No
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.partnerPan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partnerPan: e.target.value.slice(0, 10),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Partner&apos;s Share
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.profitShare ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profitShare: e.target.value.slice(0, 2),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Date of Birth
                    </label>
                    <span className="flex">
                      <input
                        type="date"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.partnerDob}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partnerDob: e.target.value,
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Partner&apos;s Mobile Number
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.partnerMobile ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partnerMobile: e.target.value.slice(0, 10),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Partner&apos;s Email Id
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.partnerEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partnerEmail: e.target.value.slice(0, 40),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Partner&apos;s DIN No
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.dinNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dinNo: e.target.value.slice(0, 23),
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
                    Add Partners
                  </button>
                  <Link
                    href={`/loggedInAdmin/loan/stepFour/${mySlag}`}
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
