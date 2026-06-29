import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import RootLayout from "../layouts/RootLayout";

export const ProtectedRoute = () => {
  const [authenticated] = useContext(UserContext);

  // If the user is not authenticated at all, redirect to login
  if (!authenticated || !authenticated.user || !authenticated.user._id) {
    return <Navigate to="/become-seller/sellerlogin" />;
  }

  const storeStatus = authenticated.storeStatus; // assuming storeStatus is part of the user object

  switch (storeStatus) {
    case "Process":
      return <Navigate to="/become-seller/basic-info" />;
    case "Submitted":
      return <Navigate to="/become-seller/verificationdone" />;
    case "Varified":
      return (
        <RootLayout>
          <Outlet />
        </RootLayout>
      );
    case "Failed":
      return <Navigate to="/become-seller/verification" />;
    default:
      // If storeStatus is undefined or unrecognized, but they are logged in,
      // fallback to basic-info so they can complete registration
      return <Navigate to="/become-seller/basic-info" />;
  }
};
