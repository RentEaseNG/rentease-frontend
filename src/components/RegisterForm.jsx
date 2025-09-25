import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('✅ Registration successful!');
      setError('');
      console.log('Server response:', data);

      // optionally clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white mt-10 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="********"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="flex items-center justify-between">
        <button 
          type="submit"
          className="bg-green-900 hover:bg-green-800 text-white font-bold py-2 px-4 rounded
                     focus:outline-none focus:shadow-outline w-full"
        >
          Register
        </button>
      </div>
        <p>Already have an account? <Link to="/login" className="text-green-500">Login here</Link></p>
    </form>
  );
};

export default RegisterForm;
