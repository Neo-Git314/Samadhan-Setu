import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintApi, analyticsApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, Plus, TrendingUp, CheckCircle, Clock, MapPin, ChevronRight, User } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'text-navy-800', bg = 'bg-navy-50' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
      <div className={`${bg} rounded-lg p-2.5 flex-shrink-0`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function CitizenDashboard() {
  const { user } = useAuth();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => complaintApi.getMine().then(r => r.data?.complaints || r.data || []),
    staleTime: 30000,
  });

  if (isLoading) return <LoadingSpinner message="Loading your dashboard…" />;

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const recent = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl text-white p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
              <User size={18} className="text-gray-200" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p className="text-gray-300 text-sm">Citizen Dashboard — Samadhan Setu Portal</p>
            </div>
          </div>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} /> Report a New Issue
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={FileText} label="Total Submitted" value={stats.total} />
          <StatCard icon={Clock} label="Pending Review" value={stats.pending} color="text-amber-600" bg="bg-amber-50" />
          <StatCard icon={TrendingUp} label="In Progress" value={stats.inProgress} color="text-purple-600" bg="bg-purple-50" />
          <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="text-green-600" bg="bg-green-50" />
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Complaints</h2>
            <Link to="/citizen/complaints" className="text-xs text-navy-700 font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              <FileText size={28} className="mx-auto mb-2 text-gray-300" />
              No complaints yet. <Link to="/submit" className="text-navy-700 font-medium hover:underline">Report your first issue →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map(c => (
                <Link key={c._id} to={`/complaints/${c._id}`} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <StatusBadge status={c.status} />
                      <span className="text-xs text-gray-400">{c.category}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      {c.address && <span className="flex items-center gap-1"><MapPin size={10} /> {c.address}</span>}
                      <span>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
