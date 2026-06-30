// services/api.js - Axios instance configured for our backend
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, // IMPORTANT: sends cookies (JWT) with every request
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");

// User Profile
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) => API.put("/user/profile", data);
export const changePassword = (data) => API.put("/user/change-password", data);
export const deleteAccount = () => API.delete("/user/delete-account");

// Todos
export const getTodos = (params) => API.get("/todos", { params });
export const createTodo = (data) => API.post("/todos", data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const toggleComplete = (id) => API.patch(`/todos/${id}/complete`);

// Admin
export const getAdminDashboard = () => API.get("/admin/dashboard");
export const getAdminUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/user/${id}`);

export default API;
