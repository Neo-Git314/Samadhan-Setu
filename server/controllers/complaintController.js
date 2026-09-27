import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import { uploadBuffer } from '../services/cloudinaryService.js';
import { classifyComplaint, analyzeImage, getEmbedding, screenSocietalChallenge } from '../services/aiService.js';
import { checkDuplicates } from '../services/dedupService.js';
import { matchUniversities } from '../services/matchingService.js';
import { verifyComplaintLocation } from '../services/fraudService.js';
import { generateAcknowledgementPDF } from '../services/pdfService.js';

/**
 * Asynchronously processes AI classification, image vision analysis,
 * societal challenge screening, embedding generation, deduplication, and university matching.
 * Never blocks the main HTTP response.
 * @param {string|mongoose.Types.ObjectId} complaintId
 */
export const runAiPipeline = async (complaintId) => {
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return;

    const fullText = `${complaint.title}. ${complaint.description}`;

    // 1. Classification
    try {
      const classification = await classifyComplaint(fullText);
      if (classification && classification.category !== 'uncategorized') {
        complaint.category = classification.category;
        complaint.categoryConfidence = classification.confidence;
        if (classification.urgency) complaint.urgency = classification.urgency;
        if (classification.confidence < 0.6) {
          complaint.needsReview = true;
        }
      }
    } catch (err) {
      console.error(`[runAiPipeline] Classification error for ${complaintId}:`, err.message);
    }

    // 2. Vision analysis for first media image
    if (Array.isArray(complaint.mediaUrls) && complaint.mediaUrls.length > 0) {
      try {
        const analysis = await analyzeImage(complaint.mediaUrls[0], complaint.description);
        if (analysis && (analysis.caption || analysis.relevanceScore > 0)) {
          complaint.imageAnalysis = analysis;
          if (analysis.relevanceScore < 0.4) {
            complaint.needsReview = true;
          }
        }
      } catch (err) {
        console.error(`[runAiPipeline] Image analysis error for ${complaintId}:`, err.message);
      }
    }

    // 3. Societal Challenge Screening (SIH 26043)
    let screeningResult = null;
    try {
      screeningResult = await screenSocietalChallenge({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
        imageCaption: complaint.imageAnalysis?.caption || ''
      });

      if (screeningResult) {
        complaint.screeningClassification = screeningResult.classification;
        complaint.screeningConfidence = screeningResult.confidence;
        complaint.screeningReason = screeningResult.reason;
        complaint.innovationPotential = screeningResult.innovationPotential;
        complaint.researchDomain = screeningResult.researchDomain;
        complaint.prioritizationScore = screeningResult.prioritizationScore;
        complaint.citizenGuidance = screeningResult.citizenGuidance;

        if (screeningResult.classification === 'validated_societal_challenge') {
          complaint.status = 'reviewed';
        } else if (screeningResult.classification === 'needs_expert_review') {
          complaint.needsReview = true;
        }
      }
    } catch (err) {
      console.error(`[runAiPipeline] Challenge screening error for ${complaintId}:`, err.message);
    }

    // 4. Text embedding generation
    try {
      const embedding = await getEmbedding(fullText);
      if (Array.isArray(embedding) && embedding.length > 0) {
        complaint.embedding = embedding;
      }
    } catch (err) {
      console.error(`[runAiPipeline] Embedding error for ${complaintId}:`, err.message);
    }

    // 5. Save progress
    await complaint.save();

    // 6. Deduplication check (Atlas Vector Cosine > 0.85 + Haversine <= 5km)
    let isDuplicate = false;
    try {
      const dedupResult = await checkDuplicates(complaint._id);
      isDuplicate = Boolean(dedupResult.isDuplicate);
    } catch (err) {
      console.error(`[runAiPipeline] Deduplication error for ${complaintId}:`, err.message);
    }

    // 7. University Matching (Only for validated societal challenges, not routine or duplicate)
    const isRoutine = complaint.screeningClassification === 'routine_service_issue';
    if (!isDuplicate && complaint.status !== 'duplicate' && !isRoutine) {
      try {
        await matchUniversities(complaint._id);
      } catch (err) {
        console.error(`[runAiPipeline] University matching error for ${complaintId}:`, err.message);
      }
    }
  } catch (error) {
    console.error(`[runAiPipeline] General error for ${complaintId}:`, error.message);
  }
};

