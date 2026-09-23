import mongoose from 'mongoose';
import './Complaint.js';
import './University.js';
import './IndustryPartner.js';

const projectSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true
    },
    industryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustryPartner',
      default: null
    },
    team: [
      {
        name: { type: String, trim: true },
        role: {
          type: String,
          enum: ['student', 'faculty_mentor'],
          default: 'student'
        }
      }
    ],
    status: {
      type: String,
      enum: ['proposed', 'approved', 'in_progress', 'testing', 'completed'],
      default: 'proposed'
    },
    milestones: [
      {
        title: { type: String, required: true, trim: true },
        dueDate: { type: Date, default: null },
        status: {
          type: String,
          enum: ['pending', 'done'],
          default: 'pending'
        },
        completedAt: { type: Date, default: null }
      }
    ],
    proposalDoc: {
      type: String,
      default: ''
    },
    reputationAwarded: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes on query fields
projectSchema.index({ complaintId: 1 });
projectSchema.index({ universityId: 1 });
projectSchema.index({ industryPartnerId: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
