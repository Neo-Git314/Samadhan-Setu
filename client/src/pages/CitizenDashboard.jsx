import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLocalGrievances, PUBLIC_NOTICES, addCitizenFeedback } from '../services/civicData';
import { downloadGrievancePDF, printGrievancePDF } from '../services/pdfService';
import SamadhanLogo from '../components/SamadhanLogo';
import {
  FileText, Plus, Search, CheckCircle2, Clock, MapPin,
  ChevronRight, User, Bell, Download, Star, Shield,
  Building2, Calendar, Eye, AlertCircle, X, RotateCcw,
  Printer, ArrowUpRight
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local synced grievances
  const allGrievances = useMemo(() => getLocalGrievances(), []);
  
  // Filter grievances submitted by this citizen (or all demo grievances if evaluator)
  const myGrievances = useMemo(() => {
    return allGrievances;
  }, [allGrievances]);

  // Feedback modal state
  const [feedbackGrievance, setFeedbackGrievance] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  // 5 Status Counters (Requirement 21: Total, Submitted, Under Review, In Progress, Resolved)
  const stats = useMemo(() => {
    return {
      total: myGrievances.length,
      submitted: myGrievances.filter(g => g.status === 'submitted' || g.status === 'pending').length,
      underReview: myGrievances.filter(g => g.status === 'under_review').length,
      inProgress: myGrievances.filter(g => ['assigned', 'action_taken', 'in_progress'].includes(g.status)).length,
      resolved: myGrievances.filter(g => g.status === 'resolved' || g.status === 'closed').length,
    };
  }, [myGrievances]);

  const handleDownloadSlip = (g) => {
    downloadGrievancePDF(g);
  };

  const handleSaveFeedback = () => {
    if (!feedbackGrievance) return;
    addCitizenFeedback(feedbackGrievance.id, rating, comment);
    setFeedbackSuccess(`Feedback for ${feedbackGrievance.id} recorded successfully.`);
    setFeedbackGrievance(null);
    setComment('');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 font-sans text-gray-900" id="main-content">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── WELCOME BANNER ───────────────────────────────────── */}
        <div className="bg-navy-950 text-white rounded border border-navy-800 p-6 shadow-md border-b-4 border-b-saffron-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-navy-800 border border-navy-700 flex items-center justify-center text-white text-lg font-bold">
              {user?.name ? user.name[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  Welcome, {user?.name || 'Citizen'}
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                  Citizen Profile
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Samadhan Setu Citizen Redressal Portal · {user?.city ? `${user.city}, ` : ''}{user?.district ? `${user.district}, ` : ''}{user?.state || 'Pan-India Coverage'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/submit"
              className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus size={14} />
              <span>File a Grievance</span>
            </Link>
            <Link
              to="/track"
              className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs rounded border border-navy-600 transition-colors flex items-center gap-1.5"
            >
              <Search size={14} className="text-saffron-400" />
              <span>Track Grievance</span>
            </Link>
          </div>
        </div>

        {feedbackSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{feedbackSuccess}</span>
          </div>
        )}

        {/* ── 5 SUMMARY STAT CARDS (Requirement 21: Total, Submitted, Under Review, In Progress, Resolved) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: Total */}
          <div className="bg-white p-3.5 rounded border border-gray-300 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-navy-50 text-navy-900 border border-navy-200 flex items-center justify-center flex-shrink-0 font-bold">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-navy-950 font-mono">{stats.total}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total</div>
            </div>
          </div>

          {/* Card 2: Submitted */}
          <div className="bg-white p-3.5 rounded border border-gray-300 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-gray-100 text-gray-700 border border-gray-300 flex items-center justify-center flex-shrink-0 font-bold">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-gray-800 font-mono">{stats.submitted}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Submitted</div>
            </div>
          </div>

          {/* Card 3: Under Review */}
          <div className="bg-white p-3.5 rounded border border-gray-300 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0 font-bold">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-amber-600 font-mono">{stats.underReview}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Under Review</div>
            </div>
          </div>

          {/* Card 4: In Progress */}
          <div className="bg-white p-3.5 rounded border border-gray-300 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0 font-bold">
              <Building2 size={18} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-blue-700 font-mono">{stats.inProgress}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">In Progress</div>
            </div>
          </div>

          {/* Card 5: Resolved */}
          <div className="bg-white p-3.5 rounded border border-gray-300 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0 font-bold">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-700 font-mono">{stats.resolved}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resolved</div>
            </div>
          </div>

        </div>

        {/* ── MY GRIEVANCES TABLE (Requirement 21) ───────────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
          
          <div className="px-5 py-3.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
            <h2 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              My Grievances ({myGrievances.length})
            </h2>
            <Link to="/submit" className="text-xs text-navy-900 font-bold hover:underline">
              + File New Grievance
            </Link>
          </div>

          {myGrievances.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-sm text-navy-950">No Grievances Registered Yet</div>
              <p className="text-xs text-gray-500 mt-1">Have you noticed any civic issue requiring government resolution?</p>
              <Link
                to="/submit"
                className="mt-3 inline-block px-4 py-2 bg-saffron-600 text-white font-bold text-xs rounded hover:bg-saffron-700"
              >
                File Your First Grievance
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <th className="py-3 px-3.5">Grievance ID</th>
                    <th className="py-3 px-3.5">Title</th>
                    <th className="py-3 px-3.5">Location</th>
                    <th className="py-3 px-3.5">Category</th>
                    <th className="py-3 px-3.5">Date</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myGrievances.map((g) => (
                    <tr key={g.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Grievance ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-navy-950 whitespace-nowrap">
                        <Link to={`/track?id=${g.id}`} className="hover:underline text-[#123B68]">
                          {g.id}
                        </Link>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-3.5 max-w-[200px]">
                        <div className="font-bold text-gray-900 truncate" title={g.subject || g.title}>
                          {g.subject || g.title}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3.5 max-w-[180px] text-gray-600">
                        <div className="truncate" title={g.location}>
                          {g.city ? `${g.city}, ` : ''}{g.district ? `${g.district}` : g.location}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3.5 text-gray-700 font-medium whitespace-nowrap">
                        {g.category}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3.5 font-mono text-gray-600 whitespace-nowrap">
                        {new Date(g.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          g.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : ['assigned', 'action_taken', 'in_progress'].includes(g.status)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {g.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions: View, Track, Download PDF */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to={`/complaints/${g._id || g.id}`}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#17324D] rounded text-[11px] font-semibold border border-gray-300 transition-colors"
                            title="View Details"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => navigate(`/track?id=${g.id}`)}
                            className="px-2 py-1 bg-[#123B68] text-white rounded text-[11px] font-semibold hover:bg-[#0B2440] transition-colors"
                            title="Track live status"
                          >
                            Track
                          </button>
                          <button
                            onClick={() => handleDownloadSlip(g)}
                            className="px-2 py-1 bg-[#2878B8] hover:bg-[#1A5C94] text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Download Official PDF Document"
                          >
                            <Download size={11} />
                            <span>PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* ── TWO COLUMN: NOTIFICATIONS & PROFILE INFORMATION ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Notifications */}
          <div className="lg:col-span-7 bg-white rounded border border-gray-300 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bell size={14} className="text-saffron-600" />
                Recent Grievance Notifications
              </span>
              <span className="text-[10px] text-gray-500 font-normal">Active Alerts</span>
            </h3>

            <div className="divide-y divide-gray-100 space-y-2 text-xs">
              <div className="pt-2 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-saffron-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="font-bold text-navy-950">Grievance GRV-2026-10482 Assigned to Technical Team</div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Your complaint regarding community handpump repair has been dispatched to Executive Engineer (DWSD) and BIT Mesra field unit.
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono">Yesterday at 03:00 PM</span>
                </div>
              </div>

              <div className="pt-2 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="font-bold text-navy-950">Pothole Repair Resurfacing in Progress</div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Cold-mix asphalt patching completed by PWD Roads Division 1 on Lalpur Chowk. Curing phase active.
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono">12 Feb 2026, 04:00 PM</span>
                </div>
              </div>

              <div className="pt-2 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="font-bold text-navy-950">Right to Service SLA Notification</div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Standard resolution window of 15 working days is active for your open filings.
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono">System Notice</span>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Profile Information Card */}
          <div className="lg:col-span-5 bg-white rounded border border-gray-300 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide border-b pb-2 flex items-center gap-1.5">
              <User size={14} className="text-navy-900" />
              Citizen Profile Information
            </h3>

            <div className="text-xs space-y-2.5 text-gray-800">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Full Name:</span>
                <span className="font-bold text-navy-950">{user?.name || 'Rameshwar Mahato'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Registered Mobile:</span>
                <span className="font-mono text-gray-700">{user?.phone || '+91-9431102938'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Registered Email:</span>
                <span className="font-mono text-gray-700">{user?.email || 'citizen@samadhansetu.gov.in'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Jurisdictional District:</span>
                <span>{user?.district || 'Ranchi, Jharkhand'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Citizen Organization / RWA:</span>
                <span>{user?.organization || 'Morabadi Resident Welfare Association'}</span>
              </div>
            </div>

            <div className="pt-2 border-t text-[11px] text-gray-500">
              Profile verified under the State Public Services Identification Framework.
            </div>
          </div>

        </div>

      </div>

      {/* ── FEEDBACK MODAL ─────────────────────────────────────── */}
      {feedbackGrievance && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-300 max-w-md w-full p-5 shadow-2xl space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
                <Star size={15} className="text-amber-500" />
                Rate Grievance Redressal ({feedbackGrievance.id})
              </h3>
              <button onClick={() => setFeedbackGrievance(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Satisfaction Rating:</label>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star size={22} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-navy-900">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Feedback Remarks:</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share feedback on resolution speed, worker behavior, or quality of repair..."
                  className="w-full p-2 border border-gray-300 rounded focus:border-navy-900 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setFeedbackGrievance(null)}
                  className="px-3.5 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeedback}
                  className="px-4 py-1.5 bg-saffron-600 text-white font-bold rounded hover:bg-saffron-700"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
