const express = require('express');
const path = require('path');
const logger = require('morgan');

const usersRouter = require('./routes/users');

const app = express();

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static assets from /public - serves index.html automatically
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/users', usersRouter);

// 404 handler - return JSON for API, or let static handle HTML
app.use(function (req, res) {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(404).send('404 - Not Found');
  }
});

module.exports = app;
