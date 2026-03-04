import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios';

const DashboardListedProperties = () => {
    const [listedProperties, setListedProperties] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/properties")
                const allProperties = res.data?.data ?? [];
                const userProperties = allProperties.filter(
                    (property) => property.landlord?._id === user?._id || property.landlord === user?._id
                );
                setListedProperties(userProperties.length)
            } catch (error) {
                console.error("error", error)
            }
        }
        fetchHouses();
    }, [user])

    return (
        <Link to="/my-properties" className='block bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow group'>
            <p className='text-2xl font-mono'>{listedProperties}</p>
            <p className='font-semibold'>Properties Listed</p>
            <p className='text-green-700 text-sm mt-2 font-medium group-hover:underline'>Manage properties →</p>
        </Link>
    )
}

export default DashboardListedProperties