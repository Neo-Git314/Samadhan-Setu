import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import {
  Search, Filter, ChevronRight, ChevronDown, Calendar, MapPin,
  User, Tag, RefreshCw, ExternalLink, Check, Shield, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_STATUSES = ['pending', 'reviewed', 'assigned', 'in_progress', 'resolved', 'duplicate'];

export default function AdminComplaints() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-complaints', statusFilter],
    queryFn: () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      return complaintApi.getAll(params).then(r => r.data?.complaints || r.data || []);
    },
    staleTime: 20000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => complaintApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
    }
  });

  const complaints = data || [];
  const filtered = complaints.filter(c =>
    !search ||
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase()) ||
    c.submittedBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    flagged: complaints.filter(c => c.fraudFlags?.length > 0).length,
  };

  if (isLoading) return <LoadingSpinner message="Loading complaints…" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-navy-900">Complaint Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Review, classify, and route citizen complaints</p>
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy-800 bg-white border border-gray-200 px-3 py-2 rounded-lg">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[
            { label: 'Total', value: stats.total, cls: 'text-navy-800' },
            { label: 'Pending', value: stats.pending, cls: 'text-amber-600' },
            { label: 'In Progress', value: stats.inProgress, cls: 'text-purple-600' },
            { label: 'Resolved', value: stats.resolved, cls: 'text-green-600' },
            { label: 'Flagged', value: stats.flagged, cls: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <div className={`text-xl font-bold ${s.cls}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, address, citizen name…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-navy-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', ...ALL_STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all capitalize ${
                  statusFilter === s ? 'bg-navy-800 text-white border-navy-800' : 'text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState title="No complaints found" message="Try changing filters or refresh the page." />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Issue</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Actions</div>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map(c => (
                <div key={c._id}>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors items-center"
                    onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                  >
                    <div className="sm:col-span-4">
                      <div className="flex items-center gap-2 mb-1">
                        {c.fraudFlags?.length > 0 && <Shield size={12} className="text-amber-500 flex-shrink-0" title="Integrity flags" />}
                        <span className="text-sm font-medium text-gray-800 line-clamp-1">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <User size={10} /> {c.submittedBy?.name || 'Unknown'}
                        {c.address && <><MapPin size={10} />{c.address.slice(0, 25)}…</>}
                      </div>
                    </div>
                    <div className="sm:col-span-2 text-xs text-gray-600">{c.category}</div>
                    <div className="sm:col-span-2"><StatusBadge status={c.status} /></div>
                    <div className="sm:col-span-2 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/complaints/${c._id}`); }}
                        className="text-xs text-navy-700 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={11} /> View
                      </button>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform ${expandedId === c._id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Row */}
                  {expandedId === c._id && (
                    <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 animate-fade-in">
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-2 line-clamp-3">{c.description}</p>
                          {c.fraudFlags?.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800 mb-2">
                              <AlertTriangle size={11} className="inline mr-1" />
                              {c.fraudFlags.join(' • ')}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Update Status:</p>
                          {ALL_STATUSES.map(s => (
                            <button
                              key={s}
                              onClick={() => statusMutation.mutate({ id: c._id, status: s })}
                              disabled={c.status === s || statusMutation.isPending}
                              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-all capitalize ${
                                c.status === s
                                  ? 'bg-navy-100 text-navy-700 border-navy-200 cursor-default'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300 hover:text-navy-700'
                              }`}
                            >
                              {c.status === s && <Check size={10} />}
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
