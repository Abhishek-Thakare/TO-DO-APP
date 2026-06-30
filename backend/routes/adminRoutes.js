// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getDashboard, getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, adminOnly, getDashboard);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/user/:id", protect, adminOnly, deleteUser);

module.exports = router;
