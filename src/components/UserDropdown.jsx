import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  SignOut, 
  CaretDown, 
  Gear, 
  Question,
  Warning
} from "@phosphor-icons/react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const initial = user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full border border-zinc-200 hover:border-brand-200 hover:bg-brand-50 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
          {initial}
        </div>
        <div className="hidden md:flex flex-col items-start text-left">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">
            {user.role}
          </span>
          <span className="text-xs font-semibold text-zinc-900 truncate max-w-[80px]">
            {user.firstName || 'User'}
          </span>
        </div>
        <CaretDown size={12} weight="bold" className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl overflow-hidden py-2"
          >
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-sm font-bold text-zinc-900">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-zinc-400 font-medium truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                <span>Profile Settings</span>
              </Link>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Gear size={18} />
                <span>Preferences</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Question size={18} />
                <span>Support</span>
              </button>
            </div>

            <div className="pt-1 border-t border-zinc-100">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                  <SignOut size={18} />
                  <span>Log out</span>
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-red-50 mx-2 rounded-xl border border-red-100"
                >
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-2 flex items-center justify-center gap-1">
                    <Warning size={14} weight="fill" /> Are you sure?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors uppercase tracking-widest"
                    >
                      Yes, Logout
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-1.5 bg-white text-zinc-600 text-[10px] font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
