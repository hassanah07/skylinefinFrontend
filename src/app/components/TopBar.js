import Image from "next/image";
import React from "react";

const TopBar = () => {
  return (
    <>
      <header className="flex items-center justify-between bg-white dark:bg-slate-700 shadow px-4 py-3 text-black dark:text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex dark:bg-blue-400 items-center justify-center text-sm font-medium">
            <Image src="/Logo.png" width={40} height={40} alt="logo" />
          </div>
          <h1 className="text-xl font-semibold">Skylinee Admin</h1>
        </div>
      </header>
    </>
  );
};

export default TopBar;
