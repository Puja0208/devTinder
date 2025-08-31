const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

module.exports = userRouter;

//Get all pending connecton request for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId",["firstName","lastName"]);

    return res.json({
      message: "all request",
      connectionRequests,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});
