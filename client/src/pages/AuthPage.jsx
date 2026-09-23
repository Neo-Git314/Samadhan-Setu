import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/endpoints';
import { Eye, EyeOff, AlertCircle, User, Mail, Lock, Building, Briefcase, ShieldCheck } from 'lucide-react';

const ROLES = [
  { value: 'citizen', label: 'Citizen', icon: User, desc: 'Report civic issues in your locality' },
  { value: 'university', label: 'University / Institute', icon: Building, desc: 'Contribute research to solve challenges' },
  { value: 'industry', label: 'Industry Partner', icon: Briefcase, desc: 'Collaborate and fund solutions' },
];

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', institution: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state.from : null);
  const redirectMessage = location.state?.message || (from ? 'Please sign in or create an account to proceed.' : null);

  const ROLE_REDIRECTS = {
    citizen: '/citizen/dashboard',
    university: '/university/dashboard',
    industry: '/industry/dashboard',
    admin: '/admin/dashboard',
  };

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (mode === 'register' && !form.name) { setError('Full name is required.'); return; }
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await authApi.login({ email: form.email, password: form.password });
      } else {
        res = await authApi.register({ name: form.name, email: form.email, password: form.password, role: form.role, institution: form.institution });
      }
      const { token, user } = res.data;
      login(user, token);
      navigate(from || ROLE_REDIRECTS[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="w-full max-w-md">
        {/* Government Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-navy-900 text-white rounded-md mb-2 shadow-sm">
            <ShieldCheck size={26} className="text-saffron-400" />
          </div>
          <h1 className="text-xl font-bold text-navy-900 uppercase tracking-tight">Samadhan Setu Portal</h1>
          <p className="text-gray-600 text-xs mt-0.5">Government Grievance Redressal & Academic R&D Platform</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-300 shadow-md overflow-hidden">
          {redirectMessage && (
            <div className="bg-blue-50 border-b border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2.5">
              <span className="text-blue-600 font-bold text-sm">ℹ️</span>
              <span className="font-medium">{redirectMessage}</span>
            </div>
          )}

          {/* Tab Toggle */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? 'text-navy-900 border-b-2 border-navy-800 bg-gray-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handle}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Register As</label>
                  <div className="space-y-2">
                    {ROLES.map(r => (
                      <label
                        key={r.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          form.role === r.value
                            ? 'border-navy-600 bg-navy-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={form.role === r.value}
                          onChange={handle}
                          className="accent-navy-800"
                        />
                        <r.icon size={16} className={form.role === r.value ? 'text-navy-700' : 'text-gray-400'} />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{r.label}</div>
                          <div className="text-xs text-gray-500">{r.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {(form.role === 'university' || form.role === 'industry') && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      {form.role === 'university' ? 'Institution Name' : 'Company / Organization Name'}
                    </label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="institution"
                        value={form.institution}
                        onChange={handle}
                        placeholder={form.role === 'university' ? 'IIT Ranchi, NIT Jamshedpur…' : 'Tata Motors, ONGC…'}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-navy-500 focus:ring-1 focus:ring-navy-200 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Please wait…' : (mode === 'login' ? 'Sign In to Portal' : 'Create Account')}
            </button>

            {/* Demo credentials */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
              <p className="text-xs font-semibold text-amber-800 mb-1.5">⚡ 1-Click SIH Showcase Logins</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Admin', 'admin@samadhansetu.gov.in', 'Admin@2026', 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'],
                  ['Citizen', 'citizen@samadhansetu.gov.in', 'Citizen@2026', 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'],
                  ['University', 'bitmesra@edu.in', 'Uni@2026', 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'],
                  ['Industry', 'contact@tatasteelcsr.com', 'Industry@2026', 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'],
                ].map(([role, email, pw, style]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForm(f => ({ ...f, email, password: pw }));
                    }}
                    className={`p-2 text-left rounded border text-[11px] font-medium transition-colors ${style}`}
                  >
                    <div className="font-bold">{role}</div>
                    <div className="truncate opacity-80">{email}</div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-amber-700 mt-2 text-center">Click any role to autofill credentials, then click "Sign In to Portal"</p>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Government of India Initiative · Secured with JWT Authentication
        </p>
      </div>
    </div>
  );
}
