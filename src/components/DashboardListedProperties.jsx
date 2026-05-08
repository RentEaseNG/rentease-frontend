import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import apiClient from '../api/client';

const DashboardListedProperties = () => {
    const [listedProperties, setListedProperties] = useState(0);
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchHouses = async () => {
            if (!token) return;
            try {
                const res = await apiClient.get("/properties/my")
                setListedProperties(res.data?.data?.length ?? 0)
            } catch (error) {
                console.error("error", error)
            }
        }
        fetchHouses();
    }, [token])

    return (
        <Link to="/my-properties" className='block bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow group'>
            <p className='text-2xl font-mono'>{listedProperties}</p>
            <p className='font-semibold'>Properties Listed</p>
            <p className='text-green-700 text-sm mt-2 font-medium group-hover:underline'>Manage properties →</p>
        </Link>
    )
}

export default DashboardListedProperties