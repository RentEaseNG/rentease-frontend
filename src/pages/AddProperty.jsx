import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    House, 
    ArrowLeft, 
    CloudArrowUp, 
    CurrencyDollar, 
    MapPin, 
    Info, 
    Plus,
    CheckCircle,
    Warning,
    Spinner
} from '@phosphor-icons/react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import CloudinaryUploader from '../components/CloudinaryUploader';

const AddProperty = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        apartmentType: '',
        images: []
    });

    const [apartmentTypes, setApartmentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingTypes, setFetchingTypes] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchApartmentTypes = async () => {
            try {
                const res = await apiClient.get('/apartment-types');
                // Extract from standardized response structure: res.data.data.apartmentTypes
                let types = [];
                if (res.data?.data?.apartmentTypes && Array.isArray(res.data.data.apartmentTypes)) {
                    types = res.data.data.apartmentTypes;
                } else if (Array.isArray(res.data.data)) {
                    types = res.data.data;
                } else if (Array.isArray(res.data)) {
                    types = res.data;
                }
                setApartmentTypes(types);
            } catch (err) {
                console.error('Error fetching apartment types:', err);
                setError('Failed to load apartment types.');
            } finally {
                setFetchingTypes(false);
            }
        };

        fetchApartmentTypes();
    }, []);

    if (!user) {
        navigate('/login');
        return null;
    }

    if (user.role === 'Tenant') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card max-w-md w-full p-10 text-center"
                >
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <House size={40} weight="fill" className="text-brand-500" />
                    </div>
                    <h2 className="text-2xl font-display font-extrabold text-zinc-900 mb-2 tracking-tighter">Landlords Only</h2>
                    <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
                        Only Landlord accounts can list properties. You are currently signed in as a <span className="text-zinc-900 font-bold uppercase tracking-widest text-[10px]">{user.role}</span>.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary w-full py-4 shadow-xl shadow-brand-600/20">
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || '' : value
        }));
    };

    const handleImagesChange = (urls) => {
        setFormData(prev => ({ ...prev, images: urls }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) return setError('Property title is required'), false;
        if (!formData.description.trim()) return setError('Property description is required'), false;
        if (!formData.price || formData.price <= 0) return setError('Please enter a valid price'), false;
        if (!formData.location.trim()) return setError('Property location is required'), false;
        if (!formData.apartmentType) return setError('Please select an apartment type'), false;
        if (formData.images.length === 0) return setError('Please upload at least one image'), false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;
        setLoading(true);

        try {
            const res = await apiClient.post('/properties/create', {
                ...formData,
                price: parseFloat(formData.price)
            });

            setSuccess(true);
            setTimeout(() => {
                navigate(`/house/${res.data.data._id}`);
            }, 1500);
        } catch (err) {
            console.error('Error listing property:', err);
            setError(err.response?.data?.message || 'Failed to list property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50/50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link to="/my-properties" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to My Properties
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-zinc-900 tracking-tighter mb-2">
                            List New <span className="text-zinc-400">Property.</span>
                        </h1>
                        <p className="text-zinc-500 font-medium leading-relaxed max-w-lg">
                            Provide precise details to attract high-quality tenants. Premium listings receive 3x more views.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Core Details */}
                        <div className="premium-card p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                    <Info size={20} weight="bold" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-zinc-900 tracking-tight">Core Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Property Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-medium text-zinc-900"
                                        placeholder="e.g. Minimalist Studio in Victoria Island"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Detailed Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-medium text-zinc-900 resize-none"
                                        placeholder="Highlight key features, amenities, and nearby landmarks..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media Upload */}
                        <div className="premium-card p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <CloudArrowUp size={20} weight="bold" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-zinc-900 tracking-tight">Media Gallery</h3>
                            </div>
                            <p className="text-sm text-zinc-500 mb-4">Upload at least 3 high-resolution images of the interior and exterior.</p>
                            <CloudinaryUploader
                                value={formData.images}
                                onChange={handleImagesChange}
                            />
                        </div>
                    </div>

                    {/* Sidebar: Financials & Classification */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="premium-card p-8 space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <CurrencyDollar size={14} /> Price (₦ / Year)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-mono font-bold text-zinc-900"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <MapPin size={14} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-medium text-zinc-900"
                                        placeholder="e.g. Ikoyi, Lagos"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <House size={14} /> Apartment Type
                                    </label>
                                    <select
                                        name="apartmentType"
                                        value={formData.apartmentType}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 transition-all outline-none font-medium text-zinc-900 appearance-none"
                                        required
                                        disabled={fetchingTypes}
                                    >
                                        <option value="">Select Type</option>
                                        {Array.isArray(apartmentTypes) && apartmentTypes.map((type) => (
                                            <option key={type._id} value={type._id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

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
                                        className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold flex items-center gap-2"
                                    >
                                        <CheckCircle size={18} weight="fill" />
                                        Property Listed Successfully!
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading || success}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-xl shadow-brand-600/20 disabled:opacity-70"
                            >
                                {loading ? <Spinner size={20} className="animate-spin" /> : (
                                    <>
                                        <Plus size={20} weight="bold" />
                                        <span>Publish Listing</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
