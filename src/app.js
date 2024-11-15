const express = require('express');
const app = express();

// app.get('/user/:userId/:password/:Name', (req, res) => {
//     console.log(req.params);
//     res.send("user data!");
// });


app.get('/user', (req, res, next) => {
    console.log("First handler");
    next(); // Passes control to the next handler
});

app.get('/user', (req, res) => {
    res.send("Second handler");
});
app.listen(3500, () => {
    console.log("Server running on port 3500");
});