// client/src/components/Button.jsx
import React from "react";
import clsx from "clsx";

/**
 * <Button variant="primary" size="md" onClick=...>Label</Button>
 * variants: primary | secondary | ghost | icon
 * sizes: sm | md
 */
export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full focus:outline-none transition";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
  };
  const variants = {
    primary: "bg-[#00A79D] text-white shadow-sm hover:brightness-105",
    secondary:
      "bg-white text-[#212529] border border-gray-200 hover:bg-gray-50 dark:bg-[#1E1E1E] dark:text-white dark:border-gray-700",
    ghost: "bg-transparent text-[#00A79D] hover:bg-[#00A79D]/10",
    icon: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
