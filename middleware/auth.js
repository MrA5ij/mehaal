const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Login user and validate credentials
async function loginUser(username, password) {
  try {
    const sql = 'SELECT id, username, password_hash, email, role FROM admin_users WHERE username = ?';
    const users = await db.query(sql, [username]);
    
    if (users.length === 0) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Update last login
    await db.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Create new admin user (hash password)
async function createUser(username, password, email, role = 'editor') {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const sql = 'INSERT INTO admin_users (username, password_hash, email, role) VALUES (?, ?, ?, ?)';
    const result = await db.query(sql, [username, passwordHash, email, role]);
    
    return { success: true, userId: result.insertId };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: error.message };
  }
}

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/admin/login');
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Forbidden: Admin access required');
}

module.exports = {
  loginUser,
  createUser,
  requireAuth,
  requireAdmin
};
