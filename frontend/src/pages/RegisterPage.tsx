import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("NewUser");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Register failed");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
      </div>
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
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
