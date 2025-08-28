const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong passworrd");
  }
};

const validatePassword = (password) => {
  if (
    !validator.isStrongPassword(password, {
      minLength: 1,
      maxLength: 8,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
  ) {
    throw new Error("password is not strong");
  }
};
const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateProfileData,
  validatePassword,
};
