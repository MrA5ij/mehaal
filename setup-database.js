// Database Setup Script
// Run this to create database and tables: node setup-database.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });
    
    console.log('✓ Connected to MySQL server');
    
    // Create database
    const dbName = process.env.DB_NAME || 'mehaal_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✓ Database '${dbName}' created/verified`);
    
    // Switch to database
    await connection.query(`USE ${dbName}`);
    
    // Create admin_users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'editor') DEFAULT 'editor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table admin_users created');
    
    // Create projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(100) NOT NULL,
        tagline VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        impact_statement TEXT NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table projects created');
    
    // Create features table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        feature_name VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_project (project_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table features created');
    
    // Create team_members table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        timezone VARCHAR(50),
        email VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table team_members created');
    
    // Create site_settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        description VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table site_settings created');
    
    // Insert default admin user (if not exists)
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await connection.query(`
      INSERT INTO admin_users (username, password_hash, email, role) VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE username=username
    `, [
      process.env.ADMIN_USERNAME || 'admin',
      adminPassword,
      process.env.ADMIN_EMAIL || 'founder@mehaal.tech',
      'admin'
    ]);
    console.log('✓ Default admin user created');
    
    // Insert default projects
    const projects = [
      {
        slug: 'accountant',
        title: 'ACCOUNTANT',
        tagline: 'Your Voice. Your Ledger. Your Clarity.',
        description: 'Accountant is a personal financial memory engine powered entirely by conversation. Speak naturally — it listens, organizes, classifies, and recalls every transaction in a voice that mirrors your own tone.',
        impact: 'It feels less like software, more like an extension of your own thinking.',
        order: 1
      },
      {
        slug: 'accountant-pro',
        title: 'ACCOUNTANT PRO',
        tagline: 'Professional Accounting Reinvented for Voice.',
        description: 'A next-generation accounting system engineered for shops, offices, freelancers, and small businesses. It behaves like a professional accountant — except faster, sharper, and infinitely more scalable.',
        impact: 'It turns your voice into a complete finance department.',
        order: 2
      },
      {
        slug: 'assistant-shop',
        title: 'ASSISTANT SHOP',
        tagline: 'The Invisible Manager That Runs Your Shop.',
        description: 'A conversational AI that manages your entire retail ecosystem: Inventory. Expiry. Credit. Sales. Receivings. Just speak — it handles everything.',
        impact: 'A shop that finally knows itself — and speaks to you when you need it.',
        order: 3
      }
    ];
    
    for (const project of projects) {
      await connection.query(`
        INSERT INTO projects (slug, title, tagline, description, impact_statement, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE slug=slug
      `, [project.slug, project.title, project.tagline, project.description, project.impact, project.order]);
    }
    console.log('✓ Default projects inserted');
    
    // Insert features for each project
    const features = {
      accountant: [
        'Voice Transaction Logging',
        'Instant Spoken Reports',
        'Zero Typing Workflow',
        'Multilingual Natural Understanding',
        'Personal Secure Vault',
        'Conversational Retrieval Engine'
      ],
      'accountant-pro': [
        'Full Ledger System via Voice',
        'Sales, Expense & Vendor Tracking',
        'Profit & Cashflow Narration',
        'Professional PDF/CSV Reports',
        'Multi-Shop Access',
        'Built-in Audit Trace'
      ],
      'assistant-shop': [
        'Auto Inventory & Expiry Tracking',
        'Voice-Logged Sales & Ledgers',
        'Daily/Weekly Profit Snapshots',
        'Supplier Receiving Records',
        'Alerts for Stock & Expiry',
        'Retail Intelligence Engine'
      ]
    };
    
    for (const [slug, featureList] of Object.entries(features)) {
      const [rows] = await connection.query('SELECT id FROM projects WHERE slug = ?', [slug]);
      if (rows.length > 0) {
        const projectId = rows[0].id;
        for (let i = 0; i < featureList.length; i++) {
          await connection.query(`
            INSERT INTO features (project_id, feature_name, display_order)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE feature_name=feature_name
          `, [projectId, featureList[i], i + 1]);
        }
      }
    }
    console.log('✓ Default features inserted');
    
    // Insert default team members
    await connection.query(`
      INSERT INTO team_members (name, role, timezone, email) VALUES
      ('Mehaal Ali', 'Founder', 'Asia/Karachi', 'founder@mehaal.tech'),
      ('Ahsan Khan', 'AI Engineer', 'Europe/London', 'tech@mehaal.tech')
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('✓ Default team members inserted');
    
    // Insert site settings
    const settings = [
      ['vision_text', 'MEHAAL is designed around one belief: Intelligence should feel natural. Not typed. Not complicated. Just spoken — and understood.', 'Vision section text'],
      ['hero_tagline', 'INTELLIGENCE BEYOND IMPOSSIBLE', 'Hero section tagline'],
      ['final_cta_headline', 'Let Your Business Talk Back.', 'Final CTA headline'],
      ['support_email', 'support@mehaal.tech', 'Support contact email'],
      ['business_email', 'business@mehaal.tech', 'Business contact email']
    ];
    
    for (const [key, value, desc] of settings) {
      await connection.query(`
        INSERT INTO site_settings (setting_key, setting_value, description)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)
      `, [key, value, desc]);
    }
    console.log('✓ Site settings inserted');
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'founder@mehaal.tech'}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
