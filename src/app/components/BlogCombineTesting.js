import React from "react";
import Pagenumber from "./Pagenumber";
import BloglistTesting from "./BlogListTesting";

const BlogCombineTesting = ({ blogs, pageNumbers, myPage }) => {
  return (
    <>
      <section className="text-black dark:text-white body-font pb-14 bg-white dark:bg-black min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <BloglistTesting blogs={blogs} />
          <div className="py-14">
            <div className="flex justify-center items-center align-bottom">
              <Pagenumber pageNumbers={pageNumbers} myPage={myPage} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogCombineTesting;
