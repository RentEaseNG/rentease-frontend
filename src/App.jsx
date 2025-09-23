import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileComponent from './components/ProfileComponent';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/details" element={<ProfileComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App