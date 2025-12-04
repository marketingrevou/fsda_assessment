'use client';

import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  datasets: [
    {
      label: 'Wilayah Utara',
      data: [230000, 290000, 340000, 430000, 520000, 540000],
      backgroundColor: '#FFA500',
      barPercentage: 0.6,
      categoryPercentage: 0.8,
    },
    {
      label: 'Wilayah Selatan',
      data: [120000, 210000, 380000, 320000, 240000, 250000],
      backgroundColor: '#FFD700',
      barPercentage: 0.6,
      categoryPercentage: 0.8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  transitions: {},
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        boxWidth: 12,
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 12,
        weight: 'bold' as const
      },
      bodyFont: {
        size: 12
      },
      padding: 10,
      cornerRadius: 4,
      displayColors: true,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#E5E7EB'
      },
      ticks: {
        max: 600000,
        stepSize: 100000,
        callback: function(value: any) {
          return (value / 1000) + 'K';
        },
        font: {
          size: 10
        }
      }
    }
  }
};

type Question = {
  id: string;
  prompt: string;
  context: string;
  options: { id: string; label: string; description: string }[];
};

const QUESTION_ID = "data-interpretation-3";

const questions: Question[] = [
  {
    id: QUESTION_ID,
    prompt: "Silakan baca grafik di atas. Grafik Ini mewakili grafik penjualan perusahaan di dua wilayah, Utara dan Selatan. Pernyataan manakah yang sesuai dengan penarikan kesimpulan dari grafik tersebut yang benar?",
    context: "Pilih semua pernyataan yang benar (kamu bisa pilih lebih dari 1 jawaban)",
    options: [
      {
        id: "a",
        label: "a.",
        description: "Wilayah utara menghasilkan laba setelah pajak yang lebih tinggi dibandingkan dengan wilayah selatan",
      },
      {
        id: "b",
        label: "b.",
        description: "Lebih banyak barang terjual di wilayah utara daripada selatan selama enam bulan",
      },
      {
        id: "c",
        label: "c.",
        description: "Januari adalah bulan dengan penjualan terbanyak",
      },
      {
        id: "d",
        label: "d.",
        description: "Penjualan umumnya menurun dalam enam bulan yang ditampilkan",
      },
      {
        id: "e",
        label: "e.",
        description: "Jumlah rata-rata barang yang terjual per bulan lebih rendah di selatan",
      },
    ],
  },
];

interface Quiz3Q3Props {
  onBack: () => void;
  onComplete: () => void;
  onAnswer: (questionId: string, selectedOptions: string[]) => void;
}

const Quiz3Q3: React.FC<Quiz3Q3Props> = ({ onBack, onComplete, onAnswer }) => {
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

  const hasAnswered = answers[QUESTION_ID]?.length > 0;

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="h-64 w-full mb-6">
              <Bar data={chartData} options={chartOptions} />
            </div>
          {questions.map((question) => (
            <div key={question.id} className="space-y-4">
              <div className="space-y-2">
                <div className="text-black text-base font-medium">{question.prompt}</div>
                <div className="text-gray-800 italic">{question.context}</div>
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

export default Quiz3Q3;
