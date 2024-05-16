const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  booksBorrowed: { type: Array, default: [] },
  username: { type: String, required: true, unique: true } // Unique username
});

const User = mongoose.model('User', userSchema);

module.exports = User;
