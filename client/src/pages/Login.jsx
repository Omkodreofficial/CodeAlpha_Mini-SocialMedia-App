// client/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api.js";
import { useAuth } from "../context/AuthProvider.jsx";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError("");
  }

  function validate() {
    if (!form.username.trim()) return "Username is required.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError("");
    try {
      // loginUser returns { token, refresh, user }
      const res = await loginUser({
        username: form.username,
        password: form.password,
      });

      // Save to auth context (this will also save tokens to localStorage via provider)
      auth.login(res);

      // navigate to home feed
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      // Try to extract a friendly message
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed. Please try again.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 shadow-md rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-[#00A79D]">NEXUS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back — sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={onChange}
                autoComplete="username"
                className="mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A79D] focus:border-transparent"
                placeholder="your username"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
                className="mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A79D] focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/register" className="text-[#00A79D] hover:underline">
                  Create account
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-3 px-5 py-2 rounded-full font-semibold text-white bg-[#00A79D] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#00A79D] disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          By continuing you agree to our{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms" className="underline">
            Terms
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
