const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment");
const membershipAmount = require("../utils/constants");

const razorpayInstance = require("../utils/razorpay");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = userAuth;
    const order = await razorpayInstance.orders.create({
      //always use backend to rely on amount. nver pasfrom frontend. can be prone to man in the middle attacks
      amount: membershipAmount[membershipType] * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        /**Can use this to attach metadat to the payments */
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    //save res in db
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await Payment.save();

    //return orderd etails to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {}
});

module.exports = paymentRouter;
