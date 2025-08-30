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
    res.send(`${user.firstName} sent connection request`);
  }
);

module.exports = requestRouter;
