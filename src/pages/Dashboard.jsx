import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TenantDashboard   from './dashboard/TenantDashboard';
import LandlordDashboard from './dashboard/LandlordDashboard';

/**
 * Smart dashboard router.
 * - Admin    → /admin  (full admin panel)
 * - Landlord → LandlordDashboard
 * - Tenant   → TenantDashboard  (default)
 */
const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case 'Admin':
        case 'SuperAdmin':
            return <Navigate to="/admin" replace />;
        case 'Landlord':
            return <LandlordDashboard />;
        case 'Tenant':
        default:
            return <TenantDashboard />;
    }
};

export default Dashboard;