import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly, such as your name, email address, phone number, and payment information when you book tickets.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Process your ticket bookings and payments</li>
                <li>Send you booking confirmations and updates</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional offers (you can opt-out anytime)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">3. Data Security</h2>
              <p>We use industry-standard encryption and security measures to protect your personal and payment information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">4. Third-Party Services</h2>
              <p>We use Stripe for payment processing. Your payment information is handled securely by Stripe and not stored on our servers.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <span className="text-purple-400">support@cinemagic.com</span></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;