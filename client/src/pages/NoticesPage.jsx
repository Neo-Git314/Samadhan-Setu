import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PUBLIC_NOTICES } from '../services/civicData';
import {
  FileText, Search, Filter, Calendar, Download, Eye,
  ChevronRight, Building2, Shield, X, AlertCircle, ArrowLeft
} from 'lucide-react';

const CATEGORIES = ['All', 'Government Orders', 'Public Notices', 'Campaigns', 'Announcements'];

export default function NoticesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const filteredNotices = useMemo(() => {
    return PUBLIC_NOTICES.filter(notice => {
      const matchCat = category === 'All' || notice.category.toLowerCase() === category.toLowerCase();
      const matchQuery = !searchTerm ||
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.summary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [category, searchTerm]);

  const handleDownloadNotice = (notice) => {
    // Generate text/pdf sample download for real interactive behavior
    const content = `GOVERNMENT OF PUBLIC SERVICES\nCIVIC GRIEVANCE & ADMINISTRATIVE CELL\n\nOFFICIAL NOTIFICATION: ${notice.refNo}\n\nTitle: ${notice.title}\nDepartment: ${notice.department}\nCategory: ${notice.category}\nPublish Date: ${notice.publishDate}\nValid Until: ${notice.lastDate}\nStatus: ${notice.status}\n\nSummary:\n${notice.summary}\n\nDetailed Notification Order:\n${notice.content}\n\n[Issued in Public Interest by Samadhan Setu National Platform]`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${notice.refNo.replace(/[^a-zA-Z0-9]/g, '_')}_Notice.txt`;
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
            <span>Public Notices & Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Public Notices & Government Orders</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mt-1.5 leading-relaxed">
            Official gazette publications, statutory service guarantee orders, seasonal municipal advisories, and public announcements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── SEARCH & FILTER CONTROLS ──────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notice title, ref number, or department..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSearchParams(cat === 'All' ? {} : { category: cat }); }}
                className={`text-xs px-3 py-1.5 rounded font-semibold border transition-colors ${
                  category === cat
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* ── NOTICE LISTING TABLE (GOVERNMENT STYLE) ───────────── */}
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
          
          <div className="px-5 py-3.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
            <h2 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Official Bulletin Board ({filteredNotices.length} Records)
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">Sorted by: Published Date (Latest)</span>
          </div>

          {filteredNotices.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
              <div className="font-bold text-sm text-navy-950">No Notices Found</div>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or selecting another category.</p>
              <button
                onClick={() => { setSearchTerm(''); setCategory('All'); }}
                className="mt-3 text-xs text-navy-900 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <th className="py-3 px-4">Ref. / Notice Details</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Published Date</th>
                    <th className="py-3 px-4">Last Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredNotices.map((n) => (
                    <tr key={n.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Notice Title & Ref */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-[10px] font-mono text-saffron-700 font-bold">{n.refNo}</div>
                        <button
                          onClick={() => setSelectedNotice(n)}
                          className="font-bold text-navy-900 hover:text-blue-700 text-left hover:underline line-clamp-2 mt-0.5"
                        >
                          {n.title}
                        </button>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{n.summary}</p>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{n.department}</span>
                        </div>
                      </td>

                      {/* Publish Date */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {n.publishDate}
                      </td>

                      {/* Last Date */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {n.lastDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {n.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedNotice(n)}
                            className="p-1.5 rounded text-navy-800 hover:bg-navy-100 border border-gray-300 transition-colors"
                            title="View Notice Details"
                            aria-label={`View notice ${n.refNo}`}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadNotice(n)}
                            className="p-1.5 rounded text-saffron-700 hover:bg-saffron-50 border border-saffron-300 transition-colors"
                            title="Download Notice"
                            aria-label={`Download notice ${n.refNo}`}
                          >
                            <Download size={14} />
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

      {/* ── NOTICE DETAIL MODAL ─────────────────────────────────── */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="bg-navy-950 text-white p-5 border-b-2 border-saffron-500 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-saffron-400 uppercase font-bold tracking-wider">
                  {selectedNotice.refNo} · {selectedNotice.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-gray-300 hover:text-white p-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-gray-800">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 rounded p-3 text-center">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Category</div>
                  <div className="font-semibold text-navy-900 mt-0.5">{selectedNotice.category}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Published</div>
                  <div className="font-semibold text-navy-900 mt-0.5">{selectedNotice.publishDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Valid Until</div>
                  <div className="font-semibold text-navy-900 mt-0.5">{selectedNotice.lastDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Status</div>
                  <div className="font-semibold text-emerald-700 mt-0.5">{selectedNotice.status}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-navy-950 uppercase text-[11px] mb-1">Issuing Department</h4>
                <p className="text-gray-700 bg-white border border-gray-200 rounded p-2.5">
                  {selectedNotice.department}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-navy-950 uppercase text-[11px] mb-1">Executive Summary</h4>
                <p className="text-gray-700 bg-amber-50/60 border border-amber-200 rounded p-3 leading-relaxed">
                  {selectedNotice.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-navy-950 uppercase text-[11px] mb-1">Complete Gazette Order Text</h4>
                <div className="text-gray-700 bg-gray-50 border border-gray-200 rounded p-3 leading-relaxed font-sans whitespace-pre-line">
                  {selectedNotice.content}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">File format: {selectedNotice.fileSize}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadNotice(selectedNotice)}
                  className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} />
                  Download Order Copy
                </button>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
