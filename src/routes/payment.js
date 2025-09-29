const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment")

const razorpayInstance = require("../utils/razorpay");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: 50000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        /**Can use this to attach metadat to the payments */
        firstName: "value1",
        lastName: "value2",
        membershipType: "silver",
      },
    });

    //save res in db
    const payment = new Payment({
        userId:req.user._id,
        orderId:order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes
    });

    const savedPayment = await Payment.save();




    //return orderd etails to frontend
    res.json({...savedPayment.toJSON()})

  } catch (error) {}
});

module.exports = paymentRouter;
