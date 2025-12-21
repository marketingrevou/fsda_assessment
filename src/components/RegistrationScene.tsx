import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import RegistrationPopup from './RegistrationPopup';
import { savePersonalDetails } from '../utils/supabase';

interface RegistrationSceneProps {
  onNext: (name: string, email: string) => void;
}

const RegistrationScene: React.FC<RegistrationSceneProps> = ({ onNext }) => {
  // Add useEffect to log localStorage status on component mount
  useEffect(() => {
    console.log('RegistrationScene mounted');
    if (typeof window !== 'undefined') {
      console.log('localStorage available:', !!window.localStorage);
      console.log('Current localStorage userId:', localStorage.getItem('userId'));
    }
  }, []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Form submitted, calling savePersonalDetails...');
        const { data: userData, error } = await savePersonalDetails(formData.fullName, formData.email);
        
        if (error) {
          console.error('Error saving personal details:', error);
          return;
        }
        
        if (!userData) {
          console.error('No user data returned');
          return;
        }
        
        // Save user ID to localStorage
        if (typeof window !== 'undefined') {
          try {
            console.log('Saving userId to localStorage:', userData.id);
            localStorage.setItem('userId', userData.id);
            console.log('Successfully saved userId to localStorage');
            
            // Verify it was saved
            const savedId = localStorage.getItem('userId');
            console.log('Retrieved userId from localStorage:', savedId);
          } catch (storageError) {
            console.error('Error saving to localStorage:', storageError);
          }
        }
      
      setShowPopup(true);
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Failed to save registration. Please try again.');
    }
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
    
    // Get the userId from localStorage if it wasn't passed in props
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    
    if (!userId) {
      console.error('No userId found in localStorage when closing popup');
    } else {
      console.log('Passing userId to onNext:', userId);
    }
    
    onNext(formData.fullName, formData.email);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-white relative overflow-hidden">
      {showPopup && <RegistrationPopup onClose={handleClosePopup} />}
      {/* Yellow background shape */}
      <div 
        className="absolute inset-0 bg-[#FFDE3D] -z-10"
        style={{
          clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)',
          height: '100%',
          width: '100%',
        }}
      />
      
      <div className="w-full max-w-xs mx-auto text-center flex flex-col items-center justify-start h-full py-4">
        {/* Headline */}
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Registrasi Sekarang
        </h1>
        
        {/* Registration Image */}
        <div className="w-48 h-48 mx-auto my-2 relative">
          <Image
            src="/registration.gif"
            alt="Registration"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3 mt-2">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm text-gray-900 ${errors.fullName ? 'border-red-500' : 'border-gray-300'} border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              style={{ WebkitTextFillColor: '#111827' }}
              placeholder="Masukkan nama lengkap"
              required
            />
            {errors.fullName && <p className="mt-0.5 text-xs text-red-500">{errors.fullName}</p>}
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'} border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              style={{ WebkitTextFillColor: '#111827' }}
              placeholder="Masukkan email"
              required
            />
            {errors.email && <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>}
          </div>
          
          {/* CTA Button */}
          <div className="w-full pt-2 mt-auto">
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full text-base"
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
