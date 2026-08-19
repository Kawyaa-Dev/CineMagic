import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I book a movie ticket?',
      answer: 'Simply browse movies, select a showtime, choose your seats, and proceed to payment. It\'s that easy!'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the showtime. A cancellation fee may apply.'
    },
    {
      question: 'How do I get my ticket?',
      answer: 'After successful payment, you will receive a confirmation email with your e-ticket. You can also view it in "My Bookings".'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Wallets.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer full refunds for cancellations made 24 hours before the show. Partial refunds are available for later cancellations.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach us via email at support@cinemagic.com or call us at +91 98765 43210. We\'re available 24/7.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h1>
          <p className="text-gray-400 mb-8">Find answers to common questions about booking tickets on CineMagic.</p>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-purple-400" />
                  ) : (
                    <FaChevronDown className="text-purple-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;