// validators/todoValidator.js
const { body } = require("express-validator");

const todoValidator = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
];

module.exports = { todoValidator };
