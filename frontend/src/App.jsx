import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Loader from './components/common/Loader';

// Public pages
const Home = lazy(() => import('./pages/public/Home'));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'));
const PublicImpact = lazy(() => import('./pages/public/PublicImpact'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Donor pages
const DonorDashboard = lazy(() => import('./pages/donor/DonorDashboard'));
const CreateDonation = lazy(() => import('./pages/donor/CreateDonation'));
const MyDonations = lazy(() => import('./pages/donor/MyDonations'));
const DonationDetails = lazy(() => import('./pages/donor/DonationDetails'));
const AIMatching = lazy(() => import('./pages/donor/AIMatching'));
const DonorImpact = lazy(() => import('./pages/donor/DonorImpact'));
const DonorProfile = lazy(() => import('./pages/donor/DonorProfile'));

// Receiver pages
const ReceiverDashboard = lazy(() => import('./pages/receiver/ReceiverDashboard'));
const FindFood = lazy(() => import('./pages/receiver/FindFood'));
const ReceiverDonationDetails = lazy(() => import('./pages/receiver/ReceiverDonationDetails'));
const Pickup = lazy(() => import('./pages/receiver/Pickup'));
const ReceiverImpact = lazy(() => import('./pages/receiver/ReceiverImpact'));
const ReceiverProfile = lazy(() => import('./pages/receiver/ReceiverProfile'));

// 404
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <Loader text="Loading..." />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="fb-app">
          <Navbar />
          <main className="fb-main">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Public ── */}
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/impact" element={<PublicImpact />} />

                {/* ── Auth ── */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ── Donor ── */}
                <Route path="/donor/dashboard" element={
                  <ProtectedRoute role="DONOR"><DonorDashboard /></ProtectedRoute>
                } />
                <Route path="/donor/donations/create" element={
                  <ProtectedRoute role="DONOR"><CreateDonation /></ProtectedRoute>
                } />
                <Route path="/donor/donations" element={
                  <ProtectedRoute role="DONOR"><MyDonations /></ProtectedRoute>
                } />
                <Route path="/donor/donations/:id" element={
                  <ProtectedRoute role="DONOR"><DonationDetails /></ProtectedRoute>
                } />
                <Route path="/donor/ai-matching/:id" element={
                  <ProtectedRoute role="DONOR"><AIMatching /></ProtectedRoute>
                } />
                <Route path="/donor/impact" element={
                  <ProtectedRoute role="DONOR"><DonorImpact /></ProtectedRoute>
                } />
                <Route path="/donor/profile" element={
                  <ProtectedRoute role="DONOR"><DonorProfile /></ProtectedRoute>
                } />

                {/* ── Receiver ── */}
                <Route path="/receiver/dashboard" element={
                  <ProtectedRoute role="RECEIVER"><ReceiverDashboard /></ProtectedRoute>
                } />
                <Route path="/receiver/food" element={
                  <ProtectedRoute role="RECEIVER"><FindFood /></ProtectedRoute>
                } />
                <Route path="/receiver/food/:id" element={
                  <ProtectedRoute role="RECEIVER"><ReceiverDonationDetails /></ProtectedRoute>
                } />
                <Route path="/receiver/recommended" element={
                  <ProtectedRoute role="RECEIVER"><FindFood /></ProtectedRoute>
                } />
                <Route path="/receiver/pickup/:id" element={
                  <ProtectedRoute role="RECEIVER"><Pickup /></ProtectedRoute>
                } />
                <Route path="/receiver/impact" element={
                  <ProtectedRoute role="RECEIVER"><ReceiverImpact /></ProtectedRoute>
                } />
                <Route path="/receiver/profile" element={
                  <ProtectedRoute role="RECEIVER"><ReceiverProfile /></ProtectedRoute>
                } />

                {/* ── Fallbacks ── */}
                <Route path="/donor" element={<Navigate to="/donor/dashboard" replace />} />
                <Route path="/receiver" element={<Navigate to="/receiver/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
