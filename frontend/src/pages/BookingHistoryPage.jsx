import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCalendar, FaClock, FaFilm, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/bookings/');
      setBookings(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'text-green-400 bg-green-500/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
      case 'CANCELLED': return 'text-red-400 bg-red-500/20';
      case 'FAILED': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'CONFIRMED': return <FaCheckCircle className="inline mr-1" />;
      case 'PENDING': return <FaClock className="inline mr-1" />;
      case 'CANCELLED': return <FaTimesCircle className="inline mr-1" />;
      case 'FAILED': return <FaTimesCircle className="inline mr-1" />;
      default: return null;
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
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-white/5">
            <FaTicketAlt className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No bookings yet</p>
            <p className="text-gray-500 mt-2">Start booking your movie tickets now!</p>
            <button
              onClick={() => navigate('/movies')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:scale-105 transition-transform"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FaFilm className="text-purple-400 mr-2" />
                      <h3 className="text-xl font-semibold text-white">
                        {booking.show_detail?.movie_detail?.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-400 text-sm">
                      <div className="flex items-center">
                        <FaCalendar className="mr-2 text-purple-400" size={12} />
                        {new Date(booking.show_detail?.show_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-purple-400" size={12} />
                        {booking.show_detail?.show_time}
                      </div>
                      <div>
                        <span className="text-purple-400">Seats:</span> {booking.seats?.join(', ')}
                      </div>
                      <div>
                        <span className="text-purple-400">Total:</span> ₹{booking.total_price}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                      >
                        <FaEye size={10} /> View Ticket
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Booking #{booking.id}
                    </p>
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

export default BookingHistoryPage;