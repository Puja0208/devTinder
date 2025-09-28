const Razorpay = require("razorpay")
var instance = new Razorpay({
  //key id and key secret will be found in your razorpay dashboard
  //put these in env files
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

modeule.exports = instance;
