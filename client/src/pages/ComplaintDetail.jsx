import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { downloadGrievancePDF, printGrievancePDF } from '../services/pdfService';
import { findGrievance } from '../services/civicData';
import {
  ArrowLeft, MapPin, Calendar, User, Tag, Image as ImgIcon,
  AlertTriangle, Shield, Copy, ExternalLink, GitBranch,
  Download, Printer, Lock
} from 'lucide-react';

let L;
if (typeof window !== 'undefined') {
  import('leaflet').then(mod => { L = mod; });
}

const STATUS_TIMELINE = ['pending', 'reviewed', 'assigned', 'in_progress', 'resolved'];

function Timeline({ status }) {
  const idx = STATUS_TIMELINE.indexOf(status);
  return (
    <div className="flex items-center gap-0">
      {STATUS_TIMELINE.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
              i <= idx ? 'bg-navy-800 border-navy-800 text-white' : 'bg-white border-gray-300 text-gray-400'
            }`}>{i + 1}</div>
            <span className={`text-[9px] mt-1 capitalize text-center max-w-[50px] ${i === idx ? 'text-navy-700 font-semibold' : 'text-gray-400'}`}>
              {s.replace('_', ' ')}
            </span>
          </div>
          {i < STATUS_TIMELINE.length - 1 && (
            <div className={`h-0.5 flex-1 mb-4 ${i < idx ? 'bg-navy-800' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mapRef = useRef(null);

  const { data: complaint, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      try {
        const r = await complaintApi.getById(id);
        return r.data?.complaint || r.data;
      } catch (err) {
        if (err.response?.status === 403) throw err;
        const local = findGrievance(id);
        if (local) {
          if (user?.role === 'citizen') {
            const userId = user._id || user.id;
            const userEmail = user.email?.toLowerCase().trim();
            const ownerId = local.citizenId || local.submittedBy;
            const ownerEmail = local.citizenEmail?.toLowerCase().trim();
            const isMatch = (userId && ownerId && userId.toString() === ownerId.toString()) ||
                            (userEmail && ownerEmail && userEmail === ownerEmail);
            if (!isMatch) {
              const forbiddenErr = new Error('Access denied');
              forbiddenErr.response = { status: 403 };
              throw forbiddenErr;
            }
          }
          return {
            _id: local.id,
            acknowledgementNumber: local.id,
            title: local.subject || local.title,
            description: local.description,
            category: local.category,
            status: local.status,
            urgency: local.priority || 'medium',
            createdAt: local.createdAt,
            updatedAt: local.updatedAt,
            submittedBy: {
              _id: local.citizenId || user?._id || user?.id,
              name: local.citizenName || user?.name,
              email: local.citizenEmail || user?.email,
              phone: local.citizenMobile || user?.phone
            },
            address: local.location,
            city: local.city,
            district: local.district,
            state: local.state,
            pincode: local.pincode,
            timeline: local.timeline,
            attachments: local.attachments || []
          };
        }
        throw err;
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!complaint?.geoPoint?.coordinates || !mapRef.current) return;
    import('leaflet').then(leaflet => {
      const [lng, lat] = complaint.geoPoint.coordinates;
      const map = leaflet.map(mapRef.current, { center: [lat, lng], zoom: 15, zoomControl: true });
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      leaflet.marker([lat, lng]).addTo(map)
        .bindPopup(complaint.title || 'Complaint Location').openPopup();
      return () => map.remove();
    });
  }, [complaint]);

  if (isLoading) return <LoadingSpinner message="Loading complaint details…" />;

  // 403 Forbidden or owner check failure
  const isForbidden = error?.response?.status === 403;
  if (isForbidden) {
    return (
      <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded border border-red-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-bold text-red-800 mb-2">Access Restricted</h2>
          <p className="text-xs text-gray-600 mb-5 leading-relaxed">
            As a citizen, you are only authorized to view details of grievances that you registered yourself. You cannot view another citizen's records.
          </p>
          <Link
            to="/citizen/dashboard"
            className="inline-block px-5 py-2 bg-[#123B68] text-white text-xs font-bold rounded hover:bg-[#0B2440] transition-colors"
          >
            Return to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isError || !complaint) return <ErrorState onRetry={refetch} message="Could not load this complaint." />;

  // Client-side owner verification for citizen role
  if (user?.role === 'citizen') {
    const userId = user._id || user.id;
    const userEmail = user.email?.toLowerCase().trim();
    const ownerId = complaint.submittedBy?._id || complaint.submittedBy || complaint.citizenId;
    const ownerEmail = (complaint.submittedBy?.email || complaint.citizenEmail)?.toLowerCase().trim();

    const isMatch = (userId && ownerId && userId.toString() === ownerId.toString()) ||
                    (userEmail && ownerEmail && userEmail === ownerEmail);

    if (!isMatch) {
      return (
        <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-12 px-4 flex items-center justify-center font-sans">
          <div className="max-w-md w-full bg-white rounded border border-red-200 p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
              <Lock size={24} />
            </div>
            <h2 className="text-lg font-bold text-red-800 mb-2">Access Restricted</h2>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              You are not authorized to view this grievance because it belongs to another citizen.
            </p>
            <Link
              to="/citizen/dashboard"
              className="inline-block px-5 py-2 bg-[#123B68] text-white text-xs font-bold rounded hover:bg-[#0B2440] transition-colors"
            >
              Return to My Dashboard
            </Link>
          </div>
        </div>
      );
    }
  }

  const c = complaint;

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-800 mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to List
        </button>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <StatusBadge status={c.status} />
                <span className="badge bg-gray-100 text-gray-600 border-gray-200">{c.category}</span>
                {c.fraudFlags?.length > 0 && (
                  <span className="badge bg-amber-100 text-amber-800 border-amber-300">
                    <Shield size={9} className="mr-1 inline" /> Integrity Flag
                  </span>
                )}
                {c.duplicateOf && (
                  <span className="badge bg-blue-100 text-blue-700 border-blue-200">
                    <GitBranch size={9} className="mr-1 inline" /> Duplicate
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">{c.title}</h1>
              <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>

              <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                {c.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-red-400" /> {c.address}
                  </span>
                )}
                {c.submittedBy?.name && (
                  <span className="flex items-center gap-1.5">
                    <User size={12} /> {c.submittedBy.name}
                  </span>
                )}
              </div>

              {/* ID */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-400">Complaint ID:</span>
                <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{c._id}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(c._id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            {c.status !== 'duplicate' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Resolution Progress</h3>
                <Timeline status={c.status} />
              </div>
            )}

            {/* Fraud Flags */}
            {c.fraudFlags?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-amber-600" />
                  <h3 className="text-sm font-semibold text-amber-800">Integrity Verification Notice</h3>
                </div>
                <ul className="space-y-1">
                  {c.fraudFlags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                      <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images */}
            {c.images?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ImgIcon size={15} /> Photo Evidence ({c.images.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {c.images.map((img, i) => (
                    <a key={i} href={img.url || img} target="_blank" rel="noopener noreferrer" className="group">
                      <img
                        src={img.url || img}
                        alt={`Evidence ${i + 1}`}
                        className="w-full h-36 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Official PDF Document Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2.5">
              <h3 className="text-xs font-bold text-[#123B68] uppercase tracking-wide">
                Official Redressal Documents
              </h3>
              <p className="text-[11px] text-[#58718A]">
                Download or print the authenticated public service acknowledgement receipt.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => downloadGrievancePDF({
                    ...c,
                    id: c.acknowledgementNumber || c._id,
                    acknowledgementNumber: c.acknowledgementNumber || c._id,
                    citizenName: c.submittedBy?.name || 'Citizen',
                    citizenMobile: c.submittedBy?.phone || '',
                    citizenEmail: c.submittedBy?.email || '',
                    citizenAddress: c.address || '',
                    location: c.address || `${c.city || ''} ${c.district || ''}`.trim() || 'Location',
                    category: c.category,
                    title: c.title,
                    description: c.description
                  })}
                  className="w-full py-2 px-3 bg-[#123B68] hover:bg-[#0B2440] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download size={13} />
                  <span>Download Acknowledgement PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => printGrievancePDF({
                    ...c,
                    id: c.acknowledgementNumber || c._id,
                    acknowledgementNumber: c.acknowledgementNumber || c._id,
                    citizenName: c.submittedBy?.name || 'Citizen',
                    citizenMobile: c.submittedBy?.phone || '',
                    citizenEmail: c.submittedBy?.email || '',
                    citizenAddress: c.address || '',
                    location: c.address || `${c.city || ''} ${c.district || ''}`.trim() || 'Location',
                    category: c.category,
                    title: c.title,
                    description: c.description
                  })}
                  className="w-full py-2 px-3 bg-[#EEF7FC] hover:bg-[#DDEEF8] text-[#123B68] border border-[#B8D5E5] text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer size={13} />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Map */}
            {c.geoPoint?.coordinates && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={14} className="text-red-500" /> Location
                </h3>
                <div ref={mapRef} className="w-full h-40 rounded-lg border border-gray-100 overflow-hidden" style={{ zIndex: 1 }} />
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {c.geoPoint.coordinates[1].toFixed(5)}, {c.geoPoint.coordinates[0].toFixed(5)}
                </p>
              </div>
            )}

            {/* AI Screening & Innovation Potential (SIH 26043) */}
            <div className="bg-white rounded-xl border border-[#D9E4ED] shadow-sm p-4 space-y-3">
              <h3 className="text-xs font-bold text-[#123B68] uppercase tracking-wide flex items-center justify-between">
                <span>AI Screening Evaluation</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  c.screeningClassification === 'validated_societal_challenge'
                    ? 'bg-emerald-100 text-emerald-800'
                    : c.screeningClassification === 'routine_service_issue'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {c.screeningClassification === 'validated_societal_challenge'
                    ? 'Validated Challenge'
                    : c.screeningClassification === 'routine_service_issue'
                    ? 'Routine Issue'
                    : 'Under Review'}
                </span>
              </h3>

              <div className="space-y-2 text-xs">
                {c.researchDomain && (
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">Research Domain</span>
                    <span className="font-semibold text-gray-800">{c.researchDomain}</span>
                  </div>
                )}
                {c.innovationPotential && (
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">Innovation Potential</span>
                    <span className="font-bold text-[#F58220] uppercase">{c.innovationPotential}</span>
                  </div>
                )}
                {c.prioritizationScore && (
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">Prioritization Score</span>
                    <span className="font-bold text-[#123B68]">{c.prioritizationScore}/100</span>
                  </div>
                )}
              </div>

              {c.screeningReason && (
                <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 leading-relaxed">
                  <strong className="text-gray-800">Assessment: </strong>
                  {c.screeningReason}
                </p>
              )}

              {c.screeningClassification === 'routine_service_issue' && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 leading-relaxed">
                  <strong>Local Maintenance Notice: </strong>
                  {c.citizenGuidance || 'Not suitable for innovation challenge pipeline. Please contact local municipal services.'}
                </div>
              )}
            </div>

            {/* Related Project */}
            {c.assignedProject && (
              <div className="bg-white rounded-xl border border-navy-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-navy-800 mb-2">Assigned Project</h3>
                <p className="text-xs text-gray-600 mb-2">{c.assignedProject.title || 'University Research Project'}</p>
                <button className="flex items-center gap-1 text-xs text-navy-700 font-medium hover:underline">
                  <ExternalLink size={11} /> View Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
