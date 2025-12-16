"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { savePersonalDetails, supabase, calculateQuizScore } from '../utils/supabase';

// Dynamically import components with SSR disabled
const WelcomeScene = dynamic(
  () => import('../components/WelcomeScene'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const RegistrationScene = dynamic(
  () => import('../components/RegistrationScene'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const PreQuizCover = dynamic(
  () => import('../components/PreQuizCover'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const SQLTutorialScene = dynamic(
  () => import('../components/SQLTutorialScene'),
  { ssr: false, loading: () => <div>Loading...</div> }
);


const Quiz1Cover = dynamic(
  () => import('../components/Quiz1Cover'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz1CoverPopup = dynamic(
  () => import('../components/Quiz1CoverPopup'),
  { ssr: false }
);

const Quiz1Q1 = dynamic(
  () => import('../components/Quiz1Q1'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz1Q2 = dynamic(
  () => import('../components/Quiz1Q2'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz1Q3 = dynamic(
  () => import('../components/Quiz1Q3'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz1Q4 = dynamic(
  () => import('../components/Quiz1Q4'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz1Q5 = dynamic(
  () => import('../components/Quiz1Q5'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz1CompletePopup = dynamic(
  () => import('../components/Quiz1CompletePopup'),
  { ssr: false }
);

const Quiz2Cover = dynamic(
  () => import('../components/Quiz2Cover'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz2Q1 = dynamic(
  () => import('../components/Quiz2Q1'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz2Q2 = dynamic(
  () => import('../components/Quiz2Q2'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz2Q3 = dynamic(
  () => import('../components/Quiz2Q3'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz2Q4 = dynamic(
  () => import('../components/Quiz2Q4'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz2Q5 = dynamic(
  () => import('../components/Quiz2Q5'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz2CompletePopup = dynamic(
  () => import('../components/Quiz2CompletePopup'),
  { ssr: false }
);

const Quiz3Cover = dynamic(
  () => import('../components/Quiz3Cover'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz3Q1 = dynamic(
  () => import('../components/Quiz3Q1'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz3Q2 = dynamic(
  () => import('../components/Quiz3Q2'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz3Q3 = dynamic(
  () => import('../components/Quiz3Q3'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz3Q4 = dynamic(
  () => import('../components/Quiz3Q4'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Quiz3CompletePopup = dynamic(
  () => import('../components/Quiz3CompletePopup'),
  { ssr: false }
);

const EssayCover = dynamic(
  () => import('../components/EssayCover'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Essay1 = dynamic(
  () => import('../components/Essay1'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const Essay2 = dynamic(
  () => import('../components/Essay2'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const ClosingScene2 = dynamic(
  () => import('../components/ClosingScene2'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

type Scene = 'welcome' | 'registration' | 'preQuiz' | 'sqlTutorial' | 'quiz1Cover' | 'quiz1Q1' | 'quiz1Q2' | 'quiz1Q3' | 'quiz1Q4' | 'quiz1Q5' | 'quiz2Cover' | 'quiz2Q1' | 'quiz2Q2' | 'quiz2Q3' | 'quiz2Q4' | 'quiz2Q5' | 'quiz3Cover' | 'quiz3Q1' | 'quiz3Q2' | 'quiz3Q3' | 'quiz3Q4' | 'essayCover' | 'essay1' | 'essay2' | 'closing';

type QuizAnswer = {
  type: 'quiz';
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  correctAnswer: string;
  timestamp: string;
};

type EssayAnswer = {
  type: 'essay';
  questionId: string;
  answer: string;
  timestamp: string;
};

type UserAnswer = QuizAnswer | EssayAnswer;
type UserAnswers = Record<string, UserAnswer>;

export default function Home() {
  const [currentScene, setCurrentScene] = useState<Scene>('welcome');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  // Quiz state management
  // State for managing quiz completion
  const [showQuiz1CompletePopup, setShowQuiz1CompletePopup] = useState<boolean>(false);
  const [showQuiz2CompletePopup, setShowQuiz2CompletePopup] = useState<boolean>(false);
  const [showQuiz3CompletePopup, setShowQuiz3CompletePopup] = useState<boolean>(false);
  const [showQuiz1Popup, setShowQuiz1Popup] = useState<boolean>(false);

  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [finalScores, setFinalScores] = useState<{
    quiz1Score: { score: number; total: number };
    quiz2Score: { score: number; total: number };
    quiz3Score: { score: number; total: number };
  } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const hasSavedRef = useRef(false);

  // Function to calculate final scores
  const calculateFinalScores = useCallback((answers: UserAnswers) => {
    try {
      console.log('Calculating final scores with answers:', answers);
      
      // Filter and process only quiz answers
      const quizAnswers = Object.values(answers).filter(
        (answer): answer is QuizAnswer => answer.type === 'quiz'
      );

      console.log('Filtered quiz answers:', quizAnswers);

      // Calculate scores for each quiz
      const quiz1Score = quizAnswers
        .filter(a => a.questionId.startsWith('Quiz1Q') && a.isCorrect)
        .length;
      
      const quiz2Score = quizAnswers
        .filter(a => a.questionId.startsWith('Quiz2Q') && a.isCorrect)
        .length;
      
      const quiz3Score = quizAnswers
        .filter(a => a.questionId.startsWith('Quiz3Q') && a.isCorrect)
        .length;

      console.log('Calculated scores:', { quiz1Score, quiz2Score, quiz3Score });

      // Save scores to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('quiz1Score', quiz1Score.toString());
        localStorage.setItem('quiz2Score', quiz2Score.toString());
        localStorage.setItem('quiz3Score', quiz3Score.toString());
        console.log('Scores saved to localStorage:', { quiz1Score, quiz2Score, quiz3Score });
      }

      // Calculate total score
      const total = quiz1Score + quiz2Score + quiz3Score;
      
      // Update the total score state
      setTotalScore(total);

      // Set the final scores
      const newScores = {
        quiz1Score: { score: quiz1Score, total: 5 }, // 5 questions in quiz 1
        quiz2Score: { score: quiz2Score, total: 5 }, // 5 questions in quiz 2
        quiz3Score: { score: quiz3Score, total: 4 }  // 4 questions in quiz 3
      };
      
      setFinalScores(newScores);
      
      console.log('Final scores calculated and state updated:', {
        ...newScores,
        totalScore: total
      });
      
      return newScores;
    } catch (error) {
      console.error('Error calculating final scores:', error);
      return null;
    }
  }, []);

  const handleWelcomeNext = () => {
    setCurrentScene('registration');
  };

  const handleRegistrationNext = async (name: string, email: string) => {
    try {
      // First try to get the user ID from localStorage
      let userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      console.log('handleRegistrationNext - userId from localStorage:', userId);
      
      // If not found in localStorage, try to get it from the database
      if (!userId) {
        console.log('No userId in localStorage, querying database...');
        const { data: user, error } = await supabase
          .from('da_personal_details')
          .select('id')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();
        
        if (user) {
          userId = user.id;
          console.log('Found user in database, ID:', userId);
          // Save to localStorage for future use
          if (typeof window !== 'undefined') {
            localStorage.setItem('userId', userId || '');
            console.log('Saved userId to localStorage in handleRegistrationNext');
          }
        } else {
          console.error('User not found in database');
          // Continue anyway to avoid blocking the user
        }
      }

      setUserId(userId || '');
      setUserName(name);
      setUserEmail(email);
      setCurrentScene('sqlTutorial');
    } catch (error) {
      console.error('Error during registration:', error);
      // Continue to the next scene even if there's an error
      setUserName(name);
      setUserEmail(email);
      setCurrentScene('sqlTutorial');
    }
  };

  const handleSQLTutorialComplete = () => {
    // Navigate directly to Quiz 1 Cover after SQL tutorial
    setCurrentScene('quiz1Cover');
  };

  const handleQuizStart = () => {
    // Navigate to the first quiz question
    setCurrentScene('quiz1Q1');
  };

  const handleQuiz1Start = () => {
    setShowQuiz1Popup(true);
  };

  const handleStartQuiz = () => {
    setShowQuiz1Popup(false);
    setCurrentScene('quiz1Q1');
  };

  const handleQuiz1Q1Complete = () => {
    setCurrentScene('quiz1Q2');
  };

  const handleQuiz1Q2Complete = () => {
    setCurrentScene('quiz1Q3');
  };

  const handleQuiz1Q3Complete = () => {
    setCurrentScene('quiz1Q4');
  };

  const handleQuiz1Q4Complete = () => {
    setCurrentScene('quiz1Q5');
  };

  // Handle Quiz1Q5 completion - moved the implementation to the second declaration

  // Handle continuing after the completion popup is closed
  const handleQuiz1CompleteContinue = useCallback((): void => {
    setShowQuiz1CompletePopup(false);
    // Navigate to Quiz 2 Cover
    setCurrentScene('quiz2Cover');
  }, []);

  // Handle Quiz 2 navigation
  const handleQuiz2Start = () => {
    setCurrentScene('quiz2Q1');
  };

  const handleQuiz2Q1Complete = () => {
    setCurrentScene('quiz2Q2');
  };

  const handleQuiz2Q2Complete = () => {
    // Navigate to Quiz 2 Q3
    setCurrentScene('quiz2Q3');
  };

  const handleQuiz2Q3Complete = () => {
    setCurrentScene('quiz2Q4');
  };

  const handleQuiz2Q4Complete = () => {
    setCurrentScene('quiz2Q5');
  };

  // Handle Quiz2Q5 completion - moved the implementation to the second declaration

  const handleQuiz2CompleteContinue = useCallback((): void => {
    setShowQuiz2CompletePopup(false);
    setCurrentScene('quiz3Cover');
  }, []);

  const handleQuiz3Start = () => {
    setCurrentScene('quiz3Q1');
  };

  const handleQuiz3Q1Complete = () => {
    setCurrentScene('quiz3Q2');
  };

  const handleQuiz3Q2Complete = () => {
    setCurrentScene('quiz3Q3');
  };

  const handleQuiz3Q3Complete = () => {
    setCurrentScene('quiz3Q4');
  };

  // Define correct answers for each question
  const correctAnswers: { [key: string]: string } = {
    'Quiz1Q1': 'a',        // Hanya satu pekerja di RevoU yang persisnya memiliki dua anak.
    'Quiz1Q2': 'd',        // 60% karyawan pria & wanita tinggal di luar Jabodetabek
    'Quiz1Q3': 'd',        // Kesimpulan I dan II tidak benar
    'Quiz1Q4': 'a',        // Benar
    'Quiz1Q5': 'e',        // II sendiri saja cukup sedangkan I saja tidak cukup untuk menjawab
    'Quiz2Q1': 'd',        // 55.31
    'Quiz2Q2': 'b',        // 24%
    'Quiz2Q3': 'a',        // 20%
    'Quiz2Q4': 'a',        // 2.6
    'Quiz2Q5': 'c',        // 43
    'Quiz3Q1': 'd',        // 800
    'Quiz3Q2': 'b',        // Kasus rata-rata harian tertinggi lebih dari 200 terjadi pada 16 April 2020
    'Quiz3Q3': 'b',        // Lebih banyak barang terjual di wilayah utara daripada selatan selama enam bulan
    'Quiz3Q4': 'a',        // Semua tanggal harus diubah ke format yang sama DD/MM/YY
  };

  const calculateQuizScore = useCallback((quizNumber: number, answers: Record<string, any>) => {
    console.log(`\n=== Calculating Quiz ${quizNumber} Score ===`);
    console.log('All answers:', answers);
    
    // Get all answers for this quiz
    const quizAnswers = Object.entries(answers).filter(([key, value]) => {
      // Check if the key matches the quiz pattern or if the value has a matching questionId
      const keyMatch = key.startsWith(`Quiz${quizNumber}Q`) || 
                      key.startsWith(`quiz${quizNumber}Q`) ||
                      key.startsWith(`logical-`) || 
                      key.startsWith(`data-`) ||
                      key.startsWith(`sql-`);
      
      const questionIdMatch = value?.questionId && 
                            (value.questionId.startsWith(`Quiz${quizNumber}Q`) || 
                             value.questionId.startsWith(`quiz${quizNumber}Q`));
      
      const shouldInclude = (keyMatch || questionIdMatch) && value && value.isCorrect !== undefined;
      
      if (shouldInclude) {
        console.log(`Including answer for ${key}:`, value);
      }
      
      return shouldInclude;
    });
    
    console.log(`\nQuiz ${quizNumber} filtered answers:`, quizAnswers);
    
    const score = quizAnswers.reduce((count, [key, answer]) => {
      const questionId = answer.questionId || key;
      const correctAnswer = correctAnswers[questionId] || correctAnswers[`Quiz${quizNumber}Q${key.split('Q')[1]?.split('_')[0]}`];
      
      // Check if the answer is correct
      let isCorrect = answer.isCorrect;
      
      if (isCorrect === undefined && correctAnswer) {
        isCorrect = answer.selectedOptions && answer.selectedOptions.some((option: string) => 
          option && correctAnswer && 
          option.toString().trim().toLowerCase() === correctAnswer.toString().toLowerCase()
        );
      }
      
      console.log(`\nQuestion ${questionId}:`);
      console.log('- Selected:', answer.selectedOptions);
      console.log('- Correct Answer:', correctAnswer || 'N/A');
      console.log('- Is Correct:', isCorrect ? '✅' : '❌');
      
      return count + (isCorrect ? 1 : 0);
    }, 0);
    
    const total = quizNumber === 3 ? 4 : 5; // Quiz 3 has 4 questions, others have 5
    console.log(`\n=== Quiz ${quizNumber} Score: ${score}/${total} ===`);
    return { score, total };
  }, [correctAnswers]);

  // Map of component names to their corresponding question IDs in the correctAnswers object
  const questionIdMap: { [key: string]: string } = {
    // Quiz 1 - Logical Thinking
    'logical-1': 'Quiz1Q1',
    'logical-2': 'Quiz1Q2',
    'logical-3': 'Quiz1Q3',
    'logical-4': 'Quiz1Q4',
    'logical-5': 'Quiz1Q5',
    // Quiz 2 - Numerical Ability
    'numerical-1': 'Quiz2Q1',
    'numerical-2': 'Quiz2Q2',
    'numerical-3': 'Quiz2Q3',
    'numerical-4': 'Quiz2Q4',
    'numerical-5': 'Quiz2Q5',
    // Quiz 3 - Data Interpretation
    'data-interpretation-1': 'Quiz3Q1',
    'data-interpretation-2': 'Quiz3Q2',
    'data-interpretation-3': 'Quiz3Q3',
    'data-interpretation-4': 'Quiz3Q4',
  };


  const handleAnswer = (componentName: string, selectedOptions: string | string[]) => {
    // Ensure selectedOptions is always an array
    const optionsArray = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
    
    // Map the component name to the correct question ID
    const questionId = questionIdMap[componentName] || componentName;
    const correctAnswer = correctAnswers[questionId];

    // For debugging
    console.group('Answer Submitted');
    console.log('Component Name:', componentName);
    console.log('Mapped Question ID:', questionId);
    console.log('Selected Options (raw):', selectedOptions);
    console.log('Selected Options (processed):', optionsArray);
    console.log('Correct Answer:', correctAnswer || 'N/A');

    // Check if we have a specific correct answer for this question
    let isCorrect = false;
    if (correctAnswer) {
      // For single-select questions, check if any selected option matches the correct answer
      isCorrect = optionsArray.some(option => 
        option && option.toString().trim().toLowerCase() === correctAnswer.toLowerCase()
      );
      console.log(`Is answer correct?`, isCorrect);
    } else {
      // Default case: any answer is considered correct
      isCorrect = optionsArray.length > 0;
      console.warn(`No correct answer defined for question ${questionId}. Marking as ${isCorrect ? 'correct' : 'incorrect'}`);
    }
    
    // Log all current answers for debugging
    console.log('Current userAnswers:', userAnswers);
    
    // Create the answer object with proper type
    const answer: QuizAnswer = {
      type: 'quiz',
      questionId,
      selectedOptions: optionsArray,
      isCorrect,
      correctAnswer: correctAnswer || 'N/A',
      timestamp: new Date().toISOString()
    };
    
    setUserAnswers((prev: UserAnswers) => {
      const updated = {
        ...prev,
        [questionId]: answer
      };
      
      // Calculate scores after updating answers
      calculateFinalScores(updated);
      
      // Log the updated answers for debugging
      console.log('Updated userAnswers:', updated);
      
      return updated;
    });
  };

  const handleQuiz1Q5Complete = useCallback((): void => {
    // Don't calculate score here, just show the completion popup
    setShowQuiz1CompletePopup(true);
  }, []);

  const handleQuiz2Q5Complete = useCallback((): void => {
    // Don't calculate score here, just show the completion popup
    setShowQuiz2CompletePopup(true);
  }, []);

  const handleQuiz3Q4Complete = useCallback((): void => {
    // Don't calculate score here, just show the completion popup
    setShowQuiz3CompletePopup(true);
  }, []);

  const handleViewResults = useCallback((): void => {
    setShowQuiz3CompletePopup(false);
    setCurrentScene('closing');
  }, []);

  const handleStartEssay = useCallback((): void => {
    setShowQuiz3CompletePopup(false);
    setCurrentScene('essayCover');
  }, []);
  
  const handleEssayStart = useCallback(() => {
    setCurrentScene('essay1');
  }, []);

  const [essay1Answer, setEssay1Answer] = useState('');

  const handleEssay1Complete = useCallback(async (essay: string) => {
    try {
      // Store essay1 answer in localStorage for later use
      localStorage.setItem('essay1Answer', essay);
      
      setUserAnswers((prev: UserAnswers) => ({
        ...prev,
        essay1: {
          type: 'essay',
          questionId: 'essay1',
          answer: essay,
          timestamp: new Date().toISOString()
        }
      }));
      
      // Navigate to essay2
      setCurrentScene('essay2');
    } catch (error) {
      console.error('Error saving essay answer:', error);
      // Handle error (e.g., show error message to user)
    }
  }, []);

  const handleEssay2Complete = useCallback((essay: string) => {
    // Save essay2 answer
    setUserAnswers((prev: UserAnswers) => ({
      ...prev,
      essay2: {
        type: 'essay',
        questionId: 'essay2',
        answer: essay,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Navigate to closing scene with the new implementation
    setCurrentScene('closing');
  }, []);

  const handleContactAdmission = useCallback(() => {
    // Handle contact admission counselor logic
    console.log('Contacting admission counselor...');
    // You can add your contact logic here
  }, []);

  const handleCloseQuiz1Popup = useCallback(() => {
    setShowQuiz1Popup(false);
  }, []);

  const handleBackToRegistration = useCallback(() => {
    setCurrentScene('registration');
  }, []);

  return (
<main className="min-h-screen">
      {currentScene === 'welcome' && (
        <WelcomeScene onNext={handleWelcomeNext} />
      )}
      {currentScene === 'registration' && (
        <RegistrationScene onNext={handleRegistrationNext} />
      )}
      {currentScene === 'sqlTutorial' && (
        <SQLTutorialScene 
          onBack={() => setCurrentScene('registration')} 
          onNext={handleSQLTutorialComplete}
          userName={userName}
        />
      )}
      {currentScene === 'preQuiz' && (
        <PreQuizCover 
          onBack={handleBackToRegistration} 
          onNext={handleQuizStart} 
        />
      )}
      {currentScene === 'quiz1Cover' && (
        <Quiz1Cover
          onBack={() => setCurrentScene('sqlTutorial')}
          onNext={handleQuiz1Start}
        />
      )}
      
      {showQuiz1Popup && (
        <Quiz1CoverPopup 
          onClose={handleCloseQuiz1Popup}
          onStartQuiz={handleStartQuiz}
        />
      )}
      
      {currentScene === 'quiz1Q1' && (
        <Quiz1Q1 
          onBack={() => setCurrentScene('quiz1Cover')}
          onComplete={handleQuiz1Q1Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz1Q2' && (
        <Quiz1Q2 
          onBack={() => setCurrentScene('quiz1Q1')}
          onComplete={handleQuiz1Q2Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz1Q3' && (
        <Quiz1Q3 
          onBack={() => setCurrentScene('quiz1Q2')}
          onComplete={handleQuiz1Q3Complete}
          onAnswer={handleAnswer}
        />
      )}
      {currentScene === 'quiz1Q4' && (
        <Quiz1Q4
          onBack={() => setCurrentScene('quiz1Q3')}
          onComplete={handleQuiz1Q4Complete}
          onAnswer={handleAnswer}
        />
      )}
      {currentScene === 'quiz1Q5' && (
        <>
          <Quiz1Q5
            onBack={() => setCurrentScene('quiz1Q4')}
            onComplete={handleQuiz1Q5Complete}
            onAnswer={handleAnswer}
          />
          {showQuiz1CompletePopup && (
            <Quiz1CompletePopup onContinue={handleQuiz1CompleteContinue} />
          )}
        </>
      )}
      
      {currentScene === 'quiz2Cover' && (
        <Quiz2Cover
          onBack={() => setCurrentScene('quiz1Q5')}
          onNext={handleQuiz2Start}
        />
      )}
      
      {currentScene === 'quiz2Q1' && (
        <Quiz2Q1 
          onBack={() => setCurrentScene('quiz2Cover')}
          onComplete={handleQuiz2Q1Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz2Q2' && (
        <Quiz2Q2
          onBack={() => setCurrentScene('quiz2Q1')}
          onComplete={handleQuiz2Q2Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz2Q3' && (
        <Quiz2Q3
          onBack={() => setCurrentScene('quiz2Q2')}
          onComplete={handleQuiz2Q3Complete}
          onAnswer={handleAnswer}
        />
      )}
      {currentScene === 'quiz2Q4' && (
        <Quiz2Q4
          onBack={() => setCurrentScene('quiz2Q3')}
          onComplete={handleQuiz2Q4Complete}
          onAnswer={handleAnswer}
        />
      )}
      {currentScene === 'quiz2Q5' && (
        <>
          <Quiz2Q5
            onBack={() => setCurrentScene('quiz2Q4')}
            onComplete={handleQuiz2Q5Complete}
            onAnswer={handleAnswer}
          />
          {showQuiz2CompletePopup && (
            <Quiz2CompletePopup onContinue={handleQuiz2CompleteContinue} />
          )}
        </>
      )}
      
      {currentScene === 'quiz3Cover' && (
        <Quiz3Cover
          onBack={() => setCurrentScene('quiz2Q5')}
          onNext={handleQuiz3Start}
        />
      )}
      
      {currentScene === 'quiz3Q1' && (
        <Quiz3Q1
          onBack={() => setCurrentScene('quiz3Cover')}
          onComplete={handleQuiz3Q1Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz3Q2' && (
        <Quiz3Q2
          onBack={() => setCurrentScene('quiz3Q1')}
          onComplete={handleQuiz3Q2Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz3Q3' && (
        <Quiz3Q3
          onBack={() => setCurrentScene('quiz3Q2')}
          onComplete={handleQuiz3Q3Complete}
          onAnswer={handleAnswer}
        />
      )}
      
      {currentScene === 'quiz3Q4' && (
        <>
          <Quiz3Q4
            onBack={() => setCurrentScene('quiz3Q3')}
            onComplete={handleQuiz3Q4Complete}
            onAnswer={handleAnswer}
          />
          {showQuiz3CompletePopup && (
            <Quiz3CompletePopup 
              onNext={handleStartEssay}
            />
          )}
        </>
      )}
      {currentScene === 'essayCover' && (
        <EssayCover
          userName={userName}
          onBack={() => setCurrentScene('quiz3Q4')}
          onNext={handleEssayStart}
        />
      )}
      
      {currentScene === 'essay1' && (
        <Essay1
          userName={userName}
          userId={userId}
          onBack={() => setCurrentScene('essayCover')}
          onNext={handleEssay1Complete}
        />
      )}
      {currentScene === 'essay2' && (
        <Essay2
          userName={userName}
          userId={userId}
          onBack={() => setCurrentScene('essay1')}
          onNext={(essay) => handleEssay2Complete(essay)}
        />
      )}
      {currentScene === 'closing' && (
        <ClosingScene2 userName={userName} />
      )}
    </main>
  );
}
