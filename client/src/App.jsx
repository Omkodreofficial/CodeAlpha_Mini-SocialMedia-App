// client/src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import RightCol from "./components/RightCol.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Feed from "./pages/Feed.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Footer from "./components/Footer.jsx";

// IMPORTANT: useAuth is exported as a named hook from the AuthProvider context
import { useAuth } from "./context/AuthProvider.jsx";

/**
 * App layout:
 * - Auth routes (/login, /register) use a focused centered shell (no sidebars/topbar)
 * - Full app shell shows Sidebars + Topbar + ThemeToggle + Footer
 */
export default function App() {
  const { pathname } = useLocation();
  const hideShell = pathname === "/login" || pathname === "/register";

  // Use the named hook exported by AuthProvider
  const auth = useAuth() || {};
  const user = auth.user || null;
  const loading = auth.loading || false;

  // Focused auth layout
  if (hideShell) {
    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div style={{ width: 480, maxWidth: "100%" }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  // Full app shell
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Topbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1">
            {/* pass user so Sidebar can show proper links/user block */}
            <Sidebar user={user} />
          </div>

          <main className="col-span-1 lg:col-span-2">
            <Routes>
              <Route
                path="/"
                element={
                  // while profile load is happening, avoid redirect jitter
                  loading ? (
                    <div className="p-6">Checking authentication…</div>
                  ) : user ? (
                    <Feed />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  loading ? (
                    <div className="p-6">Checking authentication…</div>
                  ) : user ? (
                    <Profile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/notifications"
                element={
                  loading ? (
                    <div className="p-6">Checking authentication…</div>
                  ) : user ? (
                    <Notifications />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route
                path="*"
                element={
                  loading ? (
                    <div className="p-6">Checking authentication…</div>
                  ) : user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </main>

          <aside className="col-span-1 hidden md:block">
            {/* pass user for suggestions, follow buttons etc */}
            <RightCol user={user} />
          </aside>
        </div>

        <Footer />
      </div>
    </div>
  );
}
