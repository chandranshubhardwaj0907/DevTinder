const express = require("express");
const connectdb = require("./config/database");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the incoming request body
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(404).send(err.message || "An error occurred while signing up");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error("Feed error:", err);
    res.status(400).send(err.message || "Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    console.error("Patch error:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});

// Connect to the database and start the server
connectdb()
  .then(() => {
    console.log("Connection established");
    const PORT = process.env.PORT || 3500; // Use environment variable for the port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
