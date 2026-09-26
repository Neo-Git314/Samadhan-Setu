import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Search, Building2, Bell, BookOpen, Headphones,
  ArrowRight, User, ShieldCheck, Landmark, Users, Lightbulb,
  GraduationCap, Briefcase
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-[#17324D] w-full max-w-full overflow-x-hidden" id="main-content">
      
      {/* ── 4. HERO SECTION (REDESIGNED FULL-WIDTH GOVERNMENT CIVIC PORTAL) ── */}
      <section
        className="relative w-full min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center border-b border-[#D9E4ED] overflow-hidden bg-[#EEF7FC]"
        aria-label="National Civic Grievance Portal Hero"
      >
        {/* Background Photograph - Integrated full-width, right-anchored */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_right] sm:bg-right"
          style={{
            backgroundImage: "url('/images/civic_grievance_portal_hero.jpg')",
          }}
          aria-hidden="true"
        >
          {/* Subtle base wash for the photograph */}
          <div className="absolute inset-0 bg-[#EEF7FC]/15" />
        </div>

        {/* Seamless Horizontal Fade / Light-Blue Overlay: Left is high-opacity for 100% text contrast, Right reveals the civic photograph */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#EEF7FC] via-[#EEF7FC]/95 sm:via-[#EEF7FC]/90 md:via-[#EEF7FC]/75 lg:via-[#EEF7FC]/55 to-transparent"
          aria-hidden="true"
        />
        {/* Soft directional wash to guarantee zero glare on text on mobile viewports */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#EEF7FC]/80 via-transparent to-[#EEF7FC]/60 sm:hidden"
          aria-hidden="true"
        />

        {/* Content Container (Left-aligned, standard 1280px grid) */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl lg:max-w-[620px] space-y-5">
            
            {/* Small Eyebrow Label with Orange Accent Bar */}
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-[3px] bg-[#F58220] rounded-full inline-block" aria-hidden="true"></span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#123B68]">
                NATIONAL CIVIC PROBLEM SOLVING PLATFORM
              </span>
            </div>

            {/* Main Heading - Clean modern government portal typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#123B68] tracking-tight leading-[1.12]">
              Report. Collaborate.<br />Solve.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#58718A] leading-relaxed max-w-xl font-normal">
              Connect citizens, universities, government departments and industry partners to identify and solve real societal challenges.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary: Report a Grievance */}
              <Link
                to="/submit"
                className="px-6 py-3 bg-[#F58220] hover:bg-[#E06D0C] text-white font-bold text-sm sm:text-base rounded-md shadow-sm hover:shadow transition-all flex items-center gap-2.5 active:scale-[0.99]"
                aria-label="Report a new civic grievance"
              >
                <FileText size={18} className="flex-shrink-0" />
                <span>Report a Grievance</span>
              </Link>

              {/* Secondary: Track Grievance */}
              <Link
                to="/track"
                className="px-6 py-3 bg-white hover:bg-[#F4F9FD] text-[#123B68] border border-[#2878B8] hover:border-[#123B68] font-bold text-sm sm:text-base rounded-md shadow-sm hover:shadow-sm transition-all flex items-center gap-2.5 active:scale-[0.99]"
                aria-label="Track existing civic grievance status"
              >
                <Search size={18} className="text-[#2878B8] flex-shrink-0" />
                <span>Track Grievance</span>
              </Link>
            </div>

            {/* Trending Civic Topics / Searches */}
            <div className="pt-6 sm:pt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-[13px] font-bold text-[#123B68] mr-1">
                  Trending Issues:
                </span>
                {[
                  { label: 'Water Scarcity', q: 'water' },
                  { label: 'Education', q: 'education' },
                  { label: 'Healthcare', q: 'health' },
                  { label: 'Clean Environment', q: 'environment' },
                  { label: 'Rural Development', q: 'rural' },
                  { label: 'Infrastructure', q: 'infrastructure' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={`/services?q=${encodeURIComponent(item.q)}`}
                    className="px-3 py-1 bg-white/80 hover:bg-white text-[#2878B8] hover:text-[#123B68] border border-[#B8D5E5] hover:border-[#2878B8] rounded-full text-xs font-semibold shadow-xs transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. CITIZEN SERVICES SECTION ───────────────────────────── */}
      <section className="py-12 sm:py-14 px-4 sm:px-8 bg-white border-b border-[#D9E4ED]">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Section Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#123B67] tracking-tight">
              Citizen Services
            </h2>
            <p className="text-xs sm:text-sm text-[#60758A] mt-1">
              Access important civic services and track your requests.
            </p>
          </div>

          {/* 6 Clean Horizontal Rectangular Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
            
            {/* Card 1: Report a Grievance */}
            <Link
              to="/submit"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#D9E4ED] hover:border-[#2F6FA8] hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={20} className="text-[#123B67] flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-[13px] text-[#123B67] truncate">
                  Report a Grievance
                </span>
              </div>
              <ArrowRight size={14} className="text-[#60758A] group-hover:text-[#123B67] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* Card 2: Track Grievance */}
            <Link
              to="/track"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#D9E4ED] hover:border-[#2F6FA8] hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Search size={20} className="text-[#123B67] flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-[13px] text-[#123B67] truncate">
                  Track Grievance
                </span>
              </div>
              <ArrowRight size={14} className="text-[#60758A] group-hover:text-[#123B67] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* Card 3: View Departments */}
            <Link
              to="/contact#directory"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#D9E4ED] hover:border-[#2F6FA8] hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Landmark size={20} className="text-[#123B67] flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-[13px] text-[#123B67] truncate">
                  View Departments
                </span>
              </div>
              <ArrowRight size={14} className="text-[#60758A] group-hover:text-[#123B67] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* Card 4: Public Notices */}
            <Link
              to="/notices"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#D9E4ED] hover:border-[#2F6FA8] hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Bell size={20} className="text-[#123B67] flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-[13px] text-[#123B67] truncate">
                  Public Notices
                </span>
              </div>
              <ArrowRight size={14} className="text-[#60758A] group-hover:text-[#123B67] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* Card 5: Service Directory */}
            <Link
              to="/services"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#D9E4ED] hover:border-[#2F6FA8] hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen size={20} className="text-[#123B67] flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-[13px] text-[#123B67] truncate">
                  Service Directory
                </span>
              </div>
              <ArrowRight size={14} className="text-[#60758A] group-hover:text-[#123B67] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* Card 6: Help & Support */}
            <Link
              to="/contact"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#D9E4ED] hover:border-[#2F6FA8] hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Headphones size={20} className="text-[#123B67] flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-[13px] text-[#123B67] truncate">
                  Help &amp; Support
                </span>
              </div>
              <ArrowRight size={14} className="text-[#60758A] group-hover:text-[#123B67] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>

          </div>

        </div>
      </section>

      {/* ── 6. COLLABORATIVE SOLUTION PROCESS SECTION ─────────────── */}
      <section className="py-14 sm:py-16 px-4 sm:px-8 bg-[#F5F9FC] border-b border-[#D9E4ED]">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Section Header */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-[#123B67] tracking-tight">
              From Civic Problem to Collaborative Solution
            </h2>
            <p className="text-xs sm:text-sm text-[#60758A] mt-1 max-w-2xl leading-relaxed">
              Samadhan Setu connects citizens with institutions and organizations to turn real-world challenges into actionable solutions.
            </p>
          </div>

          {/* 5-Step Process Row - Responsive grid with zero horizontal overflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            {/* Step 01 */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-md border border-[#D9E4ED] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#E0EDF8] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <User size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[#F58220]">STEP 01</div>
                <div className="text-xs font-bold text-[#123B67] leading-tight mt-0.5">
                  Citizen Reports Problem
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-md border border-[#D9E4ED] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#E0EDF8] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[#F58220]">STEP 02</div>
                <div className="text-xs font-bold text-[#123B67] leading-tight mt-0.5">
                  Problem Verified
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-md border border-[#D9E4ED] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#E0EDF8] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <Landmark size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[#F58220]">STEP 03</div>
                <div className="text-xs font-bold text-[#123B67] leading-tight mt-0.5">
                  University / Dept Engaged
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-md border border-[#D9E4ED] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#E0EDF8] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <Users size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[#F58220]">STEP 04</div>
                <div className="text-xs font-bold text-[#123B67] leading-tight mt-0.5">
                  Experts Collaborate
                </div>
              </div>
            </div>

            {/* Step 05 */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-md border border-[#D9E4ED] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#E0EDF8] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <Lightbulb size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[#F58220]">STEP 05</div>
                <div className="text-xs font-bold text-[#123B67] leading-tight mt-0.5">
                  Solution Implemented
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 7. STAKEHOLDER SECTION ───────────────────────────────── */}
      <section className="py-14 sm:py-16 px-4 sm:px-8 bg-white border-b border-[#D9E4ED]">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Section Header */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-[#123B67] tracking-tight">
              One Platform. Multiple Stakeholders.
            </h2>
          </div>

          {/* 3 Horizontal Stakeholder Cards with Colored Left Border Accent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Citizens */}
            <Link
              to="/submit"
              className="bg-white p-6 rounded-md border border-[#D9E4ED] border-l-4 border-l-[#2F6FA8] hover:shadow-sm transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-md bg-[#EEF5FA] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase text-[#123B67]">
                  CITIZENS
                </h3>
                <p className="text-xs text-[#60758A] mt-1.5 leading-relaxed">
                  Report local problems and track their resolution.
                </p>
              </div>
            </Link>

            {/* Card 2: Universities */}
            <Link
              to="/university/challenges"
              className="bg-white p-6 rounded-md border border-[#D9E4ED] border-l-4 border-l-[#10B981] hover:shadow-sm transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-md bg-[#EEF5FA] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase text-[#123B67]">
                  UNIVERSITIES
                </h3>
                <p className="text-xs text-[#60758A] mt-1.5 leading-relaxed">
                  Students, faculty and researchers collaborate on societal challenges.
                </p>
              </div>
            </Link>

            {/* Card 3: Industry & Startups */}
            <Link
              to="/industry/invitations"
              className="bg-white p-6 rounded-md border border-[#D9E4ED] border-l-4 border-l-[#8B5CF6] hover:shadow-sm transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-md bg-[#EEF5FA] flex items-center justify-center text-[#123B67] flex-shrink-0">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase text-[#123B67]">
                  INDUSTRY &amp; STARTUPS
                </h3>
                <p className="text-xs text-[#60758A] mt-1.5 leading-relaxed">
                  Provide expertise, technology and implementation support.
                </p>
              </div>
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}
