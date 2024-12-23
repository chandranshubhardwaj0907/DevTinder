const mongoose = require("mongoose");

const connectdb = async () => {
    await mongoose.connect(
  "mongodb+srv://cbhardwajbe22:VLrvoIysJHqP3Qwa@devtinder.zeltm.mongodb.net/DevTinder"  
)};

// VLrvoIysJHqP3Qwa
module.exports = connectdb;