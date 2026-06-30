// controllers/adminController.js
const User = require("../models/User");
const Todo = require("../models/Todo");

// Get admin dashboard stats
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({ role: "user", isActive: true });
    const inactiveUsers = await User.countDocuments({ role: "user", isActive: false });
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    const pendingTodos = totalTodos - completedTodos;

    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt isActive lastLogin");

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, inactiveUsers, totalTodos, completedTodos, pendingTodos },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users with their task counts
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const todoCount = await Todo.countDocuments({ user: user._id });
        const completedCount = await Todo.countDocuments({ user: user._id, completed: true });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          todoCount,
          completedCount,
        };
      })
    );

    res.json({ success: true, count: usersWithStats.length, users: usersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user and all their todos
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Cannot delete admin" });

    await Todo.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle user active/inactive
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Cannot modify admin" });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getAllUsers, deleteUser, toggleUserStatus };