import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, FileText, Cpu, Building2, Award, ArrowRight, ShieldCheck, Clock, MapPin, Eye } from 'lucide-react';

export default function HowItWorksPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleReport = () => {
    if (isAuthenticated) {
      navigate('/submit');
    } else {
      navigate('/auth', {
        state: {
          from: { pathname: '/submit' },
          message: 'Please login or create an account to report an issue.'
        }
      });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      
      {/* Top Banner */}
      <div className="bg-navy-900 text-white py-12 px-4 border-b-4 border-saffron-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-saffron-400 uppercase tracking-widest font-semibold mb-2">
            <span>Process & Lifecycle Guidelines</span>
            <span>·</span>
            <span>SIH 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How Samadhan Setu Works</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mt-2 leading-relaxed">
            A comprehensive overview of the grievance submission, automated triage, university capstone adoption, and municipal resolution lifecycle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        {/* 4 Detailed Phases */}
        <div className="space-y-8">
          
          {/* Phase 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <div className="inline-block px-3 py-1 bg-navy-900 text-white text-xs font-bold rounded mb-3">
                PHASE 1
              </div>
              <h2 className="text-xl font-bold text-navy-950">Grievance Submission & Anti-Fraud Verification</h2>
              <p className="text-xs text-gray-500 mt-1">Citizen Reporting & Evidence Gathering</p>
            </div>
            <div className="lg:col-span-9 space-y-3 text-xs text-gray-700 leading-relaxed">
              <p>
                Citizens submit infrastructural and civic problems by capturing photographs, selecting geolocation coordinates on an interactive map, and writing or voice-recording descriptive details.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">EXIF GPS Cross-Check</strong>
                  The system reads camera hardware metadata from the uploaded photo and calculates Euclidean distance to the map pin. Deviations beyond 500m are flagged for administrative inspection.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">AI Image Analysis</strong>
                  Uploaded photographs are processed through computer vision models to detect scene tags (e.g. <code>pothole</code>, <code>water_pipeline</code>, <code>solid_waste</code>) and evaluate image relevance.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Acknowledgment Number</strong>
                  A unique tracking identifier is generated immediately, and the citizen receives confirmation via portal notifications.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <div className="inline-block px-3 py-1 bg-navy-900 text-white text-xs font-bold rounded mb-3">
                PHASE 2
              </div>
              <h2 className="text-xl font-bold text-navy-950">Automated AI Triage & Hotspot Clustering</h2>
              <p className="text-xs text-gray-500 mt-1">Classification & Priority Scoring</p>
            </div>
            <div className="lg:col-span-9 space-y-3 text-xs text-gray-700 leading-relaxed">
              <p>
                Rather than treating each complaint in isolation, Samadhan Setu runs geospatial clustering algorithms using the Haversine formula to detect regional municipal systemic failures.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">1.0 km Spatial Radius</strong>
                  Complaints within 1000 meters are grouped. When a cluster reaches a high threshold (e.g., 11 clustered issues in Morabadi, Ranchi), the system generates an urgent Critical Hotspot alarm.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Severity Weighting</strong>
                  The algorithm evaluates hazard impact: drinking water contamination and structural roadway collapse automatically receive High Urgency flags.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Duplicate Suppression</strong>
                  Identical complaints filed for the same coordinate are automatically linked to a primary parent complaint, eliminating redundant processing.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <div className="inline-block px-3 py-1 bg-navy-900 text-white text-xs font-bold rounded mb-3">
                PHASE 3
              </div>
              <h2 className="text-xl font-bold text-navy-950">University Research Matching & CSR Grants</h2>
              <p className="text-xs text-gray-500 mt-1">Academic R&D & Co-Financing</p>
            </div>
            <div className="lg:col-span-9 space-y-3 text-xs text-gray-700 leading-relaxed">
              <p>
                Verified municipal problems are converted into Academic Research Challenges and published to participating engineering departments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Vector Embeddings</strong>
                  Complaint descriptions are transformed into 768-dimensional vector embeddings and matched against faculty research keywords using cosine similarity.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Challenge Acceptance</strong>
                  University departments review suggested challenges and formally accept them as student capstone or faculty R&D projects.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">CSR Co-Financing</strong>
                  Industry partners (e.g. Tata Steel CSR Innovation Lab) review active projects and provide direct CSR innovation grants for physical prototypes.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <div className="inline-block px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded mb-3">
                PHASE 4
              </div>
              <h2 className="text-xl font-bold text-navy-950">Pilot Deployment & Institutional Rewards</h2>
              <p className="text-xs text-gray-500 mt-1">Field Execution & Reputation Credits</p>
            </div>
            <div className="lg:col-span-9 space-y-3 text-xs text-gray-700 leading-relaxed">
              <p>
                Student teams and faculty mentors deploy the prototype on the ground, test hydrological or structural integrity, and hand over the solution to the municipal administration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Milestone Verification</strong>
                  Three verified phases: Topography Survey → Prototype Fabrication → Field Handover. Milestones must be certified before status marks Completed.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">+10 Reputation Award</strong>
                  Upon verified completion, the university automatically receives 10 institutional reputation points, supporting NIRF innovation credentials.
                </div>
                <div className="bg-white p-3.5 rounded border border-gray-200">
                  <strong className="text-navy-900 block mb-1">Citizen Feedback</strong>
                  The original citizen who filed the issue reviews the field resolution and provides ground satisfaction ratings.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Citizen Redressal SLA Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-navy-900 text-white p-4 font-bold text-sm">
            Citizen Charter: Standard Redressal & Verification Timelines
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-navy-950 font-bold">
                  <th className="p-3">Stage</th>
                  <th className="p-3">Action Description</th>
                  <th className="p-3">Expected Timeframe</th>
                  <th className="p-3">Responsible Stakeholder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3 font-semibold text-navy-900">Step 1</td>
                  <td className="p-3">Automated EXIF Geotagging & AI Duplicate Check</td>
                  <td className="p-3 text-emerald-700 font-bold">Real-time (&lt; 60 seconds)</td>
                  <td className="p-3">System AI Engine</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-navy-900">Step 2</td>
                  <td className="p-3">Administrative Review & Hotspot Classification</td>
                  <td className="p-3 text-emerald-700 font-bold">24 Hours</td>
                  <td className="p-3">Municipal Grievance Officer</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-navy-900">Step 3</td>
                  <td className="p-3">University Challenge Matching & Departmental Review</td>
                  <td className="p-3 text-blue-800 font-bold">48 - 72 Hours</td>
                  <td className="p-3">University R&D Cell</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-navy-900">Step 4</td>
                  <td className="p-3">Capstone Prototype Design & Field Deployment</td>
                  <td className="p-3 text-gray-700">15 - 30 Days (Per Project Milestones)</td>
                  <td className="p-3">Faculty Mentors & Student Teams</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6 space-y-4">
          <h3 className="text-lg font-bold text-navy-950">Have a problem to submit right now?</h3>
          <button
            onClick={handleReport}
            className="px-6 py-3 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded shadow transition-colors inline-flex items-center gap-2"
          >
            <FileText size={16} />
            <span>Proceed to Grievance Registration</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
