const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(404).send("error");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.send(400).send("somthing went wrong");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    console.log("something went wrong");
  }
});
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
     await User.findByIdAndUpdate(userId, data,{returnDocument : "before"});
    res.send("user updated successfully");
  } catch (err) {
    res.end("something went wrong");
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
