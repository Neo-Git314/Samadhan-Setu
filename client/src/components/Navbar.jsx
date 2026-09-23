import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  Menu, X, ChevronDown, LogOut, User, LayoutDashboard,
  FileText, MapPin, Building2, Briefcase, BarChart3,
  Shield, Globe, Search, HelpCircle, ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [collabDropdown, setCollabDropdown] = useState(false);
  const [resourcesDropdown, setResourcesDropdown] = useState(false);
  const [lang, setLang] = useState('en');

  const userMenuRef = useRef(null);
  const servicesRef = useRef(null);
  const collabRef = useRef(null);
  const resourcesRef = useRef(null);

  // Close all menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setServicesDropdown(false);
    setCollabDropdown(false);
    setResourcesDropdown(false);
  }, [location.pathname]);

  // Click-outside listener for dropdowns
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesDropdown(false);
      if (collabRef.current && !collabRef.current.contains(e.target)) setCollabDropdown(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) setResourcesDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Auth-gate for actions requiring login
  const handleReportIssue = () => {
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

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'university') return '/university/dashboard';
    if (user.role === 'industry') return '/industry/dashboard';
    return '/citizen/dashboard';
  };

  const ROLE_BADGES = {
    citizen: 'bg-emerald-800 text-emerald-100 border-emerald-700',
    university: 'bg-blue-800 text-blue-100 border-blue-700',
    industry: 'bg-purple-800 text-purple-100 border-purple-700',
    admin: 'bg-red-800 text-red-100 border-red-700',
  };

  const navLinkClass = (paths) => {
    const active = Array.isArray(paths)
      ? paths.some(p => location.pathname === p || location.pathname.startsWith(p))
      : location.pathname === paths;
    return `px-3 py-2 rounded text-xs font-semibold transition-colors ${
      active ? 'bg-navy-800 text-white' : 'text-gray-200 hover:text-white hover:bg-navy-800'
    }`;
  };

  const dropdownItemClass =
    'w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-xs font-medium text-navy-900 transition-colors';

  return (
    <header className="sticky top-0 z-50 font-sans shadow-md bg-navy-900" id="top">

      {/* ── TRICOLOR ACCENT ────────────────────────── */}
      <div className="h-1 w-full bg-gradient-to-r from-saffron-500 via-white to-emerald-600" />



      {/* ── MAIN NAVBAR ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Branding */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
            <div className="w-9 h-9 rounded bg-navy-950 border border-navy-700 flex items-center justify-center text-saffron-400 flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="22" width="28" height="3" rx="1.5" fill="#E65100" />
                <path d="M6 22 L6 12 M26 22 L26 12" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 12 Q16 4 26 12" stroke="#E2E8F0" strokeWidth="2" fill="none"/>
                <line x1="11" y1="22" x2="10" y2="12" stroke="#94a3b8" strokeWidth="1.5"/>
                <line x1="16" y1="22" x2="16" y2="8" stroke="#94a3b8" strokeWidth="1.5"/>
                <line x1="21" y1="22" x2="22" y2="12" stroke="#94a3b8" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-tight leading-none">
                SAMADHAN SETU
              </div>
              <div className="text-gray-400 text-[10px] tracking-wide leading-none mt-0.5">
                Citizen Grievance & Civic Collaboration Portal
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 text-xs font-semibold">

            <Link to="/" className={navLinkClass('/')}>Home</Link>

            <Link to="/about" className={navLinkClass('/about')}>About the Portal</Link>

            {/* Citizen Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className={`px-3 py-2 rounded flex items-center gap-1 text-xs font-semibold transition-colors ${
                  servicesDropdown || location.pathname.startsWith('/services') || location.pathname === '/track'
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-200 hover:text-white hover:bg-navy-800'
                }`}
                aria-expanded={servicesDropdown}
              >
                <span>Citizen Services</span>
                <ChevronDown size={13} className={`transition-transform ${servicesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdown && (
                <div className="absolute left-0 mt-1 w-60 bg-white rounded border border-gray-200 shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    For Citizens
                  </div>
                  <button
                    onClick={() => { setServicesDropdown(false); handleReportIssue(); }}
                    className={dropdownItemClass}
                  >
                    <FileText size={13} className="text-saffron-600 flex-shrink-0" />
                    Report an Issue
                  </button>
                  <Link to="/track" className={dropdownItemClass}>
                    <Search size={13} className="text-blue-600 flex-shrink-0" />
                    Track Grievance
                  </Link>
                  <Link to="/services" className={dropdownItemClass}>
                    <BarChart3 size={13} className="text-gray-500 flex-shrink-0" />
                    Grievance Categories
                  </Link>
                  <Link to="/how-it-works" className={dropdownItemClass}>
                    <HelpCircle size={13} className="text-gray-500 flex-shrink-0" />
                    Citizen Guidelines
                  </Link>
                </div>
              )}
            </div>

            {/* Collaborate Dropdown */}
            <div className="relative" ref={collabRef}>
              <button
                onClick={() => setCollabDropdown(!collabDropdown)}
                className={`px-3 py-2 rounded flex items-center gap-1 text-xs font-semibold transition-colors ${
                  collabDropdown || location.pathname.startsWith('/university') || location.pathname.startsWith('/industry')
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-200 hover:text-white hover:bg-navy-800'
                }`}
                aria-expanded={collabDropdown}
              >
                <span>Collaborate</span>
                <ChevronDown size={13} className={`transition-transform ${collabDropdown ? 'rotate-180' : ''}`} />
              </button>

              {collabDropdown && (
                <div className="absolute left-0 mt-1 w-64 bg-white rounded border border-gray-200 shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    Institutions & Partners
                  </div>
                  <Link to="/about" className={dropdownItemClass}>
                    <Building2 size={13} className="text-blue-600 flex-shrink-0" />
                    University Participation
                  </Link>
                  <Link to="/services" className={dropdownItemClass}>
                    <Briefcase size={13} className="text-emerald-600 flex-shrink-0" />
                    Industry & Startup Collaboration
                  </Link>
                  <button
                    onClick={() => { setCollabDropdown(false); handleReportIssue(); }}
                    className={dropdownItemClass}
                  >
                    <FileText size={13} className="text-saffron-600 flex-shrink-0" />
                    Submit a Solution
                  </button>
                  <Link to="/projects" className={dropdownItemClass}>
                    <ArrowRight size={13} className="text-gray-400 flex-shrink-0" />
                    Ongoing Initiatives
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setResourcesDropdown(!resourcesDropdown)}
                className={`px-3 py-2 rounded flex items-center gap-1 text-xs font-semibold transition-colors ${
                  resourcesDropdown || location.pathname.startsWith('/resources') || location.pathname.startsWith('/how-it-works')
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-200 hover:text-white hover:bg-navy-800'
                }`}
                aria-expanded={resourcesDropdown}
              >
                <span>Resources</span>
                <ChevronDown size={13} className={`transition-transform ${resourcesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {resourcesDropdown && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded border border-gray-200 shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    Help & Information
                  </div>
                  <Link to="/how-it-works" className={dropdownItemClass}>
                    <FileText size={13} className="text-navy-700 flex-shrink-0" />
                    How It Works
                  </Link>
                  <Link to="/resources" className={dropdownItemClass}>
                    <HelpCircle size={13} className="text-saffron-600 flex-shrink-0" />
                    FAQs
                  </Link>
                  <Link to="/resources" className={dropdownItemClass}>
                    <Shield size={13} className="text-emerald-600 flex-shrink-0" />
                    Guidelines
                  </Link>
                  <Link to="/resources" className={dropdownItemClass}>
                    <MapPin size={13} className="text-gray-500 flex-shrink-0" />
                    Help & Support
                  </Link>
                </div>
              )}
            </div>

            <Link to="/track" className={navLinkClass('/track')}>Track Grievance</Link>

          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-2">

            <button
              onClick={handleReportIssue}
              className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 border border-saffron-400"
            >
              <FileText size={14} />
              <span>Report an Issue</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-navy-700">
                <NotificationBell />

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded hover:bg-navy-800 transition-colors focus:outline-none"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <ChevronDown size={13} className="text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded border border-gray-200 shadow-xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="font-bold text-xs text-navy-950 truncate">{user?.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${ROLE_BADGES[user?.role] || 'bg-gray-100 text-gray-800'}`}>
                          {user?.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-xs font-medium text-navy-900"
                      >
                        <LayoutDashboard size={13} className="text-navy-700" />
                        My Dashboard
                      </Link>

                      {user?.role === 'citizen' && (
                        <Link
                          to="/citizen/complaints"
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-xs font-medium text-navy-900"
                        >
                          <MapPin size={13} className="text-navy-700" />
                          My Complaints
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-xs font-medium border-t border-gray-100 mt-1"
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded border border-white/20 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded text-gray-300 hover:text-white hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE MENU ─────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-950 border-t border-navy-800 px-4 py-4 space-y-1 text-sm">

          <Link to="/" className="block py-2.5 px-3 text-gray-200 hover:text-white hover:bg-navy-800 rounded font-medium">
            Home
          </Link>
          <Link to="/about" className="block py-2.5 px-3 text-gray-200 hover:text-white hover:bg-navy-800 rounded font-medium">
            About the Portal
          </Link>
          <Link to="/services" className="block py-2.5 px-3 text-gray-200 hover:text-white hover:bg-navy-800 rounded font-medium">
            Citizen Services
          </Link>
          <Link to="/how-it-works" className="block py-2.5 px-3 text-gray-200 hover:text-white hover:bg-navy-800 rounded font-medium">
            How It Works
          </Link>
          <Link to="/track" className="block py-2.5 px-3 text-gray-200 hover:text-white hover:bg-navy-800 rounded font-medium">
            Track Grievance
          </Link>
          <Link to="/resources" className="block py-2.5 px-3 text-gray-200 hover:text-white hover:bg-navy-800 rounded font-medium">
            FAQs & Help
          </Link>

          <div className="pt-3 border-t border-navy-800 space-y-2">
            <button
              onClick={handleReportIssue}
              className="w-full py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors"
            >
              <FileText size={15} />
              Report an Issue
            </button>

            {isAuthenticated ? (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-gray-400 px-1">
                  Signed in as <strong className="text-white">{user?.name}</strong>
                  <span className="text-gray-500"> ({user?.role})</span>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="block py-2 px-3 bg-navy-800 text-white rounded text-xs font-bold text-center"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-xs font-semibold text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block w-full py-2.5 bg-white/10 text-white text-center text-xs font-semibold rounded border border-white/20"
              >
                Login / Register
              </Link>
            )}
          </div>

        </div>
      )}

    </header>
  );
}
