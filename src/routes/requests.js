const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const alllowedStatus = ["ignored", "interested"];
      if (!alllowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Inavlid status type: ${status}` });
      }
      // console.log("val", fromUserId == toUserId);
      // if (fromUserId == toUserId) {
      //   return res.status(400).send("cannot send request to yourself");
      // }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "user not found",
        });
      }

      //check if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send(`ERROR: ${error.message}`);
    }
   
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
  try {
 
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    //validate status

    const alllowedStatus = ["accepted", "rejected"];
    if (!alllowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Status ${status} is not valid`,
      });
    }

    //check if receiver is logged in
    //status=interested then only can accept
    //requestId should be valid
    const connectionnRequest = await ConnectionRequest.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionnRequest) {
      return res.status(404).send("Connection request not found");
    }

    connectionnRequest.status = status;
    const data = await connectionnRequest.save();

    return res.json({
      message: `Connection request: ${status}`,
      data,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`)
    
  }
});

module.exports = requestRouter;
