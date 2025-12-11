# MEHAAL TECH AI

MEHAAL.TECH AI — MASTER WEB PAGE

(English Version)

COVER SLIDE

Background:(./src/background.png) Violet–Blue radial gradient, soft glow
Logo:(./src/LOGO.png) White MEHAAL loop symbol, centered
Tagline:
INTELLIGENCE BEYOND IMPOSSIBLE

SECTION 1 — The Vision

MEHAAL is designed around one belief:
Intelligence should feel natural.
Not typed. Not complicated.
Just spoken — and understood.

We build voice-native AI that moves beyond interfaces, beyond screens, and beyond traditional limitations.

A world where your business answers you back.

SECTION 2 — The Ecosystem of MEHAAL AI Projects

Smooth scroll transition: soft upward fade, logo loops stretching subtly.

PROJECT 1 — ACCOUNTANT
Tagline:

Your Voice. Your Ledger. Your Clarity.

Brand-Aligned Description:

Accountant is a personal financial memory engine powered entirely by conversation.
Speak naturally — it listens, organizes, classifies, and recalls every transaction in a voice that mirrors your own tone.

Core Features (White minimal icons):

Voice Transaction Logging

Instant Spoken Reports

Zero Typing Workflow

Multilingual Natural Understanding

Personal Secure Vault

Conversational Retrieval Engine

Brand Impact Statement:

It feels less like software, more like an extension of your own thinking.

Scroll animation: loops separate into two, then merge → transition to Pro.

PROJECT 2 — ACCOUNTANT PRO
Tagline:

Professional Accounting Reinvented for Voice.

Brand-Aligned Description:

A next-generation accounting system engineered for shops, offices, freelancers, and small businesses.
It behaves like a professional accountant —
except faster, sharper, and infinitely more scalable.

Core Features:

Full Ledger System via Voice

Sales, Expense & Vendor Tracking

Profit & Cashflow Narration

Professional PDF/CSV Reports

Multi-Shop Access

Built-in Audit Trace

Brand Impact Statement:

It turns your voice into a complete finance department.

Scroll animation: shelves sliding into formation → transition to Shop Assist.

PROJECT 3 — ASSISTANT SHOP
Tagline:

The Invisible Manager That Runs Your Shop.

Brand-Aligned Description:

A conversational AI that manages your entire retail ecosystem:
Inventory. Expiry. Credit. Sales. Receivings.
Just speak — it handles everything.

Core Features:

Auto Inventory & Expiry Tracking

Voice-Logged Sales & Ledgers

Daily/Weekly Profit Snapshots

Supplier Receiving Records

Alerts for Stock & Expiry

Retail Intelligence Engine

Brand Impact Statement:

A shop that finally knows itself — and speaks to you when you need it.

Scroll: gradient smoothly deepens → reaching the “Custom Build” zone.

SECTION: CUSTOM FEATURE / ADD-ON DEVELOPMENT
Headline:

Every Business Is Unique. Your AI Should Be Too.

Subtext (Brand Tone):

If you need a specialized workflow, a custom AI module,
or a feature made exclusively for your business environment —
we build it for you.

CTAs:

Request a Custom Feature

Subscribe for Product Updates
(White buttons, soft glow hover)

Scroll: final gradient → logo pulses once.

FINAL SECTION — CALL TO ACTION
Headline:

Let Your Business Talk Back.

Subline:

MEHAAL.TECH AI — Intelligence that listens.
Intelligence that speaks.
Intelligence beyond impossible.

CTA: Get Started

MEHAAL.TECH AI — MASTER WEB (only when Urdu version selected)

(Urdu Version — Brand Aligned)

COVER SLIDE
(./src/background.png)
Violet–Blue gradient
Logo center  (./src/LOGO.png)
Tagline: INTELLIGENCE BEYOND IMPOSSIBLE

SECTON 1 — DOUR KA TASAVVUR

MEHAAL ka asool seedha hai:
Aqli system ko insani guftagoo jitna aasaan hona chahiye.

Screens kam, samajh zyada.
Buttons kam, awaaz zyada.

Aik aisi duniya jahan aap ka business aap se baat karta hai.

SECTION 2 — MEHAAL AI Projects

Scroll effect: halki roshni, soft loop expansion.

PROJECT 1 — ACCOUNTANT
Tagline:

Aap ki awaaz. Aap ka hisaab.

Description:

Accountant aik personal financial memory AI hai jo sirf guftagoo se kaam karta hai.
Aap bolte jao — yeh sun kar record karta jata hai.
Aap poochon — yeh aap ki zubaan main wapas suna deta hai.

Features:

Awaaz se transaction entry

Immediate spoken reports

