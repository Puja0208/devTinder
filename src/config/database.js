// getting-started.js
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pujarani6991:Lv410jN7l9gqr1gp@namastenode.vnznvgi.mongodb.net/devTinder"
  );
};

module.exports = connectDB;


