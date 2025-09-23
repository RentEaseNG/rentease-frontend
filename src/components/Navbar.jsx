import React, { useState } from 'react'
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
        <span className="text-xl font-bold"><Link to="/">RentEaseNG</Link></span>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className='flex gap-6'>
           
            <li><Link to="/about" className="hover:text-blue-500 transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-blue-500 transition-colors">Services</Link></li>
            <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
          </ul>
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : '?'}
                </div>
                <span>{user.name || user.email}</span>
              </Link>
              <button className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors' onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className='p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>Login</Link>
              <button className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors' onClick={handleRegister}>Register</button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <nav className="container mx-auto p-4">
            <ul className='space-y-4'>
              <li><Link to="/" className="block py-2 hover:text-blue-500 transition-colors" onClick={toggleMenu}>Home</Link></li>
              <li><Link to="/about" className="block py-2 hover:text-blue-500 transition-colors" onClick={toggleMenu}>About</Link></li>
              <li><Link to="/services" className="block py-2 hover:text-blue-500 transition-colors" onClick={toggleMenu}>Services</Link></li>
              <li><Link to="/contact" className="block py-2 hover:text-blue-500 transition-colors" onClick={toggleMenu}>Contact</Link></li>
            </ul>
            
            <div className="mt-4 pt-4 border-t">
              {loading ? (
                <span>Loading...</span>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <Link to="/profile" className="flex items-center gap-2" onClick={toggleMenu}>
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span>{user.name || user.email}</span>
                  </Link>
                  <button className='p-2 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 transition-colors' onClick={() => {handleLogout(); toggleMenu();}}>Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className='p-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600 transition-colors' onClick={toggleMenu}>Login</Link>
                  <button className='p-2 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition-colors' onClick={() => {handleRegister(); toggleMenu();}}>Register</button>
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