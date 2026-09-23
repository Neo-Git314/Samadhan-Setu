import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Search, Building2, Briefcase, ShieldAlert, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServicesPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (path, roleRequired, message) => {
    if (isAuthenticated) {
      if (roleRequired && user?.role !== roleRequired && user?.role !== 'admin') {
        navigate(path);
      } else {
        navigate(path);
      }
    } else {
      navigate('/auth', {
        state: {
          from: { pathname: path },
          message: message || 'Please sign in to access this service.'
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
            <span>Public Service Directory</span>
            <span>·</span>
            <span>National Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Portal Services Directory</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mt-2 leading-relaxed">
            A comprehensive catalog of citizen redressal mechanisms, academic research participation, corporate CSR grants, and administrative triage tools.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        {/* Category 1: Citizen Services */}
        <div>
          <div className="flex items-center gap-2 border-b-2 border-saffron-500 pb-2 mb-6">
            <h2 className="text-xl font-bold text-navy-950 uppercase tracking-wide">1. Citizen Services</h2>
            <span className="text-xs bg-saffron-100 text-saffron-800 font-bold px-2 py-0.5 rounded">Public Access</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-saffron-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-saffron-100 text-saffron-700 flex items-center justify-center mb-3">
                  <FileText size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Lodge a New Grievance</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  File civic problems regarding water distribution, road craters, drainage clogs, or hazardous pits with GPS photographic evidence.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/submit', 'citizen', 'Please log in as a citizen to file a new grievance.')}
                  className="w-full py-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>Lodge Grievance</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-navy-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Search size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Track Grievance Status</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Search personal grievances or lookup tracking IDs to inspect milestone reports, photo verifications, and engineering updates.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/track', null, 'Please log in to track your personal grievance history.')}
                  className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>Track Status</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-navy-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Citizen Satisfaction Rating</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Provide ground verification and star ratings upon municipal handover to ensure deployed prototypes truly resolve the issue.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/citizen/complaints', 'citizen', 'Please log in to review and rate your completed resolutions.')}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>View My Complaints</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Category 2: Academic & University R&D Services */}
        <div>
          <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-2 mb-6">
            <h2 className="text-xl font-bold text-navy-950 uppercase tracking-wide">2. Academic & University Services</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Higher Education</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-blue-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Building2 size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Browse Matched Challenges</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  University departments review civic issues matched to their discipline embeddings (Water Resources, Energy, Environment, Smart Cities).
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/university/challenges', 'university', 'Please log in with an accredited university account.')}
                  className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>Open Challenges</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-blue-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Capstone Milestone Management</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Faculty mentors assemble student engineering teams, submit CAD designs and lab results, and record progress toward field deployment.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/university/dashboard', 'university', 'Please sign in to access your university dashboard.')}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>University Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-blue-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Institutional Reputation Tracking</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Universities track NIRF-aligned community engagement scores (+10 points per completed civic deployment) for state accreditation.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/university/profile', 'university', 'Please log in to inspect your institutional profile.')}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>View Reputation Profile</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Category 3: Corporate & Administrative Services */}
        <div>
          <div className="flex items-center gap-2 border-b-2 border-purple-600 pb-2 mb-6">
            <h2 className="text-xl font-bold text-navy-950 uppercase tracking-wide">3. Corporate CSR & Governance Services</h2>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Industry & Municipal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-purple-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Corporate CSR Innovation Co-Funding</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Companies (such as Tata Steel CSR Innovation Lab) adopt high-impact university civic prototypes and contribute corporate grants.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/industry/dashboard', 'industry', 'Please sign in with an authorized industry partner account.')}
                  className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>CSR Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-red-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-red-100 text-red-700 flex items-center justify-center mb-3">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">Municipal Hotspot Triage (Admin)</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Urban local authorities review geospatial clusters, coordinate municipal permits, and fast-track emergency infrastructure remediation.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/admin/dashboard', 'admin', 'Administrative credentials required.')}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>Admin Triage</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-emerald-400 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-base font-bold text-navy-950 mb-1">State Analytics & Transparency Reports</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Real-time aggregation of resolution speed, district-wise grievance trends, and university capstone completion metrics.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction('/admin/analytics', 'admin', 'Administrative credentials required.')}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded flex items-center justify-center gap-1.5"
                >
                  <span>Analytics Overview</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
