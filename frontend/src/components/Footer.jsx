import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">🎬 CineMagic</h3>
            <p className="text-gray-400">Premium Cinema Experience</p>
            <p className="text-gray-500 text-sm mt-2">Book your tickets with ease</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/movies" className="hover:text-white transition-colors">Movies</a></li>
              <li><a href="/bookings" className="hover:text-white transition-colors">My Bookings</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 CineMagic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;