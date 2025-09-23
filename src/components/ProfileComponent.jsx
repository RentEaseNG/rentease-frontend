import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileComponent = () => {
  const { user } = useAuth();
  
  // Get the first letter of the user's name for the avatar
  const getInitial = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-10 mt-10">Your Profile</h1>
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
    
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
          {getInitial()}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
        <p className="text-gray-600 mt-2">{user?.email || 'No email available'}</p>
      </div>
      
      <div className="mt-8 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Account Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span>{user?.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member since:</span>
            <span>{user?.createdAt || new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfileComponent;