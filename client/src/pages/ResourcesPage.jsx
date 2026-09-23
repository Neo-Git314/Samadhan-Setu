import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, FileText, Phone, Mail, ChevronDown, ChevronUp, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'charter' | 'helpdesk' | 'guidelines'
  const [openFaq, setOpenFaq] = useState(0);

  const FAQS = [
    {
      q: 'How do I lodge an official grievance on Samadhan Setu?',
      a: 'Log in with your citizen account or sign up with your phone number/email. Click on "Report an Issue", allow location permissions or pin your address on the interactive map, capture a clear photo of the problem, write a brief description, and click Submit. An official acknowledgement receipt will be generated instantly.'
    },
    {
      q: 'Why does the portal ask for camera / GPS permissions?',
      a: 'The portal uses EXIF metadata extraction to verify that uploaded photographs were taken at the reported physical location. This prevents fictitious reports, ensures municipal teams and researchers inspect genuine coordinates, and enables automatic clustering with nearby complaints.'
    },
    {
      q: 'What happens after I report an issue?',
      a: 'Your report undergoes automated category tagging and spatial clustering. If it is verified, municipal officers review priority. When the issue requires engineered intervention (e.g. subterranean water leakage or mine runoff), it is dispatched to accredited engineering colleges as a capstone research challenge.'
    },
    {
      q: 'How can I check the progress of my submitted issue?',
      a: 'Visit the "Track Grievance" section anytime from the top navigation bar. If logged in, you can see all your submitted issues, active student teams, milestone completion dates, and photos of the installed solution.'
    },
    {
      q: 'Who funds the solutions designed by universities?',
      a: 'Universities develop prototypes using their departmental R&D facilities. Physical deployment, materials, and field handover costs are co-funded through Corporate Social Responsibility (CSR) grants from partners like Tata Steel CSR Innovation Lab and state municipal grants.'
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      
      {/* Top Banner */}
      <div className="bg-navy-900 text-white py-12 px-4 border-b-4 border-saffron-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-saffron-400 uppercase tracking-widest font-semibold mb-2">
            <span>Knowledge Base & Support</span>
            <span>·</span>
            <span>Government Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Resources & Helpdesk</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mt-2 leading-relaxed">
            Official citizen charter, redressal guidelines, frequently asked questions, and grievance escalation cell contacts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: 'faq', label: 'Frequently Asked Questions' },
            { id: 'charter', label: 'Citizen Charter' },
            { id: 'helpdesk', label: 'Helpdesk & Support Contacts' },
            { id: 'guidelines', label: 'Evidence & Submission Guidelines' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-navy-900 text-navy-900 bg-gray-50'
                  : 'border-transparent text-gray-500 hover:text-navy-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-lg font-bold text-navy-950 mb-4">Official Platform FAQs</h2>
            {FAQS.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-white hover:bg-gray-50 flex items-center justify-between font-bold text-sm text-navy-950 transition-colors"
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-saffron-600" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 bg-gray-50/70 border-t border-gray-100 text-xs text-gray-700 leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Citizen Charter */}
        {activeTab === 'charter' && (
          <div className="space-y-6 max-w-4xl text-xs text-gray-700 leading-relaxed">
            <h2 className="text-lg font-bold text-navy-950">Citizen Charter (नागरिक अधिकार पत्र)</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-2">
              <strong className="text-navy-900 text-sm block">1. Commitment to Public Transparency</strong>
              Every verified citizen grievance submitted through Samadhan Setu shall be indexed with open geospatial coordinates and an immutable timestamp. Citizens retain the fundamental right to inspect stage-wise progress from municipal acknowledgment to capstone fabrication.
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-2">
              <strong className="text-navy-900 text-sm block">2. Standard Service Levels (SLAs)</strong>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Automated image authenticity & GPS check: Immediate upon upload.</li>
                <li>Grievance verification & district triage: Within 24 working hours.</li>
                <li>University academic matching & faculty dispatch: Within 48 working hours.</li>
                <li>Urgent hazards (structural collapse, contaminated drinking water): Escalated to Critical Hotspot within 2 hours.</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-2">
              <strong className="text-navy-900 text-sm block">3. Citizen Right to Review</strong>
              Prior to formal closure of any grievance ticket, the submitting citizen is invited to verify the deployed physical solution on the ground and submit a 1 to 5 star satisfaction evaluation.
            </div>
          </div>
        )}

        {/* Tab 3: Helpdesk */}
        {activeTab === 'helpdesk' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-3">
              <div className="w-10 h-10 rounded bg-blue-100 text-navy-900 flex items-center justify-center">
                <Phone size={20} />
              </div>
              <h3 className="text-base font-bold text-navy-950">National Grievance Helpline</h3>
              <p className="text-xs text-gray-600">
                Toll-free telephone assistance for citizens reporting urgent civic hazards or requiring accessibility guidance.
              </p>
              <div className="pt-2 text-xs">
                <div className="font-bold text-saffron-700 text-sm">1800-11-2026 (Toll Free)</div>
                <div className="text-gray-500 mt-0.5">Operating Hours: 09:30 AM to 06:00 PM (Monday - Saturday)</div>
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-3">
              <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <h3 className="text-base font-bold text-navy-950">Electronic Grievance Cell</h3>
              <p className="text-xs text-gray-600">
                Email support for administrative inquiries, institutional university onboarding, and corporate CSR queries.
              </p>
              <div className="pt-2 text-xs">
                <div className="font-bold text-navy-900 text-sm">grievance-desk@samadhansetu.gov.in</div>
                <div className="text-gray-500 mt-0.5">Academic Collaboration: universities@samadhansetu.gov.in</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Guidelines */}
        {activeTab === 'guidelines' && (
          <div className="space-y-4 max-w-4xl text-xs text-gray-700 leading-relaxed">
            <h2 className="text-lg font-bold text-navy-950">Evidence Submission Guidelines</h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded space-y-2">
              <strong className="text-amber-900 block font-semibold text-sm">Tips for Accurate Grievance Filing:</strong>
              <ul className="list-disc pl-5 space-y-1.5 text-amber-900/90">
                <li>Capture photos in good daylight directly showcasing the root defect (e.g. pipe rupture joint or exposed electrical transformer).</li>
                <li>Enable Location / GPS on your smartphone camera so photographic EXIF metadata matches your report location.</li>
                <li>Avoid submitting stock internet images; our automated AI filter flags unoriginal imagery and marks submissions as potentially fraudulent.</li>
                <li>Provide specific landmark references (e.g. "Opposite Gate 3 Football Stadium, Morabadi").</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
