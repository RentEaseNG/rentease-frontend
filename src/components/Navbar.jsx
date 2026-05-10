import React, { useState, useEffect } from 'react';
import { 
  House, 
  Layout, 
  MagnifyingGlass, 
  ChatCircle, 
  Calendar, 
  Shield, 
  Plus, 
  Bell, 
  User, 
  SignOut,
  List,
  X
} from "@phosphor-icons/react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import UserDropdown from './UserDropdown';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: Layout, roles: null },
  { label: 'Listings', to: '/listings', icon: MagnifyingGlass, roles: null },
  { label: 'Messages', to: '/messages', icon: ChatCircle, roles: null },
  { label: 'My Bookings', to: '/my-bookings', icon: Calendar, roles: null },
  { label: 'My Properties', to: '/my-properties', icon: House, roles: ['Landlord', 'Admin', 'SuperAdmin'] },
  { label: 'Admin', to: '/admin', icon: Shield, roles: ['Admin', 'SuperAdmin'] },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { unreadCount } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className={`flex items-center justify-between p-2 md:p-3 rounded-full transition-all duration-300 ${
          scrolled ? 'glass-panel mx-2 md:mx-0' : 'bg-transparent'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 px-4 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <House weight="fill" size={20} />
            </div>
            <span className="text-xl font-display font-extrabold tracking-tighter text-zinc-900">
              Rent<span className="text-brand-600">Ease</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {user ? (
              visibleItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    location.pathname === item.to
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <item.icon size={18} weight={location.pathname === item.to ? "fill" : "regular"} />
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link to="/" className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Home</Link>
                <Link to="/listings" className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Listings</Link>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 px-2">
            {loading ? (
              <div className="w-24 h-10 bg-zinc-200 rounded-full animate-pulse" />
            ) : user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-full transition-colors relative ${
                      showNotifications ? 'bg-zinc-100 text-brand-600' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Bell size={22} weight={unreadCount > 0 ? "fill" : "regular"} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80"
                      >
                        <NotificationPanel onClose={() => setShowNotifications(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <UserDropdown user={user} />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-brand-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-zinc-100 text-zinc-900"
            >
              {isMenuOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel mx-4 mt-2 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-1">
              {user ? (
                <>
                  {visibleItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 p-3 rounded-2xl text-base font-medium transition-colors ${
                        location.pathname === item.to
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      <item.icon size={20} weight={location.pathname === item.to ? "fill" : "regular"} />
                      {item.label}
                    </Link>
                  ))}
                  <div className="h-px bg-zinc-100 my-2" />
                  <Link to="/profile" className="flex items-center gap-3 p-3 rounded-2xl text-zinc-600 hover:bg-zinc-50">
                    <User size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 font-medium"
                  >
                    <SignOut size={20} />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" className="block p-3 rounded-2xl text-zinc-600 hover:bg-zinc-50">Home</Link>
                  <Link to="/listings" className="block p-3 rounded-2xl text-zinc-600 hover:bg-zinc-50">Listings</Link>
                  <div className="h-px bg-zinc-100 my-2" />
                  <Link to="/login" className="block p-3 rounded-2xl text-zinc-600 font-medium">Login</Link>
                  <Link to="/register" className="block p-3 rounded-2xl bg-brand-600 text-white font-medium text-center">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
