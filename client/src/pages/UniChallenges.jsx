import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { universityApi, complaintApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import {
  GraduationCap, Search, Filter, ArrowRight, CheckCircle,
  Building2, MapPin, Calendar, Tag, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react';

export default function UniChallenges() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUniId, setSelectedUniId] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [acceptingId, setAcceptingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all universities so user can select their institution if not directly bound
  const { data: universities = [] } = useQuery({
    queryKey: ['universities-list'],
    queryFn: () => universityApi.getAll().then(r => r.data || []),
    staleTime: 60000,
  });

  // Auto-select university matching user's institution or first one
  useEffect(() => {
    if (universities.length > 0 && !selectedUniId) {
      const match = universities.find(u => 
        u.userId?._id === user?._id || 
        u.userId === user?._id || 
        (user?.institution && u.name.toLowerCase().includes(user.institution.toLowerCase()))
      );
      setSelectedUniId(match ? match._id : universities[0]._id);
    }
  }, [universities, user, selectedUniId]);

  // Fetch matched challenges for the selected university
  const { data: challenges = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['uni-challenges', selectedUniId],
    queryFn: async () => {
      if (!selectedUniId) return [];
      try {
        const res = await universityApi.getChallenges(selectedUniId);
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (err) {
        console.warn('Failed to load university-specific challenges, falling back to open complaints:', err);
      }
      // Fallback: fetch open, unassigned complaints
      const allComplaints = await complaintApi.getAll({ status: 'reviewed' });
      return (allComplaints.data?.complaints || allComplaints.data || []).filter(c => !c.assignedUniversity);
    },
    enabled: !!selectedUniId,
  });

  const acceptMutation = useMutation({
    mutationFn: ({ uniId, complaintId }) => universityApi.acceptChallenge(uniId, complaintId),
    onSuccess: (res) => {
      setSuccessMsg('Challenge accepted! R&D Project initiated successfully.');
      queryClient.invalidateQueries({ queryKey: ['uni-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      const createdProject = res.data?.project;
      setTimeout(() => {
        if (createdProject?._id) {
          navigate(`/university/projects/${createdProject._id}`);
        } else {
          navigate('/projects');
        }
      }, 1200);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Could not accept challenge. Please try again.');
    },
    onSettled: () => {
      setAcceptingId(null);
    }
  });

  const handleAccept = (complaintId) => {
    if (!selectedUniId) {
      alert('Please select an active university first.');
      return;
    }
    setAcceptingId(complaintId);
    acceptMutation.mutate({ uniId: selectedUniId, complaintId });
  };

  const filteredChallenges = challenges.filter(c => {
    const matchSearch = !search || 
      c.title?.toLowerCase().includes(search.toLowerCase()) || 
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const activeUni = universities.find(u => u._id === selectedUniId);

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-navy-900 rounded-2xl text-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-saffron-500 text-white font-semibold">Academic Innovation Stream</span>
                <span className="text-xs text-gray-300">AI Problem Matching Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Civic R&D Challenge Arena</h1>
              <p className="text-gray-300 text-sm mt-1 max-w-2xl">
                Adopt real civic problems reported by citizens, build academic solutions, and earn institutional reputation points.
              </p>
            </div>

            {/* University Selector */}
            <div className="bg-navy-800 p-3 rounded-xl border border-navy-700 min-w-[240px]">
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Active Institution
              </label>
              <select
                value={selectedUniId}
                onChange={e => setSelectedUniId(e.target.value)}
                className="w-full bg-navy-950 border border-navy-600 text-white text-xs rounded-lg p-2 font-medium focus:ring-1 focus:ring-saffron-400 outline-none"
              >
                {universities.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} (Rep: {u.reputationScore || 0})
                  </option>
                ))}
              </select>
              {activeUni && (
                <div className="mt-2 text-[10px] text-saffron-300 flex items-center justify-between">
                  <span>Completed: {activeUni.completedProjectsCount || 0}</span>
                  <span>Active: {activeUni.activeProjectsCount || 0}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in text-sm font-medium">
            <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
            <span>{successMsg} Redirecting to project workspace...</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search challenges by title, category, keywords..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-navy-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 flex-shrink-0" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:border-navy-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Road & Infrastructure">Road & Infrastructure</option>
              <option value="Sanitation & Sewage">Sanitation & Sewage</option>
              <option value="Garbage Collection">Garbage Collection</option>
              <option value="Air Pollution">Air Pollution</option>
            </select>
          </div>
        </div>

        {/* Challenge Cards Grid */}
        {isLoading ? (
          <LoadingSpinner message="Matching civic challenges to research profile..." />
        ) : isError ? (
          <ErrorState onRetry={refetch} message="Failed to load challenge arena." />
        ) : filteredChallenges.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No matching civic challenges"
            message="All current issues in this domain have already been assigned or resolved."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredChallenges.map(c => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-navy-300 transition-all flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="badge bg-navy-50 text-navy-800 border-navy-200">
                      {c.category || 'Civic'}
                    </span>
                    {c.aiClassification?.urgency && (
                      <span className={`badge ${
                        c.aiClassification.urgency === 'high' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {c.aiClassification.urgency} urgency
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {c.address ? c.address.slice(0, 22) + '...' : 'Area tagged'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/complaints/${c._id}`)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-center"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleAccept(c._id)}
                      disabled={acceptingId === c._id}
                      className="flex-1 py-2 px-3 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-lg flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                    >
                      {acceptingId === c._id ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={12} className="text-saffron-400" />
                          Accept & R&D
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
