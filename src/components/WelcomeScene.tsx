import React from 'react';
import Image from 'next/image';
import { getImagePath } from '../utils/imagePath';

interface WelcomeSceneProps {
  onNext: () => void;
}

const WelcomeScene: React.FC<WelcomeSceneProps> = ({ onNext }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center bg-white relative overflow-hidden">
      {/* Yellow background shape */}
      <div 
        className="absolute inset-0 bg-[#FFDE3D] -z-10"
        style={{
          clipPath: 'polygon(0 75%, 100% 75%, 100% 100%, 0 100%)',
          height: '100%',
          width: '100%',
        }}
      />
      
      <div className="w-full max-w-md h-full flex flex-col items-center justify-center p-4">
        {/* Logo and Header */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="w-16 h-16 relative mb-4">
            <Image 
              src={getImagePath("logorevou.png")} 
              alt="RevoU Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
            Selamat Datang, Calon Data Analyst!
          </h1>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col items-center w-full mb-8">
          {/* Animated GIF */}
          <div className="w-60 h-60 mx-auto mb-6 relative">
            <Image
              src={getImagePath("welcome_da.gif")}
              alt="Data Analyst"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Subheadline */}
          <div className="text-center">
            <p className="text-base text-gray-600 mb-1">
              Cari tahu tipe Data Analyst seperti apakah kamu?
            </p>
            <p className="text-sm text-gray-500">
              Waktu Pengerjaan: 10-15 menit
            </p>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="w-full max-w-xs mx-auto mt-8">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full text-base"
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
