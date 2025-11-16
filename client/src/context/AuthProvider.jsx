// client/src/context/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile } from "../api/api.js";
import { getItem, saveItem, removeItem } from "../utils/storage.js";

export const AuthContext = createContext(null);
export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while validating token

  useEffect(() => {
    let mounted = true;
    async function init() {
      console.debug("[Auth] startup check");
      setLoading(true);
      const token = getItem("token");
      if (!token) {
        console.debug("[Auth] No token on startup");
        if (mounted) setLoading(false);
        return;
      }

      console.debug("[Auth] Token found on startup, fetching profile");
      try {
        const me = await getMyProfile(); // will throw on 401
        console.debug("[Auth] Profile fetched:", me);
        if (!mounted) return;
        setUser(me);
      } catch (err) {
        console.warn(
          "[Auth] profile fetch failed:",
          err?.response?.status || err.message
        );
        if (err?.response?.status === 401) {
          removeItem("token");
          removeItem("refresh");
        }
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  function login(response) {
    // response expected: { token, refresh, user }
    console.debug("[Auth] login() saving token & user", response?.user ?? null);
    if (response.token) saveItem("token", response.token);
    if (response.refresh) saveItem("refresh", response.refresh);
    if (response.user) setUser(response.user);
  }

  function logout() {
    removeItem("token");
    removeItem("refresh");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
