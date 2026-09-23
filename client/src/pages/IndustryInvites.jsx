import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import {
  Briefcase, CheckCircle2, XCircle, Building2, Calendar,
  DollarSign, ExternalLink, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IndustryInvites() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending'); // 'pending' | 'active'

  // Fetch projects invited to this industry partner
  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['industry-projects'],
    queryFn: async () => {
      try {
        const res = await projectApi.getMine();
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (err) {
        console.warn('Failed to getMine projects, fetching all relevant:', err);
      }
      // Fallback: fetch all projects
      const res = await projectApi.getAll();
      return res.data || [];
    },
    staleTime: 20000,
  });

  const responseMutation = useMutation({
    mutationFn: ({ id, accepted }) => projectApi.industryResponse(id, { accepted }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['industry-projects'] });
      alert(variables.accepted ? 'Project successfully approved for CSR sponsorship!' : 'Invitation declined.');
    },
    onError: (err) => alert(err.response?.data?.message || 'Failed to submit response.'),
  });

  if (isLoading) return <LoadingSpinner message="Checking industry partnership desk..." />;
  if (isError) return <ErrorState onRetry={refetch} message="Could not load project invitations." />;

  const pendingInvites = projects.filter(p => p.status === 'proposed' || (!p.status || p.status === 'pending'));
  const activeProjects = projects.filter(p => p.status === 'approved' || p.status === 'in_progress' || p.status === 'completed');

  const currentList = tab === 'pending' ? pendingInvites : activeProjects;

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-2xl text-white p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-purple-600 text-white font-semibold">CSR & Innovation Desk</span>
                <span className="text-xs text-gray-300">Industry-Academia Gateway</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">Project Sponsorship & Collaboration</h1>
              <p className="text-gray-300 text-sm mt-1 max-w-2xl">
                Fund and accelerate university-led solutions for validated municipal and civic problems.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/industry/profile"
                className="px-4 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-700 border border-navy-600 rounded-lg shadow-sm"
              >
                View CSR Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab('pending')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'pending'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Invitations
            <span className="badge bg-amber-100 text-amber-800 text-[10px]">
              {pendingInvites.length}
            </span>
          </button>
          <button
            onClick={() => setTab('active')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'active'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Sponsored Projects
            <span className="badge bg-green-100 text-green-800 text-[10px]">
              {activeProjects.length}
            </span>
          </button>
        </div>

        {/* Content List */}
        {currentList.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={tab === 'pending' ? 'No pending invitations' : 'No active projects'}
            message={tab === 'pending' ? 'Universities will invite your organization as relevant civic R&D proposals are initiated.' : 'Approved projects will appear here.'}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {currentList.map(p => {
              const comp = p.complaintId || {};
              const uni = p.universityId || {};
              const milestones = p.milestones || [];
              const doneMilestones = milestones.filter(m => m.status === 'done').length;

              return (
                <div key={p._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <StatusBadge status={p.status} />
                      <span className="text-xs text-gray-400 font-mono">ID: {p._id.slice(-8)}</span>
                    </div>

                    <h2 className="text-base font-bold text-navy-900 leading-snug mb-2">
                      {comp.title || 'Civic Research Initiative'}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <Building2 size={13} className="text-navy-700" />
                      <span className="font-semibold">{uni.name || 'Accredited University'}</span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                      {comp.description || 'University proposed R&D project addressing municipal challenge.'}
                    </p>

                    {/* Milestones Preview */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
                      <div className="flex justify-between text-xs text-gray-600 font-medium mb-1">
                        <span>Milestones Progress</span>
                        <span>{doneMilestones} / {milestones.length} Done</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-civic-green h-full rounded-full"
                          style={{ width: `${milestones.length > 0 ? (doneMilestones / milestones.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/university/projects/${p._id}`}
                      className="text-xs font-bold text-navy-800 hover:underline flex items-center gap-1"
                    >
                      Workspace <ExternalLink size={12} />
                    </Link>

                    {tab === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => responseMutation.mutate({ id: p._id, accepted: false })}
                          disabled={responseMutation.isPending}
                          className="py-1.5 px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-lg"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => responseMutation.mutate({ id: p._id, accepted: true })}
                          disabled={responseMutation.isPending}
                          className="py-1.5 px-3 text-xs font-bold text-white bg-civic-green hover:bg-green-700 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 size={13} />
                          Approve CSR Sponsorship
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
