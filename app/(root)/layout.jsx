"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useEffect, useState } from "react";
import { ParallelFetch } from "@/_utils/DataFetching";
import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);

  useEffect(() => {
    const EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

    const getWithExpiry = (key) => {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    };

    const setWithExpiry = (key, value, ttl) => {
      const now = Date.now();
      const item = {
        value: value,
        expiry: now + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    };

    const tasks = [
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/statistics` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/services` },
    ];

    const cachedData = getWithExpiry("data");

    if (cachedData) {
      setData(cachedData);
      console.log(cachedData, "from cache");
    } else {
      const fetchData = async () => {
        const result = await ParallelFetch(tasks);
        setData(result);
        setWithExpiry("data", result, EXPIRY_MS);
        console.log(result, "fetched result");
      };
      fetchData();
    }
  }, []);

  return (
    <>
      <Navbar userSession={session} />
      <PageTransition />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
