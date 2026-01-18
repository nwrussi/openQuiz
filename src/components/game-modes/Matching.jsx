import React, { useState, useEffect } from 'react';

// Draggable term card
const TermCard = ({ term, isMatched, isDragging, onDragStart, onDragEnd }) => (
  <div
    draggable={!isMatched}
    onDragStart={(e) => {
      e.dataTransfer.setData('termId', term.id);
      onDragStart(term.id);
    }}
    onDragEnd={onDragEnd}
    className={`p-4 rounded-xl border-2 transition-all duration-300 select-none ${
      isMatched 
        ? 'bg-emerald-50 border-emerald-400 opacity-50 cursor-default' 
        : isDragging
          ? 'bg-blue-100 border-blue-500 scale-105 shadow-xl cursor-grabbing'
          : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md cursor-grab active:cursor-grabbing'
    }`}
  >
    <div className="flex items-center gap-2">
      {isMatched && <span className="text-emerald-500">✓</span>}
      <span className={`font-medium ${isMatched ? 'text-emerald-700' : 'text-gray-800'}`}>
        {term.text}
      </span>
    </div>
  </div>
);

// Definition drop zone
const DefinitionZone = ({ definition, matchedTerm, isOver, onDrop, onDragOver, onDragLeave, showWrong }) => (
  <div
    onDragOver={(e) => {
      e.preventDefault();
      onDragOver(definition.id);
    }}
    onDragLeave={onDragLeave}
    onDrop={(e) => {
      e.preventDefault();
      const termId = e.dataTransfer.getData('termId');
      onDrop(termId, definition.id);
    }}
    className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 min-h-[80px] ${
      matchedTerm
        ? 'bg-emerald-50 border-emerald-400 border-solid'
        : isOver
          ? 'bg-blue-50 border-blue-500 scale-[1.02]'
          : showWrong
            ? 'bg-red-50 border-red-400 animate-shake'
            : 'bg-gray-50 border-gray-300 hover:border-gray-400'
    }`}
  >
    <div className="text-sm text-gray-500 mb-2">Definition</div>
    <div className="text-gray-800">{definition.text}</div>
    {matchedTerm && (
      <div className="mt-3 pt-3 border-t border-emerald-200 animate-slideIn">
        <div className="flex items-center gap-2 text-emerald-700 font-medium">
          <span>✓</span>
          <span>{matchedTerm.text}</span>
        </div>
      </div>
    )}
  </div>
);

// Connection line SVG
const ConnectionLines = ({ connections, containerRef }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const newLines = connections.map(conn => {
      const termEl = containerRef.current.querySelector(`[data-term-id="${conn.termId}"]`);
      const defEl = containerRef.current.querySelector(`[data-def-id="${conn.defId}"]`);
      
      if (!termEl || !defEl) return null;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const termRect = termEl.getBoundingClientRect();
      const defRect = defEl.getBoundingClientRect();
      
      return {
        x1: termRect.right - containerRect.left,
        y1: termRect.top + termRect.height / 2 - containerRect.top,
        x2: defRect.left - containerRect.left,
        y2: defRect.top + defRect.height / 2 - containerRect.top,
        isCorrect: conn.isCorrect
      };
    }).filter(Boolean);
    
    setLines(newLines);
  }, [connections, containerRef]);

  return (
    <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
      {lines.map((line, idx) => (
        <g key={idx}>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.isCorrect ? '#10b981' : '#ef4444'}
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-drawLine"
            style={{ 
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              animation: 'drawLine 0.5s ease-out forwards'
            }}
          />
          <circle
            cx={line.x1}
            cy={line.y1}
            r="5"
            fill={line.isCorrect ? '#10b981' : '#ef4444'}
            className="animate-scaleIn"
          />
          <circle
            cx={line.x2}
            cy={line.y2}
            r="5"
            fill={line.isCorrect ? '#10b981' : '#ef4444'}
            className="animate-scaleIn"
          />
        </g>
      ))}
    </svg>
  );
};

// Timer with urgency animation
const MatchTimer = ({ seconds, isWarning, isPaused }) => (
  <div className={`flex items-center gap-2 font-mono text-xl ${
    isWarning ? 'text-red-500' : 'text-gray-700'
  }`}>
    <div className={`relative ${isWarning ? 'animate-pulse' : ''}`}>
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle
          cx="18" cy="18" r="16"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <circle
          cx="18" cy="18" r="16"
          fill="none"
          stroke={isWarning ? '#ef4444' : '#3b82f6'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={100}
          strokeDashoffset={100 - (seconds / 60) * 100}
          transform="rotate(-90 18 18)"
          className="transition-all duration-1000"
        />
      </svg>
    </div>
    <span className={isWarning ? 'animate-bounce' : ''}>{seconds}s</span>
    {isPaused && <span className="text-sm text-gray-400">(paused)</span>}
  </div>
);

// Score popup animation
const ScorePopup = ({ score, show, position }) => {
  if (!show) return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50 animate-scoreFloat"
      style={{ left: position.x, top: position.y }}
    >
      <div className={`font-bold text-2xl ${score > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {score > 0 ? '+' : ''}{score}
      </div>
    </div>
  );
};

