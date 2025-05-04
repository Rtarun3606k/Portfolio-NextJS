// layout.jsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "../auth";
import PageTransition from "@/components/PageTransition";

const Layout = async ({ children }) => {
  const userSession = await auth();

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
