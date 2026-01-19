import { useState, useEffect } from 'react';

// Confetti particle component
const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (active) {
      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);
    }
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  );
};

// Progress celebration component
const ProgressCelebration = ({ show, message }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div className="animate-celebration bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🎉</span>
          <span className="text-xl font-bold">{message}</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</span>
        </div>
      </div>
    </div>
  );
};

// Loading spinner with pulse
const LoadingSpinner = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-blue-400 opacity-30" />
    </div>
    <p className="text-gray-500 animate-pulse">Loading quiz...</p>
  </div>
);

// Animated button component
const AnimatedButton = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
  const [ripple, setRipple] = useState(null);
  
  const baseStyles = "relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    ghost: "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:-translate-y-0.5"
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {ripple && (
        <span
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{ left: ripple.x, top: ripple.y, width: 10, height: 10, transform: 'translate(-50%, -50%)' }}
        />
      )}
      {children}
    </button>
  );
};

// Answer option card with animations
const AnswerCard = ({ text, isSelected, isCorrect, isWrong, onClick, disabled, index }) => {
  const getStyles = () => {
    if (isCorrect) return 'border-emerald-500 bg-emerald-50 shadow-emerald-200 animate-correct';
    if (isWrong) return 'border-red-500 bg-red-50 shadow-red-200 animate-shake';
    if (isSelected) return 'border-blue-500 bg-blue-50 shadow-blue-200 scale-[1.02]';
    return 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-[1.01]';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 transform ${getStyles()}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
          isCorrect ? 'bg-emerald-500 text-white' :
          isWrong ? 'bg-red-500 text-white' :
          isSelected ? 'bg-blue-500 text-white' :
          'bg-gray-100 text-gray-600'
        }`}>
          {String.fromCharCode(65 + index)}
        </span>
        <span className="font-medium">{text}</span>
        {isCorrect && <span className="ml-auto text-2xl animate-bounce">✓</span>}
        {isWrong && <span className="ml-auto text-2xl">✗</span>}
      </div>
    </button>
  );
};

// Progress bar with animation
const ProgressBar = ({ current, total, streak }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {current} of {total}</span>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-orange-500 font-semibold animate-pulse">
            🔥 {streak} streak!
          </span>
        )}
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
    </div>
  );
};

// Page transition wrapper
const PageTransition = ({ children, show }) => (
  <div className={`transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    {children}
  </div>
);

