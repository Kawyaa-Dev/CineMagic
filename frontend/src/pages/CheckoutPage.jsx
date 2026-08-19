import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCreditCard, FaMobileAlt, FaUniversity, FaWallet, FaLock } from 'react-icons/fa';
import { SiPhonepe, SiGooglepay, SiPaytm } from 'react-icons/si';

const stripePromise = loadStripe('pk_test_51U58BBQ04lKSGTz4q6phSQ3qsYRzUfi5auhSGOT51ezWeuQmB64iKPmCVqQGkajUNimzZvPue1TH0yK7rEhIUiNw00DQPTDHmQ');

// Payment Methods
const paymentMethods = [
  { id: 'card', label: 'Card', icon: <FaCreditCard className="text-purple-400" /> },
  { id: 'upi', label: 'UPI', icon: <FaMobileAlt className="text-green-400" /> },
  { id: 'netbanking', label: 'Net Banking', icon: <FaUniversity className="text-blue-400" /> },
  { id: 'wallet', label: 'Wallet', icon: <FaWallet className="text-yellow-400" /> },
];

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: <SiGooglepay className="text-blue-400 text-2xl" /> },
  { id: 'phonepe', name: 'PhonePe', icon: <SiPhonepe className="text-purple-400 text-2xl" /> },
  { id: 'paytm', name: 'Paytm', icon: <SiPaytm className="text-blue-500 text-2xl" /> },
];

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Yes Bank', 'Punjab National Bank', 'Canara Bank'
];

// ✅ FIXED: Screen types with multipliers
const SCREEN_TYPES = {
  '2D': { label: '2D', multiplier: 1 },
  '3D': { label: '3D', multiplier: 1.3 },
  'IMAX': { label: 'IMAX', multiplier: 1.6 },
  '4DX': { label: '4DX', multiplier: 2 },
};

// ✅ FIXED: Check if seat is Premium (rows A-F)
const isPremiumSeat = (seat) => {
  if (!seat) return false;
  const row = seat.charAt(0);
  return ['A', 'B', 'C', 'D', 'E', 'F'].includes(row);
};

