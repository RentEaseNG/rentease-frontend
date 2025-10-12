import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const DashboardBookedProperties = () => {
    const {token} = useAuth();
    const [bookedProperties, setBookedProperties] = useState(0)

    useEffect(() => {
        const FetchHouses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/bookings/my", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                const booked = res.data?.data
                setBookedProperties(booked.length)
            } catch (error) {
                console.error("error", error)
            }
        }
        FetchHouses();
    }, [])
    return (
        <div className='bg-white shadow-md p-6'>
            <p className='text-2xl font-mono'>{bookedProperties}</p>
            <p className='font-semibold'>Properties Booked</p>
        </div>
    )
}

export default DashboardBookedProperties