"use client";
import { use, useState } from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = ({ params }) => {
  const router = useRouter();
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);
  const [permanentAddressYes, setPermanentAddressYes] = useState(false);
  const [permanentAddressNo, setPermanentAddressNo] = useState(true);
  const [disabledYes, setDisabledYes] = useState(false);
  const [disabledNo, setDisabledNo] = useState(true);
  const [formData, setFormData] = useState({
    id: mySlag,
    amount: "",
    loanType: "Personal Loan",
    repaymentPeriod: "12",
    interestType: "Fixed",
    interestPercentage: 24,
    addressLine: "",
    landmark: "",
    city: "",
    state: "",
    pin: "",
    altMobile: "",
    presParmAddressSame: permanentAddressYes,
    permAddressLine: "",
    permLandmark: "",
    permCity: "",
    permState: "",
    permPin: "",
    remarks: "",
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
  const handleAddress = () => {
    if (permanentAddressYes === false) {
      setPermanentAddressYes(true);
      setPermanentAddressNo(false);
      setDisabledYes(true);
      setDisabledNo(false);
    } else if (permanentAddressNo === false) {
      setPermanentAddressYes(false);
      setPermanentAddressNo(true);
      setDisabledNo(true);
      setDisabledYes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepI`,
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
          router.back();
        }, 4000);
      } else {
        console.log(data.err);
        toast.error(`${data.msg}`, toastOptions);
        setTimeout(() => {
          router.back();
        }, 4000);
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
                New Loan Account
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Loan Amount
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: e.target.value.slice(0, 6),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Loan Type/Category
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.loanType}
                      onChange={(e) =>
                        setFormData({ ...formData, loanType: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Loan Catagory
                      </option>
                      <option value="Business Loan">Business Loan</option>
                      <option value="Personal Loan">Personal Loan</option>
                      <option value="Four Wheeler Loan">
                        Four Wheeler Loan
                      </option>
                      <option value="Two Wheeler Loan">Two Wheeler Loan</option>
                      <option value="Agri Loan">Agri Loan</option>
                      <option value="Mobile EMI">Mobile EMI</option>
                      <option value="Laptop EMI">Laptop EMI</option>
                      <option value="Others Electronics EMI">
                        Others Electronics EMI
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Repayment Period
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.repaymentPeriod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repaymentPeriod: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select No&apos;s of EMI&apos;s
                      </option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                      <option value="12">12 Months</option>
                      <option value="18">18 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                      <option value="48">48 Months</option>
                      <option value="72">72 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Interest Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.interestType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interestType: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Type of Interest
                      </option>
                      <option value="Fixed">Fixed</option>
                      <option value="Reducing Balance">Reducing Balance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Percentage of Interest
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.interestPercentage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            interestPercentage: e.target.value.slice(0, 2),
                          })
                        }
                        required
                      />
                      %
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.addressLine}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          addressLine: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Landmark
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.landmark}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          landmark: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      City/Town
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          city: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">State</label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          state: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">PIN No</label>
                    <input
                      type="number"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.pin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pin: e.target.value.slice(0, 6),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Alternate Mobile No
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.altMobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          altMobile: e.target.value.slice(0, 10),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Is Present Address and Permanent address same?
                    </label>
                    <span className="flex">
                      <input
                        type="checkbox"
                        checked={permanentAddressYes}
                        onChange={() => handleAddress()}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        disabled={disabledYes}
                      />
                      <span className="mx-3">Yes</span>
                      <input
                        type="checkbox"
                        checked={permanentAddressNo}
                        onChange={() => handleAddress()}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        disabled={disabledNo}
                      />
                      <span className="mx-3">No</span>
                    </span>
                  </div>

                  {permanentAddressYes === false && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.permAddressLine}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permAddressLine: e.target.value.slice(0, 25),
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Landmark
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.permLandmark}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permLandmark: e.target.value.slice(0, 25),
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          City/Town
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.permCity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permCity: e.target.value.slice(0, 25),
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          State
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.permState}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permState: e.target.value.slice(0, 25),
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          PIN No
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          value={formData.permPin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permPin: e.target.value.slice(0, 6),
                            })
                          }
                          required
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Remarks</label>
                  <textarea
                    rows="4"
                    className="mt-1 block w-full capitalize shadow-md border-b-2 focus:border-blue-500"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    required
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    onClick={handleSubmit}
                  >
                    Submit Application
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

export default Page;
