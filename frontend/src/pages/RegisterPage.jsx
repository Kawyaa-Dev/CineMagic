import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const { username, email, password, password2 } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      toast.success('Registration successful! Please login. 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
          <p className="text-gray-400 mt-2">Start booking your movie tickets</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;