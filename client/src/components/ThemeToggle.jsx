// client/src/components/ThemeToggle.jsx
import React from "react";
import useTheme from "../hooks/useTheme.js";
import { Sun, Moon } from "phosphor-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 60 }}>
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="p-2 rounded-full bg-white dark:bg-[#1b1b1b] border border-bordergray dark:border-[#2a2a2a] shadow-sm hover:opacity-95"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
