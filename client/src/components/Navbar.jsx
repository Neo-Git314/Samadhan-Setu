import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import NotificationBell from './NotificationBell';
import SamadhanLogo from './SamadhanLogo';
import {
  Menu, X, ChevronDown, LogOut, Search, Building2,
  FileText, Shield, Phone, Download, HelpCircle,
  Eye, Volume2, ArrowRight, LayoutDashboard, Award,
  Layers, AlertCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const {
    fontSize, increaseFont, resetFont, decreaseFont,
    highContrast, toggleContrast,
    language, setLanguage
  } = useAccessibility();

  const navigate = useNavigate();
  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [showScreenReaderModal, setShowScreenReaderModal] = useState(false);
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  const navRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  const handleMouseEnter = (name) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setMobileSection(null);
    setHeaderSearchOpen(false);
    setAccessibilityOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setHeaderSearchOpen(false);
        setAccessibilityOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setHeaderSearchOpen(false);
        setAccessibilityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'university') return '/university/dashboard';
    if (user.role === 'industry') return '/industry/dashboard';
    return '/citizen/dashboard';
  };

  const isHindi = language === 'hi';

  const handleHeaderSearch = (e) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(headerSearchQuery.trim())}`);
      setHeaderSearchOpen(false);
      setHeaderSearchQuery('');
    }
  };

  const dropdownItemClass =
    'group/item w-full text-left px-4 py-2.5 hover:bg-[#EEF5FA] hover:text-[#123B67] flex items-center gap-2.5 text-xs font-medium text-[#17324D] transition-all duration-150 focus:bg-[#EEF5FA] focus:outline-none hover:pl-5 border-l-2 border-transparent hover:border-[#F58220]';

  return (
    <header className="sticky top-0 z-50 font-sans bg-white border-b border-[#D9E4ED] shadow-sm" ref={navRef}>
      {/* Skip to Main Content */}
      <a href="#main-content" className="skip-to-content">
        {isHindi ? 'मुख्य सामग्री पर जाएं' : 'Skip to Main Content'}
      </a>

      {/* ── MAIN SAMADHAN SETU NAVBAR & NAVIGATION ────── */}
      <div className="bg-white w-full max-w-full overflow-x-clip">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-2.5 sm:gap-4 xl:gap-6">
          
          {/* LEFT: Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0" aria-label="Samadhan Setu Homepage">
            <SamadhanLogo className="w-10 h-10 sm:w-11 sm:h-11" />
            <div className="flex flex-col">
              <span className="text-[#123B67] font-black text-xl sm:text-2xl tracking-tight leading-none">
                SAMADHAN SETU
              </span>
              <span className="text-[#60758A] text-[11px] sm:text-xs font-normal mt-0.5 leading-tight">
                National Civic Grievance &amp; Collaborative Problem Solving Platform
              </span>
            </div>
          </Link>

          {/* CENTER: Clean Horizontal Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 text-[12px] xl:text-[13px] font-medium text-[#17324D] flex-shrink-0" aria-label="Primary Navigation">
            {isAuthenticated && user?.role === 'citizen' && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Home
                </Link>
                <Link
                  to="/submit"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/submit' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Report Grievance
                </Link>
                <Link
                  to="/my-complaints"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/my-complaints' || location.pathname === '/citizen/complaints' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  My Complaints
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'university' && (
              <>
                <Link
                  to="/university/challenges"
                  className={`px-3 py-1.5 transition-colors ${location.pathname.startsWith('/university/challenges') ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Challenges
                </Link>
                <Link
                  to="/projects"
                  className={`px-3 py-1.5 transition-colors ${location.pathname.startsWith('/projects') || location.pathname.startsWith('/university/projects') ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Projects
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'industry' && (
              <>
                <Link
                  to="/industry/invitations"
                  className={`px-3 py-1.5 transition-colors ${location.pathname.startsWith('/industry/invitations') ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Invitations
                </Link>
                <Link
                  to="/industry/dashboard"
                  className={`px-3 py-1.5 transition-colors ${location.pathname.startsWith('/industry/dashboard') ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Projects
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/admin/dashboard' || location.pathname === '/admin' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/complaints"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/admin/complaints' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Complaints
                </Link>
                <Link
                  to="/admin/universities"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/admin/universities' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Universities
                </Link>
                <Link
                  to="/admin/industry-partners"
                  className={`px-3 py-1.5 transition-colors ${location.pathname === '/admin/industry-partners' || location.pathname === '/admin/industry' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : 'hover:text-[#123B67]'}`}
                >
                  Industry Partners
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <>
                {/* Home */}
                <Link
                  to="/"
                  className={`px-2.5 py-1.5 transition-colors relative ${
                    location.pathname === '/' 
                      ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' 
                      : 'hover:text-[#123B67]'
                  }`}
                >
                  Home
                </Link>

                {/* About Us */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter('about')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('about')}
                    className={`px-2.5 py-1.5 flex items-center gap-1 hover:text-[#123B67] transition-colors focus:outline-none ${
                      location.pathname.startsWith('/about') || location.pathname.startsWith('/how-it-works') || activeDropdown === 'about'
                        ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]'
                        : ''
                    }`}
                    aria-expanded={activeDropdown === 'about'}
                  >
                    <span>About Us</span>
                    <ChevronDown size={13} className={`text-[#60758A] transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180 text-[#123B67]' : 'group-hover:text-[#123B67]'}`} />
                  </button>
                  {activeDropdown === 'about' && (
                    <div className="absolute left-0 top-full pt-1.5 w-56 z-50 animate-fade-in">
                      <div className="bg-white rounded-md border border-[#D9E4ED] shadow-xl py-1.5 ring-1 ring-black/5 overflow-hidden">
                        <Link to="/about" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Building2 size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Vision &amp; Mission</span>
                        </Link>
                        <Link to="/how-it-works" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <ArrowRight size={14} className="text-[#F58220] group-hover/item:scale-110 group-hover/item:translate-x-0.5 transition-all" />
                          <span>How It Works</span>
                        </Link>
                        <Link to="/how-it-works#process" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Shield size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Collaborative Framework</span>
                        </Link>
                        <Link to="/resources#faq" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <HelpCircle size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Frequently Asked Questions</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter('services')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('services')}
                    className={`px-2.5 py-1.5 flex items-center gap-1 hover:text-[#123B67] transition-colors focus:outline-none ${
                      location.pathname.startsWith('/services') || location.pathname.startsWith('/submit') || location.pathname.startsWith('/track') || activeDropdown === 'services'
                        ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]'
                        : ''
                    }`}
                    aria-expanded={activeDropdown === 'services'}
                  >
                    <span>Services</span>
                    <ChevronDown size={13} className={`text-[#60758A] transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-[#123B67]' : 'group-hover:text-[#123B67]'}`} />
                  </button>
                  {activeDropdown === 'services' && (
                    <div className="absolute left-0 top-full pt-1.5 w-60 z-50 animate-fade-in">
                      <div className="bg-white rounded-md border border-[#D9E4ED] shadow-xl py-1.5 ring-1 ring-black/5 overflow-hidden">
                        <Link to="/submit" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <FileText size={14} className="text-[#F58220] group-hover/item:scale-110 transition-all" />
                          <span>Report a Grievance</span>
                        </Link>
                        <Link to="/track" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Search size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Track Grievance Status</span>
                        </Link>
                        <Link to="/services" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Layers size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Citizen Services Directory</span>
                        </Link>
                        <Link to="/documents" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Download size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Downloadable Forms</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Departments */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter('departments')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('departments')}
                    className={`px-2.5 py-1.5 flex items-center gap-1 hover:text-[#123B67] transition-colors focus:outline-none ${
                      activeDropdown === 'departments' ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]' : ''
                    }`}
                    aria-expanded={activeDropdown === 'departments'}
                  >
                    <span>Departments</span>
                    <ChevronDown size={13} className={`text-[#60758A] transition-transform duration-200 ${activeDropdown === 'departments' ? 'rotate-180 text-[#123B67]' : 'group-hover:text-[#123B67]'}`} />
                  </button>
                  {activeDropdown === 'departments' && (
                    <div className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-fade-in">
                      <div className="bg-white rounded-md border border-[#D9E4ED] shadow-xl py-1.5 ring-1 ring-black/5 overflow-hidden">
                        <Link to="/contact#directory" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Building2 size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Public Works Department (PWD)</span>
                        </Link>
                        <Link to="/contact#directory" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Building2 size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Municipal Water Supply</span>
                        </Link>
                        <Link to="/contact#directory" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Building2 size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Sanitation &amp; Waste Management</span>
                        </Link>
                        <Link to="/contact#directory" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Building2 size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Electricity &amp; Power</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter('projects')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('projects')}
                    className={`px-2.5 py-1.5 flex items-center gap-1 hover:text-[#123B67] transition-colors focus:outline-none ${
                      location.pathname.startsWith('/projects') || location.pathname.startsWith('/university') || activeDropdown === 'projects'
                        ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]'
                        : ''
                    }`}
                    aria-expanded={activeDropdown === 'projects'}
                  >
                    <span>Projects</span>
                    <ChevronDown size={13} className={`text-[#60758A] transition-transform duration-200 ${activeDropdown === 'projects' ? 'rotate-180 text-[#123B67]' : 'group-hover:text-[#123B67]'}`} />
                  </button>
                  {activeDropdown === 'projects' && (
                    <div className="absolute left-0 top-full pt-1.5 w-60 z-50 animate-fade-in">
                      <div className="bg-white rounded-md border border-[#D9E4ED] shadow-xl py-1.5 ring-1 ring-black/5 overflow-hidden">
                        <Link to="/university/challenges" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Award size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Civic R&amp;D Challenges</span>
                        </Link>
                        <Link to="/industry/invitations" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Building2 size={14} className="text-[#F58220] group-hover/item:scale-110 transition-all" />
                          <span>Industry Partnerships</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resources */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter('resources')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('resources')}
                    className={`px-2.5 py-1.5 flex items-center gap-1 hover:text-[#123B67] transition-colors focus:outline-none ${
                      location.pathname.startsWith('/resources') || location.pathname.startsWith('/notices') || location.pathname.startsWith('/documents') || activeDropdown === 'resources'
                        ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]'
                        : ''
                    }`}
                    aria-expanded={activeDropdown === 'resources'}
                  >
                    <span>Resources</span>
                    <ChevronDown size={13} className={`text-[#60758A] transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-[#123B67]' : 'group-hover:text-[#123B67]'}`} />
                  </button>
                  {activeDropdown === 'resources' && (
                    <div className="absolute left-0 top-full pt-1.5 w-56 z-50 animate-fade-in">
                      <div className="bg-white rounded-md border border-[#D9E4ED] shadow-xl py-1.5 ring-1 ring-black/5 overflow-hidden">
                        <Link to="/notices" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <AlertCircle size={14} className="text-[#F58220] group-hover/item:scale-110 transition-all" />
                          <span>Public Notices</span>
                        </Link>
                        <Link to="/documents" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Download size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Official Documents</span>
                        </Link>
                        <Link to="/resources#charter" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Shield size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Citizen Charter</span>
                        </Link>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            setShowScreenReaderModal(true);
                          }}
                          className={dropdownItemClass}
                        >
                          <Volume2 size={14} className="text-[#2F6FA8] group-hover/item:scale-110 group-hover/item:text-[#123B67] transition-all" />
                          <span>Accessibility &amp; Assistive Info</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`px-2.5 py-1.5 transition-colors ${
                    location.pathname === '/contact'
                      ? 'text-[#123B67] font-bold border-b-2 border-[#F58220]'
                      : 'hover:text-[#123B67]'
                  }`}
                >
                  Contact
                </Link>
              </>
            )}

            {/* Header Search Icon */}
            <div className="relative ml-1">
              <button
                onClick={() => setHeaderSearchOpen(!headerSearchOpen)}
                className="p-1.5 text-[#17324D] hover:text-[#123B67] hover:bg-[#EEF5FA] rounded-full transition-colors focus:outline-none"
                aria-label="Search portal"
                title="Search portal"
              >
                <Search size={16} />
              </button>
              {headerSearchOpen && (
                <form
                  onSubmit={handleHeaderSearch}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-md border border-[#D9E4ED] shadow-xl p-2 z-50 flex items-center gap-1.5 animate-fade-in"
                >
                  <input
                    type="text"
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    placeholder="Search services or notices..."
                    className="flex-1 text-xs px-2.5 py-1.5 border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2F6FA8]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#123B67] text-white text-xs font-semibold rounded hover:bg-[#0B2440]"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>
          </nav>

          {/* RIGHT: Login & Register Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NotificationBell />

                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter('user')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('user')}
                    className={`flex items-center gap-2 p-1.5 rounded-md hover:bg-[#EEF5FA] border border-[#D9E4ED] transition-colors focus:outline-none ${
                      activeDropdown === 'user' ? 'bg-[#EEF5FA] border-[#2F6FA8]' : ''
                    }`}
                    aria-expanded={activeDropdown === 'user'}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#123B67] text-white flex items-center justify-center text-xs font-bold">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-[#17324D] max-w-[100px] truncate">
                      {user?.name || 'Account'}
                    </span>
                    <ChevronDown size={13} className={`text-[#60758A] transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180 text-[#123B67]' : 'group-hover:text-[#123B67]'}`} />
                  </button>

                  {activeDropdown === 'user' && (
                    <div className="absolute right-0 top-full pt-1.5 w-56 z-50 animate-fade-in">
                      <div className="bg-white rounded-md border border-[#D9E4ED] shadow-xl py-1 ring-1 ring-black/5 overflow-hidden">
                      <div className="px-4 py-2 border-b border-[#D9E4ED] bg-[#F5F9FC]">
                        <div className="font-bold text-xs text-[#123B67] truncate">{user?.name}</div>
                        <div className="text-[11px] text-[#60758A] truncate">{user?.email}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EEF5FA] text-[#2F6FA8] border border-[#D9E4ED]">
                          Role: {user?.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        className={dropdownItemClass}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <LayoutDashboard size={14} className="text-[#123B67]" />
                        Dashboard
                      </Link>

                      {user?.role === 'citizen' && (
                        <Link
                          to="/citizen/complaints"
                          className={dropdownItemClass}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <FileText size={14} className="text-[#123B67]" />
                          My Grievances
                        </Link>
                      )}

                      <Link
                        to="/submit"
                        className={dropdownItemClass}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Search size={14} className="text-[#F58220]" />
                        File New Grievance
                      </Link>

                      <div className="border-t border-[#D9E4ED] my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center">
                {/* Login: White outlined button matching screenshot */}
                <Link
                  to="/auth"
                  className="px-5 py-1.5 text-xs font-semibold text-[#123B67] bg-white border border-[#123B67] hover:bg-[#EEF5FA] rounded-md transition-colors shadow-sm"
                >
                  {isHindi ? 'लॉगिन' : 'Login'}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-md text-[#123B67] hover:bg-[#EEF5FA] lg:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE ACCORDION MENU ─────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#D9E4ED] px-4 py-4 space-y-2 text-xs text-[#17324D] shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
          >
            Home
          </Link>

          <div>
            <button
              onClick={() => setMobileSection(mobileSection === 'about' ? null : 'about')}
              className="w-full flex items-center justify-between py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
            >
              <span>About Us</span>
              <ChevronDown size={14} className={`transition-transform ${mobileSection === 'about' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'about' && (
              <div className="pl-4 py-1 space-y-1 bg-[#F5F9FC] rounded">
                <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#60758A] hover:text-[#123B67]">Vision &amp; Mission</Link>
                <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#60758A] hover:text-[#123B67]">How It Works</Link>
                <Link to="/resources#faq" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#60758A] hover:text-[#123B67]">FAQs</Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMobileSection(mobileSection === 'services' ? null : 'services')}
              className="w-full flex items-center justify-between py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
            >
              <span>Services</span>
              <ChevronDown size={14} className={`transition-transform ${mobileSection === 'services' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'services' && (
              <div className="pl-4 py-1 space-y-1 bg-[#F5F9FC] rounded">
                <Link to="/submit" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#F58220] font-semibold">Report a Grievance</Link>
                <Link to="/track" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#60758A] hover:text-[#123B67]">Track Grievance</Link>
                <Link to="/services" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#60758A] hover:text-[#123B67]">Services Directory</Link>
                <Link to="/documents" onClick={() => setMobileOpen(false)} className="block py-1.5 text-[#60758A] hover:text-[#123B67]">Download Forms</Link>
              </div>
            )}
          </div>

          <Link
            to="/contact#directory"
            onClick={() => setMobileOpen(false)}
            className="block py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
          >
            Departments
          </Link>

          <Link
            to="/university/challenges"
            onClick={() => setMobileOpen(false)}
            className="block py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
          >
            Projects
          </Link>

          <Link
            to="/notices"
            onClick={() => setMobileOpen(false)}
            className="block py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
          >
            Resources
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block py-2 px-3 rounded font-semibold hover:bg-[#EEF5FA]"
          >
            Contact
          </Link>

          {/* Mobile Accessibility & Language Bar */}
          <div className="pt-2 pb-1 border-t border-[#D9E4ED] space-y-2">
            <div className="flex items-center justify-between px-2 text-[11px] text-[#60758A]">
              <span>Font Size:</span>
              <div className="flex items-center gap-1 font-semibold text-xs bg-gray-50 border border-gray-200 rounded p-0.5">
                <button onClick={decreaseFont} className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-[#123B68] text-white' : ''}`}>A-</button>
                <button onClick={resetFont} className={`px-2 py-0.5 rounded ${fontSize === 'base' ? 'bg-[#123B68] text-white' : ''}`}>A</button>
                <button onClick={increaseFont} className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-[#123B68] text-white' : ''}`}>A+</button>
              </div>
            </div>
            <div className="flex items-center justify-between px-2 text-[11px] text-[#60758A]">
              <span>Language:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 text-xs rounded border ${language === 'hi' ? 'bg-[#123B68] text-white font-bold' : 'bg-gray-50'}`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 text-xs rounded border ${language === 'en' ? 'bg-[#123B68] text-white font-bold' : 'bg-gray-50'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-[#D9E4ED] grid grid-cols-2 gap-2">
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="py-2 text-center text-xs font-semibold rounded-md border border-[#123B67] text-[#123B67] hover:bg-[#EEF5FA]"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                onClick={() => setMobileOpen(false)}
                className="py-2 text-center text-xs font-semibold rounded-md bg-[#F58220] text-white hover:bg-[#E06D0C]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Screen Reader Modal */}
      {showScreenReaderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-[#D9E4ED] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E4ED] pb-2">
              <h3 className="font-bold text-[#123B67] text-base flex items-center gap-2">
                <Volume2 className="text-[#2F6FA8]" size={18} />
                Accessibility &amp; Screen Reader Information
              </h3>
              <button
                onClick={() => setShowScreenReaderModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-[#17324D] space-y-2 leading-relaxed">
              <p>
                Samadhan Setu follows the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-[#2F6FA8]">
                <li>Press <kbd className="bg-gray-100 px-1 border rounded font-mono">Tab</kbd> to reach the "Skip to Main Content" link.</li>
                <li>Press <kbd className="bg-gray-100 px-1 border rounded font-mono">Esc</kbd> anytime to close dropdown menus.</li>
                <li>Use Font size controls (A-, A, A+) in the top bar to adjust text scale.</li>
              </ul>
            </div>
            <div className="pt-2 text-right border-t border-[#D9E4ED]">
              <button
                onClick={() => setShowScreenReaderModal(false)}
                className="px-4 py-1.5 bg-[#123B67] text-white text-xs font-semibold rounded hover:bg-[#0B2440]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
