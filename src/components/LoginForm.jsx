import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          setSuccess('✅ Login successful!');
          setError('');
          console.log('Server response:', data);
          
          // Store only token in context
          login(data.data.token);
          
          // Navigate to profile page
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
    
          // optionally clear form
          setFormData({
            email: '',
            password: ''
          });
    
        } catch (err) {
          setError(err.message);
          setSuccess('');
        }
      };
  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white shadow-md mt-10 rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
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
          name="password"
          value={formData.password}
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
          Login
        </button>
      </div>
      <p>Don't have an account? <Link to="/register" className="text-green-500">Register here</Link></p>
    </form>
  )
}

export default LoginForm