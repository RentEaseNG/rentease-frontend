import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios';

const DashboardListedProperties  = () => {
    const [listedPropeties, setListedProperties] = useState(0);
    const { user } = useAuth();
    useEffect(() => {
        const FetchHouses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/properties")
                const allProperties = res.data?.data
                // show only data with the same landlordID as the User._id

                const userProperties = allProperties.filter(
                    (property) => property.landlord?._id === user?._id
                );
                setListedProperties(userProperties.length)
            } catch (error) {
                console.error("error", error)
            }
        }
        FetchHouses();
    }, [])
    return (
        <div className='bg-white shadow-md p-6'>
            <p className='text-2xl font-mono'>{listedPropeties}</p>
            <p className='font-semibold'>Properties Listed</p>
        </div>

    )
}

export default DashboardListedProperties