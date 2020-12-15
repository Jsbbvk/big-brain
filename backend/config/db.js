const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/big_brain";

function setUp() {
  return new Promise(function (res, rej) {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .catch((err) => {
        console.error(err);
        rej("db failed");
      });

    let db = mongoose.connection;
    db.once("open", function callback() {
      console.log("connected to mongodb");
      res("connected");
    });
  });
}

module.exports = { connectDB: setUp };
