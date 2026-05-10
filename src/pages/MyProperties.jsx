import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    House, 
    Pencil, 
    Trash, 
    X, 
    Check, 
    Plus,
    MapPin, 
    CurrencyDollar, 
    Eye, 
    Warning,
    Image as ImageIcon
} from '@phosphor-icons/react';
import CloudinaryUploader from '../components/CloudinaryUploader';

// ────────────────────────────────────────────────────────────────────────────
// Inline Edit Modal
// ────────────────────────────────────────────────────────────────────────────
const EditModal = ({ property, apartmentTypes, token, onClose, onSaved }) => {
    const [form, setForm] = useState({
        title: property.title ?? '',
        description: property.description ?? '',
        price: property.price ?? '',
        location: property.location ?? '',
        apartmentType: property.apartmentType?._id ?? property.apartmentType ?? '',
        available: property.available ?? true,
    });
    const [imageUrls, setImageUrls] = useState(
        property.images?.length ? property.images : []
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.title.trim()) return setError('Title is required');
        if (!form.location.trim()) return setError('Location is required');
        if (+form.price <= 0) return setError('Enter a valid price');

        const images = imageUrls.filter(u => u.trim());
        if (!images.length) return setError('Please upload at least one image');

        setSaving(true);
        try {
            const res = await apiClient.patch(
                `/properties/${property._id}`,
                { ...form, price: parseFloat(form.price), images }
            );
            onSaved(res.data.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Pencil size={18} weight="bold" className="text-brand-600" /> Edit Property
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2.5 rounded-lg">
                            <Warning size={16} weight="fill" /> {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input name="title" value={form.title} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="e.g. 2 Bedroom Apartment" />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                            placeholder="Describe the property..." />
                    </div>

                    {/* Price + Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦/yr)</label>
                            <input name="price" type="number" value={form.price} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input name="location" value={form.location} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="e.g. Lekki, Lagos" />
                        </div>
                    </div>

                    {/* Apartment Type + Availability */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apartment Type</label>
                            <select name="apartmentType" value={form.apartmentType} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                                <option value="">-- Select --</option>
                                {apartmentTypes.map(t => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="checkbox" name="available" checked={form.available} onChange={handleChange}
                                    className="w-4 h-4 accent-green-600" />
                                Mark as Available
                            </label>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center gap-1">Images</span>
                        </label>
                        <CloudinaryUploader
                            value={imageUrls}
                            onChange={setImageUrls}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 font-bold uppercase tracking-widest">
                            <Check size={16} weight="bold" /> {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────
const MyProperties = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [editing, setEditing] = useState(null);   // property being edited
    const [apartmentTypes, setApartmentTypes] = useState([]);
    const [error, setError] = useState('');

    const fetchMyProperties = useCallback(async () => {
        if (!token || !user?._id) return;
        setLoading(true);
        try {
            const res = await apiClient.get(`/users/${user._id}/properties`);
            setProperties(res.data.data?.properties ?? res.data.data ?? []);
        } catch {
            setError('Failed to load your properties.');
        } finally {
            setLoading(false);
        }
    }, [token, user?._id]);

    useEffect(() => {
        fetchMyProperties();
        // Also fetch apartment types for the edit modal
        apiClient.get('/apartment-types')
            .then(r => setApartmentTypes(r.data.data ?? []))
            .catch(() => { });
    }, [fetchMyProperties]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this property? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await apiClient.delete(`/properties/${id}`);
            setProperties(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert(err.response?.data?.message ?? 'Failed to delete property.');
        } finally {
            setDeleting(null);
        }
    };

    const handleSaved = (updated) => {
        setProperties(prev => prev.map(p => p._id === updated._id ? { ...p, ...updated } : p));
    };

    // ── Skeleton ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto space-y-4">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 h-36 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Edit modal */}
            {editing && (
                <EditModal
                    property={editing}
                    apartmentTypes={apartmentTypes}
                    token={token}
                    onClose={() => setEditing(null)}
                    onSaved={handleSaved}
                />
            )}

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-zinc-900 tracking-tighter mb-2">
                                My <span className="text-zinc-400">Properties.</span>
                            </h1>
                            <p className="text-zinc-500 font-medium leading-relaxed max-w-lg">
                                {properties.length === 0
                                    ? "You haven't listed any properties yet. Start your journey by listing your first asset."
                                    : `Managing ${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} across your portfolio.`}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/new')}
                            className="btn-primary py-4 px-8 flex items-center gap-3 shadow-xl shadow-brand-600/20 group"
                        >
                            <Plus size={20} weight="bold" className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>List New Property</span>
                        </button>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg mb-6">
                            <Warning size={16} weight="fill" /> {error}
                        </div>
                    )}

                    {/* Empty state */}
                    {properties.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
                                <House size={36} weight="regular" />
                            </div>
                            <p className="text-lg font-medium text-zinc-600 tracking-tight">No properties listed yet</p>
                            <button
                                onClick={() => navigate('/new')}
                                className="flex items-center gap-2 text-sm text-brand-600 font-bold hover:underline uppercase tracking-widest"
                            >
                                <Plus size={16} weight="bold" /> List your first property
                            </button>
                        </div>
                    )}

                    {/* Property list */}
                    <div className="space-y-4">
                        {properties.map(p => (
                            <div
                                key={p._id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden"
                            >
                                {/* Image */}
                                {p.images?.[0] ? (
                                    <img
                                        src={p.images[0]}
                                        alt={p.title}
                                        className="w-full sm:w-44 h-36 object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-full sm:w-44 h-36 bg-gray-100 flex items-center justify-center shrink-0">
                                        <ImageIcon size={28} className="text-gray-300" />
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex flex-col justify-between flex-1 p-4">
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="font-semibold text-gray-900 text-base leading-snug">{p.title}</h2>
                                            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${p.available
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {p.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                        <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-zinc-500">
                                            <span className="flex items-center gap-1 font-medium">
                                                <MapPin size={14} weight="bold" className="text-zinc-400" /> {p.location}
                                            </span>
                                            <span className="flex items-center gap-1 font-bold text-zinc-900">
                                                <CurrencyDollar size={16} weight="bold" className="text-brand-600" />
                                                ₦{p.price?.toLocaleString()}<span className="font-medium text-zinc-400">/yr</span>
                                            </span>
                                            {p.apartmentType?.name && (
                                                <span className="bg-zinc-100 px-2 py-0.5 rounded text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                                    {p.apartmentType.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <button
                                            onClick={() => navigate(`/house/${p._id}`)}
                                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-600 border border-brand-200 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-all"
                                        >
                                            <Eye size={14} weight="bold" /> View
                                        </button>
                                        <button
                                            onClick={() => setEditing(p)}
                                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 rounded-xl transition-all"
                                        >
                                            <Pencil size={14} weight="bold" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            disabled={deleting === p._id}
                                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-all disabled:opacity-40"
                                        >
                                            <Trash size={14} weight="bold" /> {deleting === p._id ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
};

export default MyProperties;
