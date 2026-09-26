import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CIVIC_DEPARTMENTS } from '../services/civicData';
import {
  Phone, Mail, Clock, MapPin, Building2, Send,
  CheckCircle2, AlertCircle, HelpCircle, ChevronDown, Shield
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    department: 'General Support / Helpdesk',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name.';
    if (!form.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    if (!form.message.trim() || form.message.trim().length < 15) {
      errs.message = 'Please enter a detailed query of at least 15 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const generatedTicket = `TKT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      mobile: '',
      department: 'General Support / Helpdesk',
      subject: '',
      message: ''
    });
    setSubmitted(false);
    setTicketId('');
    setErrors({});
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
            <span>Citizen Helpdesk & Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Citizen Helpdesk & Department Contacts</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mt-1.5 leading-relaxed">
            Reach out to our toll-free civic helpline, inspect nodal department contact details, or transmit an official inquiry to the administrative triage cell.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* ── KEY HELPLINES ROW ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="helpline">
          
          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-navy-50 text-navy-900 border border-navy-200 flex items-center justify-center flex-shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Citizen Helpline</div>
              <div className="text-base font-extrabold text-navy-950 mt-0.5">1800-111-2026</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Toll-Free (24x7 Support)</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex items-start gap-3.5" id="helpdesk">
            <div className="w-10 h-10 rounded bg-saffron-50 text-saffron-700 border border-saffron-200 flex items-center justify-center flex-shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Helpdesk Email</div>
              <div className="text-xs font-bold text-navy-950 mt-1 truncate">helpdesk@samadhansetu.gov.in</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Response within 24 hrs</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Office Hours</div>
              <div className="text-xs font-bold text-navy-950 mt-1">10:00 AM – 5:30 PM</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Monday to Saturday (Working days)</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nodal Headquarters</div>
              <div className="text-xs font-bold text-navy-950 mt-1">State Secretariat Complex</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Project Bhawan, Ranchi - 834004</div>
            </div>
          </div>

        </div>

        {/* ── TWO COLUMN: INQUIRY FORM & HELP DETAILS ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact / Grievance Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded border border-gray-300 p-6 shadow-sm">
            
            <div className="border-b border-gray-200 pb-3 mb-5">
              <h2 className="text-base font-bold text-navy-950 uppercase tracking-wide">
                Send an Official Query or Suggestion
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                For filing formal civic complaints, please use the <Link to="/submit" className="text-saffron-700 font-bold hover:underline">Grievance Registration</Link> module. Use this form for technical assistance, portal feedback, or RTI guidance.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded space-y-3 animate-fade-in">
                <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
                <h3 className="text-base font-bold text-navy-950">Query Submitted Successfully</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Your communication has been registered with Helpdesk Reference Number:
                </p>
                <div className="font-mono text-sm font-extrabold text-navy-900 bg-white border border-emerald-300 px-4 py-2 inline-block rounded">
                  {ticketId}
                </div>
                <p className="text-[11px] text-gray-500">
                  Our citizen support officer will review your query and reply to <strong>{form.email}</strong> within 1-2 business days.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded hover:bg-navy-800"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rameshwar Mahato"
                      className={`w-full px-3 py-2 border rounded outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 ${
                        errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <span className="text-[11px] text-red-600 mt-0.5 block">{errors.name}</span>}
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. citizen@example.com"
                      className={`w-full px-3 py-2 border rounded outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 ${
                        errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <span className="text-[11px] text-red-600 mt-0.5 block">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Mobile Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Related Department / Desk
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-navy-900 bg-white"
                    >
                      <option value="General Support / Helpdesk">General Support / Helpdesk</option>
                      {CIVIC_DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Subject / Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of your query or suggestion"
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-navy-900 ${
                      errors.subject ? 'border-red-400 bg-red-50/50' : 'border-gray-300'
                    }`}
                  />
                  {errors.subject && <span className="text-[11px] text-red-600 mt-0.5 block">{errors.subject}</span>}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Message / Query Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide detailed description of your question or grievance tracking issue..."
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-navy-900 ${
                      errors.message ? 'border-red-400 bg-red-50/50' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {errors.message && <span className="text-[11px] text-red-600 mt-0.5 block">{errors.message}</span>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Send size={13} />
                    <span>Submit Query</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Right: Escalation Hierarchy & Working Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Escalation Info */}
            <div className="bg-white rounded border border-gray-300 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide border-b pb-2 mb-3 flex items-center gap-1.5">
                <Shield size={14} className="text-saffron-600" />
                Grievance Escalation Framework
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                If your filed civic grievance remains unaddressed past the 15-day statutory SLA under the Right to Service Guarantee:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                  <strong className="text-navy-900 block font-bold">Level 1: Designated Redressal Officer (DRO)</strong>
                  <span className="text-gray-600">Executive Engineer / Municipal Ward Officer (Day 1 to 15)</span>
                </div>
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                  <strong className="text-navy-900 block font-bold">Level 2: First Appellate Authority (FAA)</strong>
                  <span className="text-gray-600">Superintending Engineer / Municipal Commissioner (Day 16 to 30)</span>
                </div>
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                  <strong className="text-navy-900 block font-bold">Level 3: State Grievance Commission (SGC)</strong>
                  <span className="text-gray-600">District Collector / Principal Secretary (Post 30 Days default)</span>
                </div>
              </div>
            </div>

            {/* Quick Access to FAQs */}
            <div className="bg-navy-900 text-white rounded p-5 shadow-sm border border-navy-800">
              <h3 className="text-xs font-bold text-saffron-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HelpCircle size={14} />
                Need Immediate Answers?
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Explore our comprehensive knowledge base addressing photo verification, EXIF geolocation guidelines, university matching, and SLA rules.
              </p>
              <Link
                to="/resources#faq"
                className="inline-block px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded transition-colors"
              >
                Read Citizen FAQs
              </Link>
            </div>

          </div>

        </div>

        {/* ── DEPARTMENT NODAL DIRECTORY ─────────────────────────── */}
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden" id="directory">
          <div className="px-5 py-3.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
            <h2 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={15} className="text-navy-800" />
              Nodal Civic Department Directory
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">8 State Departments Integrated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Nodal Authority</th>
                  <th className="py-3 px-4">Helpline / Phone</th>
                  <th className="py-3 px-4">Official Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {CIVIC_DEPARTMENTS.map(dept => (
                  <tr key={dept.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-navy-950 max-w-xs">{dept.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-saffron-700">{dept.code}</td>
                    <td className="py-3 px-4 text-gray-700">{dept.head}</td>
                    <td className="py-3 px-4 font-mono text-gray-800 font-semibold">{dept.phone}</td>
                    <td className="py-3 px-4 font-mono text-blue-700">{dept.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
