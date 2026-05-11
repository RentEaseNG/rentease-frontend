import React, { useState } from "react";
import { MagnifyingGlass, MapPin, CaretRight } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import heroBg from "../assets/hero-bg.png";

const MagneticButton = ({ children, type = "button", className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type={type}
      style={{ x: dx, y: dy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const LandingHero = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-zinc-950">
      {/* Background Image with stylized fade */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Modern Architecture" 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Premium Rentals in Nigeria
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white leading-[0.9] tracking-tighter mb-6"
          >
            Elevate Your <br />
            <span className="text-zinc-400">Living Experience.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed"
          >
            Curated architectural masterpieces and refined urban spaces. Discover 
            the most exclusive rental properties across the nation's premier locations.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants}>
            <form 
              className="flex flex-col md:flex-row w-full gap-3 p-2 rounded-2xl md:rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
              onSubmit={handleSubmit}
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <MapPin size={24} className="text-brand-500" />
                <input
                  className="w-full bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-lg font-medium"
                  placeholder="Where would you like to live?"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              
              <MagneticButton 
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-xl md:rounded-full font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/20"
              >
                <MagnifyingGlass size={20} weight="bold" />
                <span>Find Property</span>
              </MagneticButton>
            </form>
          </motion.div>

          {/* Stats/Quick Info */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-wrap gap-8 md:gap-12"
          >
            {[
              { label: "Listings", value: "2.4k+" },
              { label: "Happy Tenants", value: "1.8k+" },
              { label: "Cities", value: "12" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-display font-bold text-white leading-none">{stat.value}</span>
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative element - Right Side */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
      >
        <div className="text-[40rem] font-display font-black leading-none select-none">
          RE
        </div>
      </motion.div>
    </section>
  );
};

export default LandingHero;
