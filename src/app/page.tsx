"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

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

const ClosingScene = dynamic(
  () => import('../components/ClosingScene'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

type Scene = 'welcome' | 'registration' | 'preQuiz' | 'sqlTutorial' | 'quiz1Cover' | 'quiz1Q1' | 'quiz1Q2' | 'quiz1Q3' | 'quiz1Q4' | 'quiz1Q5' | 'quiz2Cover' | 'quiz2Q1' | 'quiz2Q2' | 'quiz2Q3' | 'quiz2Q4' | 'quiz2Q5' | 'quiz3Cover' | 'quiz3Q1' | 'quiz3Q2' | 'quiz3Q3' | 'quiz3Q4' | 'closing';

export default function Home() {
  const [currentScene, setCurrentScene] = useState<Scene>('welcome');
  const [showQuiz1Popup, setShowQuiz1Popup] = useState(false);
  const [showQuiz1CompletePopup, setShowQuiz1CompletePopup] = useState(false);
  const [showQuiz2CompletePopup, setShowQuiz2CompletePopup] = useState(false);
  const [showQuiz3CompletePopup, setShowQuiz3CompletePopup] = useState(false);
  
  // User data and scoring state
  const [userName, setUserName] = useState('Peserta');
  const [totalScore, setTotalScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

  const handleWelcomeNext = () => {
    setCurrentScene('registration');
  };

  const handleRegistrationNext = (name: string) => {
    setUserName(name);
    setCurrentScene('sqlTutorial');
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
  const handleQuiz1CompleteContinue = () => {
    setShowQuiz1CompletePopup(false);
    // Navigate to Quiz 2 Cover
    setCurrentScene('quiz2Cover');
  };

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

  const handleQuiz2CompleteContinue = () => {
    setShowQuiz2CompletePopup(false);
    setCurrentScene('quiz3Cover');
  };

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

  const calculateQuizScore = (quizNumber: number) => {
    const quizAnswers = Object.values(userAnswers).filter(answer => 
      answer && answer.questionId && answer.questionId.startsWith(`Quiz${quizNumber}Q`)
    );
    const score = quizAnswers.filter((answer: any) => answer && answer.isCorrect).length;
    const total = quizNumber === 3 ? 4 : 5; // Quiz 3 has 4 questions, others have 5
    return { score, total };
  };

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

  // Define correct answers for each question
  const correctAnswers: { [key: string]: string } = {
    'Quiz1Q1': 'a',        // Hanya satu pekerja di RevoU yang persisnya memiliki dua anak.
    'Quiz1Q2': 'd',        // 60% karyawan pria & wanita tinggal di luar Jabodetabek
    'Quiz1Q3': 'd',        // Kesimpulan I dan II tidak benar
    'Quiz1Q4': 'a',        // Benar
    'Quiz1Q5': 'b',        // Baik I dan II tidak cukup untuk menjawab
    'Quiz2Q1': 'd',        // 55.31
    'Quiz2Q2': 'b',        // 24%
    'Quiz2Q3': 'a',        // 20%
    'Quiz2Q4': 'a',        // 2.6
    'Quiz2Q5': 'c',        // 43
    'Quiz3Q1': 'd',        // 800
    'Quiz3Q2': 'a',        // Kasus COVID di Jakarta pada bulan Maret rata-rata lebih tinggi dari pada bulan April
    'Quiz3Q3': 'b',        // Lebih banyak barang terjual di wilayah utara daripada selatan selama enam bulan
    'Quiz3Q4': 'a',        // Semua tanggal harus diubah ke format yang sama DD/MM/YY
  };

  const handleAnswer = (componentName: string, selectedOptions: string | string[]) => {
    // Ensure selectedOptions is always an array
    const optionsArray = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
    
    // Map the component name to the correct question ID
    const questionId = questionIdMap[componentName] || componentName.split('-')[0];

    // For debugging
    console.group('Answer Submitted');
    console.log('Component Name:', componentName);
    console.log('Mapped Question ID:', questionId);
    console.log('Selected Options (raw):', selectedOptions);
    console.log('Selected Options (processed):', optionsArray);
    console.log('Correct Answer:', correctAnswers[questionId] || 'N/A');

    // Check if we have a specific correct answer for this question
    let isCorrect = false;
    if (correctAnswers[questionId]) {
      // For single-select questions, check if any selected option matches the correct answer
      isCorrect = optionsArray.some(option => 
        option && option.toString().trim().toLowerCase() === correctAnswers[questionId].toLowerCase()
      );
      console.log(`Is answer correct?`, isCorrect);
    } else {
      // Default case: any answer is considered correct
      isCorrect = optionsArray.length > 0;
      console.warn(`No correct answer defined for question ${questionId}. Marking as ${isCorrect ? 'correct' : 'incorrect'}`);
    }
    
    // Log all current answers for debugging
    console.log('Current userAnswers:', userAnswers);
    
    // Update the user's answers and recalculate the total score
    setUserAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [questionId]: { 
          questionId, 
          selectedOptions: optionsArray, // Store the normalized array
          isCorrect,
          correctAnswer: correctAnswers[questionId] || 'N/A'
        }
      };
      
      // Calculate total score based on all answers
      const totalCorrect = Object.entries(updatedAnswers)
        .filter(([qId, answer]) => {
          const mappedId = questionIdMap[qId] || qId;
          const isCorrect = answer?.isCorrect;
          console.log(`Question ${qId} (mapped to ${mappedId}):`, isCorrect ? '✅' : '❌');
          return isCorrect;
        })
        .length;
        
      console.log(`📊 Total correct answers: ${totalCorrect} out of ${Object.keys(correctAnswers).length}`);
      setTotalScore(totalCorrect);
      
      // Log detailed score breakdown
      console.group('Score Breakdown');
      Object.entries(updatedAnswers).forEach(([qId, answer]) => {
        const mappedId = questionIdMap[qId] || qId;
        console.log(
          `Question ${mappedId}: ${answer?.isCorrect ? '✅' : '❌'}`,
          `(Selected: ${answer?.selectedOptions || 'none'},`,
          `Correct: ${correctAnswers[mappedId] || 'N/A'})`
        );
      });
      console.groupEnd();
      
      return updatedAnswers;
    });
  };

  const handleQuiz1Q5Complete = () => {
    const { score } = calculateQuizScore(1);
    setTotalScore(prev => prev + score);
    setShowQuiz1CompletePopup(true);
  };

  const handleQuiz2Q5Complete = () => {
    const { score } = calculateQuizScore(2);
    setTotalScore(prev => prev + score);
    setShowQuiz2CompletePopup(true);
  };

  const handleQuiz3Q4Complete = () => {
    const { score } = calculateQuizScore(3);
    setTotalScore(prev => prev + score);
    setShowQuiz3CompletePopup(true);
  };

  const handleViewResults = () => {
    setShowQuiz3CompletePopup(false);
    setCurrentScene('closing');
  };

  const handleContactAdmission = () => {
    // Handle contact admission counselor logic
    console.log('Contacting admission counselor...');
    // You can add your contact logic here
  };

  const handleCloseQuiz1Popup = () => {
    setShowQuiz1Popup(false);
  };

  const handleBackToRegistration = () => {
    setCurrentScene('registration');
  };

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
              onNext={handleViewResults} 
              onClose={() => setShowQuiz3CompletePopup(false)} 
            />
          )}
        </>
      )}
      {currentScene === 'closing' && (
        <ClosingScene
          userName={userName}
          totalScore={totalScore}
          totalQuestions={14} // Sum of all questions (5+5+4)
          onContactAdmission={handleContactAdmission}
        />
      )}
    </main>
  );
}
