import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

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
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      toast.success('Login successful! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err?.detail || 'Login failed. Please try again.');
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
          <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Login to book your movie tickets</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
              required
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;