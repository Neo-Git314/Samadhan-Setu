// ============================================================
// SAMADHAN SETU — CIVIC SERVICES & GRIEVANCE DATA LAYER
// ============================================================

export const CIVIC_DEPARTMENTS = [
  { id: 'pwd', name: 'Public Works Department (PWD)', code: 'PWD', email: 'support.pwd@samadhansetu.gov.in', phone: '0651-2400101', head: 'Chief Engineer (Roads)' },
  { id: 'water', name: 'Water Resources & Drinking Water (PHE)', code: 'DWSD', email: 'water.cell@samadhansetu.gov.in', phone: '0651-2400102', head: 'Superintending Engineer' },
  { id: 'energy', name: 'Electricity Distribution Corporation (JBVNL)', code: 'ENERGY', email: 'electricity.grievance@samadhansetu.gov.in', phone: '1912', head: 'General Manager (Distribution)' },
  { id: 'municipal', name: 'Urban Development & Municipal Corporation (RMC)', code: 'MUNICIPAL', email: 'sanitation@samadhansetu.gov.in', phone: '0651-2200011', head: 'Municipal Commissioner' },
  { id: 'health', name: 'Health, Medical Education & Family Welfare', code: 'HEALTH', email: 'health.cell@samadhansetu.gov.in', phone: '104', head: 'Director-in-Chief Health' },
  { id: 'social_welfare', name: 'Social Welfare, Women & Child Development', code: 'WELFARE', email: 'pension.cell@samadhansetu.gov.in', phone: '0651-2446050', head: 'Director Social Welfare' },
  { id: 'revenue', name: 'Revenue, Registration & Land Records', code: 'REVENUE', email: 'revenue.helpdesk@samadhansetu.gov.in', phone: '0651-2446100', head: 'Inspector General of Registration' },
  { id: 'food_civil', name: 'Food, Public Distribution & Consumer Affairs', code: 'PDS', email: 'pds.grievance@samadhansetu.gov.in', phone: '1800-3456-598', head: 'Food Commissioner' },
];

