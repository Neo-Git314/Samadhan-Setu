import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, FileText, CheckCircle2, ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function TrackPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!complaintId.trim()) {
      setError('Please enter a valid Complaint ID or Reference Number.');
      return;
    }
    setError('');

    const targetId = complaintId.trim();

    if (isAuthenticated) {
      navigate(`/complaints/${targetId}`);
    } else {
      navigate('/auth', {
        state: {
          from: { pathname: `/complaints/${targetId}` },
          message: 'Please sign in with your citizen account to inspect verified grievance tracking details.'
        }
      });
    }
  };

  const handleViewAllMine = () => {
    if (isAuthenticated) {
      navigate('/citizen/complaints');
    } else {
      navigate('/auth', {
        state: {
          from: { pathname: '/citizen/complaints' },
          message: 'Please sign in to view and track all your submitted grievances.'
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
            <span>Online Redressal Tracking</span>
            <span>·</span>
            <span>National Civic System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Track Your Grievance</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mt-2 leading-relaxed">
            Enter your grievance registration identifier to inspect stage-by-stage status, verified geotags, university assignment, and field deployment milestones.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        
        {/* Track Form Card */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-navy-950 mb-2">Search by Grievance ID</h2>
          <p className="text-xs text-gray-600 mb-6">
            Enter the 24-character complaint ID generated during submission or received via acknowledgement SMS.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="e.g. 6aad520b618f8bb4288e5e07 or similar"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-navy-800 focus:ring-1 focus:ring-navy-800 font-mono"
                />
              </div>
              <button
                type="submit"
                className="py-3 px-6 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>Track Status</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
          </form>

          {/* Quick Option for Logged-In Citizens */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <strong className="text-xs font-bold text-navy-950 block">Are you looking for all your submitted issues?</strong>
              <span className="text-[11px] text-gray-500">View your personal grievance dashboard and filter by status.</span>
            </div>
            <button
              onClick={handleViewAllMine}
              className="py-2 px-4 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <FileText size={14} />
              <span>View All My Complaints</span>
            </button>
          </div>
        </div>

        {/* Milestone Lifecycle Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white border border-gray-200 rounded">
            <div className="text-navy-900 font-bold text-xs mb-1">Step 1: Submitted</div>
            <p className="text-[11px] text-gray-500">EXIF GPS cross-checked and indexed into municipal system.</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded">
            <div className="text-blue-800 font-bold text-xs mb-1">Step 2: University R&D</div>
            <p className="text-[11px] text-gray-500">Matched to faculty research department for prototype design.</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded">
            <div className="text-emerald-700 font-bold text-xs mb-1">Step 3: Field Handover</div>
            <p className="text-[11px] text-gray-500">Physical deployment, municipal inspection, and citizen rating.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
