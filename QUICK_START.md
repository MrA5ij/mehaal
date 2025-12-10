# 🚀 MEHAAL TECH AI - QUICK START GUIDE

## 5-Minute Setup

### Step 1: Copy Environment Config
```bash
cp .env.example .env
```

### Step 2: Edit .env with Your Email
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@mehaal.tech
EMAIL_PASS=your-app-password-here
EMAIL_FROM=noreply@mehaal.tech

SUPPORT_EMAIL=support@mehaal.tech
BUSINESS_EMAIL=business@mehaal.tech
FOUNDER_EMAIL=founder@mehaal.tech
```

### Step 3: Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

### Step 4: Test It
- Visit: http://localhost:3000
- Click: "Request Custom Feature" (button in center section)
- Fill form and submit
- Check your email inbox ✅

---

## 📧 What You Get

| Feature | Location | Status |
|---------|----------|--------|
| Contact Form | /contact.html | ✅ Working |
| Custom Feature Modal | Homepage CTA button | ✅ Working |
| Newsletter Subscribe | Homepage CTA button | ✅ Working |
| Email Replies | Auto sent | ✅ Working |
| Privacy Policy | /privacy.html | ✅ Complete |
| Social Links | Footer | ✅ Complete |

---

## 🔧 Email Providers Quick Setup

### Gmail (Recommended)
1. Enable 2-FA: https://myaccount.google.com/security
2. Get App Password: https://myaccount.google.com/apppasswords
3. Copy 16-char password to .env

### Office 365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_USER=your-email@company.onmicrosoft.com
EMAIL_PASS=your-password
```

### Custom SMTP
```env
EMAIL_HOST=mail.yourserver.com
EMAIL_PORT=587
EMAIL_USER=username
EMAIL_PASS=password
```

---

## 📝 Form Endpoints

```
POST /contact/submit
POST /contact/subscribe
```

Send JSON:
```json
{
  "name": "John",
  "email": "john@example.com",
  "message": "Hello!",
  "type": "general"
}
```

---

## 📊 Email Routing

**Inquiry Type → Email Address**
- general → support@mehaal.tech
- technical → tech@mehaal.tech
- business → business@mehaal.tech
- founder → founder@mehaal.tech

---

## ✅ Testing Checklist

- [ ] npm start (server running)
- [ ] http://localhost:3000 loads
- [ ] Homepage displays correctly
- [ ] Click "Request Custom Feature"
- [ ] Modal opens with animation
- [ ] Fill form with test data
- [ ] Click submit
- [ ] See success message
- [ ] Email arrives in inbox
- [ ] Click footer social links
- [ ] Visit /privacy.html
- [ ] Visit /contact.html (full form)
- [ ] Submit contact form
- [ ] Receive confirmation email

---

## 🚀 Deploy to cPanel

1. Push to GitHub: `git push origin main`
2. SSH into server
3. Create .env file with production credentials
4. Run: `npm install`
5. In cPanel: Click "Run NPM Install"
6. Restart application
7. Test at your domain

---

## 🆘 Troubleshooting

**Email not sending?**
- Check .env file exists and has credentials
- Verify Gmail app password (not regular password)
- Check spam folder
- Review server logs

**Form not working?**
- Open browser console (F12)
- Check for errors
- Verify server running on correct port
- Check network tab for failed requests

**Modal not opening?**
- Clear browser cache
- Try different browser
- Check console for JavaScript errors

---

## 📚 Full Docs

- `EMAIL_SETUP_GUIDE.md` - Detailed email setup
- `IMPROVEMENTS_SUMMARY.md` - All changes explained
- `IMPLEMENTATION_CHECKLIST.md` - Complete task list
- `CMS_SETUP.md` - Admin panel setup

---

## 📞 Support Emails

- **General**: support@mehaal.tech
- **Business**: business@mehaal.tech
- **Technical**: tech@mehaal.tech
- **Corporate**: founder@mehaal.tech

---

## ✨ You're All Set!

Your MEHAAL TECH AI website now has:
- ✅ Professional email system
- ✅ Working contact forms
- ✅ Modal popups
- ✅ Newsletter system
- ✅ Privacy policy
- ✅ Social media links

Ready to go live! 🎉
