import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { complaintApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { FileText, Plus, Search, Filter, MapPin, Calendar, ChevronRight } from 'lucide-react';

const STATUSES = ['all', 'pending', 'reviewed', 'assigned', 'in_progress', 'resolved', 'duplicate'];

export default function CitizenComplaints() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => complaintApi.getMine().then(r => r.data?.complaints || r.data || []),
    staleTime: 30000,
  });

  const complaints = data || [];
  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.address?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  if (isLoading) return <LoadingSpinner message="Loading your complaints…" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-navy-900">My Complaints</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track the status of your submitted issues</p>
          </div>
          <Link
            to="/submit"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors"
          >
            <Plus size={15} /> Report New Issue
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-navy-800' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-purple-600' },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or address…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-navy-400 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-gray-400 flex-shrink-0" />
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all capitalize ${
                    statusFilter === s
                      ? 'bg-navy-800 text-white border-navy-800'
                      : 'text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={complaints.length === 0 ? "No complaints submitted yet" : "No results found"}
            message={complaints.length === 0 ? "Be the first to report an issue in your area!" : "Try adjusting your search or filters."}
            action={complaints.length === 0 && (
              <Link to="/submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 rounded-lg">
                Report Your First Issue
              </Link>
            )}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <div
                key={c._id}
                onClick={() => navigate(`/complaints/${c._id}`)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-navy-200 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <StatusBadge status={c.status} />
                      <span className="badge bg-gray-100 text-gray-600 border-gray-200">{c.category}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 mt-1.5">{c.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{c.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      {c.address && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {c.address}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {c.images?.length > 0 && (
                        <span className="text-blue-400">📷 {c.images.length} photo{c.images.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
