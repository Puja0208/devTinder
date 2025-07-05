const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require("cookie-parser");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not valid");
    }

    const decodedMsg = await jwt.verify(token, "DEV@Tinder$670");
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
};

module.exports = { userAuth };
