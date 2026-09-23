import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { industryApi, projectApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import {
  Briefcase, Building2, Mail, Award, CheckCircle2,
  TrendingUp, ExternalLink, ShieldCheck, HeartHandshake
} from 'lucide-react';

export default function IndustryProfile() {
  const { user } = useAuth();
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  const { data: partners = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['industry-partners'],
    queryFn: () => industryApi.getAll().then(r => r.data || []),
    staleTime: 60000,
  });

  const activePartner = partners.find(p => p._id === selectedPartnerId) || partners[0];

  const { data: sponsoredProjects = [] } = useQuery({
    queryKey: ['industry-projects-sponsored', activePartner?._id],
    queryFn: () => projectApi.getAll({ industryPartnerId: activePartner?._id }).then(r => r.data || []),
    enabled: !!activePartner?._id,
  });

  if (isLoading) return <LoadingSpinner message="Loading Corporate CSR Profile..." />;
  if (isError) return <ErrorState onRetry={refetch} message="Failed to load industry partner records." />;

  const completedCount = sponsoredProjects.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-900 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Briefcase size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-purple-50 text-purple-700 border-purple-200">
                    <ShieldCheck size={11} className="inline mr-1" />
                    Verified CSR Partner
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-navy-900">{activePartner?.name || 'Industry Partner'}</h1>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  {activePartner?.contactEmail && (
                    <span className="flex items-center gap-1"><Mail size={12} /> {activePartner.contactEmail}</span>
                  )}
                  <span>Registered CSR Benefactor</span>
                </div>
              </div>
            </div>

            {partners.length > 1 && (
              <div className="min-w-[220px]">
                <label className="block text-[11px] text-gray-400 font-semibold mb-1 uppercase">Switch Organization</label>
                <select
                  value={selectedPartnerId}
                  onChange={e => setSelectedPartnerId(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none bg-white font-medium"
                >
                  {partners.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <HeartHandshake size={20} />
            </div>
            <div className="text-3xl font-black text-navy-900">{sponsoredProjects.length}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Total Sponsored Projects</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-3xl font-black text-green-700">{completedCount}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Successfully Commercialized / Deployed</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <TrendingUp size={20} />
            </div>
            <div className="text-3xl font-black text-blue-800">100%</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">CSR Compliance & Verification</div>
          </div>
        </div>

        {/* Priority Focus Areas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-navy-900 mb-3">Corporate Focus Domains</h2>
          <div className="flex flex-wrap gap-2">
            {(activePartner?.domains?.length > 0 ? activePartner.domains : ['Clean Water & Sanitation', 'Sustainable Infrastructure', 'Smart Mobility', 'Renewable Energy']).map((d, i) => (
              <span key={i} className="px-3.5 py-1.5 bg-purple-50 text-purple-800 rounded-lg text-xs font-semibold border border-purple-100">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Sponsored Projects */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy-900">Sponsored Civic Innovation Portfolio</h2>
            <Link to="/industry/invites" className="text-xs font-bold text-navy-800 hover:underline">
              View All Invitations →
            </Link>
          </div>

          {sponsoredProjects.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              No sponsored projects active yet. Check <Link to="/industry/invites" className="text-navy-800 underline font-semibold">Invitations</Link> to review university proposals.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sponsoredProjects.map(p => (
                <div key={p._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-bold text-gray-800">{p.complaintId?.title || 'Civic Research Project'}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Partnered with: <b>{p.universityId?.name || 'University'}</b>
                    </div>
                  </div>
                  <Link
                    to={`/university/projects/${p._id}`}
                    className="text-xs font-semibold text-navy-800 hover:text-navy-950 flex items-center gap-1"
                  >
                    View <ExternalLink size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
