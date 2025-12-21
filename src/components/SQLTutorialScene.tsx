import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

interface SQLTutorialSceneProps {
  onBack: () => void;
  onNext: () => void;
  userName?: string;
}

const SQLTutorialScene: React.FC<SQLTutorialSceneProps> = ({ onBack, onNext, userName = 'Sobat' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      character: '👋',
      title: `Selamat datang ${userName}!`,
      message: 'Sebelum kita mulai, mari berlatih singkat tentang SQL yuk!',
      showInput: false
    },
    {
      character: '📚',
      title: 'Apa itu SQL?',
      message: 'SQL (Structured Query Language) adalah bahasa pemrograman khusus yang digunakan untuk mengelola dan memanipulasi database. Dengan SQL, kita bisa mengambil, menambah, mengubah, dan menghapus data dengan mudah!',
      showInput: false
    },
    {
      character: '⌨️',
      title: 'Mari Mencoba!',
      message: 'Nah, coba ketik command berikut:',
      example: 'SELECT * FROM Training',
      showInput: true,
      correctAnswer: 'SELECT * FROM Training',
      showTable: true,
      tableData: [
        { Nama: 'Budi Santoso', 'Nomor HP': '08123456789', Email: 'budi@example.com', Umur: 25, 'Tanggal Lahir': '1998-05-15' },
        { Nama: 'Ani Lestari', 'Nomor HP': '08234567890', Email: 'ani@example.com', Umur: 28, 'Tanggal Lahir': '1995-10-22' }
      ]
    },
    {
      character: '💡',
      title: 'Penjelasan',
      message: 'Perintah `SELECT * FROM Training` akan menampilkan SEMUA kolom dari tabel Training. Tanda bintang (*) artinya "semua kolom".',
      showInput: false
    },
    {
      character: '🎯',
      title: 'Mari Berlatih Lagi!',
      message: 'Sekarang coba ambil hanya kolom Nama dan Nomor HP:',
      example: 'SELECT Nama, `Nomor HP` FROM Training',
      showInput: true,
      correctAnswer: 'SELECT Nama, `Nomor HP` FROM Training',
      showTable: true,
      tableData: [
        { Nama: 'Budi Santoso', 'Nomor HP': '08123456789' },
        { Nama: 'Ani Lestari', 'Nomor HP': '08234567890' }
      ]
    },
    {
      character: '🎉',
      title: 'Hebat!',
      message: 'Selamat! Kamu sudah belajar dasar-dasar SQL! Sekarang mari kita lanjut ke assessment-nya!',
      showInput: false
    }
  ];

  const currentStepData = steps[Math.min(currentStep, steps.length - 1)];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setShowHint(false);
  };

  const handleCheckAnswer = () => {
    if (currentStepData.showInput && currentStepData.correctAnswer) {
      const isAnswerCorrect = userInput.trim().toUpperCase() === currentStepData.correctAnswer.toUpperCase();
      setIsCorrect(isAnswerCorrect);
      setShowHint(!isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setShowTable(true);
        // Don't auto-advance, let the user click Next
      } else if (!isCorrect) {
        // Only show hint if the answer was wrong
        setShowHint(true);
      }
    } else if (!currentStepData.showInput) {
      // If there's no input required, just go to next step
      setCurrentStep(prev => prev + 1);
      setUserInput('');
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setUserInput('');
      setShowHint(false);
      setShowTable(false);
    } else {
      onNext();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentStepData.showInput) {
        handleCheckAnswer();
      } else {
        handleNext();
      }
    }
  };

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const headers = Object.keys(data[0]);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Define column classes based on header
    const getColumnClass = (header: string) => {
      const baseClass = 'px-2 py-2 border-b border-gray-100 break-words';
      if (isMobile) {
        if (header === 'Nama') return `${baseClass} w-[25%]`;
        if (header === 'Nomor HP') return `${baseClass} w-[25%]`;
        if (header === 'Email') return `${baseClass} w-[30%]`;
        if (header === 'Umur') return `${baseClass} w-[10%]`;
        if (header === 'Tanggal Lahir') return `${baseClass} w-[20%]`;
      }
      return `${baseClass} px-4`;
    };
    
    // Format cell content for mobile
    const formatCellContent = (header: string, content: any) => {
      const strContent = String(content);
      if (!isMobile) return strContent;
      
      if (header === 'Nama') return strContent.length > 10 ? `${strContent.substring(0, 8)}...` : strContent;
      if (header === 'Nomor HP') return strContent.length > 8 ? `${strContent.substring(0, 8)}...` : strContent;
      if (header === 'Email') return strContent.length > 10 ? `${strContent.substring(0, 10)}...` : strContent;
      if (header === 'Umur') return strContent;
      if (header === 'Tanggal Lahir') return strContent;
      
      return strContent.length > 15 ? `${strContent.substring(0, 12)}...` : strContent;
    };
    
    return (
      <div className="mt-4 w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto -mx-1">
          <div className="min-w-max w-full">
            <table className="w-full text-xs md:text-sm text-gray-900">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {headers.map((header) => (
                    <th 
                      key={header} 
                      className={`${getColumnClass(header)} text-left font-medium text-gray-700 whitespace-nowrap`}
                    >
                      {isMobile && header.length > 8 ? `${header.substring(0, 6)}...` : header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {headers.map((header, cellIndex) => (
                      <td 
                        key={`${rowIndex}-${cellIndex}`} 
                        className={`${getColumnClass(header)} text-gray-900`}
                        title={String(row[header])}
                      >
                        {formatCellContent(header, row[header])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-1.5 text-xs text-gray-500 whitespace-nowrap">
          {data.length} baris ditampilkan
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      <div className={`flex-1 flex flex-col items-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} overflow-y-auto`}>
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col items-center text-center space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-5xl mb-3">
              {currentStepData.character}
            </div>
            
            <div className="w-full space-y-4">
              {currentStepData.title && (
                <h3 className="text-xl font-bold text-gray-800">
                  {currentStepData.title}
                </h3>
              )}
              
              <p className="text-gray-700">
                {currentStepData.message}
              </p>
              
              {currentStepData.example && (
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                  {currentStepData.example}
                </div>
              )}
              
              {currentStepData.showInput && (
                <div className="mt-3 md:mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className={`w-full p-3 text-sm md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-gray-900 ${
                        showHint ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ketik perintah SQL..."
                      autoFocus
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      onClick={handleCheckAnswer}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
                      disabled={!userInput.trim()}
                      aria-label="Periksa jawaban"
                    >
                      <FaCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                  {showHint && currentStepData.correctAnswer && (
                    <div className="mt-1.5">
                      <p className="text-red-500 text-xs md:text-sm">
                        Coba ketik: 
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">
                          {currentStepData.correctAnswer}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {showTable && currentStepData.tableData && (
                <div className="w-full mt-2">
                  {renderTable(currentStepData.tableData)}
                </div>
              )}
              
              {isCorrect && (
                <div className="h-0"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#FFDE3D] z-10 border-t border-yellow-400 shadow-lg">
        <div className="w-full max-w-md mx-auto p-4">
          <div className="flex flex-row gap-3 w-full">
            <button 
              onClick={onBack}
              className="h-14 w-14 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold rounded-xl transition flex items-center justify-center flex-none shadow-sm"
              aria-label="Kembali"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={isCorrect ? handleNext : handleCheckAnswer}
              disabled={currentStepData.showInput && !isCorrect && !userInput.trim()}
              className={`flex-1 h-14 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base ${
                (currentStepData.showInput && !isCorrect) || !currentStepData.showInput || isCorrect
                  ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                  : 'bg-gray-400 cursor-not-allowed opacity-75'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Mulai Kuis' : 'Lanjut'}
              {!currentStepData.showInput && <FaArrowRight className="w-4 h-4" />}
              {currentStepData.showInput && !isCorrect && <FaCheck className="w-4 h-4" />}
            </button>
          </div>
          <div className="w-full mt-2 text-center text-xs text-gray-600">
            Langkah {currentStep + 1} dari {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLTutorialScene;
