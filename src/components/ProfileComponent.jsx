import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Pencil, Lock, Check, X, Eye, EyeOff, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ─── Role badge ───────────────────────────────────────────────────────────────
const ROLE_STYLES = {
  Admin: 'bg-purple-100 text-purple-700',
  Landlord: 'bg-blue-100 text-blue-700',
  Tenant: 'bg-green-100 text-green-700',
};

// ─── Inline feedback banner ───────────────────────────────────────────────────
const Banner = ({ type, msg }) => (
  <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg mt-3 ${type === 'success'
      ? 'bg-green-50 border border-green-200 text-green-700'
      : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
    {type === 'success' ? <Check size={14} /> : <X size={14} />} {msg}
  </div>
);

// ─── Edit Profile section ─────────────────────────────────────────────────────
const EditProfileSection = ({ user, token, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name ?? '');
  const [phone, setPhone] = useState(user.phoneNumber ?? '');
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setBanner({ type: 'error', msg: 'Name is required.' });
    setSaving(true);
    setBanner(null);
    try {
      const res = await axios.patch(
        'http://localhost:5000/api/users/me',
        { name: name.trim(), phoneNumber: phone.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdated(res.data.data);
      setBanner({ type: 'success', msg: 'Profile updated!' });
      setOpen(false);
    } catch (err) {
      setBanner({ type: 'error', msg: err.response?.data?.message ?? 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <User size={17} className="text-green-700" /> Account Information
        </h3>
        <button
          onClick={() => { setOpen(o => !o); setBanner(null); }}
          className="flex items-center gap-1.5 text-sm text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <Pencil size={13} /> {open ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Info rows (always visible) */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-600">
          <Mail size={14} className="shrink-0 text-gray-400" />
          <span className="text-gray-500 w-24 shrink-0">Email</span>
          <span className="font-medium text-gray-800">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Phone size={14} className="shrink-0 text-gray-400" />
          <span className="text-gray-500 w-24 shrink-0">Phone</span>
          <span className="font-medium text-gray-800">{user.phoneNumber || <span className="italic text-gray-400">Not set</span>}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <ShieldCheck size={14} className="shrink-0 text-gray-400" />
          <span className="text-gray-500 w-24 shrink-0">Member since</span>
          <span className="font-medium text-gray-800">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
          </span>
        </div>
      </div>

      {/* Edit form */}
      {open && (
        <form onSubmit={handleSave} className="mt-5 space-y-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="+234 800 000 0000"
            />
          </div>
          {banner && <Banner {...banner} />}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50">
              <Check size={13} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
      {!open && banner && <Banner {...banner} />}
    </div>
  );
};

// ─── Change Password section ──────────────────────────────────────────────────
const ChangePasswordSection = ({ token }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!current || !next || !confirm) return setBanner({ type: 'error', msg: 'All fields are required.' });
    if (next.length < 6) return setBanner({ type: 'error', msg: 'New password must be at least 6 characters.' });
    if (next !== confirm) return setBanner({ type: 'error', msg: 'Passwords do not match.' });

    setSaving(true);
    setBanner(null);
    try {
      await axios.put(
        'http://localhost:5000/api/users/me/password',
        { currentPassword: current, newPassword: next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBanner({ type: 'success', msg: 'Password changed successfully!' });
      setCurrent(''); setNext(''); setConfirm('');
      setOpen(false);
    } catch (err) {
      setBanner({ type: 'error', msg: err.response?.data?.message ?? 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  };

  const PwField = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder={placeholder}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Lock size={17} className="text-green-700" /> Change Password
        </h3>
        <button
          onClick={() => { setOpen(o => !o); setBanner(null); }}
          className="flex items-center gap-1.5 text-sm text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <Lock size={13} /> {open ? 'Cancel' : 'Change Password'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSave} className="mt-4 space-y-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <PwField label="Current Password" value={current} onChange={setCurrent}
            show={showCurrent} onToggle={() => setShowCurrent(s => !s)} placeholder="••••••••" />
          <PwField label="New Password" value={next} onChange={setNext}
            show={showNext} onToggle={() => setShowNext(s => !s)} placeholder="Min. 6 characters" />
          <PwField label="Confirm New Password" value={confirm} onChange={setConfirm}
            show={showNext} onToggle={() => setShowNext(s => !s)} placeholder="Repeat new password" />
          {banner && <Banner {...banner} />}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50">
              <Check size={13} /> {saving ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
      {!open && banner && <Banner {...banner} />}
    </div>
  );
};

// ─── Main profile component ───────────────────────────────────────────────────
const ProfileComponent = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdated = () => {
    refreshUser(); // re-fetches user data from /api/users/me and updates context
  };

  const getInitial = () => (user?.name ? user.name.charAt(0).toUpperCase() : '?');

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-10 mt-10">Your Profile</h1>
      <div className="bg-white shadow-md rounded-2xl px-8 pt-8 pb-8 mb-4 max-w-lg mx-auto">

        {/* Avatar + name + role badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {getInitial()}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name || 'User'}</h2>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
            {user.role ?? 'Tenant'}
          </span>
        </div>

        {/* Account info + edit profile */}
        <EditProfileSection user={user} token={token} onUpdated={handleUpdated} />

        {/* Change password */}
        <ChangePasswordSection token={token} />

        {/* Logout */}
        <div className="mt-8 border-t pt-6">
          <button
            className="flex items-center justify-center gap-2 bg-red-600 rounded-lg p-2.5 text-white w-full cursor-pointer hover:bg-red-700 transition-colors font-medium"
            onClick={() => { logout(); navigate('/login'); }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;