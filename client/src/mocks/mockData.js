// ============================================================
// MOCK DATA CONTRACT — Societal Innovation Collaboration Portal
// ============================================================
// Purpose: Frontend team builds against these shapes while backend
// tasks (2-11) are in progress. Field names/types match the PRD exactly.
// Once a real endpoint is live, swap the mock import for the real
// axios call — the shape should already match, so the diff stays small.
//
// Usage in a component (before backend is ready):
//   import { mockComplaints } from '../mocks/mockData';
//   const { data } = { data: mockComplaints }; // instead of useQuery(...)
//
// Once backend Task 3 is live, swap to:
//   const { data } = useQuery(['complaints'], () => api.get('/complaints'));
// ============================================================

// ---------- USER (Task 2) ----------
export const mockUsers = [
  {
    _id: "u1001",
    name: "Ravi Kumar",
    email: "ravi.citizen@example.com",
    role: "citizen", // citizen | university | industry | admin
    phone: "+91-9876543210",
    organization: "",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    _id: "u1002",
    name: "Dr. Anita Sharma",
    email: "anita@bitmesra.ac.in",
    role: "university",
    phone: "+91-9123456780",
    organization: "Birla Institute of Technology, Mesra",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    _id: "u1003",
    name: "Suresh Singh",
    email: "suresh@ecosolve.in",
    role: "industry",
    phone: "+91-9988776655",
    organization: "EcoSolve Technologies Pvt Ltd",
    createdAt: "2026-01-12T11:30:00.000Z",
  },
  {
    _id: "u1004",
    name: "Admin User",
    email: "admin@platform.gov.in",
    role: "admin",
    phone: "+91-9000000000",
    organization: "Dept of Higher Education, Jharkhand",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// Shape returned by POST /api/auth/login and /api/auth/register
export const mockAuthResponse = {
  token: "mock.jwt.token.eyJhbGciOiJIUzI1NiJ9",
  user: {
    id: "u1001",
    name: "Ravi Kumar",
    email: "ravi.citizen@example.com",
    role: "citizen",
  },
};

// ---------- CHALLENGES / COMPLAINTS (Task 3, enriched by Task 6/7/8 & SIH 26043) ----------
export const mockComplaints = [
  {
    _id: "c2001",
    submittedBy: "u1001",
    title: "Groundwater Arsenic & Heavy Metal Contamination across 12 Village Habitations",
    description:
      "Deep aquifers in Kanke rural cluster exhibit severe arsenic and fluoride concentrations exceeding WHO safe limits, causing widespread fluorosis. Community requires low-cost, decentralized filtration and IoT water table monitoring.",
    location: { lat: 23.4241, lng: 85.4298, address: "Kanke Block, Ranchi, Jharkhand" },
    district: "Ranchi",
    mediaUrls: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60",
    ],
    category: "water_resources",
    categoryConfidence: 0.96,
    urgency: "high",
    status: "assigned", // pending | reviewed | assigned | in_progress | resolved | duplicate
    needsReview: false,
    duplicateOf: null,
    screeningClassification: "validated_societal_challenge",
    screeningConfidence: 0.94,
    screeningReason: "Systemic multi-village environmental health crisis requiring chemical filtration membrane research and IoT telemetry.",
    innovationPotential: "high",
    researchDomain: "Water & Environmental Engineering",
    prioritizationScore: 92,
    citizenGuidance: "",
    embedding: [],
    imageAnalysis: {
      caption: "Turbid water testing sample with heavy mineral sediment",
      tags: ["arsenic", "water_quality", "rural_health"],
      relevanceScore: 0.91,
    },
    suggestedUniversities: [
      { universityId: "uni501", score: 0.92 },
      { universityId: "uni502", score: 0.84 },
    ],
    assignedUniversity: "uni501",
    createdAt: "2026-02-01T08:15:00.000Z",
    updatedAt: "2026-02-03T14:20:00.000Z",
  },
  {
    _id: "c2002",
    submittedBy: "u1001",
    title: "Zero-Electricity Evaporative Cold Storage for Tribal Millet & Minor Forest Produce",
    description:
      "Local tribal agrarian self-help groups face 35% post-harvest spoilage of minor forest produce and lac due to lack of off-grid cold preservation. Urgent need for passive biomass/solar-assisted thermal micro-storage.",
    location: { lat: 23.3629, lng: 85.3372, address: "Tamar Sub-division, Ranchi, Jharkhand" },
    district: "Ranchi",
    mediaUrls: [],
    category: "agriculture",
    categoryConfidence: 0.88,
    urgency: "high",
    status: "reviewed",
    needsReview: false,
    duplicateOf: null,
    screeningClassification: "validated_societal_challenge",
    screeningConfidence: 0.91,
    screeningReason: "Interdisciplinary post-harvest thermal engineering problem with high socio-economic value for rural cooperatives.",
    innovationPotential: "high",
    researchDomain: "Agritech & Post-Harvest Systems",
    prioritizationScore: 88,
    citizenGuidance: "",
    embedding: [],
    imageAnalysis: { caption: "", tags: [], relevanceScore: 0 },
    suggestedUniversities: [
      { universityId: "uni502", score: 0.89 },
      { universityId: "uni501", score: 0.79 },
    ],
    assignedUniversity: null,
    createdAt: "2026-02-05T12:00:00.000Z",
    updatedAt: "2026-02-05T12:00:00.000Z",
  },
  {
    _id: "c2003",
    submittedBy: "u1001",
    title: "Single Fused Sodium Vapor Streetlight on Main Lane 4",
    description: "One streetlight bulb outside house #24 is fused and needs routine bulb replacement by municipal line workers.",
    location: { lat: 23.3720, lng: 85.3210, address: "Lalpur Lane 4, Ranchi, Jharkhand" },
    district: "Ranchi",
    mediaUrls: [],
    category: "energy",
    categoryConfidence: 0.85,
    urgency: "low",
    status: "pending",
    needsReview: false,
    duplicateOf: null,
    screeningClassification: "routine_service_issue",
    screeningConfidence: 0.89,
    screeningReason: "Localized component replacement with no research or R&D innovation scope.",
    innovationPotential: "none",
    researchDomain: "Municipal Operations",
    prioritizationScore: 20,
    citizenGuidance: "This item is not suitable for the societal innovation challenge pipeline. For localized civic repairs, please register a ticket with your local municipal corporation or district grievance desk.",
    embedding: [],
    imageAnalysis: { caption: "", tags: [], relevanceScore: 0 },
    suggestedUniversities: [],
    assignedUniversity: null,
    createdAt: "2026-02-06T09:00:00.000Z",
    updatedAt: "2026-02-06T09:05:00.000Z",
  },
];

// ---------- UNIVERSITY (Task 8) ----------
export const mockUniversities = [
  {
    _id: "uni501",
    userId: "u1002",
    name: "Birla Institute of Technology, Mesra",
    location: { lat: 23.4152, lng: 85.4483 },
    disciplines: ["water_resources", "environment", "urban_development"],
    researchKeywords: ["rural water systems", "sustainable infrastructure", "IoT sensors"],
    incubationFacility: true,
    contactEmail: "incubation@bitmesra.ac.in",
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    _id: "uni502",
    userId: "u1005",
    name: "National Institute of Technology, Jamshedpur",
    location: { lat: 22.7925, lng: 86.1842 },
    disciplines: ["energy", "water_resources", "agriculture"],
    researchKeywords: ["renewable energy", "groundwater management", "precision farming"],
    incubationFacility: true,
    contactEmail: "twc@nitjsr.ac.in",
    createdAt: "2026-01-06T00:00:00.000Z",
  },
];

// ---------- INDUSTRY PARTNER (Task 10) ----------
export const mockIndustryPartners = [
  {
    _id: "ind701",
    userId: "u1003",
    name: "EcoSolve Technologies Pvt Ltd",
    type: "startup", // startup | MSME | CSR | research_lab
    sectorFocus: ["water_resources", "environment"],
    contactEmail: "partnerships@ecosolve.in",
    createdAt: "2026-01-08T00:00:00.000Z",
  },
];

// ---------- PROJECT (Task 9) ----------
export const mockProjects = [
  {
    _id: "p3001",
    complaintId: "c2001",
    universityId: "uni501",
    team: [
      { name: "Priya Verma", role: "student" },
      { name: "Dr. Anita Sharma", role: "faculty_mentor" },
    ],
    industryPartnerId: "ind701",
    status: "in_progress", // proposed | approved | in_progress | testing | completed
    milestones: [
      { _id: "m1", title: "Site survey & diagnosis", dueDate: "2026-02-10T00:00:00.000Z", status: "done" },
      { _id: "m2", title: "Prototype repair kit design", dueDate: "2026-02-20T00:00:00.000Z", status: "pending" },
      { _id: "m3", title: "Field deployment & testing", dueDate: "2026-03-01T00:00:00.000Z", status: "pending" },
    ],
    proposalDoc: "https://res.cloudinary.com/demo/raw/upload/v1/proposal_p3001.pdf",
    createdAt: "2026-02-04T10:00:00.000Z",
    updatedAt: "2026-02-08T16:00:00.000Z",
  },
];

// ---------- NOTIFICATION (Task 13) ----------
export const mockNotifications = [
  {
    _id: "n4001",
    userId: "u1001",
    message: "Your complaint appears similar to an existing one",
    type: "duplicate_detected",
    read: false,
    relatedId: "c2001",
    createdAt: "2026-02-06T09:05:00.000Z",
  },
  {
    _id: "n4002",
    userId: "u1001",
    message: "Your complaint has been assigned to a university",
    type: "status_change",
    read: true,
    relatedId: "c2001",
    createdAt: "2026-02-03T14:20:00.000Z",
  },
  {
    _id: "n4003",
    userId: "u1003",
    message: "You've been invited to a project",
    type: "industry_invite",
    read: false,
    relatedId: "p3001",
    createdAt: "2026-02-04T10:05:00.000Z",
  },
];

// ---------- ANALYTICS (Task 11) ----------
export const mockAnalyticsSummary = {
  totalComplaints: 148,
  byCategory: [
    { category: "water_resources", count: 34 },
    { category: "education", count: 22 },
    { category: "environment", count: 19 },
    { category: "healthcare", count: 17 },
    { category: "agriculture", count: 15 },
    { category: "urban_development", count: 14 },
    { category: "energy", count: 10 },
    { category: "accessibility", count: 8 },
    { category: "public_administration", count: 6 },
    { category: "rural_livelihoods", count: 3 },
  ],
  byStatus: [
    { status: "pending", count: 41 },
    { status: "reviewed", count: 22 },
    { status: "assigned", count: 30 },
    { status: "in_progress", count: 25 },
    { status: "resolved", count: 24 },
    { status: "duplicate", count: 6 },
  ],
  byDistrict: [
    { district: "Ranchi", count: 52 },
    { district: "Jamshedpur", count: 38 },
    { district: "Dhanbad", count: 27 },
    { district: "Bokaro", count: 18 },
    { district: "Hazaribagh", count: 13 },
  ],
  totalUniversitiesParticipating: 6,
  totalIndustryPartnersEngaged: 4,
  totalProjectsCompleted: 9,
};

export const mockAnalyticsTrends = [
  { date: "2026-01-30", count: 3 },
  { date: "2026-01-31", count: 5 },
  { date: "2026-02-01", count: 8 },
  { date: "2026-02-02", count: 4 },
  { date: "2026-02-03", count: 6 },
  { date: "2026-02-04", count: 9 },
  { date: "2026-02-05", count: 7 },
  { date: "2026-02-06", count: 5 },
  // ... extend to 30 days as needed for the trends chart
];

// ---------- STATUS BADGE COLOR MAP ----------
// Shared reference so all 3 frontend devs use the same badge colors
export const statusColorMap = {
  pending: "bg-gray-200 text-gray-800",
  reviewed: "bg-blue-100 text-blue-800",
  assigned: "bg-purple-100 text-purple-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  duplicate: "bg-red-100 text-red-800",
};

export const urgencyColorMap = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};
