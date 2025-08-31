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
    }).populate("fromUserId", ["firstName", "lastName"]); // can write seoncind param as as 'firstName lastName'

    return res.json({
      message: "all request",
      connectionRequests,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //Puja -> Joy - accpeted
    //Joy -> Sam - accpeted
    //mesn check if logged in user is from user or to user as he can accept/send requests (which gets accpeted)
    const allConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    }).populate("fromUserId", ["firstName", "lastName"]);

    //filter data to only sen fro details not cpnnection details
    const data = allConnections.map((row) => row.fromUserId);
    res.json({
      message: "connections fetched",
      data,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});
