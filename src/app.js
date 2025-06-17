const express = require("express");

//create a new express js application
const app = express();
const port = 3000;

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("errorrrr");
    res.send("user data sent");
  } catch (error) {
    res.status(500).send("Something went wrong"); 
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    //Log your error
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
