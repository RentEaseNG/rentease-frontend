import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const DashboardBookedProperties = () => {
    const { token } = useAuth();
    const [bookedProperties, setBookedProperties] = useState(0)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/bookings/my", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                setBookedProperties(res.data?.data?.length ?? 0)
            } catch (error) {
                console.error("error", error)
            }
        }
        fetchBookings();
    }, [token])

    return (
        <Link to="/my-bookings" className='block bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow group'>
            <p className='text-2xl font-mono'>{bookedProperties}</p>
            <p className='font-semibold'>Properties Booked</p>
            <p className='text-green-700 text-sm mt-2 font-medium group-hover:underline'>View bookings →</p>
        </Link>
    )
}

export default DashboardBookedProperties