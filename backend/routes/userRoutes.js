// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword, deleteAccount } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { changePasswordValidator } = require("../validators/authValidator");
const upload = require("../utils/upload");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);
router.put("/change-password", protect, changePasswordValidator, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
