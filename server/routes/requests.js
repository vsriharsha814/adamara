const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth');
const {
  createRequest,
  getRequestById,
  updateRequest,
  listRequests
} = require('../db/requests');

// Set up multer for file uploads (temporary local storage, will be replaced with S3)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

// @route   POST api/requests
// @desc    Create a new ad request
// @access  Public
router.post(
  '/',
  upload.array('files', 5), // Allow up to 5 files
  [
    check('requesterName', 'Requester name is required').not().isEmpty(),
    check('requesterEmail', 'Please include a valid email').isEmail(),
    check('requesterDepartment', 'Department is required').not().isEmpty(),
    check('requesterPhone', 'Phone number is required').not().isEmpty(),
    check('adType', 'Ad type is required').isIn(['print', 'digital', 'social', 'video', 'other']),
    check('adPurpose', 'Ad purpose is required').not().isEmpty(),
    check('desiredCompletionDate', 'Completion date is required').not().isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Process uploaded files
      const files = req.files ? req.files.map(file => ({
        originalName: file.originalname,
        fileName: file.filename,
        fileType: file.mimetype,
        fileSize: file.size,
        fileURL: `/uploads/${file.filename}` // Will be replaced with S3 URL
      })) : [];

      // Create new request
      const payload = {
        requesterName: req.body.requesterName,
        requesterEmail: req.body.requesterEmail,
        requesterDepartment: req.body.requesterDepartment,
        requesterPhone: req.body.requesterPhone,
        
        adType: req.body.adType,
        adPurpose: req.body.adPurpose,
        targetAudience: req.body.targetAudience,
        desiredPlacement: req.body.desiredPlacement,
        budget: req.body.budget,
        
        desiredCompletionDate: new Date(req.body.desiredCompletionDate),
        
        adTitle: req.body.adTitle,
        adDescription: req.body.adDescription,
        specialInstructions: req.body.specialInstructions,
        
        files: files,
        status: 'pending'
      };

      // Save request to Firestore
      const savedRequest = await createRequest(payload);

      // TODO: Send confirmation email to requester

      res.status(201).json({
        success: true,
        requestId: savedRequest._id,
        message: 'Ad request submitted successfully!'
      });
    } catch (err) {
      console.error('Error submitting request:', err);
      res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
  }
);

// @route   GET api/requests
// @desc    Get all requests with filters and sorting
// @access  Private
router.get(
  '/',
  authenticate,
  async (req, res) => {
    try {
      // Set up pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Set up sorting
      const sortField = req.query.sortField || 'requestDate';
      const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

      const { items: requests, totalCount } = await listRequests({
        status: req.query.status,
        department: req.query.department,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        search: req.query.search,
        page,
        limit,
        sortField,
        sortOrder
      });
      
      res.json({
        success: true,
        count: requests.length,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        requests
      });
    } catch (err) {
      console.error('Error fetching requests:', err);
      res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
  }
);

// @route   GET api/requests/:id
// @desc    Get request by ID
// @access  Private
router.get(
  '/:id',
  authenticate,
  async (req, res) => {
    try {
      const request = await getRequestById(req.params.id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }
      
      res.json({
        success: true,
        request
      });
    } catch (err) {
      console.error('Error fetching request:', err);
      
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
  }
);

// @route   PUT api/requests/:id
// @desc    Update request status and add admin notes
// @access  Private
router.put(
  '/:id',
  authenticate,
  async (req, res) => {
    try {
      const request = await getRequestById(req.params.id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }
      
      const patch = {};

      // Update fields if provided
      if (req.body.status) patch.status = req.body.status;
      if (req.body.assignedTo) patch.assignedTo = req.body.assignedTo; // store userId

      // Add admin note if provided
      if (req.body.note) {
        patch.adminNotes = [
          ...(Array.isArray(request.adminNotes) ? request.adminNotes : []),
          { note: req.body.note, createdBy: req.user.id, createdAt: new Date() }
        ];
      }

      const updatedRequest = await updateRequest(req.params.id, patch);
      
      res.json({
        success: true,
        message: 'Request updated successfully',
        request: updatedRequest
      });
    } catch (err) {
      console.error('Error updating request:', err);
      
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
  }
);

// @route   GET api/requests/export
// @desc    Export requests as CSV
// @access  Private
router.get(
  '/export/csv',
  authenticate,
  async (req, res) => {
    try {
      const { items: requests } = await listRequests({
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        search: req.query.search,
        page: 1,
        limit: 100000, // effectively "all" for small datasets
        sortField: 'requestDate',
        sortOrder: 'desc'
      });
      
      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ad-requests-${Date.now()}.csv"`);
      
      // CSV header row
      let csv = 'ID,Requester Name,Email,Department,Ad Type,Status,Request Date,Completion Date\n';
      
      // Add data rows
      requests.forEach(request => {
        const requestDate = request.requestDate ? request.requestDate.toISOString() : '';
        const completionDate = request.desiredCompletionDate ? request.desiredCompletionDate.toISOString() : '';
        csv += `${request._id},${request.requesterName},${request.requesterEmail},${request.requesterDepartment},${request.adType},${request.status},${requestDate},${completionDate}\n`;
      });
      
      // Send CSV response
      res.send(csv);
    } catch (err) {
      console.error('Error exporting requests:', err);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
  }
);

module.exports = router;