import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileComponent from './components/ProfileComponent';
import Footer from './components/Footer';
import HouseDetails from './pages/HouseDetails';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/details" element={<ProfileComponent />} />
          <Route path="/house/:id" element={<HouseDetails />} />
        </Routes>
        <Footer/>
      </Router>
    </AuthProvider>
  )
}

export default App