const CheckoutForm = ({ booking, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [selectedUPI, setSelectedUPI] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState(0);
  const [postalCode, setPostalCode] = useState('');
  const [selectedScreenType, setSelectedScreenType] = useState('2D');
  const navigate = useNavigate();

  // ✅ FIXED: Calculate price correctly
  const basePrice = parseFloat(booking?.show_detail?.price) || 210;
  const seatCount = booking?.seats?.length || 0;
  const hasPremium = booking?.seats?.some(seat => isPremiumSeat(seat));
  const seatMultiplier = hasPremium ? 1.5 : 1;
  const screenMultiplier = SCREEN_TYPES[selectedScreenType]?.multiplier || 1;
  
  // ✅ FIXED: Price per seat = base × screen × seat category
  const pricePerSeat = Math.round(basePrice * screenMultiplier * seatMultiplier);
  const totalPrice = pricePerSeat * seatCount;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      if (selectedMethod === 'card') {
        if (!stripe || !elements) {
          toast.error('Stripe not initialized');
          setProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            address: { postal_code: postalCode || '560001' },
          },
        });

        if (error) {
          toast.error(error.message);
          setProcessing(false);
          return;
        }

        // ✅ FIXED: Send totalPrice (in rupees), backend will convert to paise
        const intentResponse = await axios.post('http://localhost:8000/api/create-payment-intent/', {
          booking_id: booking.id,
          amount: totalPrice,  // ← Send in rupees
          screen_type: selectedScreenType,
        });

        const { client_secret, payment_intent_id } = intentResponse.data;
        const { error: confirmError } = await stripe.confirmCardPayment(client_secret, {
          payment_method: paymentMethod.id,
        });

        if (confirmError) {
          toast.error(confirmError.message);
          setProcessing(false);
          return;
        }

        await axios.post('http://localhost:8000/api/confirm-payment/', {
          payment_intent_id: payment_intent_id,
          booking_id: booking.id,
          final_amount: totalPrice,
        });

      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`${paymentMethods.find(m => m.id === selectedMethod)?.label} payment successful!`);
      }

      toast.success('🎉 Payment successful! Tickets booked.');
      onPaymentSuccess();
      navigate(`/booking-confirmation/${booking.id}`);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#ffffff',
                      '::placeholder': { color: '#a0aec0' },
                    },
                    invalid: { color: '#fa755a' },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">PIN Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit PIN"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={6}
                required
              />
            </div>
            <p className="text-gray-500 text-xs">Test card: 4242 4242 4242 4242</p>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {UPI_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedUPI(app.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedUPI === app.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <div className="flex justify-center">{app.icon}</div>
                  <p className="text-xs text-gray-400 mt-1">{app.name}</p>
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs text-center">Your UPI app will open to complete payment</p>
          </div>
        );
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {BANKS.map((bank, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedBank(index)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedBank === index ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <span className="text-white">{bank}</span>
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs text-center">You will be redirected to your bank</p>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {['Paytm', 'Amazon Pay', 'Google Pay'].map((wallet) => (
                <div key={wallet} className="p-4 rounded-xl border border-gray-700 bg-gray-800 text-center">
                  <p className="text-white text-sm">{wallet}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs text-center">Payment will be processed through your wallet</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Screen Type */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
        <p className="text-gray-300 text-sm font-medium mb-2">Select Screen Type</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SCREEN_TYPES).map(([key, type]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedScreenType(key)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                selectedScreenType === key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.label} {type.multiplier > 1 ? `+${Math.round((type.multiplier - 1) * 100)}%` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
        <p className="text-gray-300 text-sm font-medium mb-2">Pay with</p>
        <div className="grid grid-cols-4 gap-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                selectedMethod === method.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="flex justify-center text-xl">{method.icon}</div>
              <p className="text-xs text-gray-400 mt-1">{method.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-white/5">
        {renderPaymentForm()}
      </div>

      {/* ✅ FIXED: Price Breakdown - Shows correct calculation */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Base Price (per seat)</span>
            <span className="text-white font-medium">₹{basePrice}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Screen ({SCREEN_TYPES[selectedScreenType]?.label})</span>
            <span className="text-white">× {SCREEN_TYPES[selectedScreenType]?.multiplier}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Seat ({hasPremium ? 'Premium ⭐' : 'Standard'})</span>
            <span className="text-white">× {seatMultiplier}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Number of Seats</span>
            <span className="text-white">{seatCount}</span>
          </div>
          <div className="flex justify-between pt-2 mt-1 border-t-2 border-purple-500/30">
            <span className="text-gray-300 font-medium">Price Per Seat</span>
            <span className="text-white font-bold text-lg">₹{pricePerSeat}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-300 font-bold text-lg">Total Amount</span>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">₹{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={processing || (selectedMethod === 'card' && !stripe)}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          processing || (selectedMethod === 'card' && !stripe)
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30'
        }`}
      >
        <FaLock className="text-xs" />
        {processing ? 'Processing...' : `Pay ₹${totalPrice}`}
      </button>

      <p className="text-gray-500 text-xs text-center flex items-center justify-center gap-2">
        <FaLock className="text-gray-600" size={10} />
        Your payment is secure
      </p>
    </form>
  );
};

const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/bookings/${bookingId}/`);
      setBooking(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load booking details');
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

  if (!booking) {
    return <div className="pt-20 text-center text-white">Booking not found</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Complete Payment</h2>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-white/5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Booking ID</span><span className="text-white font-semibold">#{booking?.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Movie</span><span className="text-white">{booking?.show_detail?.movie_detail?.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Show</span><span className="text-white">{booking?.show_detail?.show_time} • {new Date(booking?.show_detail?.show_date).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Seats</span><span className="text-white font-medium bg-purple-500/20 px-2 py-0.5 rounded">{booking?.seats?.join(', ')}</span></div>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm booking={booking} onPaymentSuccess={() => {}} />
          </Elements>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;