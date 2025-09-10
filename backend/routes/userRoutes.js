const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Sequelize model

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- SIGNUP ----------------
router.post(
  "/signup",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "idPhotoFront", maxCount: 1 },
    { name: "idPhotoBack", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { username, password, dob, email, contactNumber, artistType } = req.body;

      // Check duplicate
      const existingUser = await User.findOne({
        where: {
          [require("sequelize").Op.or]: [{ username }, { email }],
        },
      });

      if (existingUser)
        return res.status(400).json({ message: "Username or email already exists ❌" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        password: hashedPassword,
        dob,
        email,
        contactNumber,
        artistType,
        profilePic: req.files["profilePic"] ? req.files["profilePic"][0].path : null,
        idPhotoFront: req.files["idPhotoFront"] ? req.files["idPhotoFront"][0].path : null,
        idPhotoBack: req.files["idPhotoBack"] ? req.files["idPhotoBack"][0].path : null,
      });

      res.status(201).json({
        message: "User registered successfully ✅",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          artistType: newUser.artistType,
          profilePic: newUser.profilePic,
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error ❌" });
    }
  }
);

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password ❌" });

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        artistType: user.artistType,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
