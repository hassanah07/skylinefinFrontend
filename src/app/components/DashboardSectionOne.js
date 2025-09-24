import React from "react";
import { DashboardSectionOneAPI } from "@/app/api/DashboardSectionOneApi";
import Link from "next/link";

const DashboardSectionOne = () => {
  return (
    <div className="container px-5 py-24 mx-auto">
      <div className="flex flex-wrap w-full mb-20 items-center text-center">
        {DashboardSectionOneAPI.map((currElem, index) => {
          return (
            <div
              className="xl:w-1/5 lg:w-1/4 md:w-1/2 w-1/1 p-4 my-5 rounded-xl"
              key={index}
            >
              <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-purple-100 dark:bg-black relative shadow-2xl shadow-foreground dark:shadow-purple-600 hover:shadow-indigo-700 hover:dark:shadow-yellow-400 cursor-pointer">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-indigo-400 mb-4">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-medium title-font mb-2 capitalize">
                  {currElem.name}
                </h2>
                {/* Number */}
                <div className="text-7xl border-l-4 absolute right-2 top-2">
                  {currElem.number}
                </div>
              <Link href={currElem.link}>
                <span>View</span>
              </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSectionOne;
