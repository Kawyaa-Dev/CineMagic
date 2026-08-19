import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Refund Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">1. Cancellation Policy</h2>
              <p>You can cancel your booking up to 2 hours before the showtime. Cancellation fees may apply based on the time of cancellation.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">2. Refund Timeline</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Cancel 24+ hours before: Full refund (100%)</li>
                <li>Cancel 12-24 hours before: 50% refund</li>
                <li>Cancel 2-12 hours before: 25% refund</li>
                <li>Cancel less than 2 hours: No refund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">3. Refund Process</h2>
              <p>Refunds are processed within 5-7 business days and credited back to the original payment method used during booking.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">4. Contact Us</h2>
              <p>For any refund-related queries, please contact us at <span className="text-purple-400">support@cinemagic.com</span></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;