const express = require("express");

//create a new express js application
const app = express();
const port = 3000;

const { adminAuth } = require("./middlewares/auth");
//Handle auth middleware
app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res) => {
  res.send("All data sent");
});

app.use("/admin/deleteuser", (req, res) => {
  res.send("Deleted a user");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
