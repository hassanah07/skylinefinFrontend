import Link from "next/link";
import React from "react";
import Pagenumber from "./Pagenumber";

const Bloglist = ({ blogs }) => {
  return (
    <div className="flex flex-wrap -m-4">
      {Object.keys(blogs).map((item) => {
        return (
          <Link
            href={`/blog/${blogs[item].slug}`}
            key={blogs[item]._id}
            className="xl:w-1/3 md:w-1/2 p-4"
          >
            <div className="border p-6 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-none text-black dark:text-slate-100 text-justify shadow-2xl shadow-popover-foreground hover:shadow-yellow-400 dark:border-white h-72">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-pink-700 text-pink-100 mb-4">
                <span className="font-semibold">
                  <small>GW</small>
                </span>
              </div>
              <h2 className="text-sm lg:text-lg text-red-500 dark:text-slate-100 font-semibold title-font mb-2">
                {blogs[item].title}
              </h2>
              <p className="leading-relaxed text-xs lg:text-base">
                {blogs[item].desc}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Bloglist;
