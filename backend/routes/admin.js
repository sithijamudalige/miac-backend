// backend/routes/admin.js
const express = require("express");
const router = express.Router();

// Hardcoded admin credentials (safe, on backend)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// Admin login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.status(200).json({
      success: true, // <- add this
      message: "Admin login successful ✅"
    });
  } else {
    return res.status(401).json({
      success: false, // <- add this
      message: "Invalid credentials ❌"
    });
  }
});

module.exports = router;
