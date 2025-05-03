// components/NavbarAuth.js
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function NavbarAuth() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <>
        <Link href="/profile">
          <Image
            src={session.user.image}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>
        <button
          onClick={() => signOut()}
          className="flex gap-1.5 px-3 py-2 items-center  w-[110px] rounded-full hover:bg-white hover:text-purple-500 transition-all duration-300"
        >
          <Image
            width="30"
            height="6"
            src="https://img.icons8.com/ios-filled/50/home.png"
            alt="home"
          />
          <p>LogOut</p>
        </button>
      </>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="flex gap-1.5 px-3 py-2 items-center  w-[180px] rounded-full hover:bg-white hover:text-purple-500 transition-all duration-300"
    >
      <Image
        width="30"
        height="6"
        src="https://img.icons8.com/ios-filled/50/home.png"
        alt="home"
      />
      <p>Sign In</p>
    </button>
  );
}
