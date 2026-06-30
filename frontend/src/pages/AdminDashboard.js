// pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { getAdminDashboard, getAdminUsers, deleteUser } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard"); // "dashboard" | "users"
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, usersRes] = await Promise.all([
          getAdminDashboard(),
          getAdminUsers(),
        ]);
        setStats(dashRes.data.stats);
        setRecentUsers(dashRes.data.recentUsers);
        setAllUsers(usersRes.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their tasks?`)) return;
    setDeleteId(id);
    try {
      await deleteUser(id);
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Panel">
        <div className="loading-screen" style={{ minHeight: "60vh" }}>
          <div className="spinner"></div><p>Loading admin data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="🛡️ Admin Panel">
      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <button
          className={`btn ${tab === "dashboard" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`btn ${tab === "users" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("users")}
        >
          👥 Manage Users
        </button>
      </div>

      {/* ---- Dashboard Tab ---- */}
      {tab === "dashboard" && (
        <>
          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: 32 }}>
            {[
              { icon: "👥", label: "Total Users", value: stats?.totalUsers },
              { icon: "📋", label: "Total Tasks", value: stats?.totalTodos },
              { icon: "✅", label: "Completed Tasks", value: stats?.completedTodos },
              { icon: "⏳", label: "Pending Tasks", value: stats?.pendingTodos },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <span className="stat-card-icon">{s.icon}</span>
                <div className="stat-card-value">{s.value ?? 0}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent registrations */}
          <div className="section-title">🆕 Recent Registrations</div>
          <div className="glass-card" style={{ overflow: "hidden" }}>
            {recentUsers.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <span className="empty-icon">👥</span>
                <h3>No users yet</h3>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Name", "Email", "Joined"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-light)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: "14px 20px", color: "var(--text-light)", fontSize: "0.9rem" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px", color: "var(--text-light)", fontSize: "0.9rem" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ---- Users Tab ---- */}
      {tab === "users" && (
        <>
          <div className="section-title">👥 All Users ({allUsers.length})</div>
          <div className="glass-card" style={{ overflow: "auto" }}>
            {allUsers.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <span className="empty-icon">👥</span>
                <h3>No users found</h3>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["User", "Email", "Tasks", "Completed", "Joined", "Action"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-light)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--text-light)", fontSize: "0.88rem" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700 }}>{u.todoCount}</td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span className="badge badge-completed">{u.completedCount}</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--text-light)", fontSize: "0.88rem" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={deleteId === u._id}
                        >
                          {deleteId === u._id ? "..." : "🗑️ Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
