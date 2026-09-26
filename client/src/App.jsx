import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Civic Portal Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ServicesPage from './pages/ServicesPage';
import ResourcesPage from './pages/ResourcesPage';
import TrackPage from './pages/TrackPage';
import AuthPage from './pages/AuthPage';
import NoticesPage from './pages/NoticesPage';
import DocumentsPage from './pages/DocumentsPage';
import ContactPage from './pages/ContactPage';

// Protected Citizen Pages
import CitizenSubmit from './pages/CitizenSubmit';
import CitizenComplaints from './pages/CitizenComplaints';
import CitizenDashboard from './pages/CitizenDashboard';
import ComplaintDetail from './pages/ComplaintDetail';

// Protected University Pages
import UniChallenges from './pages/UniChallenges';
import UniProjectDetail from './pages/UniProjectDetail';
import UniversityProfile from './pages/UniversityProfile';

// Protected Industry Pages
import IndustryInvites from './pages/IndustryInvites';
import IndustryProfile from './pages/IndustryProfile';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';

// Notifications
import Notifications from './pages/Notifications';

import { useAuth } from './context/AuthContext';

function RoleBasedDashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  const ROLE_REDIRECTS = {
    citizen: '/citizen/dashboard',
    university: '/university/dashboard',
    industry: '/industry/dashboard',
    admin: '/admin/dashboard',
  };
  return <Navigate to={ROLE_REDIRECTS[user.role] || '/citizen/dashboard'} replace />;
}

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden" id="main-content">
        <Routes>
          {/* Public Civic Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServicesPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/faq" element={<Navigate to="/resources" replace />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/grievance/track" element={<TrackPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Unified Dashboard Gateway */}
          <Route path="/dashboard" element={<RoleBasedDashboardRedirect />} />

          {/* Grievance Submission */}
          <Route path="/submit" element={<CitizenSubmit />} />
          <Route path="/grievance/new" element={<CitizenSubmit />} />
          <Route path="/report" element={<Navigate to="/submit" replace />} />
          <Route path="/citizen/submit" element={<Navigate to="/submit" replace />} />

          {/* Citizen Protected Routes */}
          <Route path="/citizen/dashboard" element={
            <ProtectedRoute roles={['citizen', 'admin']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/citizen/complaints" element={
            <ProtectedRoute roles={['citizen', 'admin']}>
              <CitizenComplaints />
            </ProtectedRoute>
          } />
          <Route path="/my-complaints" element={
            <ProtectedRoute roles={['citizen', 'admin']}>
              <CitizenComplaints />
            </ProtectedRoute>
          } />

          {/* Grievance Inspection Detail */}
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/grievance/:id" element={<ComplaintDetail />} />

          {/* University Routes */}
          <Route path="/university" element={<Navigate to="/university/dashboard" replace />} />
          <Route path="/university/dashboard" element={
            <ProtectedRoute roles={['university', 'admin']}>
              <UniChallenges />
            </ProtectedRoute>
          } />
          <Route path="/university/challenges" element={
            <ProtectedRoute roles={['university', 'admin']}>
              <UniChallenges />
            </ProtectedRoute>
          } />
          <Route path="/university/projects/:id" element={
            <ProtectedRoute roles={['university', 'industry', 'admin']}>
              <UniProjectDetail />
            </ProtectedRoute>
          } />
          <Route path="/university/profile" element={
            <ProtectedRoute roles={['university', 'admin']}>
              <UniversityProfile />
            </ProtectedRoute>
          } />
          <Route path="/projects" element={<Navigate to="/university/challenges" replace />} />
          <Route path="/projects/:id" element={<UniProjectDetail />} />

          {/* Industry Routes */}
          <Route path="/industry" element={<Navigate to="/industry/dashboard" replace />} />
          <Route path="/industry/dashboard" element={
            <ProtectedRoute roles={['industry', 'admin']}>
              <IndustryInvites />
            </ProtectedRoute>
          } />
          <Route path="/industry/invitations" element={
            <ProtectedRoute roles={['industry', 'admin']}>
              <IndustryInvites />
            </ProtectedRoute>
          } />
          <Route path="/industry/invites" element={<Navigate to="/industry/invitations" replace />} />
          <Route path="/industry/profile" element={
            <ProtectedRoute roles={['industry', 'admin']}>
              <IndustryProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute roles={['admin']}>
              <AdminComplaints />
            </ProtectedRoute>
          } />
          <Route path="/admin/grievances" element={
            <ProtectedRoute roles={['admin']}>
              <AdminComplaints />
            </ProtectedRoute>
          } />
          <Route path="/admin/grievances/:id" element={
            <ProtectedRoute roles={['admin']}>
              <ComplaintDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/hotspots" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/universities" element={
            <ProtectedRoute roles={['admin']}>
              <UniversityProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/industry" element={
            <ProtectedRoute roles={['admin']}>
              <IndustryProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/industry-partners" element={
            <ProtectedRoute roles={['admin']}>
              <IndustryProfile />
            </ProtectedRoute>
          } />

          {/* Activity / Notifications */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
