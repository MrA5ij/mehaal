const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
require('dotenv').config();

const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

// Database connection - optional (try to connect but don't block if fails)
let db = null;
try {
  db = require('./config/database');
  db.testConnection();
} catch (error) {
  console.log('⚠️  Database module loaded but connection will be tested when needed');
}

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware for admin authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'mehaal-tech-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// static assets from /public - serves index.html automatically
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', usersRouter); // Legacy in-memory route (keep for backwards compatibility)
app.use('/admin', adminRouter); // Admin panel routes
app.use('/api', apiRouter); // REST API routes

// 404 handler - return JSON for API, or serve custom 404 page
app.use(function (req, res) {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

module.exports = app;
