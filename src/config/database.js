const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb://jayanshukikani-1412:f8aGt5QWz3jc8Z6j@ac-e7ofthb-shard-00-00.hhlbgpw.mongodb.net:27017,ac-e7ofthb-shard-00-01.hhlbgpw.mongodb.net:27017,ac-e7ofthb-shard-00-02.hhlbgpw.mongodb.net:27017/dev-tinder?ssl=true&replicaSet=atlas-14je5y-shard-0&authSource=admin&appName=PrimaryNode",
  );
};

module.exports = connectDB