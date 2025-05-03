"use client";

import Link from "next/link";

import { useState } from "react";

import NavbarAuth from "./NavbarAuth";
import { SessionProvider } from "next-auth/react";

const Navbar = ({ userSession }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-5 shadow-lg flex items-center justify-between w-full ">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="text-2xl md:text-3xl font-extrabold">
          Y Combinator
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
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
        className={`mt-4 md:mt-0 md:flex ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        <ul className="flex flex-col md:flex-row gap-3 md:gap-6">
          {["Home", "About", "Contact", "Blog", "Jobs", "Apply", "Events"].map(
            (item) => (
              <li key={item}>
                <Link
                  href={`/${
                    item.toLowerCase() === "home" ? "" : item.toLowerCase()
                  }`}
                  className="px-3 py-2 rounded-full hover:bg-white hover:text-purple-500 transition-all duration-300"
                >
                  {item}
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
  );
};

export default Navbar;
