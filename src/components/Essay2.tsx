import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Essay2Props {
  userName: string;
  onBack: () => void;
  onNext: (essay: string) => void;
}

const Essay2: React.FC<Essay2Props> = ({ userName, onBack, onNext }) => {
  const [feedback, setFeedback] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(feedback);
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Notification Bar */}
      <div className={`w-full bg-red-600 text-white p-3 fixed top-0 left-0 right-0 z-20 transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full flex-shrink-0">
              <span className="text-lg">📝</span>
            </div>
            <p className="text-sm font-medium flex-1 text-left">
              Tuliskan motivasi kamu belajar Data Analytics
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-y-auto pt-16 pb-28 px-4">
        <div className="max-w-md mx-auto py-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-6">
            {/* Celebration Image */}
            <div className="w-1/2 mx-auto rounded-xl overflow-hidden">
              <Image 
                src="/essay2.gif" 
                alt="Celebration Animation" 
                width={200} 
                height={120}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <p className="text-base font-medium text-gray-900">
                Selamat! Kamu sudah menyelesaikan semua quiz kamu hari ini! Tapi sebelum kamu pergi, bolehkah kami tau kenapa kamu tertarik belajar Data Analytics?
              </p>
              <p className="text-sm">
                <span className="text-gray-500 italic"><span className="font-semibold">Tulis minimal 150 kata.</span> Penggunaan bahasa Inggris dapat menjadi nilai tambah.</span>
              </p>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tulis disini..."
                  value={feedback}
                  onChange={handleInputChange}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {feedback.trim() ? feedback.trim().split(/\s+/).filter(Boolean).length : 0} words
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFDE3D] p-4">
        <div className="max-w-md mx-auto flex justify-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!feedback.trim()}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium text-base transition-all w-full max-w-full shadow-sm ${
              feedback.trim()
                ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Submit!</span>
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Essay2;
