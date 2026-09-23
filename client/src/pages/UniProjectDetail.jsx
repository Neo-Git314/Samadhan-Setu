import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, industryApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import {
  ArrowLeft, CheckCircle2, Clock, Plus, Trash2, Users,
  Building, Briefcase, Award, Calendar, ExternalLink,
  ShieldCheck, AlertCircle, Sparkles, Send
} from 'lucide-react';

export default function UniProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newMilestone, setNewMilestone] = useState({ title: '', dueDate: '' });
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const [newMember, setNewMember] = useState({ name: '', role: 'student' });
  const [showAddMember, setShowAddMember] = useState(false);

  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  // Fetch Project
  const { data: project, isLoading, isError, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getById(id).then(r => r.data),
    enabled: !!id,
  });

  // Fetch Industry Partners for invitation dropdown
  const { data: industryPartners = [] } = useQuery({
    queryKey: ['industry-partners'],
    queryFn: () => industryApi.getAll().then(r => r.data || []),
    staleTime: 60000,
  });

  // Mutation: Milestones
  const milestoneMutation = useMutation({
    mutationFn: (payload) => projectApi.updateMilestones(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      setShowAddMilestone(false);
      setNewMilestone({ title: '', dueDate: '' });
    },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update milestone.'),
  });

  // Mutation: Team
  const teamMutation = useMutation({
    mutationFn: (payload) => projectApi.updateTeam(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      setShowAddMember(false);
      setNewMember({ name: '', role: 'student' });
    },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update team.'),
  });

  // Mutation: Invite Industry Partner
  const inviteMutation = useMutation({
    mutationFn: (industryPartnerId) => projectApi.inviteIndustry(id, { industryPartnerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      alert('Invitation sent successfully to industry partner!');
    },
    onError: (err) => alert(err.response?.data?.message || 'Failed to send invitation.'),
  });

  if (isLoading) return <LoadingSpinner message="Loading R&D Project workspace..." />;
  if (isError || !project) return <ErrorState onRetry={refetch} message="Could not find this project." />;

  const p = project;
  const milestones = p.milestones || [];
  const team = p.team || [];
  const complaint = p.complaintId || {};
  const completedCount = milestones.filter(m => m.status === 'done').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const handleToggleMilestone = (m) => {
    const nextStatus = m.status === 'done' ? 'pending' : 'done';
    milestoneMutation.mutate({
      action: 'update',
      milestoneId: m._id,
      milestone: { status: nextStatus },
    });
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.title.trim()) return;
    milestoneMutation.mutate({
      action: 'add',
      milestone: {
        title: newMilestone.title.trim(),
        dueDate: newMilestone.dueDate || null,
        status: 'pending',
      }
    });
  };

  const handleAddTeamMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    teamMutation.mutate({
      action: 'add',
      member: {
        name: newMember.name.trim(),
        role: newMember.role,
      }
    });
  };

  const handleRemoveMember = (memberId) => {
    if (!confirm('Remove this member from the project?')) return;
    teamMutation.mutate({
      action: 'remove',
      memberId,
    });
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Back & Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy-900 mb-3 font-medium"
          >
            <ArrowLeft size={14} /> Back to Projects / Challenges
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <StatusBadge status={p.status} />
                  <span className="badge bg-navy-50 text-navy-800 border-navy-200">
                    {p.universityId?.name || 'Academic Project'}
                  </span>
                  {p.reputationAwarded && (
                    <span className="badge bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <Award size={11} /> +10 Reputation Awarded
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-navy-900 leading-snug">
                  {complaint.title || 'Civic R&D Innovation Project'}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Project ID: <code className="font-mono">{p._id}</code> · Linked Grievance ID: <code className="font-mono">{complaint._id || 'N/A'}</code>
                </p>
              </div>

              {/* Progress Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-w-[200px] text-center">
                <div className="text-2xl font-black text-navy-900">{progressPercent}%</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  {completedCount} of {milestones.length} Milestones Done
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-civic-green h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column: Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Milestones Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-civic-green" />
                    Project Deliverables & Milestones
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Completing all milestones automatically resolves the civic issue and awards institutional reputation.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMilestone(!showAddMilestone)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg flex items-center gap-1"
                >
                  <Plus size={13} /> Add Milestone
                </button>
              </div>

              {/* Add Milestone Form */}
              {showAddMilestone && (
                <form onSubmit={handleAddMilestone} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 space-y-3 animate-fade-in">
                  <div className="text-xs font-bold text-gray-700">New Project Milestone</div>
                  <div>
                    <input
                      value={newMilestone.title}
                      onChange={e => setNewMilestone(m => ({ ...m, title: e.target.value }))}
                      placeholder="e.g., Field site inspection & sensor deployment"
                      className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none focus:border-navy-500 bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-500 mb-1">Target Due Date</label>
                      <input
                        type="date"
                        value={newMilestone.dueDate}
                        onChange={e => setNewMilestone(m => ({ ...m, dueDate: e.target.value }))}
                        className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-navy-500 bg-white"
                      />
                    </div>
                    <div className="flex items-end gap-2 pt-4">
                      <button
                        type="submit"
                        disabled={milestoneMutation.isPending}
                        className="px-4 py-2 text-xs font-bold text-white bg-civic-green hover:bg-green-700 rounded-lg"
                      >
                        {milestoneMutation.isPending ? 'Saving...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddMilestone(false)}
                        className="px-3 py-2 text-xs text-gray-600 bg-gray-200 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Milestone List */}
              {milestones.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  No milestones defined yet. Click "Add Milestone" above to structure the research pipeline.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {milestones.map((m, idx) => {
                    const isDone = m.status === 'done';
                    return (
                      <div key={m._id || idx} className="py-3 flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleMilestone(m)}
                            disabled={milestoneMutation.isPending}
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                              isDone ? 'bg-civic-green border-civic-green text-white' : 'border-gray-300 hover:border-navy-800'
                            }`}
                          >
                            {isDone && <CheckCircle2 size={13} />}
                          </button>
                          <div className="min-w-0">
                            <div className={`text-xs font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                              {m.title}
                            </div>
                            {m.dueDate && (
                              <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Calendar size={10} /> Due: {new Date(m.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className={`badge text-[10px] ${isDone ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {isDone ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Linked Grievance Context */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-navy-900 mb-2">Original Civic Grievance Details</h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {complaint.description || 'No description provided.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span><b>Category:</b> {complaint.category || 'N/A'}</span>
                <span><b>Location:</b> {complaint.address || 'Geo-tagged'}</span>
                <Link to={`/complaints/${complaint._id}`} className="text-navy-800 hover:underline flex items-center gap-1 font-semibold">
                  Inspect Public Grievance <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar: Team & Industry Collaboration */}
          <div className="space-y-6">
            {/* Team Roster */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <Users size={16} className="text-navy-800" /> Research Team ({team.length})
                </h3>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-xs text-navy-800 hover:underline font-semibold"
                >
                  + Add Member
                </button>
              </div>

              {showAddMember && (
                <form onSubmit={handleAddTeamMember} className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-3 space-y-2 animate-fade-in">
                  <input
                    value={newMember.name}
                    onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))}
                    placeholder="Researcher / Student Name"
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none bg-white"
                    required
                  />
                  <select
                    value={newMember.role}
                    onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none bg-white"
                  >
                    <option value="student">Student Researcher</option>
                    <option value="faculty_mentor">Faculty Mentor</option>
                  </select>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={teamMutation.isPending}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-navy-900 rounded-lg"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      className="px-2 py-1.5 text-xs text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {team.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center">No team members assigned.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {team.map((member, i) => (
                    <div key={member._id || i} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{member.name}</div>
                        <div className="text-[10px] text-gray-400 capitalize">{member.role?.replace('_', ' ')}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-gray-300 hover:text-red-500 p-1"
                        title="Remove member"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Industry Partnership & Sponsorship */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-3">
                <Briefcase size={16} className="text-saffron-600" /> Industry Collaboration
              </h3>

              {p.industryPartnerId ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-gray-800">
                    {p.industryPartnerId.name || 'Industry Partner Linked'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Domain: {p.industryPartnerId.domains?.join(', ') || 'Corporate CSR'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                      {p.status === 'approved' ? 'Active CSR Sponsor' : 'Invitation Pending'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    Invite an industry sponsor to provide CSR capital, mentorship, and commercialization support.
                  </p>
                  <select
                    value={selectedPartnerId}
                    onChange={e => setSelectedPartnerId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="">-- Choose Industry Partner --</option>
                    {industryPartners.map(partner => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name} ({partner.domains?.slice(0, 2).join(', ') || 'CSR'})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!selectedPartnerId) { alert('Select an industry partner.'); return; }
                      inviteMutation.mutate(selectedPartnerId);
                    }}
                    disabled={inviteMutation.isPending || !selectedPartnerId}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-500 rounded-lg flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Send size={13} />
                    {inviteMutation.isPending ? 'Sending...' : 'Invite Partner to Project'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
