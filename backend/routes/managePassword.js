const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// 1️⃣ Forgot Password - send reset code
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save();

    // Send reset code via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sithijamudalige15@gmail.com",
        pass: "hiyiuajhqnrdpxnl", // ⚠️ use App Password
      },
    });

    await transporter.sendMail({
      from: "yourEmail@gmail.com",
      to: user.email,
      subject: "Password Reset Code",
      text: `Your reset code is: ${code}. It expires in 10 minutes.`,
    });

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset code" });
  }
});

// 2️⃣ Reset Password - verify code + set new password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.resetCode !== code) return res.status(400).json({ message: "Invalid code" });
    if (new Date() > user.resetCodeExpiry) return res.status(400).json({ message: "Code expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
