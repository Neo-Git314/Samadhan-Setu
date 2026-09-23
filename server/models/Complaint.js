import mongoose from 'mongoose';
import './User.js';
import './University.js';

const complaintSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitting user ID is required']
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      address: { type: String, default: '', trim: true }
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    // GeoJSON coordinate point for MongoDB 2dsphere spatial indexing
    geoPoint: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    mediaUrls: {
      type: [String],
      default: []
    },
    imageGps: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    locationVerification: {
      distanceKm: { type: Number, default: null },
      verified: { type: Boolean, default: null },
      status: {
        type: String,
        enum: ['verified', 'mismatch', 'gps_unavailable'],
        default: 'gps_unavailable'
      }
    },
    isPotentiallyFraudulent: {
      type: Boolean,
      default: false,
      index: true
    },
    category: {
      type: String,
      default: 'uncategorized',
      trim: true
    },
    categoryConfidence: {
      type: Number,
      default: 0
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'assigned', 'in_progress', 'resolved', 'duplicate'],
      default: 'pending'
    },
    needsReview: {
      type: Boolean,
      default: false
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null
    },
    embedding: {
      type: [Number],
      default: []
    },
    imageAnalysis: {
      caption: { type: String, default: '' },
      tags: { type: [String], default: [] },
      relevanceScore: { type: Number, default: 0 }
    },
    suggestedUniversities: [
      {
        universityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'University'
        },
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    assignedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: auto-populate geoPoint.coordinates = [location.lng, location.lat]
complaintSchema.pre('save', function (next) {
  if (
    this.location &&
    typeof this.location.lng === 'number' &&
    typeof this.location.lat === 'number' &&
    !isNaN(this.location.lng) &&
    !isNaN(this.location.lat)
  ) {
    this.geoPoint = {
      type: 'Point',
      coordinates: [this.location.lng, this.location.lat]
    };
  }
  if (typeof next === 'function') next();
});

// Indexes on specified query fields
complaintSchema.index({ geoPoint: '2dsphere' });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ district: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ submittedBy: 1 });
complaintSchema.index({ assignedUniversity: 1 });
complaintSchema.index({ duplicateOf: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
