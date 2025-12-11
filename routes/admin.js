var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

// Check if database is available
let db = null;
try {
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    db = require('../config/database');
  }
} catch (error) {
  console.log('⚠️  Admin routes: Database not available');
}

// Middleware to check database availability
function requireDatabase(req, res, next) {
  if (!db) {
    return res.status(503).render('admin/login', { 
      error: 'Database not configured. Please set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in environment variables.' 
    });
  }
  next();
}

// Login page
router.get('/login', function (req, res) {
  if (!db) {
    return res.render('admin/login', { 
      error: 'Admin panel requires database configuration. Please contact administrator.' 
    });
  }
  if (req.session && req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
});

// Login POST
router.post('/login', requireDatabase, async function (req, res) {
  var { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('admin/login', { error: 'Username and password required' });
  }
  
  var result = await auth.loginUser(username, password);
  
  if (result.success) {
    req.session.user = result.user;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: result.error });
  }
});

// Logout
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Dashboard (protected)
router.get('/dashboard', auth.requireAuth, requireDatabase, function (req, res) {
  res.render('admin/dashboard', { user: req.session.user });
});

// Projects management (protected)
router.get('/projects', auth.requireAuth, requireDatabase, async function (req, res) {
  var projects = await db.query('SELECT * FROM projects ORDER BY display_order');
  res.render('admin/projects', { user: req.session.user, projects: projects });
});

// Team members management (protected)
router.get('/team', auth.requireAuth, requireDatabase, async function (req, res) {
  var members = await db.query('SELECT * FROM team_members WHERE is_active = TRUE ORDER BY id');
  res.render('admin/team', { user: req.session.user, members: members });
});

// Settings management (protected, admin only)
router.get('/settings', auth.requireAdmin, requireDatabase, async function (req, res) {
  var settings = await db.query('SELECT * FROM site_settings ORDER BY setting_key');
  res.render('admin/settings', { user: req.session.user, settings: settings });
});

module.exports = router;
