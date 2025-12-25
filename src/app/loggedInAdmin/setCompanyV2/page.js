"use client";
import { useState, useRef, use, useEffect } from "react";
import Image from "next/image";
import TopBar from "@/app/components/TopBar";
import SideBar from "@/app/components/SideBar";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AdminDetailPage({ params }) {
  const router = useRouter();
  const { slag } = use(params);
  const [admin, setAdmin] = useState({
    photo: "/default-avatar.png",
    sign: "/default-avatar.png",
    name: "John Doe",
    email: "john@example.com",
    mobile: "+91 9876543210",
    pan: "ABCDE1234F",
    aadhaar: "1234 5678 9012",
    address: "123 Main St, City",
    role: "Super Admin",
    status: false,
    isSuperAdmin: true,
  });

  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [preview, setPreview] = useState();
  const [signPreview, setSignPreview] = useState();
  const fileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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
  const saveSignature = async () => {
    if (!signature) return alert("No signature selected");

    const formData = new FormData();
    formData.append("sign", signature); // must match upload.single("sign")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/image/companySign`,
      {
        method: "POST",
        headers: {
          "admin-token": localStorage.getItem("token"),
        },
        body: formData,
      }
    );

    const data = await res.json();
    console.log(data);
    toast.info(`${data.msg}`);
  };

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
    };
    company();
  }, []);

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
            <h1 className="text-3xl font-bold mb-8 ml-16">
              Company Signature Upload
            </h1>

            {/* More Info */}

            {/* Signature Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-semibold mb-3">
                  Upload Signature
                </label>
                <div className="bg-white dark:bg-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_HOST}${admin.sign}` ||
                      "https://i.fonts2u.com/ha/hand-signature-demo_4.png"
                    }
                    alt="Signature"
                    width={150}
                    height={100}
                    className="mb-3 mx-auto max-h-24 object-contain"
                  />
                  {signPreview && (
                    <Image
                      src={signPreview || admin.sign}
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
