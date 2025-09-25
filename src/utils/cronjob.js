const cron = require("node-cron");
const {subDays} = require("date-fns")
const ConnectionRequest = require("../models/connectionRequest");
cron.schedule("0 * * * *", () => {
    //send email to all people who got request the previous day
  
    console.log("hello World, " + new Date());
})