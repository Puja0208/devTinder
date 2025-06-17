const express = require("express");

//create a new express js application
const app = express();
const port = 3000;

/**Request handler */
app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  /**console.log(req.query) - to get query params */
  res.send({ firstName: "john", lastName: "Doe" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
