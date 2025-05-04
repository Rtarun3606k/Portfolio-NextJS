"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import NavbarAuth from "./NavbarAuth";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = ({ userSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Add fade-in effect on component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`z-[100] sticky w-full top-3 transition-all duration-300 hover:translate-y-2 ${
        mounted ? "animate-fadeIn" : "opacity-0"
      }`}
    >
      <header className="animate-fade-slide  bg-gradient-to-r from-purple-600/60 to-blue-600/60 border border-white/20 mt-4 text-white p-2 shadow-lg flex justify-between flex-coll items-center relative top-[5%] w-[98%] mx-auto rounded-4xl backdrop-blur-[20px]">
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
              className="w-6 h-6 absolute right-[30px] top-[11px] transition-transform duration-500"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0)" }}
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

        <div className="md:block">
          <nav
            className={`mt-4 md:mt-0 md:flex top-2 mr-[20px] ${
              isOpen ? "mobile-menu-open" : "mobile-menu-closed"
            } md:block mobile-menu-nav`}
          >
            <ul className="flex flex-col md:flex-row gap-3 md:gap-6 items-center">
              {[
                {
                  name: "Home",
                  path: "/",
                  icon: "https://img.icons8.com/ios-filled/50/home.png",
                },
                {
                  name: "About",
                  path: "/About",
                  icon: "https://img.icons8.com/ios-filled/50/user.png",
                },
                {
                  name: "Contact",
                  path: "/Contact",
                  icon: "https://img.icons8.com/ios-filled/50/phone.png",
                },
                {
                  name: "Blog",
                  path: "/Blog",
                  icon: "https://img.icons8.com/ios-filled/50/blog.png",
                },
                {
                  name: "Projects",
                  path: "/Projects",
                  icon: "https://img.icons8.com/ios-filled/50/briefcase.png",
                },
                {
                  name: "Events",
                  path: "/Events",
                  icon: "https://img.icons8.com/ios-filled/50/calendar.png",
                },
              ].map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`nav-link flex gap-1.5 px-3 py-2 items-center w-[110px] rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-white/30 backdrop-blur-sm text-white font-semibold"
                          : "hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      <Image
                        width="30"
                        height="6"
                        src={item.icon}
                        className={`nav-icon transition-all duration-300 ${
                          isActive ? "filter-white" : "filter-white opacity-80"
                        }`}
                        alt={item.name.toLowerCase()}
                      />
                      <p>{item.name}</p>
                    </Link>
                  </li>
                );
              })}
              <SessionProvider>
                <NavbarAuth />
              </SessionProvider>
            </ul>
          </nav>
        </div>
      </header>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s forwards;
        }

        /* Icon filters */
        .filter-white {
          filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)
            brightness(100%) contrast(100%);
        }

        /* Apply transition styles only on mobile */
        @media (max-width: 768px) {
          .mobile-menu-nav {
            transition: max-height 0.6s cubic-bezier(0.33, 1, 0.68, 1),
              opacity 0.5s ease;
            overflow: hidden;
          }

          .mobile-menu-open {
            display: block;
            opacity: 1;
            max-height: 600px;
            backdrop-filter: blur(8px);
          }

          .mobile-menu-closed {
            display: block;
            opacity: 0;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
