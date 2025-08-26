const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate data
    validateSignUpData(req);

    const { password, firstName, lastName, emailId } = req.body;

    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send(`error saving user:${error}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("email id not present in db");
    }

    const isPasswodValid = await user.validatePassword(password);
    if (isPasswodValid) {
      //Create JWT token
      const token = await user.getJWT();
      console.log(token);
      res.cookie("token", token);
      res.send("Login success");
    } else {
      throw new Error("password is not valid");
    }
  } catch (error) {
    res.status(400).send(`error in login ${error}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  //Just expire thec ookie right there. no need for any authentication. no harm in calling logout api for all
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

module.exports = authRouter;
