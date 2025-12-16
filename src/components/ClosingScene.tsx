'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { saveAllUserData } from '../utils/supabase';

interface QuizScore {
  score: number;
  total: number;
}

interface ClosingSceneProps {
  userName: string;
  totalScore: number;
  totalQuestions: number;
  quiz1Score: QuizScore;
  quiz2Score: QuizScore;
  quiz3Score: QuizScore;
  onContactAdmission: () => void;
}

const ClosingScene: React.FC<ClosingSceneProps> = ({ 
  userName, 
  totalScore, 
  totalQuestions,
  quiz1Score: initialQuiz1Score,
  quiz2Score: initialQuiz2Score,
  quiz3Score: initialQuiz3Score,
  onContactAdmission 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const hasSavedRef = useRef(false);
  const [scores, setScores] = useState<{
    quiz1Score: QuizScore;
    quiz2Score: QuizScore;
    quiz3Score: QuizScore;
  } | null>(null);

  // Save scores to Supabase
  const saveScores = useCallback(async (scoresToSave: { quiz1Score: QuizScore, quiz2Score: QuizScore, quiz3Score: QuizScore }) => {
    if (hasSavedRef.current) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setSaveError('Warning: Your scores could not be saved because your user session was not found.');
        return;
      }

      console.log('Saving final scores to Supabase:', { 
        quiz1: scoresToSave.quiz1Score, 
        quiz2: scoresToSave.quiz2Score, 
        quiz3: scoresToSave.quiz3Score 
      });
      
      const { error } = await saveAllUserData(userId, {
        quiz1Score: scoresToSave.quiz1Score.score,
        quiz2Score: scoresToSave.quiz2Score.score,
        quiz3Score: scoresToSave.quiz3Score.score
      });
      
      if (error) throw error;
      
      console.log('Scores saved successfully to Supabase');
      hasSavedRef.current = true;
    } catch (error) {
      console.error('Failed to save scores:', error);
      setSaveError('Failed to save your scores. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Set initial scores and save them when component mounts
  useEffect(() => {
    if (initialQuiz1Score && initialQuiz2Score && initialQuiz3Score && !scores) {
      const finalScores = {
        quiz1Score: initialQuiz1Score,
        quiz2Score: initialQuiz2Score,
        quiz3Score: initialQuiz3Score
      };
      
      console.log('Received initial scores in ClosingScene:', finalScores);
      
      // Set the scores in state
      setScores(finalScores);
      
      // Save the scores immediately
      saveScores(finalScores);
    }
  }, [initialQuiz1Score, initialQuiz2Score, initialQuiz3Score, scores, saveScores]);

  // Save scores only once when we have the final scores
  useEffect(() => {
    const saveScores = async () => {
      if (!scores || hasSavedRef.current) return;
      
      setIsSaving(true);
      setSaveError(null);
      
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setSaveError('Warning: Your scores could not be saved because your user session was not found.');
          return;
        }

        console.log('Saving final scores to Supabase:', { 
          quiz1: scores.quiz1Score.score, 
          quiz2: scores.quiz2Score.score, 
          quiz3: scores.quiz3Score.score 
        });
        
        const { error } = await saveAllUserData(userId, {
          quiz1Score: scores.quiz1Score.score,
          quiz2Score: scores.quiz2Score.score,
          quiz3Score: scores.quiz3Score.score
        });
        
        if (error) throw error;
        
        console.log('Scores saved successfully to Supabase');
        hasSavedRef.current = true;
      } catch (error) {
        console.error('Failed to save scores:', error);
        setSaveError('Failed to save your scores. Please try again.');
      } finally {
        setIsSaving(false);
      }
    };

    saveScores();
  }, [scores]);

  // Use the scores from state or fallback to props
  const { quiz1Score, quiz2Score, quiz3Score } = scores || {
    quiz1Score: initialQuiz1Score,
    quiz2Score: initialQuiz2Score,
    quiz3Score: initialQuiz3Score
  };

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
    message = 'COBA LAGI!';
    messageColor = 'text-red-500';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        <h1 className={`text-4xl font-bold mb-6 text-center ${messageColor}`}>{message}</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          {userName}, Anda telah menyelesaikan semua kuis dengan total skor {totalScore} dari {totalQuestions} pertanyaan.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 text-center">Kuis 1</h3>
            <p className="text-2xl font-bold text-center">
              {quiz1Score.score} / {quiz1Score.total}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 text-center">Kuis 2</h3>
            <p className="text-2xl font-bold text-center">
              {quiz2Score.score} / {quiz2Score.total}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 text-center">Kuis 3</h3>
            <p className="text-2xl font-bold text-center">
              {quiz3Score.score} / {quiz3Score.total}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-gray-600">Total Score:</div>
              <div className="font-medium text-2xl">{totalScore}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">Nilai:</div>
              <div className="font-medium text-2xl">{scorePercentage}%</div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>
          
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Detail Nilai Per Kategori:</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Logical Thinking</span>
                <span className="text-sm font-medium">{quiz1Score.score}/{quiz1Score.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(quiz1Score.score / quiz1Score.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Numerical Ability</span>
                <span className="text-sm font-medium">{quiz2Score.score}/{quiz2Score.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(quiz2Score.score / quiz2Score.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Data Interpretation</span>
                <span className="text-sm font-medium">{quiz3Score.score}/{quiz3Score.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(quiz3Score.score / quiz3Score.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="mb-4 text-blue-600 text-center">Menyimpan skor Anda...</div>
        )}
        {saveError && (
          <div className="mb-4 text-red-600 text-center">{saveError}</div>
        )}

        <a
          href="https://wa.me/6281399100086"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 text-center"
        >
          HUBUNGI ADMISSION COUNSELOR
        </a>
      </div>
    </div>
  );
};

export default ClosingScene;
