const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be 4-50 characters.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "gender",
    "about",
    "skills",
    "firstName",
    "lastName",
    "photoUrl",
    "age",
  ];
  const isValid = Object.keys(req.body).every((k) =>
    allowedEditFields.includes(k),
  );

  return isValid;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
