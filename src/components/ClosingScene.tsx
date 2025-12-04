'use client';

import { useRouter } from 'next/navigation';

interface ClosingSceneProps {
  userName: string;
  totalScore: number;
  totalQuestions: number;
  onContactAdmission: () => void;
}

const ClosingScene: React.FC<ClosingSceneProps> = ({ 
  userName, 
  totalScore, 
  totalQuestions,
  onContactAdmission 
}) => {
  const scorePercentage = Math.round((totalScore / totalQuestions) * 100);
  let message = '';
  let messageColor = '';

  if (scorePercentage >= 80) {
    message = 'SELAMAT!';
    messageColor = 'text-green-600';
  } else if (scorePercentage >= 50) {
    message = 'KERJA BAGUS!';
    messageColor = 'text-yellow-500';
  } else {
    message = 'TERIMA KASIH TELAH BERUSAHA!';
    messageColor = 'text-red-500';
  }

  return (
    <div className="min-h-screen bg-[#FFDE3D] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white text-center py-6">
          <h1 className="text-2xl font-bold">HASIL ASSESSMENT</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-2">Halo, {userName}!</p>
          <p className="text-gray-600 mb-8">Berikut adalah hasil assessment yang telah kamu kerjakan:</p>

          {/* Score Display */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-bold">{totalScore}</span>
                  <span className="text-2xl text-gray-500">/{totalQuestions}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className={`text-2xl font-bold mb-8 ${messageColor}`}>
            {message}
          </div>

          {/* Score Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="text-gray-600">Total Pertanyaan:</div>
              <div className="font-medium text-right">{totalQuestions}</div>
              
              <div className="text-gray-600">Jawaban Benar:</div>
              <div className="font-medium text-right">{totalScore}</div>
              
              <div className="text-gray-600">Nilai:</div>
              <div className="font-medium text-right">{scorePercentage}%</div>
            </div>
          </div>

          {/* Contact Button */}
          <button
            onClick={onContactAdmission}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition duration-200"
          >
            HUBUNGI ADMISSION COUNSELOR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClosingScene;
