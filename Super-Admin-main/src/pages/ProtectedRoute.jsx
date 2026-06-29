import { Link, Navigate, Outlet } from "react-router-dom";

import { useContext, useEffect } from "react";
import RootLayout from "../layouts/RootLayout";
import { UserContext } from "../components/context/UserContext";

export const ProtectedRoute = () => {
  const [authenticated] = useContext(UserContext);
  const sellerIsPresent = authenticated?.user?._id;

  console.log(authenticated?.user?._id, "aaya");

//   return (
//     <>
//       {authenticated.user._id && authenticated.user.role === "admin" && (
//         <RootLayout>
//           <Outlet />
//         </RootLayout>
//       )}
//     </>
//   );
// };
  return (
    <>
      {authenticated?.user?._id && authenticated?.user?.role === "admin" ? (
        <RootLayout>
          <Outlet />
        </RootLayout>
      ) : (
        <Navigate to="/admin/login" replace />
      )}
    </>
  );
};
