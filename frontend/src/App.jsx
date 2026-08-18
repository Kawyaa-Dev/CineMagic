import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/seat-selection/:showId" element={<PrivateRoute><SeatSelectionPage /></PrivateRoute>} />
              <Route path="/checkout/:bookingId" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              {/* ✅ NEW ROUTE FOR CONFIRMATION */}
              <Route path="/booking-confirmation/:bookingId" element={<PrivateRoute><BookingConfirmationPage /></PrivateRoute>} />
              <Route path="/bookings" element={<PrivateRoute><BookingHistoryPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #8B5CF6',
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;