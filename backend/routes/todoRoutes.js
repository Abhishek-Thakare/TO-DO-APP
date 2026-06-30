// routes/todoRoutes.js
const express = require("express");
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo, toggleComplete } = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");
const { todoValidator } = require("../validators/todoValidator");

router.get("/", protect, getTodos);
router.post("/", protect, todoValidator, createTodo);
router.put("/:id", protect, todoValidator, updateTodo);
router.delete("/:id", protect, deleteTodo);
router.patch("/:id/complete", protect, toggleComplete);

module.exports = router;
