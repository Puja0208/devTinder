const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

//create a new express js application
const app = express();
const port = 3000;

app.use(express.json());
connectDB()
  .then(() => {
    console.log("db connect success");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send(`error saving user:${error}`);
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

app.patch("/user", async(req,res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId,data);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }

})
