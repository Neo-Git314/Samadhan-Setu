import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { complaintApi } from '../api/endpoints';
import ImageUpload from '../components/ImageUpload';
import LocationPicker from '../components/LocationPicker';
import {
  FileText, MapPin, Tag, AlignLeft, CheckCircle,
  AlertCircle, Loader2, ChevronRight, ChevronLeft, Shield
} from 'lucide-react';

const CATEGORIES = [
  'Road & Infrastructure', 'Water Supply', 'Sanitation & Sewage',
  'Electricity', 'Garbage Collection', 'Air Pollution',
  'Noise Pollution', 'Public Safety', 'Parks & Recreation',
  'Encroachment', 'Street Lighting', 'Other'
];

const STEPS = ['Basic Info', 'Location', 'Evidence', 'Review'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? 'bg-civic-green border-civic-green text-white'
              : i === current ? 'bg-navy-800 border-navy-800 text-white'
              : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {i < current ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium mt-1 ${i === current ? 'text-navy-800' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mb-4 transition-all ${i < current ? 'bg-civic-green' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function CitizenSubmit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    location: null,
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('address', form.address);
      if (form.location) {
        fd.append('lat', form.location.lat);
        fd.append('lng', form.location.lng);
      }
      files.forEach(f => fd.append('images', f));
      return complaintApi.create(fd);
    },
    onSuccess: (res) => {
      setSubmitted(res.data.complaint || res.data);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  });

  const validate = () => {
    setError('');
    if (step === 0) {
      if (!form.title.trim()) { setError('Issue title is required.'); return false; }
      if (!form.category) { setError('Please select a category.'); return false; }
      if (form.description.trim().length < 20) { setError('Please describe the issue in at least 20 characters.'); return false; }
    }
    if (step === 1) {
      if (!form.address.trim()) { setError('Please enter the address.'); return false; }
    }
    return true;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-110px)] flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl border border-green-200 shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Issue Reported Successfully</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your complaint has been recorded with ID:
          </p>
          <div className="font-mono text-sm bg-gray-100 rounded px-3 py-2 mb-4 text-navy-800 font-bold">
            {submitted._id?.slice(-12).toUpperCase() || 'SS' + Date.now().toString(36).toUpperCase()}
          </div>
          {submitted.fraudFlags?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800 text-left">
              <Shield size={13} className="inline mr-1" />
              <strong>Integrity Notice:</strong> {submitted.fraudFlags.join(', ')}
            </div>
          )}
          {submitted.duplicateOf && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-800 text-left">
              <AlertCircle size={13} className="inline mr-1" />
              Similar issue already reported. Your complaint has been linked.
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/citizen/complaints')}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors"
            >
              View My Complaints
            </button>
            <button
              onClick={() => { setSubmitted(null); setStep(0); setForm({ title: '', description: '', category: '', address: '', location: null }); setFiles([]); }}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>Home</span> <ChevronRight size={12} /> <span>Report Civic Issue</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Report a Civic Issue</h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit a civic grievance to be addressed by research institutions and government bodies.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <StepIndicator current={step} />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
              <AlertCircle size={15} className="flex-shrink-0" /> {error}
            </div>
          )}

          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Title <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g., Broken road near Market Chowk causing accidents"
                    maxLength={150}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/150</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`text-xs py-2 px-2 rounded-lg border-2 font-medium transition-all text-left ${
                        form.category === cat
                          ? 'border-navy-700 bg-navy-50 text-navy-800'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the issue in detail. When did it start? Who is affected? What is the impact?"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.description.length} characters (min. 20)</p>
              </div>
            </div>
          )}

          {/* Step 1 — Location */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g., Market Chowk, Lalpur, Ranchi, Jharkhand"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Location on Map</label>
                <p className="text-xs text-gray-400 mb-3">Helps cluster nearby issues and identify hotspots. Click the map or use GPS.</p>
                <LocationPicker value={form.location} onChange={loc => setForm(f => ({ ...f, location: loc }))} />
              </div>
            </div>
          )}

          {/* Step 2 — Evidence */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Photo Evidence <span className="text-gray-400 font-normal">(Optional)</span></label>
                <p className="text-xs text-gray-400 mb-3">Clear photos strengthen your complaint and help AI classify the issue accurately.</p>
                <ImageUpload files={files} setFiles={setFiles} />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                <Shield size={12} className="inline mr-1" />
                <strong>Fraud Detection:</strong> Our AI system verifies image metadata and GPS coordinates to ensure complaint integrity. Manipulated images may be flagged.
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Review Your Submission</h3>
              <div className="space-y-3">
                {[
                  ['Title', form.title],
                  ['Category', form.category],
                  ['Description', form.description],
                  ['Address', form.address],
                  ['Coordinates', form.location ? `${form.location.lat}, ${form.location.lng}` : 'Not pinned'],
                  ['Images', `${files.length} file(s) attached`],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-3">
                    <dt className="w-24 text-xs font-semibold text-gray-500 flex-shrink-0 pt-0.5">{label}</dt>
                    <dd className="text-sm text-gray-800 flex-1">{val || '—'}</dd>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500">
                By submitting, you confirm this information is accurate and true. False reports may result in account suspension.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-500 rounded-lg disabled:opacity-70 transition-colors"
              >
                {mutation.isPending && <Loader2 size={15} className="animate-spin" />}
                {mutation.isPending ? 'Submitting…' : 'Submit Complaint'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
