"use client";
import { use, useEffect, useState } from "react";

export default function CustomerLoanDetails({ params }) {
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

  const [customerData, setCustomerData] = useState({
    fullName: "John Doe",
    fatherName: "James Doe",
    motherName: "Jane Doe",
    dob: "1990-01-01",
    gender: "Male",
    mobile: "9876543210",
  });

  useEffect(() => {
    // This will be replaced with actual API call later
    console.log("Loan ID:", myslag);
  }, [myslag]);

  const handlePrint = () => {
    window.print();
  };

  if (!loanData || !customerData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Name:</span> {customerData.fullName}
            </p>
            <p>
              <span className="font-medium">Father's Name:</span>{" "}
              {customerData.fatherName}
            </p>
            <p>
              <span className="font-medium">Mother's Name:</span>{" "}
              {customerData.motherName}
            </p>
            <p>
              <span className="font-medium">Date of Birth:</span>{" "}
              {customerData.dob}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {customerData.gender}
            </p>
            <p>
              <span className="font-medium">Mobile:</span> {customerData.mobile}
            </p>
          </div>
        </div>

        {/* Loan Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Loan Information</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Loan Account Number:</span>{" "}
              {loanData.loanAccountNumber}
            </p>
            <p>
              <span className="font-medium">Customer ID:</span>{" "}
              {loanData.customerId}
            </p>
            <p>
              <span className="font-medium">Loan Amount:</span> ₹
              {loanData.amount.toLocaleString("en-IN")}
            </p>
            <p>
              <span className="font-medium">Loan Type:</span>{" "}
              {loanData.loanType}
            </p>
            <p>
              <span className="font-medium">Interest Rate:</span>{" "}
              {loanData.interestPercentage}%
            </p>
            <p>
              <span className="font-medium">Repayment Period:</span>{" "}
              {loanData.repaymentPeriod}
            </p>
          </div>
        </div>

        {/* Present Address */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Present Address</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Address:</span>{" "}
              {loanData.presAddress}
            </p>
            <p>
              <span className="font-medium">City:</span> {loanData.presCity}
            </p>
            <p>
              <span className="font-medium">State:</span> {loanData.presState}
            </p>
            <p>
              <span className="font-medium">PIN Code:</span> {loanData.presPIN}
            </p>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Permanent Address</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Address:</span>{" "}
              {loanData.permAddress}
            </p>
            <p>
              <span className="font-medium">City:</span> {loanData.permCity}
            </p>
            <p>
              <span className="font-medium">State:</span> {loanData.permState}
            </p>
            <p>
              <span className="font-medium">PIN Code:</span> {loanData.permPIN}
            </p>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-white p-6 rounded-lg shadow col-span-full">
          <h2 className="text-xl font-semibold mb-4">Status Information</h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-4 rounded ${
                loanData.isCompleted ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <p className="font-medium">Application Status</p>
              <p>{loanData.isCompleted ? "Completed" : "Pending"}</p>
            </div>
            <div
              className={`p-4 rounded ${
                loanData.isPaymentProcessed ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <p className="font-medium">Payment Status</p>
              <p>{loanData.isPaymentProcessed ? "Processed" : "Pending"}</p>
            </div>
            <div
              className={`p-4 rounded ${
                loanData.status ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-medium">Overall Status</p>
              <p>{loanData.status ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
