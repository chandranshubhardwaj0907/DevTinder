const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
    if (phone && !validator.isMobilePhone(phone, "any")) {
        throw new Error("Phone number must be a valid mobile phone number");
      }
};

module.exports = {
    validateSignUpData,
};
