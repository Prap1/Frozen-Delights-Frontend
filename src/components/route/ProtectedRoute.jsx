import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ isAdmin = false, isVendor = false }) => {
  const { isAuthenticated, user, authChecked } = useAuth();

  // ⏳ WAIT for auth check to finish
  if (!authChecked) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // 🔐 Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 👑 Admin-only
  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🏪 Vendor-only
  if (isVendor && user.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
