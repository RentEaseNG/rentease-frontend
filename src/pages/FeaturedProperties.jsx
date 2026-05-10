import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import PropertyCard from "../components/PropertyCard";
import { MagnifyingGlass } from "@phosphor-icons/react";

function FeaturedProperties({ query }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await apiClient.get("/properties");
        const payload = res.data.data;
        setHouses(Array.isArray(payload) ? payload : (payload?.properties ?? []));
      } catch (err) {
        console.error("Error fetching houses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const filteredHouses = houses.filter((house) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      house.title.toLowerCase().includes(q) ||
      house.location.toLowerCase().includes(q) ||
      house.apartmentType?.name.toLowerCase().includes(q)
    );
  });

  const handleCardClick = (houseId) => {
    if (user) {
      navigate(`/house/${houseId}`);
    } else {
      navigate("/login");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-zinc-900 tracking-tighter mb-4">
              Featured <span className="text-zinc-400">Collections.</span>
            </h2>
            <p className="text-zinc-500 font-medium">
              Explore our hand-picked selection of the most desirable properties 
              currently available for lease.
            </p>
          </div>
          <div className="hidden md:block">
            <button 
              onClick={() => navigate('/listings')}
              className="group flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-brand-600 transition-colors"
            >
              View all listings
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <MagnifyingGlass size={18} weight="bold" />
              </motion.div>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-200 animate-pulse rounded-3xl aspect-[4/5]" />
            ))}
          </div>
        ) : filteredHouses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6">
              <MagnifyingGlass size={40} />
            </div>
            <h3 className="text-xl font-display font-bold text-zinc-900 mb-2">No properties found</h3>
            <p className="text-zinc-500 max-w-xs">We couldn't find any properties matching your search criteria.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredHouses.map((house) => (
                <motion.div key={house._id} variants={item}>
                  <PropertyCard
                    house={house}
                    onClick={handleCardClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
