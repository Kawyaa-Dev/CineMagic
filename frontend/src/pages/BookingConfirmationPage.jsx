import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTicketAlt, 
  FaFilm, 
  FaCalendar, 
  FaClock, 
  FaUser,
  FaPrint,
  FaDownload,
  FaShare,
  FaHome,
  FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/bookings/${bookingId}/`);
      setBooking(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '🎬 Movie Ticket',
        text: `I just booked tickets for ${booking?.show_detail?.movie_detail?.title}! 🎉`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center text-gray-400">
          <p className="text-xl">Booking not found</p>
          <button 
            onClick={() => navigate('/movies')}
            className="mt-4 px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  const movie = booking?.show_detail?.movie_detail;
  const show = booking?.show_detail;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    const timeMap = {
      'MORNING': '10:00 AM',
      'AFTERNOON': '1:00 PM',
      'EVENING': '4:00 PM',
      'NIGHT': '7:00 PM',
      'LATE_NIGHT': '10:00 PM'
    };
    return timeMap[timeStr] || timeStr;
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Bookings
        </button>

        {/* Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaCheckCircle className="text-green-400 text-4xl" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Payment Successful! 🎉</h2>
            <p className="text-gray-400 mt-1">Your booking has been confirmed</p>
            <p className="text-gray-500 text-sm mt-2">
              Booking ID: <span className="text-purple-400 font-semibold">#{booking.id}</span>
            </p>
          </div>

          {/* Ticket / E-Ticket */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/5 overflow-hidden mb-6">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaTicketAlt />
                  <span className="font-semibold">E-TICKET</span>
                </div>
                <span className="text-xs opacity-80">#{booking.id}</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6">
              {/* Movie Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                  <img 
                    src={`http://localhost:8000${movie?.poster_url}`}
                    alt={movie?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x112/6b21a8/ffffff?text=No+Poster';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{movie?.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-1">
                    <span className="px-2 py-0.5 bg-gray-700 rounded-full">{movie?.genre}</span>
                    <span className="px-2 py-0.5 bg-gray-700 rounded-full">{movie?.language}</span>
                    <span className="px-2 py-0.5 bg-gray-700 rounded-full">{movie?.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {booking.show_detail?.show_time}
                    </span>
                    <span className="px-3 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Show Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                  <p className="text-white font-medium flex items-center gap-1">
                    <FaCalendar className="text-purple-400" size={12} />
                    {formatDate(show?.show_date)}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Time</p>
                  <p className="text-white font-medium flex items-center gap-1">
                    <FaClock className="text-purple-400" size={12} />
                    {formatTime(show?.show_time)}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Seats</p>
                  <p className="text-white font-medium text-lg">{booking.seats?.join(', ')}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Amount</p>
                  <p className="text-white font-bold text-lg text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
                    ₹{booking.total_price}
                  </p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gray-600 rounded flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 6h4v4H6V6zm8-8h4v4h-4V0zM6 14h4v4H6v-4zm8 0h4v4h-4v-4zM0 6h4v4H0V6zm0 8h4v4H0v-4z" />
                      </svg>
                    </div>
                    <p className="text-[8px] text-gray-500 mt-1">Scan to verify</p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="text-center text-xs text-gray-500 border-t border-white/5 pt-4">
                <p className="flex items-center justify-center gap-1"><FaUser className="text-purple-400" size={10} /> Booked by: {user?.username || 'Guest'}</p>
                <p className="mt-1">Booking Date: {new Date(booking.booking_date).toLocaleString()}</p>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="border-t border-white/5 p-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={() => toast.success('Ticket downloaded!')}
                className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
              >
                <FaDownload /> Download
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
              >
                <FaShare /> Share
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <FaHome /> Go Home
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:scale-105 transition-transform flex items-center gap-2"
            >
              <FaFilm /> Book More
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;