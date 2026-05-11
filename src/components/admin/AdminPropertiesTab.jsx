import React, { useEffect, useState } from "react";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { Trash2 } from "lucide-react";

const AdminPropertiesTab = () => {
    const { token } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        apiClient
            .get("/properties")
            .then((res) => setProperties(res.data.data?.properties ?? res.data.data ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this property? This cannot be undone.")) return;
        setDeleting(id);
        try {
            await apiClient.delete(`/properties/${id}`);
            setProperties((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete property.");
        } finally {
            setDeleting(null);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center py-16">
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
            </div>
        );

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Price / yr</th>
                        <th className="px-4 py-3 text-left">Landlord</th>
                        <th className="px-4 py-3 text-left">Available</th>
                        <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {properties.map((p) => (
                        <tr key={p._id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">
                                {p.title}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{p.location}</td>
                            <td className="px-4 py-3 text-gray-800 font-medium">
                                ₦{p.price?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {p.landlord?.name || "—"}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.available
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {p.available ? "Yes" : "No"}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    disabled={deleting === p._id}
                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                                    title="Delete property"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {properties.length === 0 && (
                <p className="text-center text-gray-400 py-10">No properties found.</p>
            )}
        </div>
    );
};

export default AdminPropertiesTab;
