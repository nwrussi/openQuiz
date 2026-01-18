import React, { useState, useEffect, useRef } from 'react';

// Card flip component with 3D animation
const FlashCard = ({ front, back, isFlipped, onFlip }) => (
  <div 
    className="relative w-full h-72 cursor-pointer perspective-1000"
    onClick={onFlip}
  >
    <div className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
      {/* Front */}
      <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 flex flex-col">
        <div className="text-white/60 text-sm font-medium mb-2">Question</div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-2xl font-bold text-center">{front}</p>
        </div>
        <div className="text-white/40 text-sm text-center">Tap to reveal</div>
      </div>
      {/* Back */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 flex flex-col">
        <div className="text-white/60 text-sm font-medium mb-2">Answer</div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-2xl font-bold text-center">{back}</p>
        </div>
        <div className="text-white/40 text-sm text-center">How well did you know this?</div>
      </div>
    </div>
  </div>
);

// Swipeable card with gesture support
const SwipeableCard = ({ card, onSwipe, isTop, style, zIndex }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleStart = (clientX, clientY) => {
    if (!isTop) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !isTop) return;
    setPosition({
      x: clientX - startPos.x,
      y: clientY - startPos.y
    });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (position.x > threshold) {
      onSwipe('right', card);
    } else if (position.x < -threshold) {
      onSwipe('left', card);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const rotation = position.x * 0.1;
  const opacity = Math.max(0, 1 - Math.abs(position.x) / 300);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) ${style?.transform || ''}`,
        opacity: isTop ? opacity : style?.opacity || 1,
        zIndex,
        transition: isDragging ? 'none' : 'all 0.3s ease-out'
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Swipe indicators */}
      {isTop && Math.abs(position.x) > 30 && (
        <>
          <div 
            className={`absolute top-4 left-4 px-4 py-2 rounded-lg font-bold text-xl transition-opacity ${
              position.x < -30 ? 'opacity-100 bg-red-500 text-white' : 'opacity-0'
            }`}
          >
            ✗ Again
          </div>
          <div 
            className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-bold text-xl transition-opacity ${
              position.x > 30 ? 'opacity-100 bg-emerald-500 text-white' : 'opacity-0'
            }`}
          >
            ✓ Got it
          </div>
        </>
      )}
      
      <FlashCard 
        front={card.front} 
        back={card.back} 
        isFlipped={isFlipped}
        onFlip={(e) => {
          if (!isDragging && isTop) {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }
        }}
      />
    </div>
  );
};

