const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./db"); // SQLite connection

// Import models
const User = require("./models/User");

// Import routes
const userRoutes = require("./routes/userRoutes");
const managePasswordRoutes = require("./routes/managePassword");
const adminRoutes = require("./routes/admin");

const app = express();

// ---------------- Middleware ----------------
app.use(cors({
  origin: "http://localhost:3000", // adjust if frontend runs elsewhere
  credentials: true, // allows sending cookies/session
}));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- Routes ----------------
app.use("/api/users", userRoutes);
app.use("/api", managePasswordRoutes);
app.use("/api/admin", adminRoutes);

// ---------------- Database Sync ----------------
sequelize
  .sync({ alter: true }) // creates tables if not exist, updates columns if needed
  .then(() => console.log("SQLite DB synced ✅"))
  .catch((err) => console.error("DB sync error ❌", err));

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
