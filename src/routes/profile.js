const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateEditProfile } = require("../utils/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model
const nodemailer = require("nodemailer");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access user from middleware
    res.status(200).send(`Welcome ${user.firstName}, here is your profile`);
  } catch (err) {
    res.status(400).send("ERROR");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      return res.status(400).send("Invalid request");
    }

    const loggedinuser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedinuser[key] = req.body[key];
    });
    await loggedinuser.save();
    res.send(`${loggedinuser.firstName} ,profile updated successfully`);
  } catch (err) {
    return res.status(400).send("Invalid request");
  }
});

profileRouter.post("profile/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await user.find({ email });

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password:</p>
           <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a>
           <p>This link will expire in 15 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);
  res.json({ message: "Password reset email sent. Check your inbox." });
});

profileRouter.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.json({ message: "Password reset successful. You can now log in." });
});

module.exports = profileRouter;
