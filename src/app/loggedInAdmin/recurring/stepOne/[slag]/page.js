"use client";
import { use, useCallback, useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = ({ params }) => {
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);
  const optionsOccupation = [
    "Salaried",
    "Self Employed",
    "Business",
    "Retaired",
    "House Wife",
    "Student",
    "Others",
  ];
  const optionsGST = ["Available"];
  const [permanentAddressYes, setPermanentAddressYes] = useState(false);
  const [permanentAddressNo, setPermanentAddressNo] = useState(true);
  const [disabledYes, setDisabledYes] = useState(false);
  const [disabledNo, setDisabledNo] = useState(true);
  // const [selected, setSelected] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [area, setArea] = useState(null); // will store the full selected object
  const [postOfficesTwo, setPostOfficesTwo] = useState([]);
  const [areaTwo, setAreaTwo] = useState([]);
  const [formData, setFormData] = useState({
    id: mySlag,
    amount: "",
    frequency: "Monthly",
    cashfree: "0",
    repaymentPeriod: "12",
    interestPercentage: 7,
    addressLine: "",
    landmark: "",
    pin: "",
    postalData: null,
    altMobile: "",
    presParmAddressSame: permanentAddressYes,
    permAddressLine: "",
    permLandmark: "",
    permCity: "",
    permState: "",
    permPin: "",
    permPostalData: null,
    // employementType: selected,
  });
  const handleChange = (e) => {
    const selected = postOffices.find(
      (office) => office.Name === e.target.value
    );
    setArea(selected || null);
  };
  const handleChangeTwo = (e) => {
    const selectedTwo = postOfficesTwo.find(
      (officeTwo) => officeTwo.Name === e.target.value
    );
    setAreaTwo(selectedTwo || null);
  };
  const fetchPin = useCallback(async () => {
    let res = await fetch(
      `https://api.postalpincode.in/pincode/${formData.pin}`
    );
    res = await res.json();
    setPostOffices(res[0].PostOffice);
  }, [formData.pin]);

  const fetchPinTwo = useCallback(async () => {
    let res = await fetch(
      `https://api.postalpincode.in/pincode/${formData.permPin}`
    );
    res = await res.json();
    setPostOfficesTwo(res[0].PostOffice);
  }, [formData.permPin]);

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
    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_HOST}/api/recurring/StepI`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "admin-token": localStorage.getItem("token"),
    //       },
    //       body: JSON.stringify(formData),
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   if (data.login === true) {
    //     toast.success(`${data.msg}`, toastOptions);
    //     setTimeout(() => {
    //       redirect("/loggedInAdmin/customer");
    //     }, 4000);
    //   } else {
    //     console.log(data.err);
    //     toast.error(`${data.msg}`, toastOptions);
    //     setTimeout(() => {
    //       redirect("/loggedInAdmin/customer");
    //     }, 4000);
    //   }
    // } catch (error) {
    //   toast.error("Please Reload this Page", toastOptions);
    // }
    alert("Comming Soon");
  };

  useEffect(() => {
    if (formData.pin?.length === 6) {
      fetchPin();
    }
  }, [formData.pin, fetchPin]);
  useEffect(() => {
    if (area) {
      setFormData((prev) => ({ ...prev, postalData: area }));
    }
  }, [area]);
  useEffect(() => {
    if (formData.permPin?.length === 6) {
      fetchPinTwo();
    }
  }, [formData.permPin, fetchPinTwo]);
  useEffect(() => {
    if (areaTwo) {
      setFormData((prev) => ({ ...prev, permPostalData: areaTwo }));
    }
  }, [areaTwo]);
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
                Update Recurring Account
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* recurring amount */}
                  <div>
                    <label className="block text-sm font-medium">
                      Recurring Amount
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
                        onKeyDown={(e) => {
                          if (
                            e.key === "ArrowUp" ||
                            e.key === "ArrowDown" ||
                            e.key === "e" ||
                            e.key === "E"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        required
                      />
                    </span>
                  </div>
                  {/* frequency */}
                  <div>
                    <label className="block text-sm font-medium">
                      Frequency
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.frequency}
                      onChange={(e) =>
                        setFormData({ ...formData, frequency: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Frequency Catagory
                      </option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>
                  {/* cashfree period */}
                  <div>
                    <label className="block text-sm font-medium">
                      Cashfree Period
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.cashfree}
                      onChange={(e) =>
                        setFormData({ ...formData, cashfree: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="0">0 Month</option>
                      <option value="6">6 Month</option>
                      <option value="12">12 Month</option>
                      <option value="24">24 Month</option>
                      <option value="36">36 Month</option>
                    </select>
                  </div>
                  {/* repayment period */}
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
                        Select No&apos;s of Installment&apos;s
                      </option>
                      <option value="12">12 Months</option>
                      <option value="24">2 Year / 24 Month</option>
                      <option value="36">3 Year / 36 Month</option>
                      <option value="48">
                        4 Year / 48 Month (47 Month + 1 Month)
                      </option>
                      <option value="60">
                        5 Year / 60 Month (57 Month + 3 Month)
                      </option>
                      <option value="120">
                        10 Year / 120 Month (9 Year + 1 Year)
                      </option>
                      <option value="180">
                        15 Year / 180 Month (13 Year + 2 Year)
                      </option>
                      {/* <option value="240">20 Year / 240 Month</option> */}
                      <option value="264">
                        22 Year / 264 Month (18 Year + 4 Year)
                      </option>
                    </select>
                  </div>
                  {/* interest percentage & */}
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
                        onKeyDown={(e) => {
                          if (
                            e.key === "ArrowUp" ||
                            e.key === "ArrowDown" ||
                            e.key === "e" ||
                            e.key === "E"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        required
                      />
                      %
                    </span>
                  </div>
                  {/* address */}
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
                  {/* landmark */}
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
                  {/* PIN Number */}
                  <div>
                    <label className="block text-sm font-medium">PIN No</label>
                    <input
                      type="number"
                      name="pin"
                      id="pin"
                      value={formData.pin || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pin: e.target.value.slice(0, 6),
                        })
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowDown" ||
                          e.key === "e" ||
                          e.key === "E"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      required
                    />
                  </div>
                  {/* Postal area */}
                  <div>
                    <select
                      id="postOfficeSelect"
                      className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                      value={area?.Name || ""}
                      onChange={handleChange}
                    >
                      <option value="">Choose Post Office</option>
                      {postOffices?.map((office, index) => (
                        <option
                          className="dark:bg-black"
                          key={index}
                          value={office.Name}
                        >
                          {office.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* alternative Mobile Number */}
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
                      onKeyDown={(e) => {
                        if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowDown" ||
                          e.key === "e" ||
                          e.key === "E"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                  </div>
                  {/* Permanent Address Handling */}
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
                  {/* Permanent Address start */}
                  {permanentAddressYes === false && (
                    <>
                      {/* address */}
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
                      {/* landmark */}
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
                      {/* area pin */}
                      <div>
                        <label className="block text-sm font-medium">
                          PIN No
                        </label>
                        <input
                          type="number"
                          name="pinTwo"
                          id="pinTwo"
                          value={formData.permPin || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permPin: e.target.value.slice(0, 6),
                            })
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "e" ||
                              e.key === "E"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                          required
                        />
                      </div>
                      {/* postal data select */}
                      <div>
                        <select
                          id="postOfficeSelectTwo"
                          className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          required
                          value={areaTwo?.Name || ""}
                          onChange={handleChangeTwo}
                        >
                          <option value="">Choose Post Office</option>
                          {postOfficesTwo?.map((officeTwo, index) => (
                            <option
                              className="dark:bg-black"
                              key={index}
                              value={officeTwo.Name}
                            >
                              {officeTwo.Name}
                            </option>
                          ))}
                        </select>
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
