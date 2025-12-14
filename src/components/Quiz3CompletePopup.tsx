import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Quiz3CompletePopupProps {
  onClose: () => void;
  onNext: () => void;
}

const Quiz3CompletePopup: React.FC<Quiz3CompletePopupProps> = ({ onClose, onNext }) => {
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
              src="/assessment1_complete.gif" 
              alt="Clapping Hands" 
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-gray-800 text-lg font-medium mb-2">
            Kamu sudah menyelesaikan bagian tersulit, hebat! Tapi kita masih punya satu bagian lagi.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Nanti
            </button>
            <button
              onClick={onNext}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Lanjut
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz3CompletePopup;
