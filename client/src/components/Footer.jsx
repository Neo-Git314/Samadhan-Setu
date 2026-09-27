import React from 'react';
import { Link } from 'react-router-dom';
import SamadhanLogo from './SamadhanLogo';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#EEF5FA] text-[#17324D] font-sans border-t border-[#D9E4ED]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Left Column: Brand Identity (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-3">
            <Link to="/" className="flex items-center gap-3">
              <SamadhanLogo className="w-10 h-10" />
              <div>
                <h3 className="text-[#123B67] font-black text-lg tracking-tight leading-none">
                  SAMADHAN SETU
                </h3>
                <p className="text-[11px] text-[#60758A] mt-1 leading-snug">
                  National Civic Grievance &amp; Collaborative<br />Problem Solving Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Col 2: Important Links (Cols 5-6) */}
          <div className="lg:col-span-2">
            <h4 className="text-[#123B67] text-xs font-bold uppercase tracking-wider mb-3">
              Important Links
            </h4>
            <ul className="space-y-2 text-xs text-[#60758A]">
              <li>
                <Link to="/about" className="hover:text-[#123B67] hover:underline transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#123B67] hover:underline transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact#directory" className="hover:text-[#123B67] hover:underline transition-colors">
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/university/challenges" className="hover:text-[#123B67] hover:underline transition-colors">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services (Cols 7-8) */}
          <div className="lg:col-span-2">
            <h4 className="text-[#123B67] text-xs font-bold uppercase tracking-wider mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-[#60758A]">
              <li>
                <Link to="/submit" className="hover:text-[#123B67] hover:underline transition-colors">
                  Report Grievance
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#123B67] hover:underline transition-colors">
                  Track Grievance
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-[#123B67] hover:underline transition-colors">
                  Public Notices
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#123B67] hover:underline transition-colors">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact (Cols 9-10) */}
          <div className="lg:col-span-2">
            <h4 className="text-[#123B67] text-xs font-bold uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-xs text-[#60758A]">
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#2F6FA8] flex-shrink-0" />
                <span className="truncate">support@samadhansetu.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#2F6FA8] flex-shrink-0" />
                <span>1800-123-4567 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-[#2F6FA8] flex-shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>

          {/* Col 5: SIH Mandate & Prototype Info (Cols 11-12) */}
          <div className="lg:col-span-2 text-left lg:text-right space-y-1.5 text-xs text-[#60758A]">
            <div className="text-[11px]">
              Samadhan Setu
            </div>
            <div className="text-[10px] text-[#60758A]">
              Prototype / Demonstration Platform
            </div>
            <div className="pt-2 flex flex-wrap lg:justify-end items-center gap-2 text-[10px]">
              <Link to="/about" className="hover:text-[#123B67] hover:underline">Privacy Policy</Link>
              <span>|</span>
              <Link to="/about" className="hover:text-[#123B67] hover:underline">Terms</Link>
              <span>|</span>
              <Link to="/resources#charter" className="hover:text-[#123B67] hover:underline">Accessibility</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
