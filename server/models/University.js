import mongoose from 'mongoose';
import './User.js';

const universitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    name: {
      type: String,
      required: [true, 'University name is required'],
      trim: true
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    disciplines: {
      type: [String],
      default: []
    },
    researchKeywords: {
      type: [String],
      default: []
    },
    researchEmbedding: {
      type: [Number],
      default: []
    },
    incubationFacility: {
      type: Boolean,
      default: false
    },
    contactEmail: {
      type: String,
      default: '',
      trim: true
    },
    reputationScore: {
      type: Number,
      default: 0,
      index: true
    },
    completedProjectsCount: {
      type: Number,
      default: 0
    },
    activeProjectsCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes on name, disciplines, and reputationScore
universitySchema.index({ name: 1 });
universitySchema.index({ disciplines: 1 });
universitySchema.index({ reputationScore: -1 });

const University = mongoose.model('University', universitySchema);

export default University;