// Confidence rating buttons
const ConfidenceButtons = ({ onRate, disabled }) => {
  const buttons = [
    { label: 'Again', color: 'bg-red-500 hover:bg-red-600', emoji: '😕', value: 1 },
    { label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', emoji: '🤔', value: 2 },
    { label: 'Good', color: 'bg-blue-500 hover:bg-blue-600', emoji: '😊', value: 3 },
    { label: 'Easy', color: 'bg-emerald-500 hover:bg-emerald-600', emoji: '😎', value: 4 },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {buttons.map((btn, idx) => (
        <button
          key={btn.value}
          onClick={() => onRate(btn.value)}
          disabled={disabled}
          className={`${btn.color} text-white py-3 px-2 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-slideUp`}
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          <div className="text-xl mb-1">{btn.emoji}</div>
          <div className="text-sm">{btn.label}</div>
        </button>
      ))}
    </div>
  );
};

// Progress ring
const ProgressRing = ({ progress, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-500 transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Mastery indicator
const MasteryBadge = ({ level }) => {
  const levels = [
    { name: 'New', color: 'bg-gray-400', icon: '🌱' },
    { name: 'Learning', color: 'bg-orange-400', icon: '📚' },
    { name: 'Reviewing', color: 'bg-blue-400', icon: '🔄' },
    { name: 'Mastered', color: 'bg-emerald-400', icon: '⭐' },
  ];
  const current = levels[Math.min(level, levels.length - 1)];

  return (
    <div className={`${current.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
      <span>{current.icon}</span>
      <span>{current.name}</span>
    </div>
  );
};

// Session stats
const SessionStats = ({ stats }) => (
  <div className="grid grid-cols-4 gap-3 text-center">
    {[
      { label: 'Reviewed', value: stats.reviewed, color: 'text-blue-600' },
      { label: 'Correct', value: stats.correct, color: 'text-emerald-600' },
      { label: 'Wrong', value: stats.wrong, color: 'text-red-600' },
      { label: 'Streak', value: stats.streak, color: 'text-orange-600' },
    ].map((stat, idx) => (
      <div key={stat.label} className="animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
        <div className="text-xs text-gray-500">{stat.label}</div>
      </div>
    ))}
  </div>
);

// Celebration overlay
const CelebrationOverlay = ({ show, message }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-celebration bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
        <div className="text-4xl mb-2 animate-bounce">🎉</div>
        <div className="text-xl font-bold">{message}</div>
      </div>
    </div>
  );
};

// Card complete animation
const CardCompleteAnimation = ({ show, isCorrect }) => {
  if (!show) return null;
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-40 pointer-events-none animate-fadeOut`}>
      <div className={`text-8xl ${isCorrect ? 'animate-flyRight text-emerald-500' : 'animate-flyLeft text-red-500'}`}>
        {isCorrect ? '✓' : '✗'}
      </div>
    </div>
  );
};

// Main flashcard game component
export default function OpenQuizFlashcards() {
  const [cards, setCards] = useState([
    { id: 1, front: 'What is the capital of France?', back: 'Paris', mastery: 0 },
    { id: 2, front: 'What is 2 + 2?', back: '4', mastery: 1 },
    { id: 3, front: 'Who wrote Romeo and Juliet?', back: 'William Shakespeare', mastery: 2 },
    { id: 4, front: 'What is the chemical symbol for water?', back: 'H₂O', mastery: 3 },
    { id: 5, front: 'What year did World War II end?', back: '1945', mastery: 1 },
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, correct: 0, wrong: 0, streak: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');
  const [cardAnimation, setCardAnimation] = useState({ show: false, isCorrect: false });
  const [mode, setMode] = useState('swipe'); // 'swipe' or 'classic'

  const currentCard = cards[currentIndex];
  const progress = (stats.reviewed / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowConfidence(true);
    }
  };

  const handleSwipe = (direction, card) => {
    const isCorrect = direction === 'right';
    
    setCardAnimation({ show: true, isCorrect });
    setTimeout(() => setCardAnimation({ show: false, isCorrect: false }), 500);
    
    setStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    // Check for streaks
    if (isCorrect && (stats.streak + 1) % 5 === 0 && stats.streak > 0) {
      setCelebrationMsg(`${stats.streak + 1} card streak! 🔥`);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }

    // Next card
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setShowConfidence(false);
      } else {
        setCelebrationMsg('Session Complete! 🎊');
        setShowCelebration(true);
      }
    }, 300);
  };

  const handleConfidenceRate = (rating) => {
    const isCorrect = rating >= 3;
    handleSwipe(isCorrect ? 'right' : 'left', currentCard);
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowConfidence(false);
    setStats({ reviewed: 0, correct: 0, wrong: 0, streak: 0 });
    setShowCelebration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes celebration {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes flyRight {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(200px) scale(0.5); opacity: 0; }
        }
        @keyframes flyLeft {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(-200px) scale(0.5); opacity: 0; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes cardEnter {
          from { transform: scale(0.8) translateY(50px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        .animate-celebration { animation: celebration 0.5s ease-out forwards; }
        .animate-flyRight { animation: flyRight 0.5s ease-out forwards; }
        .animate-flyLeft { animation: flyLeft 0.5s ease-out forwards; }
        .animate-fadeOut { animation: fadeOut 0.5s ease-out forwards; }
        .animate-cardEnter { animation: cardEnter 0.4s ease-out forwards; }
        .animate-pulse-border { animation: pulse-border 2s infinite; }
      `}</style>

      <CelebrationOverlay show={showCelebration} message={celebrationMsg} />
      <CardCompleteAnimation show={cardAnimation.show} isCorrect={cardAnimation.isCorrect} />

      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenQuiz
          </h1>
          <p className="text-gray-500">Flashcard Mode</p>
        </div>

        {/* Progress & Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Session Progress</div>
              <div className="text-lg font-semibold">{currentIndex + 1} / {cards.length} cards</div>
            </div>
            <ProgressRing progress={progress} />
          </div>
          <SessionStats stats={stats} />
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setMode('swipe')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === 'swipe' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            👆 Swipe Mode
          </button>
          <button
            onClick={() => setMode('classic')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === 'classic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎯 Classic Mode
          </button>
        </div>

        {/* Current card info */}
        {currentCard && (
          <div className="flex items-center justify-between">
            <MasteryBadge level={currentCard.mastery} />
            {stats.streak >= 3 && (
              <div className="flex items-center gap-1 text-orange-500 font-semibold animate-pulse">
                <span className="text-xl">🔥</span>
                <span>{stats.streak} streak!</span>
              </div>
            )}
          </div>
        )}

        {/* Card area */}
        {currentCard ? (
          <div className="relative h-80">
            {mode === 'swipe' ? (
              // Swipe mode - stacked cards
              <>
                {cards.slice(currentIndex, currentIndex + 3).reverse().map((card, idx, arr) => (
                  <SwipeableCard
                    key={card.id}
                    card={card}
                    isTop={idx === arr.length - 1}
                    onSwipe={handleSwipe}
                    zIndex={idx}
                    style={{
                      transform: `scale(${1 - (arr.length - 1 - idx) * 0.05}) translateY(${(arr.length - 1 - idx) * 8}px)`,
                      opacity: 1 - (arr.length - 1 - idx) * 0.2
                    }}
                  />
                ))}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm text-gray-400 px-4">
                  <span>← Swipe left: Again</span>
                  <span>Swipe right: Got it →</span>
                </div>
              </>
            ) : (
              // Classic mode - tap to flip
              <div className="animate-cardEnter">
                <FlashCard
                  front={currentCard.front}
                  back={currentCard.back}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-xl font-bold text-gray-800">Session Complete!</div>
              <div className="text-gray-500 mt-2">
                You reviewed {stats.reviewed} cards with {Math.round((stats.correct / stats.reviewed) * 100)}% accuracy
              </div>
            </div>
          </div>
        )}

        {/* Confidence buttons (classic mode only) */}
        {mode === 'classic' && currentCard && (
          <div className={`transition-all duration-300 ${showConfidence ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <ConfidenceButtons onRate={handleConfidenceRate} disabled={!isFlipped} />
          </div>
        )}

        {/* Reset button */}
        <button
          onClick={resetSession}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-colors"
        >
          🔄 Reset Session
        </button>

        {/* Instructions */}
        <div className="text-xs text-gray-400 text-center space-y-1">
          <p><strong>Swipe Mode:</strong> Drag cards left (don't know) or right (know it)</p>
          <p><strong>Classic Mode:</strong> Tap to flip, then rate your confidence</p>
        </div>
      </div>
    </div>
  );
}
