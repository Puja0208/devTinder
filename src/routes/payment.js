const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment");
const User = require("../models/user");
const membershipAmount = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

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

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    //this will fail if some amn in the middle sends malicious info by sending our webhook api
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isWebhookValid) {
      return res.status(400).send({
        msg: "webhook signature is invalid",
      });
    }
    //Update payment status in db
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    //update user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event === "payment.captured") {
    // }

    // if (req.body.event === "payment.failed") {
    // }

    res.status(200).send("webhook received successfully");
  } catch (error) {
    //return success response to razorpay
    return req.status(500).send({ msg: error.message });
  }
});

//api to check payment status from client
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user.isPremium) {
      res.json({
        isPremium: true,
      });
    } else {
      res.json({
        isPremium: false,
      });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
});
module.exports = paymentRouter;
