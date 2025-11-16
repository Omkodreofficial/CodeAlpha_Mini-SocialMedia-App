// client/src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider.jsx";

export default function useAuth() {
  return useContext(AuthContext);
}
