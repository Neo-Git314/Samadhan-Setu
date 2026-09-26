import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CIVIC_DOCUMENTS } from '../services/civicData';
import {
  FileText, Search, Download, Filter, Building2,
  Calendar, CheckCircle, AlertCircle, Eye, X
} from 'lucide-react';

const TYPES = ['All', 'Form', 'Citizen Charter', 'Guidelines', 'Regulations', 'Technical Manual'];

export default function DocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';

  const [docType, setDocType] = useState(initialType);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const filteredDocs = useMemo(() => {
    return CIVIC_DOCUMENTS.filter(doc => {
      const matchType = docType === 'All' || doc.type.toLowerCase().includes(docType.toLowerCase());
      const matchSearch = !searchTerm ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [docType, searchTerm]);

  const handleDownload = (doc) => {
    const textContent = `SAMADHAN SETU — OFFICIAL CITIZEN DOCUMENT\n=====================================================\nDocument Code: ${doc.id}\nTitle: ${doc.name}\nIssuing Authority: ${doc.department}\nDocument Category: ${doc.type}\nLast Updated: ${doc.updatedOn}\n\nPURPOSE & DESCRIPTION:\n${doc.description}\n\nINSTRUCTIONS FOR CITIZENS:\n1. This official document is issued under the State Public Services Guarantee Framework.\n2. In case of offline submission, attach a copy of this form at your District Collectorate Grievance Counter.\n3. For digital tracking, file grievances directly at http://localhost:5173/submit using your unique citizen profile.\n\n=====================================================\nPublished by: Samadhan Setu National Grievance Redressal Cell\n[Official Prototype Copy — SIH 2026]`;
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}_${doc.name.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900" id="main-content">
      
      {/* ── TOP BANNER ────────────────────────────────────────── */}
      <div className="bg-navy-900 text-white py-8 px-4 border-b-4 border-saffron-500">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-saffron-400 uppercase tracking-widest font-semibold mb-2">
            <Link to="/" className="hover:underline">Home</Link>
            <span>›</span>
            <span>Documents & Forms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Documents & Downloadable Forms</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mt-1.5 leading-relaxed">
            Search and download citizen charter documents, standardized grievance registration proformas, right-to-service manuals, and municipal regulations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── SEARCH & FILTER CONTROLS ──────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search document name, department, or keywords..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => { setDocType(t); setSearchParams(t === 'All' ? {} : { type: t }); }}
                className={`text-xs px-3 py-1.5 rounded font-semibold border transition-colors ${
                  docType === t
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>

        {/* ── DOCUMENTS TABLE ───────────────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
          
          <div className="px-5 py-3.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
            <h2 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Document Repository ({filteredDocs.length} Files Available)
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">All downloads verified & accessible</span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-sm text-navy-950">No Documents Found</div>
              <p className="text-xs text-gray-500 mt-1">Try modifying your keyword search or changing the document type filter.</p>
              <button
                onClick={() => { setSearchTerm(''); setDocType('All'); }}
                className="mt-3 text-xs text-navy-900 font-bold hover:underline"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Department / Authority</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Updated On</th>
                    <th className="py-3 px-4 text-center">Format</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocs.map(d => (
                    <tr key={d.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Document Name & Description */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start gap-2.5">
                          <FileText size={18} className="text-saffron-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <button
                              onClick={() => setPreviewDoc(d)}
                              className="font-bold text-navy-950 hover:text-blue-700 text-left hover:underline line-clamp-1"
                            >
                              {d.name}
                            </button>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{d.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-gray-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{d.department}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-navy-50 text-navy-900 border border-navy-200">
                          {d.type}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {d.updatedOn}
                      </td>

                      {/* Format & Size */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {d.fileType} ({d.size})
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewDoc(d)}
                            className="p-1.5 rounded text-navy-800 hover:bg-navy-100 border border-gray-300 transition-colors"
                            title="Preview Document Summary"
                            aria-label={`Preview ${d.name}`}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownload(d)}
                            className="px-2.5 py-1 rounded text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 flex items-center gap-1 transition-colors"
                            title="Download Official Document"
                            aria-label={`Download ${d.name}`}
                          >
                            <Download size={13} />
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* ── PREVIEW MODAL ─────────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-400 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-saffron-600 font-bold uppercase">{previewDoc.id} · {previewDoc.type}</span>
                <h3 className="font-bold text-navy-950 text-sm mt-0.5">{previewDoc.name}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
              <div>
                <strong className="block text-[11px] text-gray-500 uppercase font-bold">Issuing Department:</strong>
                <span>{previewDoc.department}</span>
              </div>
              <div>
                <strong className="block text-[11px] text-gray-500 uppercase font-bold">Description & Scope:</strong>
                <p className="bg-gray-50 p-2.5 rounded border border-gray-200 mt-1">{previewDoc.description}</p>
              </div>
              <div className="flex items-center justify-between text-gray-500 text-[11px] pt-1">
                <span>File Format: <strong>{previewDoc.fileType}</strong></span>
                <span>Estimated Size: <strong>{previewDoc.size}</strong></span>
                <span>Updated: <strong>{previewDoc.updatedOn}</strong></span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded"
              >
                Close
              </button>
              <button
                onClick={() => { handleDownload(previewDoc); setPreviewDoc(null); }}
                className="px-4 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Download size={14} />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
