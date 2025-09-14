const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendContactEmail } = require('../services/emailService');
const { validateContactForm } = require('../middleware/validation');

const router = express.Router();

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }),
  
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters')
    .escape(),
  
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be between 5 and 2000 characters')
    .escape()
];

// POST /api/contact - Send contact form email
router.post('/', contactValidation, validateContactForm, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({
        success: false,
        message: firstError.msg,
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Send email
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
        messageId: emailResult.messageId
      });
    } else {
      throw new Error(emailResult.error || 'Failed to send email');
    }

  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contact - Get contact information (optional)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Contact API endpoint',
    instructions: {
      method: 'POST',
      endpoint: '/api/contact',
      requiredFields: ['name', 'email', 'subject', 'message'],
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'Hello, I would like to discuss a potential project...'
      }
    }
  });
});

module.exports = router;
