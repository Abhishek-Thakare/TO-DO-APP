// pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center",
      background: "linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(253,121,168,0.08) 100%)",
    }}>
      <div style={{ fontSize: "8rem", marginBottom: 16, lineHeight: 1 }}>🔍</div>
      <h1 style={{ fontSize: "6rem", fontWeight: 900, background: "var(--gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: 8 }}>
        404
      </h1>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: "var(--text-light)", fontSize: "1.05rem", maxWidth: 400, marginBottom: 36, lineHeight: 1.7 }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" className="btn btn-primary">🏠 Back to Home</Link>
        <Link to="/dashboard" className="btn btn-outline">📋 Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default NotFound;
