import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaClock } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/movies/');
      console.log('Movies API Response:', response.data);
      
      const movieData = response.data.results || response.data;
      setMovies(movieData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies');
      setLoading(false);
    }
  };

  const filteredMovies = filter === 'ALL' 
    ? movies 
    : movies.filter(movie => movie.genre === filter);

  const genres = ['ALL', 'ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'ROMANCE', 'SCI-FI', 'THRILLER'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
          Now Showing
        </h1>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setFilter(genre)}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === genre
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No movies found</p>
            <p className="text-sm mt-2">Please run: python seed_data.py</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-800/80 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative h-64 bg-gray-700">
                  <img
                    src={movie.poster_url || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded-full">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-white">{movie.rating || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">{movie.title}</h3>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span>{movie.genre}</span>
                    <div className="flex items-center">
                      <FaClock className="mr-1" size={12} />
                      <span>{movie.duration} min</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredMovies.length === 0 && movies.length > 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No movies match the {filter} filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;