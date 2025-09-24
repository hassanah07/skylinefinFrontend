"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaWindowClose } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { nav } from "../api/Nav";
import { AdminNav } from "../api/AdminNav";
import { redirect, useRouter } from "next/navigation";
// import logo from "../../../public/icon.png";
import { ModeToggle } from "@/components/ModeToggle";
import { FaSquareRss } from "react-icons/fa6";

const Navigation = () => {
  const router = useRouter();
  const [user, setUser] = useState({ value: null });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ value: token });
    }
  }, [router.query]);

  const logout = () => {
    redirect("../../");
    //   localStorage.removeItem("token");
    //   setUser({ value: null });
    //   router.push("/login");
  };
  const [toggleNav, setToggleNav] = useState(true);
  const ref = useRef();
  return (
    <div>
      {/* {user.value && ( */}
      <div className="flex bg-white dark:bg-black h-16 mx-4">
        <nav className="py-4">
          <Link
            href="/admin/dashboard"
            className="flex"
            as={"/admin/dashboard"}
          >
            {/* <span>
                <Image
                  src={logo}
                  alt="guide_wale_logo"
                  width={40}
                  height={40}
                  // style={{ width: auto, height: auto }}
                />
              </span> */}
            <span className="font-extrabold text-pink-600 text-2xl mt-1 shadow-2xl">
              Skyline Admin
            </span>
          </Link>
        </nav>

        <nav
          ref={ref}
          className={
            toggleNav === true
              ? "absolute top-0 right-0  z-40 md:bg-transparent md:block hidden"
              : "absolute top-0 right-0  z-40 md:bg-transparent md:block"
          }
        >
          <ul className="py-14 md:py-4 md:flex px-2 md:bg-transparent dark:md:bg-transparent dark:bg-black bg-purple-100 md:w-auto w-48 md:rounded-none rounded-bl-lg">
            {AdminNav.map((currElen, index) => {
              return (
                <Link
                  href={currElen.link}
                  className="px-2"
                  key={currElen.id}
                  onClick={() => {
                    setToggleNav(true);
                  }}
                >
                  <li className="font-bold mx-3 md:ml-auto capitalize text-slate-600 dark:text-white py-2 md:py-auto">
                    {currElen.name}
                  </li>
                  <hr className="md:hidden" />
                </Link>
              );
            })}
            <li className="font-semibold mx-3 md:ml-auto capitalize text-slate-600 dark:text-white py-2 md:py-auto text-2xl">
              <FiLogOut onClick={logout} />
            </li>
          </ul>
          <FaWindowClose
            className="absolute top-3 right-3 text-3xl text-white cursor-pointer md:hidden"
            onClick={() => {
              setToggleNav(true);
            }}
          />
        </nav>
        <div
          className="hamburgerManu absolute top-2 right-2 z-20 cursor-pointer md:hidden"
          onClick={() => {
            setToggleNav(false);
          }}
        >
          <div className="cursor-pointer" title="Log Out">
            <FaBars className="text-5xl text-pink-800" title="Log Out" />
          </div>
        </div>
      </div>
      {/* )} */}
      <div className="fixed bottom-2 right-2 z-20 cursor-pointer dark:border-white border-2 border-black rounded-lg">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navigation;
