import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              🎬 CineMagic
            </h3>
            <p className="text-gray-400">Premium Cinema Experience</p>
            <p className="text-gray-500 text-sm mt-2">Book your tickets with ease</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/movies" className="hover:text-purple-400 transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-purple-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/faq" className="hover:text-purple-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-purple-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social - GitHub & LinkedIn Only */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Kawyaa-Dev/CineMagic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={28} />
              </a>
              <a
                href="https://www.linkedin.com/in/kawyaakrish/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={28} />
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-3">⭐ Star us on GitHub!</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CineMagic. All rights reserved.</p>
          <p className="text-xs text-gray-600 mt-1">Made with ❤️ by Kawyaa-Dev</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;