export const CIVIC_SERVICES = [
  {
    id: 'road-repair',
    title: 'Pothole & Damaged Road Repair Grievance',
    department: 'Public Works Department (PWD)',
    category: 'Road & Infrastructure',
    code: 'PWD-ROD-01',
    slaDays: 15,
    description: 'Report arterial road damage, hazardous potholes, collapsed culverts, or unpaved municipal access paths requiring engineering resurfacing.',
    eligibility: 'All citizens, residents, and commercial vehicle operators within municipal limits.',
    documentsRequired: ['Geotagged site photograph', 'Landmark location / GPS pin', 'Citizen identity proof (optional)'],
    actionUrl: '/submit?dept=pwd&cat=Road%20%26%20Infrastructure'
  },
  {
    id: 'drinking-water',
    title: 'Drinking Water Supply Contamination / Pipeline Burst',
    department: 'Water Resources & Drinking Water (PHE)',
    category: 'Water Supply',
    code: 'DWSD-WTR-02',
    slaDays: 7,
    description: 'Urgent reporting of contaminated piped water, low pressure, community handpump breakdown, or mainline distribution fractures.',
    eligibility: 'Any resident with piped connection or reliance on public water infrastructure.',
    documentsRequired: ['Site photo of water discolouration or broken handpump', 'Consumer number (if metered)'],
    actionUrl: '/submit?dept=water&cat=Water%20Supply'
  },
  {
    id: 'street-lighting',
    title: 'Defective Streetlight / Dark Spot Remediation',
    department: 'Urban Development & Municipal Corporation (RMC)',
    category: 'Street Lighting',
    code: 'RMC-LGT-03',
    slaDays: 5,
    description: 'Request replacement of failed street LEDs, sodium vapor lamps, or installation of lighting in crime-prone urban corridors.',
    eligibility: 'Local residents, neighborhood welfare associations (RWAs).',
    documentsRequired: ['Pole number (if marked)', 'Ward number & street address'],
    actionUrl: '/submit?dept=municipal&cat=Street%20Lighting'
  },
  {
    id: 'garbage-sanitation',
    title: 'Municipal Garbage Pileup & Open Drain Overflow',
    department: 'Urban Development & Municipal Corporation (RMC)',
    category: 'Sanitation & Sewage',
    code: 'RMC-SNT-04',
    slaDays: 3,
    description: 'Complaint regarding unattended community dustbins, open sewage leakage, biohazard stagnation, or scheduled garbage van skips.',
    eligibility: 'All urban & semi-urban residents.',
    documentsRequired: ['Current site photograph', 'Locality landmark / ward number'],
    actionUrl: '/submit?dept=municipal&cat=Sanitation%20%26%20Sewage'
  },
  {
    id: 'power-distribution',
    title: 'Transformer Burnout & Voltage Fluctuation',
    department: 'Electricity Distribution Corporation (JBVNL)',
    category: 'Electricity',
    code: 'JBVNL-PWR-05',
    slaDays: 4,
    description: 'Lodge urgent distress notice for burnt distribution transformers, snapped overhead conductors, or frequent phase imbalance.',
    eligibility: 'Power consumer or any observant passerby in case of electrical hazard.',
    documentsRequired: ['Consumer AC number (if consumer)', 'Transformer location / pole ID'],
    actionUrl: '/submit?dept=energy&cat=Electricity'
  },
  {
    id: 'social-pension',
    title: 'National Social Assistance / Old Age Pension Delay',
    department: 'Social Welfare, Women & Child Development',
    category: 'Welfare Schemes',
    code: 'WLF-PEN-06',
    slaDays: 21,
    description: 'Grievance concerning non-credit of Old Age, Widow, or Disability pension installments exceeding two payment cycles.',
    eligibility: 'Enrolled pension beneficiaries or designated family caregivers.',
    documentsRequired: ['Beneficiary Pension Sanction Number', 'Bank passbook copy / DBT statement'],
    actionUrl: '/submit?dept=social_welfare&cat=Welfare%20Schemes'
  },
  {
    id: 'ration-pds',
    title: 'Public Distribution System (PDS) Ration Denial',
    department: 'Food, Public Distribution & Consumer Affairs',
    category: 'Public Distribution',
    code: 'PDS-RAT-07',
    slaDays: 10,
    description: 'Grievance against fair-price shop dealer overcharging, biometric denial, underweight ration allocation, or black-marketing.',
    eligibility: 'Ration cardholders (NFSA / Antyodaya).',
    documentsRequired: ['Ration Card Number', 'Dealer name / Fair price shop ID'],
    actionUrl: '/submit?dept=food_civil&cat=Public%20Distribution'
  },
  {
    id: 'encroachment',
    title: 'Public Footpath Encroachment & Illegal Dumping',
    department: 'Revenue, Registration & Land Records',
    category: 'Encroachment',
    code: 'REV-ENC-08',
    slaDays: 30,
    description: 'Notify municipal enforcement of unauthorized commercial fencing, drain encroachment, or illegal construction on public commons.',
    eligibility: 'Local residents and citizen groups.',
    documentsRequired: ['Photographs of encroached land', 'Plot/Ward reference'],
    actionUrl: '/submit?dept=revenue&cat=Encroachment'
  }
];

