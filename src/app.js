const express = require('express');
const app = express();

app.use(function(req,res){
    res.send("hello ")
})
app.listen(3500,()=>{
    console.log("successful")
});