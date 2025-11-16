// client/src/router/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Feed from "../pages/Feed.jsx";
import Profile from "../pages/Profile.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import UserProfile from "../pages/UserProfile.jsx";

import Sidebar from "../components/Sidebar.jsx";

export default function AppRouter() {
  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 p-4">
        {/* Sidebar (left) */}
        <div className="col-span-3 hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Page Area */}
        <div className="col-span-12 lg:col-span-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Pages */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/:username"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Right Column (Suggestions etc.) */}
        <div className="col-span-3 hidden lg:block">
          {/* Loaded inside Feed — section 4 */}
        </div>
      </div>
    </div>
  );
}
