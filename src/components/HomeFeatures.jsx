import React from 'react'
import { Users, ShieldCheck, ChatCircleDots, ChartLineUp } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const HomeFeatures = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className='py-24 bg-white overflow-hidden'>
            <div className="container mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-display font-extrabold text-zinc-900 tracking-tighter mb-4">
                        Reinventing <span className="text-zinc-400">Rental Logistics.</span>
                    </h2>
                    <p className="text-zinc-500 font-medium max-w-xl mx-auto">
                        A suite of powerful tools designed to make renting as effortless 
                        as it should be.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]"
                >
                    {/* Feature 1: Wide */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="md:col-span-8 premium-card p-10 flex flex-col justify-end relative overflow-hidden group"
                    >
                         <div className="absolute top-10 left-10 p-5 rounded-3xl bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform duration-500">
                             <Users size={40} weight="fill" />
                         </div>
                         <div className="relative z-10">
                            <h3 className="text-3xl font-display font-extrabold text-zinc-900 mb-3 tracking-tight">Direct Connection</h3>
                            <p className="text-zinc-500 max-w-md font-medium leading-relaxed">Connect directly with landlords and tenants. No middleman fees, no hidden costs. Just pure, transparent communication.</p>
                         </div>
                         <div className="absolute top-[-10%] right-[-5%] text-[15rem] font-display font-black text-zinc-50 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                             01
                         </div>
                    </motion.div>

                    {/* Feature 2: Small */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="md:col-span-4 premium-card p-10 flex flex-col gap-6 group"
                    >
                        <div className="p-5 rounded-3xl bg-zinc-900 text-white self-start group-hover:rotate-12 transition-transform duration-500">
                             <ShieldCheck size={40} weight="bold" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-extrabold text-zinc-900 mb-3 tracking-tight">Verified Profiles</h3>
                            <p className="text-zinc-500 font-medium leading-relaxed">Every listing and user is strictly vetted to ensure a safe and secure community for everyone.</p>
                        </div>
                    </motion.div>

                    {/* Feature 3: Small */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="md:col-span-4 premium-card p-10 flex flex-col gap-6 group"
                    >
                        <div className="p-5 rounded-3xl bg-brand-600 text-white self-start group-hover:-rotate-12 transition-transform duration-500">
                             <ChatCircleDots size={40} weight="bold" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-extrabold text-zinc-900 mb-3 tracking-tight">Smart Messaging</h3>
                            <p className="text-zinc-500 font-medium leading-relaxed">Real-time chat with instant notifications keeps your conversations flowing and deals moving.</p>
                        </div>
                    </motion.div>

                    {/* Feature 4: Wide */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="md:col-span-8 premium-card p-10 flex flex-col justify-end relative overflow-hidden group"
                    >
                         <div className="absolute top-10 left-10 p-5 rounded-3xl bg-zinc-100 text-zinc-900 group-hover:scale-110 transition-transform duration-500">
                             <ChartLineUp size={40} weight="fill" />
                         </div>
                         <div className="relative z-10">
                            <h3 className="text-3xl font-display font-extrabold text-zinc-900 mb-3 tracking-tight">Easy Management</h3>
                            <p className="text-zinc-500 max-w-md font-medium leading-relaxed">Manage bookings, payments, and communication in one intuitive dashboard. Stay on top of your rental empire with ease.</p>
                         </div>
                         <div className="absolute top-[-10%] right-[-5%] text-[15rem] font-display font-black text-zinc-50 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                             04
                         </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default HomeFeatures;