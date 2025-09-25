const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
// const sendEmail = require("./send");
const ConnectionRequest = require("../models/connectionRequest");
cron.schedule("0 * * * *", async () => {
  //send email to all people who got request the previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    //create list of all toUserId emails - use set have all unique email ids
    const listOfEmails = [
      new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    /*
    for (const email of listOfEmails) {
      //send emails
      try {
        const res = await sendEmail.run(
          "New friend request pending for" + toEmailid,
          "There are so may request opending.Please login to accept/reject it"
        );
        console.log(res);
      } catch (error) {}
    }
      */
  } catch (error) {
    console.error(error);
  }
  console.log("hello World, " + new Date());
});
