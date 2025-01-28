const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure correct case
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    // Check if cookies are present
    const cookies = req.cookies;
    if (!cookies || !cookies.token) {
      return res.status(401).send("Authentication token is missing");
    }

    const { token } = cookies;

    // Validate the token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(`Authentication failed: ${err.message}`);
  }
};


module.exports = { userAuth };


