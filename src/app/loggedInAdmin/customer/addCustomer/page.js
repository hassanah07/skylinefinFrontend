"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoanApplicationForm() {
  const router = useRouter();
  const optionsOccupation = [
    "Salaried",
    "Self Employed",
    "Business",
    "Retaired",
    "House Wife",
    "Student",
    "Others",
  ];
  const optionsGST = ["Available"];

  const [gst, setGst] = useState(true);
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    occuType: "",
    empType: "",
    orgType: "Others",
    bussType: "Others",
    commuType: "All of the Above",
    gstNo: "",
    fullName: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    dob: "",
    dependentNo: "2",
    religion: "",
    gender: "",
    education: "",
    passport: "",
    passportExp: "",
    driving: "",
    drivingExp: "",
    pan: "",
    aadhar: "",
    voter: "",
    upi: "",
    email: "@gmail.com",
    mobile: "",
    amount: "",
    loanType: "Personal Loan",
    repaymentPeriod: "12",
    interestType: "Fixed",
    interestPercentage: 24,
    remarks: "",
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
  // const handleChange = (option) => {
  //   if (option === "Student") {
  //     setSelected("Student");
  //   } else if (option === "Salaried") {
  //     setSelected("Salaried");
  //   }
  // };
  const handleGst = () => {
    if (gst === false) {
      setGst(true);
    } else {
      setGst(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/loanProcessor/createLoanUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.status === true) {
        toast.success(`${data.msg}`, toastOptions);
        setTimeout(() => {
          router.push("/loggedInAdmin/customer");
        }, 4000);
      } else {
        toast.error(`${data.msg}`, toastOptions);
        setTimeout(() => {
          router.push("/loggedInAdmin/customer");
        }, 4000);
      }
    } catch (error) {
      toast.error("Please Reload this page", toastOptions);
    }
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
                Loan User Form
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* <div>
                <label className="block text-sm font-medium">
                  Occupation Type
                </label>
                <div className="flex flex-col">
                  {optionsOccupation.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => handleChange(option)}
                        // disabled={selected.includes("Student") && option !== "Student"}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="">{option}</span>
                    </label>
                  ))}
                </div>
              </div> */}
                  <div>
                    <label className="block text-sm font-medium">
                      Occupation Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.occuType}
                      onChange={(e) =>
                        setFormData({ ...formData, occuType: e.target.value })
                      }
                    >
                      <option value="">Select Occupation type</option>
                      <option value="Salaried">Salaried</option>
                      <option value="Self Employed">Self Employed</option>
                      <option value="Business">Business</option>
                      <option value="Retaired">Retaired</option>
                      <option value="House Wife">House Wife</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Employement Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.empType}
                      onChange={(e) =>
                        setFormData({ ...formData, empType: e.target.value })
                      }
                    >
                      <option value="">Select Employement type</option>
                      <option value="Doctoe">Doctoe</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="CA/CS">CA/CS</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Architect">Architect</option>
                      <option value="Lawyer">Lawyer</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Organization Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.orgType}
                      onChange={(e) =>
                        setFormData({ ...formData, orgType: e.target.value })
                      }
                    >
                      <option value="">Select Organization type</option>
                      <option value="Govt">Govt</option>
                      <option value="PSU">PSU</option>
                      <option value="Public LTD">Public LTD</option>
                      <option value="PVT LTD">PVT LTD</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Business Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.bussType}
                      onChange={(e) =>
                        setFormData({ ...formData, bussType: e.target.value })
                      }
                    >
                      <option value="">Select Business type</option>
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Retailer">Retailer</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Trade/Distribution">
                        Trade/Distribution
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Communication Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.commuType}
                      onChange={(e) =>
                        setFormData({ ...formData, commuType: e.target.value })
                      }
                    >
                      <option value="">Select Communication type</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="SMS">SMS</option>
                      <option value="Email">Email</option>
                      <option value="Direct Call">Direct Call</option>
                      <option value="All of the Above">All of the Above</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      If GSTIN Available
                    </label>
                    <div className="flex flex-col">
                      <span className="flex">
                        <input
                          type="checkbox"
                          checked={gst}
                          onChange={() => handleGst()}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="mx-2">Yes</span>
                      </span>
                    </div>
                  </div>
                  {gst === true && (
                    <div>
                      <label className="block text-sm font-medium">
                        GST No
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full uppercase border-b-2 shadow-md focus:border-blue-500"
                        value={formData.gstNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gstNo: e.target.value.slice(0, 15),
                          })
                        }
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase border-b-2 shadow-md focus:border-blue-500"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullName: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Father&apos;s Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.fatherName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fatherName: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Mother&apos;s Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.motherName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          motherName: e.target.value.slice(0, 25),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Spouse Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                      value={formData.spouseName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spouseName: e.target.value.slice(0, 25),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2 uppercase"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Nos of Dependent
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                      value={formData.dependentNo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dependentNo: e.target.value.slice(0, 1),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Religion
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.religion}
                      onChange={(e) =>
                        setFormData({ ...formData, religion: e.target.value })
                      }
                      required
                    >
                      <option value="">Select loan type</option>
                      <option value="personal">Islam</option>
                      <option value="education">Sanatani/Hindu</option>
                      <option value="medical">Boddhism</option>
                      <option value="emergency">Christian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      required
                    >
                      <option value="">Select loan type</option>
                      <option value="personal">Male</option>
                      <option value="education">Female</option>
                      <option value="medical">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Education
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.education}
                      onChange={(e) =>
                        setFormData({ ...formData, education: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Education type</option>
                      <option value="Graduation">Graduation</option>
                      <option value="secondary">Secondary</option>
                      <option value="metriculation">Metriculation</option>
                      <option value="under metric">Under Metric</option>
                      <option value="uneducated">Uneducated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Passport No & Expiry
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.passport}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            passport: e.target.value.slice(0, 8),
                          })
                        }
                      />
                      &
                      <input
                        type="date"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.passportExp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            passportExp: e.target.value,
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Driving Licence No & Expiry
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.driving}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            driving: e.target.value.slice(0, 16),
                          })
                        }
                      />
                      &
                      <input
                        type="date"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.drivingExp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            drivingExp: e.target.value,
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">PAN No</label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.pan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pan: e.target.value.slice(0, 10),
                          })
                        }
                        required
                      />
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Aadhaar No
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.aadhar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aadhar: e.target.value.slice(0, 12),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Voter ID No
                    </label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full uppercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.voter}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            voter: e.target.value.slice(0, 10),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">UPI/VPA</label>
                    <span className="flex">
                      <input
                        type="text"
                        className="mt-1 block w-full lowercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.upi}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            upi: e.target.value.slice(0, 20),
                          })
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Email Id
                    </label>
                    <span className="flex">
                      <input
                        type="email"
                        className="mt-1 block w-full lowercase shadow-md focus:border-blue-500 border-b-2"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value.slice(0, 40),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Mobile No
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile: e.target.value.slice(0, 10),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium">
                      Loan Amount
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: e.target.value.slice(0, 6),
                          })
                        }
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Loan Type/Category
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.loanType}
                      onChange={(e) =>
                        setFormData({ ...formData, loanType: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Loan Catagory
                      </option>
                      <option value="Business Loan">Business Loan</option>
                      <option value="Personal Loan">Personal Loan</option>
                      <option value="Four Wheeler Loan">
                        Four Wheeler Loan
                      </option>
                      <option value="Two Wheeler Loan">Two Wheeler Loan</option>
                      <option value="Agri Loan">Agri Loan</option>
                      <option value="Mobile EMI">Mobile EMI</option>
                      <option value="Laptop EMI">Laptop EMI</option>
                      <option value="Others Electronics EMI">
                        Others Electronics EMI
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Repayment Period
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.repaymentPeriod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repaymentPeriod: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select No&apos;s of EMI&apos;s
                      </option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                      <option value="48">48 Months</option>
                      <option value="72">72 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Interest Type
                    </label>
                    <select
                      className="mt-1 block w-full shadow-md border-b-2 dark:bg-gray-800 focus:border-blue-500"
                      value={formData.interestType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interestType: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Type of Interest
                      </option>
                      <option value="Fixed">Fixed</option>
                      <option value="Reducing Balance">Reducing Balance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Percentage of Interest
                    </label>
                    <span className="flex">
                      <input
                        type="number"
                        className="mt-1 block w-full shadow-md focus:border-blue-500 border-b-2"
                        value={formData.interestPercentage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            interestPercentage: e.target.value.slice(0, 2),
                          })
                        }
                        required
                      />
                      %
                    </span>
                  </div> */}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium">Remarks</label>
                  <textarea
                    rows="4"
                    className="mt-1 block w-full capitalize shadow-md border-b-2 focus:border-blue-500"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    required
                  ></textarea>
                </div> */}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    onClick={handleSubmit}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
