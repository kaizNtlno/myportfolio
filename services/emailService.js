const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email service configuration error:', error);
        } else {
          console.log('✅ Email service ready to send messages');
        }
      });
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  async sendContactEmail(data) {
    try {
      console.log('Attempting to send email with data:', JSON.stringify(data, null, 2));
      
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const { name, email, subject, message, ip, userAgent, timestamp } = data;

      // Email to portfolio owner
      const ownerEmailOptions = {
        from: {
          name: process.env.FROM_NAME || 'Portfolio Contact Form',
          address: process.env.EMAIL_USER
        },
        to: process.env.CONTACT_EMAIL || 'kaiz.nitullano@example.com',
        subject: `📧 New Contact Form Submission: ${subject}`,
        html: this.generateOwnerEmailHTML(data),
        text: this.generateOwnerEmailText(data),
        replyTo: email
      };

      // Confirmation email to sender
      const confirmationEmailOptions = {
        from: {
          name: process.env.FROM_NAME || 'Kaiz Nitullano',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: '✅ Message Received - Thank You for Contacting Me',
        html: this.generateConfirmationEmailHTML(name, subject),
        text: this.generateConfirmationEmailText(name, subject)
      };

      // Send both emails
      const ownerResult = await this.transporter.sendMail(ownerEmailOptions);
      const confirmationResult = await this.transporter.sendMail(confirmationEmailOptions);

      console.log('✅ Emails sent successfully:', {
        ownerMessageId: ownerResult.messageId,
        confirmationMessageId: confirmationResult.messageId,
        from: email,
        subject: subject
      });

      return {
        success: true,
        messageId: ownerResult.messageId,
        confirmationMessageId: confirmationResult.messageId
      };

    } catch (error) {
      console.error('Email sending failed:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        data: data
      });
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateOwnerEmailHTML(data) {
    const { name, email, subject, message, ip, userAgent, timestamp } = data;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b4513, #d2691e); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #8b4513; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #8b4513; }
            .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Form Submission</h2>
              <p>Someone has reached out through your portfolio website!</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p><strong>Submission Details:</strong></p>
                <p>Time: ${timestamp}</p>
                <p>IP Address: ${ip}</p>
                <p>User Agent: ${userAgent}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  generateOwnerEmailText(data) {
    const { name, email, subject, message, ip, userAgent, timestamp } = data;
    
    return `
New Contact Form Submission
============================

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
--------
${message}

Submission Details:
------------------
Time: ${timestamp}
IP Address: ${ip}
User Agent: ${userAgent}

You can reply directly to this email to respond to ${name}.
    `;
  }

  generateConfirmationEmailHTML(name, subject) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Message Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b4513, #d2691e); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Message Received</h2>
              <p>Thank you for reaching out!</p>
            </div>
            <div class="content">
              <div class="message">
                <p>Dear ${name},</p>
                <p>Thank you for your message regarding "<strong>${subject}</strong>". I have received your correspondence and will review it carefully.</p>
                <p>I typically respond to inquiries within 24-48 hours during business days. If your matter is urgent, please don't hesitate to reach out through other channels.</p>
                <p>I look forward to the possibility of working together!</p>
                <p>Best regards,<br><strong>Kaiz Nitullano</strong><br>Full-Stack Developer & UI/UX Designer</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated confirmation message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Kaiz Nitullano. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  generateConfirmationEmailText(name, subject) {
    return `
Message Received - Thank You for Contacting Me
===============================================

Dear ${name},

Thank you for your message regarding "${subject}". I have received your correspondence and will review it carefully.

I typically respond to inquiries within 24-48 hours during business days. If your matter is urgent, please don't hesitate to reach out through other channels.

I look forward to the possibility of working together!

Best regards,
Kaiz Nitullano
Full-Stack Developer & UI/UX Designer

---
This is an automated confirmation message. Please do not reply to this email.
© ${new Date().getFullYear()} Kaiz Nitullano. All rights reserved.
    `;
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export function for use in routes
const sendContactEmail = (data) => emailService.sendContactEmail(data);

module.exports = {
  sendContactEmail,
  EmailService
};
