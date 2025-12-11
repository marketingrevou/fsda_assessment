'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type Question = {
  id: string;
  prompt: string;
  context: string | React.ReactNode;
  options: { id: string; label: string; description: string }[];
};

const QUESTION_ID = "numerical-3";

const questions: Question[] = [
  {
    id: QUESTION_ID,
    prompt: "",
    context: (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="border-2 border-yellow-500 rounded-md overflow-hidden pb-0">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="border border-yellow-500 px-2 py-1 text-left text-sm font-medium">Month</th>
                  <th className="border border-yellow-500 px-2 py-1 text-right text-sm font-medium">Jan '28</th>
                  <th className="border border-yellow-500 px-2 py-1 text-right text-sm font-medium">Feb '28</th>
                  <th className="border border-yellow-500 px-2 py-1 text-right text-sm font-medium">Mar '28</th>
                  <th className="border border-yellow-500 px-2 py-1 text-right text-sm font-medium">Apr '28</th>
                  <th className="border border-yellow-500 px-2 py-1 text-right text-sm font-medium">Mei '28</th>
                  <th className="border border-yellow-500 px-2 py-1 text-right text-sm font-medium">Jun '28</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-yellow-500 px-2 py-1 text-sm font-medium text-gray-900 bg-gray-50">
                    Active Users
                  </td>
                  <td className="border border-yellow-500 px-2 py-1 text-sm text-gray-900 text-right">100</td>
                  <td className="border border-yellow-500 px-2 py-1 text-sm text-gray-900 text-right">110</td>
                  <td className="border border-yellow-500 px-2 py-1 text-sm text-gray-900 text-right">150</td>
                  <td className="border border-yellow-500 px-2 py-1 text-sm text-gray-900 text-right">190</td>
                  <td className="border border-yellow-500 px-2 py-1 text-sm text-gray-900 text-right">201</td>
                  <td className="border border-yellow-500 px-2 py-1 text-sm text-gray-900 text-right">248</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center py-1 bg-white">
            <img 
              src="/Quiz2Q3_2.png" 
              alt="CMGR = (Last Month / First Month)^(1 / # of Months Difference) - 1"
              className="h-24 w-auto"
              style={{ maxWidth: '100%' }}
            />
          </div>
        </div>
        <p className="text-gray-800">
          Berapa Tingkat Pertumbuhan Bulanan Majemuk (Compound Monthly Growth Rate) dari Startup X?
        </p>
      </div>
    ),
    options: [
      {
        id: "a",
        label: "a.",
        description: "20%",
      },
      {
        id: "b",
        label: "b.",
        description: "15%",
      },
      {
        id: "c",
        label: "c.",
        description: "12%",
      },
      {
        id: "d",
        label: "d.",
        description: "9%",
      },
      {
        id: "e",
        label: "e.",
        description: "Tak satu pun dari opsi-opsi ini benar.",
      },
    ],
  },
];

interface Quiz2Q3Props {
  onBack: () => void;
  onComplete: () => void;
  onAnswer: (questionId: string, selectedOptions: string[]) => void;
}

const Quiz2Q3: React.FC<Quiz2Q3Props> = ({ onBack, onComplete, onAnswer }) => {
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
    
    setAnswers((prev) => ({
      ...prev,
      [QUESTION_ID]: [optionId],
    }));
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
              <span className="text-lg">🧮</span>
            </div>
            <p className="text-sm font-medium flex-1 text-left">
              Pilihlah jawaban yang paling tepat dari pertanyaan-pertanyaan berikut.
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
              <div className="space-y-4">
                <div className="text-black text-base">{question.context}</div>
                {question.prompt && <p className="text-gray-800 font-medium">{question.prompt}</p>}
              </div>
              
              <div className="flex flex-col gap-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleAnswer(option.id)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl text-left transition-all duration-200 w-full text-sm shadow-md ${
                      answers[QUESTION_ID]?.includes(option.id)
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
            Pertanyaan 3 dari 5
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz2Q3;
