const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

app.get("/users", async (req, res) => {
  try {
    const users = await User.findOne({ lastName: req.body.lastName });
    if (users.length === 0) {
      res.status(404).send("User not found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decodedMsg = await jwt.verify(token, "DEV@Tinder$670");
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    console.log(`Loggedin user is ${_id}`);
    res.send(user);
  } catch (error) {
    res.status(400).send(`ERR: ${error.message}`);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("Users not found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDATES = ["about", "gender"];

  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );

  if (!isUpdateAllowed) {
    return res.status(400).send("Update not allowed");
  }
  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});
