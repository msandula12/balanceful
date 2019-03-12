const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  avatar: {
    type: String
  },
  date: {
    default: Date.now(),
    type: Date
  },
  email: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  }
});

module.exports = User = mongoose.model('users', UserSchema);
