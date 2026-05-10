import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Tenant',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/register', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        role: formData.role,
      });

      setSuccess('✅ Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white mt-10 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
          <input id="firstName" type="text" value={formData.firstName} onChange={handleChange}
            placeholder="John" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
          <input id="lastName" type="text" value={formData.lastName} onChange={handleChange}
            placeholder="Doe" required className={inputCls} />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
        <input id="email" type="email" value={formData.email} onChange={handleChange}
          placeholder="example@email.com" required className={inputCls} />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
          Phone Number <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange}
          placeholder="+234 800 000 0000" className={inputCls} />
      </div>

      {/* Role */}
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">I am a…</label>
        <select id="role" value={formData.role} onChange={handleChange}
          className={inputCls}>
          <option value="Tenant">Tenant (looking to rent)</option>
          <option value="Landlord">Landlord (listing property)</option>
        </select>
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input id="password" type="password" value={formData.password} onChange={handleChange}
          placeholder="Min. 6 characters" required className={inputCls} />
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
        <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
          placeholder="Repeat password" required className={inputCls} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-900 hover:bg-green-800 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded
                   focus:outline-none focus:shadow-outline w-full cursor-pointer transition-colors"
      >
        {loading ? 'Creating account…' : 'Register'}
      </button>

      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-green-600 hover:underline font-medium">Login here</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
