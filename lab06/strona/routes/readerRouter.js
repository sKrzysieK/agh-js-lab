const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");
const User = require("../models/userModel");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    const users = await User.find();
    res.render("readerPage", { title: "Reader Page", books, users });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/borrow/:userId/:bookId", async (req, res) => {
    try {
      const { userId, bookId } = req.params;
      
      // Find the user and the book
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);
  
      // Check if the book is available for borrowing
      if (book && book.copies_count > 0 && !user.booksBorrowed.includes(bookId)) {
        // Update user's borrowed books
        user.booksBorrowed.push(bookId);
        await user.save();
  
        // Decrease available copies of the book
        book.copies_count--;
        await book.save();
  
        res.json({ success: true });
      } else {
        // Book is not available for borrowing
        res.status(400).json({ success: false, message: "Book is not available for borrowing" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
  
  router.post("/return/:userId/:bookId", async (req, res) => {
    try {
      const { userId, bookId } = req.params;
  
      // Find the user and the book
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);
  
      // Check if the user has borrowed the book
      if (user.booksBorrowed.includes(bookId)) {
        // Remove the book from user's borrowed books
        user.booksBorrowed = user.booksBorrowed.filter(id => id !== bookId);
        await user.save();
  
        // Increase available copies of the book
        book.copies_count++;
        await book.save();
  
        res.json({ success: true });
      } else {
        // Book was not borrowed by the user
        res.status(400).json({ success: false, message: "User has not borrowed this book" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

module.exports = router;
