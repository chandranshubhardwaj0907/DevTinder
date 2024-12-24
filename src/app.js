const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());


app.post("/signup", async (req, res) => {
  console.log(req.body)
  const user = new User(req.body)
 
  try {
    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(404).send("error");
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
