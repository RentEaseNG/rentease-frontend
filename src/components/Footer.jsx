import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-gray-300 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h2 className="text-white text-2xl font-bold">RentEase</h2>
          <p className="mt-4 text-gray-400 max-w-sm">
            Making property rental simple and trustworthy for everyone.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
          </ul>
        </div>

        {/* Support & Legal Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
          </ul>

          <h3 className="text-white font-semibold mt-6 mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-green-700 mt-12 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} RentEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
