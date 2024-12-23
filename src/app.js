const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/user");
app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Ashmit",
    lastName: "Thawait",
    Phone: "7987403728",
    gender: "male",
  });
  try {
    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(400).send("error");
  }
});

connectdb()
  .then(() => {
    console.log("Connection established");
    app.listen(3500, () => {
      console.log("Server is running on port 3500");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
