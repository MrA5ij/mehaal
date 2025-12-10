# MEHAAL TECH AI - Email Setup & Configuration Guide

## Quick Setup for Email Functionality

Your MEHAAL TECH AI website now has **fully functional contact forms** with professional email integration using Nodemailer.

### What's New

✅ **Functional Contact Form** - Users can submit inquiries directly from `/contact.html`  
✅ **Modal Popup Forms** - CTA buttons open smooth modals for custom features and newsletter signup  
✅ **Email Notifications** - Automatic emails to team + auto-replies to users  
✅ **Newsletter Subscription** - Subscribe button with welcome emails  
✅ **Privacy Policy Page** - Complete GDPR/CCPA compliant privacy policy  
✅ **Social Media Links** - LinkedIn, Twitter, Facebook, GitHub, YouTube in footer  
✅ **Fixed Favicon** - Corrected typo: `fevicon.ico` → `favicon.ico`  
✅ **Professional Design** - Styled modals with smooth animations and validation

---

## Email Setup Instructions

### Step 1: Install Dependencies ✅ (Already Done)

Nodemailer has been installed via npm:
```bash
npm install nodemailer
```

### Step 2: Configure Gmail (Recommended)

#### Option A: Gmail with App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate an App Password**:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password (remove spaces)

3. **Update .env file**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password-without-spaces
EMAIL_FROM=noreply@mehaal.tech
```

#### Option B: Use Your Company Email (Gmail Workspace / Office 365 / Custom SMTP)

**Gmail Workspace:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourcompany.com
EMAIL_PASS=your-workspace-app-password
EMAIL_FROM=noreply@mehaal.tech
```

**Microsoft 365 / Outlook:**
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@company.onmicrosoft.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@mehaal.tech
```

**Custom SMTP Server:**
```env
EMAIL_HOST=mail.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=noreply@mehaal.tech
```

### Step 3: Set Up .env File

1. **Copy the template**:
```bash
cp .env.example .env
```

2. **Edit `.env` with your credentials**:
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@mehaal.tech
EMAIL_PASS=your-app-password-here
EMAIL_FROM=noreply@mehaal.tech

# Email Routing
SUPPORT_EMAIL=support@mehaal.tech
BUSINESS_EMAIL=business@mehaal.tech
FOUNDER_EMAIL=founder@mehaal.tech
TECH_EMAIL=tech@mehaal.tech

# Other Settings
NODE_ENV=production
SESSION_SECRET=your-random-secret-key-here
```

3. **NEVER commit .env file**:
   - It's already in `.gitignore`
   - Contains sensitive credentials

### Step 4: Test Email Configuration

Create a test file `test-email.js`:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email
transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'your-test-email@gmail.com',
  subject: 'MEHAAL Email Test',
  html: '<h1>Email configuration is working!</h1>'
}, (error, info) => {
  if (error) {
    console.error('Email Error:', error.message);
  } else {
    console.log('✅ Email sent successfully:', info.response);
  }
  process.exit(0);
});
```

Run test:
```bash
node test-email.js
```

### Step 5: Start the Server

```bash
npm start
```

Server runs on http://localhost:3000

---

## Form Features & Routing

### Contact Form (`/contact/submit`)
- **Fields**: Name, Email, Type, Subject, Message
- **Inquiry Types**:
  - `general` → support@mehaal.tech
  - `technical` → tech@mehaal.tech
  - `business` → business@mehaal.tech
  - `founder` → founder@mehaal.tech
- **Responses**: 
  - Confirmation email to user
  - Detailed email to team

### Newsletter Subscription (`/contact/subscribe`)
- **Fields**: Name (optional), Email (required)
- **Auto-reply**: Welcome email with subscription details

### Custom Feature Request (Modal Form)
- **Endpoint**: `/contact/submit` with type="business"
- **Includes**: Business type, feature description
- **Recipient**: business@mehaal.tech

---

## File Changes Summary

### New Files Created:
- ✅ `/routes/contact.js` - Email handling routes
- ✅ `/public/privacy.html` - Full privacy policy (GDPR/CCPA compliant)
- ✅ `.env.example` - Configuration template

### Updated Files:
- ✅ `/app.js` - Added contact router
- ✅ `/public/index.html` - Modal forms + CTA buttons + social links
- ✅ `/public/contact.html` - Functional contact form
- ✅ `/public/style.css` - Modal styles + form styling + social icons
- ✅ `/public/terms.html` - Fixed favicon link
- ✅ `/public/partner.html` - Fixed favicon link
- ✅ `package.json` - Nodemailer dependency added

### Fixed Issues:
- ✅ Favicon typo: `fevicon.ico` → `favicon.ico`
- ✅ All CTA buttons now functional (contact + subscribe modals)
- ✅ Footer enhanced with social media links
- ✅ Email validation and error handling
- ✅ Accessibility improvements (ARIA labels, semantic HTML)

---

## Deployment to cPanel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add email functionality and improvements"
git push origin main
```

