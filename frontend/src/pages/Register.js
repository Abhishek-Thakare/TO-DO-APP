// pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../css/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const res = await registerUser(form);
      login(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ msg: err.response?.data?.message || "Registration failed." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <button className="theme-toggle" onClick={toggleTheme} style={{ background: "var(--bg-glass)", border: "1px solid var(--border)", borderRadius: "50px", padding: "6px 12px", cursor: "pointer" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="auth-logo">✅ TaskFlow</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join TaskFlow and start being productive!</p>

        {errors.length > 0 && (
          <div className="alert alert-error">
            {errors.map((e, i) => <div key={i}>• {e.msg}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password <span className="text-light">(min 6 characters)</span></label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <div className="auth-back">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
