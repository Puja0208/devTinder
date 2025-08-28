const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {
  validateProfileData,
  validatePassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send(`ERR: ${error.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    console.log(loggedInUser);
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    });
    // res.send(
    //   `${loggedInUser.firstName}, your profile was updated successfully`
    // );
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPasswordInput = req.body.password;
    validatePassword(newPasswordInput);

    //encrypt password
    const passwordHash = await bcrypt.hash(String(newPasswordInput), 10);

    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.send("password updated successfully");
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = profileRouter;
