"use client";
import { use, useState } from "react";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = ({ params }) => {
  const { slag } = use(params);
  const mySlag = decodeURIComponent(slag);
  const [isCompanyYes, setIsCompanyYes] = useState(false);
  const [isCompanyNo, setIsCompanyNo] = useState(true);
  const [formData, setFormData] = useState({
    id: mySlag,
    isCompany: isCompanyYes,
    companyName: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyPin: "",
    yearofIncorporation: "",
    cinNo: "",
    companyPanNo: "",
    companyGst: "",
    companyEffDate: "",
    officePhone: "",
    officeEmail: "@gmail.com",
    // employementType: selected,
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
  const handleCompany = () => {
    if (isCompanyYes === false) {
      setIsCompanyYes(true);
      setIsCompanyNo(false);
      setFormData({ ...formData, isCompany: true });
    } else if (isCompanyNo === false) {
      setIsCompanyYes(false);
      setIsCompanyNo(true);
      setFormData({ ...formData, isCompany: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/loanStepII`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "admin-token": localStorage.getItem("token"),
    //       },
    //       body: JSON.stringify(formData),
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);

    //   if (data.status === true) {
    //     toast.success(`${data.msg}`, toastOptions);
    //     setTimeout(() => {
    //       router.back();
    //     }, 3000);
    //   } else {
    //     toast.error(`${data.msg}`, toastOptions);
    //   }
    // } catch (error) {
    //   toast.error("Please Reload this Page", toastOptions);
    // }
    alert("Comming Soon");
  };
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
                Step II
              </h2>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
