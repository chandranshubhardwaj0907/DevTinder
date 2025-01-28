const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    try {
      res.send("Connection request sent!");
    } catch (err) {
      res.status(400).send("Failed to send connection request");
    }
  });

module.exports = requestRouter;