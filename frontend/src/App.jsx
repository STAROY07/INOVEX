import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StartupProvider } from './context/StartupContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { MentorPage } from './pages/MentorPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { NextActionsPage } from './pages/NextActionsPage';
import { ValidationPage } from './pages/ValidationPage';
import { BusinessPlanPage } from './pages/BusinessPlanPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { LegalCompliancePage } from './pages/LegalCompliancePage';
import { FundingPage } from './pages/FundingPage';
import { LearningResourcesPage } from './pages/LearningResourcesPage';
import { ProfilePage } from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-slate-400 text-sm">
        Authenticating founder session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <StartupProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/resources" element={<LearningResourcesPage />} />

            {/* Protected Routes */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <AssessmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor"
              element={
                <ProtectedRoute>
                  <MentorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/actions"
              element={
                <ProtectedRoute>
                  <NextActionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validation"
              element={
                <ProtectedRoute>
                  <ValidationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-plan"
              element={
                <ProtectedRoute>
                  <BusinessPlanPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/legal"
              element={
                <ProtectedRoute>
                  <LegalCompliancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/funding"
              element={
                <ProtectedRoute>
                  <FundingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StartupProvider>
    </AuthProvider>
  );
}

export default App;
