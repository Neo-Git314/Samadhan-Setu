import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { universityApi, projectApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import {
  GraduationCap, Award, CheckCircle2, Flame, Building2,
  BookOpen, Mail, MapPin, ExternalLink, ShieldCheck, Sparkles
} from 'lucide-react';

export default function UniversityProfile() {
  const { user } = useAuth();
  const [selectedUniId, setSelectedUniId] = useState('');

  const { data: universities = [], isLoading: loadingUnis } = useQuery({
    queryKey: ['universities-list'],
    queryFn: () => universityApi.getAll().then(r => r.data || []),
    staleTime: 60000,
  });

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

  const activeUni = universities.find(u => u._id === selectedUniId) || universities[0];

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects-uni', selectedUniId],
    queryFn: () => projectApi.getAll({ universityId: selectedUniId }).then(r => r.data || []),
    enabled: !!selectedUniId,
  });

  if (loadingUnis) return <LoadingSpinner message="Retrieving institutional records..." />;

  const rep = activeUni?.reputationScore || 0;
  const tier = rep >= 50 ? 'Tier 1 Apex Innovator' : rep >= 20 ? 'Tier 2 Emerging R&D Hub' : 'Accredited Participant';
  const tierColor = rep >= 50 ? 'text-amber-500 bg-amber-50 border-amber-200' : 'text-blue-600 bg-blue-50 border-blue-200';

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Switcher & Overview Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-navy-900 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <GraduationCap size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`badge border text-xs font-bold ${tierColor}`}>
                    <Award size={12} className="inline mr-1" />
                    {tier}
                  </span>
                  {activeUni?.incubationFacility && (
                    <span className="badge bg-green-50 text-green-700 border-green-200">
                      <ShieldCheck size={11} className="inline mr-1" /> Incubation Center Certified
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-navy-900">{activeUni?.name || 'Institution Profile'}</h1>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  {activeUni?.contactEmail && (
                    <span className="flex items-center gap-1"><Mail size={12} /> {activeUni.contactEmail}</span>
                  )}
                  {activeUni?.location?.lat && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {activeUni.location.lat.toFixed(3)}, {activeUni.location.lng.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Selector if multiple */}
            {universities.length > 1 && (
              <div className="min-w-[220px]">
                <label className="block text-[11px] text-gray-400 font-semibold mb-1 uppercase">Switch Institution</label>
                <select
                  value={selectedUniId}
                  onChange={e => setSelectedUniId(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none bg-white font-medium text-gray-800"
                >
                  {universities.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Reputation & Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Sparkles size={20} />
            </div>
            <div className="text-3xl font-black text-navy-900">{rep} pts</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Institutional Reputation Score</div>
            <div className="text-[10px] text-gray-400 mt-1">(+10 per resolved civic R&D project)</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-3xl font-black text-green-700">{activeUni?.completedProjectsCount || 0}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Completed Civic Solutions</div>
            <div className="text-[10px] text-gray-400 mt-1">Verified societal impacts</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <BookOpen size={20} />
            </div>
            <div className="text-3xl font-black text-blue-800">{activeUni?.activeProjectsCount || projects.length}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Active R&D Pipelines</div>
            <div className="text-[10px] text-gray-400 mt-1">In progress across faculties</div>
          </div>
        </div>

        {/* Disciplines & Research Keywords */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-navy-900 mb-4">Academic & Research Specializations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Disciplines</h3>
              <div className="flex flex-wrap gap-2">
                {(activeUni?.disciplines?.length > 0 ? activeUni.disciplines : ['Civil Engineering', 'Environmental Science', 'IoT & Embedded Systems', 'Urban Planning']).map((d, i) => (
                  <span key={i} className="px-3 py-1 bg-navy-50 text-navy-800 rounded-lg text-xs font-medium border border-navy-100">
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Vector Search Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {(activeUni?.researchKeywords?.length > 0 ? activeUni.researchKeywords : ['water purification', 'smart drainage', 'pothole detection', 'waste processing']).map((k, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Roster */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy-900">Affiliated Civic Innovation Projects</h2>
            <Link to="/university/challenges" className="text-xs font-bold text-navy-800 hover:underline">
              Browse Open Challenges →
            </Link>
          </div>

          {loadingProjects ? (
            <LoadingSpinner message="Loading affiliated projects..." />
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              No projects initiated yet. Go to <Link to="/university/challenges" className="text-navy-800 font-semibold underline">Challenges</Link> to adopt civic grievances.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {projects.map(p => (
                <div key={p._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-bold text-gray-800 truncate">
                        {p.complaintId?.title || 'Civic Research Project'}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Milestones: {p.milestones?.filter(m => m.status === 'done').length || 0} / {p.milestones?.length || 0} completed
                    </div>
                  </div>
                  <Link
                    to={`/university/projects/${p._id}`}
                    className="text-xs font-semibold text-navy-800 hover:text-navy-950 flex items-center gap-1 flex-shrink-0"
                  >
                    Manage <ExternalLink size={12} />
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
