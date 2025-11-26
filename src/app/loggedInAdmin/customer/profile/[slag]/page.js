"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { FaCamera, FaSignature, FaTimes } from "react-icons/fa";

export default function ProfilePage() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState({
    fullName: "Anowarul Hassan",
    fatherName: "Mohammad Hassan",
    motherName: "Fatima Begum",
    spouseName: "N/A",
    dob: "1990-01-01",
    passportNo: "A1234567",
    passportExpiry: "2030-01-01",
    drivingLicence: "DL123456789",
    drivingExpiry: "2028-01-01",
    voterId: "VOTER123456",
    upiId: "anowarul@upi",
    mobile: "+91 9876543210",
    email: "anowarul@example.com",
    qualification: "B.Sc Computer Science",
    work: "Software Engineer",
    photo: "/placeholder-photo.png",
    signature: "/placeholder-sign.png",
  });

  const [cropMode, setCropMode] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropTarget, setCropTarget] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleFileChange = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropMode(true);
      setCropTarget(target);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = () => {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const ctx = canvas.getContext("2d");
      const size = cropTarget === "signature" ? 400 : 200;
      canvas.width = size;
      canvas.height = cropTarget === "signature" ? 100 : size;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const croppedImage = canvas.toDataURL("image/jpeg", 0.8);

      setUser((prev) => ({ ...prev, [cropTarget]: croppedImage }));
      setCropMode(false);
      setImageSrc(null);
    };
  };
  const getAdminProfile = async () => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/admin/getadmindetail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        // body: JSON.stringify({ email }),
      }
    );
    response = await response.json();
    if (response.login === false) {
      localStorage.removeItem("token");
      redirect("/");
    } else {
    }
  };
  useEffect(() => {
    getAdminProfile();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDE - Photo and Signature */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Photo */}
            <div className="relative w-40 h-40 mx-auto border rounded-full overflow-hidden shadow-sm">
              <Image
                src={user.photo}
                alt="Profile"
                className="object-cover w-full h-full"
                fill
              />
              <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "photo")}
                  className="hidden"
                />
              </label>
            </div>

            {/* Signature */}
            <div className="border rounded-lg p-3 flex flex-col items-center bg-gray-50">
              <Image
                src={user.signature}
                alt="Signature"
                className="w-44 h-20 object-contain border bg-white"
                fill
              />
              <label className="mt-3 bg-amber-500 text-white px-3 py-2 rounded text-sm flex items-center gap-2 cursor-pointer hover:bg-amber-600">
                <FaSignature /> Change Signature
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "signature")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* RIGHT SIDE - User Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ProfileItem label="Full Name" value={user.fullName} />
            <ProfileItem label="Father's Name" value={user.fatherName} />
            <ProfileItem label="Mother's Name" value={user.motherName} />
            <ProfileItem label="Spouse Name" value={user.spouseName} />
            <ProfileItem label="Date of Birth" value={user.dob} />
            <ProfileItem label="Passport No" value={user.passportNo} />
            <ProfileItem label="Passport Expiry" value={user.passportExpiry} />
            <ProfileItem label="Driving Licence" value={user.drivingLicence} />
            <ProfileItem label="DL Expiry" value={user.drivingExpiry} />
            <ProfileItem label="Voter ID" value={user.voterId} />
            <ProfileItem label="UPI ID" value={user.upiId} />
            <ProfileItem label="Mobile" value={user.mobile} />
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="Qualification" value={user.qualification} />
            <ProfileItem label="Work" value={user.work} />
          </div>
        </div>
      </div>

      {/* CROP MODAL */}
      {cropMode && imageSrc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow w-full max-w-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">
                Crop {cropTarget === "photo" ? "Photo" : "Signature"}
              </h3>
              <button
                onClick={() => setCropMode(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="relative w-full h-72 bg-gray-100 rounded-md overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropTarget === "photo" ? 1 / 1 : 4 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-2/3"
              />
              <button
                onClick={handleCropDone}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="p-3 border rounded bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium mt-1">{value || "-"}</p>
    </div>
  );
}
