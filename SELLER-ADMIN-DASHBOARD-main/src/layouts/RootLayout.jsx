import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { UserContext } from "../components/context/UserContext";
import { useContext } from "react";

function RootLayout({ children }) {
  const location = useLocation();
  const routesWithoutSidebar = [
    "/account/become-seller-growth",
    "/become-seller/sellerlogin",
    "/",
    "/become-seller/basic-info",
    "/become-seller/business-info",
    "/become-seller/verification",
    "/become-seller/verificationdone",
    "/become-seller/verification-status",
    "*",
  ];

  

  const shouldHideSidebar = routesWithoutSidebar.includes(location.pathname);
  const [authenticated] = useContext(UserContext);
  const sellerIsPresent = authenticated.user._id;

  return (
    <div className="flex h-screen xl:justify-between">
    {sellerIsPresent && !shouldHideSidebar && <Sidebar />}
    {<main className=" flex-1 xl:h-screen xl:overflow-y-auto xl:w-full ">{children}</main>}
  </div>
  
  );
}

export default RootLayout;


