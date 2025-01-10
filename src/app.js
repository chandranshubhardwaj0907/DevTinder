const express = require("express");
const connectdb = require("./config/database");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !email || !password) {
      return res
        .status(400)
        .send("First name, email, and password are required");
    }

    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).send(err.message || "An error occurred while signing up");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // create a jwt token
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // validate the token

      // add the jwt token into the cookie  and send it back to the user

      res.cookie("token", token);
      res.send("login sucessfull!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});
app.get("/profile", async (req, res) => {
  const cookies = req.cookies;

  const { token } = cookies;
  const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);

  const { _id } = decodedMessage;
  console.log("logged in user " + _id);
  res.send("Reading Cookies");

  // console.log(cookies);
  res.end("reading  cookies");
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
