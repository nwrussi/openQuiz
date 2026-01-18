import React, { useState, useEffect } from 'react';

// Animated counter that counts up
const AnimatedCounter = ({ end, duration = 1500, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Circular progress with animation
const AnimatedCircularProgress = ({ percentage, size = 120, strokeWidth = 10, color = '#3b82f6', delay = 0 }) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// Animated bar chart
const AnimatedBarChart = ({ data, delay = 0 }) => {
  const [animate, setAnimate] = useState(false);
  const maxValue = Math.max(...data.map(d => d.value));

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-20 text-sm text-gray-600 text-right">{item.label}</div>
          <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{
                width: animate ? `${(item.value / maxValue) * 100}%` : '0%',
                backgroundColor: item.color,
                transitionDelay: `${idx * 100}ms`
              }}
            >
              <span className="text-white text-sm font-bold">{item.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// XP gain animation
const XPGainAnimation = ({ amount, show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-xpGain text-6xl font-bold text-yellow-500 drop-shadow-lg">
        +{amount} XP
      </div>
    </div>
  );
};

// Star rating display
const StarRating = ({ rating, maxRating = 5 }) => {
  const [animatedRating, setAnimatedRating] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedRating(prev => {
        if (prev >= rating) {
          clearInterval(timer);
          return rating;
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(timer);
  }, [rating]);

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, idx) => (
        <span
          key={idx}
          className={`text-3xl transition-all duration-300 ${
            idx < animatedRating ? 'scale-100 opacity-100' : 'scale-75 opacity-30'
          }`}
          style={{ transitionDelay: `${idx * 200}ms` }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
};

// Level up animation
const LevelUpBanner = ({ newLevel, show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
      <div className="text-center animate-levelUp">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <div className="text-4xl font-bold text-white mb-2">LEVEL UP!</div>
        <div className="text-8xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {newLevel}
        </div>
        <div className="text-white/60 mt-4">New abilities unlocked!</div>
      </div>
    </div>
  );
};

// Stat improvement indicator
const StatChange = ({ label, before, after, unit = '', isTime = false }) => {
  const improved = isTime ? after < before : after > before;
  const change = isTime ? before - after : after - before;
  const changePercent = Math.abs(Math.round((change / before) * 100));

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-semibold text-gray-800">{after}{unit}</div>
      </div>
      <div className={`flex items-center gap-1 ${improved ? 'text-emerald-500' : 'text-red-500'}`}>
        <span className={improved ? 'rotate-0' : 'rotate-180'}>↑</span>
        <span className="font-medium">{changePercent}%</span>
      </div>
    </div>
  );
};

// Question breakdown card
const QuestionBreakdown = ({ question, isCorrect, time, index }) => (
  <div
    className={`p-4 rounded-xl border-2 transition-all duration-300 animate-slideIn ${
      isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
    }`}
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <span className={`text-xl ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
          {isCorrect ? '✓' : '✗'}
        </span>
        <div>
          <p className="text-gray-800 font-medium">{question.text}</p>
          <p className="text-sm text-gray-500 mt-1">
            Your answer: <span className={isCorrect ? 'text-emerald-600' : 'text-red-600'}>{question.userAnswer}</span>
          </p>
          {!isCorrect && (
            <p className="text-sm text-gray-500">
              Correct: <span className="text-emerald-600">{question.correctAnswer}</span>
            </p>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-400">{time}s</div>
    </div>
  </div>
);

// Main session summary component
export default function OpenQuizSessionSummary() {
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const sessionData = {
    score: 850,
    totalQuestions: 20,
    correct: 17,
    incorrect: 3,
    accuracy: 85,
    averageTime: 4.2,
    bestStreak: 8,
    xpEarned: 425,
    newLevel: 12,
    previousLevel: 11,
    timeSpent: '8:34',
    categoryBreakdown: [
      { label: 'Science', value: 8, color: '#3b82f6' },
      { label: 'History', value: 5, color: '#8b5cf6' },
      { label: 'Math', value: 4, color: '#10b981' },
      { label: 'Literature', value: 3, color: '#f59e0b' },
    ],
    questions: [
      { text: 'What is the capital of France?', userAnswer: 'Paris', correctAnswer: 'Paris', isCorrect: true, time: 2.1 },
      { text: 'Who wrote Hamlet?', userAnswer: 'Shakespeare', correctAnswer: 'Shakespeare', isCorrect: true, time: 3.5 },
      { text: 'What is 15 × 12?', userAnswer: '170', correctAnswer: '180', isCorrect: false, time: 5.2 },
      { text: 'What year did WWII end?', userAnswer: '1945', correctAnswer: '1945', isCorrect: true, time: 2.8 },
      { text: 'H2O is the formula for?', userAnswer: 'Water', correctAnswer: 'Water', isCorrect: true, time: 1.5 },
    ]
  };

  useEffect(() => {
    // Trigger XP animation after delay
    const xpTimer = setTimeout(() => setShowXPAnimation(true), 2000);
    const xpHideTimer = setTimeout(() => setShowXPAnimation(false), 3500);
    
    // Trigger level up if applicable
    const levelTimer = setTimeout(() => {
      if (sessionData.newLevel > sessionData.previousLevel) {
        setShowLevelUp(true);
      }
    }, 4000);

    return () => {
      clearTimeout(xpTimer);
      clearTimeout(xpHideTimer);
      clearTimeout(levelTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes xpGain {
          0% { transform: scale(0.5) translateY(20px); opacity: 0; }
          20% { transform: scale(1.2) translateY(0); opacity: 1; }
          80% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(1) translateY(-50px); opacity: 0; }
        }
        @keyframes levelUp {
          0% { transform: scale(0) rotate(-10deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
        .animate-xpGain { animation: xpGain 1.5s ease-out forwards; }
        .animate-levelUp { animation: levelUp 0.6s ease-out forwards; }
        .animate-confetti { animation: confetti 2.5s ease-out forwards; }
      `}</style>

      <XPGainAnimation amount={sessionData.xpEarned} show={showXPAnimation} />
      <LevelUpBanner newLevel={sessionData.newLevel} show={showLevelUp} onComplete={() => setShowLevelUp(false)} />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center animate-slideDown">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenQuiz
          </h1>
          <p className="text-gray-500">Session Complete!</p>
        </div>

        {/* Main score card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center animate-slideIn shadow-xl">
          <div className="text-6xl font-bold mb-2">
            <AnimatedCounter end={sessionData.score} />
          </div>
          <div className="text-white/80 mb-6">Total Score</div>
          
          <div className="flex justify-center mb-6">
            <StarRating rating={sessionData.accuracy >= 90 ? 5 : sessionData.accuracy >= 70 ? 4 : sessionData.accuracy >= 50 ? 3 : 2} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-2xl font-bold">{sessionData.correct}/{sessionData.totalQuestions}</div>
              <div className="text-sm text-white/70">Correct</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-2xl font-bold">{sessionData.averageTime}s</div>
              <div className="text-sm text-white/70">Avg Time</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-2xl font-bold">🔥 {sessionData.bestStreak}</div>
              <div className="text-sm text-white/70">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          {['overview', 'breakdown', 'questions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Accuracy circle */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Accuracy</h3>
              <div className="flex items-center justify-center">
                <AnimatedCircularProgress 
                  percentage={sessionData.accuracy} 
                  size={150}
                  color={sessionData.accuracy >= 80 ? '#10b981' : sessionData.accuracy >= 60 ? '#f59e0b' : '#ef4444'}
                />
              </div>
            </div>

            {/* XP & Level progress */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Experience Gained</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-yellow-500">
                    +<AnimatedCounter end={sessionData.xpEarned} duration={2000} />
                  </div>
                  <div className="text-sm text-gray-500">XP Earned</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-600">Level {sessionData.newLevel}</div>
                  <div className="text-sm text-gray-500">Current Level</div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                  style={{ width: '65%' }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-2 text-right">650 / 1000 XP to Level 13</div>
            </div>

            {/* Improvement stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Compared to Last Session</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatChange label="Accuracy" before={78} after={85} unit="%" />
                <StatChange label="Avg Time" before={5.1} after={4.2} unit="s" isTime />
                <StatChange label="Streak" before={5} after={8} />
                <StatChange label="Score" before={720} after={850} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Category breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Questions by Category</h3>
              <AnimatedBarChart data={sessionData.categoryBreakdown} delay={300} />
            </div>

            {/* Time distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{sessionData.timeSpent}</div>
                  <div className="text-sm text-gray-500">Total Time</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <div className="text-3xl font-bold text-emerald-600">{sessionData.averageTime}s</div>
                  <div className="text-sm text-gray-500">Per Question</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">1.5s</div>
                  <div className="text-sm text-gray-500">Fastest Answer</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">8.2s</div>
                  <div className="text-sm text-gray-500">Slowest Answer</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-3 animate-fadeIn">
            {sessionData.questions.map((q, idx) => (
              <QuestionBreakdown
                key={idx}
                question={q}
                isCorrect={q.isCorrect}
                time={q.time}
                index={idx}
              />
            ))}
            <p className="text-center text-sm text-gray-400">
              Showing first 5 of {sessionData.totalQuestions} questions
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            🔄 Play Again
          </button>
          <button className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            📊 View Full Stats
          </button>
        </div>
      </div>
    </div>
  );
}
