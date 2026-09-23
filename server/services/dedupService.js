import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

/**
 * Computes cosine similarity between two numeric vectors.
 * Returns a value between -1.0 and 1.0 (or 0 if dimensions mismatch/empty).
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecB.length === 0) {
    return 0;
  }
  if (vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Computes great-circle distance between two geographic coordinates in kilometers (Haversine formula).
 */
export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 === null ||
    lat1 === undefined ||
    lon1 === null ||
    lon1 === undefined ||
    lat2 === null ||
    lat2 === undefined ||
    lon2 === null ||
    lon2 === undefined
  ) {
    return Infinity;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's mean radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Checks if a complaint is a duplicate of an existing complaint.
 * Condition: Cosine similarity > 0.85 AND Haversine distance <= 5.0 km
 * @param {string|mongoose.Types.ObjectId} complaintId
 * @returns {Promise<{ isDuplicate: boolean, matchedComplaintId?: mongoose.Types.ObjectId }>}
 */
export const checkDuplicates = async (complaintId) => {
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      console.warn(`[dedupService] Complaint not found: ${complaintId}`);
      return { isDuplicate: false };
    }

    const { embedding, location } = complaint;

    // We need both embedding and coordinates to evaluate similarity and distance
    if (!Array.isArray(embedding) || embedding.length === 0) {
      return { isDuplicate: false };
    }

    const lat1 = location?.lat;
    const lng1 = location?.lng;

    // Fetch all other complaints that are not duplicates themselves
    const candidates = await Complaint.find({
      _id: { $ne: complaint._id },
      status: { $ne: 'duplicate' }
    }).select('_id location embedding title status');

    for (const other of candidates) {
      if (!Array.isArray(other.embedding) || other.embedding.length === 0) {
        continue;
      }

      // Calculate embedding cosine similarity
      const similarity = cosineSimilarity(embedding, other.embedding);

      // Calculate distance if both have coordinates
      const lat2 = other.location?.lat;
      const lng2 = other.location?.lng;
      const distanceKm = haversineDistanceKm(lat1, lng1, lat2, lng2);

      // Criteria: similarity > 0.85 AND distance <= 5.0 km
      if (similarity > 0.85 && distanceKm <= 5.0) {
        console.log(
          `[dedupService] Duplicate detected! Complaint ${complaint._id} matches ${other._id} (Similarity: ${similarity.toFixed(
            3
          )}, Distance: ${distanceKm.toFixed(2)}km)`
        );

        complaint.status = 'duplicate';
        complaint.duplicateOf = other._id;
        await complaint.save();

        // Create notification for the citizen
        if (complaint.submittedBy) {
          await Notification.create({
            userId: complaint.submittedBy,
            message: 'Your complaint appears similar to an existing one',
            type: 'duplicate_detected',
            relatedId: other._id
          });
        }

        return {
          isDuplicate: true,
          matchedComplaintId: other._id
        };
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error(`[dedupService] Error checking duplicates for ${complaintId}:`, error.message);
    return { isDuplicate: false };
  }
};

export default {
  cosineSimilarity,
  haversineDistanceKm,
  checkDuplicates
};
