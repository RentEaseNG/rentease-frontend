import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileComponent from './components/ProfileComponent';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { SocketProvider } from './context/SocketContext';

// Lazy load pages
const Homepage    = lazy(() => import('./pages/Home'));
const Register    = lazy(() => import('./pages/Register'));
const Login       = lazy(() => import('./pages/Login'));
const Profile     = lazy(() => import('./pages/Profile'));
const HouseDetails = lazy(() => import('./pages/HouseDetails'));
const Messages    = lazy(() => import('./pages/Messages'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const Listings    = lazy(() => import('./pages/Listings'));
const Dashboard   = lazy(() => import('./pages/Dashboard'));
const MyBookings  = lazy(() => import('./pages/MyBookings'));
const AdminPanel  = lazy(() => import('./pages/AdminPanel'));
const Notifications = lazy(() => import('./pages/Notifications'));
const MyProperties  = lazy(() => import('./pages/MyProperties'));

const LANDLORD_ROLES = ['Landlord', 'Admin', 'SuperAdmin'];
const ADMIN_ROLES    = ['Admin', 'SuperAdmin'];

const PageLoader = () => (
  <div className="flex flex-col justify-center items-center min-h-[100dvh] bg-zinc-50">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-xl"
    />
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-4 text-zinc-500 font-medium tracking-tight"
    >
      Loading RentEase...
    </motion.p>
  </div>
);

const PageWrapper = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="pt-24 min-h-[100dvh]"
  >
    {children}
  </motion.main>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<PageWrapper><Homepage /></PageWrapper>} />
          <Route path="/register"   element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/login"      element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/house/:id"  element={<PageWrapper><HouseDetails /></PageWrapper>} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/listings" element={
            <ProtectedRoute>
              <PageWrapper><Listings /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <PageWrapper><Messages /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <PageWrapper><Notifications /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <PageWrapper><MyBookings /></PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/new" element={
            <ProtectedRoute requiredRoles={LANDLORD_ROLES}>
              <PageWrapper><AddProperty /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/my-properties" element={
            <ProtectedRoute requiredRoles={LANDLORD_ROLES}>
              <PageWrapper><MyProperties /></PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={ADMIN_ROLES}>
              <PageWrapper><AdminPanel /></PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/details" element={<PageWrapper><ProfileComponent /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <Router>
            <Navbar />
            <ScrollToTop />
            <AnimatedRoutes />
            <Footer />
          </Router>
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App