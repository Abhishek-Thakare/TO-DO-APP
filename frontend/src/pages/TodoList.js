// pages/TodoList.js
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getTodos, deleteTodo, toggleComplete } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // track which todo is being deleted

  // Filter & sort state
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
    sort: "newest",
  });

  // Fetch todos whenever filters change
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      // Remove empty filter values before sending to API
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const res = await getTodos(params);
      setTodos(res.data.todos);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce search — wait 400ms after user stops typing
    const timer = setTimeout(() => {
      fetchTodos();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchTodos]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleComplete(id);
      // Update the todo in the list without refetching
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? res.data.todo : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleteId(id);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setStats((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", priority: "", category: "", sort: "newest" });
  };

  const getPriorityColor = (p) =>
    ({ high: "var(--danger)", medium: "#b8860b", low: "var(--success)" }[p] || "var(--primary)");

  return (
    <DashboardLayout title="My Tasks">
      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-icon">📋</span>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">✅</span>
          <div className="stat-card-value">{stats.completed}</div>
          <div className="stat-card-label">Completed</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">⏳</span>
          <div className="stat-card-value">{stats.pending}</div>
          <div className="stat-card-label">Pending</div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="filters-bar">
        <input
          className="search-input"
          type="text"
          name="search"
          placeholder="🔍 Search by title, category, tags..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select className="filter-select" name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="completed">✅ Completed</option>
        </select>
        <select className="filter-select" name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <select className="filter-select" name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="newest">🕐 Newest</option>
          <option value="oldest">🕑 Oldest</option>
          <option value="dueDate">📅 Due Date</option>
          <option value="priority">⚡ Priority</option>
          <option value="alphabetical">🔤 A-Z</option>
        </select>
        {(filters.search || filters.status || filters.priority || filters.category) && (
          <button className="btn btn-outline btn-sm" onClick={clearFilters}>✕ Clear</button>
        )}
        <Link to="/todos/create" className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }}>
          ➕ New Task
        </Link>
      </div>

      {/* Todo list */}
      {loading ? (
        <div className="empty-state"><div className="spinner"></div><p>Loading tasks...</p></div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No tasks found</h3>
          <p>Try changing your filters or create a new task.</p>
          <Link to="/todos/create" className="btn btn-primary mt-2">➕ Create Task</Link>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo._id} className={`todo-card ${todo.completed ? "completed" : ""}`}>
              {/* Checkbox to toggle complete */}
              <button
                className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
                onClick={() => handleToggle(todo._id)}
                title={todo.completed ? "Mark pending" : "Mark complete"}
              >
                {todo.completed ? "✓" : ""}
              </button>

              <div className="todo-body">
                <div className={`todo-title ${todo.completed ? "done" : ""}`}>
                  {todo.title}
                </div>

                {todo.description && (
                  <div className="todo-desc">{todo.description}</div>
                )}

                <div className="todo-meta">
                  <span className={`badge badge-${todo.priority}`} style={{ color: getPriorityColor(todo.priority) }}>
                    {todo.priority}
                  </span>
                  <span className={`badge badge-${todo.completed ? "completed" : "pending"}`}>
                    {todo.completed ? "✅ Done" : "⏳ Pending"}
                  </span>
                  <span>📁 {todo.category}</span>
                  {todo.dueDate && (
                    <span style={{ color: new Date(todo.dueDate) < new Date() && !todo.completed ? "var(--danger)" : "var(--text-light)" }}>
                      📅 {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {todo.tags && todo.tags.length > 0 && (
                    <span>🏷️ {todo.tags.slice(0, 2).join(", ")}</span>
                  )}
                </div>
              </div>

              <div className="todo-actions">
                <Link to={`/todos/edit/${todo._id}`} className="todo-action-btn">✏️ Edit</Link>
                <button
                  className="todo-action-btn delete"
                  onClick={() => handleDelete(todo._id)}
                  disabled={deleteId === todo._id}
                >
                  {deleteId === todo._id ? "..." : "🗑️"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TodoList;
