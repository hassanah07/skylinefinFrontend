"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddDealerForm() {
  const router = useRouter();
  const [postOffices, setPostOffices] = useState([]);
  const [area, setArea] = useState(null); // will store the full selected object
  const [isBranch, setisBranch] = useState(false);
  const [isBranchNo, setIsBranchNo] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledNo, setIsDisabledNo] = useState(true);
  const handleChange = (e) => {
    const selected = postOffices.find(
      (office) => office.Name === e.target.value
    );
    setArea(selected || null);
  };
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    father: "",
    pan: "",
    aadhar: "",
    address: "",
    landmark: "",
    postalData: null,
    email: "@gmail.com",
    mobile: "",
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
  const fetchPin = useCallback(async () => {
    let res = await fetch(
      `https://api.postalpincode.in/pincode/${formData.pin}`
    );
    res = await res.json();
    setPostOffices(res[0].PostOffice);
  }, [formData.pin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/dealer/createdealer`,
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
      if (data.login === false) {
        localStorage.removeItem("token");
        toast.success(`Redirect to Login`, toastOptions);
        setTimeout(() => {
          router.push("/");
        }, 4000);
      }
      if (data.status === true) {
        toast.success(`${data.msg}`, toastOptions);
        setTimeout(() => {
          router.push("/loggedInAdmin/marchant");
        }, 4000);
      } else {
        toast.error(`${data.msg}`, toastOptions);
      }
    } catch (error) {
      toast.error("Please Reload this page", toastOptions);
    }
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
                Create New Dealer
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex">
                    <div className="w-1/6">
                      <label className="block text-sm font-medium">Title</label>
                      <select
                        className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            title: e.target.value
                              .trim()
                              .replace(/[^a-zA-Z]/g, ""),
                          })
                        }
                        required
                      >
                        <option value="" disabled></option>
                        <option value="Mr">Mr</option>
                        <option value="Miss">Miss</option>
                      </select>
                    </div>
                    <div className="w-5/6">
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-b-2 shadow-md focus:border-blue-500"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                              .slice(0, 25)
                              .toUpperCase()
                              .replace(/[^a-zA-Z0-9 ]/g, ""),
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Father&apos;s Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                      value={formData.father}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          father: e.target.value
                            .slice(0, 25)
                            .trimStart()
                            .toUpperCase()
                            .replace(/[^a-zA-Z0-9 ]/g, ""), //replace(/[^a-zA-Z0-9 ]/g, "")
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">PAN No</label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.pan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pan: e.target.value
                              .slice(0, 10)
                              .trim()
                              .toUpperCase()
                              .replace(/[^a-zA-Z0-9]/g, ""),
                          })
                        }
                        required
                      />
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Aadhaar No
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.aadhar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aadhar: e.target.value.slice(0, 12),
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

                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value
                            .slice(0, 45)
                            .trimStart()
                            .toUpperCase()
                            .replace(/[^a-zA-Z0-9 ]/g, ""),
                        })
                      }
                      className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="address"
                      className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Address
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name="Landmark"
                      id="Landmark"
                      value={formData.landmark}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          landmark: e.target.value
                            .toUpperCase()
                            .slice(0, 17)
                            .trimStart()
                            .toUpperCase()
                            .replace(/[^a-zA-Z0-9 ]/g, ""),
                        })
                      }
                      className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_address2"
                      className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Landmark
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
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
                        className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="pin"
                        className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        PIN
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Email Id
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value
                              .slice(0, 40)
                              .trim()
                              .toLowerCase()
                              .replace(/[^a-zA-Z0-9@._+-]/g, ""),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
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
}
