const express = require("express");

//create a new express js application
const app = express();
const port = 3000;

/**Request handler */
app.use("/test",(req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
