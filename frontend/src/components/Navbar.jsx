import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaUser, FaTicketAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-white/10 fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold gradient-text"
            >
              🎬 CineMagic
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/bookings" className="text-gray-300 hover:text-white transition-colors">
                  <FaTicketAlt className="inline mr-1" /> My Bookings
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                  <FaUser className="inline mr-1" /> {user?.username || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaSignOutAlt className="inline mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/movies" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                Movies
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/bookings" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                    My Bookings
                  </Link>
                  <Link to="/profile" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-400 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;