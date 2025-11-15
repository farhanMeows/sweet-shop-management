import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SweetsList from "./pages/SweetsList";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminSweets from "./pages/AdminSweets";
import { useAuth } from "./auth/AuthContext";

const App: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Sweets</Link> |{" "}
        {user ? (
          <>
            <span style={{ marginLeft: 8 }}>
              {user.email} ({user.role})
            </span>
            <button onClick={() => logout()} style={{ marginLeft: 8 }}>
              Logout
            </button>
            {user.role === "ADMIN" && (
              <Link to="/admin" style={{ marginLeft: 8 }}>
                Admin
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<SweetsList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminSweets />} />
      </Routes>
    </div>
  );
};

export default App;
