require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Set up the SMTP transporter using Environment Variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // false for port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Helper function to validate email addresses
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email.trim());
}

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Fitness Planet Backend Server is running!' });
});

// Welcome Email API Endpoint
app.post('/send-email', (req, res) => {
    const { to_email, user_name } = req.body;

    // Point 2: Input Validation & Sanitization
    if (!to_email || !isValidEmail(to_email)) {
        return res.status(400).json({ error: 'Invalid or missing email address.' });
    }

    const name = user_name && typeof user_name === 'string' ? user_name.trim() : 'Fitness Enthusiast';

    // Point 3: Branded HTML Email Template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
            .container { max-width: 580px; margin: 0 auto; background: #121212; border: 1px solid rgba(241, 196, 15, 0.3); border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .title { font-size: 26px; font-weight: 800; color: #f1c40f; text-transform: uppercase; margin-top: 10px; }
            .content { padding: 24px 0; font-size: 16px; line-height: 1.6; color: #dddddd; }
            .btn { display: inline-block; padding: 14px 28px; background: #f1c40f; color: #0a0a0a; font-weight: 700; text-decoration: none; border-radius: 30px; text-transform: uppercase; margin-top: 20px; }
            .footer { text-align: center; padding-top: 20px; font-size: 12px; color: #777777; border-top: 1px solid rgba(255,255,255,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">Fitness Planet</div>
            </div>
            <div class="content">
                <h2>Welcome aboard, ${name}! 💪</h2>
                <p>Thank you for joining <strong>Fitness Planet</strong>. Your account has been registered successfully!</p>
                <p>You can now track your BMI diagnostics, access personalized fitness workouts, and gear up with official equipment in our store.</p>
                <a href="http://localhost:3000" class="btn">Explore Fitness Planet</a>
            </div>
            <div class="footer">
                <p>Stay Focused. Stay Fit.</p>
                <p>&copy; ${new Date().getFullYear()} Fitness Planet. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Fitness Planet" <${process.env.SMTP_USER}>`,
        to: to_email,
        subject: '🚀 Welcome to Fitness Planet! Stay Focused. Stay Fit.',
        text: `Hello ${name}, welcome to Fitness Planet! Stay Focused. Stay Fit.`,
        html: htmlTemplate
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('SMTP Error:', error);
            return res.status(500).json({ error: 'Failed to send confirmation email.' });
        }
        console.log('Email sent successfully:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});