const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Base styles for modern email templates
const getBaseEmailTemplate = (content) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mutual Funds</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f8fafc;
                margin: 0;
                padding: 20px;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
            }
            
            .header h1 {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            }
            
            .header .subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                font-weight: 400;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 20px;
            }
            
            .message {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff !important;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
                margin: 20px 0;
            }
            
            .cta-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
            }
            
            .footer {
                background-color: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            
            .footer p {
                font-size: 14px;
                color: #718096;
                margin-bottom: 10px;
            }
            
            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                margin: 30px 0;
            }
            
            .security-note {
                background-color: #f0f9ff;
                border-left: 4px solid #0ea5e9;
                padding: 16px 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .security-note p {
                font-size: 14px;
                color: #0369a1;
                margin: 0;
            }
            
            @media (max-width: 600px) {
                body {
                    padding: 10px;
                }
                
                .email-container {
                    border-radius: 8px;
                }
                
                .header {
                    padding: 30px 20px;
                }
                
                .header h1 {
                    font-size: 24px;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .cta-button {
                    display: block;
                    width: 100%;
                    padding: 18px;
                }
                
                .footer {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            ${content}
        </div>
    </body>
    </html>
    `;
};

// Send email confirmation with modern styling
const sendConformationEmail = async(name, email, emailVerificationCode) => {
    console.log("Sending confirmation email to:", email);
    
    const content = `
        <div class="header">
            <h1>Mutual Funds</h1>
            <div class="subtitle">Welcome to Your Investment Journey</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi ${name}! 👋</div>
            
            <div class="message">
                <p>Thank you for registering with Mutual Funds. We're excited to have you join our community of smart investors!</p>
                <p>To get started, please confirm your email address by clicking the button below:</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/confirm-email?code=${emailVerificationCode}" class="cta-button">
                    Confirm Your Email
                </a>
            </div>
            
            <div class="security-note">
                <p><strong>Security tip:</strong> This link will expire in 24 hours for your protection.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #718096;">
                If you didn't create this account, you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 Mutual Funds. All rights reserved.</p>
            <p>Building wealth through smart investing.</p>
        </div>
    `;
    
    const htmlContent = getBaseEmailTemplate(content);
    
    try {
        await transporter.sendMail({
            from: `"Mutual Funds" <${process.env.SMTP_USER}>`,
            to: email,
            subject: '✅ Confirm Your Email - Mutual Funds',
            html: htmlContent
        });
        console.log("Confirmation email sent successfully to:", email);
    }
    catch (error) {
        console.error("Error sending confirmation email:", error);
        throw new Error('Email sending failed');
    }
};

// Reset password email with modern styling
const sendPasswordResetEmail = async(name, email, resetPasswordToken) => {
    console.log("Sending password reset email to:", email);
    
    const content = `
        <div class="header">
            <h1>Mutual Funds</h1>
            <div class="subtitle">Password Reset Request</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi ${name},</div>
            
            <div class="message">
                <p>We received a request to reset your password for your Mutual Funds account.</p>
                <p>Click the button below to create a new password:</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}" class="cta-button">
                    Reset Your Password
                </a>
            </div>
            
            <div class="security-note">
                <p><strong>Security notice:</strong> This reset link will expire in 1 hour. If you didn't request this reset, please contact our support team immediately.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #718096;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 Mutual Funds. All rights reserved.</p>
            <p>Keep your account secure with strong passwords.</p>
        </div>
    `;
    
    const htmlContent = getBaseEmailTemplate(content);
    
    try {
        await transporter.sendMail({
            from: `"Mutual Funds" <${process.env.SMTP_USER}>`,
            to: email,
            subject: '🔒 Reset Your Password - Mutual Funds',
            html: htmlContent
        });
        console.log("Password reset email sent successfully to:", email);
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error('Email sending failed');
    }
};

// Send welcome email
const sendWelcomeEmail = async(name, email) => {
    console.log("Sending welcome email to:", email);
    
    const content = `
        <div class="header">
            <h1>Mutual Funds</h1>
            <div class="subtitle">Welcome to Your Investment Journey</div>
        </div>
        
        <div class="content">
            <div class="greeting">Welcome aboard, ${name}! 🎉</div>
            
            <div class="message">
                <p>Congratulations on taking the first step towards building your financial future with Mutual Funds!</p>
                <p>You now have access to:</p>
                <ul style="margin: 20px 0; padding-left: 20px; color: #4a5568;">
                    <li>📊 Comprehensive portfolio tracking</li>
                    <li>💡 Expert investment insights</li>
                    <li>🔍 Advanced fund research tools</li>
                    <li>📱 Mobile-friendly dashboard</li>
                </ul>
                <p>Our team is here to support you every step of the way on your investment journey.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">
                    Explore Your Dashboard
                </a>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #718096;">
                Questions? Our support team is always ready to help. Simply reply to this email or visit our help center.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 Mutual Funds. All rights reserved.</p>
            <p>Start building wealth through smart investing today.</p>
        </div>
    `;
    
    const htmlContent = getBaseEmailTemplate(content);
    
    try {
        await transporter.sendMail({
            from: `"Mutual Funds" <${process.env.SMTP_USER}>`,
            to: email,
            subject: '🎉 Welcome to Mutual Funds - Let\'s Get Started!',
            html: htmlContent
        });
        console.log("Welcome email sent successfully to:", email);
    }
    catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error('Email sending failed');
    }
};

module.exports = {
    sendConformationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail
};