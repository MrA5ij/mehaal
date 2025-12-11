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
  console.log('⚠️  API routes: Database not available');
}

// Middleware to check database availability
function requireDatabase(req, res, next) {
  if (!db) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database not configured',
      message: 'API requires database connection. Please configure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.' 
    });
  }
  next();
}

// Get all projects with features
router.get('/projects', requireDatabase, async function (req, res) {
  try {
    var projects = await db.query(`
      SELECT p.*, GROUP_CONCAT(f.feature_name ORDER BY f.display_order SEPARATOR '|') as features
      FROM projects p
      LEFT JOIN features f ON p.id = f.project_id
      WHERE p.is_active = TRUE
      GROUP BY p.id
      ORDER BY p.display_order
    `);
    
    // Parse features string into array
    projects = projects.map(p => ({
      ...p,
      features: p.features ? p.features.split('|') : []
    }));
    
    res.json({ success: true, projects: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single project
router.get('/projects/:slug', requireDatabase, async function (req, res) {
  try {
    var projects = await db.query('SELECT * FROM projects WHERE slug = ?', [req.params.slug]);
    if (projects.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    var features = await db.query(
      'SELECT feature_name FROM features WHERE project_id = ? ORDER BY display_order',
      [projects[0].id]
    );
    
    res.json({
      success: true,
      project: {
        ...projects[0],
        features: features.map(f => f.feature_name)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create project (protected)
router.post('/projects', auth.requireAuth, requireDatabase, async function (req, res) {
  try {
    var { slug, title, tagline, description, impact_statement, display_order, features } = req.body;
    
    var result = await db.query(
      'INSERT INTO projects (slug, title, tagline, description, impact_statement, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [slug, title, tagline, description, impact_statement, display_order || 0]
    );
    
    var projectId = result.insertId;
    
    // Insert features
    if (features && Array.isArray(features)) {
      for (var i = 0; i < features.length; i++) {
        await db.query(
          'INSERT INTO features (project_id, feature_name, display_order) VALUES (?, ?, ?)',
          [projectId, features[i], i + 1]
        );
      }
    }
    
    res.json({ success: true, projectId: projectId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project (protected)
router.put('/projects/:id', auth.requireAuth, requireDatabase, async function (req, res) {
  try {
    var { title, tagline, description, impact_statement, display_order, features } = req.body;
    
    await db.query(
      'UPDATE projects SET title = ?, tagline = ?, description = ?, impact_statement = ?, display_order = ? WHERE id = ?',
      [title, tagline, description, impact_statement, display_order, req.params.id]
    );
    
    // Update features (delete old, insert new)
    await db.query('DELETE FROM features WHERE project_id = ?', [req.params.id]);
    
    if (features && Array.isArray(features)) {
      for (var i = 0; i < features.length; i++) {
        await db.query(
          'INSERT INTO features (project_id, feature_name, display_order) VALUES (?, ?, ?)',
          [req.params.id, features[i], i + 1]
        );
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete project (protected, admin only)
router.delete('/projects/:id', auth.requireAdmin, requireDatabase, async function (req, res) {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all team members
router.get('/team', requireDatabase, async function (req, res) {
  try {
    var members = await db.query('SELECT * FROM team_members WHERE is_active = TRUE ORDER BY id');
    res.json({ success: true, members: members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create team member (protected)
router.post('/team', auth.requireAuth, requireDatabase, async function (req, res) {
  try {
    var { name, role, timezone, email } = req.body;
    
    var result = await db.query(
      'INSERT INTO team_members (name, role, timezone, email) VALUES (?, ?, ?, ?)',
      [name, role, timezone, email]
    );
    
    res.json({ success: true, memberId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update team member (protected)
router.put('/team/:id', auth.requireAuth, requireDatabase, async function (req, res) {
  try {
    var { name, role, timezone, email } = req.body;
    
    await db.query(
      'UPDATE team_members SET name = ?, role = ?, timezone = ?, email = ? WHERE id = ?',
      [name, role, timezone, email, req.params.id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete team member (protected)
router.delete('/team/:id', auth.requireAuth, requireDatabase, async function (req, res) {
  try {
    await db.query('UPDATE team_members SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get site settings
router.get('/settings', requireDatabase, async function (req, res) {
  try {
    var settings = await db.query('SELECT * FROM site_settings');
    var settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.setting_key] = s.setting_value;
    });
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update setting (protected, admin only)
router.put('/settings/:key', auth.requireAdmin, requireDatabase, async function (req, res) {
  try {
    var { value } = req.body;
    
    await db.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [req.params.key, value, value]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