/**
 * Helper to safely parse location from body
 */
const parseLocation = (rawLocation, body) => {
  let locationObj = { lat: null, lng: null, address: '' };

  if (typeof rawLocation === 'string') {
    try {
      const parsed = JSON.parse(rawLocation);
      if (typeof parsed === 'object' && parsed !== null) {
        locationObj = {
          lat: parsed.lat !== undefined && parsed.lat !== null && !isNaN(Number(parsed.lat)) ? Number(parsed.lat) : null,
          lng: parsed.lng !== undefined && parsed.lng !== null && !isNaN(Number(parsed.lng)) ? Number(parsed.lng) : null,
          address: parsed.address ? String(parsed.address).trim() : ''
        };
        return locationObj;
      }
    } catch {
      locationObj.address = rawLocation.trim();
      return locationObj;
    }
  } else if (typeof rawLocation === 'object' && rawLocation !== null) {
    locationObj = {
      lat: rawLocation.lat !== undefined && rawLocation.lat !== null && !isNaN(Number(rawLocation.lat)) ? Number(rawLocation.lat) : null,
      lng: rawLocation.lng !== undefined && rawLocation.lng !== null && !isNaN(Number(rawLocation.lng)) ? Number(rawLocation.lng) : null,
      address: rawLocation.address ? String(rawLocation.address).trim() : ''
    };
    return locationObj;
  }

  if (body) {
    const latVal = body['location[lat]'] ?? body.lat;
    const lngVal = body['location[lng]'] ?? body.lng;
    const addrVal = body['location[address]'] ?? body.address;

    if (latVal !== undefined && latVal !== null && !isNaN(Number(latVal))) {
      locationObj.lat = Number(latVal);
    }
    if (lngVal !== undefined && lngVal !== null && !isNaN(Number(lngVal))) {
      locationObj.lng = Number(lngVal);
    }
    if (addrVal) {
      locationObj.address = String(addrVal).trim();
    }
  }

  return locationObj;
};

/**
 * POST /api/complaints
 * Role: citizen
 */
