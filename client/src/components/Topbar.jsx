// client/src/components/Topbar.jsx
import useAuth from "../hooks/useAuth.js";
import { Moon, Sun, Bell } from "phosphor-react";
import useTheme from "../hooks/useTheme.js";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import logoDark from "../assets/logo-dark.svg";

export default function Topbar() {
  const auth = useAuth() || {};
  const user = auth.user || null;
  const { theme, toggle } = useTheme();

  const logoSrc = theme === "dark" ? logoDark : logo;

  return (
    <div className="bg-white dark:bg-[#121212] border-b border-bordergray dark:border-[#2a2a2a] p-3 flex items-center justify-between sticky top-0 z-20">
      <Link to="/" className="flex items-center gap-3">
        <img src={logoSrc} alt="NEXUS" width={36} height={36} />
        <div className="text-xl font-bold text-brand">NEXUS</div>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="p-2 rounded-full hover:bg-offwhite dark:hover:bg-[#1e1e1e]"
        >
          <Bell size={18} />
        </Link>

        <button
          onClick={toggle}
          className="p-2 rounded-full hover:bg-offwhite dark:hover:bg-[#1e1e1e]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <Link to="/profile">
            <img
              src={
                user.avatar ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
              }
              className="w-10 h-10 rounded-full object-cover"
              alt="avatar"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
