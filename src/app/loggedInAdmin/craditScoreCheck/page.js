"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      // move focus into the modal
      closeBtnRef.current?.focus();
      document.body.style.overflow = "hidden"; // prevent background scroll
    } else {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Example item data
  const item = {
    id: "CR-001",
    name: "Credit Score Review",
    score: 720,
    owner: "John Doe",
    description:
      "Detailed credit-check item for verifying financial history. Contains secure data and next steps for admin review.",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <header className="mb-6">
              <h1 className="text-2xl font-semibold">Cradit Score Form</h1>
              <p className="text-sm">
                Manage and inspect individual credit score checks
              </p>
            </header>

            <article className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex flex-col items-start justify-between">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    // value={name}
                    // onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_address2"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    // value={mobile}
                    // onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="mobile"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Mobile No
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    // value={email}
                    // onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email Id
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="pan"
                    id="pan"
                    // value={pan}
                    // onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="pan"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    PAN No
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="aadhaar"
                    id="aadhaar"
                    // value={aadhaar}
                    // onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="aadhaar"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    AADHAAR No
                  </label>
                </div>
              </div>

              <div className="mt-4">{item.description}</div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Check History
                </button>
                <button
                  onClick={() => router.forward("./historyData")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Activity History ⏭️
                </button>
              </div>
            </article>
          </div>

          {isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              aria-modal="true"
              role="dialog"
              onClick={() => setIsOpen(false)}
            >
              {/* overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

              {/* modal panel */}
              <div
                className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detailed Cradit Report
                  </h3>
                  <button
                    ref={closeBtnRef}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 text-gray-700">
                  <p className="mb-2">
                    Name:
                    <span className="font-semibold"> Hazrat Ali</span>
                  </p>
                  <p className="text-sm text-gray-500">Cradit Score: 780</p>
                  <p className="text-sm text-gray-500">
                    Email: Email@gmail.com
                  </p>
                  <p className="text-sm text-gray-500">Mobile: 9101123456</p>
                  <p className="text-sm text-gray-500">AADHAAR: 456214775622</p>
                  <p className="text-sm text-gray-500">PAN: AKUHI5630P</p>
                  <p className="text-sm text-gray-500">Payment History: 100%</p>
                  <p className="text-sm text-gray-500">
                    Total Cradit card: 5 Nos
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Running Loans: 2
                  </p>
                  <p className="mt-3 text-sm">
                    Are you sure you want to proceed? This Action will save this
                    cradit Data
                  </p>
                </div>

                <div className="p-4 border-t flex justify-end gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded border text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel ⚠️
                  </button>
                  <button
                    onClick={() => {
                      // placeholder for confirmed action
                      // e.g. call API, then close modal
                      console.log("Confirmed action on", item.id);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                  >
                    Save 🗃️
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
