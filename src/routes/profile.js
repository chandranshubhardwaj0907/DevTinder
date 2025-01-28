const express = require('express');
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user; // Access user from middleware
      res.status(200).send(`Welcome ${user.firstName}, here is your profile`);
    } catch (err) {
      res.status(400).send("ERROR");
    }
  });
  

  module.exports  = profileRouter;