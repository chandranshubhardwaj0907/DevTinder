const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const {validateEditProfile} = require("../utils/validations")
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


module.exports = profileRouter;
