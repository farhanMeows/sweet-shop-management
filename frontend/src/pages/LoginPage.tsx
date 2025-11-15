import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Toast from "../components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@local.test");
  const [password, setPassword] = useState("adminpass");
  const { login } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function validate() {
    if (!email || !email.includes("@")) return "Enter a valid email";
    if (!password || password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const v = validate();
    if (v) {
      setErr(v);
      setToastMsg(v);
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
      nav("/");
    } catch (e: any) {
      const message = e?.response?.data?.error ?? e?.message ?? "Login failed";
      setErr(message);
      setToastMsg(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 p-6 sm:p-8 shadow-2xl ring-1 ring-white/6"
        aria-labelledby="login-title"
      >
        <h2
          id="login-title"
          className="text-2xl font-semibold text-gray-100 mb-1"
        >
          Welcome back
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Sign in to manage the sweet shop
        </p>

        {err && (
          <div className="mb-4 rounded-md bg-red-900/20 border border-red-800/30 p-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-white/3"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-sm text-indigo-300 hover:underline"
            >
              Forgot?
            </button>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={busy}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition ${
                busy ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {busy ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button type="button" className="text-indigo-300 hover:underline">
              Sign up
            </button>
          </div>
        </div>
      </form>

      <Toast message={toastMsg} />
    </div>
  );
}
