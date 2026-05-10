import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, HouseLine } from '@phosphor-icons/react'

const HomeReady = () => {
    return (
        <section className='py-24 bg-zinc-950 relative overflow-hidden'>
            {/* Abstract Background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="w-20 h-20 rounded-3xl bg-brand-600 flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-brand-600/20 rotate-12">
                        <HouseLine size={40} weight="fill" />
                    </div>
                    
                    <h2 className='text-white text-4xl md:text-6xl font-display font-extrabold tracking-tighter mb-6'>
                        Ready to List <br />
                        <span className="text-zinc-400">Your Property?</span>
                    </h2>
                    <p className='text-zinc-400 mb-12 max-w-xl mx-auto font-medium text-lg leading-relaxed'>
                        Join thousands of landlords who trust RentEase to find high-quality 
                        tenants and manage their assets with modern precision.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a 
                            href="/new" 
                            className='btn-primary px-10 py-4 text-lg w-full sm:w-auto shadow-2xl shadow-brand-600/40'
                        >
                            Get Started Now
                        </a>
                        <a 
                            href="/listings" 
                            className='flex items-center justify-center gap-2 text-white font-bold hover:text-brand-500 transition-colors group px-6 py-4 w-full sm:w-auto'
                        >
                            Explore Listings
                            <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default HomeReady;