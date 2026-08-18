import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendar, FaEdit } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-white text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex items-center">
                <FaUser className="text-purple-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white">{user?.username}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex items-center">
                <FaEnvelope className="text-purple-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{user?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex items-center">
                <FaCalendar className="text-purple-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white">2026</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
          >
            <FaEdit className="inline mr-2" /> Edit Profile
          </button>

          {isEditing && (
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <p className="text-gray-400 text-center">Profile editing coming soon!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;