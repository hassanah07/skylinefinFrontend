"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    status: "Active",
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
            <h1 className="text-2xl font-semibold">Investor Details</h1>
            <p className="text-sm">Admin view — ID: {employee.id}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center px-3 py-2 rounded-md bg-white border text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              onClick={() => router.back()}
            >
              ← Back
            </button>
            <Link
              href={`/Admin/myapp/employee/edit/${employee.id}`}
              className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              Edit
            </Link>
          </div>
        </div>

        <section className="bg-slate-400 rounded-lg overflow-hidden shadow-accent-foreground shadow-2xl">
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Image
                src={employee.avatar}
                alt={employee.name}
                className="w-28 h-28 rounded-full object-cover border"
                fill
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{employee.name}</h2>
                  <p className="text-sm text-gray-500">
                    {employee.title} • {employee.department}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    employee.status === "active"
                      ? "bg-green-100 text-slate-900"
                      : "bg-gray-100 text-red-500"
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="dark:text-white tracking-wide">Contact</p>
                  <p className="mt-1">{employee.email}</p>
                  <p className="mt-1">{employee.phone}</p>
                </div>

                <div>
                  <p className="dark:text-white tracking-wide">
                    Permanent Office
                  </p>
                  <p className="mt-1">{employee.location}</p>
                  <p className="mt-1">Joined: {employee.joinedAt}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="tracking-wide">About</p>
                <p className="mt-2 text-gray-700">{employee.notes}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="dark:text-white tracking-wide">
                    Invested Amount
                  </p>
                  <p className="mt-1 text-blue-500 font-semibold text-xl">
                    {employee.phone.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="dark:text-white tracking-wide">Profit Earned</p>
                  <p className="mt-1 text-blue-500 font-semibold text-xl">
                    {employee.phone.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="dark:text-white tracking-wide">Total Capital</p>
                  <p className="mt-1 text-blue-500 font-semibold text-xl">
                    {(employee.phone + employee.phone).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-transparent tracking-wide">xxx</p>
                  <p className="mt-1 text-transparent font-semibold text-xl">
                    000
                  </p>
                  <p className="mt-1 text-transparent font-semibold text-xl">
                    000
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-6 text-sm text-gray-700">
              <div>
                <p className="text-slate-500 font-semibold">Total Employee</p>
                <p className="font-medium">{employee.stats.projects}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">
                  Total Running Loan
                </p>
                <p className="font-medium">{employee.stats.tasks}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">
                  Total Running Recurring
                </p>
                <p className="font-medium">{employee.stats.reports}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/loggedInAdmin/investor/transHistory/${employee.id}`}
                className="px-3 py-2 rounded-md bg-slate-400 border text-sm cursor-pointer hover:bg-blue-300"
              >
                Trans. History
              </Link>
              <Link
                href={`/loggedInAdmin/investor/transHistory/${employee.id}`}
                className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 cursor-pointer"
              >
                Deactivate
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default Page;
