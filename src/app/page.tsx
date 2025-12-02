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

const PreQuiz1Scene = dynamic(
  () => import('../components/PreQuiz1Scene'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const PreQuiz2Scene = dynamic(
  () => import('../components/PreQuiz2Scene'),
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

type Scene = 'welcome' | 'registration' | 'preQuiz' | 'preQuiz1' | 'preQuiz2' | 'quiz1Cover' | 'quiz1Q1' | 'quiz1Q2' | 'quiz1Q3' | 'quiz1Q4' | 'quiz1Q5' | 'quiz2Cover' | 'quiz2Q1' | 'quiz2Q2' | 'quiz2Q3' | 'quiz2Q4' | 'quiz2Q5' | 'quiz3Cover' | 'quiz3Q1' | 'quiz3Q2' | 'quiz3Q3' | 'quiz3Q4';

export default function Home() {
  const [currentScene, setCurrentScene] = useState<Scene>('welcome');
  const [showQuiz1Popup, setShowQuiz1Popup] = useState(false);
  const [showQuiz1CompletePopup, setShowQuiz1CompletePopup] = useState(false);
  const [showQuiz2CompletePopup, setShowQuiz2CompletePopup] = useState(false);
  const [showQuiz3CompletePopup, setShowQuiz3CompletePopup] = useState(false);

  const handleWelcomeNext = () => {
    setCurrentScene('registration');
  };

  const handleRegistrationNext = () => {
    // Move to pre-quiz cover
    setCurrentScene('preQuiz');
  };

  const handleQuizStart = () => {
    // Navigate to the first quiz question
    setCurrentScene('preQuiz1');
  };

  const handlePreQuiz1Next = () => {
    // Navigate to pre-quiz 2
    setCurrentScene('preQuiz2');
  };

  const handlePreQuiz2Next = () => {
    // Navigate to Quiz 1 Cover
    setCurrentScene('quiz1Cover');
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

  // Show the completion popup when Quiz1Q5 is completed
  const handleQuiz1Q5Complete = () => {
    setShowQuiz1CompletePopup(true);
  };

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

  const handleQuiz2Q5Complete = () => {
    setShowQuiz2CompletePopup(true);
  };

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

  const handleQuiz3Q4Complete = () => {
    setShowQuiz3CompletePopup(true);
  };

  const handleQuiz3CompleteContinue = () => {
    setShowQuiz3CompletePopup(false);
    // You can add navigation to the next section here if needed
    console.log('Quiz 3 completed');
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
      {currentScene === 'preQuiz' && (
        <PreQuizCover 
          onBack={handleBackToRegistration} 
          onNext={handleQuizStart} 
        />
      )}
      {currentScene === 'preQuiz1' && (
        <PreQuiz1Scene
          onBack={() => setCurrentScene('preQuiz')}
          onNext={handlePreQuiz1Next}
        />
      )}
      {currentScene === 'preQuiz2' && (
        <PreQuiz2Scene
          onBack={() => setCurrentScene('preQuiz1')}
          onNext={handlePreQuiz2Next}
        />
      )}
      {currentScene === 'quiz1Cover' && (
        <Quiz1Cover
          onBack={() => setCurrentScene('preQuiz2')}
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
        />
      )}
      
      {currentScene === 'quiz1Q2' && (
        <Quiz1Q2 
          onBack={() => setCurrentScene('quiz1Q1')}
          onComplete={handleQuiz1Q2Complete}
        />
      )}
      
      {currentScene === 'quiz1Q3' && (
        <Quiz1Q3 
          onBack={() => setCurrentScene('quiz1Q2')}
          onComplete={handleQuiz1Q3Complete}
        />
      )}
      {currentScene === 'quiz1Q4' && (
        <Quiz1Q4
          onBack={() => setCurrentScene('quiz1Q3')}
          onComplete={handleQuiz1Q4Complete}
        />
      )}
      {currentScene === 'quiz1Q5' && (
        <>
          <Quiz1Q5
            onBack={() => setCurrentScene('quiz1Q4')}
            onComplete={handleQuiz1Q5Complete}
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
        />
      )}
      
      {currentScene === 'quiz2Q2' && (
        <Quiz2Q2
          onBack={() => setCurrentScene('quiz2Q1')}
          onComplete={handleQuiz2Q2Complete}
        />
      )}
      
      {currentScene === 'quiz2Q3' && (
        <Quiz2Q3
          onBack={() => setCurrentScene('quiz2Q2')}
          onComplete={handleQuiz2Q3Complete}
        />
      )}
      {currentScene === 'quiz2Q4' && (
        <Quiz2Q4
          onBack={() => setCurrentScene('quiz2Q3')}
          onComplete={handleQuiz2Q4Complete}
        />
      )}
      {currentScene === 'quiz2Q5' && (
        <>
          <Quiz2Q5
            onBack={() => setCurrentScene('quiz2Q4')}
            onComplete={handleQuiz2Q5Complete}
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
        />
      )}
      
      {currentScene === 'quiz3Q2' && (
        <Quiz3Q2
          onBack={() => setCurrentScene('quiz3Q1')}
          onComplete={handleQuiz3Q2Complete}
        />
      )}
      
      {currentScene === 'quiz3Q3' && (
        <Quiz3Q3
          onBack={() => setCurrentScene('quiz3Q2')}
          onComplete={handleQuiz3Q3Complete}
        />
      )}
      
      {currentScene === 'quiz3Q4' && (
        <>
          <Quiz3Q4
            onBack={() => setCurrentScene('quiz3Q3')}
            onComplete={handleQuiz3Q4Complete}
          />
          {showQuiz3CompletePopup && (
            <Quiz3CompletePopup onContinue={handleQuiz3CompleteContinue} />
          )}
        </>
      )}
    </main>
  );
}
