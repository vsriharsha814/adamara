const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Request Schema
const RequestSchema = new Schema({
  // Requester Information
  requesterName: {
    type: String,
    required: [true, 'Requester name is required']
  },
  requesterEmail: {
    type: String,
    required: [true, 'Requester email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  requesterDepartment: {
    type: String,
    required: [true, 'Department is required']
  },
  requesterPhone: {
    type: String
  },
  
  // Ad Details
  adType: {
    type: String,
    required: [true, 'Ad type is required'],
    enum: ['print', 'digital', 'social', 'video', 'other']
  },
  adPurpose: {
    type: String,
    required: [true, 'Ad purpose is required']
  },
  targetAudience: {
    type: String
  },
  desiredPlacement: {
    type: String
  },
  budget: {
    type: Number
  },
  
  // Timeline
  requestDate: {
    type: Date,
    default: Date.now
  },
  desiredCompletionDate: {
    type: Date,
    required: [true, 'Completion date is required']
  },
  
  // Content Information
  adTitle: {
    type: String
  },
  adDescription: {
    type: String
  },
  specialInstructions: {
    type: String
  },
  
  // File Uploads
  files: [{
    originalName: String,
    fileName: String,
    fileType: String,
    fileSize: Number,
    fileURL: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin Fields
  status: {
    type: String,
    enum: ['pending', 'in-review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: [{
    note: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Virtual for request URL
RequestSchema.virtual('url').get(function() {
  return `/requests/${this._id}`;
});

// Index for faster queries
RequestSchema.index({ requestDate: -1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ requesterEmail: 1 });

module.exports = mongoose.model('Request', RequestSchema);