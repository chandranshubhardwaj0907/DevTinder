const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 25,
      unique: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email address is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    phone: {
      type: String,
      validate(value) {
        if (!/^\d{10}$/.test(value)) {
          throw new Error("Phone number must be 10 digits");
        }
      },
    },
    address: {
      type: String,
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      validate(value) {
        const validGenders = ["male", "female", "others"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