// Main matching game component
export default function OpenQuizMatching() {
  const [terms] = useState([
    { id: 't1', text: 'Photosynthesis', matchId: 'd1' },
    { id: 't2', text: 'Mitochondria', matchId: 'd2' },
    { id: 't3', text: 'Nucleus', matchId: 'd3' },
    { id: 't4', text: 'Ribosome', matchId: 'd4' },
    { id: 't5', text: 'Cell membrane', matchId: 'd5' },
  ]);

  const [definitions] = useState([
    { id: 'd1', text: 'Process of converting light energy into chemical energy' },
    { id: 'd2', text: 'Powerhouse of the cell, produces ATP' },
    { id: 'd3', text: 'Contains genetic material (DNA)' },
    { id: 'd4', text: 'Site of protein synthesis' },
    { id: 'd5', text: 'Controls what enters and exits the cell' },
  ]);

  const [matches, setMatches] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [overDefId, setOverDefId] = useState(null);
  const [wrongAttempt, setWrongAttempt] = useState(null);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [scorePopup, setScorePopup] = useState({ show: false, score: 0, position: { x: 0, y: 0 } });
  const [gameComplete, setGameComplete] = useState(false);
  const [connections, setConnections] = useState([]);
  const containerRef = React.useRef(null);

  // Shuffle definitions for display
  const [shuffledDefs] = useState(() => [...definitions].sort(() => Math.random() - 0.5));

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !gameComplete) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, gameComplete]);

  // Check for game completion
  useEffect(() => {
    if (matches.length === terms.length) {
      setGameComplete(true);
    }
  }, [matches, terms.length]);

  const handleDrop = (termId, defId) => {
    const term = terms.find(t => t.id === termId);
    const isCorrect = term.matchId === defId;

    if (isCorrect) {
      setMatches(prev => [...prev, { termId, defId }]);
      setConnections(prev => [...prev, { termId, defId, isCorrect: true }]);
      
      // Time bonus scoring
      const timeBonus = Math.floor(timer / 10) * 10;
      const points = 100 + timeBonus;
      setScore(prev => prev + points);
      
      // Show score popup
      setScorePopup({ 
        show: true, 
        score: points, 
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
      });
      setTimeout(() => setScorePopup({ show: false, score: 0, position: { x: 0, y: 0 } }), 1000);
    } else {
      setWrongAttempt(defId);
      setScore(prev => Math.max(0, prev - 25));
      setScorePopup({ 
        show: true, 
        score: -25, 
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
      });
      setTimeout(() => {
        setWrongAttempt(null);
        setScorePopup({ show: false, score: 0, position: { x: 0, y: 0 } });
      }, 500);
    }

    setDraggingId(null);
    setOverDefId(null);
  };

  const getMatchedTerm = (defId) => {
    const match = matches.find(m => m.defId === defId);
    if (!match) return null;
    return terms.find(t => t.id === match.termId);
  };

  const isTermMatched = (termId) => matches.some(m => m.termId === termId);

  const resetGame = () => {
    setMatches([]);
    setConnections([]);
    setTimer(60);
    setScore(0);
    setGameComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes scoreFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
        @keyframes completeCelebrate {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .animate-scoreFloat { animation: scoreFloat 1s ease-out forwards; }
        .animate-completeCelebrate { animation: completeCelebrate 0.5s ease-out forwards; }
      `}</style>

      <ScorePopup {...scorePopup} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenQuiz
          </h1>
          <p className="text-gray-500">Matching Game</p>
        </div>

        {/* Stats bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-sm text-gray-500">Matched</div>
              <div className="text-2xl font-bold text-blue-600">{matches.length}/{terms.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Score</div>
              <div className="text-2xl font-bold text-emerald-600">{score}</div>
            </div>
          </div>
          <MatchTimer seconds={timer} isWarning={timer <= 10} />
        </div>

        {/* Game complete overlay */}
        {gameComplete && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-8 text-white text-center animate-completeCelebrate">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Perfect Match!</h2>
            <p className="text-emerald-100 mb-4">You matched all {terms.length} pairs</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm text-emerald-100">Final Score</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-3xl font-bold">{60 - timer}s</div>
                <div className="text-sm text-emerald-100">Time Used</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-3xl font-bold">{Math.round((matches.length / terms.length) * 100)}%</div>
                <div className="text-sm text-emerald-100">Accuracy</div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Game area */}
        {!gameComplete && (
          <div className="relative" ref={containerRef}>
            <ConnectionLines connections={connections} containerRef={containerRef} />
            
            <div className="grid grid-cols-2 gap-8">
              {/* Terms column */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-4">Terms</h3>
                {terms.map((term, idx) => (
                  <div key={term.id} data-term-id={term.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-slideIn">
                    <TermCard
                      term={term}
                      isMatched={isTermMatched(term.id)}
                      isDragging={draggingId === term.id}
                      onDragStart={setDraggingId}
                      onDragEnd={() => setDraggingId(null)}
                    />
                  </div>
                ))}
              </div>

              {/* Definitions column */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-4">Definitions</h3>
                {shuffledDefs.map((def, idx) => (
                  <div key={def.id} data-def-id={def.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-slideIn">
                    <DefinitionZone
                      definition={def}
                      matchedTerm={getMatchedTerm(def.id)}
                      isOver={overDefId === def.id}
                      showWrong={wrongAttempt === def.id}
                      onDrop={handleDrop}
                      onDragOver={setOverDefId}
                      onDragLeave={() => setOverDefId(null)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400">
          Drag terms from the left and drop them on their matching definitions
        </div>
      </div>
    </div>
  );
}