export const PUBLIC_NOTICES = [
  {
    id: 'NOT-2026-089',
    title: 'Implementation of Right to Service Act — Mandatory 15-Day SLA on Civic Grievances',
    department: 'Department of Personnel & Administrative Reforms',
    category: 'Government Orders',
    publishDate: '2026-02-15',
    lastDate: '2026-12-31',
    status: 'Active',
    refNo: 'DPAR/RTS/2026/044',
    summary: 'All designated public grievance nodal officers are directed to comply with the 15-day maximum redressal timeline under Section 4 of the State Public Services Guarantee Act.',
    content: 'In accordance with the updated civic service delivery framework, every registered grievance received through Samadhan Setu must be acknowledged within 24 hours and routed to the jurisdictional Junior Engineer or Field Officer. Weekly compliance reviews will be conducted by the District Collector.',
    downloadUrl: '#',
    fileSize: '340 KB (PDF)'
  },
  {
    id: 'NOT-2026-088',
    title: 'Monsoon Preparedness & Desilting of Major Stormwater Drains (Nallas)',
    department: 'Urban Development & Municipal Corporation (RMC)',
    category: 'Public Notices',
    publishDate: '2026-02-10',
    lastDate: '2026-04-30',
    status: 'Active',
    refNo: 'RMC/ENG/SNT/2026/112',
    summary: 'Public advisory to report clogged natural waterways, open manholes, and stormwater bottlenecks prior to the upcoming seasonal rains.',
    content: 'Special rapid-response teams have been deployed across 53 urban wards. Citizens can register geotagged drain blockage locations on the Samadhan Setu portal under the "Sanitation & Sewage" category for immediate hydro-vac suction cleaning.',
    downloadUrl: '#',
    fileSize: '512 KB (PDF)'
  },
  {
    id: 'NOT-2026-087',
    title: 'Special Pension Adalat for Grievance Redressal — District Headquarters',
    department: 'Social Welfare, Women & Child Development',
    category: 'Announcements',
    publishDate: '2026-02-05',
    lastDate: '2026-03-10',
    status: 'Active',
    refNo: 'SWD/PEN/ADALAT/2026/09',
    summary: 'Notice regarding physical and digital grievance redressing camps for senior citizen beneficiaries with Aadhaar-DBT mismatch.',
    content: 'A three-day Special Pension Adalat will convene from 10:00 AM to 5:00 PM at all Sub-Divisional Officer (SDO) compounds. Citizens can submit pending pension reference numbers online via Samadhan Setu to secure spot-resolution tokens.',
    downloadUrl: '#',
    fileSize: '280 KB (PDF)'
  },
  {
    id: 'NOT-2026-086',
    title: 'University Research Collaboration Grant Scheme for Civic Innovations',
    department: 'Department of Higher & Technical Education',
    category: 'Campaigns',
    publishDate: '2026-01-28',
    lastDate: '2026-03-31',
    status: 'Active',
    refNo: 'DHTE/SIH-RND/2026/02',
    summary: 'R&D funding invitations for state universities solving verified municipal challenges through prototype deployment.',
    content: 'Under the Societal Innovation initiative, academic institutions (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur) taking up verified civic challenges through Samadhan Setu are eligible for prototype prototyping grants up to ₹2.5 Lakhs co-funded by CSR industry partners.',
    downloadUrl: '#',
    fileSize: '890 KB (PDF)'
  },
  {
    id: 'NOT-2026-085',
    title: 'Advisory on High-Voltage Overhead Wire Clearance in Residential Zones',
    department: 'Electricity Distribution Corporation (JBVNL)',
    category: 'Government Orders',
    publishDate: '2026-01-18',
    lastDate: '2026-06-30',
    status: 'Active',
    refNo: 'JBVNL/SAF/2026/883',
    summary: 'Guidelines on reporting sagging 11kV lines, proximity to residential rooftops, and illegal hookings.',
    content: 'Citizens are cautioned against constructing structures within horizontal clearance zones of 11kV/33kV distribution infrastructure. Immediate reports of sagging conductors can be lodged through the Electricity category on this portal.',
    downloadUrl: '#',
    fileSize: '410 KB (PDF)'
  }
];

