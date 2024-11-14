const express = require('express');
const app = express();

app.get('/user/:userId/:password/:Name', (req, res) => {
    console.log(req.params);
    res.send("user data!");
});

app.listen(3500, () => {
    console.log("Server running on port 3500");
});
