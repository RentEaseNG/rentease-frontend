import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <header className='flex justify-between items-center p-2 shadow-md'>
        <span>RentEaseNG</span>
        <nav>
            <ul className='flex gap-3'>
                <li><Link to="/">Home</Link ></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
        <button className='p-2 bg-blue-600 text-white rounded-lg' onClick={handleRegister}>Register</button>
    </header>
  )
}

export default Navbar