export const CIVIC_DOCUMENTS = [
  {
    id: 'DOC-01',
    name: 'Citizen Charter for Grievance Redressal (नागरिक अधिकार पत्र)',
    department: 'Department of Administrative Reforms',
    type: 'Citizen Charter',
    fileType: 'PDF',
    size: '1.2 MB',
    updatedOn: '2026-01-15',
    description: 'Details citizen service rights, designated redressal officers, appeal authorities, and statutory time limits for 48 municipal & state services.'
  },
  {
    id: 'DOC-02',
    name: 'Standard Grievance Registration Application (Form GR-1)',
    department: 'State Grievance Redressal Cell',
    type: 'Form',
    fileType: 'PDF / Fillable',
    size: '450 KB',
    updatedOn: '2026-02-01',
    description: 'Official physical application form for submitting grievances at district facilitation centers (CSC/Jankari Kendra) if offline.'
  },
  {
    id: 'DOC-03',
    name: 'Right to Public Services Guarantee Guidelines (सेवा का अधिकार नियमावली)',
    department: 'Department of Personnel & Training',
    type: 'Guidelines',
    fileType: 'PDF',
    size: '2.1 MB',
    updatedOn: '2025-11-20',
    description: 'Comprehensive guidelines outlining mandatory response procedures, penalty clauses for officer default, and digital escalation hierarchies.'
  },
  {
    id: 'DOC-04',
    name: 'Municipal Solid Waste Management By-laws & Penalty Matrix',
    department: 'Urban Development & Municipal Corporation',
    type: 'Regulations',
    fileType: 'PDF',
    size: '850 KB',
    updatedOn: '2025-12-10',
    description: 'Legal standards for residential waste segregation, commercial waste disposal compliance, and authorized dumping yard zones.'
  },
  {
    id: 'DOC-05',
    name: 'Social Pension Scheme Application & Re-verification Proforma',
    department: 'Social Welfare Department',
    type: 'Form',
    fileType: 'PDF',
    size: '620 KB',
    updatedOn: '2026-01-05',
    description: 'Official proforma for pension KYC linking, bank account DBT change, and life certificate declaration.'
  },
  {
    id: 'DOC-06',
    name: 'Drinking Water Quality Standards & Contamination Reporting Manual',
    department: 'Public Health Engineering Department',
    type: 'Technical Manual',
    fileType: 'PDF',
    size: '1.6 MB',
    updatedOn: '2025-10-30',
    description: 'Permissible TDS, pH, and bacterial thresholds for municipal tap supply, with instructions for field water testing kit requests.'
  }
];

