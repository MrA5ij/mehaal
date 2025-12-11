const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
require('dotenv').config();


const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const contactRouter = require('./routes/contact');

const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

// Database connection - optional (try to connect but don't block if fails)
let db = null;
let dbAvailable = false;
try {
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    db = require('./config/database');
    db.testConnection().then(() => {
      dbAvailable = true;
      console.log('✓ Database connection available');
    }).catch(err => {
      console.log('⚠️  Database configured but connection failed:', err.message);
    });
  } else {
    console.log('ℹ️  Database not configured - running in static mode');
  }
} catch (error) {
  console.log('⚠️  Database module not available - running in static mode');
}

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mehaal-tech-secret-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true only when using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.warn('⚠️  WARNING: Using default SESSION_SECRET. Set SESSION_SECRET in .env for security!');
}

// Rate limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// static assets from /public - serves index.html automatically
app.use(express.static(path.join(__dirname, 'public')));

// CSRF protection for admin and login (only if database is configured)
if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  try {
    app.use(['/admin', '/api', '/contact'], csrf());
    console.log('✓ CSRF protection enabled');
  } catch (error) {
    console.log('⚠️  CSRF protection disabled:', error.message);
  }
}

// Routes
app.use('/users', usersRouter); // Legacy in-memory route (keep for backwards compatibility)
app.use('/admin/login', loginLimiter); // Rate limit login
app.use('/admin', adminRouter); // Admin panel routes
app.use('/api', apiRouter); // REST API routes
app.use('/contact', contactRouter); // Contact form routes

// 404 handler - return JSON for API, or serve custom 404 page
app.use(function (req, res) {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

module.exports = app;