Zero typing system

Multi-language understanding

Secure vault

Human-style conversation AI

Impact:

Yeh software nahi lagta — aap ka khud ka sochne ka system lagta hai.

Scroll: subtle loop motion → Pro.

PROJECT 2 — ACCOUNTANT PRO
Tagline:

Professional accounting — ab sirf bol kar.

Description:

Chhote businesses, shops, aur offices ke liye aik poora voice-enabled accounting system.
Professional kaam, professional speed main — bina kisi mushkilat ke.

Features:

Voice ledger

Sales/expense/vendor tracking

Profit/Loss & cashflow narration

Professional reports

Multi-shop access

Audit trail system

Impact:

Aap ki awaaz se poora finance department chal padta hai.

Scroll: shop aisles fade in → Shop Assist.

PROJECT 3 — ASSISTANT SHOP
Tagline:

Aap ki shop ka khamosh manager.

Description:

Inventory, expiry, udhaar, sales, receiving — sab kuch guftagoo se chalnay wala AI system.
Aap bas poochain. Yeh har cheez yaad rakhta hai.

Features:

Auto inventory tracking

Sales & udhaar voice log

Profit snapshots

Supplier receiving record

Alerts (stock / expiry)

Retail intelligence

Impact:

Shop ko pehli dafa aik zubaan mil jati hai.

Scroll → deep gradient → custom section.

SECTION — CUSTOM FEATURES / ADD-ONS
Headline:

Koi khaas feature chahiye?

Subtext:

Har business ki apni zaroorat hoti hai.
Agar aap kisi custom workflow, AI module, integration,
ya kisi khaas business feature ka design chahte hain —
MEHAAL woh aap ke liye banata hai.

Buttons:

Custom Feature Request

Subscribe

Scroll → final pulse of logo.

FINAL CTA
Headline:

Aaj se aap ka business aap se baat karega.

CTA: Start Now




## Project Structure

Clean Express.js application serving static HTML landing page with scrollable sections showcasing MEHAAL TECH AI products and services.

### Pages
- **Main Landing**: `public/index.html` - Hero section, vision, projects, and CTA
- **Terms & Conditions**: `public/terms.html` - Legal terms and conditions
- **Contact**: `public/contact.html` - Communication channels
- **Partner**: `public/partner.html` - Partnership opportunities

### API Endpoints
- `/users` - JSON API with user roster

## Requirements
- Node.js 18 or newer
- npm for installing dependencies
- Only 2 production dependencies: `express` and `morgan`

## Local Development
```bash
npm install
npm start
```
The server listens on `http://localhost:3000` by default. Set the `PORT` environment variable to override it.

Open your browser to:
- Main site: http://localhost:3000
- Terms: http://localhost:3000/terms.html
- Contact: http://localhost:3000/contact.html
- Partner: http://localhost:3000/partner.html

## Testing
```bash
npm test
```
Runs Jest tests validating static HTML serving and API endpoints.

## Deployment Options

### Option 1: Docker (Recommended)

The easiest way to deploy with MySQL database included:

```powershell
# Copy environment template
Copy-Item .env.docker.template .env

# Edit .env with your credentials
# Then start services
npm run docker:up
```

See **[DOCKER_SETUP.md](DOCKER_SETUP.md)** for complete Docker documentation.

### Option 2: cPanel Node.js App

For cPanel hosting without Docker:

1. **Upload Repository**
   - Use Git, SFTP, or File Manager to upload to your cPanel account
   - Recommended: Use Git for version control

2. **Setup Node.js Application**
   - Open **Setup Node.js App** in cPanel
   - Choose the document root containing this project
   - Select Node.js version 18.x or newer

3. **Configure Application**
   - Set **Application Startup File** to `server.js`
   - Application Root: Your project directory
   - Application URL: Your domain/subdomain

4. **Environment Variables**
   - Add database credentials if using CMS features
   - Set `SESSION_SECRET` for admin panel
   - Configure email settings for contact forms

5. **Install Dependencies**
   - Click **Run NPM Install**
   - This installs all required packages

6. **Start Application**
   - Press **Start Application**
   - Passenger runs `npm start` which executes `node server.js`

### Important Notes
- ✅ Docker includes MySQL - no separate database setup needed
- ✅ cPanel requires manual database creation in MySQL Databases
- ✅ All static files served from `public/` directory
- ✅ Server automatically handles `PORT` environment variable

## Project Conventions
- **Brand**: "MEHAAL" (all caps) or "MEHAAL TECH AI"
- **Theme**: Violet-blue gradient (#a855ff, #4f46e5)
- **Code**: CommonJS (require/module.exports)
- **Indentation**: 2 spaces

