import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quiz1CoverPopupProps {
  onClose: () => void;
  onStartQuiz: () => void;
}

const Quiz1CoverPopup: React.FC<Quiz1CoverPopupProps> = ({ onClose, onStartQuiz }) => {
  const popupStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  };

  return (
    <AnimatePresence>
      <motion.div 
        style={popupStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center">
            <img 
              src="/calculator.png" 
              alt="Calculator" 
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <p className="text-gray-600 mb-6">
              Kamu dapat menggunakan kalkulator untuk pertanyaan numerik, tes ini juga paling baik dikerjakan di desktop. Selamat mengerjakan!
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={onStartQuiz}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Quiz1CoverPopup;
