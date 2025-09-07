const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

module.exports = userRouter;

//Get all pending connecton request for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "about",
    ]); // can write seoncind param as as 'firstName lastName'

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
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "photoUrl",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "photoUrl",
        "about",
      ]);

    //filter data to only sen fro details not cpnnection details
    const data = allConnections.map((row) => {
      //cannot compare tow mongo ids directly so convert to string as they are in object id form
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "connections fetched",
      data,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

//a usee whose profile is neither ignore/accepted/sent request

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    /*all user card to be shown except:
        -own card
        -his connections
        -ignored people
        -sent connection request
        -rejected request
        */
    /**If there is an entey of A,B in request table they should not see each other's profile */

    /**Find all conecrion request you sent or eeceived */
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select(["fromUserId", "toUserId"]);

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(["firstName", "lastName", "emailId", "photoUrl"])
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});
