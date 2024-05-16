const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');
const User = require("../models/userModel");

router.get('/', async (req, res) => {
    try {

        const users = await User.find();
        res.render('adminPage', { title: 'Admin Panel',users });
    } catch(err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/add-book', async (req, res) => {
    try {
        const { title, author, category, copies_count, cover } = req.body;

        // Create a new book instance
        const newBook = new Book({
            title,
            author,
            category,
            copies_count,
            cover
        });

        // Save the new book to the database
        await newBook.save();

        res.redirect('/admin'); // Redirect back to admin page after adding the book
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/user/:userId/borrowedBooks', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      const borrowedBooks = await Promise.all(user.booksBorrowed.map(async (bookId) => {
        const book = await Book.findById(bookId);
        return book;
      }));
      res.json({ user: user, borrowedBooks: borrowedBooks });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;