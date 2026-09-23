import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';
import Complaint from '../models/Complaint.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/samadhan_setu';

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // 1. Clear existing demo data to ensure a fresh, consistent showcase state
    await Promise.all([
      User.deleteMany({}),
      University.deleteMany({}),
      IndustryPartner.deleteMany({}),
      Complaint.deleteMany({}),
      Project.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('[Seed] Cleaned existing collections.');

    // 2. Seed Users
    const passwordHash = await bcrypt.hash('Admin@2026', 10);
    const uniPasswordHash = await bcrypt.hash('Uni@2026', 10);
    const indPasswordHash = await bcrypt.hash('Industry@2026', 10);
    const citPasswordHash = await bcrypt.hash('Citizen@2026', 10);

    const adminUser = await User.create({
      name: 'State Administrative Officer',
      email: 'admin@samadhansetu.gov.in',
      passwordHash,
      role: 'admin',
      phone: '+91-651-2400100',
      organization: 'Department of Higher & Technical Education, Govt. of Jharkhand'
    });

    const citizenUser = await User.create({
      name: 'Rameshwar Mahato',
      email: 'citizen@samadhansetu.gov.in',
      passwordHash: citPasswordHash,
      role: 'citizen',
      phone: '+91-9431102938',
      organization: 'Morabadi Resident Welfare Association, Ranchi'
    });

    const bitUser = await User.create({
      name: 'Prof. S. K. Roy (Dean R&D)',
      email: 'bitmesra@edu.in',
      passwordHash: uniPasswordHash,
      role: 'university',
      phone: '+91-651-2275444',
      organization: 'Birla Institute of Technology (BIT) Mesra, Ranchi'
    });

    const iitUser = await User.create({
      name: 'Dr. Alok Sinha (Head EnvEng)',
      email: 'iitism@edu.in',
      passwordHash: uniPasswordHash,
      role: 'university',
      phone: '+91-326-2235001',
      organization: 'IIT (ISM) Dhanbad'
    });

    const nitUser = await User.create({
      name: 'Dr. P. K. Choudhary (Civil Dept)',
      email: 'nitjsr@edu.in',
      passwordHash: uniPasswordHash,
      role: 'university',
      phone: '+91-657-2373407',
      organization: 'National Institute of Technology (NIT) Jamshedpur'
    });

    const tataUser = await User.create({
      name: 'Ananya Sen (CSR Lead)',
      email: 'contact@tatasteelcsr.com',
      passwordHash: indPasswordHash,
      role: 'industry',
      phone: '+91-657-6644221',
      organization: 'Tata Steel CSR Innovation Lab'
    });

    const jrtfUser = await User.create({
      name: 'Vikas Swarup (Director)',
      email: 'contact@jrtf.org',
      passwordHash: indPasswordHash,
      role: 'industry',
      phone: '+91-651-2331900',
      organization: 'Jharkhand Rural Tech Foundation'
    });

    console.log('[Seed] Seeded Users (Admin, Citizen, 3 Universities, 2 Industries).');

    // 3. Seed Universities
    const dummyEmbeddingUrbanWater = new Array(768).fill(0.04);
    const dummyEmbeddingEnv = new Array(768).fill(0.03);
    const dummyEmbeddingHealthAgri = new Array(768).fill(0.05);

    const bitUniversity = await University.create({
      userId: bitUser._id,
      name: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
      location: { lat: 23.4123, lng: 85.4399 },
      disciplines: ['urban_development', 'water_resources', 'energy'],
      researchKeywords: ['smart cities', 'water quality sensors', 'sub-surface drainage', 'iot telemetry'],
      researchEmbedding: dummyEmbeddingUrbanWater,
      reputationScore: 40,
      completedProjectsCount: 1,
      activeProjectsCount: 1,
      incubationFacility: true,
      contactEmail: 'bitmesra@edu.in'
    });

    const iitUniversity = await University.create({
      userId: iitUser._id,
      name: 'IIT (ISM) Dhanbad',
      location: { lat: 23.8144, lng: 86.4412 },
      disciplines: ['environment', 'energy', 'urban_development'],
      researchKeywords: ['heavy metal removal', 'mine water remediation', 'air quality monitoring'],
      researchEmbedding: dummyEmbeddingEnv,
      reputationScore: 25,
      completedProjectsCount: 0,
      activeProjectsCount: 1,
      incubationFacility: true,
      contactEmail: 'iitism@edu.in'
    });

    const nitUniversity = await University.create({
      userId: nitUser._id,
      name: 'National Institute of Technology (NIT) Jamshedpur',
      location: { lat: 22.777, lng: 86.1441 },
      disciplines: ['water_resources', 'healthcare', 'agriculture'],
      researchKeywords: ['smart irrigation', 'membrane filtration', 'low-cost water purification'],
      researchEmbedding: dummyEmbeddingHealthAgri,
      reputationScore: 30,
      completedProjectsCount: 1,
      activeProjectsCount: 0,
      incubationFacility: true,
      contactEmail: 'nitjsr@edu.in'
    });

    console.log('[Seed] Seeded Universities with disciplines, embeddings, and reputation scores.');

    // 4. Seed Industry Partners
    const tataPartner = await IndustryPartner.create({
      userId: tataUser._id,
      name: 'Tata Steel CSR Innovation Lab, Jamshedpur',
      type: 'CSR',
      sectorFocus: ['water_resources', 'urban_development', 'environment'],
      contactEmail: 'contact@tatasteelcsr.com'
    });

    const jrtfPartner = await IndustryPartner.create({
      userId: jrtfUser._id,
      name: 'Jharkhand Rural Tech Foundation',
      type: 'MSME',
      sectorFocus: ['agriculture', 'water_resources', 'rural_livelihoods'],
      contactEmail: 'contact@jrtf.org'
    });

    console.log('[Seed] Seeded Industry Partners.');

    // 5. Seed 14 Realistic Complaints
    // Specifically: 11 clustered complaints in Ranchi (Morabadi/Kanke within 1.0 km) to immediately trigger Task 7.1 Critical Hotspot!
    const complaintsData = [
      // --- CRITICAL HOTSPOT CLUSTER: MORABADI, RANCHI (11 Complaints within ~600m radius) ---
      {
        title: 'Morabadi Major Municipal Pipeline Rupture and Road Flooding',
        description:
          'High-pressure drinking water main line ruptured near Morabadi football stadium gate 3. Thousands of liters of clean water are overflowing into residential lanes and damaging bitumen road surface.',
        location: { lat: 23.3852, lng: 85.3281, address: 'Near Football Stadium Gate 3, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'water_resources',
        categoryConfidence: 0.94,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.12, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Water surging across asphalt road from subterranean rupture',
          tags: ['water_pipeline', 'road_damage', 'leakage'],
          relevanceScore: 0.92
        }
      },
      {
        title: 'Dangerous Potholes and Sub-base Subsidence on Morabadi Stadium Road',
        description:
          'A series of 2-foot deep potholes have emerged on the main road connecting Morabadi ground to Kanke Road, causing severe two-wheeler accidents during evening peak traffic.',
        location: { lat: 23.386, lng: 85.3275, address: 'Morabadi Stadium Circular Road, Ranchi' },
        district: 'Ranchi',
        category: 'urban_development',
        categoryConfidence: 0.89,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.08, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Severe road crater exposing loose aggregate and soil',
          tags: ['pothole', 'urban_road', 'accident_hazard'],
          relevanceScore: 0.88
        }
      },
      {
        title: 'Blocked Drainage Culvert Causing Stagnant Sewage at Tagore Hill Road',
        description:
          'The stormwater canal under Tagore Hill Road has been clogged by construction debris and plastic waste. Foul sewage is backing up into five residential compounds.',
        location: { lat: 23.389, lng: 85.329, address: 'Tagore Hill Approach Road, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'water_resources',
        categoryConfidence: 0.91,
        urgency: 'medium',
        status: 'pending',
        locationVerification: { distanceKm: 0.25, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Clogged drainage culvert with dark stagnant water',
          tags: ['drainage', 'sanitation', 'stormwater'],
          relevanceScore: 0.86
        }
      },
      {
        title: 'Overflowing Organic Waste Dump at Morabadi Daily Vegetable Market',
        description:
          'More than four tons of rotting vegetable refuse and market garbage have accumulated adjacent to the primary school path. Stray cattle and flies create extreme hygiene risk.',
        location: { lat: 23.3845, lng: 85.3278, address: 'Weekly Haat Grounds, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'environment',
        categoryConfidence: 0.93,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.15, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Large waste heap near pedestrian walkway',
          tags: ['solid_waste', 'garbage', 'market_waste'],
          relevanceScore: 0.95
        }
      },
      {
        title: 'Coliform Contamination in Morabadi Colony Municipal Borewell Water',
        description:
          'Residents across Sector 4 Morabadi report yellowish, foul-smelling tap water. Preliminary testing by local clinic indicates high bacterial count likely from nearby leaking sewer pipe.',
        location: { lat: 23.3875, lng: 85.3255, address: 'Sector 4 Colony, Near Oxygen Park, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'water_resources',
        categoryConfidence: 0.96,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.05, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Turbid discolored water sample collected from residential tap',
          tags: ['water_quality', 'contamination', 'public_health'],
          relevanceScore: 0.9
        }
      },
      {
        title: 'Non-functional Streetlights along Bapu Vatika Stretch',
        description:
          'Over 14 consecutive sodium vapor street poles have been out of order for three weeks, leaving the perimeter of Bapu Vatika completely dark and unsafe for female commuters.',
        location: { lat: 23.3838, lng: 85.3288, address: 'Bapu Vatika Promenade, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'energy',
        categoryConfidence: 0.87,
        urgency: 'medium',
        status: 'pending',
        locationVerification: { distanceKm: 0.18, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Unlit street lighting fixtures at dusk',
          tags: ['streetlight', 'public_safety', 'electrical_grid'],
          relevanceScore: 0.8
        }
      },
      {
        title: 'Kanke Canal Embankment Soil Erosion Threatening Paved Walkway',
        description:
          'Heavy monsoon rains have washed away the retaining soil embankment along Kanke feeder canal. Approximately 30 meters of pedestrian pathway is cantilevered and on the verge of cave-in.',
        location: { lat: 23.3882, lng: 85.3262, address: 'Canal Road, Kanke-Morabadi Link, Ranchi' },
        district: 'Ranchi',
        category: 'urban_development',
        categoryConfidence: 0.92,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.31, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Eroded canal bank with cracking concrete slab',
          tags: ['soil_erosion', 'canal_embankment', 'infrastructure'],
          relevanceScore: 0.91
        }
      },
      {
        title: 'Low Voltage and Chronic Transformer Sparking in Morabadi Housing Complex',
        description:
          'The 250kVA local distribution transformer regularly sparks during load spikes between 7 PM and 10 PM. Voltage drops to 140V, damaging water pump motors.',
        location: { lat: 23.3855, lng: 85.3295, address: 'Govt Staff Quarters, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'energy',
        categoryConfidence: 0.88,
        urgency: 'medium',
        status: 'pending',
        locationVerification: { distanceKm: 0.1, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Pole mounted transformer with damaged insulator cables',
          tags: ['power_grid', 'transformer', 'electrical_hazard'],
          relevanceScore: 0.84
        }
      },
      {
        title: 'Unfenced Hazardous Disused Well Adjacent to Children Park',
        description:
          'A 40-foot deep abandoned agricultural well lies completely uncovered only 15 meters from the children play area in Morabadi Ground. Urgent grating or parapet wall required.',
        location: { lat: 23.384, lng: 85.3268, address: 'Children Park Edge, Morabadi Ground, Ranchi' },
        district: 'Ranchi',
        category: 'urban_development',
        categoryConfidence: 0.85,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.14, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Deep open pit well surrounded by overgrown grass',
          tags: ['open_well', 'public_hazard', 'child_safety'],
          relevanceScore: 0.89
        }
      },
      {
        title: 'Primary School Boundary Wall Collapse along Morabadi Link',
        description:
          'The brick perimeter wall of Morabadi Government Middle School collapsed following water buildup during stormwater discharge. Stray animals enter the school premises.',
        location: { lat: 23.3868, lng: 85.3285, address: 'Govt Middle School, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'education',
        categoryConfidence: 0.9,
        urgency: 'medium',
        status: 'pending',
        locationVerification: { distanceKm: 0.09, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Collapsed brick boundary wall exposing school courtyard',
          tags: ['school_infrastructure', 'brick_wall', 'education_safety'],
          relevanceScore: 0.87
        }
      },
      {
        title: 'Recurrent Stormwater Inundation on Morabadi Community Health Clinic Road',
        description:
          'Even moderate rainfall leads to knee-deep waterlogging on the access lane leading to the Urban Primary Health Centre, blocking ambulance movement.',
        location: { lat: 23.385, lng: 85.327, address: 'UPHC Access Road, Morabadi, Ranchi' },
        district: 'Ranchi',
        category: 'healthcare',
        categoryConfidence: 0.86,
        urgency: 'high',
        status: 'pending',
        locationVerification: { distanceKm: 0.11, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Submerged access road leading to public clinic building',
          tags: ['waterlogging', 'healthcare_access', 'drainage_failure'],
          relevanceScore: 0.93
        }
      },

      // --- OTHER DISTRICTS (DHANBAD & JAMSHEDPUR) ---
      {
        title: 'Coal Dust Pollution and Acid Mine Drainage in Hirapur Canal',
        description:
          'Untreated acidic seepage from old overburden dumps is discharging into the Hirapur storm channel, turning the water red-brown and corroding culvert foundation.',
        location: { lat: 23.7957, lng: 86.4304, address: 'Hirapur Overburden Canal, Dhanbad' },
        district: 'Dhanbad',
        category: 'environment',
        categoryConfidence: 0.95,
        urgency: 'high',
        status: 'assigned',
        assignedUniversity: iitUniversity._id,
        locationVerification: { distanceKm: 0.45, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Discolored stream showing acid mine runoff sedimentation',
          tags: ['mine_drainage', 'environmental_pollution', 'water_quality'],
          relevanceScore: 0.94
        }
      },
      {
        title: 'Frequent Traffic Bottleneck and Non-operational Smart Lights at Bank More',
        description:
          'Major arterial junction at Bank More Dhanbad suffers from uncalibrated signal timers, creating 45-minute jams and hazardous diesel smoke concentration.',
        location: { lat: 23.7915, lng: 86.425, address: 'Bank More Intersection, Dhanbad' },
        district: 'Dhanbad',
        category: 'urban_development',
        categoryConfidence: 0.88,
        urgency: 'medium',
        status: 'pending',
        locationVerification: { distanceKm: 0.08, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Heavy vehicle congestion at unmonitored intersection',
          tags: ['traffic_congestion', 'urban_gridlock', 'smart_signals'],
          relevanceScore: 0.82
        }
      },
      {
        title: 'Subarnarekha Riverbank Plastic Siltation near Sakchi Market',
        description:
          'Uncontrolled disposal of non-biodegradable packaging from wholesale market directly along the riverbank buffer zone. Risk of macro-plastic ingestion by aquatic fauna.',
        location: { lat: 22.8046, lng: 86.2029, address: 'Subarnarekha Ghat Road, Sakchi, Jamshedpur' },
        district: 'East Singhbhum',
        category: 'environment',
        categoryConfidence: 0.92,
        urgency: 'medium',
        status: 'pending',
        locationVerification: { distanceKm: 0.2, verified: true, status: 'verified' },
        imageAnalysis: {
          caption: 'Plastic waste trapped along shoreline vegetation',
          tags: ['river_pollution', 'plastic_waste', 'waterways'],
          relevanceScore: 0.89
        }
      }
    ];

    const seededComplaints = [];

    for (const cData of complaintsData) {
      const complaint = await Complaint.create({
        submittedBy: citizenUser._id,
        title: cData.title,
        description: cData.description,
        location: cData.location,
        geoPoint: {
          type: 'Point',
          coordinates: [cData.location.lng, cData.location.lat]
        },
        district: cData.district,
        mediaUrls: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60'
        ],
        imageGps: { lat: cData.location.lat + 0.0003, lng: cData.location.lng + 0.0002 },
        locationVerification: cData.locationVerification,
        isPotentiallyFraudulent: false,
        category: cData.category,
        categoryConfidence: cData.categoryConfidence,
        urgency: cData.urgency,
        status: cData.status,
        assignedUniversity: cData.assignedUniversity || null,
        imageAnalysis: cData.imageAnalysis,
        suggestedUniversities: [
          { universityId: bitUniversity._id, score: 0.89 },
          { universityId: iitUniversity._id, score: 0.76 },
          { universityId: nitUniversity._id, score: 0.68 }
        ],
        embedding: dummyEmbeddingUrbanWater
      });
      seededComplaints.push(complaint);
    }

    console.log(
      `[Seed] Seeded ${seededComplaints.length} Complaints (including 11 in Ranchi Morabadi cluster for Task 7.1 Hotspots).`
    );

    // 6. Seed Projects
    // Project A: Completed project with BIT Mesra (proving reputation score +10 awarded)
    const completedProject = await Project.create({
      complaintId: seededComplaints[0]._id,
      universityId: bitUniversity._id,
      industryPartnerId: tataPartner._id,
      status: 'completed',
      reputationAwarded: true,
      team: [
        { name: 'Prof. S. K. Roy', role: 'faculty_mentor' },
        { name: 'Amitabh Sen', role: 'student' },
        { name: 'Pooja Kumari', role: 'student' }
      ],
      milestones: [
        {
          title: 'Field Topography and Hydrological Pressure Survey',
          dueDate: new Date(Date.now() - 30 * 86400000),
          status: 'done',
          completedAt: new Date(Date.now() - 25 * 86400000)
        },
        {
          title: 'Design of Modular Pressure Relief Valves & Dual-chamber Sump',
          dueDate: new Date(Date.now() - 15 * 86400000),
          status: 'done',
          completedAt: new Date(Date.now() - 12 * 86400000)
        },
        {
          title: 'Field Deployment and Municipal Handover Protocol',
          dueDate: new Date(Date.now() - 5 * 86400000),
          status: 'done',
          completedAt: new Date(Date.now() - 2 * 86400000)
        }
      ],
      proposalDoc: 'https://samadhansetu.gov.in/docs/bit-mesra-water-proposal.pdf'
    });

    // Project B: In-progress project with IIT (ISM) Dhanbad
    const activeProject = await Project.create({
      complaintId: seededComplaints[11]._id,
      universityId: iitUniversity._id,
      industryPartnerId: jrtfPartner._id,
      status: 'in_progress',
      reputationAwarded: false,
      team: [
        { name: 'Dr. Alok Sinha', role: 'faculty_mentor' },
        { name: 'Rahul Verma', role: 'student' }
      ],
      milestones: [
        {
          title: 'Baseline Chemical Profiling of Silt and Heavy Metals',
          dueDate: new Date(Date.now() - 5 * 86400000),
          status: 'done',
          completedAt: new Date(Date.now() - 3 * 86400000)
        },
        {
          title: 'Bio-char and Activated Alumina Column Filter Prototype',
          dueDate: new Date(Date.now() + 10 * 86400000),
          status: 'pending'
        },
        {
          title: 'Pilot Field Testing at Hirapur Outlet',
          dueDate: new Date(Date.now() + 25 * 86400000),
          status: 'pending'
        }
      ]
    });

    // 7. Seed Notifications
    await Notification.create({
      userId: citizenUser._id,
      message: 'Welcome to Samadhan Setu! Your civic grievances are backed by academic R&D and industry collaboration.',
      type: 'system_welcome',
      read: false
    });

    await Notification.create({
      userId: bitUser._id,
      message: '10 reputation points awarded to BIT Mesra for completing the Morabadi pipeline relief project.',
      type: 'reputation_awarded',
      relatedId: completedProject._id,
      read: true
    });

    await Notification.create({
      userId: tataUser._id,
      message: 'You have been linked as an industry CSR collaborator on the Hirapur remediation project.',
      type: 'industry_invite',
      relatedId: activeProject._id,
      read: false
    });

    console.log('[Seed] Seeded Projects and Notifications.');
    console.log('================================================================');
    console.log('SAMADHAN SETU SEED DATA SUCCESSFULLY INITIALIZED');
    console.log('Admin Account: admin@samadhansetu.gov.in / Admin@2026');
    console.log('Citizen Account: citizen@samadhansetu.gov.in / Citizen@2026');
    console.log('University (BIT Mesra): bitmesra@edu.in / Uni@2026');
    console.log('Industry (Tata Steel CSR): contact@tatasteelcsr.com / Industry@2026');
    console.log('Critical Hotspots: 11 clustered complaints in Morabadi, Ranchi');
    console.log('================================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
