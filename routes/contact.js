var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration
// For production, use real SMTP credentials in .env file:
// EMAIL_HOST=smtp.gmail.com (or your provider)
// EMAIL_PORT=587
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password
// EMAIL_FROM=noreply@mehaal.tech

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route: Submit contact form
router.post('/submit', async function(req, res) {
  try {
    const { name, email, subject, message, type } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Determine recipient based on inquiry type
    let recipientEmail = 'support@mehaal.tech'; // default
    let recipientName = 'Support Team';

    switch(type) {
      case 'technical':
        recipientEmail = 'tech@mehaal.tech';
        recipientName = 'Technical Team';
        break;
      case 'business':
        recipientEmail = 'business@mehaal.tech';
        recipientName = 'Business Team';
        break;
      case 'founder':
        recipientEmail = 'founder@mehaal.tech';
        recipientName = 'Corporate Team';
        break;
      case 'general':
      default:
        recipientEmail = 'support@mehaal.tech';
        recipientName = 'Support Team';
    }

    // Email to MEHAAL team
    const teamMailOptions = {
      from: process.env.EMAIL_FROM || `"MEHAAL Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #a855ff 0%, #4f46e5 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Inquiry Type:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${type || 'General'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${subject || 'No subject provided'}</td>
              </tr>
            </table>
            <h3 style="color: #333; margin-top: 20px;">Message</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #a855ff;">
              <p style="white-space: pre-wrap; margin: 0; color: #333;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This email was sent from the MEHAAL TECH AI contact form on ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
            </p>
          </div>
        </div>
      `
    };

    // Auto-reply to user
    const userMailOptions = {
      from: process.env.EMAIL_FROM || `"MEHAAL TECH AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting MEHAAL TECH AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855ff; font-size: 28px; margin: 0;">MEHAAL TECH AI</h1>
            <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Intelligence Beyond Impossible</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; border-left: 4px solid #a855ff;">
            <h2 style="color: #333; margin-top: 0;">Thank You, ${name}!</h2>
            <p style="color: #555; line-height: 1.6;">
              We've received your message and appreciate you reaching out to us. Our ${recipientName} will review your inquiry and respond within 24-48 business hours.
            </p>
            
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #666; margin: 0; font-size: 14px;"><strong>Your Message:</strong></p>
              <p style="color: #333; margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              If you need immediate assistance, please check our documentation at <a href="https://mehaal.tech" style="color: #a855ff;">mehaal.tech</a> or contact us directly at <a href="mailto:${recipientEmail}" style="color: #a855ff;">${recipientEmail}</a>.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              &copy; 2025 MEHAAL TECH AI. All rights reserved.<br>
              <a href="https://mehaal.tech/terms.html" style="color: #a855ff; text-decoration: none;">Terms & Conditions</a> | 
              <a href="https://mehaal.tech/contact.html" style="color: #a855ff; text-decoration: none;">Contact</a>
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(teamMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later or email us directly.' 
    });
  }
});

// Route: Newsletter subscription
router.post('/subscribe', async function(req, res) {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Notify team about new subscriber
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"MEHAAL Newsletter" <${process.env.EMAIL_USER}>`,
      to: 'support@mehaal.tech',
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #a855ff;">New Newsletter Subscriber</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
          <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    // Welcome email to subscriber
    const welcomeMailOptions = {
      from: process.env.EMAIL_FROM || `"MEHAAL TECH AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to MEHAAL TECH AI Updates',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855ff; font-size: 28px;">Welcome to MEHAAL TECH AI!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 8px;">
            <p style="color: #555; line-height: 1.6;">
              Thank you for subscribing to our updates! You'll be the first to know about:
            </p>
            <ul style="color: #555; line-height: 1.8;">
              <li>New AI product launches</li>
              <li>Feature updates and improvements</li>
              <li>Industry insights and best practices</li>
              <li>Exclusive early access opportunities</li>
            </ul>
            <p style="color: #555; line-height: 1.6;">
              Stay tuned for intelligence beyond impossible.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>&copy; 2025 MEHAAL TECH AI. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(welcomeMailOptions);

    res.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to subscribe. Please try again later.' 
    });
  }
});

module.exports = router;
