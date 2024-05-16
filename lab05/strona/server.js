const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Middleware for basic authentication
const auth = basicAuth({
    users: { 'admin': 'password' }, // Username: admin, Password: password
    challenge: true,
    realm: 'Admin Access',
});

// Custom middleware for protecting routes
const protectRoute = (req, res, next) => {
    // Check if user is authenticated
    if (req.auth && req.auth.user === 'admin') {
        // If authenticated, proceed to the next middleware
        next();
    } else {
        // If not authenticated, send a 401 Unauthorized response
        res.status(401).send('Unauthorized');
    }
};

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Define routes for reader and admin pages
const readerRouter = require('./routes/readerRouter');
const adminRouter = require('./routes/adminRouter');

app.use('/reader', readerRouter);
app.use('/admin', auth, protectRoute, adminRouter); // Admin panel route with authentication middleware


app.get('/', (req, res) => {
  // Redirect to the reader panel by default
  res.redirect('/reader');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});