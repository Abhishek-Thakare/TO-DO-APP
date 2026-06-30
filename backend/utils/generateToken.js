// utils/generateToken.js
const jwt = require("jsonwebtoken");

// Generate JWT and store it in an HTTP-only cookie
const generateToken = (res, userId) => {
  // Create a JWT token containing the user's ID
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  // Store token in HTTP-only cookie
  // HTTP-only = JavaScript cannot access it (protects from XSS attacks)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

module.exports = generateToken;
