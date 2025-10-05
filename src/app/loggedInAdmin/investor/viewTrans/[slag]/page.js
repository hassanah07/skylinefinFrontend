"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Page = ({ params }) => {
  // const [employee, setEmployee] = useState(null);
  const router = useRouter();
  const { slag } = use(params);

  // Try to fetch real employee data from an api route, fall back to mock data
  // const fetchEmployee = async () => {
  //   try {
  //     let res = await fetch(`/api/admin/employee/${slag}`, {
  //       cache: "no-store",
  //     });
  //     if (res.ok) res = await res.json();
  //     console.log(res)
  //     setEmployee(res);
  //   } catch (e) {
  //     // ignore - we'll use mock
  //   }

  // if (!employee) {
  // Mock data structure – replace with your real shape
  const employee = {
    id: slag,
    name: "Jane Doe",
    title: "Senior Software Engineer",
    department: "Engineering",
    email: "jane.doe@example.com",
    phone: 5500000,
    location: "Remote / New York",
    joinedAt: "2021-06-15",
    status: "success",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&q=80&auto=format&fit=crop&s=placeholder",
    notes:
      "Full-stack engineer working on product core. Strong in React, Node and cloud infra.",
    stats: {
      projects: 8,
      tasks: 42,
      reports: 5,
    },
    // });
  };
  // };
  // useEffect(() => {
  //   fetchEmployee();
  // }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Txn Details</h1>
            <p className="text-sm">Txn Id: {employee.id}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center px-3 py-2 rounded-md bg-white border text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              onClick={() => router.back()}
            >
              ← Back
            </button>
          </div>
        </div>

        <section className="bg-slate-400 rounded-lg overflow-hidden shadow-accent-foreground shadow-2xl">
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {/* {employee.name} */}
                    Type: upi
                  </h2>

                  <p className="text-sm text-gray-500">
                    {/* {employee.title} • {employee.department} */}
                    Date and Time: 12-05-2024 10:30 AM
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    employee.status === "success"
                      ? "bg-green-100 text-slate-900"
                      : "bg-gray-100 text-red-500"
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="dark:text-white tracking-wide">By</p>
                  <p className="mt-1">
                    {/* {employee.email} */}
                    Name: ANOWARUL HASSAN
                  </p>
                  <p className="mt-1">
                    {/* {employee.phone} */}
                    User Id: 9876543210
                  </p>
                </div>

                <div>
                  <p className="dark:text-white tracking-wide">Txn Details</p>
                  <p className="mt-1">Method: UPI</p>
                  <p className="mt-1">Txn No: 32658546955</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="tracking-wide">Status</p>
                <p className="mt-2 text-gray-700">Success</p>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="dark:text-white tracking-wide">Txn. Amount</p>
                  <p className="mt-1 text-blue-500 font-semibold text-xl">
                    {employee.phone.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-6 text-sm text-gray-700">
              <div>
                <p className="text-slate-500 font-semibold">Total EMI</p>
                <p className="font-medium">{employee.stats.projects}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">EMI No</p>
                <p className="font-medium">{employee.stats.tasks}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">Remaining EMI</p>
                <p className="font-medium">{employee.stats.reports}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/loggedInAdmin/investor/transHistory/${employee.id}`}
                className="px-3 py-2 rounded-md bg-slate-400 border text-sm cursor-pointer hover:bg-blue-300"
              >
                Raise Refund
              </Link>
              <Link
                href={`/loggedInAdmin/investor/transHistory/${employee.id}`}
                className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 cursor-pointer"
              >
                Mark as Fraud⚠️
              </Link>
              <Link
                href={`/loggedInAdmin/investor/transHistory/${employee.id}`}
                className="px-3 py-2 rounded-md bg-red-700 text-white text-sm hover:bg-red-900 cursor-pointer"
              >
                Mark as Success✔️
              </Link>
              <Link
                href={`/loggedInAdmin/investor/transHistory/${employee.id}`}
                className="px-3 py-2 rounded-md bg-red-800 text-white text-sm hover:bg-red-700 cursor-pointer"
              >
                Mark as Failed❌
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default Page;
