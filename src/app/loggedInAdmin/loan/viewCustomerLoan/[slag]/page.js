"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaCloudUploadAlt } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import { TiTickOutline } from "react-icons/ti";

export default function CustomerLoanDetails({ params }) {
  const router = useRouter();
  const { slag } = use(params);
  const myslag = decodeURIComponent(slag);

  const [loanData, setLoanData] = useState({
    loanAccountNumber: "LA001",
    customerId: "CUS123",
    amount: 500000,
    loanType: "Personal Loan",
    interestPercentage: "12.5",
    repaymentPeriod: "36 months",
    presAddress: "123 Main Street",
    presCity: "Mumbai",
    presState: "Maharashtra",
    presPIN: "400001",
    permAddress: "456 Park Avenue",
    permCity: "Mumbai",
    permState: "Maharashtra",
    permPIN: "400002",
    isCompleted: true,
    isPaymentProcessed: false,
    status: true,
  });
  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerLoanData, setCustomerLoanData] = useState([]);
  const customerDataRequest = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/v2/getCustomer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ loanAccountNumber: slag }),
      }
    );
    const fetchRespose = await res.json();
    // console.log(fetchRespose.data);
    setCustomerDetails(fetchRespose.data);
  }, [slag]);

  useEffect(() => {
    customerDataRequest();
  }, [customerDataRequest]);

  const data = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/v2/getLoan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ loanAccountNumber: slag }),
      }
    );
    const fetchRespose = await res.json();
    // console.log(fetchRespose.data);
    setCustomerLoanData(fetchRespose.data);
  }, [slag]);

  useEffect(() => {
    data();
  }, [data]);

  useEffect(() => {
    // This will be replaced with actual API call later
    // console.log("Loan ID:", slag);
  }, [slag]);

  const handlePrint = () => {
    window.print();
  };

  // if (!loanData || !customerData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 relative">
              <button
                className="bg-purple-300 px-3 py-1 rounded cursor-pointer"
                onClick={() => router.back()}
              >
                🔙
              </button>
              <h1 className="text-2xl font-bold">Loan Details</h1>
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Print Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {customerDetails.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Father&apos;s Name:</span>{" "}
                    {customerDetails.fatherName}
                  </p>
                  <p>
                    <span className="font-medium">Mother&apos;s Name:</span>{" "}
                    {customerDetails.motherName}
                  </p>
                  <p>
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {customerDetails.dob}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {customerDetails.gender}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span>{" "}
                    {customerDetails.mobile}
                  </p>
                </div>
              </div>

              {/* Loan Information */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Loan Information</h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Loan Account Number:</span>{" "}
                    {customerLoanData.loanAccountNumber}
                  </p>
                  <p>
                    <span className="font-medium">Customer ID:</span>{" "}
                    {customerLoanData.customerId}
                  </p>
                  <p>
                    <span className="font-medium">Loan Amount:</span> ₹
                    {customerLoanData?.amount?.toLocaleString("en-IN") ?? "0"}
                  </p>
                  <p>
                    <span className="font-medium">Loan Type:</span>{" "}
                    {customerLoanData.loanType}
                  </p>
                  <p>
                    <span className="font-medium">Interest Rate:</span>{" "}
                    {customerLoanData.interestPercentage}%
                  </p>
                  <p>
                    <span className="font-medium">Repayment Period:</span>{" "}
                    {customerLoanData.repaymentPeriod}
                  </p>
                </div>
              </div>

              {/* Present Address */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Present Address</h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {customerLoanData.presAddress}
                  </p>
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {customerLoanData.presCity}
                  </p>
                  <p>
                    <span className="font-medium">State:</span>{" "}
                    {customerLoanData.presState}
                  </p>
                  <p>
                    <span className="font-medium">PIN Code:</span>{" "}
                    {customerLoanData.presPIN}
                  </p>
                </div>
              </div>

              {/* Permanent Address */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Permanent Address
                </h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {customerLoanData.permAddress}
                  </p>
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {customerLoanData.permCity}
                  </p>
                  <p>
                    <span className="font-medium">State:</span>{" "}
                    {customerLoanData.permState}
                  </p>
                  <p>
                    <span className="font-medium">PIN Code:</span>{" "}
                    {customerLoanData.permPIN}
                  </p>
                </div>
              </div>

              {/* Status Information */}
              {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow col-span-full">
          <h2 className="text-xl font-semibold mb-4">Status Information</h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-4 rounded ${
                loanData.isCompleted
                  ? "bg-green-100 dark:bg-gray-900"
                  : "bg-yellow-100 dark:bg-gray-900"
              }`}
            >
              <p className="font-medium">Application Status</p>
              <p>{loanData.isCompleted ? "Completed" : "Pending"}</p>
            </div>
            <div
              className={`p-4 rounded ${
                loanData.isPaymentProcessed
                  ? "bg-green-100 dark:bg-gray-900"
                  : "bg-yellow-100 dark:bg-gray-900"
              }`}
            >
              <p className="font-medium">Payment Status</p>
              <p>{loanData.isPaymentProcessed ? "Processed" : "Pending"}</p>
            </div>
            <div
              className={`p-4 rounded ${
                loanData.status
                  ? "bg-green-100 dark:bg-gray-900"
                  : "bg-red-100 dark:bg-gray-900"
              }`}
            >
              <p className="font-medium">Overall Status</p>
              <p>{loanData.status ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div> */}
              {/* Steps and Buttons */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow col-span-full">
                <h2 className="text-xl font-semibold mb-4">Progress Buttons</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded bg-green-100 dark:bg-gray-900">
                    <p className="font-medium">Steps</p>
                    <div className="flex">
                      {" "}
                      {customerLoanData.stepOne === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepOne/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline className="text-2xl" title="Step I" />
                        </Link>
                      )}
                      {customerLoanData.stepTwo === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepTwo/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline className="text-2xl" title="Step II" />
                        </Link>
                      )}
                      {customerLoanData.stepThree === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepThree/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline
                            className="text-2xl"
                            title="Step III"
                          />
                        </Link>
                      )}
                      {customerLoanData.stepFour === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepFour/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline className="text-2xl" title="Step IV" />
                        </Link>
                      )}
                      {customerLoanData.stepFive === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepFive/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline className="text-2xl" title="Step V" />
                        </Link>
                      )}
                      {customerLoanData.stepSix === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepSix/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline className="text-2xl" title="Step VI" />
                        </Link>
                      )}
                      {customerLoanData.stepSeven === false && (
                        <Link
                          href={`/loggedInAdmin/loan/stepSeven/${customerLoanData._id}`}
                          className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                        >
                          <TiTickOutline
                            className="text-2xl"
                            title="Step VII"
                          />
                        </Link>
                      )}
                      {customerLoanData.stepEight === false && (
                        <>
                          <Link
                            href={`/loggedInAdmin/loan/stepEight/${customerLoanData._id}`}
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <TiTickOutline
                              className="text-2xl"
                              title="Step VIII"
                            />
                          </Link>
                        </>
                      )}
                      {customerLoanData.stepTwo === true &&
                        customerLoanData.stepThree === true &&
                        customerLoanData.stepFour === true &&
                        customerLoanData.stepFive === true &&
                        customerLoanData.stepSix === true &&
                        customerLoanData.stepSeven === true &&
                        customerLoanData.stepEight === true && (
                          <Link
                            // href={`/loggedInAdmin/loan/viewCustomerLoan/${e._id}`}
                            href="#"
                            className="text-sm hover:text-amber-500 hover:cursor-pointer hover:underline"
                          >
                            <LuView
                              className="text-3xl my-2"
                              title="Setup Payment"
                            />
                          </Link>
                        )}
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded items ${
                      loanData.isPaymentProcessed
                        ? "bg-green-100 dark:bg-gray-900"
                        : "bg-yellow-100 dark:bg-gray-900"
                    }`}
                  >
                    <p className="font-medium">Upload Documents</p>
                    <Link
                      href={`/loggedInAdmin/loan/docUploader/${customerLoanData._id}`}
                    >
                      <FaCloudUploadAlt
                        className="text-3xl my-2"
                        title="Upload"
                      />
                    </Link>
                  </div>
                  <div
                    className={`p-4 rounded ${
                      loanData.status
                        ? "bg-green-100 dark:bg-gray-900"
                        : "bg-red-100 dark:bg-gray-900"
                    }`}
                  >
                    <p className="font-medium">Download Document</p>
                    <Link
                      href={`/loggedInAdmin/loan/docViewer/${customerLoanData.loanAccountNumber}`}
                    >
                      <FaCloudDownloadAlt
                        className="text-3xl"
                        title="Download"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