### Step 2: On cPanel Server
1. Navigate to Node.js app in cPanel
2. Create `.env` file with email credentials:
```bash
nano /home/username/public_html/mehaal/.env
```

3. Add configuration:
```env
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@mehaal.tech
EMAIL_PASS=app-password-here
EMAIL_FROM=noreply@mehaal.tech
SUPPORT_EMAIL=support@mehaal.tech
BUSINESS_EMAIL=business@mehaal.tech
FOUNDER_EMAIL=founder@mehaal.tech
SESSION_SECRET=your-random-secret
```

4. Run NPM Install in cPanel
5. Restart application
6. Test form at https://yourdomain.com/contact.html

---

## Troubleshooting

### Email Not Sending?

**Problem**: "Invalid login" error
- **Solution**: Check EMAIL_USER and EMAIL_PASS are correct
- For Gmail, use App Password (not regular password)
- Ensure 2-FA is enabled on Gmail

**Problem**: "ECONNREFUSED" error
- **Solution**: Check EMAIL_HOST and EMAIL_PORT settings
- Verify firewall isn't blocking SMTP port

**Problem**: Emails going to spam
- **Solution**: 
  - Verify SPF, DKIM, DMARC records for your domain
  - Add cPanel hostname to SPF record
  - Use a from address that matches your domain

### Form Not Submitting?

**Check browser console** for JavaScript errors:
1. Open DevTools (F12)
2. Check Console and Network tabs
3. Look for 404 errors on `/contact/submit`

**Common issues**:
- Server not running (`npm start`)
- Contact route not loaded in app.js
- Missing email configuration in .env

### CORS Issues?

If getting CORS errors with frontend/backend on different domains:

Update `app.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://mehaal.tech',
  credentials: true
}));
```

---

## Security Best Practices

✅ **Never commit .env file** - Contains passwords  
✅ **Use strong SESSION_SECRET** - Generate random string  
✅ **Enable HTTPS in production** - Secure credential transmission  
✅ **Validate all inputs** - Check email format, prevent injection  
✅ **Rate limit endpoints** - Prevent spam/abuse  
✅ **Use App Passwords** - Not regular passwords for email  
✅ **Rotate credentials** - Change passwords periodically  
✅ **Monitor logs** - Check for suspicious activity

---

## Next Steps (Optional Enhancements)

1. **Add Database Integration**
   - Store contact submissions in MySQL
   - Create admin interface to view inquiries
   - Track subscription list

2. **Advanced Email Features**
   - HTML email templates with branding
   - Email scheduling
   - Bulk campaigns for newsletters

3. **Additional Integrations**
   - Slack notifications for new inquiries
   - CRM integration (HubSpot, Salesforce)
   - SMS notifications
   - WhatsApp Business API

4. **Analytics**
   - Track form submissions
   - Monitor email delivery rates
   - A/B test subject lines

5. **Security Enhancements**
   - reCAPTCHA for forms
   - IP rate limiting
   - Webhook signing for verification

---

## Support

For email configuration help:
- **Gmail App Passwords**: https://support.google.com/accounts/answer/185833
- **Nodemailer Docs**: https://nodemailer.com/
- **SMTP Providers**: Mailgun, SendGrid, AWS SES

For technical issues, contact: tech@mehaal.tech

---

**Last Updated**: December 10, 2025  
**Version**: 2.0 - Email Integration & Professional Upgrades
