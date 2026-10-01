import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-300">
        <p role="status">Restoring your session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;