import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../api/endpoints';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import {
  ArrowLeft, MapPin, Calendar, User, Tag, Image as ImgIcon,
  AlertTriangle, Shield, Copy, ExternalLink, GitBranch
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
  const mapRef = useRef(null);

  const { data: complaint, isLoading, isError, refetch } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintApi.getById(id).then(r => r.data?.complaint || r.data),
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
  if (isError || !complaint) return <ErrorState onRetry={refetch} message="Could not load this complaint." />;

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

            {/* AI Classification */}
            {c.aiClassification && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Classification</h3>
                <div className="space-y-2">
                  {c.aiClassification.category && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium">{c.aiClassification.category}</span>
                    </div>
                  )}
                  {c.aiClassification.urgency && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Urgency</span>
                      <span className={`font-medium ${c.aiClassification.urgency === 'high' ? 'text-red-600' : c.aiClassification.urgency === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
                        {c.aiClassification.urgency.charAt(0).toUpperCase() + c.aiClassification.urgency.slice(1)}
                      </span>
                    </div>
                  )}
                  {c.aiClassification.confidence && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Confidence</span>
                      <span className="font-medium">{(c.aiClassification.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
