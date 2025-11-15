// App.tsx
import React, { useState } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import SweetsList from "./pages/SweetsList";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminSweets from "./pages/AdminSweets";
import { useAuth } from "./auth/AuthContext";

const App: React.FC = () => {
  const { user, logout } = useAuth();
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-gray-100">
      {/* Top bar */}
      <header className="border-b border-white/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 12c0-4.418 3.582-8 8-8 4.418 0 8 3.582 8 8"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M8 12a4 4 0 004 4 4 4 0 004-4"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold leading-4">SweetShop</div>
                  <div className="text-xs text-gray-400 -mt-0.5">
                    manage sweets • fast
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-white/6 text-white"
                      : "text-gray-300 hover:bg-white/3"
                  }`
                }
              >
                Sweets
              </NavLink>

              {!user && (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-white/6 text-white"
                          : "text-gray-300 hover:bg-white/3"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-white/6 text-white"
                          : "text-gray-300 hover:bg-white/3"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}

              {user && (
                <>
                  <div className="px-3 py-2 rounded-md text-sm text-gray-300">
                    <span className="font-medium text-gray-100">
                      {user.email}
                    </span>
                    <span className="ml-2 inline-flex items-center rounded-full bg-white/6 px-2 py-0.5 text-xs text-gray-200">
                      {user.role}
                    </span>
                  </div>

                  {user.role === "ADMIN" && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? "bg-white/6 text-white"
                            : "text-gray-300 hover:bg-white/3"
                        }`
                      }
                    >
                      Admin
                    </NavLink>
                  )}

                  <button
                    onClick={() => logout()}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-white/5 text-gray-200 hover:bg-white/8"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setOpenMobile((s) => !s)}
                className="inline-flex items-center justify-center p-2 rounded-md bg-white/4 hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Toggle menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  {openMobile ? (
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M3 6h18M3 12h18M3 18h18"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav panel */}
        {openMobile && (
          <div className="md:hidden border-t border-white/6">
            <div className="px-4 pt-3 pb-4 space-y-2">
              <NavLink
                to="/"
                onClick={() => setOpenMobile(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-white/6 text-white"
                      : "text-gray-300 hover:bg-white/3"
                  }`
                }
              >
                Sweets
              </NavLink>

              {!user && (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setOpenMobile(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/3"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setOpenMobile(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/3"
                  >
                    Register
                  </NavLink>
                </>
              )}

              {user && (
                <>
                  <div className="px-3 py-2 text-sm text-gray-300">
                    <div className="font-medium text-gray-100">
                      {user.email}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {user.role}
                    </div>
                  </div>

                  {user.role === "ADMIN" && (
                    <NavLink
                      to="/admin"
                      onClick={() => setOpenMobile(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/3"
                    >
                      Admin
                    </NavLink>
                  )}

                  <button
                    onClick={() => {
                      setOpenMobile(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md bg-white/5 text-gray-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<SweetsList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminSweets />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <div>© {new Date().getFullYear()} SweetShop</div>
            <div className="hidden sm:block">Built with ❤️ — SweetShop</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
