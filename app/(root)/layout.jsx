import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

import { auth } from "../auth";

const Layout = async ({ children }) => {
  const session = await auth();

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
