"use client";
import React, { useEffect, useRef, useState } from "react";

const TABS = ["Profile", "Security", "Notifications", "Settings"];

export default function AdminProfilePage() {
  // Tab state
  const [activeTab, setActiveTab] = useState("Profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    about: "Short bio or description goes here.",
    avatar: null, // data URL
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

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_profile_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile((p) => ({ ...p, ...parsed.profile }));
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.settings) setSettings(parsed.settings);
      }
    } catch (e) {
      // ignore
    }
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

  const saveSecurity = (e) => {
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
    // In real app: call API to update password. Here we just clear fields.
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showMessage("Password updated (simulated).");
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="ml-auto">
            <div className="flex items-center gap-3">
              <div className="text-sm text-green-600 font-medium">Admin</div>
              <div className="text-xs text-gray-400">Last active: just now</div>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  About
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, about: e.target.value }))
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // reset to persisted values from localStorage if available
                    try {
                      const saved = localStorage.getItem("admin_profile_v1");
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed.profile)
                          setProfile((p) => ({ ...p, ...parsed.profile }));
                        showMessage("Reverted to saved profile.");
                      } else {
                        showMessage("Nothing to revert.");
                      }
                    } catch {
                      showMessage("Revert failed.");
                    }
                  }}
                  className="px-3 py-2 border rounded text-sm"
                >
                  Revert
                </button>
              </div>
            </form>
          )}

          {activeTab === "Security" && (
            <form onSubmit={saveSecurity} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New password
                </label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity((s) => ({ ...s, newPassword: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
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

          {activeTab === "Notifications" && (
            <form onSubmit={saveNotifications} className="space-y-4 max-w-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Email notifications
                  </div>
                  <div className="text-xs text-gray-400">
                    Receive system updates and alerts via email.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications((n) => ({
                        ...n,
                        email: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-200 transition" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    SMS notifications
                  </div>
                  <div className="text-xs text-gray-400">
                    Receive critical alerts via SMS.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.sms}
                    onChange={(e) =>
                      setNotifications((n) => ({ ...n, sms: e.target.checked }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Push notifications
                  </div>
                  <div className="text-xs text-gray-400">
                    Browser and app notifications.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications((n) => ({
                        ...n,
                        push: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition" />
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save preferences
                </button>
              </div>
            </form>
          )}

          {activeTab === "Settings" && (
            <form onSubmit={saveSettings} className="space-y-4 max-w-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Two-factor authentication
                  </div>
                  <div className="text-xs text-gray-400">
                    Add an extra layer of security to your account.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.twoFactor}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        twoFactor: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Dark mode
                  </div>
                  <div className="text-xs text-gray-400">
                    Switch UI theme to dark colors.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.darkMode}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, darkMode: e.target.checked }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition" />
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save settings
                </button>
              </div>
            </form>
          )}
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
