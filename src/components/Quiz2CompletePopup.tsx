import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Quiz2CompletePopupProps {
  onContinue: () => void;
}

const Quiz2CompletePopup: React.FC<Quiz2CompletePopupProps> = ({ onContinue }) => {
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
        className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 flex flex-col items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center mb-4">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image 
              src="/popup.gif" 
              alt="Clapping Hands" 
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-gray-800 text-lg font-medium mb-2">
            Selamat sudah menyelesaikan bagian kedua! Sekarang saatnya menunjukkan kemampuan interpretasi data kamu!
          </p>
          <button
            onClick={onContinue}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Lanjut!
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz2CompletePopup;
