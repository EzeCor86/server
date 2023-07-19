const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  avatar: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/pizzaman-27652882.jpg",
  },
  rol: {
    type: String,
    default: "REGULAR", 
  },
  available: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);