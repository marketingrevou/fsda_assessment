import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PreQuiz2SceneProps {
  onBack: () => void;
  onNext: (selectedOption: string | null) => void;
}

const PreQuiz2Scene: React.FC<PreQuiz2SceneProps> = ({ onBack, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (optionId: string) => {
    if (isSubmitting) return;
    
    setSelectedOption(optionId);
    setIsSubmitting(true);
    
    if (optionId === 'c') {
      setShowPopup('correct');
    } else {
      setShowPopup('wrong');
      setTimeout(() => {
        setShowPopup('none');
        setIsSubmitting(false);
        setSelectedOption(null);
      }, 2000);
    }
  };

  const handleNext = () => {
    if (selectedOption === 'c') {
      onNext(selectedOption);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Notification Bar */}
      <div className={`w-full bg-red-600 text-white p-3 fixed top-0 left-0 right-0 z-20 transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-1.5 rounded-full flex-shrink-0">
              <span className="text-lg">🖐️</span>
            </div>
            <p className="text-sm font-medium flex-1 text-left">
              Silakan baca pertanyaan -pertanyaan berikut ini dan pilihlah jawaban yang tepat.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-center p-4 pt-20 pb-32">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="space-y-4">
            <div className="space-y-4">
              <p className="text-gray-800 text-base text-left font-medium">
                Dengan SQL, jika Kamu ingin memilih semua kolom, kamu dapat menggunakan simbol * untuk menggantikan [Column Name]
              </p>
              <p className="text-gray-800 text-base text-left font-medium">
                Bagaimana Kamu memilih semua kolom dari tabel bernama "Persons"?
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {[
              { id: 'a', text: 'SELECT *.Persons FROM Persons' },
              { id: 'b', text: 'SELECT [All Columns] FROM Persons' },
              { id: 'c', text: 'SELECT * FROM Persons' },
              { id: 'd', text: 'Tak satu pun dari opsi-opsi ini benar' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={isSubmitting}
                className={`p-4 rounded-xl text-left transition-all duration-200 w-full text-sm shadow-md ${
                  selectedOption === option.id
                    ? option.id === 'c'
                      ? 'ring-2 ring-green-500 bg-green-50'
                      : 'ring-2 ring-red-500 bg-red-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${isSubmitting && selectedOption !== option.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-medium text-gray-800">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFDE3D] z-10">
        <div className="w-full max-w-md mx-auto p-3">
          <div className="flex flex-row gap-4 w-full">
            <button 
              onClick={onBack}
              className="h-12 w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNext}
              disabled={selectedOption !== 'c'}
              className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                selectedOption === 'c' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Selanjutnya
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full mt-2 text-center text-xs text-gray-600">
            Pertanyaan 2 dari 3
          </div>
        </div>
      </div>

      {/* Popup for correct answer */}
      {showPopup === 'correct' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <span className="text-6xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tepat Sekali!</h3>
              <p className="text-gray-600 mb-6">
                Dalam SQL simbol * digunakan untuk memilih semua kolom dari sebuah tabel, dan penulisan yang tepat adalah SELECT * FROM Persons tanpa tambahan karakter atau nama lain setelah tanda bintang
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Selanjutnya <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup === 'wrong' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <span className="text-6xl">🤔</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Coba Lagi!</h3>
              <p className="text-gray-600 mb-6">
                Jawabanmu belum tepat. Ingat, kita sedang mencari cara untuk memilih SEMUA kolom dari tabel menggunakan wildcard (*).
              </p>
              <button
                onClick={() => setShowPopup('none')}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full font-bold transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreQuiz2Scene;
