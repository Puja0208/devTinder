const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

paymentRouter.post("/payment/create",userAuth, async(req,res) => {
    

})





module.exports = paymentRouter;