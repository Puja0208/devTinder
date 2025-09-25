const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
var cors = require("cors");

require("./utils/cronjob")

const cookieParser = require("cookie-parser");
const User = require("./models/user");


//create a new express js application
const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
connectDB()
  .then(async () => {
    console.log("db connect success");
    await User.syncIndexes();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
