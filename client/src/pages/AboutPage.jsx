import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Building, Award, Users, CheckCircle, FileText, ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      
      {/* Header Banner */}
      <div className="bg-navy-900 text-white py-12 px-4 border-b-4 border-saffron-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-saffron-400 uppercase tracking-widest font-semibold mb-2">
            <span>Official Portal Information</span>
            <span>&bull;</span>
            <span>SIH 26043 Problem Statement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">About Samadhan Setu</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mt-2 leading-relaxed">
            A Societal Innovation Collaboration Portal crowdsourcing community challenges and connecting them with universities, industry partners, and government stakeholders for deployable research and technology solutions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        
        {/* Section 1: Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold text-navy-950">The Vision & Purpose</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Every day, citizens in Indian cities and rural regions face critical infrastructural failures: leaking water distribution mains, contaminated borewells, eroded canal embankments, chronic transformer sparks, and hazardous open pits.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Traditional grievance portals merely log complaints into congested municipal queues without the specialized engineering capacity to resolve root causes. Meanwhile, premier engineering universities (IITs, NITs, BITs) train thousands of brilliant engineering students whose capstone projects often lack direct societal impact.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed font-semibold text-navy-900">
              <strong>Samadhan Setu (समाधान सेतु)</strong> bridges this gap. It turns civic grievances into vetted engineering research challenges adopted by university faculty and students, funded by corporate CSR partners, and monitored through transparent milestone tracking.
            </p>
          </div>

          <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Platform Highlights</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-saffron-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950">Anti-Fraud Geotag Verification:</strong> EXIF metadata checks cross-verify user coordinates against camera hardware sensors to eliminate fictitious reports.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Layers size={18} className="text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950">AI Hotspot Clustering:</strong> Automated spatial algorithms group related complaints within 1.0 km to pinpoint systemic infrastructure collapses.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building size={18} className="text-purple-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950">Vector Research Matching:</strong> 768-dimensional embeddings match problem domain keywords to university laboratory research papers.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award size={18} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950">Institutional Reputation Scores:</strong> Participating universities receive NIRF-aligned points (+10 per completed deployment).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Quad-Helix Model Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl font-bold text-navy-950">The Quad-Helix Collaboration Framework</h2>
            <p className="text-xs text-gray-600 mt-1">Four interconnected stakeholders working together to resolve societal challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-saffron-600 uppercase mb-2">Stakeholder 1</div>
              <h4 className="font-bold text-navy-900 text-sm mb-1">Citizens</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Report real-world problems with geotagged media, rate completed interventions, and provide ground truth validation.
              </p>
            </div>
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-blue-600 uppercase mb-2">Stakeholder 2</div>
              <h4 className="font-bold text-navy-900 text-sm mb-1">Universities / HEIs</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Faculty leads and student engineering teams adopt challenges, design modular prototypes, and conduct laboratory assays.
              </p>
            </div>
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-purple-600 uppercase mb-2">Stakeholder 3</div>
              <h4 className="font-bold text-navy-900 text-sm mb-1">Industry / CSR</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Companies channel Corporate Social Responsibility (CSR) funds directly into validated university civic pilots.
              </p>
            </div>
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-emerald-600 uppercase mb-2">Stakeholder 4</div>
              <h4 className="font-bold text-navy-900 text-sm mb-1">Municipal Bodies</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Urban local bodies review feasibility, assist with field permits, and accept handover of verified deployments.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Participating Premier Institutions */}
        <div>
          <h2 className="text-xl font-bold text-navy-950 mb-6">Participating Premier Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                  R&D Partner
                </span>
                <span className="text-xs font-bold text-emerald-700">40 Rep Score</span>
              </div>
              <h3 className="text-base font-bold text-navy-950">BIT Mesra, Ranchi</h3>
              <p className="text-xs text-gray-600">
                Department of Civil & Environmental Engineering · Smart city telemetry, sub-surface drainage, water quality sensors.
              </p>
              <div className="text-[11px] text-gray-500 pt-1">
                Completed Projects: 1 · Active Projects: 1
              </div>
            </div>

            <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                  R&D Partner
                </span>
                <span className="text-xs font-bold text-emerald-700">25 Rep Score</span>
              </div>
              <h3 className="text-base font-bold text-navy-950">IIT (ISM) Dhanbad</h3>
              <p className="text-xs text-gray-600">
                Department of Environmental Science & Engineering · Mine water remediation, acid drainage control, heavy metal filtration.
              </p>
              <div className="text-[11px] text-gray-500 pt-1">
                Active Remediation Projects: 1
              </div>
            </div>

            <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                  R&D Partner
                </span>
                <span className="text-xs font-bold text-emerald-700">30 Rep Score</span>
              </div>
              <h3 className="text-base font-bold text-navy-950">NIT Jamshedpur</h3>
              <p className="text-xs text-gray-600">
                Department of Civil Engineering · Membrane filtration, smart rural irrigation, cost-effective potable water filtration.
              </p>
              <div className="text-[11px] text-gray-500 pt-1">
                Completed Deployments: 1
              </div>
            </div>

          </div>
        </div>

        {/* Action Row */}
        <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-navy-950">Want to participate in the platform?</h4>
            <p className="text-xs text-gray-500">Register your university department or corporate CSR team.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/submit"
              className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded"
            >
              Report an Issue
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded"
            >
              View All Services
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
