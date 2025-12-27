"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EmployeeIDCard({ params }) {
  const router = useRouter();
  const [employee, setEmployee] = useState([]);
  const [employeeSign, setEmployeeSign] = useState("");
  const [employeePhoto, setEmployeePhoto] = useState("");
  const [adminSign, setAdminSign] = useState("");
  const [address, setAddress] = useState([]);
  const host = process.env.NEXT_PUBLIC_HOST.replace(/^\//, "");
  const { slag } = use(params);
  const handleDownload = () => {
    window.print();
  };
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/employee/getEmployee`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
              "admin-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ employeeId: slag }),
          }
        );
        if (res.ok) res = await res.json();
        // console.log(res.employee);
        const sign = res.employee?.signature.replace(/^\//, "");
        const photo = res.employee?.image.replace(/^\//, "");

        setEmployee(res.employee);
        setEmployeeSign(sign);
        setEmployeePhoto(photo);
        setAddress(res.employee.postalData);
      } catch (e) {
        // ignore - we'll use mock
      }
    };
    fetchEmployee();
  }, [slag]);

  const getAdminProfile = async () => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/company/getCompany`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
      }
    );
    response = await response.json();
    const sign = response.company[0].sign?.replace(/^\//, "");
    setAdminSign(sign);
  };
  useEffect(() => {
    getAdminProfile();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <span className="print:hidden">
          <TopBar />
        </span>

        <div className="flex relative">
          <span className="print:hidden">
            <SideBar />
          </span>
          <div className="flex-1 p-8">
            <div className=" w-full gap-2">
              <button
                onClick={() => router.back()}
                className="mb-6 px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 print:hidden"
              >
                back
              </button>
              <button
                onClick={handleDownload}
                className="mb-6 px-6 mx-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 print:hidden"
              >
                Download
              </button>
            </div>
            <div className="w-full flex justify-center bg-gray-100 dark:bg-black py-10 print:bg-white">
              {/* A4 container */}
              <div className="a4-page">
                {/* ID Card 4x6 inches */}
                <div className="id-card relative">
                  {/* Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <Image
                      src="/Logo.PNG"
                      alt="Company Logo Watermark"
                      width={300}
                      height={300}
                    />
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 border-b pb-2">
                    <Image
                      src="/logo.png"
                      alt="Company Logo"
                      width={50}
                      height={50}
                      className="rounded"
                    />
                    <div>
                      <h1 className="text-lg font-bold leading-tight text-black uppercase">
                        Skyline Financials
                      </h1>
                      <p className="text-xs text-gray-600">
                        Employee Identification Card
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex gap-4 mt-4 items-start">
                    {/* Photo + ID */}
                    <div className="w-24 flex flex-col items-center text-center">
                      <div className="w-24 h-28 border-2 border-black rounded overflow-hidden">
                        <Image
                          src={`${host}/${employeePhoto}`}
                          alt="Employee Photo"
                          width={200}
                          height={200}
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-semibold tracking-wide text-black">
                        EMP-{employee.employeeId}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="text-sm text-black space-y-3 leading-tight">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {employee.f_name + " " + employee.l_name}
                        {""}
                      </p>
                      {/* <p>
                        <span className="font-semibold">Department:</span>{" "}
                        Engineering
                      </p> */}
                      <p>
                        <span className="font-semibold">Designation:</span>{" "}
                        {employee.role}
                      </p>
                      <p>
                        <span className="font-semibold">Date of Joining:</span>{" "}
                        {new Date(employee.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {employee.mobile}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {employee.email}
                      </p>
                      {/* <p>
                        <span className="font-semibold">
                          Emergency Contact:
                        </span>{" "}
                        +91 91234 56789
                      </p> */}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="mt-7 text-[12px] space-y-7 text-black flex justify-between">
                    <div>
                      <span className="font-semibold">Employee Address:</span>

                      <p className="text-sm my-2 ml-5">{employee.landmark}</p>
                      <p className="text-sm my-2 ml-5">{address[0]?.Name}</p>
                      <p className="text-sm my-2 ml-5">
                        {address[0]?.BranchType}
                      </p>
                      <p className="text-sm my-2 ml-5">
                        {address[0]?.Division}
                      </p>
                      <p className="text-sm my-2 ml-5">{address[0]?.Region}</p>
                      <p className="text-sm my-2 ml-5">{address[0]?.Circle}</p>
                      <p className="text-sm my-2 ml-5">{address[0]?.Pincode}</p>
                    </div>
                    <div className="mr-5">
                      <span className="font-semibold">Company Address:</span>{" "}
                      <p className="text-sm my-2 ml-5">Bamuntari Bazar</p>
                      <p className="text-sm my-2 ml-5">Bamuntari</p>
                      <p className="text-sm my-2 ml-5">Kalgachia</p>
                      <p className="text-sm my-2 ml-5">Barpeta(Assam)</p>
                      <p className="text-sm my-2 ml-5">781319</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-3 left-0 right-0 px-4 text-black">
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-center">
                        <div className="h-16 w-32  rounded overflow-hidden">
                          <Image
                            src={`${host}/${adminSign}`}
                            alt="Employee Photo"
                            width={400}
                            height={400}
                            className="object-cover"
                          />
                        </div>
                        <span className="block italic">Employee Sign</span>
                      </div>
                      <div className="text-center">
                        <div className="h-16 w-32  rounded overflow-hidden">
                          <Image
                            src={`${host}/${employeeSign}`}
                            alt="Employee Photo"
                            width={400}
                            height={400}
                            className="object-cover"
                          />
                        </div>
                        <span className="block italic">Employee Sign</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <style jsx>{`
                // .a4-page {
                //   width: 210mm;
                //   height: 297mm;
                //   display: flex;
                //   justify-content: center;
                //   align-items: center;
                // }
                .id-card {
                  width: 4in;
                  height: 6in;
                  background: white;
                  border-radius: 12px;
                  padding: 16px;
                  border: 2px solid black;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                  position: relative;
                }
                @media print {
                  body {
                    margin: 0;
                  }
                  .a4-page {
                    page-break-after: always;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
