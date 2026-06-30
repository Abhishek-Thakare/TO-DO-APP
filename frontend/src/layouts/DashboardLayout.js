// layouts/DashboardLayout.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../css/dashboard.css";

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate("/");
    } catch {
      logout();
      navigate("/");
    }
  };

  const navLinks = [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/todos", icon: "📋", label: "My Tasks" },
    { to: "/todos/create", icon: "➕", label: "New Task" },
    { to: "/profile", icon: "👤", label: "Profile" },
    ...(user?.role === "admin" ? [{ to: "/admin", icon: "🛡️", label: "Admin Panel" }] : []),
  ];

  return (
    <div className="dashboard-layout">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">✅ TaskFlow</div>

        {/* User info */}
        <div style={{ padding: "0 24px 20px", borderBottom: "1px solid var(--border)", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.1rem", overflow: "hidden", flexShrink: 0 }}>
              {user?.profilePicture
                ? <img src={`${process.env.REACT_APP_API_URL?.replace("/api", "")}${user.profilePicture}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={handleLogout} style={{ color: "var(--danger)", width: "100%" }}>
            <span className="link-icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="topbar-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: "none" }} id="mobile-menu-btn">☰</button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn" onClick={toggleTheme}>{theme === "dark" ? "☀️" : "🌙"}</button>
            <Link to="/profile" className="topbar-btn" style={{ textDecoration: "none" }}>👤 {user?.name?.split(" ")[0]}</Link>
          </div>
        </div>

        {/* Page content */}
        <div className="page-content">{children}</div>
      </div>

      {/* Mobile menu button injection */}
      <style>{`@media(max-width:768px){#mobile-menu-btn{display:flex !important;}}`}</style>
    </div>
  );
};

export default DashboardLayout;
