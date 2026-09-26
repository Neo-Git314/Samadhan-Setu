import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintApi } from '../api/endpoints';
import {
  findGrievance,
  addCitizenClarification,
  addCitizenFeedback,
  reopenGrievance,
  getLocalGrievances
} from '../services/civicData';
import { downloadGrievancePDF, printGrievancePDF } from '../services/pdfService';
import SamadhanLogo from '../components/SamadhanLogo';
import {
  Search, FileText, CheckCircle2, Clock, AlertTriangle,
  ArrowRight, ShieldCheck, Download, MessageSquare, Star,
  RefreshCw, RotateCcw, Building2, Calendar, MapPin, User,
  Check, X, AlertCircle, Eye, Paperclip, Printer
} from 'lucide-react';

const STAGES = [
  { key: 'submitted', label: 'Submitted', desc: 'Recorded with Geotag' },
  { key: 'under_review', label: 'Under Review', desc: 'Jurisdiction & Priority Checked' },
  { key: 'assigned', label: 'Assigned', desc: 'Dispatched to Technical Team' },
  { key: 'action_taken', label: 'Action Taken', desc: 'Field Works / Engineering Remedy' },
  { key: 'resolved', label: 'Resolved', desc: 'Completed & Inspected' }
];

export default function TrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlId = searchParams.get('id') || '';

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [inputQuery, setInputQuery] = useState(urlId || 'GRV-2026-10482');
  const [contactQuery, setContactQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [grievance, setGrievance] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Modals for citizen actions
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationText, setClarificationText] = useState('');

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const [actionSuccess, setActionSuccess] = useState('');

  // Perform search on mount if url query param exists
  useEffect(() => {
    if (urlId) {
      setInputQuery(urlId);
      performSearch(urlId);
    } else {
      // Default initial showcase with seed complaint
      performSearch('GRV-2026-10482');
    }
  }, [urlId]);

  const performSearch = async (queryToSearch) => {
    const q = (queryToSearch || inputQuery).trim();
    if (!q) {
      setSearchError('Please provide a Grievance ID, mobile number, or email.');
      return;
    }

    setSearchError('');
    setActionSuccess('');
    setLoading(true);

    // 1. Check local synchronized store
    let found = findGrievance(q);

    // 2. If not found locally, attempt API lookup
    if (!found) {
      try {
        const res = await complaintApi.getById(q);
        const backendComplaint = res.data?.complaint || res.data;
        if (backendComplaint) {
          const ackNum = backendComplaint.acknowledgementNumber || backendComplaint._id;
          found = {
            id: ackNum,
            acknowledgementNumber: ackNum,
            _id: backendComplaint._id,
            subject: backendComplaint.title,
            title: backendComplaint.title,
            department: backendComplaint.assignedUniversity ? 'Higher Education & R&D' : 'Municipal Civic Authority',
            category: backendComplaint.category,
            priority: backendComplaint.urgency || 'High',
            status: backendComplaint.status,
            state: backendComplaint.state || 'India',
            district: backendComplaint.district || '',
            city: backendComplaint.city || '',
            pincode: backendComplaint.pincode || '',
            location: backendComplaint.address || `${backendComplaint.city || ''} ${backendComplaint.district || ''}`.trim() || 'Location recorded',
            description: backendComplaint.description,
            citizenName: backendComplaint.submittedBy?.name || 'Registered Citizen',
            citizenMobile: backendComplaint.submittedBy?.phone || '',
            citizenEmail: backendComplaint.submittedBy?.email || '',
            createdAt: backendComplaint.createdAt,
            updatedAt: backendComplaint.updatedAt,
            timeline: [
              { stage: 'submitted', date: new Date(backendComplaint.createdAt).toLocaleString('en-IN'), authority: 'Samadhan Setu Public Register', note: 'Grievance recorded in official register.' },
              { stage: backendComplaint.status, date: new Date(backendComplaint.updatedAt).toLocaleString('en-IN'), authority: 'Department', note: `Current stage: ${backendComplaint.status.replace(/_/g, ' ')}` }
            ],
            clarifications: [],
            feedback: null
          };
        }
      } catch (e) {
        // Not found on backend
      }
    }

    setLoading(false);
    if (found) {
      setGrievance(found);
      setSearchParams({ id: found.id });
    } else {
      setGrievance(null);
      setSearchError(`No grievance record found matching "${q}". Please double check your Grievance ID.`);
    }
  };

  const handleFormSearch = (e) => {
    e.preventDefault();
    performSearch(inputQuery);
  };

  const getStageIndex = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s === 'submitted') return 0;
    if (s === 'under_review' || s === 'pending') return 1;
    if (s === 'assigned' || s === 'reviewed') return 2;
    if (s === 'action_taken' || s === 'in_progress') return 3;
    if (s === 'resolved' || s === 'closed') return 4;
    return 1;
  };

  // Submit citizen clarification
  const handleSaveClarification = () => {
    if (!clarificationText.trim()) return;
    const updated = addCitizenClarification(grievance.id, clarificationText.trim());
    if (updated) setGrievance({ ...updated });
    setClarificationText('');
    setShowClarificationModal(false);
    setActionSuccess('Clarification added successfully to official grievance log.');
  };

  // Submit feedback
  const handleSaveFeedback = () => {
    const updated = addCitizenFeedback(grievance.id, rating, feedbackComment.trim());
    if (updated) setGrievance({ ...updated });
    setShowFeedbackModal(false);
    setActionSuccess('Citizen rating recorded successfully. Thank you for your feedback!');
  };

  // Reopen grievance
  const handleReopen = () => {
    if (!reopenReason.trim()) return;
    const updated = reopenGrievance(grievance.id, reopenReason.trim());
    if (updated) setGrievance({ ...updated });
    setReopenReason('');
    setShowReopenModal(false);
    setActionSuccess('Grievance reopened. It has been escalated back to Under Review.');
  };

  // Download Official PDF Acknowledgement
  const handleDownloadAcknowledgement = () => {
    if (!grievance) return;
    downloadGrievancePDF(grievance);
  };

  // Print Official PDF Acknowledgement Slip (100% matches PDF)
  const handlePrintSlip = () => {
    if (!grievance) return;
    printGrievancePDF(grievance);
  };

  const currentStageIdx = grievance ? getStageIndex(grievance.status) : 0;

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900" id="main-content">
      
      {/* ── TOP BANNER ────────────────────────────────────────── */}
      <div className="bg-navy-900 text-white py-8 px-4 border-b-4 border-saffron-500">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-saffron-400 uppercase tracking-widest font-semibold mb-2">
            <Link to="/" className="hover:underline">Home</Link>
            <span>›</span>
            <span>Track Grievance Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Citizen Grievance Redressal Tracking</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mt-1.5 leading-relaxed">
            Enter your registration reference number or mobile number to inspect real-time departmental routing, field reports, and expected resolution dates.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* ── SEARCH INPUT BOX ─────────────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 p-6 shadow-sm">
          <form onSubmit={handleFormSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-navy-950 uppercase tracking-wide mb-1">
                  Enter Grievance ID or Mobile Number
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="e.g. GRV-2026-10482 or +91-9431102938"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm font-mono border border-gray-300 rounded focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="sm:col-span-4 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Search size={14} />
                  <span>{loading ? 'Searching...' : 'Track Status'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { performSearch('GRV-2026-10482'); }}
                  className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded border border-gray-300"
                  title="Load Sample Demo Grievance"
                >
                  Demo
                </button>
              </div>
            </div>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{searchError}</span>
              </div>
            )}
          </form>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2 font-medium animate-fade-in">
            <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* ── TRACKING DETAILS RESULTS ──────────────────────────── */}
        {grievance && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Particulars Card */}
            <div className="bg-white rounded border border-gray-300 p-6 shadow-sm space-y-4">
              
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-navy-950 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-300">
                      {grievance.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded uppercase border bg-amber-100 text-amber-800 border-amber-300">
                      {grievance.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      Priority: <strong>{grievance.priority || 'High'}</strong>
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-navy-950 mt-2 leading-snug">
                    {grievance.subject}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadAcknowledgement}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-navy-950 border border-gray-300 text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={13} />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Department</span>
                  <div className="font-bold text-navy-900 mt-0.5">{grievance.department}</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Category</span>
                  <div className="font-bold text-navy-900 mt-0.5">{grievance.category}</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Submitted On</span>
                  <div className="font-mono text-gray-700 mt-0.5">
                    {new Date(grievance.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Last Updated</span>
                  <div className="font-mono text-gray-700 mt-0.5">
                    {new Date(grievance.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Description & Location */}
              <div className="pt-3 border-t border-gray-100 text-xs space-y-2">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-0.5">Location of Issue:</span>
                  <span className="flex items-center gap-1.5 text-gray-800 font-medium">
                    <MapPin size={13} className="text-saffron-600" />
                    {grievance.location}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Citizen Narrative:</span>
                  <p className="text-gray-700 leading-relaxed">{grievance.description}</p>
                </div>
              </div>

            </div>

            {/* ── 5-STAGE STATUS TIMELINE ──────────────────────── */}
            <div className="bg-white rounded border border-gray-300 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide border-b pb-2 mb-6 flex items-center justify-between">
                <span>Stage-by-Stage Redressal Progress</span>
                <span className="text-[11px] font-normal text-emerald-700 font-medium">
                  {currentStageIdx >= 4 ? 'Status: Resolved' : 'Status: Under Active Processing'}
                </span>
              </h3>

              {/* Visual Progress Stepper */}
              <div className="relative mb-8">
                <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-gray-200 z-0">
                  <div
                    className="h-1 bg-emerald-600 transition-all duration-500"
                    style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {STAGES.map((s, idx) => {
                    const isCompleted = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;
                    return (
                      <div key={s.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                            isCompleted
                              ? 'bg-emerald-700 text-white shadow-sm'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-emerald-100 font-extrabold' : ''}`}
                        >
                          {isCompleted ? <Check size={16} /> : idx + 1}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isCompleted ? 'text-navy-950' : 'text-gray-400'}`}>
                            {s.label}
                          </div>
                          <div className="text-[10px] text-gray-500 leading-tight hidden sm:block">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Stage Log Records */}
              <div className="space-y-3 border-t pt-4">
                <span className="text-[10px] text-gray-500 uppercase font-bold block mb-2">
                  Official Audit & Department Action Trail:
                </span>
                {grievance.timeline.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 text-xs flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-saffron-500 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                        <strong className="text-navy-950 uppercase font-bold text-[11px]">
                          {item.stage.replace('_', ' ')}
                        </strong>
                        <span className="font-mono text-gray-500 text-[10px]">{item.date}</span>
                      </div>
                      <div className="text-gray-600 text-[11px] mb-1">
                        Recorded by: <strong>{item.authority}</strong>
                      </div>
                      <p className="text-gray-800 leading-relaxed bg-white p-2 rounded border border-gray-200 text-[11px]">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clarifications Log if present */}
              {grievance.clarifications?.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">
                    Citizen Supplementary Notes ({grievance.clarifications.length}):
                  </span>
                  {grievance.clarifications.map((c, idx) => (
                    <div key={idx} className="p-2.5 bg-blue-50/60 rounded border border-blue-200 text-xs text-blue-950">
                      <div className="flex items-center justify-between text-[10px] text-blue-800 font-semibold mb-0.5">
                        <span>Citizen Note</span>
                        <span className="font-mono">{c.date}</span>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Citizen Feedback */}
              {grievance.feedback && (
                <div className="mt-4 pt-4 border-t bg-emerald-50/60 border border-emerald-200 rounded p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-emerald-950 uppercase text-[10px] font-bold">Recorded Citizen Feedback</strong>
                    <div className="flex items-center text-amber-500">
                      {[...Array(grievance.feedback.rating)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{grievance.feedback.comment}"</p>
                </div>
              )}

            </div>

            {/* ── CITIZEN INTERACTIVE ACTIONS BAR ───────────────── */}
            <div className="bg-white rounded border border-gray-300 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide mb-3">
                Citizen Grievance Management Actions
              </h3>
              
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setShowClarificationModal(true)}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  <span>Add Clarification / Note</span>
                </button>

                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
                >
                  <Star size={13} />
                  <span>Provide Feedback / Rating</span>
                </button>

                {grievance.status === 'resolved' && (
                  <button
                    onClick={() => setShowReopenModal(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Reopen Grievance</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadAcknowledgement}
                  className="px-4 py-2 bg-[#123B68] hover:bg-[#0B2440] text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Download Official PDF Document"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handlePrintSlip}
                  className="px-4 py-2 bg-[#2878B8] hover:bg-[#1A5C94] text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Print Slip matching official PDF"
                >
                  <Printer size={13} />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── MODAL 1: ADD CLARIFICATION ─────────────────────────── */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-400 max-w-md w-full p-5 shadow-2xl space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
                <MessageSquare size={15} className="text-saffron-600" />
                Submit Citizen Clarification
              </h3>
              <button onClick={() => setShowClarificationModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={16} />
              </button>
            </div>
            <p className="text-gray-600 text-[11px]">
              Add supplementary landmark markers, changes in site conditions, or urgency updates directly to the official timeline.
            </p>
            <textarea
              rows={4}
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
              placeholder="e.g. The leak has worsened and water pressure in adjacent houses has dropped completely..."
              className="w-full p-2.5 border border-gray-300 rounded focus:border-navy-900 outline-none"
            ></textarea>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowClarificationModal(false)}
                className="px-3.5 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClarification}
                className="px-4 py-1.5 bg-navy-900 text-white rounded font-bold hover:bg-navy-800"
              >
                Add Clarification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CITIZEN FEEDBACK ───────────────────────────── */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-400 max-w-md w-full p-5 shadow-2xl space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
                <Star size={15} className="text-amber-500" />
                Rate Citizen Redressal Quality
              </h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Satisfaction Rating (1 to 5 Stars):</label>
              <div className="flex items-center gap-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
                <span className="text-xs font-bold text-navy-950 ml-2">{rating} out of 5</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Feedback Comments:</label>
              <textarea
                rows={3}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="How was the response time and quality of work done by the department?"
                className="w-full p-2.5 border border-gray-300 rounded focus:border-navy-900 outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-3.5 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeedback}
                className="px-4 py-1.5 bg-saffron-600 text-white rounded font-bold hover:bg-saffron-700"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: REOPEN GRIEVANCE ───────────────────────────── */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-red-300 max-w-md w-full p-5 shadow-2xl space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-red-700 text-sm flex items-center gap-1.5">
                <RotateCcw size={15} />
                Reopen Closed Grievance
              </h3>
              <button onClick={() => setShowReopenModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={16} />
              </button>
            </div>
            <p className="text-gray-600 text-[11px]">
              If the problem was not adequately solved or has re-occurred, declare your ground for reopening. It will be escalated to the Executive Engineer.
            </p>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="State why the resolution was incomplete..."
              className="w-full p-2.5 border border-gray-300 rounded focus:border-navy-900 outline-none"
            ></textarea>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowReopenModal(false)}
                className="px-3.5 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReopen}
                className="px-4 py-1.5 bg-red-600 text-white rounded font-bold hover:bg-red-700"
              >
                Confirm Reopening
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
