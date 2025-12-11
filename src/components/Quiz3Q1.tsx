'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Chart data
const chartData = {
  labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
  datasets: [
    {
      label: 'Germany',
      data: [1200, 1400, 1400, 1500],
      borderColor: '#FF6384',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.3,
    },
    {
      label: 'United Kingdom',
      data: [1000, 1100, 1300, 1400],
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      tension: 0.3,
    },
    {
      label: 'France',
      data: [700, 900, 1000, 900],
      borderColor: '#FFCE56',
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Italy',
      data: [800, 600, 600, 700],
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Netherlands',
      data: [500, 600, 600, 700],
      borderColor: '#9966FF',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      tension: 0.3,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        padding: 10,
        font: {
          size: 10
        }
      }
    },
    title: {
      display: true,
      text: 'Computer Imports by Country (Million Euros)',
      font: {
        size: 12
      },
      padding: {
        bottom: 5
      }
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Million Euros',
        font: {
          size: 10
        }
      },
      min: 400,
      max: 1600,
      ticks: {
        stepSize: 200,
        font: {
          size: 9
        },
        padding: 2
      },
      grid: {
        display: true,
        drawBorder: false,
        drawOnChartArea: true,
        drawTicks: true
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
        drawOnChartArea: true,
        drawTicks: true
      },
      ticks: {
        font: {
          size: 10
        }
      }
    }
  },
  elements: {
    point: {
      radius: 2,
      hoverRadius: 4
    },
    line: {
      borderWidth: 1.5
    }
  }
};

type Question = {
  id: string;
  prompt: string;
  context: string;
  options: { id: string; label: string; description: string }[];
};

const QUESTION_ID = "data-interpretation-1";

const questions: Question[] = [
  {
    id: QUESTION_ID,
    prompt: "",
    context:
      "Di Tahun ke-3, berapa selisih yang dikeluarkan oleh Jerman untuk mengimpor komputer dibanding Belanda?",
    options: [
      {
        id: "a",
        label: "a.",
        description: "650",
      },
      {
        id: "b",
        label: "b.",
        description: "700",
      },
      {
        id: "c",
        label: "c.",
        description: "750",
      },
      {
        id: "d",
        label: "d.",
        description: "800",
      },
      {
        id: "e",
        label: "e.",
        description: "Tak satu pun dari opsi-opsi ini benar",
      },
    ],
  },
];

interface Quiz3Q1Props {
  onBack: () => void;
  onComplete: () => void;
  onAnswer: (questionId: string, selectedOptions: string[]) => void;
}

const Quiz3Q1: React.FC<Quiz3Q1Props> = ({ onBack, onComplete, onAnswer }) => {
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
      // If the same option is clicked again, deselect it
      const newAnswer = prev[QUESTION_ID]?.[0] === optionId ? [] : [optionId];

      return {
        ...prev,
        [QUESTION_ID]: newAnswer,
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

  const hasAnswered = answers[QUESTION_ID]?.length > 0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-auto">
      {/* Notification Bar */}
      <div className={`w-full bg-red-600 text-white p-3 fixed top-0 left-0 right-0 z-20 transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-1.5 rounded-full flex-shrink-0">
              <span className="text-lg">📊</span>
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
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            {/* Chart inside question card */}
            <div className="mb-6 -mx-2">
              <div className="h-48 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            
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
            Pertanyaan 1 dari 4
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz3Q1;
