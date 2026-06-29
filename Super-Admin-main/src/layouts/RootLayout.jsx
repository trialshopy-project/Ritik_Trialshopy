import { useLocation } from "react-router-dom";

import { useContext } from "react";
import { UserContext } from "../components/context/UserContext";
import Sidebar from "./sidebar/index";

function RootLayout({ children }) {
  const location = useLocation();
  const routesWithoutSidebar = ["/admin/login", "*"];

  const shouldHideSidebar = routesWithoutSidebar.includes(location.pathname);
  const [authenticated] = useContext(UserContext);
  const sellerIsPresent = authenticated.user._id;

  return (
    <div className="flex h-screen">
      {sellerIsPresent && !shouldHideSidebar && <Sidebar />}
      {<main className=" flex-1 ">{children}</main>}
    </div>
  );
}

export default RootLayout;
