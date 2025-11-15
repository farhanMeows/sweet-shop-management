import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Toast from "../components/Toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("admin@local.test");
  const [password, setPassword] = useState("adminpass");
  const { login } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validate() {
    if (!email.includes("@")) return "Enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setBusy(true);
    try {
      await login(email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto p-4 bg-slate-800 rounded"
    >
      <h2 className="text-xl mb-4">Login</h2>
      {err && <div className="text-red-400 mb-2">{err}</div>}
      <div className="mb-2">
        <input
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
      </div>
      <div className="mb-2">
        <input
          className="w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </div>
      <button type="submit" disabled={busy}>
        {busy ? "Signing in..." : "Login"}
      </button>
      <Toast message={err} />
    </form>
  );
};

export default LoginPage;
