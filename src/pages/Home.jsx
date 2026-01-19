import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function Home() {
  const navigate = useNavigate()
  const { joinGame } = useGame()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [gameCode, setGameCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [codeFocused, setCodeFocused] = useState(false)

  const handleJoinGame = async (e) => {
    e.preventDefault()
    if (!gameCode.trim() || !playerName.trim()) {
      setJoinError('Please enter both code and name')
      return
    }

    try {
      setIsJoining(true)
      setJoinError('')
      await joinGame(gameCode.toUpperCase(), playerName)
      navigate('/lobby')
    } catch (error) {
      setJoinError(error.message || 'Failed to join game')
    } finally {
      setIsJoining(false)
    }
  }

  const gameModes = [
    {
      id: 'library',
      title: 'My Library',
      description: 'Create and manage your flashcard decks',
      icon: '📚',
      color: 'from-indigo-400 to-indigo-600',
      path: '/library',
      featured: true
    },
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .float {
          animation: float 3s ease-in-out infinite;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(0,217,255,0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Header with OpenStudy branding */}
      <div className="fade-in mb-12 text-center">
        <h1 className="text-8xl font-bold mb-4 float" style={{ fontFamily: 'Georgia, serif' }}>
          <span className="text-black">open</span><span className="text-[#00D9FF]">STUDY</span>
        </h1>
        <p className="text-2xl text-gray-700 font-medium mb-2">
          Free • Open Source • Collaborative Learning
        </p>
        <p className="text-lg text-gray-600">
          A modern flashcard platform built for students, by students
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center fade-in" style={{ animationDelay: '0.2s' }}>
        {['No Ads', 'No Subscriptions', 'Offline First', 'Share Freely'].map((feature, i) => (
          <div
            key={i}
            className="bg-[#00D9FF]/10 border-2 border-[#00D9FF]/30 px-6 py-2 rounded-full text-gray-800 font-semibold hover:bg-[#00D9FF]/20 transition-all"
          >
            {feature}
          </div>
        ))}
      </div>

      {/* JOIN GAME SECTION (Social Gateway) */}
      <div className="w-full max-w-2xl mb-12 fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="relative bg-gray-50 rounded-3xl border-2 border-gray-200 p-8 overflow-hidden shadow-lg">
          {/* Decorative rings on focus */}
          {codeFocused && (
            <>
              <div className="absolute inset-0 border-4 border-[#00D9FF]/30 rounded-3xl pulse-ring" />
              <div className="absolute inset-0 border-4 border-[#00D9FF]/30 rounded-3xl pulse-ring" style={{ animationDelay: '0.5s' }} />
            </>
          )}

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-black mb-2 text-center">
              Join a Live Session
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Enter a game code to join your friends
            </p>

            <form onSubmit={handleJoinGame} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  onFocus={() => setCodeFocused(true)}
                  onBlur={() => setCodeFocused(false)}
                  placeholder="ENTER GAME CODE"
                  maxLength={4}
                  className="w-full text-center text-4xl font-black tracking-widest px-6 py-6 rounded-2xl border-4 border-gray-300 focus:border-[#00D9FF] focus:ring-4 focus:ring-[#00D9FF]/30 transition-all bg-white text-gray-900 placeholder-gray-400 uppercase"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your Name"
                  maxLength={20}
                  className="w-full text-center text-xl px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#00D9FF] focus:ring-4 focus:ring-[#00D9FF]/30 transition-all bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {joinError && (
                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 text-center">
                  <p className="text-red-700 font-medium">{joinError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isJoining || !gameCode.trim() || !playerName.trim()}
                className={`
                  w-full py-4 rounded-2xl font-bold text-xl transition-all transform
                  ${isJoining || !gameCode.trim() || !playerName.trim()
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-[#00D9FF] hover:bg-[#00c4e6] hover:scale-105 shadow-lg hover:shadow-xl text-black'
                  }
                `}
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-50 px-4 text-gray-500 text-sm font-medium">OR</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/library')}
              className="mt-4 w-full py-4 rounded-2xl font-bold text-lg bg-black hover:bg-gray-800 text-white border-2 border-black transition-all"
            >
              📚 Host a Session from Your Library
            </button>
          </div>
        </div>
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
              relative overflow-hidden rounded-2xl bg-white
              border-2 border-gray-200 p-8 cursor-pointer
              transition-all duration-300 transform shadow-md
              ${hoveredCard === mode.id ? 'scale-105 border-[#00D9FF] shadow-2xl' : 'hover:scale-102'}
            `}
            style={{ animationDelay: `${0.5 + index * 0.1}s` }}
          >
            {/* Shimmer effect on hover */}
            {hoveredCard === mode.id && (
              <div className="absolute inset-0 shimmer pointer-events-none" />
            )}

            {/* Cyan overlay on hover */}
            <div className={`absolute inset-0 bg-[#00D9FF] opacity-0 transition-opacity duration-300 ${hoveredCard === mode.id ? 'opacity-5' : ''}`} />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-6xl mb-4">{mode.icon}</div>
              <h3 className="text-2xl font-bold text-black mb-2">{mode.title}</h3>
              <p className="text-gray-600">{mode.description}</p>

              {/* Arrow on hover */}
              <div className={`
                mt-4 flex items-center text-[#00D9FF] font-bold
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
        <div className="text-black">
          <div className="text-3xl font-bold text-[#00D9FF]">100%</div>
          <div className="text-gray-600">Free Forever</div>
        </div>
        <div className="w-px bg-gray-300" />
        <div className="text-black">
          <div className="text-3xl font-bold text-[#00D9FF]">0</div>
          <div className="text-gray-600">Ads</div>
        </div>
        <div className="w-px bg-gray-300" />
        <div className="text-black">
          <div className="text-3xl font-bold text-[#00D9FF]">∞</div>
          <div className="text-gray-600">Flashcards</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 fade-in" style={{ animationDelay: '1s' }}>
        <p>Built with ❤️ by the open source community</p>
        <p className="mt-2 text-sm">Powered by React • Tailwind • LocalStorage</p>
      </div>
    </div>
  )
}
