const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  userId: String,
  name: String,
  email: String,
  password: String,
  mobile: String
});

module.exports = mongoose.model("users", userSchema, "users-data");
