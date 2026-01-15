import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // ⏳ Wait until auth finishes
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // 🔥 role-based redirect (IMPORTANT FIX)
    if (user.role === "HOSPITAL" || user.role === "ADMIN") {
      return <Navigate to="/hospital/dashboard" replace />;
    }

    // USER / PATIENT
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Allowed
  return <>{children}</>;
};

export default ProtectedRoute;
