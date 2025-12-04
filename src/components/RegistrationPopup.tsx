import React from 'react';
import { motion } from 'framer-motion';

interface RegistrationPopupProps {
  onClose: () => void;
}

const RegistrationPopup: React.FC<RegistrationPopupProps> = ({ onClose }) => {
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
    <div style={popupStyles}>
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
