import React from 'react';
import ProfileComponent from '../components/ProfileComponent';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import TenantDashboard from './FeaturedProperties';

const Profile = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto py-8">
      
      <ProfileComponent />
    </div>
  );
};

export default Profile;