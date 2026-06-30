// pages/EditTodo.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTodos, updateTodo } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const EditTodo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await getTodos({});
        const todo = res.data.todos.find((t) => t._id === id);
        if (!todo) { navigate("/todos"); return; }
        setForm({
          title: todo.title || "",
          description: todo.description || "",
          dueDate: todo.dueDate ? todo.dueDate.split("T")[0] : "",
          priority: todo.priority || "medium",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchTodo();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      await updateTodo(id, {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || null,
        priority: form.priority,
        // Keep defaults for removed fields
        category: "General",
        tags: [],
        notes: "",
      });
      setSuccess("Task updated! Redirecting...");
      setTimeout(() => navigate("/todos"), 1200);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ msg: err.response?.data?.message || "Failed to update." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout title="Edit Task">
        <div className="loading-screen" style={{ minHeight: "60vh" }}>
          <div className="spinner"></div>
          <p>Loading task...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Task">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="glass-card" style={{ padding: "36px" }}>
          <h2 style={{ marginBottom: 6, fontSize: "1.4rem", fontWeight: 800 }}>
            ✏️ Edit Task
          </h2>
          <p className="text-light" style={{ marginBottom: 28, fontSize: "0.9rem" }}>
            Update the details and save your changes.
          </p>

          {errors.length > 0 && (
            <div className="alert alert-error">
              {errors.map((e, i) => <div key={i}>• {e.msg}</div>)}
            </div>
          )}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/todos")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditTodo;