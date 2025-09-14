# Portfolio Backend API

A production-ready Node.js + Express backend for handling contact form submissions from your portfolio website.

## Features

- ✅ **Email Service**: Send emails using Nodemailer with HTML templates
- ✅ **Input Validation**: Comprehensive validation and sanitization
- ✅ **Rate Limiting**: Prevent spam and abuse
- ✅ **Security**: Helmet, CORS, and input sanitization
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Environment Configuration**: Development and production ready
- ✅ **Health Check**: Monitor API status
- ✅ **Confirmation Emails**: Auto-send confirmation to users

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your email configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Contact Form Configuration
CONTACT_EMAIL=kaiz.nitullano@example.com
FROM_NAME=Portfolio Contact Form

# Security
JWT_SECRET=your-super-secret-jwt-key-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# CORS Configuration
FRONTEND_URL=http://localhost:5174
```

### 3. Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### 4. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Contact Form
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I would like to discuss a potential project..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Message sent successfully! I'll get back to you soon.",
  "messageId": "email-message-id"
}
```

## Frontend Integration

Update your React contact form to use the backend:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const result = await response.json();
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle error
  } finally {
    setIsSubmitting(false);
  }
};
```

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
CONTACT_EMAIL=your-business-email@domain.com
FRONTEND_URL=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=10
```

### Deployment Options

1. **Heroku**: Easy deployment with automatic environment management
2. **Vercel**: Serverless deployment with great performance
3. **Railway**: Simple deployment with built-in database options
4. **DigitalOcean**: VPS deployment with full control

### Security Considerations

- ✅ Rate limiting enabled
- ✅ Input validation and sanitization
- ✅ CORS properly configured
- ✅ Helmet security headers
- ✅ Environment variables for sensitive data
- ✅ Error handling without sensitive data exposure

## Email Templates

The backend sends two emails:

1. **Owner Notification**: Rich HTML email with all form details
2. **User Confirmation**: Professional confirmation email to the sender

Both emails are fully customizable in `services/emailService.js`.

## Monitoring

- Health check endpoint: `GET /health`
- Comprehensive logging in development
- Error tracking and reporting
- Rate limit monitoring

## Troubleshooting

### Common Issues

1. **Email not sending**: Check Gmail app password and SMTP settings
2. **CORS errors**: Verify `FRONTEND_URL` in environment variables
3. **Rate limiting**: Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
4. **Port conflicts**: Change `PORT` in environment variables

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and logging.

## License

MIT License - Feel free to use this in your projects!
