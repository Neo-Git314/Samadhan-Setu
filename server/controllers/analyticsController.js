import Complaint from '../models/Complaint.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';
import Project from '../models/Project.js';

/**
 * GET /api/analytics/summary
 * Role: admin
 * Uses MongoDB aggregation pipelines to summarize complaints, breakdown arrays, and counts
 */
export const getSummary = async (_req, res, next) => {
  try {
    const [
      complaintsAgg,
      totalUniversities,
      totalIndustryPartners,
      totalProjectsCompleted,
      activeProjectsCount,
      validatedChallengesCount,
      routineFilteredCount,
      challengesUnderReviewCount,
      impactAggregation
    ] = await Promise.all([
      Complaint.aggregate([
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            byCategory: [
              { $group: { _id: '$category', count: { $sum: 1 } } },
              { $project: { _id: 0, category: '$_id', count: 1 } },
              { $sort: { count: -1 } }
            ],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } },
              { $project: { _id: 0, status: '$_id', count: 1 } },
              { $sort: { count: -1 } }
            ],
            byDistrict: [
              { $group: { _id: '$district', count: { $sum: 1 } } },
              { $project: { _id: 0, district: '$_id', count: 1 } },
              { $sort: { count: -1 } }
            ]
          }
        }
      ]),
      University.countDocuments(),
      IndustryPartner.countDocuments(),
      Project.countDocuments({ status: 'completed' }),
      Project.countDocuments({ status: { $in: ['proposed', 'approved', 'in_progress', 'testing'] } }),
      Complaint.countDocuments({
        $or: [
          { screeningClassification: 'validated_societal_challenge' },
          { status: { $in: ['reviewed', 'assigned', 'in_progress', 'resolved'] } }
        ]
      }),
      Complaint.countDocuments({ screeningClassification: 'routine_service_issue' }),
      Complaint.countDocuments({
        $or: [
          { needsReview: true },
          { screeningClassification: 'needs_expert_review' },
          { status: 'pending' }
        ]
      }),
      // Aggregate community impact (e.g. estimated population footprint based on prioritization scores)
      Complaint.aggregate([
        {
          $group: {
            _id: null,
            totalPrioritizationScore: { $sum: { $ifNull: ['$prioritizationScore', 50] } },
            avgPrioritizationScore: { $avg: { $ifNull: ['$prioritizationScore', 50] } }
          }
        }
      ])
    ]);

    const facetResult = complaintsAgg[0] || {};
    const totalComplaints = facetResult.totalCount?.[0]?.count || 0;
    const byCategory = facetResult.byCategory || [];
    const byStatus = facetResult.byStatus || [];
    const byDistrict = facetResult.byDistrict || [];

    const totalPrioritization = impactAggregation[0]?.totalPrioritizationScore || 0;
    // Estimated community beneficiaries based on challenge volume & prioritization weight
    const estimatedBeneficiaries = totalPrioritization > 0 ? Math.round(totalPrioritization * 45) : totalComplaints * 320;

    return res.status(200).json({
      totalComplaints,
      byCategory,
      byStatus,
      byDistrict,
      totalUniversitiesParticipating: totalUniversities,
      totalIndustryPartnersEngaged: totalIndustryPartners,
      totalProjectsCompleted,
      activeProjectsCount,
      validatedChallengesCount,
      routineFilteredCount,
      challengesUnderReviewCount,
      estimatedBeneficiaries
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/public-summary
 * Public - No auth required
 * Sanitized counts for the public portal landing page
 */
export const getPublicSummary = async (_req, res, next) => {
  try {
    const [complaintsCount, resolvedCount, inProgressCount, universitiesCount, industryCount, projectsCount] =
      await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: 'resolved' }),
        Complaint.countDocuments({ status: { $in: ['assigned', 'in_progress'] } }),
        University.countDocuments(),
        IndustryPartner.countDocuments(),
        Project.countDocuments()
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totalGrievances: complaintsCount,
        resolvedGrievances: resolvedCount,
        inProgressGrievances: inProgressCount,
        participatingUniversities: universitiesCount,
        collaboratingIndustries: industryCount,
        activeProjects: projectsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/trends
 * Role: admin
 * Aggregates daily complaint counts for the last 30 days
 */
export const getTrends = async (_req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return res.status(200).json(trends);
  } catch (error) {
    next(error);
  }
};

/**
 * Haversine formula for analytics clustering (distance in km)
 */
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * GET /api/analytics/hotspots
 * Task 7.1 Smart-Cluster Hotspot Engine
 * Queries complaints within the last 30 days and clusters within 2.0 km radius.
 * Any cluster with > 10 complaints is flagged as "Critical Hotspot".
 */
export const getHotspots = async (_req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const complaints = await Complaint.find({
      createdAt: { $gte: thirtyDaysAgo },
      'location.lat': { $ne: null },
      'location.lng': { $ne: null }
    }).select('_id title category urgency district location createdAt');

    const validComplaints = complaints.filter(
      (c) =>
        typeof c.location?.lat === 'number' &&
        typeof c.location?.lng === 'number' &&
        !isNaN(c.location.lat) &&
        !isNaN(c.location.lng)
    );

    const radiusKm = 2.0;
    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < validComplaints.length; i++) {
      const rootId = validComplaints[i]._id.toString();
      if (visited.has(rootId)) continue;

      const clusterComplaints = [validComplaints[i]];
      visited.add(rootId);

      for (let j = 0; j < validComplaints.length; j++) {
        if (i === j) continue;
        const targetId = validComplaints[j]._id.toString();
        if (visited.has(targetId)) continue;

        const dist = haversineKm(
          validComplaints[i].location.lat,
          validComplaints[i].location.lng,
          validComplaints[j].location.lat,
          validComplaints[j].location.lng
        );

        if (dist <= radiusKm) {
          visited.add(targetId);
          clusterComplaints.push(validComplaints[j]);
        }
      }

      // Calculate cluster centroid
      const totalLat = clusterComplaints.reduce((sum, c) => sum + c.location.lat, 0);
      const totalLng = clusterComplaints.reduce((sum, c) => sum + c.location.lng, 0);
      const center = {
        lat: Number((totalLat / clusterComplaints.length).toFixed(6)),
        lng: Number((totalLng / clusterComplaints.length).toFixed(6))
      };

      // Aggregate categories and districts
      const categoryCounts = {};
      const districtsSet = new Set();
      clusterComplaints.forEach((c) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        if (c.district) districtsSet.add(c.district);
      });

      const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);

      const count = clusterComplaints.length;
      const isCritical = count > 10;

      clusters.push({
        center,
        complaintCount: count,
        radiusKm,
        periodDays: 30,
        severity: isCritical ? 'critical' : count >= 4 ? 'moderate' : 'low',
        label: isCritical ? 'Critical Hotspot' : count >= 4 ? 'Emerging Hotspot' : 'Complaint Cluster',
        topCategories,
        districts: Array.from(districtsSet),
        complaintIds: clusterComplaints.map((c) => c._id),
        recentComplaints: clusterComplaints.slice(0, 5).map((c) => ({
          _id: c._id,
          title: c.title,
          category: c.category,
          district: c.district,
          urgency: c.urgency
        }))
      });
    }

    clusters.sort((a, b) => b.complaintCount - a.complaintCount);

    return res.status(200).json({
      success: true,
      totalHotspots: clusters.length,
      criticalHotspotsCount: clusters.filter((c) => c.severity === 'critical').length,
      radiusKm,
      periodDays: 30,
      hotspots: clusters
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSummary,
  getTrends,
  getHotspots
};
