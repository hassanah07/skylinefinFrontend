"use client";
import SideBar from "@/app/components/SideBar";
import TopBar from "@/app/components/TopBar";
import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABS = ["Profile", "Security"];

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState([]);
  // Tab state
  const [activeTab, setActiveTab] = useState("Profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    about: "",
    avatar: null,
    mobile: "",
    aadhaar: "",
    pan: "",
    father: "",
    mother: "",
    spouse: "",
    address: "",
    landmark: "",
    state: "",
    pin: "",
  });

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification & settings toggles
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [settings, setSettings] = useState({
    twoFactor: false,
    darkMode: false,
  });

  // UI state
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const toastOptions = {
    theme: "dark",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Load persisted state from localStorage
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
    console.log(response);
    if (response.login === true) {
      setAdmin(response.authUser);
      setProfile({
        name: response.authUser.name || "",
        email: response.authUser.email || "",
        about: response.authUser.about || "",
        avatar: null,
        mobile: response.authUser.mobile || "",
        aadhaar: response.authUser.aadhaar || "",
        pan: response.authUser.pan || "",
        father: response.authUser.father || "",
        mother: response.authUser.mother || "",
        spouse: response.authUser.spouse || "",
        address: response.authUser.address || "",
        landmark: response.authUser.landmark || "",
        state: response.authUser.state || "",
        pin: response.authUser.pin || "",
      });
    } else {
      localStorage.removeItem("token");
      redirect("/");
    }
  };
  useEffect(() => {
    // try {
    //   const saved = localStorage.getItem("admin_profile_v1");
    //   if (saved) {
    //     const parsed = JSON.parse(saved);
    //     if (parsed.profile) setProfile((p) => ({ ...p, ...parsed.profile }));
    //     if (parsed.notifications) setNotifications(parsed.notifications);
    //     if (parsed.settings) setSettings(parsed.settings);
    //   }
    // } catch (e) {
    //   // ignore
    // }
    getAdminProfile();
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    const payload = {
      profile,
      notifications,
      settings,
    };
    localStorage.setItem("admin_profile_v1", JSON.stringify(payload));
  }, [profile, notifications, settings]);

  // Helpers
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const onPickAvatar = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showMessage("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar: reader.result }));
      showMessage("Profile photo updated (preview). Click Save to persist.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeAvatar = () => {
    setProfile((p) => ({ ...p, avatar: null }));
    showMessage("Avatar removed. Click Save to persist.");
  };

  // Handlers for forms
  const saveProfile = (e) => {
    e?.preventDefault();
    // basic validation
    if (!profile.name.trim()) {
      showMessage("Name is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(profile.email)) {
      showMessage("Enter a valid email.");
      return;
    }
    showMessage("Profile saved.");
    // persisted via effect
  };

  const saveSecurity = async (e) => {
    e?.preventDefault();
    if (!security.currentPassword || !security.newPassword) {
      showMessage("Fill current and new password.");
      return;
    }
    if (security.newPassword.length < 6) {
      showMessage("New password should be at least 6 characters.");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      showMessage("New password and confirmation do not match.");
      return;
    }
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/admin/changePassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(security),
      }
    );
    response = await response.json();
    console.log(response);
    if (response.login === true) {
      toast.info(response.msg, toastOptions);
    } else {
      toast.info(response.msg, toastOptions);
      showMessage("Password updated");
      localStorage.removeItem("token");
      setTimeout(() => {
        redirect("/");
      }, 3000);
    }
  };

  const saveNotifications = (e) => {
    e?.preventDefault();
    showMessage("Notification preferences saved.");
  };

  const saveSettings = (e) => {
    e?.preventDefault();
    showMessage("Settings saved.");
  };

  // Avatar UI helpers
  const avatarInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <ToastContainer />
      <TopBar />
      <div className="flex relative">
        <SideBar />
        <div className="flex-1 p-6 mt-6 sm:rounded-lg w-2/3 mx-auto pt-16 relative">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={onPickAvatar}
                    className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 hover:ring-2 hover:ring-indigo-200 transition"
                    aria-label="Change profile photo"
                    title="Change profile photo"
                  >
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-medium text-gray-600">
                        {avatarInitials(profile.name)}
                      </span>
                    )}
                  </button>

                  <div className="absolute -bottom-2 -right-2 flex gap-2">
                    <button
                      onClick={onPickAvatar}
                      className="bg-white p-1 rounded-full text-gray-600 border border-gray-200 hover:bg-gray-50"
                      title="Upload"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V3m0 0L8 7m4-4 4 4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={removeAvatar}
                      className="bg-white p-1 rounded-full text-red-500 border border-gray-200 hover:bg-gray-50"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-semibold uppercase">
                    {profile.name}
                  </h2>
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>

              <div className="ml-auto">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-green-600 font-medium">
                    Admin
                  </div>
                  <div className="text-xs text-gray-400">
                    Last active: just now
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50 px-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 -mb-px text-sm font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {message && (
                <div className="mb-4 text-sm text-white bg-green-500 px-3 py-2 rounded">
                  {message}
                </div>
              )}

              {activeTab === "Profile" && (
                <form onSubmit={saveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            name: e.target.value
                              .replace(/[^A-Z ]/g, "")
                              .slice(0 - 15),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Email address
                      </label>
                      <input
                        type="text"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            email: e.target.value
                              .trim()
                              .replace(/[^a-z0-9@_#]/g, "")
                              .slice(0 - 40),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Mobile No
                      </label>
                      <input
                        type="number"
                        value={profile.mobile}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            mobile: e.target.value.slice(0 - 10),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        AADHAAR No
                      </label>
                      <input
                        type="number"
                        value={profile.aadhaar}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            aadhaar: e.target.value.slice(0 - 12),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">PAN</label>
                      <input
                        type="text"
                        value={profile.pan}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            pan: e.target.value
                              .slice(0 - 10)
                              .toUpperCase()
                              .replace(/[^A-Z]/g, ""),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Father&apos;s Name
                      </label>
                      <input
                        value={profile.father}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            father: e.target.value
                              .slice(0 - 30)
                              .toUpperCase()
                              .replace(/[^A-Z]/g, ""),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Mother&apos;s name
                      </label>
                      <input
                        value={profile.mother}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            mother: e.target.value
                              .slice(0 - 30)
                              .toUpperCase()
                              .replace(/[^A-Z]/g, ""),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Spouse Name
                      </label>
                      <input
                        value={profile.spouse}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            spouse: e.target.value
                              .slice(0 - 30)
                              .toUpperCase()
                              .replace(/[^A-Z]/g, ""),
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Address
                      </label>
                      <textarea
                        value={profile.address}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, address: e.target.value }))
                        }
                        rows={2}
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        landmark
                      </label>
                      <input
                        value={profile.landmark}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            landmark: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">State</label>
                      <input
                        value={profile.state}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, state: e.target.value }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        PIN NO
                      </label>
                      <input
                        value={profile.pin}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, pin: e.target.value }))
                        }
                        className="mt-1 block w-full border-b-2 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium uppercase">
                      About
                    </label>
                    <textarea
                      value={profile.about}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, about: e.target.value }))
                      }
                      rows={4}
                      className="mt-1 block w-full border-b-2 shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Save profile
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "Security" && (
                <form onSubmit={saveSecurity} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium">
                      Current password
                    </label>
                    <input
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity((s) => ({
                          ...s,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border-b-2 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium ">
                      New password
                    </label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity((s) => ({
                          ...s,
                          newPassword: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border-b-2 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) =>
                        setSecurity((s) => ({
                          ...s,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-b-2 shadow-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded"
                      onClick={saveSecurity}
                    >
                      Change password
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSecurity({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
                      className="px-3 py-2 border rounded text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
