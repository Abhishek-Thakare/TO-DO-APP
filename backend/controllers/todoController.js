// controllers/todoController.js
const { validationResult } = require("express-validator");
const Todo = require("../models/Todo");

// @desc    Get all todos for logged-in user (with search, filter, sort)
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { search, status, priority, category, sort } = req.query;

    // Build the filter object — always filter by the logged-in user
    let filter = { user: req.user._id };

    // Search by title, category, or tags
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Filter by completion status
    if (status === "completed") filter.completed = true;
    if (status === "pending") filter.completed = false;

    // Filter by priority
    if (priority) filter.priority = priority;

    // Filter by category
    if (category) filter.category = { $regex: category, $options: "i" };

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "dueDate") sortOption = { dueDate: 1 };
    if (sort === "priority") sortOption = { priority: -1 };
    if (sort === "alphabetical") sortOption = { title: 1 };

    const todos = await Todo.find(filter).sort(sortOption);

    // Get counts for statistics
    const total = await Todo.countDocuments({ user: req.user._id });
    const completed = await Todo.countDocuments({ user: req.user._id, completed: true });
    const pending = total - completed;

    res.json({
      success: true,
      count: todos.length,
      stats: { total, completed, pending },
      todos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, dueDate, priority, category, tags, notes } = req.body;

    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || "medium",
      category: category || "General",
      tags: tags || [],
      notes: notes || "",
    });

    res.status(201).json({ success: true, message: "Task created successfully", todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const { title, description, dueDate, priority, category, tags, notes } = req.body;

    todo.title = title || todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.dueDate = dueDate !== undefined ? dueDate : todo.dueDate;
    todo.priority = priority || todo.priority;
    todo.category = category || todo.category;
    todo.tags = tags !== undefined ? tags : todo.tags;
    todo.notes = notes !== undefined ? notes : todo.notes;

    await todo.save();

    res.json({ success: true, message: "Task updated successfully", todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle todo complete/pending
// @route   PATCH /api/todos/:id/complete
// @access  Private
const toggleComplete = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    todo.completed = !todo.completed; // Toggle the value
    await todo.save();

    res.json({
      success: true,
      message: `Task marked as ${todo.completed ? "completed" : "pending"}`,
      todo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, toggleComplete };
