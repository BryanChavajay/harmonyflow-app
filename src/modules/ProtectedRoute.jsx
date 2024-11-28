import { Navigate } from "react-router-dom";
import { useStoreAuth } from "../stores/GlobalAuth.jsx";

export const ProtectedRoute = ({ children, permission }) => {
  const isAuthenticated = useStoreAuth((state) => state.isAuthenticated);
  const permissions = useStoreAuth((state) => state.permissions);

  const havePermission = permissions.some(
    (module) => module.modulo === permission
  );

  if (!(havePermission && isAuthenticated)) {
    return <Navigate to="/agenda" />;
  }

  return children;
};
