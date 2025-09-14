const { body, validationResult } = require('express-validator');

// Custom validation middleware
const validateContactForm = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    // Remove any potential XSS attempts
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
  }
  
  next();
};

// Rate limiting for contact form
const contactRateLimit = (req, res, next) => {
  // This is handled by express-rate-limit in server.js
  // but we can add additional logic here if needed
  next();
};

module.exports = {
  validateContactForm,
  sanitizeInput,
  contactRateLimit
};
