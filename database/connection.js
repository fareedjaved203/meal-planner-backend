const mongoose = require("mongoose");
const { DB_URL } = require("../constants");

const uri = DB_URL;

mongoose
  .connect(uri)
  .then(async () => {
    console.log("Database Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });
