// layout.jsx
import Navbar from "@/components/Navbar";
import { auth } from "../auth";

const Layout = async ({ children }) => {
  const userSession = await auth();

  return (
    <>
      {/* <Navbar userSession={userSession} /> */}
      <Navbar userSession={userSession} />
      {children}
    </>
  );
};

export default Layout;
