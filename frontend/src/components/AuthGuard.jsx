import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children, requireAdmin = false }) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  // ⏳ Wait until auth state is resolved
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👮 Admin-only
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
