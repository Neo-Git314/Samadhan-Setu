import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CIVIC_SERVICES, CIVIC_DEPARTMENTS } from '../services/civicData';
import {
  FileText, Search, Clock, ShieldCheck, ArrowRight,
  Building2, CheckCircle2, ChevronRight, AlertCircle, X, Info
} from 'lucide-react';

const CATEGORIES = ['All', 'Road & Infrastructure', 'Water Supply', 'Street Lighting', 'Sanitation & Sewage', 'Electricity', 'Welfare Schemes', 'Public Distribution', 'Encroachment'];

export default function ServicesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('cat') ? 
    (searchParams.get('cat') === 'welfare' ? 'Welfare Schemes' : searchParams.get('cat')) : 'All';

  const [category, setCategory] = useState(initialCat);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = useMemo(() => {
    return CIVIC_SERVICES.filter(srv => {
      const matchCat = category === 'All' || srv.category.toLowerCase() === category.toLowerCase();
      const matchSearch = !searchTerm ||
        srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, searchTerm]);

  const handleApply = (service) => {
    navigate(`/submit?dept=${encodeURIComponent(service.department)}&cat=${encodeURIComponent(service.category)}`);
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
            <span>Citizen Services Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Citizen & Public Services Directory</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mt-1.5 leading-relaxed">
            Standardized civic grievance channels, statutory Service Level Agreements (SLAs), eligibility norms, and application guidelines across municipal and state departments.
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
              placeholder="Search service name, department, or issue..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => { setCategory(c); setSearchParams(c === 'All' ? {} : { cat: c }); }}
                className={`text-xs px-2.5 py-1.5 rounded font-semibold border transition-colors ${
                  category.toLowerCase() === c.toLowerCase()
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {/* ── SERVICES GRID ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(s => (
            <div
              key={s.id}
              className="bg-white rounded border border-gray-300 p-5 shadow-sm hover:border-navy-900 flex flex-col justify-between transition-colors"
            >
              <div>
                {/* Header Code & SLA */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                    {s.code}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Clock size={11} />
                    SLA: {s.slaDays} Days
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="font-bold text-navy-950 text-sm leading-snug mb-1">
                  {s.title}
                </h3>

                {/* Department */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-3">
                  <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-1">{s.department}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {s.description}
                </p>

                {/* Quick Info Box */}
                <div className="bg-gray-50 rounded p-2.5 border border-gray-200 text-[11px] text-gray-700 space-y-1 mb-4">
                  <div className="line-clamp-1">
                    <strong className="text-navy-900 font-semibold">Eligibility: </strong>
                    {s.eligibility}
                  </div>
                  <div className="line-clamp-1">
                    <strong className="text-navy-900 font-semibold">Required: </strong>
                    {s.documentsRequired.join(', ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedService(s)}
                  className="text-xs text-navy-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Info size={13} />
                  View SLA & Norms
                </button>

                <button
                  onClick={() => handleApply(s)}
                  className="px-3.5 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="bg-white rounded border border-gray-300 p-12 text-center text-gray-500">
            <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
            <div className="font-bold text-sm text-navy-950">No Services Found</div>
            <p className="text-xs text-gray-500 mt-1">Try another keyword search or select "All" categories.</p>
            <button
              onClick={() => { setSearchTerm(''); setCategory('All'); }}
              className="mt-3 text-xs text-navy-900 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* ── SERVICE DETAIL MODAL ─────────────────────────────────── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-400 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-saffron-700 font-bold uppercase">{selectedService.code} · {selectedService.category}</span>
                <h3 className="font-bold text-navy-950 text-base mt-0.5 leading-snug">{selectedService.title}</h3>
                <div className="text-xs text-gray-500 mt-0.5">{selectedService.department}</div>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
                <div>
                  <strong className="text-emerald-950 text-xs block">Statutory Redressal Period</strong>
                  <span className="text-[11px] text-emerald-800">Under State Public Services Guarantee Act</span>
                </div>
                <span className="text-lg font-extrabold text-emerald-800 font-mono">
                  {selectedService.slaDays} Days
                </span>
              </div>

              <div>
                <strong className="block text-[11px] text-navy-950 uppercase font-bold mb-1">Service Description:</strong>
                <p className="bg-gray-50 p-2.5 rounded border border-gray-200">{selectedService.description}</p>
              </div>

              <div>
                <strong className="block text-[11px] text-navy-950 uppercase font-bold mb-1">Citizen Eligibility:</strong>
                <p className="bg-gray-50 p-2.5 rounded border border-gray-200">{selectedService.eligibility}</p>
              </div>

              <div>
                <strong className="block text-[11px] text-navy-950 uppercase font-bold mb-1">Mandatory Supporting Documents:</strong>
                <ul className="list-disc pl-5 space-y-1 bg-gray-50 p-2.5 rounded border border-gray-200">
                  {selectedService.documentsRequired.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setSelectedService(null)}
                className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded"
              >
                Close
              </button>
              <button
                onClick={() => { setSelectedService(null); handleApply(selectedService); }}
                className="px-4 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-sm"
              >
                <span>File Grievance for this Service</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
