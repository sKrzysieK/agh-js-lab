const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  copies_count: Number,
  cover: String
});

module.exports = mongoose.model('Book', bookSchema);