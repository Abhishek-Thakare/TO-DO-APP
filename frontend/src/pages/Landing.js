// pages/Landing.js - Simple Clean Landing Page
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../css/landing.css";

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-page">

      {/* ---- NAVBAR ---- */}
      <div className="nav-actions">
  <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
    {theme === "dark" ? "☀️" : "🌙"}
  </button>
  <Link to="/login" className="btn btn-outline btn-sm">🛡️ Admin Login</Link>
  <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
  <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
</div>
      

      {/* ---- HERO ---- */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 Free Task Management Tool</span>
          <h1>Organize Your Life with <span>TodoMaster</span></h1>
          <p>
            The smartest way to manage your daily tasks. Create, organize,
            prioritize, and complete tasks with a beautiful modern interface
            designed for productivity.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started Free →</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>

        {/* Floating task mockup */}
        <div className="hero-image">
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <span className="mockup-title">My Tasks Today</span>
            </div>
            {[
              { text: "Complete project report", done: true, tag: "work", tagLabel: "Work" },
              { text: "Buy groceries", done: false, tag: "personal", tagLabel: "Personal" },
              { text: "Study for exam", done: false, tag: "study", tagLabel: "Study" },
              { text: "Team meeting at 3pm", done: true, tag: "work", tagLabel: "Work" },
            ].map((task, i) => (
              <div className="mockup-task" key={i}>
                <div className={`mockup-check ${task.done ? "done" : ""}`}>
                  {task.done ? "✓" : ""}
                </div>
                <span className={`mockup-task-text ${task.done ? "done" : ""}`}>
                  {task.text}
                </span>
                <span className={`mockup-tag tag-${task.tag}`}>{task.tagLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer style={{
        textAlign: "center",
        padding: "24px",
        color: "var(--text-light)",
        fontSize: "0.9rem",
        borderTop: "1px solid var(--border)",
      }}>
        © 2024 TodoMaster. Built with ❤️ using MERN Stack.
      </footer>

    </div>
  );
};

export default Landing;