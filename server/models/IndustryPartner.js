import mongoose from 'mongoose';
import './User.js';

const industryPartnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Industry partner name is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['startup', 'MSME', 'CSR', 'research_lab'],
      default: 'startup'
    },
    sectorFocus: {
      type: [String],
      default: []
    },
    contactEmail: {
      type: String,
      default: '',
      trim: true
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

industryPartnerSchema.index({ userId: 1 });
industryPartnerSchema.index({ name: 1 });

const IndustryPartner = mongoose.model('IndustryPartner', industryPartnerSchema);

export default IndustryPartner;
