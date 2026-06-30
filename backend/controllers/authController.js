// controllers/authController.js
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const memoryUsers = [];

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const createMemoryUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: String(name || "").trim(),
    email: normalizeEmail(email),
    password: hashedPassword,
    role: "user",
    profilePicture: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryUsers.push(user);
  return user;
};

const findMemoryUser = (email) => memoryUsers.find((user) => user.email === normalizeEmail(email));

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name || "").trim();

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }

      const user = await User.create({ name: normalizedName, email: normalizedEmail, password });
      generateToken(res, user._id);

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    }

    const existingUser = findMemoryUser(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await createMemoryUser({ name: normalizedName, email: normalizedEmail, password });
    generateToken(res, user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail }).select("+password");
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      generateToken(res, user._id);

      return res.json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    }

    const user = findMemoryUser(normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { register, login, logout };
