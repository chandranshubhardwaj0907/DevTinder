const mongoose = require("mongoose");
var validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
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
    age:{
      type:Number,
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
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
userSchema.methods.validatepassword = async function (passwordInputByuser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByuser,
    passwordHash
  );
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