// Initial Seed of Grievances for consistent, interactive tracking
const INITIAL_GRIEVANCES = [
  {
    id: 'GRV-2026-10482',
    citizenId: 'u1001',
    citizenName: 'Rameshwar Mahato',
    citizenMobile: '+91-9431102938',
    citizenEmail: 'citizen@samadhansetu.gov.in',
    subject: 'Broken community hand pump near Morabadi Primary School',
    department: 'Water Resources & Drinking Water (PHE)',
    category: 'Water Supply',
    subCategory: 'Handpump Breakdown',
    priority: 'High',
    status: 'assigned', // submitted, under_review, assigned, action_taken, resolved, closed
    location: 'Near Primary School, Morabadi, Ranchi, Jharkhand',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'The community hand pump near the primary school has been non-functional for 3 weeks, forcing 150 local families to walk over 2 kilometers to fetch potable drinking water.',
    createdAt: '2026-02-01T08:15:00.000Z',
    updatedAt: '2026-02-08T14:20:00.000Z',
    expectedCompletion: '2026-02-25',
    assignedOfficer: 'Er. Rajesh Kumar, Executive Engineer (DWSD)',
    assignedPartner: 'Birla Institute of Technology (BIT) Mesra',
    attachments: [
      { name: 'handpump_broken_photo.jpg', size: '1.8 MB', type: 'image' },
      { name: 'rwa_complaint_letter.pdf', size: '420 KB', type: 'document' }
    ],
    timeline: [
      { stage: 'submitted', date: '2026-02-01 08:15 AM', authority: 'Samadhan Setu Citizen Portal', note: 'Grievance registered successfully with geotag verification.' },
      { stage: 'under_review', date: '2026-02-02 10:30 AM', authority: 'District Grievance Triage Cell', note: 'Issue categorized as high priority; water source location verified.' },
      { stage: 'assigned', date: '2026-02-04 03:00 PM', authority: 'Water Resources & PHE Department', note: 'Assigned to BIT Mesra Capstone Engineering Team for water table testing & handpump bore restoration.' }
    ],
    clarifications: [],
    feedback: null
  },
  {
    id: 'GRV-2026-20941',
    citizenId: 'u1001',
    citizenName: 'Rameshwar Mahato',
    citizenMobile: '+91-9431102938',
    citizenEmail: 'citizen@samadhansetu.gov.in',
    subject: 'Hazardous deep pothole cluster causing two-wheeler accidents at Lalpur Chowk',
    department: 'Public Works Department (PWD)',
    category: 'Road & Infrastructure',
    subCategory: 'Pothole Resurfacing',
    priority: 'High',
    status: 'action_taken',
    location: 'Lalpur Chowk near Circular Road, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Over 10 large potholes have opened up after water pipeline laying work, causing waterlogging and serious skidding accidents during peak evening traffic.',
    createdAt: '2026-01-25T11:20:00.000Z',
    updatedAt: '2026-02-12T16:00:00.000Z',
    expectedCompletion: '2026-02-18',
    assignedOfficer: 'S. N. Soren, Assistant Engineer (Roads Division 1)',
    assignedPartner: 'Municipal Road Maintenance Wing',
    attachments: [
      { name: 'lalpur_pothole_accident.jpg', size: '2.4 MB', type: 'image' }
    ],
    timeline: [
      { stage: 'submitted', date: '2026-01-25 11:20 AM', authority: 'Citizen Portal', note: 'Grievance submitted with accident photographic evidence.' },
      { stage: 'under_review', date: '2026-01-26 09:45 AM', authority: 'PWD Nodal Desk', note: 'Site inspection requisition dispatched.' },
      { stage: 'assigned', date: '2026-01-28 02:15 PM', authority: 'PWD Roads Division 1', note: 'Emergency patching tender issued to rapid resurfacing squad.' },
      { stage: 'action_taken', date: '2026-02-12 04:00 PM', authority: 'PWD Field Team', note: 'Cold-mix asphalt bitumen patching completed. Secondary curing in progress.' }
    ],
    clarifications: [
      { date: '2026-02-05 11:00 AM', by: 'Citizen', text: 'Another accident happened yesterday night; please expedite immediate leveling.' }
    ],
    feedback: null
  },
  {
    id: 'GRV-2026-30155',
    citizenId: 'u1002',
    citizenName: 'Sunita Devi',
    citizenMobile: '+91-9876543210',
    citizenEmail: 'sunita.devi@example.com',
    subject: 'Open sewage drain overflowing into residential street',
    department: 'Urban Development & Municipal Corporation (RMC)',
    category: 'Sanitation & Sewage',
    subCategory: 'Sewage Overflow',
    priority: 'Medium',
    status: 'resolved',
    location: 'Ward No. 14, Kishoreganj, Harmu Road, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    description: 'Underground sewer blocked by construction debris, flooding foul wastewater into four residential compounds.',
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-01-16T15:30:00.000Z',
    expectedCompletion: '2026-01-17',
    assignedOfficer: 'M. K. Jha, Sanitary Inspector',
    assignedPartner: 'RMC Quick Sanitation Response',
    attachments: [],
    timeline: [
      { stage: 'submitted', date: '2026-01-10 09:00 AM', authority: 'Citizen Portal', note: 'Grievance submitted.' },
      { stage: 'under_review', date: '2026-01-11 11:00 AM', authority: 'RMC Sanitation Cell', note: 'Complaint assigned to Ward 14 Sanitary Inspector.' },
      { stage: 'assigned', date: '2026-01-12 01:00 PM', authority: 'RMC Ward 14', note: 'Super-sucker suction machine scheduled for unblocking.' },
      { stage: 'action_taken', date: '2026-01-15 03:00 PM', authority: 'Sanitation Field Crew', note: 'Drain cleared and disinfected with bleaching powder.' },
      { stage: 'resolved', date: '2026-01-16 03:30 PM', authority: 'Municipal Commissioner Desk', note: 'Issue verified as resolved. Citizen confirmation received.' }
    ],
    clarifications: [],
    feedback: { rating: 5, comment: 'Thank you, municipal team cleaned the blockage quickly!' }
  }
];

