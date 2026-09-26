import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../api/endpoints';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import {
  RefreshCw, FileText, ArrowRight, AlertCircle, Building2, Users, CheckCircle2, Award
} from 'lucide-react';

const COLORS = ['#0F2C59', '#E65100', '#2E7D32', '#6D28D9', '#0284C7', '#D97706', '#DC2626', '#059669', '#4F46E5', '#9333EA'];

export default function AdminDashboard() {
  // Query backend analytics summary
  const { data: summaryData, isLoading: loadingSummary, refetch: refetchSummary } = useQuery({
    queryKey: ['admin-analytics-summary'],
    queryFn: () => analyticsApi.getSummary().then(r => r.data?.summary || r.data || {}),
    staleTime: 30000,
  });

  // Query backend 30-day trends
  const { data: trendsData = [], isLoading: loadingTrends, refetch: refetchTrends } = useQuery({
    queryKey: ['admin-analytics-trends'],
    queryFn: () => analyticsApi.getTrends().then(r => Array.isArray(r.data) ? r.data : []),
    staleTime: 30000,
  });

  const refetchAll = () => {
    refetchSummary();
    refetchTrends();
  };

  const totalComplaints = summaryData?.totalComplaints ?? 0;
  const totalUniversities = summaryData?.totalUniversitiesParticipating ?? 0;
  const totalIndustry = summaryData?.totalIndustryPartnersEngaged ?? 0;
  const totalProjectsCompleted = summaryData?.totalProjectsCompleted ?? 0;

  // Chart 1: By Category
  const categoryData = useMemo(() => {
    if (!summaryData?.byCategory || !Array.isArray(summaryData.byCategory)) return [];
    return summaryData.byCategory.map(c => ({
      name: (c.category || 'Uncategorized').replace(/_/g, ' '),
      count: c.count || 0
    }));
  }, [summaryData]);

  // Chart 2: By Status
  const statusData = useMemo(() => {
    if (!summaryData?.byStatus || !Array.isArray(summaryData.byStatus)) return [];
    return summaryData.byStatus.map(s => ({
      name: (s.status || 'Unknown').replace(/_/g, ' '),
      count: s.count || 0
    }));
  }, [summaryData]);

  // Chart 3: By District
  const districtData = useMemo(() => {
    if (!summaryData?.byDistrict || !Array.isArray(summaryData.byDistrict)) return [];
    return summaryData.byDistrict.map(d => ({
      name: d.district || 'Unassigned',
      count: d.count || 0
    }));
  }, [summaryData]);

  // Chart 4: 30-Day Trend
  const formattedTrendData = useMemo(() => {
    if (!trendsData || !Array.isArray(trendsData)) return [];
    return trendsData.map(t => ({
      date: t.date ? t.date.slice(5) : '', // 'MM-DD'
      count: t.count || 0
    }));
  }, [trendsData]);

  const isEmpty = totalComplaints === 0 && !loadingSummary;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 font-sans text-gray-900" id="main-content">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── HEADER ───────────────────────────────────────────── */}
        <div className="bg-navy-950 text-white rounded border border-navy-800 p-6 shadow-md border-b-4 border-b-saffron-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-900/60 text-red-200 border border-red-700/50 px-2 py-0.5 rounded">
                Departmental Administration
              </span>
              <span className="text-xs text-gray-400 font-mono">Control Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              State Civic Grievance Monitoring & Analytics
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              Real-time nodal department triage, SLA compliance enforcement, and academic challenge matching.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={refetchAll}
              className="p-2 bg-navy-900 hover:bg-navy-800 text-white rounded border border-navy-700 text-xs flex items-center gap-1.5"
              title="Refresh Analytics"
            >
              <RefreshCw size={14} className={loadingSummary || loadingTrends ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/complaints"
              className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FileText size={14} />
              <span>Manage & Triage Grievances</span>
            </Link>
          </div>
        </div>

        {/* ── EMPTY STATE BANNER ────────────────────────────────── */}
        {isEmpty && (
          <div className="bg-amber-50 border border-amber-300 rounded p-6 text-center text-amber-900">
            <AlertCircle size={28} className="mx-auto text-amber-600 mb-2" />
            <h2 className="text-base font-bold">No data available yet</h2>
            <p className="text-xs text-amber-700 mt-1">
              Complaints and telemetry data will appear here once citizens begin registering grievances or after running database seed.
            </p>
          </div>
        )}

        {/* ── 4 SUMMARY METRICS CARDS ───────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Complaints</div>
              <FileText size={16} className="text-navy-900" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950 font-mono mt-1">{totalComplaints}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Aggregated civic grievances</div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Universities Participating</div>
              <Building2 size={16} className="text-blue-700" />
            </div>
            <div className="text-2xl font-extrabold text-blue-900 font-mono mt-1">{totalUniversities}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Academic R&D institutions</div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Industry Partners</div>
              <Users size={16} className="text-purple-700" />
            </div>
            <div className="text-2xl font-extrabold text-purple-900 font-mono mt-1">{totalIndustry}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">CSR, MSME & Startup collaborators</div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Completed Projects</div>
              <CheckCircle2 size={16} className="text-emerald-700" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{totalProjectsCompleted}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Fully resolved R&D milestones</div>
          </div>
        </div>

        {/* ── 4 ANALYTICS CHARTS SECTION ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chart 1: Complaints by Category (Bar Chart) */}
          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-xs uppercase tracking-wide">
                1. Complaints by Category
              </h3>
              <span className="text-[10px] text-gray-400">Distribution</span>
            </div>
            {categoryData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                No data available yet
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" angle={-20} textAnchor="end" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B192C', color: '#fff', fontSize: '11px', borderRadius: '4px' }}
                    />
                    <Bar dataKey="count" fill="#0F2C59" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Complaints by Status (Pie Chart) */}
          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-xs uppercase tracking-wide">
                2. Complaints by Status
              </h3>
              <span className="text-[10px] text-gray-400">Lifecycle</span>
            </div>
            {statusData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                No data available yet
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {statusData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B192C', color: '#fff', fontSize: '11px', borderRadius: '4px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 3: Complaints by District */}
          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-xs uppercase tracking-wide">
                3. Complaints by District
              </h3>
              <span className="text-[10px] text-gray-400">Geographic Spread</span>
            </div>
            {districtData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                No data available yet
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" angle={-20} textAnchor="end" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B192C', color: '#fff', fontSize: '11px', borderRadius: '4px' }}
                    />
                    <Bar dataKey="count" fill="#1E3E62" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 4: 30-Day Complaint Trend */}
          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-navy-950 text-xs uppercase tracking-wide">
                4. 30-Day Complaint Trend
              </h3>
              <span className="text-[10px] text-gray-400">Daily Inflow</span>
            </div>
            {formattedTrendData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                No trend data available yet
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B192C', color: '#fff', fontSize: '11px', borderRadius: '4px' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#2E7D32" strokeWidth={2} dot={{ r: 3 }} name="Complaints" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* ── QUICK ACTION FOOTER STRIP ─────────────────────────── */}
        <div className="bg-white p-4 rounded border border-gray-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-gray-600">
            Real MongoDB Aggregations active. Database changes reflect in real-time on refresh.
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/complaints" className="text-navy-900 font-bold hover:underline flex items-center gap-1">
              <span>Go to Complaints Register</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