export const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      district,
      districtCode,
      state,
      stateCode,
      city,
      cityCode,
      pincode,
      category,
      urgency
    } = req.body;

    if (!title || !description || !district) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and district are required fields.'
      });
    }

    const parsedLocation = parseLocation(req.body.location, req.body);

    const acknowledgementNumber =
      req.body.acknowledgementNumber ||
      `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const mediaUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadedUrl = await uploadBuffer(file.buffer, 'samadhan_setu/complaints');
          if (uploadedUrl) {
            mediaUrls.push(uploadedUrl);
          }
        } catch (uploadErr) {
          console.error('[createComplaint] Cloudinary upload error:', uploadErr.message);
          return res.status(500).json({
            success: false,
            message: `Failed to upload image: ${uploadErr.message}`
          });
        }
      }
    }

    if (req.body.mediaUrls) {
      if (Array.isArray(req.body.mediaUrls)) {
        mediaUrls.push(...req.body.mediaUrls);
      } else if (typeof req.body.mediaUrls === 'string') {
        try {
          const parsedUrls = JSON.parse(req.body.mediaUrls);
          if (Array.isArray(parsedUrls)) mediaUrls.push(...parsedUrls);
          else mediaUrls.push(req.body.mediaUrls);
        } catch {
          mediaUrls.push(req.body.mediaUrls);
        }
      }
    }

    // Perform EXIF location verification on uploaded image buffers (Task 5.1)
    const fileBuffers = req.files && Array.isArray(req.files) ? req.files.map((f) => f.buffer) : [];
    const fraudCheck = verifyComplaintLocation(fileBuffers, parsedLocation);

    // Save initial document with status "pending"
    const complaint = await Complaint.create({
      submittedBy: req.user.id,
      title: title.trim(),
      description: description.trim(),
      district: district.trim(),
      districtCode: districtCode ? districtCode.trim() : '',
      state: state ? state.trim() : '',
      stateCode: stateCode ? stateCode.trim() : '',
      city: city ? city.trim() : '',
      cityCode: cityCode ? cityCode.trim() : '',
      pincode: pincode ? pincode.trim() : '',
      acknowledgementNumber,
      location: parsedLocation,
      mediaUrls,
      imageGps: fraudCheck.imageGps,
      locationVerification: fraudCheck.locationVerification,
      isPotentiallyFraudulent: fraudCheck.isPotentiallyFraudulent,
      category: category ? category.trim() : 'uncategorized',
      urgency: ['low', 'medium', 'high'].includes(urgency) ? urgency : 'medium',
      status: 'pending'
    });

    const complaintObj = complaint.toObject();

    // Trigger AI pipeline in the background asynchronously (non-blocking)
    setImmediate(() => {
      runAiPipeline(complaint._id).catch((err) =>
        console.error('[AI Pipeline Background Error]:', err.message)
      );
    });

    // Return created complaint with HTTP 201 immediately
    return res.status(201).json({
      success: true,
      complaintId: complaint._id,
      ...complaintObj,
      complaint: complaintObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/complaints/my and GET /api/grievances/my
 * Role: citizen (or any authenticated user requesting their own filings)
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const filter = { submittedBy: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.district) {
      filter.district = req.query.district;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('submittedBy', 'name email role phone organization')
        .populate('assignedUniversity', 'name location contactEmail')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Page', page);
    res.setHeader('X-Total-Pages', totalPages);

    return res.status(200).json({
      success: true,
      complaints,
      data: complaints,
      total,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/complaints
 */
export const getComplaints = async (req, res, next) => {
  try {
    const filter = {};

    // Citizens can ONLY EVER query their own complaints (Privacy & Data Isolation)
    if (req.user?.role === 'citizen') {
      filter.submittedBy = req.user.id;
    } else {
      const isOwnerQuery = req.query.submittedBy === 'me';

      if (!isOwnerQuery) {
        const allowedRoles = ['admin', 'university'];
        if (!req.user || !allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Current role: '${req.user?.role}'.`
          });
        }
      }

      if (isOwnerQuery) {
        filter.submittedBy = req.user.id;
      } else if (req.query.submittedBy) {
        if (mongoose.Types.ObjectId.isValid(req.query.submittedBy)) {
          filter.submittedBy = req.query.submittedBy;
        }
      }
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.district) {
      filter.district = req.query.district;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('submittedBy', 'name email role phone organization')
        .populate('assignedUniversity', 'name location contactEmail')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Page', page);
    res.setHeader('X-Total-Pages', totalPages);

    return res.status(200).json({
      success: true,
      complaints,
      data: complaints,
      total,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/complaints/:id
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { acknowledgementNumber: id }] };
    } else {
      query = { acknowledgementNumber: id };
    }

    const complaint = await Complaint.findOne(query)
      .populate('submittedBy', 'name email role phone organization')
      .populate('assignedUniversity', 'name location contactEmail')
      .populate('duplicateOf', 'title status');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    // Privacy & Data Isolation Rule: A citizen user can ONLY view their own grievance
    if (req.user?.role === 'citizen') {
      const ownerId = complaint.submittedBy?._id
        ? complaint.submittedBy._id.toString()
        : complaint.submittedBy
        ? complaint.submittedBy.toString()
        : null;

      if (!ownerId || ownerId !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You are only authorized to view grievances that you registered.'
        });
      }
    }

    const complaintObj = complaint.toObject();

    return res.status(200).json({
      ...complaintObj,
      complaint: complaintObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/complaints/:id/duplicates
 * Returns all complaints where duplicateOf == id plus its own duplicateOf parent
 */
export const getComplaintDuplicates = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID format.'
      });
    }

    const complaint = await Complaint.findById(id).populate('duplicateOf', 'title status createdAt');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    const duplicates = await Complaint.find({ duplicateOf: id })
      .populate('submittedBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      complaintId: id,
      duplicateOf: complaint.duplicateOf,
      duplicates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/complaints/:id/status
 * Role: admin
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID format.'
      });
    }

    const validStatuses = ['pending', 'reviewed', 'assigned', 'in_progress', 'resolved', 'duplicate'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: '${status}'. Allowed statuses are: ${validStatuses.join(', ')}`
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    complaint.status = status;
    await complaint.save();

    // Notify citizen if assigned or resolved (Phase 4)
    if (complaint.submittedBy && (status === 'assigned' || status === 'resolved')) {
      const msg =
        status === 'assigned'
          ? 'Your civic complaint has been assigned to a participating university team.'
          : 'Your civic complaint has been successfully resolved!';
      try {
        await Notification.create({
          userId: complaint.submittedBy,
          message: msg,
          type: 'status_change',
          relatedId: complaint._id
        });
      } catch (notifErr) {
        console.warn('[updateComplaintStatus] Notification error:', notifErr.message);
      }
    }

    const complaintObj = complaint.toObject();

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to '${status}'.`,
      ...complaintObj,
      complaint: complaintObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/complaints/:id/triage
 * Role: admin
 * Allows admin to manually triage/validate screening outcome
 */
export const triageChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { screeningClassification, screeningReason, citizenGuidance, innovationPotential, researchDomain, prioritizationScore } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge ID format.'
      });
    }

    const validClassifications = ['validated_societal_challenge', 'routine_service_issue', 'needs_expert_review'];
    if (!screeningClassification || !validClassifications.includes(screeningClassification)) {
      return res.status(400).json({
        success: false,
        message: `Invalid classification: '${screeningClassification}'. Allowed: ${validClassifications.join(', ')}`
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found.'
      });
    }

    complaint.screeningClassification = screeningClassification;
    if (screeningReason !== undefined) complaint.screeningReason = screeningReason;
    if (citizenGuidance !== undefined) complaint.citizenGuidance = citizenGuidance;
    if (innovationPotential !== undefined) complaint.innovationPotential = innovationPotential;
    if (researchDomain !== undefined) complaint.researchDomain = researchDomain;
    if (typeof prioritizationScore === 'number') complaint.prioritizationScore = prioritizationScore;

    if (screeningClassification === 'validated_societal_challenge') {
      complaint.status = 'reviewed';
      complaint.needsReview = false;
      // Trigger university matching if not already matched
      if (!complaint.suggestedUniversities || complaint.suggestedUniversities.length === 0) {
        try {
          await matchUniversities(complaint._id);
        } catch (matchErr) {
          console.warn('[triageChallenge] University matching warning:', matchErr.message);
        }
      }
    } else if (screeningClassification === 'routine_service_issue') {
      complaint.needsReview = false;
      if (!complaint.citizenGuidance) {
        complaint.citizenGuidance = 'This issue has been reviewed and marked as routine municipal maintenance. Please report to local municipal or district grievance redressal portals.';
      }
    }

    await complaint.save();

    const complaintObj = complaint.toObject();

    return res.status(200).json({
      success: true,
      message: `Challenge triaged successfully as '${screeningClassification}'.`,
      ...complaintObj,
      complaint: complaintObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/complaints/:id/pdf
 * Public/Citizen PDF download endpoint
 */
export const downloadComplaintPDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { acknowledgementNumber: id }] };
    } else {
      query = { acknowledgementNumber: id };
    }

    const complaint = await Complaint.findOne(query)
      .populate('submittedBy', 'name email role phone');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found.'
      });
    }

    const complaintObj = complaint.toObject();
    const ackNo = complaintObj.acknowledgementNumber || complaintObj._id;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Samadhan_Setu_Acknowledgement_${ackNo}.pdf`);

    generateAcknowledgementPDF(complaintObj, res);
  } catch (error) {
    next(error);
  }
};

export default {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  getComplaintDuplicates,
  updateComplaintStatus,
  triageChallenge,
  downloadComplaintPDF,
  runAiPipeline
};
