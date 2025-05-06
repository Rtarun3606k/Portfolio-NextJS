import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "../auth";
import PageTransition from "@/components/PageTransition";

const Layout = async ({ children }) => {
  const userSession = await auth();

  const fetchData = async () => {
    const res = await fetch("https://api.example.com/data");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  };

  return (
    <>
      <Navbar userSession={userSession} />
      <PageTransition />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
