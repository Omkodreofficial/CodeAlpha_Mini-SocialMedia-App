// client/src/hooks/useTheme.js
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider.jsx";

export default function useTheme() {
  return useContext(ThemeContext);
}
