import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from '@phosphor-icons/react';
import Image from './ImageLoader';

const PropertyCard = ({ house, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(house._id)}
      className="premium-card group cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <Image
          src={house.images?.[0]}
          alt={house.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full glass-panel text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            {house?.apartmentType?.name || 'Property'}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
            Available Now
          </span>
          <h2 className="font-display font-extrabold text-xl text-zinc-900 line-clamp-1 leading-tight group-hover:text-brand-600 transition-colors mt-0.5">
            {house.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-1 text-zinc-500 mb-4">
          <MapPin size={14} weight="fill" className="text-zinc-400 group-hover:text-brand-500 transition-colors" />
          <span className="text-xs font-medium line-clamp-1">{house.location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-display font-black text-zinc-900">
              ₦{house.price?.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold block -mt-1 uppercase tracking-tighter">per year</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
            <ArrowRight size={20} weight="bold" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
