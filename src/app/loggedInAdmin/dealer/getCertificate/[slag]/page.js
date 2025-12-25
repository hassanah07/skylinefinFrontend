"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { use, useEffect, useState } from "react";

export default function DealerCertificate({ params }) {
  const { slag } = use(params);
  const [companyData, setCompanyData] = useState([]);
  const [compSign, setCompSign] = useState("");
  const [dealer, setDealer] = useState([]);
  const [sign, setSign] = useState("");
  const [photo, setPhoto] = useState("");
  const host = process.env.NEXT_PUBLIC_HOST.replace(/^\//, "");
  const dealerId = 123;
  const handlePrint = () => window.print();
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/dealer/getDealerWithDealerId`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
              "admin-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ id: slag }),
          }
        );
        if (res.ok) res = await res.json();
        const sign = res.dealer?.signature.replace(/^\//, "");
        const photo = res.dealer?.image.replace(/^\//, "");
        console.log(res);
        setDealer(res.dealer);
        setSign(sign);
        setPhoto(photo);
      } catch (e) {
        // ignore - we'll use mock
      }
    };
    fetchEmployee();
  }, [slag]);

  useEffect(() => {
    const company = async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/company/getCompany`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
            "admin-token": localStorage.getItem("token"),
          },
        }
      );
      const res = await data.json();
      console.log(res.company[0]);
      setCompanyData(res.company[0]);
      setCompSign(res.company[0].sign?.replace(/^\//, ""));
    };
    company();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <span className="print:hidden">
        <TopBar />
      </span>

      <div className="flex relative">
        <span className="print:hidden">
          <SideBar />
        </span>
        <div className="flex-1 relative p-6">
          <div className="w-full flex flex-col items-center bg-gray-100 dark:bg-black py-10 print:bg-white">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="mb-6 px-6 py-2 rounded-md bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 print:hidden"
            >
              Download / Print Certificate
            </button>

            {/* A4 Certificate */}
            <div className="certificate-page">
              <div className="certificate relative">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <Image
                    src="/logo.png"
                    alt="Watermark"
                    width={500}
                    height={500}
                  />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt="Company Logo"
                      width={70}
                      height={70}
                    />
                    <div>
                      <h1 className="text-lg text-gray-700 font-bold uppercase">
                        {companyData.name}
                      </h1>
                      <p className="text-sm text-gray-600">
                        Registered Loan Providing Company
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">
                    Dealer Code: {dealer?.dealerId}
                  </p>
                </div>

                {/* Title */}
                <h2 className="text-center text-xl text-gray-600 font-bold mt-10 underline">
                  DEALER AUTHORIZATION CERTIFICATE
                </h2>

                {/* Body */}
                <div className="mt-10 text-lg text-gray-600 leading-relaxed">
                  <p className="text-justify">
                    This is to certify that{" "}
                    <span className="font-semibold capitalize">
                      {dealer.name}
                    </span>
                    , having its registered office at{" "}
                    <span className="font-semibold">{dealer.address}</span>, is
                    hereby appointed as an{" "}
                    <span className="font-semibold">Authorized Dealer</span> of
                    <span className="font-semibold"> {companyData.name}</span>
                  </p>

                  <p className="mt-6 text-justify">
                    The above dealer is authorized to facilitate and process
                    loan applications on behalf of our company, subject to
                    compliance with company policies, RBI guidelines, and
                    applicable laws.
                  </p>

                  <p className="mt-6">
                    This authorization is valid from{" "}
                    <span className="font-semibold">
                      {new Date(dealer.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {/* &nbsp; */}
                    {/* to <span className="font-semibold">31 December 2027</span> */}
                    , unless revoked.
                  </p>
                </div>

                {/* Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-10">
                  {/* Dealer */}
                  <div className="text-center">
                    <div className="h-16 flex items-center justify-center">
                      <Image
                        src={`${host}/${sign}`}
                        alt="Dealer Signature"
                        width={150}
                        height={60}
                      />
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <p className="font-semibold text-gray-600">
                        Authorized Dealer
                      </p>
                      <p className="text-sm text-gray-600">{dealer.name}</p>
                      <p className="text-sm text-gray-600">Dealer Signature</p>
                    </div>
                  </div>

                  {/* Admin */}
                  <div className="text-center">
                    <div className="h-16 flex items-center justify-center">
                      <Image
                        src={`${host}/${compSign}`}
                        alt="Admin Signature"
                        width={150}
                        height={60}
                      />
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <p className="font-semibold text-gray-600">
                        Authorized Signatory
                      </p>
                      <p className="text-sm text-gray-600">
                        {companyData.name}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        legally authorized
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                {/* QR Code Validation */}
                <div className="absolute bottom-28 right-10 border-2 border-gray-600 shadow-2xl p-2 text-center">
                  <QRCodeCanvas
                    value={`${host}/${dealer.dealerId}`}
                    size={90}
                    level="H"
                    // includeMargin={true}
                  />
                  <p className="text-[10px] mt-1">Scan to verify</p>
                </div>
                <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-gray-600">
                  <p>Registered Office: {companyData.address}</p>
                  <p>
                    CIN: {companyData.cinNo} | {companyData.link}
                  </p>
                </div>
              </div>
            </div>

            <style jsx>{`
              .certificate-page {
                width: 210mm;
                height: 297mm;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .certificate {
                width: 190mm;
                height: 267mm;
                background: white;
                padding: 40px;
                border: 2px solid #111827;
                position: relative;
              }
              @media print {
                body {
                  margin: 0;
                }
                .certificate-page {
                  page-break-after: always;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
