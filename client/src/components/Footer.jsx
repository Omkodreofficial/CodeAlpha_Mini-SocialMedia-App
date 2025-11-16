// client/src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-8 text-center text-sm text-gray-500">
      <div className="flex items-center justify-center gap-4">
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
      </div>
      <div className="mt-2">© {new Date().getFullYear()} NEXUS</div>
    </footer>
  );
}
