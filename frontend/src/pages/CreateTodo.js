// pages/CreateTodo.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const CreateTodo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      await createTodo({
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || null,
        priority: form.priority,
        // Send defaults for removed fields so backend doesn't break
        category: "General",
        tags: [],
        notes: "",
      });
      setSuccess("Task created! Redirecting...");
      setTimeout(() => navigate("/todos"), 1200);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ msg: err.response?.data?.message || "Failed to create task." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create New Task">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="glass-card" style={{ padding: "36px" }}>
          <h2 style={{ marginBottom: 6, fontSize: "1.4rem", fontWeight: 800 }}>
            ➕ New Task
          </h2>
          <p className="text-light" style={{ marginBottom: 28, fontSize: "0.9rem" }}>
            Fill in the details below to create a new task.
          </p>

          {errors.length > 0 && (
            <div className="alert alert-error">
              {errors.map((e, i) => <div key={i}>• {e.msg}</div>)}
            </div>
          )}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Complete project report"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Add more details about this task..."
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Due Date + Priority */}
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

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? "Creating..." : "✅ Create Task"}
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

export default CreateTodo;