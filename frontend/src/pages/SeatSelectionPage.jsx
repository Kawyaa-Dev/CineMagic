import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChair, FaTicketAlt, FaArrowLeft, FaFilm, FaClock, FaCalendar, 
  FaTimes, FaCheck, FaInfoCircle, FaVideo, FaCube, FaGlobe, FaDiceThree,
  FaCrown, FaStar
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../redux/slices/bookingSlice';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedScreenType, setSelectedScreenType] = useState('2D');

  const screenTypes = [
    { id: '2D', label: '2D', icon: <FaVideo />, priceMultiplier: 1, color: 'from-blue-500 to-cyan-400', rows: 10 },
    { id: '3D', label: '3D', icon: <FaCube />, priceMultiplier: 1.3, color: 'from-green-500 to-teal-400', rows: 10 },
    { id: 'IMAX', label: 'IMAX', icon: <FaGlobe />, priceMultiplier: 1.6, color: 'from-purple-500 to-indigo-500', rows: 6 },
    { id: '4DX', label: '4DX', icon: <FaDiceThree />, priceMultiplier: 2, color: 'from-red-500 to-rose-500', rows: 5 },
  ];

  const getPremiumRows = (screenType) => {
    const layouts = {
      '2D': ['F', 'G', 'H', 'I', 'J'],
      '3D': ['F', 'G', 'H', 'I', 'J'],
      'IMAX': ['D', 'E', 'F'],
      '4DX': ['C', 'D', 'E'],
    };
    return layouts[screenType] || ['F', 'G', 'H', 'I', 'J'];
  };

  const seatCategories = {
    PREMIUM: {
      label: 'Premium ⭐',
      icon: <FaStar />,
      bgColor: 'from-rose-500 to-pink-500',
      textColor: 'text-rose-400',
      priceMultiplier: 1.5,
    },
    STANDARD: {
      label: 'Standard',
      icon: <FaChair />,
      bgColor: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-400',
      priceMultiplier: 1,
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    fetchShowDetails();
  }, [showId, isAuthenticated]);

  const fetchShowDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/shows/${showId}/`);
      setShow(response.data);
      setBookedSeats(response.data.booked_seats || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load show details');
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      toast.error('Seat is already booked');
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        if (prev.length >= 10) {
          toast.error('Maximum 10 seats can be booked');
          return prev;
        }
        return [...prev, seatNumber];
      }
    });
  };

  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setIsBooking(true);
    try {
      const result = await dispatch(createBooking({ showId, seats: selectedSeats })).unwrap();
      toast.success(`🎉 ${selectedSeats.length} seats reserved! Proceed to payment`);
      navigate(`/checkout/${result.id}`);
    } catch (error) {
      toast.error(error?.error || 'Booking failed');
      setIsBooking(false);
    }
  };

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return 'booked';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    if (hoveredSeat === seatNumber) return 'hover';
    return 'available';
  };

  const getSeatCategory = (row, screenType) => {
    const premiumRows = getPremiumRows(screenType);
    return premiumRows.includes(row) ? 'PREMIUM' : 'STANDARD';
  };

  const getSeatPrice = (seatNumber) => {
    const basePrice = parseFloat(show?.price || 150);
    const row = seatNumber.charAt(0);
    const screenMultiplier = screenTypes.find(s => s.id === selectedScreenType)?.priceMultiplier || 1;
    const categoryKey = getSeatCategory(row, selectedScreenType);
    const category = seatCategories[categoryKey];
    return Math.round(basePrice * category.priceMultiplier * screenMultiplier);
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentScreenType = screenTypes.find(s => s.id === selectedScreenType);
  const isIMAX = selectedScreenType === 'IMAX';
  const is4DX = selectedScreenType === '4DX';
  
  // ✅ Determine rows and columns based on screen type
  const getRows = () => {
    if (isIMAX) return ['A', 'B', 'C', 'D', 'E', 'F'];
    if (is4DX) return ['A', 'B', 'C', 'D', 'E'];
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  };
  
  const rows = getRows();
  
  // ✅ Define the seat layout as an array of seat numbers
  const getSeatNumbers = () => {
    if (isIMAX) {
      // IMAX: [1,2] [3,4,5,6,7,8] [9,10]
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else if (is4DX) {
      // 4DX: [1,2,3] [4,5,6,7] [8,9,10]
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
    // Standard: [1,2,3,4,5] [6,7,8,9,10]
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };

  const seatNumbers = getSeatNumbers();
  const totalSeats = rows.length * seatNumbers.length;
  const bookedCount = bookedSeats.length;
  const availableCount = totalSeats - bookedCount;

  // ✅ IMAX Screen Style
  const getIMAXScreenStyle = () => ({
    background: 'linear-gradient(180deg, rgba(120, 80, 200, 0.3) 0%, rgba(80, 40, 160, 0.1) 100%)',
    borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
    height: '80px',
    width: '95%',
    margin: '0 auto',
    border: '2px solid rgba(120, 80, 200, 0.2)',
    boxShadow: '0 -20px 60px rgba(120, 80, 200, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const get4DXScreenStyle = () => ({
    background: 'linear-gradient(180deg, rgba(220, 50, 80, 0.3) 0%, rgba(180, 30, 60, 0.1) 100%)',
    borderRadius: '20px',
    height: '80px',
    width: '100%',
    border: '2px solid rgba(220, 50, 80, 0.2)',
    boxShadow: '0 -20px 60px rgba(220, 50, 80, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const renderScreen = () => {
    if (isIMAX) {
      return (
        <div style={getIMAXScreenStyle()} className="relative">
          <span className="text-xs text-purple-400/60 tracking-[0.3em]">🎬 IMAX CURVED SCREEN</span>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] text-gray-600">⟵ CURVED ⟶</div>
        </div>
      );
    } else if (is4DX) {
      return (
        <div style={get4DXScreenStyle()} className="relative">
          <span className="text-xs text-rose-400/60 tracking-[0.3em]">🎬 4DX WRAPAROUND SCREEN</span>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] text-gray-600">⬅️ LEFT • CENTER • RIGHT ➡️</div>
        </div>
      );
    }
    return (
      <div className="w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full relative">
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-gray-400 tracking-[0.3em] bg-gray-900/90 px-6 py-1.5 rounded-full border border-white/10 backdrop-blur">
            🎬 {selectedScreenType} SCREEN
          </span>
        </div>
      </div>
    );
  };

  // ✅ Render a single row of seats with proper alignment
  const renderSeatRow = (row) => {
    const categoryKey = getSeatCategory(row, selectedScreenType);
    const category = seatCategories[categoryKey];
    const isPremium = categoryKey === 'PREMIUM';
    
    return (
      <div key={row} className={`flex items-center gap-1 p-1 rounded-lg ${isPremium ? 'bg-rose-500/5 border border-rose-500/10' : ''}`}>
        <div className="w-6 flex-shrink-0 text-center text-[9px] text-gray-500 font-mono font-bold">{row}</div>
        
        {seatNumbers.map((col, index) => {
          const seatNumber = `${row}${col}`;
          const status = getSeatStatus(seatNumber);
          
          // ✅ Determine if we need to add a gap after certain columns
          let showGap = false;
          if (isIMAX && (index === 1 || index === 7)) showGap = true; // After 2 and 8
          if (is4DX && (index === 2 || index === 6)) showGap = true; // After 3 and 7
          if (!isIMAX && !is4DX && index === 4) showGap = true; // After 5
          
          return (
            <React.Fragment key={seatNumber}>
              <motion.button
                whileHover={status === 'available' ? { scale: 1.1, y: -2 } : {}}
                whileTap={status === 'available' ? { scale: 0.9 } : {}}
                onClick={() => handleSeatClick(seatNumber)}
                onMouseEnter={() => setHoveredSeat(seatNumber)}
                onMouseLeave={() => setHoveredSeat(null)}
                disabled={status === 'booked'}
                className={`flex-1 aspect-square rounded-lg flex items-center justify-center transition-all duration-200 text-[10px] font-medium ${
                  status === 'available' ? `bg-gradient-to-br ${category.bgColor} opacity-70 hover:opacity-100 text-white cursor-pointer shadow-md hover:shadow-lg` : ''
                } ${
                  status === 'selected' ? `bg-gradient-to-br ${category.bgColor} text-white shadow-xl ring-2 ring-white scale-105` : ''
                } ${
                  status === 'booked' ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-40' : ''
                } ${
                  status === 'hover' && status !== 'booked' ? `bg-gradient-to-br ${category.bgColor} text-white scale-105 ring-2 ring-white` : ''
                }`}
              >
                <FaChair className="text-[10px]" />
                {isPremium && status !== 'booked' && status !== 'selected' && (
                  <div className="absolute -top-0.5 -right-0.5"><FaStar className="text-rose-400 text-[8px] animate-pulse" /></div>
                )}
                {status === 'selected' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full text-[5px] flex items-center justify-center text-white shadow-lg">
                    <FaCheck />
                  </motion.div>
                )}
              </motion.button>
              {showGap && (
                <div className="w-4 flex-shrink-0 flex items-center justify-center">
                  <div className="w-0.5 h-6 bg-white/10 rounded-full"></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16 px-4 pb-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Select Your Seats</p>
          </div>
        </div>

        {/* Movie Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 shadow-lg">
              <img 
                src={`http://localhost:8000${show?.movie_detail?.poster_url}`}
                alt={show?.movie_detail?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64x80';
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{show?.movie_detail?.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center"><FaCalendar className="mr-1 text-purple-400" size={12} /> {new Date(show?.show_date).toLocaleDateString()}</span>
                <span className="flex items-center"><FaClock className="mr-1 text-purple-400" size={12} /> {show?.show_time}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-400 text-xs">Screen</p>
              <p className="text-white font-semibold">{show?.screen?.screen_number || '1'}</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Starting from</p>
              <p className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
                ₹{Math.round(parseFloat(show?.price || 150) * (currentScreenType?.priceMultiplier || 1))}
              </p>
            </div>
          </div>
        </div>

        {/* Screen Type Selection */}
        <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-3 flex items-center gap-2"><FaInfoCircle /> Select Screen Type</p>
          <div className="flex flex-wrap gap-3">
            {screenTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedScreenType(type.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-sm ${
                  selectedScreenType === type.id 
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg shadow-${type.color.split('-')[1]}-500/30 scale-105` 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type.icon} <span className="font-medium">{type.label}</span>
                <span className="text-xs opacity-70">{type.priceMultiplier > 1 ? `+${Math.round((type.priceMultiplier - 1) * 100)}%` : ''}</span>
                <span className="text-[8px] opacity-50 hidden sm:inline">
                  {isIMAX ? 'Curved' : is4DX ? 'Wraparound' : 'Standard'} • {rows.length} rows
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Screen Preview */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-white/5">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-b from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-white/5">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-40 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent blur-3xl"></div>
                </div>
                <div className="relative z-10">
                  <div className="w-full max-w-2xl mx-auto">
                    {renderScreen()}
                    <div className="flex justify-center gap-6 text-[10px] text-gray-500 mt-6">
                      <span className="flex items-center gap-1">🎥 {selectedScreenType}</span>
                      <span>•</span>
                      <span>🎯 {totalSeats} seats</span>
                      <span>•</span>
                      <span>📊 {availableCount} available</span>
                      {isIMAX && <span className="text-purple-400/50">⟐ {rows.length} rows • Curved</span>}
                      {is4DX && <span className="text-rose-400/50">⟐ {rows.length} rows • Wraparound</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-purple-500/10 to-transparent rounded-l-2xl"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-purple-500/10 to-transparent rounded-r-2xl"></div>
            </div>
          </div>
        </div>

        {/* Seat Categories */}
        <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-white/5">
          <div className="flex flex-wrap gap-4">
            {Object.entries(seatCategories).map(([key, category]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded bg-gradient-to-r ${category.bgColor}`}></div>
                <span className="text-white text-sm flex items-center gap-1">
                  {category.icon} {category.label}
                </span>
                <span className={`text-xs font-semibold ${category.textColor}`}>
                  ₹{Math.round(parseFloat(show?.price || 150) * category.priceMultiplier * (currentScreenType?.priceMultiplier || 1))}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-gray-400 text-sm">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-[6px] text-white">✓</div>
              <span className="text-gray-400 text-sm">Selected</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            ⭐ Premium rows: {getPremiumRows(selectedScreenType).join(', ')}
            {isIMAX && ' • 🎥 IMAX Curved Layout (2 - 6 - 2)'}
            {is4DX && ' • 🔄 4DX Wraparound (3 - 4 - 3)'}
          </p>
        </div>

        {/* ===== ✅ PERFECT SEAT LAYOUT WITH PROPER ALIGNMENT ===== */}
        <div className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 md:p-8 shadow-2xl border border-white/5 overflow-x-auto">
          <div className="min-w-[500px] max-w-4xl mx-auto">
            
            {/* ✅ Column Labels - Perfectly aligned with seats */}
            <div className="flex items-center gap-1 mb-2 px-2">
              <div className="w-6 flex-shrink-0"></div>
              
              {seatNumbers.map((col, index) => {
                let showGap = false;
                if (isIMAX && (index === 1 || index === 7)) showGap = true;
                if (is4DX && (index === 2 || index === 6)) showGap = true;
                if (!isIMAX && !is4DX && index === 4) showGap = true;
                
                return (
                  <React.Fragment key={`label-${col}`}>
                    <div className="flex-1 text-center text-[9px] text-gray-500 font-mono">{col}</div>
                    {showGap && <div className="w-4 flex-shrink-0"></div>}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Seats */}
            <div className="space-y-1.5">
              {rows.map((row) => renderSeatRow(row))}
            </div>

            {/* Screen Direction */}
            <div className="text-center text-[8px] text-gray-600 mt-3">
              ↑ {isIMAX ? 'CURVED ' : is4DX ? 'WRAPAROUND ' : ''}SCREEN ↑
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 pt-4 border-t border-white/10">
          {Object.entries(seatCategories).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded bg-gradient-to-r ${category.bgColor}`}></div>
              <span className="text-gray-300 text-sm flex items-center gap-1">
                {category.icon} {category.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded opacity-50"></div>
            <span className="text-gray-400 text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center text-[5px] text-white">✓</div>
            <span className="text-gray-400 text-sm">Selected</span>
          </div>
          {isIMAX && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-400/50">⟐ 2 - 6 - 2 Curved</span>
            </div>
          )}
          {is4DX && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-rose-400/50">⟐ 3 - 4 - 3 Wraparound</span>
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 flex-wrap justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Selected Seats</p>
                  <p className="text-lg font-bold text-white">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Screen</p>
                  <p className="text-white font-semibold">{selectedScreenType}</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Total</p>
                  <p className="text-xl font-bold text-white">{selectedSeats.length} seats</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Amount</p>
                  <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">₹{getTotalPrice()}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => setSelectedSeats([])} className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm" disabled={selectedSeats.length === 0}>
                  <FaTimes className="inline mr-1" /> Clear
                </button>
                <button onClick={handleBookSeats} disabled={selectedSeats.length === 0 || isBooking} className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 min-w-[150px] justify-center ${
                  selectedSeats.length > 0 && !isBooking ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105 text-white' : 'bg-gray-600 cursor-not-allowed text-gray-400'
                }`}>
                  {isBooking ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Booking...</>
                  ) : (
                    <><FaTicketAlt /> Book Now ({selectedSeats.length})</>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Total: {totalSeats} seats</span>
              <span>Available: {availableCount}</span>
              <span>Booked: {bookedCount}</span>
              <span>Selected: {selectedSeats.length}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-32"></div>
    </div>
  );
};

export default SeatSelectionPage;