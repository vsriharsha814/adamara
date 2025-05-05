const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP
let transporter;

// Initialize email transporter
const initTransporter = () => {
  // Check if already initialized
  if (transporter) return transporter;

  // Create transporter based on environment
  if (process.env.NODE_ENV === 'production') {
    // Production email setup
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // For development, use ethereal.email (fake SMTP service)
    // You can view sent emails at ethereal.email
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.DEV_EMAIL_USER || 'your_ethereal_username',
        pass: process.env.DEV_EMAIL_PASS || 'your_ethereal_password'
      }
    });
  }

  return transporter;
};

/**
 * Send confirmation email to requester
 * @param {Object} requestData - The request data
 * @returns {Promise} - Promise with mail info
 */
const sendConfirmationEmail = async (requestData) => {
  const transport = initTransporter();
  
  const { requesterName, requesterEmail, adType, requestId } = requestData;
  
  const mailOptions = {
    from: `"AdAmara System" <${process.env.EMAIL_FROM || 'noreply@adamara.example.com'}>`,
    to: requesterEmail,
    subject: `Your Ad Request #${requestId} has been received`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a5568;">Ad Request Confirmation</h2>
        <p>Hello ${requesterName},</p>
        <p>Thank you for submitting your ${adType} ad request. We have received your submission and it is now in our queue for processing.</p>
        <p><strong>Request ID:</strong> ${requestId}</p>
        <p><strong>Request Type:</strong> ${adType}</p>
        <p>Our team will review your request and you will be notified of any updates or if additional information is required.</p>
        <p>You can reference your Request ID in any future communications about this request.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    
    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

/**
 * Send status update email to requester
 * @param {Object} requestData - The request data with updated status
 * @returns {Promise} - Promise with mail info
 */
const sendStatusUpdateEmail = async (requestData) => {
  const transport = initTransporter();
  
  const { requesterName, requesterEmail, adType, requestId, status } = requestData;
  
  // Map status to user-friendly message
  const statusMessages = {
    'pending': 'is pending review',
    'in-review': 'is now being reviewed by our team',
    'approved': 'has been approved',
    'rejected': 'could not be approved at this time',
    'completed': 'has been completed'
  };
  
  const statusMessage = statusMessages[status] || 'has been updated';
  
  const mailOptions = {
    from: `"AdAmara System" <${process.env.EMAIL_FROM || 'noreply@adamara.example.com'}>`,
    to: requesterEmail,
    subject: `Update on Your Ad Request #${requestId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a5568;">Ad Request Status Update</h2>
        <p>Hello ${requesterName},</p>
        <p>Your ${adType} ad request (ID: ${requestId}) ${statusMessage}.</p>
        
        ${status === 'completed' ? `
        <p>You can view or download the completed materials from the link provided by your account manager.</p>
        ` : ''}
        
        ${status === 'rejected' ? `
        <p>Please contact your account manager for more details about why your request was not approved and how you might be able to revise it.</p>
        ` : ''}
        
        <p>If you have any questions, please reply to your account manager or contact our support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Status update email sent:', info.messageId);
    
    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail,
  sendStatusUpdateEmail
};