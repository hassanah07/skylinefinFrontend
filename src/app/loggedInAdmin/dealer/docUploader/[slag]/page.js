"use client";
import { use, useState } from "react";
import TopBar from "@/app/components/TopBar";
import SideBar from "@/app/components/SideBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function DocUploader({ params }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { slag } = use(params);

  const compressImage = async (file) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = 794;
          canvas.height = 1123;

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              setCompressed(blob);
              setSuccess(`✓ Compressed to ${(blob.size / 1024).toFixed(2)} KB`);
              setLoading(false);
            },
            "image/jpeg",
            0.75
          );
        };
      };
    } catch (err) {
      setError("Compression failed. Please try again.");
      setLoading(false);
    }
  };

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Only allow images
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file only (JPG, PNG, etc.)");
      setFile(null);
      setCompressed(null);
      setSuccess("");
      return;
    }

    setFile(selectedFile);
    setCompressed(null);
    setSuccess("");
    compressImage(selectedFile);
  };

  // -----------------------------
  // UPLOAD TO BACKEND (Multer)
  // -----------------------------
  const uploadToServer = async () => {
    if (!compressed) return alert("No compressed image found");

    const formData = new FormData();
    const fileName = `document_${Date.now()}.jpg`;

    // append compressed blob
    formData.append("document", compressed, fileName);
    formData.append("id", slag);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/image/dealerDocuments`,
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
      if (data.status === true) {
        setFile(null);
        setCompressed(null);
        toast.success(`${data.msg}`);
      } else {
        toast.success(`${"Failed to Upload"}`);
      }
    } catch (err) {
      toast.success(`${"Reload the page or try later"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 relative">
              <button
                onClick={() => router.back()}
                className="absolute left-12 top-4 bg-green-400 px-3 py-1 rounded cursor-pointer"
              >
                🔙
              </button>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-300 mb-2">
                Document Uploader
              </h1>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 sm:p-8">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer bg-indigo-50 dark:bg-gray-800">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg
                    className="w-12 h-12 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-lg font-semibold text-gray-700 dark:text-white">
                    Click to upload image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only Images (PNG, JPG)
                  </p>
                </label>
              </div>

              {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-white">
                    <span className="font-semibold">Original:</span> {file.name}{" "}
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              )}

              {/* Status */}
              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 dark:bg-gray-800 rounded-lg text-green-700 dark:text-green-400">
                  {success}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Compressing...
                  </p>
                </div>
              )}

              {/* Upload Button */}
              {compressed && (
                <div className="mt-6">
                  <button
                    onClick={uploadToServer}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105"
                  >
                    Upload to Server
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