const LOCAL_STORAGE_KEY = 'ss_grievances_records';

export function getLocalGrievances() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_GRIEVANCES));
      return INITIAL_GRIEVANCES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_GRIEVANCES;
  }
}

export function saveLocalGrievance(newGrievance) {
  const all = getLocalGrievances();
  const updated = [newGrievance, ...all.filter(g => g.id !== newGrievance.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return newGrievance;
}

export function findGrievance(idOrQuery) {
  if (!idOrQuery) return null;
  const clean = idOrQuery.trim().toLowerCase();
  const all = getLocalGrievances();
  return all.find(g => 
    g.id.toLowerCase() === clean || 
    g.id.toLowerCase().replace(/[^a-z0-9]/g, '') === clean.replace(/[^a-z0-9]/g, '') ||
    (g._id && g._id.toLowerCase() === clean) ||
    (g.citizenMobile && g.citizenMobile.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))) ||
    (g.citizenEmail && g.citizenEmail.toLowerCase() === clean)
  ) || null;
}

export function updateGrievanceStatus(id, newStatus, remarks = '', assignedOfficer = '', assignedDepartment = '') {
  const all = getLocalGrievances();
  const target = all.find(g => g.id === id || g._id === id);
  if (!target) return null;

  target.status = newStatus;
  target.updatedAt = new Date().toISOString();
  if (assignedOfficer) target.assignedOfficer = assignedOfficer;
  if (assignedDepartment) target.department = assignedDepartment;

  const stageNotes = {
    under_review: remarks || 'Grievance reviewed by nodal desk; jurisdiction confirmed.',
    assigned: remarks || `Assigned to ${assignedDepartment || target.department} for technical action.`,
    action_taken: remarks || 'Field work initiated / prototype inspection executed.',
    resolved: remarks || 'Grievance resolved satisfactorily by the designated authority.',
    escalated: remarks || 'Grievance escalated to District Collector review cell due to priority SLA.'
  };

  target.timeline.push({
    stage: newStatus,
    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    authority: assignedDepartment || target.department || 'Administrative Authority',
    note: stageNotes[newStatus] || remarks || 'Status updated by department officer.'
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  return target;
}

export function addCitizenClarification(id, clarificationText) {
  const all = getLocalGrievances();
  const target = all.find(g => g.id === id || g._id === id);
  if (!target) return null;

  if (!target.clarifications) target.clarifications = [];
  target.clarifications.push({
    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    by: 'Citizen',
    text: clarificationText
  });
  target.updatedAt = new Date().toISOString();

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  return target;
}

export function addCitizenFeedback(id, rating, comment) {
  const all = getLocalGrievances();
  const target = all.find(g => g.id === id || g._id === id);
  if (!target) return null;

  target.feedback = {
    rating,
    comment,
    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  };
  target.updatedAt = new Date().toISOString();

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  return target;
}

export function reopenGrievance(id, reason) {
  const all = getLocalGrievances();
  const target = all.find(g => g.id === id || g._id === id);
  if (!target) return null;

  target.status = 'under_review';
  target.updatedAt = new Date().toISOString();
  target.timeline.push({
    stage: 'under_review',
    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    authority: 'Citizen Appeal System',
    note: `Grievance reopened by citizen. Reason: ${reason}`
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  return target;
}
