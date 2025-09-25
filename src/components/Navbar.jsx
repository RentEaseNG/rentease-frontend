import React, { useState } from 'react'
import { LogOut } from "lucide-react";

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRegister = () => {
    navigate('/register');
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className='relative shadow-md'>
      <div className='flex justify-between items-center p-4 container mx-auto'>
        {/* Brand */}
        <span className="text-xl font-bold">
          <Link to="/">RentEaseNG</Link>
        </span>

        {/* Mobile menu button */}
<<<<<<< HEAD
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
=======
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> main
          onClick={toggleMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className='flex gap-6'>
            <li><Link to="/dashboard" className="hover:text-green-900 transition-colors">Dashboard</Link></li>
            <li><Link to="/services" className="hover:text-green-900 transition-colors">Services</Link></li>
            <li><Link to="/contact" className="hover:text-green-900 transition-colors">Contact</Link></li>
          </ul>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex -mr-15 items-center gap-3">
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              {/* User Avatar + Name → Profile */}
              <button 
                onClick={() => navigate('/details')} 
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : '?'}
                </div>
<<<<<<< HEAD
                <span>{user.name || user.email}</span>
              </Link>
=======
                
              </button>
              <button 
                onClick={() => navigate('/profile')} 
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                Dashboard
              </button>
              

              {/* Logout */}
              <button
  onClick={handleLogout}
  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
>
  <LogOut size={18} />
  <span>Logout</span>
</button>
              
>>>>>>> main
            </>
          ) : (
            <>
              <Link to="/login" className='p-2 text-gray-500 font-bold rounded-lg hover:text-blue-600 transition-colors'>Login</Link>
<<<<<<< HEAD
              <button
                className='p-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors'
=======
              <button 
                className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors' 
>>>>>>> main
                onClick={handleRegister}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <nav className="container mx-auto p-4">
            <ul className='space-y-4'>
              <li><Link to="/" className="block py-2 hover:text-green-900 transition-colors" onClick={toggleMenu}>Home</Link></li>
              <li><Link to="/dashboard" className="block py-2 hover:text-green-900 transition-colors" onClick={toggleMenu}>Dashboard</Link></li>
              <li><Link to="/services" className="block py-2 hover:text-green-900 transition-colors" onClick={toggleMenu}>Services</Link></li>
              <li><Link to="/contact" className="block py-2 hover:text-green-900 transition-colors" onClick={toggleMenu}>Contact</Link></li>
            </ul>

            <div className="mt-4 pt-4 border-t">
              {loading ? (
                <span>Loading...</span>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { navigate('/details'); toggleMenu(); }}
                    className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span>{user.name || user.email}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className='p-2  text-gray-500 font-bold rounded-lg text-center hover:text-blue-600 transition-colors' onClick={toggleMenu}>Login</Link>
                  <button
                    className='p-2 bg-blue-600 text-white rounded-lg w-full  hover:bg-blue-700 transition-colors'
                    onClick={() => { handleRegister(); toggleMenu(); }}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
