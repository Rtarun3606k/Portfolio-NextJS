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
          className="text-white hover:bg-white hover:text-purple-500 px-3 py-2 md:px-4 md:py-2 rounded-full transition-all duration-300"
        >
          Log Out
        </button>
      </>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="text-white hover:bg-white hover:text-purple-500 px-3 py-2 md:px-4 md:py-2 rounded-full transition-all duration-300"
    >
      Sign In with GitHub
    </button>
  );
}
