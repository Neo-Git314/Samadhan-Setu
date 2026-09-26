import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { complaintApi } from '../api/endpoints';
import { getLocalGrievances } from '../services/civicData';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { downloadGrievancePDF } from '../services/pdfService';
import { FileText, Plus, Search, Filter, MapPin, Calendar, ChevronRight, Download, RefreshCw, LayoutGrid, List, Tag } from 'lucide-react';

const STATUSES = ['all', 'submitted', 'under_review', 'assigned', 'action_taken', 'resolved'];

export default function CitizenComplaints() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');

  // Backend query
  const { data: apiComplaints = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => complaintApi.getMine().then(r => r.data?.complaints || r.data || []),
    staleTime: 30000,
  });

  // Local synced grievances
  const localList = useMemo(() => getLocalGrievances(), []);

  // Merge list avoiding duplicates
  const allGrievances = useMemo(() => {
    const list = [...localList];
    apiComplaints.forEach(ac => {
      const exists = list.some(l => l.id === ac._id || l._id === ac._id);
      if (!exists) {
        list.push({
          id: ac._id?.slice(-12).toUpperCase() || 'GRV-BACKEND',
          _id: ac._id,
          subject: ac.title || ac.subject,
          department: ac.assignedUniversity ? 'Higher Education & R&D' : 'Municipal Administration',
          category: (ac.category || 'uncategorized').replace(/_/g, ' '),
          district: ac.district || 'Ranchi',
          urgency: ac.urgency || 'medium',
          status: ac.status,
          location: ac.location?.address || ac.address || ac.district || 'Ranchi',
          createdAt: ac.createdAt,
          updatedAt: ac.updatedAt
        });
      }
    });
    return list;
  }, [localList, apiComplaints]);

  const filtered = useMemo(() => {
    return allGrievances.filter(c => {
      const matchSearch = !search ||
        c.subject?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.toLowerCase().includes(search.toLowerCase()) ||
        c.id?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' ||
        c.status.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === 'under_review' && c.status === 'pending');
      return matchSearch && matchStatus;
    });
  }, [allGrievances, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: allGrievances.length,
      pending: allGrievances.filter(c => c.status === 'submitted' || c.status === 'pending').length,
      inProgress: allGrievances.filter(c => ['assigned', 'under_review', 'action_taken'].includes(c.status)).length,
      resolved: allGrievances.filter(c => c.status === 'resolved').length,
    };
  }, [allGrievances]);

  const handleDownload = (c) => {
    downloadGrievancePDF(c);
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4 font-sans text-gray-900" id="main-content">
      <div className="max-w-5xl mx-auto space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-saffron-700 uppercase tracking-widest font-semibold mb-1">
              <Link to="/" className="hover:underline">Home</Link>
              <span>›</span>
              <Link to="/citizen/dashboard" className="hover:underline">Dashboard</Link>
              <span>›</span>
              <span>My Grievances</span>
            </div>
            <h1 className="text-2xl font-bold text-navy-950">My Grievances History</h1>
            <p className="text-xs text-gray-600 mt-0.5">Track and download copies of all your registered complaints</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-600 hover:text-navy-900 bg-white border border-gray-300 rounded"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded transition-colors shadow-sm"
            >
              <Plus size={14} /> File a Grievance
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Filed', val: stats.total, color: 'text-navy-950' },
            { label: 'Pending Review', val: stats.pending, color: 'text-gray-700' },
            { label: 'Under Action', val: stats.inProgress, color: 'text-amber-600' },
            { label: 'Resolved', val: stats.resolved, color: 'text-emerald-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded border border-gray-300 p-3.5 text-center shadow-sm">
              <div className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded border border-gray-300 p-3.5 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, subject, or landmark..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-navy-900 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUSES.map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-2.5 py-1 rounded font-semibold border transition-colors capitalize ${
                    statusFilter === st
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 ${viewMode === 'cards' ? 'bg-navy-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Cards View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 ${viewMode === 'table' ? 'bg-navy-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Table View"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Complaints View (Cards or Table) */}
        <div>
          {isLoading ? (
            <div className="bg-white rounded border border-gray-300 p-12 shadow-sm">
              <LoadingSpinner message="Loading your complaints..." />
            </div>
          ) : isError ? (
            <div className="bg-white rounded border border-gray-300 p-8 shadow-sm">
              <ErrorState onRetry={refetch} message="We couldn't complete this action. Please try again." />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded border border-gray-300 p-10 text-center text-gray-500 text-xs shadow-sm">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-sm text-navy-950">No Grievances Registered Yet</div>
              <p className="mt-1">When you submit a civic grievance, it will appear here with live tracking status.</p>
              <div className="mt-4">
                <Link
                  to="/submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded transition-colors shadow-sm"
                >
                  <Plus size={14} /> Report Grievance
                </Link>
              </div>
            </div>
          ) : viewMode === 'cards' ? (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(c => (
                <div
                  key={c.id || c._id}
                  className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        c.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : c.status === 'action_taken'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-xs font-bold text-navy-950">
                        {c.id}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                      <Link to={`/complaints/${c._id || c.id}`} className="hover:text-navy-900 hover:underline">
                        {c.subject}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                      <Tag size={12} className="text-gray-400" />
                      <span className="font-medium text-gray-700 capitalize">{c.category}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-3">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{c.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500">
                      <Calendar size={11} className="text-gray-400" />
                      <span>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDownload(c)}
                        className="p-1 text-gray-600 hover:text-navy-900 border border-gray-200 rounded"
                        title="Download Slip"
                      >
                        <Download size={13} />
                      </button>
                      <Link
                        to={`/complaints/${c._id || c.id}`}
                        className="px-2.5 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded text-[11px] font-semibold"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                      <th className="py-3 px-4">Grievance ID</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4 text-center">Urgency</th>
                      <th className="py-3 px-4">Filing Date</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map(c => (
                      <tr key={c.id || c._id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-navy-950 whitespace-nowrap">
                          <Link to={`/complaints/${c._id || c.id}`} className="hover:underline">
                            {c.id}
                          </Link>
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <div className="font-bold text-gray-900 line-clamp-1">{c.subject}</div>
                          <div className="text-[11px] text-gray-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-gray-400" />
                            <span>{c.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{c.category}</td>
                        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{c.district || 'Ranchi'}</td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.urgency === 'high' ? 'bg-red-100 text-red-800' : c.urgency === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {c.urgency || 'medium'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            c.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : c.status === 'action_taken'
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/complaints/${c._id || c.id}`}
                              className="px-2.5 py-1 bg-navy-900 text-white rounded text-[11px] font-semibold hover:bg-navy-800"
                            >
                              Details
                            </Link>
                            <button
                              onClick={() => handleDownload(c)}
                              className="p-1 text-gray-600 hover:text-navy-900 border border-gray-300 rounded"
                              title="Download Slip"
                            >
                              <Download size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
