import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileComponent from './components/ProfileComponent';
import Footer from './components/Footer';
import HouseDetails from './pages/HouseDetails';
import ScrollToTop from './components/ScrollToTop';
import Messages from './pages/Messages';
import AddProperty from './pages/AddProperty';
import Listings from './pages/Listings';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import MyProperties from './pages/MyProperties';
import { SocketProvider } from './context/SocketContext';

function App() {

  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <Router>
            <Navbar />
            <ScrollToTop />
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
            <Footer />
          </Router>
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App