const mongoose = require("mongoose");
require("dotenv").config();

const connectdb = async () => {
  try {
   
    await mongoose.connect(
      process.env.DB_URI, 
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
