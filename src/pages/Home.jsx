import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)

  const gameModes = [
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Master your material with interactive flashcards',
      icon: '🎴',
      color: 'from-blue-400 to-blue-600',
      path: '/flashcards'
    },
    {
      id: 'matching',
      title: 'Matching',
      description: 'Match terms and definitions against the clock',
      icon: '🎯',
      color: 'from-green-400 to-green-600',
      path: '/matching'
    },
    {
      id: 'scoreboard',
      title: 'Leaderboard',
      description: 'See how you stack up against others',
      icon: '🏆',
      color: 'from-yellow-400 to-yellow-600',
      path: '/scoreboard'
    },
    {
      id: 'summary',
      title: 'Session Summary',
      description: 'Review your progress and achievements',
      icon: '📊',
      color: 'from-purple-400 to-purple-600',
      path: '/summary'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .float {
          animation: float 3s ease-in-out infinite;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Header */}
      <div className="fade-in mb-12 text-center">
        <h1 className="text-7xl font-bold text-white mb-4 float">
          Open<span className="text-yellow-300">Quiz</span>
        </h1>
        <p className="text-xl text-white/90 font-medium">
          Free • Open Source • Collaborative Learning
        </p>
        <p className="text-lg text-white/70 mt-2">
          A modern flashcard platform built for students, by students
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center fade-in" style={{ animationDelay: '0.2s' }}>
        {['No Ads', 'No Subscriptions', 'Offline First', 'Share Freely'].map((feature, i) => (
          <div
            key={i}
            className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-medium border border-white/30"
          >
            {feature}
          </div>
        ))}
      </div>

      {/* Game Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full fade-in" style={{ animationDelay: '0.4s' }}>
        {gameModes.map((mode, index) => (
          <div
            key={mode.id}
            onMouseEnter={() => setHoveredCard(mode.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate(mode.path)}
            className={`
              relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md
              border-2 border-white/20 p-8 cursor-pointer
              transition-all duration-300 transform
              ${hoveredCard === mode.id ? 'scale-105 border-white/40 shadow-2xl' : 'hover:scale-102'}
            `}
            style={{ animationDelay: `${0.5 + index * 0.1}s` }}
          >
            {/* Shimmer effect on hover */}
            {hoveredCard === mode.id && (
              <div className="absolute inset-0 shimmer pointer-events-none" />
            )}

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 transition-opacity duration-300 ${hoveredCard === mode.id ? 'opacity-20' : ''}`} />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-6xl mb-4">{mode.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-white/80">{mode.description}</p>

              {/* Arrow on hover */}
              <div className={`
                mt-4 flex items-center text-white font-medium
                transition-all duration-300
                ${hoveredCard === mode.id ? 'translate-x-2 opacity-100' : 'translate-x-0 opacity-0'}
              `}>
                Start Learning →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 flex gap-8 text-center fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="text-white">
          <div className="text-3xl font-bold">100%</div>
          <div className="text-white/70">Free Forever</div>
        </div>
        <div className="w-px bg-white/30" />
        <div className="text-white">
          <div className="text-3xl font-bold">0</div>
          <div className="text-white/70">Ads</div>
        </div>
        <div className="w-px bg-white/30" />
        <div className="text-white">
          <div className="text-3xl font-bold">∞</div>
          <div className="text-white/70">Flashcards</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-white/60 fade-in" style={{ animationDelay: '1s' }}>
        <p>Built with ❤️ by the open source community</p>
        <p className="mt-2 text-sm">Powered by AWS • React • Tailwind</p>
      </div>
    </div>
  )
}
