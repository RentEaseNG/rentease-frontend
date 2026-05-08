import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileComponent from './components/ProfileComponent';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { SocketProvider } from './context/SocketContext';

// Lazy load pages for better performance
const Homepage = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const HouseDetails = lazy(() => import('./pages/HouseDetails'));
const Messages = lazy(() => import('./pages/Messages'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const Listings = lazy(() => import('./pages/Listings'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Notifications = lazy(() => import('./pages/Notifications'));
const MyProperties = lazy(() => import('./pages/MyProperties'));

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {

  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <Router>
            <Navbar />
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/listings" element={
                  <ProtectedRoute>
                    <Listings />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/new" element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                } />
                <Route path="/details" element={<ProfileComponent />} />
                <Route path="/house/:id" element={<HouseDetails />} />
                <Route path="/my-bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="Admin">
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/my-properties" element={
                  <ProtectedRoute>
                    <MyProperties />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
            <Footer />
          </Router>
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App