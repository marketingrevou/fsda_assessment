import React, { useState } from 'react';
import Image from 'next/image';
import RegistrationPopup from './RegistrationPopup';

interface RegistrationSceneProps {
  onNext: (name: string) => void;
}

const RegistrationScene: React.FC<RegistrationSceneProps> = ({ onNext }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama Lengkap wajib diisi';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPopup(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    onNext(formData.fullName); // Pass the user's name to the parent component
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-white relative overflow-hidden">
      {showPopup && <RegistrationPopup onClose={handleClosePopup} />}
      {/* Yellow background shape */}
      <div 
        className="absolute inset-0 bg-[#FFDE3D] -z-10"
        style={{
          clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
          height: '100%',
          width: '100%',
        }}
      />
      
      <div className="w-full max-w-md mx-auto text-center flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-2 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 relative">
          <Image 
            src="/logorevou.png" 
            alt="RevoU Logo" 
            fill
            sizes="(max-width: 640px) 64px, 80px"
            className="object-contain"
            priority
          />
        </div>
        
        {/* Headline */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4 px-2">
          Registrasi Sekarang
        </h1>
        
        {/* Registration Image */}
        <div className="w-full max-w-[200px] sm:max-w-[240px] mx-auto my-2 sm:my-4 aspect-square relative">
          <Image
            src="/registration.png"
            alt="Registration"
            fill
            sizes="(max-width: 640px) 240px, 280px"
            className="object-contain"
            priority
          />
        </div>
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              placeholder="Masukkan nama lengkap"
              required
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              placeholder="Masukkan email"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          {/* CTA Button */}
          <div className="w-full pt-2">
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full"
            >
              Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationScene;
