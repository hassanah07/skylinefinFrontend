"use client";
import { useState, useRef, use, useEffect } from "react";
import Image from "next/image";
import TopBar from "@/app/components/TopBar";
import SideBar from "@/app/components/SideBar";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmployeeDetailPage({ params }) {
  const router = useRouter();
  const { slag } = use(params);
  const [employee, setEmployee] = useState([]);
  const host = process.env.NEXT_PUBLIC_HOST.replace(/^\//, "");

  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [preview, setPreview] = useState();
  const [signPreview, setSignPreview] = useState();
  const fileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const [employeeSign, setEmployeeSign] = useState("");
  const [employeePhoto, setEmployeePhoto] = useState("");
  const [address, setAddress] = useState([]);

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;
          const maxHeight = 800;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob.size > 50000) {
                canvas.toBlob(resolve, "image/jpeg", 0.6);
              } else {
                resolve(blob);
              }
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, {
      type: "image/jpeg",
    });

    setPhoto(compressedFile);

    // Create preview URL
    const previewURL = URL.createObjectURL(compressedFile);
    setPreview(previewURL);
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, {
      type: "image/jpeg",
    });

    setSignature(compressedFile);

    // Create preview URL
    const previewURL = URL.createObjectURL(compressedFile);
    setSignPreview(previewURL);
  };

  const savePhoto = async () => {
    if (!photo) return alert("No photo selected");

    const formData = new FormData();
    formData.append("photo", photo); // must match upload.single("photo")
    formData.append("id", slag); // must match upload.single("photo")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/image/empPhoto`,
      {
        method: "POST",
        headers: {
          "admin-token": localStorage.getItem("token"),
        },
        body: formData,
      }
    );

    const data = await res.json();
    toast.info(`${data.msg}`);
    setTimeout(() => {
      location.reload();
    }, 3000);
  };

  const saveSignature = async () => {
    if (!signature) return alert("No signature selected");

    const formData = new FormData();
    formData.append("sign", signature); // must match upload.single("sign")
    formData.append("id", slag); // must match upload.single("sign")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/image/empSign`,
      {
        method: "POST",
        headers: {
          "admin-token": localStorage.getItem("token"),
        },
        body: formData,
      }
    );

    const data = await res.json();
    toast.info(`${data.msg}`);
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
        console.log(res.employee);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-800">
      <ToastContainer />
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl relative mx-auto bg-white dark:bg-black rounded-lg shadow-lg p-6 md:p-8">
            <span
              className="bg-red-500 px-2 rounded absolute cursor-pointer"
              onClick={() => router.back()}
            >
              🔙
            </span>
            <h1 className="text-3xl font-bold mb-8 ml-16">Employee Details</h1>
            <Link
              href={`/loggedInAdmin/employee/getIdCard/${slag}`}
              className="right-0 top-0 absolute bg-indigo-500 p-2 rounded"
            >
              View Id Card
            </Link>
            {/* Photo Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Main Photo */}
              <div className="md:col-span-1">
                <div className="bg-gray-200 dark:bg-slate-800 rounded-lg p-4 text-center">
                  <Image
                    src={`${host}/${employeePhoto}`}
                    alt="image"
                    width={200}
                    height={200}
                    className="mb-3 mx-auto max-h-24 object-contain"
                  />
                  {preview && (
                    <Image
                      src={
                        preview ||
                        `${process.env.NEXT_PUBLIC_HOST}/${employee?.image}`
                      }
                      alt="Profile Photo"
                      width={200}
                      height={200}
                      className="w-40 h-40 rounded-lg object-cover mx-auto mb-4"
                    />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-2 transition"
                  >
                    Upload Photo
                  </button>
                  <button
                    onClick={savePhoto}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                  >
                    Save Photo
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm">Name</p>
                    <p className="text-lg font-semibold">
                      {employee.f_name} {employee.l_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">Email ID</p>
                    <p className="text-lg font-semibold">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm">Mobile No</p>
                    <p className="text-lg font-semibold">{employee.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm">Role</p>
                    <p className="text-lg font-semibold">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm">Status</p>
                    <p
                      className={`text-lg font-semibold ${
                        employee.status === true
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {employee.status === true && <>Active</>}
                      {employee.status === false && <>Inactive</>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* More Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm">PAN No</p>
                <p className="text-lg font-semibold">{employee.pan}</p>
              </div>
              <div>
                <p className="text-sm">Aadhaar No</p>
                <p className="text-lg font-semibold">{employee.aadhar}</p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-8">
              <p className="text-sm">Address</p>
              <p className="text-sm">{employee.landmark}</p>
              <p className="text-sm">{address[0]?.Name}</p>
              <p className="text-sm">{address[0]?.BranchType}</p>
              <p className="text-sm">{address[0]?.Division}</p>
              <p className="text-sm">{address[0]?.Region}</p>
              <p className="text-sm">{address[0]?.Circle}</p>
              <p className="text-sm">{address[0]?.Pincode}</p>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-semibold mb-3">
                  Upload Signature
                </label>
                <div className="bg-white dark:bg-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Image
                    src={`${host}/${employeeSign}`}
                    alt={`${host}/${employeeSign}`}
                    width={150}
                    height={100}
                    className="mb-3 mx-auto max-h-24 object-contain"
                  />

                  {signPreview && (
                    <Image
                      src={signPreview || employee.signature}
                      alt="Signature"
                      width={150}
                      height={100}
                      className="mb-3 mx-auto max-h-24 object-contain"
                    />
                  )}
                  <input
                    type="file"
                    ref={signatureInputRef}
                    onChange={handleSignatureUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => signatureInputRef.current?.click()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-2 transition"
                  >
                    Select Signature
                  </button>
                  <button
                    onClick={saveSignature}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                  >
                    Save Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
