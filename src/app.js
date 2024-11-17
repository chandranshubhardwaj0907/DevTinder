const express = require("express");
const app = express();

// A sample route that throws an error
app.get("/", (req, res) => {
    throw new Error("Something went wrong!");
});

// Global error-handling middleware
app.use("/",(err, req, res, next) => {
    console.error(err.stack); // Logs the error details
    res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(3500, () => {
    console.log("Server running on port 3500");
});
