const express = require("express");

//create a new express js application
const app = express();
const port = 3000;

app.use(
  "/user",
  [
    (req, res, next) => {
      //Route handler
      //   res.send("Route handler 1");
      console.log("handling route");
      next();
      res.send("res");
    },
    (req, res) => {
      //Route handler
      //   res.send("Route handler 1");
      console.log("handling route");
      res.send("response 1");
    },
  ],
  (req, res) => {
    //Route handler
    //   res.send("Route handler 1");
    console.log("handling route");
    res.send("response 1");
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
