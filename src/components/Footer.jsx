import React from "react";
import { House, TwitterLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-500 py-20 border-t border-zinc-900">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/20">
              <House weight="fill" size={24} />
            </div>
            <span className="text-2xl font-display font-extrabold tracking-tighter text-white">
              Rent<span className="text-brand-600">Ease</span>
            </span>
          </div>
          <p className="max-w-sm font-medium leading-relaxed mb-8">
            The nation's most trusted platform for architectural rentals and refined living spaces. 
            Redefining the logistics of home.
          </p>
          <div className="flex items-center gap-4">
             <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand-600 hover:text-white transition-all duration-300">
                <TwitterLogo size={20} weight="fill" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand-600 hover:text-white transition-all duration-300">
                <InstagramLogo size={20} weight="fill" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand-600 hover:text-white transition-all duration-300">
                <LinkedinLogo size={20} weight="fill" />
             </a>
          </div>
        </div>

        {/* Links Sections */}
        <div className="md:col-span-2">
          <h3 className="text-white font-display font-bold uppercase tracking-widest text-[10px] mb-6">Company</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Architecture</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-white font-display font-bold uppercase tracking-widest text-[10px] mb-6">Solutions</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">For Landlords</a></li>
            <li><a href="#" className="hover:text-white transition-colors">For Tenants</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-white font-display font-bold uppercase tracking-widest text-[10px] mb-6">Support</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Legal Details</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-white font-display font-bold uppercase tracking-widest text-[10px] mb-6">Contact</h3>
          <p className="text-sm font-medium leading-loose">
            Lagos, Nigeria <br />
            hello@rentease.ng <br />
            +234 800 RENTEASE
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} RentEase Architecture. All rights reserved.
        </p>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
