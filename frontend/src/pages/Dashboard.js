// pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodos } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [recentTodos, setRecentTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTodos({ sort: "newest" });
        setStats(res.data.stats);
        setRecentTodos(res.data.todos.slice(0, 5)); // Show only 5 recent
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getPriorityColor = (p) => ({ high: "var(--danger)", medium: "var(--warning)", low: "var(--success)" }[p] || "var(--primary)");

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>{getGreeting()}, {user?.name?.split(" ")[0]}! 👋</h2>
          <p>Here's what's happening with your tasks today.</p>
        </div>
        <span className="welcome-emoji">🚀</span>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-icon">📋</span>
          <div className="stat-card-value">{loading ? "..." : stats.total}</div>
          <div className="stat-card-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">✅</span>
          <div className="stat-card-value">{loading ? "..." : stats.completed}</div>
          <div className="stat-card-label">Completed</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">⏳</span>
          <div className="stat-card-value">{loading ? "..." : stats.pending}</div>
          <div className="stat-card-label">Pending</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">📈</span>
          <div className="stat-card-value">
            {loading ? "..." : stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) + "%" : "0%"}
          </div>
          <div className="stat-card-label">Completion Rate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-title">⚡ Quick Actions</div>
      <div className="quick-actions">
        <Link to="/todos/create" className="quick-action-btn">➕ New Task</Link>
        <Link to="/todos" className="quick-action-btn">📋 All Tasks</Link>
        <Link to="/todos?status=pending" className="quick-action-btn">⏳ Pending</Link>
        <Link to="/todos?status=completed" className="quick-action-btn">✅ Completed</Link>
        <Link to="/profile" className="quick-action-btn">👤 Profile</Link>
      </div>

      {/* Recent Tasks */}
      <div className="section-title">🕐 Recent Tasks</div>
      {loading ? (
        <div className="empty-state"><div className="spinner"></div></div>
      ) : recentTodos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No tasks yet!</h3>
          <p>Create your first task to get started.</p>
          <Link to="/todos/create" className="btn btn-primary mt-2">➕ Create Task</Link>
        </div>
      ) : (
        <div className="todo-list">
          {recentTodos.map((todo) => (
            <div key={todo._id} className={`todo-card ${todo.completed ? "completed" : ""}`}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: getPriorityColor(todo.priority), flexShrink: 0, marginTop: 8 }} />
              <div className="todo-body">
                <div className={`todo-title ${todo.completed ? "done" : ""}`}>{todo.title}</div>
                <div className="todo-meta">
                  <span className={`badge badge-${todo.completed ? "completed" : "pending"}`}>{todo.completed ? "Done" : "Pending"}</span>
                  <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
                  <span>📁 {todo.category}</span>
                  {todo.dueDate && <span>📅 {new Date(todo.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="todo-actions">
                <Link to={`/todos/edit/${todo._id}`} className="todo-action-btn">✏️ Edit</Link>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link to="/todos" className="btn btn-outline btn-sm">View All Tasks →</Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
