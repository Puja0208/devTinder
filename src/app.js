const express = require("express");

//create a new express js application
const app = express();
const port = 3000;

/**Request handler */
app.get("/user", (req, res) => {
  res.send({ firstName: "john", lastName: "Doe" });
});

app.post("/user", (req, res) => {
  console.log("save data to db");
  res.send("data saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("delete successfully");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
