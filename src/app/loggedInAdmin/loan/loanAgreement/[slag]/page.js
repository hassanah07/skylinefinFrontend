"use client";
import SideBar from "@/app/components/SideBar";
import SignatureFooter from "@/app/components/SignatureFooter";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useCallback, useEffect, useState } from "react";

export default function Page({ params }) {
  const router = useRouter();
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);
  const [customerId, setCustomerId] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [customer, setCustomer] = useState([]);
  const [loan, setLoan] = useState([]);
  const [data, setData] = useState([]);
  const [dataSchedule, setDataSchedule] = useState([]);
  const printDoc = () => {
    if (typeof window !== "undefined") window.print();
  };

  // improved print & logo styles to ensure consistent fit across pages
  const printStyles = `
        @media print {
            .no-print { display: none !important; }
            .page { margin: 0; box-shadow: 10px; -webkit-print-color-adjust: exact; }
            html, body { height: auto; zoom:95%; }
            .bg-logo { opacity: 0.04 !important; }
            .pagebreak { page-break-after: always; break-after: page; }
        }

        /* page-level layout */
        .page { position: relative; overflow: hidden; }

        /* background logo: centered and scaled to always fit nicely */
        .bg-logo {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 65%;
            max-width: 900px;
            height: auto;
            max-height: 900px;
            opacity: 0.08;
            pointer-events: none;
            user-select: none;
            z-index: 0;
            object-fit: contain;
        }

        /* slightly smaller on smaller screens */
        @media (max-width: 768px) {
            .bg-logo { width: 80%; max-width: 600px; max-height: 600px; opacity: 0.06; }
        }

        /* ensure page content sits above the logo */
        .page > .page-content { position: relative; z-index: 10; }
    `;

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(n);

  // Replace /logo.png with your actual logo path or a base64 data URL.
  const logoSrc = "/Logo.PNG";

  const Logo = () => (
    <Image
      src={logoSrc}
      alt="background_logo"
      aria-hidden="true"
      className="bg-logo"
      fill
    />
  );
  const getPersonalLoanAgreement = useCallback(async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/v2/personalLoanAgreement`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: mySlag }),
      }
    );
    res = await res.json();
    setCustomerId(res.data.customerId);
    setLoan(res.data);
  }, [mySlag]);

  const getEmiData = useCallback(async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/v2/getEmiDataWithLoanId`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: mySlag }),
      }
    );
    res = await res.json();
    setData(res);
  }, [mySlag]);
  useEffect(() => {
    getEmiData();
  }, [getEmiData]);

  useEffect(() => {
    getPersonalLoanAgreement();
  }, [getPersonalLoanAgreement]); // runs once

  useEffect(() => {
    const customerDetails = async () => {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/v2/customerDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ customerId: customerId }),
        }
      );
      res = await res.json();
      setCustomer(res.data);
      setDataSchedule(res.data.schedule);
    };
    if (customerId) {
      customerDetails();
    }
  }, [customerId]); // runs when customerId changes

  return (
    <div className="min-h-screen bg-gray-50">
      <span className="no-print">
        <TopBar />
      </span>
      <div className="flex relative">
        <span className="no-print">
          <SideBar />
        </span>
        <div className="flex-1 p-6">
          <div className="bg-gray-100 min-h-screen p-6">
            <style>{printStyles}</style>

            <div className="flex justify-between items-center mb-4 no-print">
              <div>
                <button
                  className="bg-slate-400 p-2 rounded-r-full text-white"
                  onClick={() => router.back()}
                >
                  Back
                </button>
                <h1 className="text-2xl font-semibold">Loan Agreement</h1>
                <p className="text-sm text-gray-600">
                  Agreement ID:
                  {loan.loanAccountNumber || "_________________________"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={printDoc}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                  Print
                </button>
              </div>
            </div>

            {/* Page 1: Agreement Header & Parties */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 uppercase">
                  <u>Agreement Details</u>
                </h2>
                <p className="mb-2">
                  This Loan Agreement is made between Lender-Skylinee Fynum
                  Small Finance Pvt. Ltd. and Borrower -
                  <span className="uppercase">
                    {customer.fullName || "_______________________"}
                    {/* {customer.fullName ? (
                <span>{customer.fullName}</span>
              ) : (
                <div className="">
                  <span className="text-3xl space-x-2">☐☐☐☐☐☐☐☐☐</span>
                </div>
              )} */}
                  </span>
                </p>

                <section className="mt-6">
                  <h3 className="font-semibold mb-2">Borrower Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Full Name</div>
                      <div className="font-medium uppercase">
                        {customer.fullName ||
                          "|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Customer ID</div>
                      <div className="font-medium">
                        {customer.customerId || "|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Father</div>
                      <div className="font-medium uppercase">
                        {customer.fatherName ||
                          "|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Spouse</div>
                      <div className="font-medium uppercase">
                        {customer.spouseName ||
                          "|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">PAN</div>
                      <div className="font-medium uppercase">
                        {customer.pan || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Aadhar</div>
                      <div className="font-medium uppercase">
                        {customer.aadhar || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Passport</div>
                      <div className="font-medium uppercase">
                        No.:&nbsp;{" "}
                        {customer.passport || "|__|__|__|__|__|__|__|__|__|__|"}
                        <br />
                        Expiry: &nbsp;
                        {customer.passportExp
                          ? new Date(customer.passportExp)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : "" || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Driving Licence</div>
                      <div className="font-medium uppercase">
                        No.:&nbsp;{" "}
                        {customer.driving || "|__|__|__|__|__|__|__|__|__|__|"}
                        <br />
                        Expiry: &nbsp;
                        {customer.drivingExp
                          ? new Date(customer.passportExp)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : "" || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-600">Email</div>
                      <div className="font-medium lowercase">
                        {customer.email || "______________________________"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Mobile</div>
                      <div className="font-medium lowercase">
                        +91
                        {customer.mobile || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-600">Occupation</div>
                      <div className="font-medium">
                        {customer.occuType}
                        {customer.empType || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div></div>
                    <div>
                      <div className="text-gray-600">Present Address</div>
                      <div className="font-medium capitalize">
                        {loan.presAddress ||
                          `Address:|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|`}
                        ,<br />
                        {loan.presLandmark ||
                          "Landmark:|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                        ,<br />
                        {loan.presCity ||
                          "City:|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                        ,
                        <br />
                        {loan.presPIN || "PIN:|__|__|__|__|__|__|"},<br />
                        {loan.presState || "State:Assam"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Permanent Address</div>
                      <div className="font-medium capitalize">
                        {loan.permAddress ||
                          `Address:|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|`}
                        ,<br />
                        {loan.permLandmark ||
                          "Landmark:|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                        ,<br />
                        {loan.permCity ||
                          "City:|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                        ,
                        <br />
                        {loan.permPIN || "PIN:|__|__|__|__|__|__|"},<br />
                        {loan.permState || "State:Assam"}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-6">
                  <h3 className="font-semibold mb-2">Loan Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Loan Type</div>
                      <div className="font-medium">
                        {loan.loanType || "|__|__|__|__|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Loan Amount</div>
                      <div className="font-medium">
                        {formatCurrency(loan.amount) || "|__|__|__|__|__|__|"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Interest</div>
                      <div className="font-medium">
                        {loan.interestType || "☐ Fixed ☐ Reducing Balance"} @{" "}
                        {loan.interestPercentage || "____"}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Repayment Period</div>
                      <div className="font-medium">
                        {loan.repaymentPeriod || "____"} Months
                      </div>
                    </div>
                  </div>
                </section>
                <SignatureFooter borrower={customer.fullName} />
              </div>
            </div>

            {/* Page 2: Definitions */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600">
                  <u>Definitions</u>
                </h2>
                <p className="text-sm mb-3">
                  In this Agreement, unless the context otherwise requires, the
                  following expressions shall have the following meanings:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-sm">
                  <li>
                    <u>Borrower</u> - means the person named in this Agreement
                    (including his heirs, executors and assigns).
                  </li>
                  <li>
                    <u>Lender</u> or <u>Company</u> - means the institution
                    advancing the Loan.
                  </li>
                  <li>
                    <u>Loan</u> - means the principal amount advanced together
                    with interest, charges and other monies payable under this
                    Agreement.
                  </li>
                  <li>
                    <u>Repayment Schedule</u> - means the schedule of
                    instalments provided to the Borrower.
                  </li>
                  <li>
                    <u>Default</u> - means the occurrence of any event of
                    default as set out in this Agreement.
                  </li>
                </ol>
              </div>

              <SignatureFooter borrower={customer.fullName || null} />
            </div>

            {/* Page 3: Loan Disbursement */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Disbursement
                </h2>
                <p className="text-sm mb-3">
                  Subject to the terms herein, the Lender shall disburse the
                  Loan amount to Borrower by direct credit to Borrower&apos;s
                  bank account as below:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Bank Name</div>
                    <div className="font-medium">
                      {loan.bankName ||
                        "Bank Name:|__|__|__|__|__|__|__|__|__|__|"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Branch / IFSC</div>
                    <div className="font-medium">
                      {loan.bankBranch ||
                        "Branch:|__|__|__|__|__|__|__|__|__|__|"}{" "}
                      /
                      {loan.bankIfsc ||
                        "IFSC:|__|__|__|__|__|__|__|__|__|__|__|"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Account Number</div>
                    <div className="font-medium">
                      {loan.bankAcNo ||
                        "Account Number|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Account Type</div>
                    <div className="font-medium">
                      {loan.bankAcType || "☐ Savings ☐ Current ☐ Overdraft"}
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold mt-6 mb-2">
                  Conditions Precedent to Disbursement
                </h3>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Execution of this Agreement by the Borrower.</li>
                  <li>
                    Submission of required KYC and documents satisfactory to the
                    Lender.
                  </li>
                  <li>
                    Creation of security (if any) and completion of
                    documentation as requested.
                  </li>
                </ul>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 4: Income and Asset Own */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Income-Self Declaration
                </h2>
                <p className="text-sm mb-3">
                  All the Income details given by me is true with the best of my
                  knowledge:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Income</div>
                    <div className="font-medium">
                      {(loan.annualSalary + 0).toLocaleString("en-IN") ||
                        "₹:|__|__|__|__|__|__|__|__|__|__|"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Other Income</div>
                    <div className="font-medium">
                      {(loan.otherAnnualIncome + 0).toLocaleString("en-IN") ||
                        "₹:|__|__|__|__|__|__|__|__|__|__|"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Income</div>
                    <div className="font-medium">
                      {(
                        loan.annualSalary + loan.otherAnnualIncome
                      ).toLocaleString("en-IN") ||
                        "₹:|__|__|__|__|__|__|__|__|__|__|"}
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold mt-6 mb-2">
                  Conditions Precedent to Disbursement
                </h3>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Execution of this Agreement by the Borrower.</li>
                  <li>
                    Submission of required KYC and documents satisfactory to the
                    Lender.
                  </li>
                  <li>
                    Creation of security (if any) and completion of
                    documentation as requested.
                  </li>
                </ul>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 4: Company Details */}
            {loan.isCompany == true && (
              <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
                <Logo />
                <div className="page-content">
                  <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                    Agreement Details with Company
                  </h2>

                  <section className="mt-6">
                    <h3 className="font-semibold mb-2">Company Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Company Name</div>
                        <div className="font-medium uppercase">
                          {loan.companyName}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company Address</div>
                        <div className="font-medium">{loan.companyAddress}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company City/ Town</div>
                        <div className="font-medium uppercase">
                          {loan.companyCity}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company State</div>
                        <div className="font-medium uppercase">
                          {loan.companyState}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company PIN</div>
                        <div className="font-medium uppercase">
                          {loan.companyPIN}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-600">CIN No</div>
                        <div className="font-medium uppercase">
                          {loan.cinNo}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">PAN No</div>
                        <div className="font-medium uppercase">
                          {loan.companyPanNo}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company GST No</div>
                        <div className="font-medium uppercase">
                          {loan.companyGst}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">
                          Effect Date of Company
                        </div>
                        <div className="font-medium uppercase">
                          {loan.companyEffDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company Phone No</div>
                        <div className="font-medium uppercase">
                          {loan.officialPhone}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company Email Id</div>
                        <div className="font-medium uppercase">
                          {loan.officialEmail}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <SignatureFooter borrower={customer.fullName} />
              </div>
            )}

            {/* COMPANY PARTNER DETAILS */}

            {loan.isCompany == true && (
              <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
                <Logo />
                <div className="page-content">
                  <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                    Company Shareholder/Partner Details
                  </h2>

                  {loan.companyPartnerDetails.map((element, index) => {
                    return (
                      <section className="mt-6" key={index}>
                        <h3 className="font-semibold mb-2 text-start text-white bg-red-600 w-fit px-4 py-2 rounded-r-full">
                          {index + 1} No Partner
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Name</div>
                            <div className="font-medium uppercase">
                              {element.partnerName || "______________"}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">PAN No</div>
                            <div className="font-medium">
                              {element.partnerPan}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Share % </div>
                            <div className="font-medium uppercase">
                              {element.profitShare}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Company State</div>
                            <div className="font-medium uppercase">
                              {element.partnerDob}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Company PIN</div>
                            <div className="font-medium uppercase">
                              {element.partnerMobile}
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-600">CIN No</div>
                            <div className="font-medium uppercase">
                              {element.partnerEmail}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">CIN No</div>
                            <div className="font-medium uppercase">
                              {element.dinNo}
                            </div>
                          </div>
                        </div>
                      </section>
                    );
                  })}
                </div>
                <SignatureFooter borrower={customer.fullName} />
              </div>
            )}

            {/* Assets details */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Assets Details
                </h2>

                <div className="page-content">
                  {loan.assetDetails != null ? (
                    loan.assetDetails.map((element, index) => {
                      return (
                        <section className="mt-6" key={index}>
                          <h3 className="font-semibold mb-2 text-start text-white bg-red-600 w-fit px-4 py-2 rounded-r-full">
                            {index + 1} No Asset
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Asset Name</div>
                              <div className="font-medium uppercase">
                                {element.assetType || "______________"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Value During Loan Agreement
                              </div>
                              <div className="font-medium uppercase">
                                {element.assetValue}
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    })
                  ) : (
                    <div className="text-sm capitalize">
                      No Assets has been provided for this Loan.
                    </div>
                  )}
                </div>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Existing Loan details */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Existing Loans
                </h2>

                <div className="page-content">
                  {loan.existingLoanDetails != null ? (
                    loan.existingLoanDetails.map((element, index) => {
                      return (
                        <section className="mt-6" key={index}>
                          <h3 className="font-semibold mb-2 text-start text-white bg-red-600 w-fit px-4 py-2 rounded-r-full">
                            {index + 1} No Loans
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Loan Type</div>
                              <div className="font-medium uppercase">
                                {element.loanType || "______________"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Institute Name
                              </div>
                              <div className="font-medium uppercase">
                                {element.instName}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Since</div>
                              <div className="font-medium uppercase">
                                {element.since || "______________"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Loan Amount</div>
                              <div className="font-medium uppercase">
                                {element.loanAmount}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Tenure</div>
                              <div className="font-medium uppercase">
                                {element.tenureOfLoan || "______________"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Loan Status</div>
                              <div className="font-medium uppercase">
                                {element.loanStatus}
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    })
                  ) : (
                    <div className="text-sm capitalize">
                      No Existing Loan Details has been added.
                    </div>
                  )}
                </div>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>
            {/* Collateral Details */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Security & Collateral
                </h2>

                <div className="page-content">
                  <p className="text-sm mb-3">
                    Where applicable, the Loan shall be secured by the
                    collateral described below. Security documents shall be
                    executed prior to or at disbursement.
                  </p>
                  {loan.collateralDetails ? (
                    loan.collateralDetails.map((element, index) => {
                      return (
                        <section className="mt-6" key={index}>
                          <h3 className="font-semibold mb-2 text-start text-white bg-red-600 w-fit px-4 py-2 rounded-r-full">
                            {index + 1} No Asset
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">
                                Collateral Name
                              </div>
                              <div className="font-medium uppercase">
                                {element.collateralName || "______________"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Collateral Type
                              </div>
                              <div className="font-medium uppercase">
                                {element.collateralType}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Collateral Details
                              </div>
                              <div className="font-medium uppercase">
                                {element.collateralDetails}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Property Owner 1
                              </div>
                              <div className="font-medium uppercase">
                                {element.propertyOwnerOne}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Property Owner 2
                              </div>
                              <div className="font-medium uppercase">
                                {element.propertyOwnerTwo}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Property Address
                              </div>
                              <div className="font-medium uppercase">
                                {element.propertyAddress}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Property Current Value
                              </div>
                              <div className="font-medium uppercase">
                                {element.propertyCurrentValue}
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    })
                  ) : (
                    <div className="capitalize text-center text-2xl text-red-600 font-semibold">
                      No collateral has been provided for this Loan.
                    </div>
                  )}

                  <h3 className="font-semibold mt-4">General Lien</h3>
                  <p className="text-sm capitalize">
                    The Borrower authorizes the Lender to appropriate any monies
                    held by the Lender in or towards satisfaction of amounts due
                    under this Agreement.
                  </p>
                </div>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 4: Interest & Repayment */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Interest & Repayment
                </h2>

                <h3 className="font-semibold mb-2">Interest</h3>
                <p className="text-sm mb-3">
                  Interest shall be charged on the outstanding principal at the
                  rate of{" "}
                  <b>
                    <u>{loan.interestPercentage}%</u>
                  </b>{" "}
                  per annum on a{" "}
                  <b>
                    <u>{loan.interestType}</u>
                  </b>{" "}
                  basis. Interest will be computed on the reducing balance
                  method unless otherwise specified.
                </p>

                <h3 className="font-semibold mb-2">Repayment</h3>
                <p className="text-sm mb-3">
                  Borrower shall repay the Loan in equal monthly instalments
                  within &nbsp;
                  <u>
                    <b>{loan.repaymentPeriod}</b>
                  </u>{" "}
                  Months . Instalments shall be payable on the due date stated
                  in the Repayment Schedule. Payments shall be first applied to
                  interest and then to principal.
                </p>

                <h3 className="font-semibold mb-2">Repayment Mode</h3>
                <p className="text-sm">
                  Repayment shall be by electronic debit (ECS/auto
                  debit/standing instruction), cheque, UPI or direct credit to
                  the Lender&apos;s designated account.
                </p>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 5: Fees, Charges & Taxes */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center underline text-red-600">
                  Fees, Charges & Taxes
                </h2>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>
                    Processing Fee: As agreed between the parties and payable
                    upfront/at disbursement.
                  </li>
                  <li>
                    Late Payment Charges: In the event of delayed payment, the
                    Lender may levy late payment charges at the rate specified
                    in the schedule.
                  </li>
                  <li>
                    Prepayment Charges: Prepayment, if permitted, may attract
                    prepayment charges as notified to the Borrower.
                  </li>
                  <li>
                    Taxes: All taxes, levies and duties payable in respect of
                    the Loan shall be borne by the Borrower.
                  </li>
                  <li>
                    Legal and Recovery Costs: Borrower shall be liable to
                    reimburse reasonable costs incurred in effecting recovery in
                    case of default.
                  </li>
                </ul>

                <div className="mt-4 text-sm">
                  <strong>Illustration:</strong> For Loan amount{" "}
                  {formatCurrency(loan.amount)} at {loan.interestPercentage}%,
                  total interest amount and EMI will vary based on the effective
                  rate and compounding; the Borrower should request an
                  amortization schedule for exact figures.
                </div>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 6: Representations & Warranties */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center underline text-red-600">
                  Representations & Warranties
                </h2>
                <p className="text-sm mb-3">
                  The Borrower represents and warrants to the Lender that:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-sm">
                  <li>
                    The Borrower is legally competent to enter this Agreement.
                  </li>
                  <li>
                    All information and documents provided to the Lender are
                    true, complete and accurate.
                  </li>
                  <li>
                    There are no pending legal proceedings which would
                    materially affect the Borrower&apos;s ability to repay.
                  </li>
                  <li>No Event of Default has occurred or is continuing.</li>
                </ol>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 7: Covenants */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600 underline">
                  Covenants
                </h2>
                <p className="text-sm mb-3">
                  The Borrower covenants with the Lender that until all sums due
                  under this Agreement have been paid in full:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    Borrower shall promptly pay instalments and other charges
                    when due.
                  </li>
                  <li>
                    Borrower shall not create or permit any security interest
                    over assets intended to secure this Loan except as permitted
                    by the Lender.
                  </li>
                  <li>
                    Borrower shall promptly inform the Lender of any material
                    adverse change in financial condition.
                  </li>
                </ul>

                <h3 className="font-semibold mt-4">Information Undertaking</h3>
                <p className="text-sm">
                  Borrower agrees to provide such financial statements and
                  documents as the Lender may reasonably require from time to
                  time.
                </p>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 8: Events of Default & Remedies */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-red-600 text-center underline">
                  Events of Default & Remedies
                </h2>
                <p className="text-sm mb-3">
                  The following shall constitute Events of Default:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-sm">
                  <li>
                    Failure to pay any instalment or other sum due under this
                    Agreement when due and such failure continues for more than
                    the grace period (if any).
                  </li>
                  <li>
                    Breach of any representation, warranty or covenant given by
                    the Borrower.
                  </li>
                  <li>
                    Any insolvency, bankruptcy or winding-up proceedings
                    initiated against the Borrower.
                  </li>
                </ol>

                <h3 className="font-semibold mt-4">Remedies</h3>
                <p className="text-sm">
                  Upon occurrence of an Event of Default, the Lender may,
                  without prejudice to other rights, accelerate the Loan, demand
                  immediate payment of all sums due, enforce security, and take
                  any other lawful action.
                </p>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 9: Amortization Schedule */}
            <div className="page relative bg-white p-10 rounded shadow mb-6 pagebreak">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 text-red-600 text-center underline">
                  Loan Amortization Details
                </h2>
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 mb-6 print:hidden">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">
                    Loan Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                    <div className="font-medium">Loan Account Number:</div>
                    <div>{data.loanAccountNumber}</div>

                    <div className="font-medium">Loan Amount:</div>
                    <div>
                      ₹
                      {Number(data.loanAmount).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </div>

                    <div className="font-medium">Interest Rate:</div>
                    <div>{data.interest}% per annum</div>

                    <div className="font-medium">Tenure:</div>
                    <div>{data.tenure} months</div>

                    <div className="font-medium">Interest Type:</div>
                    <div>{data.type}</div>

                    <div className="font-medium">Total Interest:</div>
                    <div>
                      ₹
                      {Number(data.totalInterest).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </div>

                    <div className="font-medium">Total Payable Amount:</div>
                    <div>
                      ₹
                      {Number(data.payableAmount).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>

                {/* Amortization Schedule Table */}
                <div className="border border-gray-300 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">
                    Amortization Schedule
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200">
                      <thead className="">
                        <tr className="text-gray-700 text-center">
                          <th className="border p-2">Month</th>
                          <th className="border p-2">Opening (₹)</th>
                          <th className="border p-2">EMI (₹)</th>
                          <th className="border p-2">Principal (₹)</th>
                          <th className="border p-2">Interest (₹)</th>
                          <th className="border p-2">Closing (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {data.schedule?.map((item, index) => (
                          <tr key={item.m} className="">
                            <td className="border p-2 font-medium">
                              {index + 1}
                            </td>
                            <td className="border p-2">
                              {item.opening.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="border p-2">
                              {item.emi.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="border p-2">
                              {item.principal.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="border p-2">
                              {item.interest.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="border p-2">
                              {item.closing.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Table Footer Totals */}
                      <tfoot>
                        <tr className="font-semibold text-center">
                          <td className="border p-2" colSpan="3">
                            Total
                          </td>
                          <td className="border p-2">
                            ₹{(data.loanAmount + 0).toLocaleString("en-IN")}
                          </td>
                          <td className="border p-2">
                            ₹
                            {(
                              data.payableAmount - data.loanAmount
                            ).toLocaleString("en-IN")}
                          </td>
                          <td className="border p-2">
                            ₹
                            {data.payableAmount?.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>

            {/* Page 10: Miscellaneous & Signatures */}
            <div className="page relative bg-white p-10 rounded shadow mb-6">
              <Logo />
              <div className="page-content">
                <h2 className="text-xl font-bold mb-4 underline text-center text-red-600">
                  Miscellaneous & Signatures
                </h2>

                <h3 className="font-semibold mt-2">Notices</h3>
                <p className="text-sm mb-2">
                  Any notice required under this Agreement shall be in writing
                  and delivered to the addresses provided by the parties.
                </p>

                <h3 className="font-semibold mt-2">Governing Law</h3>
                <p className="text-sm mb-2">
                  This Agreement shall be governed by and construed in
                  accordance with the laws of India and the courts at the
                  Borrower&apos;s city shall have exclusive jurisdiction.
                </p>

                <h3 className="font-semibold mt-2">Entire Agreement</h3>
                <p className="text-sm mb-4">
                  This Agreement, together with the schedules and documents
                  referred to herein, constitutes the entire agreement between
                  the parties and supersedes all prior arrangements.
                </p>
              </div>
              <SignatureFooter borrower={customer.fullName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