// Timer component
const Timer = ({ seconds, isWarning }) => (
  <div className={`flex items-center gap-2 font-mono text-lg ${isWarning ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className={isWarning ? 'animate-bounce' : ''}>{seconds}s</span>
  </div>
);

// Main demo component
export default function OpenQuizAnimations() {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerState, setAnswerState] = useState(null); // 'correct', 'wrong', null
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(30);
  const [pageVisible, setPageVisible] = useState(true);

  const mockAnswers = [
    { id: 0, text: 'React is a JavaScript library', correct: true },
    { id: 1, text: 'React is a programming language', correct: false },
    { id: 2, text: 'React is a database system', correct: false },
    { id: 3, text: 'React is an operating system', correct: false },
  ];

  // Timer countdown
  useEffect(() => {
    if (currentView === 'quiz' && timer > 0 && !answerState) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [currentView, timer, answerState]);

  const handleAnswerClick = (answer) => {
    if (answerState) return;
    setSelectedAnswer(answer.id);
    
    setTimeout(() => {
      if (answer.correct) {
        setAnswerState('correct');
        setShowConfetti(true);
        setStreak(s => s + 1);
        setTimeout(() => setShowConfetti(false), 2000);
        
        if (streak + 1 >= 3) {
          setTimeout(() => {
            setCelebrationMessage(`${streak + 1} in a row! 🔥`);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
          }, 500);
        }
      } else {
        setAnswerState('wrong');
        setStreak(0);
      }
    }, 300);
  };

  const handleNextQuestion = () => {
    setPageVisible(false);
    setTimeout(() => {
      setSelectedAnswer(null);
      setAnswerState(null);
      setQuestionIndex(i => i + 1);
      setTimer(30);
      setPageVisible(true);
    }, 300);
  };

  const handleStartQuiz = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView('quiz');
    }, 1500);
  };

  const resetDemo = () => {
    setPageVisible(false);
    setTimeout(() => {
      setCurrentView('menu');
      setSelectedAnswer(null);
      setAnswerState(null);
      setQuestionIndex(1);
      setStreak(0);
      setTimer(30);
      setPageVisible(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes correct {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes ripple {
          to { transform: translate(-50%, -50%) scale(40); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes celebration {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-confetti { animation: confetti 2s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-correct { animation: correct 0.5s ease-in-out; }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-celebration { animation: celebration 0.5s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
      `}</style>

      <Confetti active={showConfetti} />
      <ProgressCelebration show={showCelebration} message={celebrationMessage} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slideIn">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenQuiz
          </h1>
          <p className="text-gray-500 mt-1">Animation Demo</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 flex justify-center animate-slideIn">
            <LoadingSpinner />
          </div>
        )}

        {/* Menu View */}
        {currentView === 'menu' && !isLoading && (
          <PageTransition show={pageVisible}>
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Ready to Learn?</h2>
                <p className="text-gray-500">Test your knowledge with interactive quizzes</p>
              </div>
              
              <div className="grid gap-4">
                <AnimatedButton variant="primary" onClick={handleStartQuiz} className="w-full py-4">
                  🚀 Start Quiz
                </AnimatedButton>
                <AnimatedButton variant="ghost" onClick={() => setShowConfetti(true)} className="w-full">
                  🎊 Test Confetti
                </AnimatedButton>
                <AnimatedButton 
                  variant="ghost" 
                  onClick={() => {
                    setCelebrationMessage('Achievement Unlocked!');
                    setShowCelebration(true);
                    setTimeout(() => setShowCelebration(false), 2000);
                  }} 
                  className="w-full"
                >
                  🏆 Test Celebration
                </AnimatedButton>
              </div>
            </div>
          </PageTransition>
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && !isLoading && (
          <PageTransition show={pageVisible}>
            <div className="space-y-6">
              {/* Progress & Timer */}
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <ProgressBar current={questionIndex} total={10} streak={streak} />
                </div>
                <div className="flex justify-end">
                  <Timer seconds={timer} isWarning={timer <= 10} />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Computer Science
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">
                    What is React?
                  </h2>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {mockAnswers.map((answer, index) => (
                    <AnswerCard
                      key={answer.id}
                      text={answer.text}
                      index={index}
                      isSelected={selectedAnswer === answer.id}
                      isCorrect={answerState === 'correct' && answer.correct}
                      isWrong={answerState === 'wrong' && selectedAnswer === answer.id}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={answerState !== null}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  {answerState && (
                    <AnimatedButton 
                      variant="success" 
                      onClick={handleNextQuestion}
                      className="flex-1"
                    >
                      Next Question →
                    </AnimatedButton>
                  )}
                  <AnimatedButton variant="ghost" onClick={resetDemo}>
                    ← Back to Menu
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </PageTransition>
        )}

        {/* Animation Legend */}
        <div className="mt-8 bg-white/50 rounded-xl p-4 text-sm text-gray-500">
          <p className="font-medium text-gray-700 mb-2">Animations included:</p>
          <div className="grid grid-cols-2 gap-2">
            <span>✓ Button ripple effects</span>
            <span>✓ Confetti celebration</span>
            <span>✓ Correct/wrong shake</span>
            <span>✓ Progress bar shimmer</span>
            <span>✓ Page transitions</span>
            <span>✓ Streak celebrations</span>
            <span>✓ Loading spinner</span>
            <span>✓ Timer warning pulse</span>
          </div>
        </div>
      </div>
    </div>
  );
}
