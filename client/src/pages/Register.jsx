// client/src/pages/Register.jsx
import { useState } from "react";
import { registerUser } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      if (!data || !data.token) {
        setErr("Registration failed");
        return;
      }
      // after register redirect to login or auto-login
      navigate("/login");
    } catch (e) {
      setErr(e?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-[480px]">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Create your account
        </h1>

        {err && (
          <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{err}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Full name</label>
            <input
              className="input w-full"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Username</label>
            <input
              className="input w-full"
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Password</label>
            <input
              type="password"
              className="input w-full"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Already have an account?
          </span>{" "}
          <a className="text-brand font-semibold" href="/login">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
