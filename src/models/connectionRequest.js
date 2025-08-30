const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  /**Itself adds createdat and updated at timepstamps */
  {
    timestamps: true,
  }
);

//1 - asc, -1 -> desc
//connectionnRequest.find({fromuserId:32323233223232, toUserId:34324234234}) - make this query faster
connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  //check if from request id same as to request user id
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports= ConnectionRequest;