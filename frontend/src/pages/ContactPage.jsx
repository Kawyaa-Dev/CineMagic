import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 mb-6">
                Have questions? We'd love to hear from you. Reach out to us and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-purple-400" />
                  <span className="text-gray-300">support@cinemagic.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-purple-400" />
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-purple-400" />
                  <span className="text-gray-300">123 Cinema Lane, Downtown, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-purple-400" />
                  <span className="text-gray-300">24/7 Customer Support</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:scale-105 transition-transform">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;