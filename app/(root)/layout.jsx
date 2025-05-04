// layout.jsx
import Navbar from "@/components/Navbar";
import { auth } from "../auth";
import PageTransition from "@/components/PageTransition";

const Layout = async ({ children }) => {
  const userSession = await auth();

  return (
    <>
      <Navbar userSession={userSession} />
      <PageTransition />
      {children}
    </>
  );
};

export default Layout;
