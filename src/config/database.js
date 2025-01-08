const mongoose = require("mongoose");


const connectdb = async () => {
  try {
   
    await mongoose.connect(
      "mongodb+srv://cbhardwajbe22:VLrvoIysJHqP3Qwa@devtinder.zeltm.mongodb.net/DevTinder", 
      {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
      }
    );

    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
  }
};

module.exports = connectdb;
