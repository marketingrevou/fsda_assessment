import React from 'react';
import { motion } from 'framer-motion';

interface RegistrationPopupProps {
  onClose: () => void;
}

const RegistrationPopup: React.FC<RegistrationPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center">
<p className="text-gray-600 mb-6">
            Kamu akan mengerjakan 3 set pertanyaan yang akan menentukan tipe Data Analyst kamu! Siap untuk mulai kuis pertama?
          </p>
          <p className="text-gray-400 text-sm mb-6">Est. Duration: 30-45 minutes</p>
          
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Saya siap!
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPopup;
