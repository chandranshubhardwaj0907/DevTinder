const express = require("express");
const connectdb = require("./config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const User = require("./models/user");

const { validateSignUpData } = require("./utils/validations");
const { userAuth } = require("./middlewares/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !email || !password) {
      return res
        .status(400)
        .send("First name, email, and password are required");
    }

    // Validate user input
    validateSignUpData(req);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email is already registered");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user to the database
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).send(err.message || "An error occurred while signing up");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Validate password
    const isPasswordValid = user.validatepassword; 
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate JWT token
    const token = await user.getJWT;

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.send("Login successful!");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});

// Protected Profile Route
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access user from middleware
    res.status(200).send(`Welcome ${user.firstName}, here is your profile`);
  } catch (err) {
    res.status(400).send("ERROR");
  }
});

// Example Protected Route (Send Connection Request)
app.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try {
    res.send("Connection request sent!");
  } catch (err) {
    res.status(400).send("Failed to send connection request");
  }
});

// Connect to Database and Start Server
connectdb()
  .then(() => {
    console.log("Database connected successfully");
    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
