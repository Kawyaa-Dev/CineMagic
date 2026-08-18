import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendar, FaClock, FaStar, FaTicketAlt, FaArrowLeft, 
  FaUser, FaUsers, FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [allShows, setAllShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const { isAuthenticated } = useSelector((state) => state.auth);

  const timeMap = {
    'MORNING': { label: 'Morning', time: '10:00 AM', hour: 10 },
    'AFTERNOON': { label: 'Afternoon', time: '1:00 PM', hour: 13 },
    'EVENING': { label: 'Evening', time: '4:00 PM', hour: 16 },
    'NIGHT': { label: 'Night', time: '7:00 PM', hour: 19 },
    'LATE_NIGHT': { label: 'Late Night', time: '10:00 PM', hour: 22 },
  };

  const priceTiers = {
    'MORNING': { label: 'Early Bird', color: 'text-green-400' },
    'AFTERNOON': { label: 'Standard', color: 'text-blue-400' },
    'EVENING': { label: 'Prime Time', color: 'text-yellow-400' },
    'NIGHT': { label: 'Premium', color: 'text-orange-400' },
    'LATE_NIGHT': { label: 'Late Show', color: 'text-red-400' },
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  // ✅ FIXED: Real-time filtering - hides past shows based on current time
  const fetchMovieDetails = async () => {
    try {
      const [movieRes, showsRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/movies/${id}/`),
        axios.get(`http://localhost:8000/api/shows/?movie=${id}`)
      ]);
      
      setMovie(movieRes.data);
      let shows = showsRes.data.results || showsRes.data;
      
      // ✅ REAL-TIME FILTERING: Hide past shows
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const filteredShows = shows.filter(show => {
        const showDate = new Date(show.show_date);
        const showDateOnly = new Date(showDate.getFullYear(), showDate.getMonth(), showDate.getDate());
        
        // If show is today, check if time has passed
        if (showDateOnly.getTime() === today.getTime()) {
          const showHour = timeMap[show.show_time]?.hour || 0;
          // Allow shows that start AFTER current time
          // If show hour is 13 (1 PM) and current time is 1:25 PM, hide it
          if (showHour < currentHour) return false;
          if (showHour === currentHour) {
            // If same hour, check minutes (add 30 min buffer)
            const showMinutes = show.show_time === 'AFTERNOON' ? 0 : 0;
            if (currentMinutes >= 30) return false;
          }
          return true;
        }
        // Show future dates
        return showDateOnly >= today;
      });
      
      // Deduplicate
      const seen = new Set();
      const uniqueShows = [];
      filteredShows.forEach(show => {
        const key = `${show.show_date}-${show.show_time}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueShows.push(show);
        }
      });
      
      setAllShows(uniqueShows);
      
      if (uniqueShows.length > 0) {
        const dates = [...new Set(uniqueShows.map(s => s.show_date))].sort();
        setSelectedDate(dates[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load movie details');
      setLoading(false);
    }
  };

  const handleBookNow = (showId) => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/seat-selection/${showId}`);
  };

  const groupedShows = allShows.reduce((acc, s) => {
    if (!acc[s.show_date]) acc[s.show_date] = [];
    acc[s.show_date].push(s);
    return acc;
  }, {});

  const dates = Object.keys(groupedShows).sort();
  const showsForDate = selectedDate ? groupedShows[selectedDate] || [] : [];
  const sortedShows = [...showsForDate].sort((a, b) => {
    const order = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'LATE_NIGHT'];
    return order.indexOf(a.show_time) - order.indexOf(b.show_time);
  });

  const isFillingFast = (s) => {
    const total = s.available_seats + s.booked_seats.length;
    return (s.available_seats / total) * 100 < 25;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!movie) return <div className="pt-20 text-center text-white">Movie not found</div>;

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-800">
              <img
                src={movie.poster_url || 'https://via.placeholder.com/400x600/6b21a8/ffffff?text=No+Poster'}
                alt={movie.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/6b21a8/ffffff?text=No+Poster';
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 text-gray-400 mb-4">
              <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> {movie.rating || 'N/A'}</span>
              <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">{movie.genre}</span>
              <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">{movie.language}</span>
              <span className="flex items-center gap-1 text-sm"><FaClock size={12} /> {movie.duration} min</span>
              {movie.age_rating && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs border border-red-500/30">
                  {movie.age_rating}
                </span>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.director && (
                  <div className="flex items-start gap-2">
                    <FaUser className="text-purple-400 mt-1" />
                    <div><p className="text-gray-400 text-xs">Director</p><p className="text-white font-medium">{movie.director}</p></div>
                  </div>
                )}
                {movie.cast && (
                  <div className="flex items-start gap-2">
                    <FaUsers className="text-pink-400 mt-1" />
                    <div><p className="text-gray-400 text-xs">Cast</p><p className="text-white text-sm">{movie.cast}</p></div>
                  </div>
                )}
              </div>
              {movie.release_year && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                  <FaCalendar className="text-purple-400" size={12} />
                  <span className="text-gray-400 text-sm">Released: {movie.release_year}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-white/5">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-purple-400" /> Synopsis
              </h3>
              <p className="text-gray-400 leading-relaxed">{movie.description}</p>
            </div>

            {/* SHOWTIMES */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-white/5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FaTicketAlt className="text-purple-400" /> Showtimes
              </h3>

              {dates.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No showtimes available</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {dates.map((d) => {
                      const isSelected = selectedDate === d;
                      const dateObj = new Date(d);
                      const isToday = dateObj.toDateString() === new Date().toDateString();
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = dateObj.getDate();
                      const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                      
                      return (
                        <button
                          key={d}
                          onClick={() => setSelectedDate(d)}
                          className={`px-5 py-3 rounded-xl transition-all text-sm font-medium min-w-[80px] ${
                            isSelected 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs opacity-70">{isToday ? 'Today' : dayName}</span>
                            <span className="text-lg font-bold">{dayNum}</span>
                            <span className="text-xs opacity-70">{isToday ? '' : monthName}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-3">
                    <span className="text-gray-400 text-xs">Price varies by showtime:</span>
                    <span className="text-green-400 text-xs">Morning ₹150</span>
                    <span className="text-blue-400 text-xs">Afternoon ₹170</span>
                    <span className="text-yellow-400 text-xs">Evening ₹190</span>
                    <span className="text-orange-400 text-xs">Night ₹210</span>
                    <span className="text-red-400 text-xs">Late Night ₹230</span>
                  </div>

                  {sortedShows.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedShows.map((show) => {
                        const fillingFast = isFillingFast(show);
                        const total = show.available_seats + show.booked_seats.length;
                        const percent = Math.round((show.available_seats / total) * 100);
                        const info = timeMap[show.show_time] || { label: show.show_time, time: '' };
                        const tier = priceTiers[show.show_time] || { label: '', color: 'text-white' };
                        
                        return (
                          <div
                            key={show.id}
                            className={`bg-gray-700/50 rounded-xl p-5 flex flex-col justify-between border ${fillingFast ? 'border-red-500/50 bg-red-500/5' : 'border-white/5'} hover:scale-105 transition-transform`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="text-white font-bold text-lg">{info.label}</span>
                                  <span className="text-gray-400 text-xs ml-2">{info.time}</span>
                                </div>
                                {fillingFast && (
                                  <span className="text-red-400 text-xs font-bold animate-pulse">🔥 Filling Fast!</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className={`font-bold text-lg ${tier.color}`}>₹{show.price}</span>
                                <span className="text-gray-400 text-xs">({tier.label})</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <span className="text-gray-400">{show.available_seats} seats left</span>
                              </div>
                              {fillingFast && (
                                <div className="mt-3">
                                  <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: `${100 - percent}%` }} />
                                  </div>
                                  <span className="text-red-400 text-xs mt-1 block">⚡ Only {show.available_seats} seats left!</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleBookNow(show.id)}
                              className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:scale-105 transition-transform text-sm"
                            >
                              <FaTicketAlt className="inline mr-2" /> Book Now
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No shows on this date</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;