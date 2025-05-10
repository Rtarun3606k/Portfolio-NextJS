// components/NavbarAuth.js
"use client";

import Image from "next/image";
import Link from "next/link";

export default function NavbarAuth() {
  // Always render a public view with dashboard access (no auth checks)
  return (
    <>
      <Link href="/dashboard">
        <button className="nav-link flex gap-1.5 px-3 py-2 items-center w-[110px] rounded-full hover:bg-white hover:text-purple-500 transition-all duration-300">
          <Image
            width="30"
            height="6"
            src="https://img.icons8.com/ios-filled/50/home.png"
            alt="dashboard"
            className="nav-icon filter-white transition-all duration-300"
          />
          <p>Dashboard</p>
        </button>
      </Link>
    </>
  );
}
