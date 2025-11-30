"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import TopBar from "@/app/components/TopBar";
import SideBar from "@/app/components/SideBar";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function DocViewer({ params }) {
  const { slag } = use(params);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState([]);

  // Sample data - replace with actual data from your backend
  const documents = [
    { id: 1, src: "/images/doc1.jpg", alt: "Document 1" },
    { id: 2, src: "/images/doc2.jpg", alt: "Document 2" },
    { id: 3, src: "/images/doc3.jpg", alt: "Document 3" },
    { id: 4, src: "/images/doc4.jpg", alt: "Document 4" },
  ];
  useEffect(() => {
    const access = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/image/doclist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "admin-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ loanAccountNumber: slag }),
          }
        );
        const resp = await res.json();
        console.log(resp);
        setImageData(resp.list);
        if (resp.status === true) {
          toast.success(`${resp.msg}`);
        } else {
          toast.error(`${resp.msg}`);
        }
      } catch (error) {
        toast.success(`reload page`);
      }
    };
    access();
  }, [slag]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* <ToastContainer /> */}
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <p
              className="w-12 rounded bg-white py-1 px-2 text-xl cursor-pointer"
              onClick={() => router.back()}
            >
              🔙
            </p>
            <div className="flex gap-3">
              <h1 className="text-3xl font-bold mb-8">Document Viewer</h1>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {imageData.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedImage(doc)}
                  className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST}/uploads/${doc.filename}`}
                      alt={doc.filename}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="p-3 text-gray-700 font-medium text-center">
                    {doc._id}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal for Full View */}
            {selectedImage && (
              <div
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
              >
                <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition z-10"
                  >
                    Close
                  </button>
                  <div className="relative w-full h-96">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST}/uploads/${selectedImage.filename}`}
                      alt={selectedImage.filename}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="p-4 text-center text-gray-800 font-medium">
                    {selectedImage.alt}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
