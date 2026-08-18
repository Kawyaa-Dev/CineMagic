import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaClock } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [nowShowing, setNowShowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [featuredRes, showingRes] = await Promise.all([
        axios.get('http://localhost:8000/api/movies/featured/'),
        axios.get('http://localhost:8000/api/movies/now_showing/')
      ]);
      setFeaturedMovies(featuredRes.data.results || featuredRes.data);
      setNowShowing(showingRes.data.results || showingRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section with Cinema Background */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/70 to-pink-800/50 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop&q=80"
            alt="Cinema"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20"></div>
        
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="text-8xl">🎬</span>
            </motion.div>
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%]">
                CineMagic
              </span>
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-purple-200"
            >
              Experience Cinema Like Never Before
            </motion.p>
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/movies')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all"
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Featured Movies */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Movies</h2>
        {featuredMovies.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-xl">No featured movies available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-800/80 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative h-80 bg-gray-700">
                  <img
                    src={movie.poster_url || 'https://via.placeholder.com/300x450/6b21a8/ffffff?text=No+Poster'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/6b21a8/ffffff?text=No+Poster';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-white">{movie.rating || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">{movie.title}</h3>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span>{movie.genre}</span>
                    <span>{movie.duration} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Now Showing */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Now Showing</h2>
        {nowShowing.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-xl">No movies currently showing</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nowShowing.slice(0, 8).map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/80 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative h-64 bg-gray-700">
                  <img
                    src={movie.poster_url || 'https://via.placeholder.com/300x450/6b21a8/ffffff?text=No+Poster'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/6b21a8/ffffff?text=No+Poster';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
                  <div className="flex items-center justify-between text-gray-400 mt-2">
                    <span className="text-sm">{movie.genre}</span>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{movie.rating || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;