const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

//create a new express js application
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
connectDB()
  .then(async () => {
    console.log("db connect success");
    await User.syncIndexes();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
  try {
    //Validate data
    validateSignUpData(req);

    const { password, firstName, lastName, emailId } = req.body;

    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send(`error saving user:${error}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("email id not present in db");
    }

    const isPasswodValid = await bcrypt.compare(password, user.password);
    if (isPasswodValid) {
      //Create JWT token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$670");
      console.log(token);
      res.cookie("token", token);
      res.send("Login success");
    } else {
      throw new Error("password is not valid");
    }
  } catch (error) {
    res.status(400).send(`error in login ${error}`);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send(`ERR: ${error.message}`);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { user } = req;
  console.log("sending a connect request");
  res.send(`${user.firstName} sent connection request`);
});
