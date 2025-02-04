const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest'); // Corrected import

// Route to send a connection request
requestRouter.post("/request/send/interested/:touserid", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.touserid; 
        const status = req.body.status || "pending"; // Default to "pending"

        // Creating a new request
        const newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        // Save to the database 
        const data = await newRequest.save();

        // Success response
        res.json({
            message: "Connection request sent successfully",
            data,
        });
    } catch (err) {
        
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = requestRouter;
