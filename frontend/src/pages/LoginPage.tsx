import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("admin@local.test");
  const [password, setPassword] = useState("adminpass");
  const { login } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
