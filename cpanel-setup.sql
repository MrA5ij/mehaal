-- MEHAAL TECH AI - Database Setup for cPanel
-- Copy this entire code and run in phpMyAdmin SQL tab

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create projects table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  timezone VARCHAR(50),
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
-- Password hash: $2b$10$rGfK5M3H0JqZx1mXQZ0pVOYxJ8h3xH6QZ0pVOYxJ8h3xH6QZ0pVOY
INSERT INTO admin_users (username, password_hash, email, role) VALUES
('admin', '$2b$10$rGfK5M3H0JqZx1mXQZ0pVOYxJ8h3xH6QZ0pVOYxJ8h3xH6QZ0pVOY', 'founder@mehaal.tech', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert default projects
INSERT INTO projects (slug, title, tagline, description, impact_statement, display_order) VALUES
('accountant', 'ACCOUNTANT', 'Your Voice. Your Ledger. Your Clarity.', 
 'Accountant is a personal financial memory engine powered entirely by conversation. Speak naturally — it listens, organizes, classifies, and recalls every transaction in a voice that mirrors your own tone.',
 'It feels less like software, more like an extension of your own thinking.',
 1),
('accountant-pro', 'ACCOUNTANT PRO', 'Professional Accounting Reinvented for Voice.',
 'A next-generation accounting system engineered for shops, offices, freelancers, and small businesses. It behaves like a professional accountant — except faster, sharper, and infinitely more scalable.',
 'It turns your voice into a complete finance department.',
 2),
('assistant-shop', 'ASSISTANT SHOP', 'The Invisible Manager That Runs Your Shop.',
 'A conversational AI that manages your entire retail ecosystem: Inventory. Expiry. Credit. Sales. Receivings. Just speak — it handles everything.',
 'A shop that finally knows itself — and speaks to you when you need it.',
 3)
ON DUPLICATE KEY UPDATE slug=slug;

-- Get project IDs and insert features
SET @accountant_id = (SELECT id FROM projects WHERE slug='accountant');
SET @accountant_pro_id = (SELECT id FROM projects WHERE slug='accountant-pro');
SET @assistant_shop_id = (SELECT id FROM projects WHERE slug='assistant-shop');

-- Insert features for Accountant
INSERT INTO features (project_id, feature_name, display_order) VALUES
(@accountant_id, 'Voice Transaction Logging', 1),
(@accountant_id, 'Instant Spoken Reports', 2),
(@accountant_id, 'Zero Typing Workflow', 3),
(@accountant_id, 'Multilingual Natural Understanding', 4),
(@accountant_id, 'Personal Secure Vault', 5),
(@accountant_id, 'Conversational Retrieval Engine', 6);

-- Insert features for Accountant Pro
INSERT INTO features (project_id, feature_name, display_order) VALUES
(@accountant_pro_id, 'Full Ledger System via Voice', 1),
(@accountant_pro_id, 'Sales, Expense & Vendor Tracking', 2),
(@accountant_pro_id, 'Profit & Cashflow Narration', 3),
(@accountant_pro_id, 'Professional PDF/CSV Reports', 4),
(@accountant_pro_id, 'Multi-Shop Access', 5),
(@accountant_pro_id, 'Built-in Audit Trace', 6);

-- Insert features for Assistant Shop
INSERT INTO features (project_id, feature_name, display_order) VALUES
(@assistant_shop_id, 'Auto Inventory & Expiry Tracking', 1),
(@assistant_shop_id, 'Voice-Logged Sales & Ledgers', 2),
(@assistant_shop_id, 'Daily/Weekly Profit Snapshots', 3),
(@assistant_shop_id, 'Supplier Receiving Records', 4),
(@assistant_shop_id, 'Alerts for Stock & Expiry', 5),
(@assistant_shop_id, 'Retail Intelligence Engine', 6);

-- Insert default team members
INSERT INTO team_members (name, role, timezone, email) VALUES
('Mehaal Ali', 'Founder', 'Asia/Karachi', 'founder@mehaal.tech'),
('Ahsan Khan', 'AI Engineer', 'Europe/London', 'tech@mehaal.tech')
ON DUPLICATE KEY UPDATE name=name;

-- Insert site settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('vision_text', 'MEHAAL is designed around one belief: Intelligence should feel natural. Not typed. Not complicated. Just spoken — and understood.', 'Vision section text'),
('hero_tagline', 'INTELLIGENCE BEYOND IMPOSSIBLE', 'Hero section tagline'),
('final_cta_headline', 'Let Your Business Talk Back.', 'Final CTA headline'),
('support_email', 'support@mehaal.tech', 'Support contact email'),
('business_email', 'business@mehaal.tech', 'Business contact email')
ON DUPLICATE KEY UPDATE setting_key=setting_key;

-- Show created tables
SHOW TABLES;
