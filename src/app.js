const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const User = require("./models/user")

//create a new express js application
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
connectDB()
  .then(async () => {
    console.log("db connect success");
    await User.syncIndexes();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
