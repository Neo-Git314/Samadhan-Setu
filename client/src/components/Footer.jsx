import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-gray-300 font-sans border-t-2 border-saffron-500">

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Col 1: Portal Identity */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-saffron-400 border border-white/20">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Samadhan Setu</h3>
                <p className="text-[11px] text-gray-500">समाधान सेतु</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Citizen Grievance &amp; Civic Collaboration Portal. A prototype developed for Smart India Hackathon 2026.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> About the Portal
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Citizen Services
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Track Grievance
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> How It Works
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> FAQs
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Guidelines
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Help &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Collaborate */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">
              Collaborate
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> University Participation
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Industry Collaboration
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> Register / Login
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Prototype Disclaimer */}
        <div className="mt-8 p-4 bg-navy-900 border border-navy-700 rounded flex items-start gap-3">
          <HelpCircle size={15} className="text-saffron-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            <strong className="text-gray-200">Disclaimer:</strong>{' '}
            Samadhan Setu is a prototype developed for Smart India Hackathon 2026. This is not an official Government of India portal. All data shown is for demonstration purposes only.
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800 py-3 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <span>© 2026 Samadhan Setu — Civic Grievance &amp; Collaboration Portal</span>
          <span>Smart India Hackathon 2026 · Prototype</span>
        </div>
      </div>

    </footer>
  );
}
