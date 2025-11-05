"use client";
import { use, useState } from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = ({ params }) => {
  const router = useRouter()
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);
  const [isCompanyYes, setIsCompanyYes] = useState(false);
  const [isCompanyNo, setIsCompanyNo] = useState(true);
  const [disabledYes, setDisabledYes] = useState(false);
  const [disabledNo, setDisabledNo] = useState(true);
  const [formData, setFormData] = useState({
    id: mySlag,
    isCompany: isCompanyYes,
    companyName: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyPin: "",
    yearofIncorporation: "",
    cinNo: "",
    companyPanNo: "",
    companyGst: "",
    companyEffDate: "",
    officePhone: "",
    officeEmail: "@gmail.com",
    // employementType: selected,
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
  const handleCompany = () => {
    if (isCompanyYes === false) {
      setIsCompanyYes(true);
      setIsCompanyNo(false);
      setDisabledYes(true);
      setDisabledNo(false);
      setFormData({ ...formData, isCompany: true });
    } else if (isCompanyNo === false) {
      setIsCompanyYes(false);
      setIsCompanyNo(true);
      setDisabledNo(true);
      setDisabledYes(false);
      setFormData({ ...formData, isCompany: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepII`,
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
        setTimeout(() => {
          router.back();
        }, 3000);
      } else {
        toast.error(`${data.msg}`, toastOptions);
      }
    } catch (error) {
      toast.error("Please Reload this page", toastOptions);
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
              <h2 className="text-2xl font-bold uppercase text-center mb-8">
                Step II
              </h2>
              <div>
                <label className="block text-sm font-medium">
                  Is A Company?
                </label>
                <span className="flex">
                  <input
                    type="checkbox"
                    checked={isCompanyYes}
                    onChange={() => handleCompany()}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    disabled={disabledYes}
                  />
                  <span className="mx-3">Yes</span>
                  <input
                    type="checkbox"
                    checked={isCompanyNo}
                    onChange={() => handleCompany()}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    disabled={disabledNo}
                  />
                  <span className="mx-3">No</span>
                </span>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {isCompanyYes === true && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">
                          Company&apos;s Name
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyName: e.target.value.slice(0, 30),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Company&apos;s Address
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyAddress: e.target.value.slice(0, 25),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">
                          City/Town
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyCity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyCity: e.target.value.slice(0, 12),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          State
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyState}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyState: e.target.value.slice(0, 12),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          PIN No
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyPin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyPin: e.target.value.slice(0, 6),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Year of Incorporation
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.yearofIncorporation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              yearofIncorporation: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          CIN No
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.cinNo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cinNo: e.target.value.slice(0, 21),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          PAN NO of Company
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyPanNo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyPanNo: e.target.value.slice(0, 10),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Company GST No
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyGst}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyGst: e.target.value.slice(0, 15),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Effect Date of Company
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.companyEffDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyEffDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Official Phone Number
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.officePhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              officePhone: e.target.value.slice(0, 10),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Official Email Id
                        </label>
                        <input
                          type="email"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.officeEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              officeEmail: e.target.value.slice(0, 35),
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    onClick={handleSubmit}
                  >
                    Save And Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
