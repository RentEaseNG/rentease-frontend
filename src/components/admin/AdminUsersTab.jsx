import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminUsersTab = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsers(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

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
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Joined</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                        <tr key={u._id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                            <td className="px-4 py-3 text-gray-600">{u.email}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === "Admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : u.role === "Landlord"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {new Date(u.createdAt).toLocaleDateString("en-NG", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && (
                <p className="text-center text-gray-400 py-10">No users found.</p>
            )}
        </div>
    );
};

export default AdminUsersTab;
