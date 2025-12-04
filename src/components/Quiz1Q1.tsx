'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type Question = {
  id: string;
  prompt: string;
  context: string;
  options: { id: string; label: string; description: string }[];
};

const QUESTION_ID = "logical-1";

const questions: Question[] = [
  {
    id: QUESTION_ID,
    prompt: "Pilihlah pernyataan yang benar (kamu boleh memilih lebih dari 1)",
    context:
      "Seorang manajer di RevoU memiliki dua anak. Seorang manajer di RevoU memiliki lima anak. Tidak ada orang lain di RevoU yang memiliki dua anak.",
    options: [
      {
        id: "a",
        label: "a.",
        description: "Hanya satu pekerja di RevoU yang persisnya memiliki dua anak.",
      },
      {
        id: "b",
        label: "b.",
        description: "Semua pekerja di RevoU masing-masing memiliki dua anak.",
      },
      {
        id: "c",
        label: "c.",
        description: "Semua orang di RevoU memiliki anak.",
      },
      {
        id: "d",
        label: "d.",
        description: "Beberapa orang di RevoU memiliki lebih dari dua anak.",
      },
      {
        id: "e",
        label: "e.",
        description: "Tak satu pun dari opsi-opsi ini benar.",
      },
    ],
  },
];

interface Quiz1Q1Props {
  onBack: () => void;
  onComplete: () => void;
  onAnswer: (questionId: string, selectedOptions: string[]) => void;
}

const Quiz1Q1: React.FC<Quiz1Q1Props> = ({ onBack, onComplete, onAnswer }) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleAnswer = (optionId: string) => {
    if (isSubmitting) return;
    
    setAnswers((prev) => {
      const current = new Set(prev[QUESTION_ID] ?? []);
      if (current.has(optionId)) {
        current.delete(optionId);
      } else {
        current.add(optionId);
      }

      return {
        ...prev,
        [QUESTION_ID]: Array.from(current),
      };
    });
  };

  const handleNext = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const selectedOptions = answers[QUESTION_ID] || [];
    
    // Notify parent component about the answer
    onAnswer(QUESTION_ID, selectedOptions);
    
    // Move to the next question
    onComplete();
  };

  const hasAnswered = Object.values(answers).some(arr => arr.length > 0);

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
              Tanpa menyelesaikan apa pun, pilihlah kesimpulan yang paling logis berdasarkan pernyataan yang diberikan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-y-auto pt-16 pb-24 px-4">
        <div className="max-w-md mx-auto py-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          {questions.map((question) => (
            <div key={question.id} className="space-y-4">
              <div className="space-y-2">
                <p className="text-black text-base font-medium">{question.context}</p>
                <p className="text-gray-800 font-medium">{question.prompt}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleAnswer(option.id)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl text-left transition-all duration-200 w-full text-sm shadow-md ${
                      answers[question.id]?.includes(option.id)
                        ? 'ring-2 ring-red-500 bg-red-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-gray-800">
                      <span className="font-medium">{option.label} </span>
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
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
              disabled={!hasAnswered || isSubmitting}
              className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                hasAnswered && !isSubmitting
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Selanjutnya
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full mt-2 text-center text-xs text-gray-600">
            Pertanyaan 1 dari 3
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz1Q1;
