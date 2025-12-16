import React from 'react';
import Image from 'next/image';
import { getImagePath } from '../utils/imagePath';

interface WelcomeSceneProps {
  onNext: () => void;
}

const WelcomeScene: React.FC<WelcomeSceneProps> = ({ onNext }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-white relative overflow-hidden">
      {/* Yellow background shape */}
      <div 
        className="absolute inset-0 bg-[#FFDE3D] -z-10"
        style={{
          clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
          height: '100%',
          width: '100%',
        }}
      />
      
      <div className="w-full max-w-md mx-auto text-center flex flex-col items-center justify-between px-4 h-full py-8">
        {/* Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
          <Image 
            src={getImagePath("logorevou.png")} 
            alt="RevoU Logo" 
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        
        {/* Headline */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4 px-2">
          Selamat Datang, Calon Data Analyst!
        </h1>
        
        {/* Animated GIF */}
        <div className="w-full max-w-[200px] sm:max-w-[240px] mx-auto my-4 aspect-square relative flex-shrink-0">
          <Image
            src={getImagePath("welcome_da.gif")}
            alt="Digital Marketing"
            width={240}
            height={240}
            className="object-contain"
            priority
          />
        </div>
        
        {/* Subheadline */}
        <p className="text-sm sm:text-base text-gray-600 mb-2 px-2">
          Cari tahu tipe Data Analyst seperti apakah kamu?
        </p>
        
        {/* CTA Button */}
        <div className="w-full px-4 pt-4 mt-auto">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full max-w-xs mx-auto block"
            onClick={onNext}
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScene;
