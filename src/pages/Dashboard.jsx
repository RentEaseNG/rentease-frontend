import React from 'react'
import DashboardListedProperties from '../components/DashboardListedProperties'
import DashboardBookedProperties from '../components/DashboardBookedProperties'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { user } = useAuth()
    return (
        <div className='m-4'>
            <h1 className='font-bold text-3xl my-4'>Welcome Back, {user.name}!</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <DashboardListedProperties />
                <DashboardBookedProperties />
            </div>
        </div>
    )
}

export default Dashboard