import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { complaintApi } from '../api/endpoints';
import {
  getLocalGrievances,
  updateGrievanceStatus,
  CIVIC_DEPARTMENTS
} from '../services/civicData';
import {
  Search, Filter, ChevronRight, ChevronDown, Calendar, MapPin,
  User, Tag, RefreshCw, ExternalLink, Check, Shield, AlertTriangle,
  Clock, X, CheckCircle2, AlertCircle, Building2, Upload, FileText
} from 'lucide-react';

const STATUS_FILTERS = ['all', 'submitted', 'under_review', 'assigned', 'action_taken', 'resolved', 'escalated'];

export default function AdminComplaints() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Local synced grievances state
  const [localGrievances, setLocalGrievances] = useState(() => getLocalGrievances());

  // Backend complaints query
  const { data: apiComplaints = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-complaints-api'],
    queryFn: () => complaintApi.getAll().then(r => r.data?.complaints || r.data || []),
    staleTime: 20000,
  });

  // Merge local and backend complaints
  const allComplaints = useMemo(() => {
    const list = [...localGrievances];
    apiComplaints.forEach(ac => {
      const exists = list.some(l => l.id === ac._id || l._id === ac._id);
      if (!exists) {
        list.push({
          id: ac._id?.slice(-12).toUpperCase() || 'GRV-BACKEND',
          _id: ac._id,
          citizenName: ac.submittedBy?.name || 'Rameshwar Mahato',
          subject: ac.title,
          department: ac.assignedUniversity ? 'Higher Education & R&D' : 'Municipal Corporation',
          category: ac.category,
          district: ac.district || 'Ranchi',
          priority: ac.urgency || 'High',
          status: ac.status,
          location: ac.location?.address || ac.address || ac.district || 'Ranchi',
          createdAt: ac.createdAt,
          updatedAt: ac.updatedAt,
          description: ac.description,
          timeline: [
            { stage: 'submitted', date: new Date(ac.createdAt).toLocaleString('en-IN'), authority: 'Citizen Portal', note: 'Grievance submitted.' }
          ]
        });
      }
    });
    return list;
  }, [localGrievances, apiComplaints]);

  // Unique categories and districts for dropdowns
  const uniqueCategories = useMemo(() => {
    const set = new Set();
    allComplaints.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [allComplaints]);

  const uniqueDistricts = useMemo(() => {
    const set = new Set();
    allComplaints.forEach(c => {
      if (c.district) set.add(c.district);
    });
    return Array.from(set);
  }, [allComplaints]);

  // Filtered grievances
  const filtered = useMemo(() => {
    return allComplaints.filter(c => {
      const matchSearch = !search ||
        c.id?.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase()) ||
        c.citizenName?.toLowerCase().includes(search.toLowerCase()) ||
        c.department?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' ||
        c.status.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === 'under_review' && c.status === 'pending');

      const matchCategory = categoryFilter === 'all' ||
        c.category?.toLowerCase() === categoryFilter.toLowerCase();

      const matchDistrict = districtFilter === 'all' ||
        c.district?.toLowerCase() === districtFilter.toLowerCase();

      const matchDept = departmentFilter === 'all' ||
        c.department?.toLowerCase().includes(departmentFilter.toLowerCase());

      return matchSearch && matchStatus && matchCategory && matchDistrict && matchDept;
    });
  }, [allComplaints, search, statusFilter, categoryFilter, districtFilter, departmentFilter]);

  const handleStatusOverride = async (g, newStatus) => {
    try {
      if (g._id) {
        await complaintApi.updateStatus(g._id, newStatus);
      }
      updateGrievanceStatus(g.id, newStatus, `Manual status override to ${newStatus} by admin.`);
      setLocalGrievances(getLocalGrievances());
      refetch();
      setActionSuccess(`Status for ${g.id} manually updated to "${newStatus.toUpperCase()}".`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  // Triage modal state
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [triageStatus, setTriageStatus] = useState('');
  const [triageDepartment, setTriageDepartment] = useState('');
  const [triageOfficer, setTriageOfficer] = useState('');
  const [triageRemarks, setTriageRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const openTriageModal = (g) => {
    setSelectedGrievance(g);
    setTriageStatus(g.status || 'under_review');
    setTriageDepartment(g.department || CIVIC_DEPARTMENTS[0].name);
    setTriageOfficer(g.assignedOfficer || 'Er. Rajesh Kumar, Executive Engineer');
    setTriageRemarks('');
  };

  const handleSaveTriage = async () => {
    if (!selectedGrievance) return;

    // 1. Update local synchronized store (instantly updates citizen tracking)
    const updated = updateGrievanceStatus(
      selectedGrievance.id,
      triageStatus,
      triageRemarks,
      triageOfficer,
      triageDepartment
    );

    // 2. Also patch backend if reachable
    if (selectedGrievance._id) {
      try {
        await complaintApi.updateStatus(selectedGrievance._id, triageStatus);
      } catch (e) {
        console.warn('Backend updateStatus notice:', e.message);
      }
    }

    // Refresh state
    setLocalGrievances(getLocalGrievances());
    setActionSuccess(`Grievance ${selectedGrievance.id} updated to "${triageStatus.toUpperCase()}". The citizen tracking page has been updated live.`);
    setSelectedGrievance(null);
  };

  const handleApproveAsChallenge = async (g) => {
    try {
      if (g._id) {
        await complaintApi.triage(g._id, {
          screeningClassification: 'validated_societal_challenge',
          screeningReason: 'Approved by administrator as a validated societal innovation challenge.',
          innovationPotential: 'high'
        });
      }
      updateGrievanceStatus(g.id, 'reviewed', 'Validated as societal innovation challenge by state administrative committee.');
      setLocalGrievances(getLocalGrievances());
      refetch();
      setActionSuccess(`Challenge ${g.id} validated for university R&D matching.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to validate challenge.');
    }
  };

  const handleMarkAsRoutine = async (g) => {
    try {
      if (g._id) {
        await complaintApi.triage(g._id, {
          screeningClassification: 'routine_service_issue',
          screeningReason: 'Classified by administrator as localized routine municipal maintenance.',
          citizenGuidance: 'This item is not suitable for the societal innovation challenge pipeline. Please refer to local municipal grievance channels.'
        });
      }
      updateGrievanceStatus(g.id, 'pending', 'Marked as routine municipal maintenance issue.');
      setLocalGrievances(getLocalGrievances());
      refetch();
      setActionSuccess(`Issue ${g.id} marked as routine municipal maintenance.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as routine.');
    }
  };

  const handleQuickResolve = (g) => {
    updateGrievanceStatus(g.id, 'resolved', 'Grievance verified and resolved satisfactorily by municipal team.');
    setLocalGrievances(getLocalGrievances());
    setActionSuccess(`Grievance ${g.id} marked as RESOLVED. Citizen has been notified.`);
  };

  const handleQuickEscalate = (g) => {
    updateGrievanceStatus(g.id, 'escalated', 'Escalated to District Collector Review Cell due to priority SLA.');
    setLocalGrievances(getLocalGrievances());
    setActionSuccess(`Grievance ${g.id} ESCALATED to Appellate Review Cell.`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 font-sans text-gray-900" id="main-content">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-saffron-700 uppercase tracking-widest font-semibold mb-1">
              <Link to="/admin/dashboard" className="hover:underline">Admin Control</Link>
              <span>›</span>
              <span>Grievance Triage</span>
            </div>
            <h1 className="text-2xl font-bold text-navy-950">Grievance Management & Triage Desk</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Review incoming citizen filings, assign jurisdictional departments, log action taken reports, and resolve or escalate complaints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { refetch(); setLocalGrievances(getLocalGrievances()); }}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw size={13} />
              <span>Refresh Records</span>
            </button>
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded transition-colors shadow-sm"
            >
              Analytics Dashboard
            </Link>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs flex items-center justify-between gap-2 font-medium animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-700 hover:text-emerald-950">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── SEARCH & FILTERS BAR ─────────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ID, citizen name, department..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-navy-900 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-700 outline-none font-medium capitalize"
              title="Filter by status"
            >
              <option value="all">All Statuses</option>
              {STATUS_FILTERS.filter(s => s !== 'all').map(st => (
                <option key={st} value={st}>{st.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-700 outline-none font-medium"
              title="Filter by category"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-700 outline-none font-medium"
              title="Filter by district"
            >
              <option value="all">All Districts</option>
              {uniqueDistricts.map(dst => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-700 outline-none"
            >
              <option value="all">All Departments</option>
              {CIVIC_DEPARTMENTS.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* ── COMPREHENSIVE GRIEVANCE TABLE ───────────────────── */}
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
          
          <div className="px-5 py-3.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
            <h2 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Grievance Register ({filtered.length} Complaints Listed)
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">Click "Triage" to reassign, change status, or add remarks</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-sm text-navy-950">No Grievances Match Search Filters</div>
              <p className="mt-1">Try resetting the department or status filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <th className="py-3 px-4">Grievance ID</th>
                    <th className="py-3 px-4">Citizen</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-center">Priority</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((g) => (
                    <tr key={g.id || g._id} className="hover:bg-blue-50/40 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-950 whitespace-nowrap">
                        <Link to={`/track?id=${g.id}`} className="hover:underline" title="View citizen tracking view">
                          {g.id}
                        </Link>
                      </td>

                      {/* Citizen */}
                      <td className="py-3.5 px-4 font-medium text-gray-800 whitespace-nowrap">
                        {g.citizenName || 'Citizen'}
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-navy-950 line-clamp-1">{g.subject}</div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{g.location}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                        {g.category}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-gray-700 font-medium whitespace-nowrap max-w-[140px] truncate">
                        {g.department}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {new Date(g.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          g.priority === 'High' || g.priority === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {g.priority || 'Medium'}
                        </span>
                      </td>

                      {/* Status & Manual Status Override Dropdown */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          g.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : g.status === 'escalated'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : g.status === 'action_taken'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {g.status.replace('_', ' ')}
                        </span>
                        <div className="mt-1">
                          <select
                            value={g.status || 'pending'}
                            onChange={(e) => handleStatusOverride(g, e.target.value)}
                            className="text-[10px] font-semibold border border-gray-300 rounded px-1 py-0.5 bg-white text-gray-800 hover:border-navy-900 outline-none cursor-pointer"
                            title="Manual status override dropdown"
                          >
                            <option value="pending">pending</option>
                            <option value="reviewed">reviewed</option>
                            <option value="assigned">assigned</option>
                            <option value="in_progress">in_progress</option>
                            <option value="resolved">resolved</option>
                            <option value="duplicate">duplicate</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openTriageModal(g)}
                            className="px-2.5 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded text-[11px] font-bold transition-colors"
                          >
                            Triage
                          </button>
                          {g.status !== 'resolved' && (
                            <button
                              onClick={() => handleQuickResolve(g)}
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-300"
                              title="Quick Resolve"
                            >
                              <Check size={13} />
                            </button>
                          )}
                          {g.status !== 'escalated' && (
                            <button
                              onClick={() => handleQuickEscalate(g)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-300"
                              title="Escalate Grievance"
                            >
                              <AlertTriangle size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* ── ADMIN TRIAGE MODAL ──────────────────────────────────── */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in text-xs">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                    {selectedGrievance.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-500">
                    Filing by: {selectedGrievance.citizenName}
                  </span>
                </div>
                <h3 className="font-bold text-navy-950 text-sm mt-1 leading-snug">
                  {selectedGrievance.subject}
                </h3>
              </div>
              <button onClick={() => setSelectedGrievance(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Grievance Summary Box */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <div><strong>Category:</strong> {selectedGrievance.category}</div>
                <div><strong>Location:</strong> {selectedGrievance.location}</div>
                <div><strong>Date Filed:</strong> {new Date(selectedGrievance.createdAt).toLocaleString('en-IN')}</div>
                <div><strong>Current Status:</strong> <span className="font-bold uppercase text-navy-900">{selectedGrievance.status}</span></div>
              </div>
              <div>
                <strong className="block text-[11px] text-gray-500 uppercase font-bold">Description:</strong>
                <p className="text-gray-800 bg-white p-2 rounded border border-gray-200 mt-0.5">
                  {selectedGrievance.description}
                </p>
              </div>
            </div>

            {/* Triage Inputs Form */}
            <div className="space-y-3 pt-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Status Picker */}
                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Update Grievance Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={triageStatus}
                    onChange={e => setTriageStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-navy-900 outline-none bg-white font-medium capitalize"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="assigned">Assigned to Technical Team</option>
                    <option value="action_taken">Action Taken (Field Work in Progress)</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated to Appellate Review</option>
                  </select>
                </div>

                {/* Department Reassignment */}
                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Jurisdictional Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={triageDepartment}
                    onChange={e => setTriageDepartment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-navy-900 outline-none bg-white font-medium"
                  >
                    {CIVIC_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nodal Officer Assignment */}
              <div>
                <label className="block font-bold text-navy-950 mb-1">
                  Assigned Nodal Officer / Field Engineer
                </label>
                <input
                  type="text"
                  value={triageOfficer}
                  onChange={e => setTriageOfficer(e.target.value)}
                  placeholder="e.g. Er. Rajesh Kumar, Executive Engineer"
                  className="w-full p-2 border border-gray-300 rounded focus:border-navy-900 outline-none"
                />
              </div>

              {/* Action Taken Remarks */}
              <div>
                <label className="block font-bold text-navy-950 mb-1">
                  Official Remarks / Action Taken Report <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={triageRemarks}
                  onChange={e => setTriageRemarks(e.target.value)}
                  placeholder="Enter official action details. This note will appear on the citizen's live tracking page..."
                  className="w-full p-2 border border-gray-300 rounded focus:border-navy-900 outline-none"
                ></textarea>
                <span className="text-[10px] text-gray-500">
                  This update is permanently appended to the citizen tracking audit trail.
                </span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setTriageStatus('resolved'); setTriageRemarks('Verified and resolved satisfactorily by municipal inspection team.'); }}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold hover:bg-emerald-100"
                >
                  Resolve Quick
                </button>
                <button
                  type="button"
                  onClick={() => { setTriageStatus('escalated'); setTriageRemarks('Escalated to District Collector Review Cell.'); }}
                  className="px-3 py-1.5 bg-red-50 text-red-800 border border-red-300 rounded font-bold hover:bg-red-100"
                >
                  Escalate Quick
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTriage}
                  className="px-5 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded shadow-sm"
                >
                  Commit Triage Update
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
