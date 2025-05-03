"use client";

import Link from "next/link";

import { useState } from "react";

import NavbarAuth from "./NavbarAuth";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";

const Navbar = ({ userSession }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <center className="w-full bottom-2 mt-4  hover:shadow-2xl transition-all duration-300 hover:translate-y-2">
      <header className="bg-[#4169E1] text-white p-2 shadow-lg flex justify-between flex-coll  items-center relative top-[5%] w-[98%]    rounded-4xl">
        <div className="flex items-center justify-between w-full font-poppins">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-extrabold font-space-grotesk px-3"
          >
            Tarun Nayaka R
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6 absolute right-[30px] top-[11px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <nav
          className={`mt-4 md:mt-0 md:flex top-2  mr-[20px] ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row gap-3 md:gap-6 items-center">
            {["Home", "About", "Contact", "Blog", "Projects", "Events"].map(
              (item, index) => (
                <li key={item}>
                  <Link
                    href={`/${
                      item.toLowerCase() === "home" ? "" : item.toLowerCase()
                    }`}
                    className="flex gap-1.5 px-3 py-2 items-center  w-[110px] rounded-full hover:bg-white hover:text-purple-500 transition-all duration-300"
                  >
                    <Image
                      width="30"
                      height="6"
                      src="https://img.icons8.com/ios-filled/50/home.png"
                      alt="home"
                    />
                    <p>{item}</p>
                  </Link>
                </li>
              )
            )}
            <SessionProvider>
              <NavbarAuth />
            </SessionProvider>
          </ul>
        </nav>
      </header>
    </center>
  );
};

export default Navbar;
