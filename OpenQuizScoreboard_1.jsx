import React, { useState, useEffect } from 'react';

// Animated number counter
const AnimatedNumber = ({ value, duration = 500 }) => {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const start = display;
    const diff = value - start;
    const steps = 20;
    const stepTime = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current++;
      setDisplay(Math.round(start + (diff * current) / steps));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{display.toLocaleString()}</span>;
};

// Score change indicator (+50, -10, etc)
const ScorePopup = ({ change, show }) => {
  if (!show) return null;
  const isPositive = change > 0;
  
  return (
    <span className={`absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-lg animate-scorePopup ${
      isPositive ? 'text-emerald-500' : 'text-red-500'
    }`}>
      {isPositive ? '+' : ''}{change}
    </span>
  );
};

// Individual player row
const PlayerRow = ({ player, rank, isCurrentUser, showChange }) => {
  const getRankStyle = () => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    return 'bg-gray-100 text-gray-600';
  };

  const getRankIcon = () => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 animate-slideIn ${
        isCurrentUser ? 'bg-blue-50 border-2 border-blue-300 shadow-lg scale-[1.02]' : 'bg-white border border-gray-100'
      }`}
      style={{ animationDelay: `${rank * 0.1}s` }}
    >
      {/* Rank badge */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle()}`}>
        {getRankIcon()}
      </div>
      
      {/* Avatar */}
      <div className="relative">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
          {player.name.charAt(0)}
        </div>
        {player.streak >= 3 && (
          <span className="absolute -top-1 -right-1 text-lg animate-bounce">🔥</span>
        )}
      </div>
      
      {/* Name & stats */}
      <div className="flex-1">
        <div className="font-semibold text-gray-800 flex items-center gap-2">
          {player.name}
          {isCurrentUser && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">You</span>}
        </div>
        <div className="text-sm text-gray-500">
          {player.correct}/{player.total} correct • {Math.round((player.correct/player.total)*100)}%
        </div>
      </div>
      
      {/* Score */}
      <div className="relative text-right">
        <ScorePopup change={player.lastChange} show={showChange && player.lastChange !== 0} />
        <div className="text-2xl font-bold text-gray-800">
          <AnimatedNumber value={player.score} />
        </div>
        <div className="text-xs text-gray-400">points</div>
      </div>
    </div>
  );
};

// XP Progress bar
const XPBar = ({ current, max, level }) => {
  const percentage = (current / max) * 100;
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700">Level {level}</span>
        <span className="text-sm text-gray-500">{current} / {max} XP</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};

// Stats card
const StatCard = ({ icon, label, value, trend }) => (
  <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3 hover:scale-105 transition-transform">
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500 flex items-center gap-1">
        {label}
        {trend && (
          <span className={`text-xs ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </div>
);

// Main scoreboard component
export default function OpenQuizScoreboard() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Alex', score: 2450, correct: 24, total: 30, streak: 5, color: 'from-blue-400 to-blue-600', lastChange: 0 },
    { id: 2, name: 'Jordan', score: 2280, correct: 22, total: 30, streak: 2, color: 'from-purple-400 to-purple-600', lastChange: 0 },
    { id: 3, name: 'Sam', score: 2100, correct: 21, total: 30, streak: 0, color: 'from-emerald-400 to-emerald-600', lastChange: 0 },
    { id: 4, name: 'Taylor', score: 1850, correct: 18, total: 30, streak: 1, color: 'from-orange-400 to-orange-600', lastChange: 0 },
    { id: 5, name: 'Casey', score: 1620, correct: 16, total: 30, streak: 0, color: 'from-pink-400 to-pink-600', lastChange: 0 },
  ]);
  const [showChanges, setShowChanges] = useState(false);
  const [currentUserId] = useState(2);

  const simulateScoreUpdate = () => {
    setPlayers(prev => {
      const updated = prev.map(p => {
        const change = Math.floor(Math.random() * 200) - 50;
        return { ...p, score: Math.max(0, p.score + change), lastChange: change };
      });
      return updated.sort((a, b) => b.score - a.score);
    });
    setShowChanges(true);
    setTimeout(() => setShowChanges(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scorePopup {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -10px) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -20px) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0.3); }
        }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-scorePopup { animation: scorePopup 1.5s ease-out forwards; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenQuiz
          </h1>
          <p className="text-gray-500">Live Scoreboard</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon="🎯" label="Accuracy" value="73%" trend={5} />
          <StatCard icon="⚡" label="Avg Time" value="4.2s" trend={-12} />
          <StatCard icon="🔥" label="Best Streak" value="5" />
        </div>

        {/* XP Bar */}
        <XPBar current={750} max={1000} level={12} />

        {/* Leaderboard */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Leaderboard</h2>
            <button
              onClick={simulateScoreUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors active:scale-95"
            >
              Simulate Update
            </button>
          </div>
          
          <div className="space-y-2">
            {players.map((player, idx) => (
              <PlayerRow
                key={player.id}
                player={player}
                rank={idx + 1}
                isCurrentUser={player.id === currentUserId}
                showChange={showChanges}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="text-xs text-gray-400 text-center space-x-4">
          <span>👑 1st Place</span>
          <span>🔥 3+ Streak</span>
          <span>Click "Simulate Update" to see animations</span>
        </div>
      </div>
    </div>
  );
}
