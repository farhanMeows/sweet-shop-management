import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Toast from "../components/Toast";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("NewUser");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validate() {
    if (!name) return "Name required";
    if (!email.includes("@")) return "Valid email required";
    if (password.length < 6) return "Password min 6 characters";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setBusy(true);
    try {
      await register(name, email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Register failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto p-4 bg-slate-800 rounded"
    >
      <h2 className="text-xl mb-4">Register</h2>
      {err && <div className="text-red-400 mb-2">{err}</div>}
      <div className="mb-2">
        <input
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
      </div>
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
        {busy ? "Signing up..." : "Register"}
      </button>
      <Toast message={err} />
    </form>
  );
};

export default RegisterPage;
