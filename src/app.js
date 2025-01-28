const express = require("express");
const connectdb = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Import Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express(); // Declare the app here

// Middleware
app.use(express.json());
app.use(cookieParser());

// Use Routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
