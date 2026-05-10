import React, { useEffect, useState } from "react";
import { 
    Plus, 
    Pencil, 
    Trash, 
    CheckCircle, 
    XCircle, 
    DotsThreeVertical,
    Spinner,
    Warning,
    Archive,
    Check
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const AdminApartmentTypesTab = () => {
    const { token } = useAuth();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        _id: null,
        name: "",
        description: "",
        category: "Residential",
        isActive: true
    });

    useEffect(() => {
        fetchTypes();
    }, [token]);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get("/apartment-types");
            const payload = res.data?.data;
            if (payload?.apartmentTypes && Array.isArray(payload.apartmentTypes)) {
                setTypes(payload.apartmentTypes);
            } else if (Array.isArray(payload)) {
                setTypes(payload);
            } else if (Array.isArray(res.data)) {
                setTypes(res.data);
            } else {
                setTypes([]);
            }
        } catch (err) {
            setError("Failed to load apartment types.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type = null) => {
        if (type) {
            setForm({
                _id: type._id,
                name: type.name,
                description: type.description || "",
                category: type.category || "Residential",
                isActive: type.isActive
            });
        } else {
            setForm({
                _id: null,
                name: "",
                description: "",
                category: "Residential",
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        
        try {
            if (form._id) {
                await apiClient.put(`/apartment-types/${form._id}`, form);
            } else {
                await apiClient.post("/apartment-types", form);
            }
            fetchTypes();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save apartment type.");
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (type) => {
        try {
            await apiClient.put(`/apartment-types/${type._id}`, {
                isActive: !type.isActive
            });
            fetchTypes();
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    if (loading && types.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner size={32} className="animate-spin text-brand-600" />
                <p className="text-zinc-400 font-medium">Synchronizing categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-display font-extrabold text-zinc-900 tracking-tight">Classification Engine</h3>
                    <p className="text-zinc-500 text-sm font-medium">Define and manage property categories available to landlords.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="btn-primary py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-brand-600/20"
                >
                    <Plus size={18} weight="bold" />
                    <span>New Type</span>
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3">
                    <Warning size={20} weight="fill" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {types.map((type) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={type._id}
                            className="premium-card p-5 group hover:border-brand-200 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                    <Archive size={20} weight="bold" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleOpenModal(type)}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button 
                                        onClick={() => toggleStatus(type)}
                                        className={`p-2 rounded-lg transition-colors ${type.isActive ? 'text-zinc-400 hover:text-rose-600' : 'text-emerald-600 hover:text-emerald-700'}`}
                                        title={type.isActive ? "Deactivate" : "Activate"}
                                    >
                                        {type.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-display font-extrabold text-zinc-900 tracking-tight mb-1">{type.name}</h4>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{type.category || 'General'}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${type.isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                    {type.isActive ? 'Active' : 'Archived'}
                                </span>
                            </div>
                            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                                {type.description || 'No description provided for this classification.'}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-2xl font-display font-extrabold text-zinc-900 tracking-tighter">
                                        {form._id ? 'Edit Classification' : 'New Classification'}
                                    </h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                                        <XCircle size={24} weight="bold" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Type Name</label>
                                        <input 
                                            value={form.name}
                                            onChange={(e) => setForm({...form, name: e.target.value})}
                                            className="w-full px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 outline-none transition-all font-medium"
                                            placeholder="e.g. Duplex"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Category</label>
                                        <select 
                                            value={form.category}
                                            onChange={(e) => setForm({...form, category: e.target.value})}
                                            className="w-full px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 outline-none transition-all font-medium appearance-none"
                                        >
                                            <option value="Residential">Residential</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Industrial">Industrial</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea 
                                            value={form.description}
                                            onChange={(e) => setForm({...form, description: e.target.value})}
                                            rows="3"
                                            className="w-full px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-500 outline-none transition-all font-medium resize-none"
                                            placeholder="Describe this property type..."
                                        />
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.isActive ? 'bg-brand-600 border-brand-600' : 'border-zinc-200'}`}>
                                            {form.isActive && <Check size={12} weight="bold" className="text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={form.isActive}
                                            onChange={(e) => setForm({...form, isActive: e.target.checked})}
                                        />
                                        <span className="text-sm font-bold text-zinc-700">Set as Active</span>
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-xl shadow-brand-600/20"
                                >
                                    {saving ? <Spinner size={20} className="animate-spin" /> : (
                                        <>
                                            <CheckCircle size={20} weight="bold" />
                                            <span>{form._id ? 'Update Engine' : 'Save Classification'}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminApartmentTypesTab;
