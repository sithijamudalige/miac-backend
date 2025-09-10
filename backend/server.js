const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./db"); // SQLite connection
const userRoutes = require("./routes/userRoutes"); // your routes
const User = require("./models/User"); // import User model

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/users", userRoutes);

// SQLite DB sync
sequelize
  .sync({ alter: true }) // creates tables if not exist, updates columns if needed
  .then(() => console.log("SQLite DB synced ✅"))
  .catch((err) => console.error("DB sync error ❌", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
