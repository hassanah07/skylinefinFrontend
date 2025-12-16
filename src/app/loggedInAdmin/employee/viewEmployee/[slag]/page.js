"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import SideBar from "@/app/components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const Page = ({ params }) => {
  const router = useRouter();
  const { slag } = use(params);
  const [employeeData, setEmployeeData] = useState();

  const toastOptions = {
    theme: "colored",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const changeStatusActive = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/employee/makeActive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ employeeId: slag }),
        }
      );
      res = await res.json();
      toast.success(`${res.msg}`, toastOptions);
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (e) {
      // ignore - we'll use mock
    }
  };
  const changeStatusDeactive = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/employee/makeDeactive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ employeeId: slag }),
        }
      );
      res = await res.json();
      toast.success(`${res.msg}`, toastOptions);
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (e) {
      // ignore - we'll use mock
    }
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
        setEmployeeData(res.employee);
        
      } catch (e) {
        // ignore - we'll use mock
      }
    };
    fetchEmployee();
  }, [slag]);

  return (
    <main
      className={`min-h-screen bg-gray-50 ${
        employeeData?.status === true
          ? "dark:bg-black"
          : "bg-red-500 dark: bg-red-500"
      }`}
    >
      <TopBar />
      <div className="flex relative">
        <ToastContainer />
        <SideBar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Employee Details</h1>
                <p className="text-sm">Admin view — ID: {employeeData?._id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center px-3 py-2 rounded-md bg-white border text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.back()}
                >
                  ← Back
                </button>
                {/* <Link
                  href={`/Admin/myapp/employee/edit/${employeeData?._id}`}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Edit
                </Link> */}
              </div>
            </div>

            <section className="bg-slate-400 rounded-lg overflow-hidden shadow-accent-foreground shadow-2xl">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src="https://www.shutterstock.com/image-vector/beauty-face-woman-logo-vector-600nw-2493789517.jpg"
                    alt="ImageofEmploye"
                    className="w-28 h-28 rounded-full object-cover border"
                    width={300}
                    height={300}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {employeeData?.f_name} {employeeData?.l_name}
                      </h2>
                      <p className="text-sm text-gray-500 capitalize">
                        Appointed Role • {employeeData?.role}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        employeeData?.status === true
                          ? "bg-green-100 text-slate-900"
                          : "bg-gray-200 text-red-500"
                      }`}
                    >
                      {employeeData?.status === true ? (
                        <p>Active</p>
                      ) : (
                        <p>Inactive</p>
                      )}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="text-xs text-black uppercase tracking-wide">
                        Contact
                      </p>
                      <p className="mt-1">{employeeData?.email}</p>
                      <p className="mt-1">{employeeData?.mobile}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide">Address</p>

                      <p className="mt-1">{employeeData?.landmark}</p>

                      <p className="mt-1">
                        Post Office: {employeeData?.postalData[0].Name}
                      </p>
                      <p className="mt-1">
                        Post Office Type:{" "}
                        {employeeData?.postalData[0].BranchType}
                      </p>
                      <p className="mt-1">
                        Dist.: {employeeData?.postalData[0].District}
                      </p>
                      <p className="mt-1">
                        Division: {employeeData?.postalData[0].Division}
                      </p>
                      <p className="mt-1">
                        City: {employeeData?.postalData[0].Region}
                      </p>
                      <p className="mt-1">
                        Circle: {employeeData?.postalData[0].Circle}
                      </p>
                      <p className="mt-1">
                        State: {employeeData?.postalData[0].State}
                      </p>

                      <p className="mt-1">
                        Pincode: {employeeData?.postalData[0].Pincode}
                      </p>

                      <p className="mt-1">Joined: {employeeData?.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* <div className="flex gap-6 text-sm text-gray-700">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Projects</p>
                    <p className="font-medium">{employee.stats.projects}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">
                      Open Tasks
                    </p>
                    <p className="font-medium">{employee.stats.tasks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Reports</p>
                    <p className="font-medium">{employee.stats.reports}</p>
                  </div>
                </div> */}

                <div className="flex gap-2">
                  {employeeData?.status === false ? (
                    <button
                      className="px-3 py-2 rounded-md bg-blue-500 border text-sm text-white hover:bg-blue-600"
                      onClick={changeStatusActive}
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      className="px-3 py-2 rounded-md bg-blue-500 border text-sm text-white hover:bg-blue-600"
                      onClick={changeStatusDeactive}
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </main>
  );
};
export default Page;
