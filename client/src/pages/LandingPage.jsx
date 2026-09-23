import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../api/endpoints';
import {
  FileText,
  Search,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Droplets,
  Zap,
  Leaf,
  GraduationCap,
  HeartPulse,
  Truck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
  Home,
  Tractor,
  Accessibility,
  Waves,
  Package
} from 'lucide-react';

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  // Fetch real-time public stats from the API
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['public-summary-stats'],
    queryFn: async () => {
      try {
        const res = await analyticsApi.getPublicSummary();
        return res.data?.data || null;
      } catch (e) {
        return null;
      }
    },
    staleTime: 60000,
  });

  // Only use API data; no hardcoded fallback numbers displayed as real
  const stats = statsData;

  const handleReportClick = () => {
    if (isAuthenticated) {
      navigate('/submit');
    } else {
      navigate('/auth', {
        state: {
          from: { pathname: '/submit' },
          message: 'Please login or create a citizen account to report a grievance.'
        }
      });
    }
  };

  const handleTrackClick = () => {
    if (isAuthenticated && user?.role === 'citizen') {
      navigate('/citizen/complaints');
    } else {
      navigate('/track');
    }
  };

  const SECTORS = [
    { name: 'Education', icon: GraduationCap },
    { name: 'Healthcare', icon: HeartPulse },
    { name: 'Agriculture', icon: Tractor },
    { name: 'Water Management', icon: Droplets },
    { name: 'Sanitation', icon: Package },
    { name: 'Environment', icon: Leaf },
    { name: 'Rural Livelihoods', icon: Home },
    { name: 'Accessibility', icon: Accessibility },
    { name: 'Urban Infrastructure', icon: Truck },
    { name: 'Public Service Delivery', icon: Users },
  ];

  const PROCESS_STEPS = [
    {
      num: '01',
      title: 'Citizen Identifies a Problem',
      desc: 'A citizen notices a civic issue — infrastructure, sanitation, healthcare access, or any societal challenge.'
    },
    {
      num: '02',
      title: 'Issue is Submitted',
      desc: 'The citizen submits the issue through this portal with relevant details, location, and supporting information.'
    },
    {
      num: '03',
      title: 'Stakeholders Review It',
      desc: 'The relevant stakeholders — administrators, universities, or partner organizations — are notified and review the submission.'
    },
    {
      num: '04',
      title: 'Universities & Organizations Collaborate',
      desc: 'Academic institutions and partner organizations can contribute knowledge, research, and practical solutions to the problem.'
    },
    {
      num: '05',
      title: 'Solution Progress is Tracked',
      desc: 'Citizens can track updates on the status and progress of their submitted issue through the portal.'
    },
  ];

  const FAQS = [
    {
      q: 'What is Samadhan Setu?',
      a: 'Samadhan Setu is a civic grievance and collaboration portal developed as a prototype for Smart India Hackathon (SIH) 2026. It provides a platform for citizens to submit civic issues and connect them with universities and organizations that can contribute to finding practical solutions.'
    },
    {
      q: 'Do I need an account to report an issue?',
      a: 'Yes, an account is required to submit a grievance. This ensures accountability and allows you to track updates on your submitted issue. You can browse the portal and learn about the platform without logging in.'
    },
    {
      q: 'How do universities participate?',
      a: 'Universities and academic institutions can register on the portal and review civic challenges that match their areas of research or expertise. They can then take up challenges and work on potential solutions.'
    },
    {
      q: 'How can industry and organizations participate?',
      a: 'Industry partners and organizations can review active projects on the portal and collaborate with universities and other stakeholders to contribute resources, expertise, or support towards solutions.'
    },
    {
      q: 'Is there any fee to use this portal?',
      a: 'No. Samadhan Setu is a free public-service prototype intended for civic benefit and academic collaboration. There are no charges for any user.'
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800" id="main-content">

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="bg-navy-900 text-white border-b-2 border-saffron-500">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Core message */}
          <div className="lg:col-span-7 space-y-5">

            <div>
              <p className="text-saffron-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Smart India Hackathon 2026 · Prototype
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                SAMADHAN SETU
              </h1>
              <p className="text-base text-gray-300 font-medium mt-1">
                Citizen Grievance &amp; Civic Collaboration Portal
              </p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              Report civic issues, track grievance status, and connect societal challenges with universities and organizations working on practical solutions.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={handleReportClick}
                className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm rounded transition-colors flex items-center gap-2 border border-saffron-400"
              >
                <FileText size={16} />
                Report an Issue
              </button>
              <button
                onClick={handleTrackClick}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded border border-white/25 transition-colors flex items-center gap-2"
              >
                <Search size={16} />
                Track Grievance
              </button>
            </div>

            <p className="text-xs text-gray-400 pt-1">
              Geo-tagged reporting &nbsp;·&nbsp; Transparent tracking &nbsp;·&nbsp; Collaborative solutions
            </p>
          </div>

          {/* Right: How the portal works (replaces fake status card) */}
          <div className="lg:col-span-5">
            <div className="bg-navy-950 border border-navy-700 rounded p-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-navy-800 pb-2 mb-4">
                How the Portal Works
              </h2>
              <ol className="space-y-3">
                {[
                  { n: '01', label: 'Report', desc: 'Submit a civic issue with relevant details and location.' },
                  { n: '02', label: 'Review', desc: 'The issue is reviewed by the concerned stakeholders.' },
                  { n: '03', label: 'Collaborate', desc: 'Universities and organizations can contribute solutions.' },
                  { n: '04', label: 'Resolve', desc: 'Citizens can track progress towards resolution.' },
                ].map(step => (
                  <li key={step.n} className="flex items-start gap-3">
                    <span className="text-saffron-400 font-bold text-xs w-6 flex-shrink-0 mt-0.5">{step.n}</span>
                    <div>
                      <span className="text-white text-xs font-semibold">{step.label} </span>
                      <span className="text-gray-400 text-xs">— {step.desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 pt-3 border-t border-navy-800">
                <Link
                  to="/how-it-works"
                  className="text-xs text-saffron-400 hover:text-saffron-300 font-medium transition-colors flex items-center gap-1"
                >
                  Read full process guide <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── PLATFORM STATISTICS (real API data only) ────── */}
      {stats && (
        <section className="bg-gray-50 border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-[11px] text-gray-400 text-center mb-4 uppercase tracking-wider font-semibold">
              Platform at a Glance &nbsp;·&nbsp; Demo Data
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Grievances Filed', value: stats.totalGrievances },
                { label: 'In Progress', value: stats.inProgressGrievances },
                { label: 'Resolved', value: stats.resolvedGrievances },
                { label: 'Active Projects', value: stats.activeProjects },
                { label: 'Universities', value: stats.participatingUniversities },
                { label: 'Industry Partners', value: stats.collaboratingIndustries },
              ].map((st, i) => (
                <div key={i} className="bg-white p-3 rounded border border-gray-200 text-center">
                  <div className="text-xl font-bold text-navy-900">
                    {statsLoading ? '—' : (st.value ?? '—')}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CITIZEN SERVICES ─────────────────────────────── */}
      <section className="py-12 px-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-navy-950">Citizen Services</h2>
            <p className="text-sm text-gray-500 mt-1">
              Key services available through this portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="border border-gray-200 rounded p-5 bg-white hover:border-navy-400 transition-colors flex flex-col">
              <div className="w-10 h-10 rounded bg-saffron-50 border border-saffron-200 flex items-center justify-center mb-3">
                <FileText size={20} className="text-saffron-600" />
              </div>
              <h3 className="text-sm font-bold text-navy-950 mb-1">Report an Issue</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">
                Submit a civic grievance or societal challenge with supporting details.
              </p>
              <button
                onClick={handleReportClick}
                className="mt-4 w-full py-2 px-3 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5"
              >
                Submit Grievance <ArrowRight size={13} />
              </button>
            </div>

            <div className="border border-gray-200 rounded p-5 bg-white hover:border-navy-400 transition-colors flex flex-col">
              <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center mb-3">
                <Search size={20} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-navy-950 mb-1">Track Grievance</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">
                Check the current status of your submitted grievance.
              </p>
              <button
                onClick={handleTrackClick}
                className="mt-4 w-full py-2 px-3 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5"
              >
                Check Status <ArrowRight size={13} />
              </button>
            </div>

            <div className="border border-gray-200 rounded p-5 bg-white hover:border-navy-400 transition-colors flex flex-col">
              <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <Building2 size={20} className="text-navy-700" />
              </div>
              <h3 className="text-sm font-bold text-navy-950 mb-1">Explore Projects</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">
                Discover collaborative projects and ongoing initiatives.
              </p>
              <Link
                to="/projects"
                className="mt-4 w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5"
              >
                View Projects <ArrowRight size={13} />
              </Link>
            </div>

            <div className="border border-gray-200 rounded p-5 bg-white hover:border-navy-400 transition-colors flex flex-col">
              <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <Briefcase size={20} className="text-navy-700" />
              </div>
              <h3 className="text-sm font-bold text-navy-950 mb-1">Participate</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">
                Connect with universities and organizations working on societal challenges.
              </p>
              <Link
                to="/about"
                className="mt-4 w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5"
              >
                Learn More <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── AREAS OF CIVIC CONCERN ───────────────────────── */}
      <section className="py-12 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-navy-950">Areas of Civic Concern</h2>
            <p className="text-sm text-gray-500 mt-1">
              Issues can be reported across the following domains.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SECTORS.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <button
                  key={idx}
                  onClick={handleReportClick}
                  className="flex items-center gap-2.5 p-3 bg-white border border-gray-200 rounded hover:border-navy-400 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-navy-700" />
                  </div>
                  <span className="text-xs font-medium text-navy-900 leading-tight">{sec.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FROM PROBLEM TO SOLUTION ─────────────────────── */}
      <section className="py-12 px-4 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-navy-950">From Problem to Solution</h2>
            <p className="text-sm text-gray-500 mt-1">
              How a civic issue moves through the portal.
            </p>
          </div>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Number + connector line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {step.num}
                  </div>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 my-1" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-6 ${idx === PROCESS_STEPS.length - 1 ? '' : ''}`}>
                  <h3 className="text-sm font-semibold text-navy-950 leading-snug">{step.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Link
              to="/how-it-works"
              className="text-xs font-semibold text-navy-900 hover:text-saffron-600 transition-colors flex items-center gap-1"
            >
              Read the full process guide <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── COLLABORATION SECTION ────────────────────────── */}
      <section className="py-12 px-4 bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Connecting Civic Challenges with Collaborative Solutions
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Samadhan Setu creates a common platform where citizens can raise societal challenges and academic institutions and partner organizations can contribute knowledge, research, and practical solutions.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                The portal connects four groups — citizens, universities, industry partners, and administrators — around a shared goal: turning identified problems into tracked, actionable outcomes.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-xs rounded transition-colors"
                >
                  About the Portal
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded border border-white/20 transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* 4-quadrant overview */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Citizens', desc: 'Identify and submit civic issues with supporting details.' },
                { label: 'Universities / HEIs', desc: 'Review challenges and contribute research and expertise.' },
                { label: 'Industry & Startups', desc: 'Collaborate and contribute resources towards solutions.' },
                { label: 'Government / Authorities', desc: 'Oversee, verify, and act on submitted grievances.' },
              ].map((item, i) => (
                <div key={i} className="bg-navy-800 border border-navy-700 rounded p-4">
                  <h3 className="text-xs font-bold text-saffron-300 mb-1">{item.label}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS ──────────────────── */}
      <section className="py-12 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-navy-950">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Common queries about using this portal.
            </p>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between text-sm font-semibold text-navy-950 hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen
                      ? <ChevronUp size={15} className="text-saffron-600 flex-shrink-0" />
                      : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                    }
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-xs text-gray-500">
            More questions?{' '}
            <Link to="/resources" className="text-navy-900 font-semibold underline">
              Visit the Help & Resources page
            </Link>.
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-10 px-4 bg-navy-950 text-white text-center">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-base font-bold">
            Have a civic issue to report or a question about the portal?
          </h2>
          <p className="text-xs text-gray-400">
            This portal is open to all citizens. You can browse freely, and login is only required to submit a grievance.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              onClick={handleReportClick}
              className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded transition-colors flex items-center gap-2"
            >
              <FileText size={14} />
              Report a Grievance
            </button>
            <Link
              to="/resources"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded border border-white/20 transition-colors"
            >
              Help & FAQs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
