import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../provider/user_provider";

// Proteksi route: harus login
export const RequireAuth = ({ redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};

// Proteksi route: harus role tertentu
export const RequireRole = ({ roles = [], redirectTo = "/403" }) => {
  const { hasRole, loading } = useUser();

  if (loading) return <LoadingScreen />;
  if (!hasRole(...roles)) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};

// Proteksi route: jika sudah login redirect ke home
export const GuestOnly = ({ redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-gray-500">Loading...</p>
  </div>
);