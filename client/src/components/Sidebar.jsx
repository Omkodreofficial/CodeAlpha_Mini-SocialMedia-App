// client/src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button.jsx";
import { House, Compass, Bell, UserCircle } from "phosphor-react";

/**
 * Sidebar component (desktop). Expects optional `user` prop.
 * Place in your App layout: <Sidebar user={auth.user} />
 */
export default function Sidebar({ user }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl ${
      isActive ? "bg-[#E6FAF8] text-[#00A79D] font-semibold" : "text-[#212529] hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

  return (
    <aside className="w-72 p-4 sticky top-4 hidden lg:block">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#00A79D]">NEXUS</h2>
        </div>

        <nav className="space-y-1 flex-1">
          <NavLink to="/" className={linkClass} end>
            <House size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/explore" className={linkClass}>
            <Compass size={20} />
            <span>Explore</span>
          </NavLink>

          <NavLink to="/notifications" className={linkClass}>
            <Bell size={20} />
            <span>Notifications</span>
          </NavLink>

          <NavLink to={user ? `/u/${user.username}` : "/login"} className={linkClass}>
            <UserCircle size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="mt-6">
          <Button variant="primary" className="w-full">
            Post
          </Button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <img src={user?.avatar || "/images/default-avatar.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-sm">{user?.name ?? "Guest"}</div>
            <div className="text-xs text-gray-500">@{user?.username ?? "guest"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
