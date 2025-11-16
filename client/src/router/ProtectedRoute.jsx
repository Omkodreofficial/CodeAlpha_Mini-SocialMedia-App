import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // you can return a spinner UI instead
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
