import React from 'react'
import { Users, ShieldCheck, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeFeatures = () => {
    const features = [
        {
            icon: <Users className="w-10 h-10 text-green-600" />,
            title: "Direct Connection",
            description: "Connect directly with landlords and tenants. No middleman fees.",
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
            title: "Verified Profiles",
            description: "All users and properties go through our verification process.",
        },
        {
            icon: <Home className="w-10 h-10 text-green-600" />,
            title: "Easy Management",
            description: "Manage bookings, payments, and communication in one place.",
        },
    ];

    return (
        <section className=' p-10'>
            <h1 className='text-center font-bold text-3xl'>Why Choose RentEase?</h1>
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center"
                        >
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 max-w-xs">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </section>
    )
}

export default HomeFeatures