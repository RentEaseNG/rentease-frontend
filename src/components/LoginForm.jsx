import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Envelope, Lock, ArrowRight, Spinner, CheckCircle, Warning } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);
        setError('');
    
        try {
            const response = await apiClient.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });
    
            const data = response.data;
            setSuccess('Login successful! Redirecting...');
            
            login(data.data.token);
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
    
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-zinc-50/50">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="premium-card max-w-md w-full p-10 overflow-hidden relative"
            >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full" />
                
                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-3xl font-display font-extrabold text-zinc-900 tracking-tighter">Welcome back.</h1>
                    <p className="text-zinc-500 font-medium mt-1">Sign in to your RentEase account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold flex items-center gap-2"
                            >
                                <Warning size={18} weight="fill" />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold flex items-center gap-2"
                            >
                                <CheckCircle size={18} weight="fill" />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors">
                                <Envelope size={20} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@domain.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-medium text-zinc-900"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" size={10} className="text-[10px] font-bold text-brand-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-medium text-zinc-900"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2 group shadow-xl shadow-brand-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner size={20} className="animate-spin" /> : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-zinc-100 text-center relative z-10">
                    <p className="text-sm font-medium text-zinc-500">
                        New to RentEase? <Link to="/register" className="text-brand-600 font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginForm