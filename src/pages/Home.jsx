import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useLibrary } from '../context/LibraryContext'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Play, Users, Plus, Search, Home as HomeIcon, Library, Gamepad2, Trophy, LogOut, User } from 'lucide-react'
import AuthModal from '../components/auth/AuthModal'

export default function Home() {
  const navigate = useNavigate()
  const { joinGame } = useGame()
  const { decks } = useLibrary()
  const { user, isAuthenticated, logout } = useAuth()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [gameCode, setGameCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

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

  const recentDecks = decks.slice(0, 2)

  const featuredSets = [
    {
      id: 'flashcards',
      title: 'Study with Flashcards',
      description: 'Master your material with spaced repetition',
      icon: '🎴',
      cardCount: '∞',
      path: '/flashcards'
    },
    {
      id: 'matching',
      title: 'Matching Game',
      description: 'Match terms and definitions against the clock',
      icon: '🎯',
      cardCount: '∞',
      path: '/matching'
    },
    {
      id: 'summary',
      title: 'Progress Tracking',
      description: 'Review your learning statistics and achievements',
      icon: '📊',
      cardCount: '∞',
      path: '/summary'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-xl bg-[#00D9FF] flex items-center justify-center text-white text-2xl font-bold"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Q
        </button>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-[#00D9FF] transition-colors"
          >
            <HomeIcon size={24} />
          </button>
          <button
            onClick={() => navigate('/library')}
            className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#00D9FF] transition-colors"
          >
            <Library size={24} />
          </button>
          <button
            onClick={() => navigate('/flashcards')}
            className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#00D9FF] transition-colors"
          >
            <BookOpen size={24} />
          </button>
          <button
            onClick={() => navigate('/matching')}
            className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#00D9FF] transition-colors"
          >
            <Gamepad2 size={24} />
          </button>
          <button
            onClick={() => navigate('/scoreboard')}
            className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#00D9FF] transition-colors"
          >
            <Trophy size={24} />
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => navigate('/library')}
          className="w-12 h-12 rounded-xl bg-[#00D9FF] hover:bg-[#00c4e6] flex items-center justify-center text-black transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Flashcard sets, textbooks, questions"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
              />
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <span className="text-2xl">{user?.avatar || '👤'}</span>
                  <span className="font-medium text-gray-700">{user?.name}</span>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        // Navigate to profile page when implemented
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-[#00D9FF] hover:bg-[#00c4e6] text-black font-semibold rounded-lg transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              <span>open</span><span className="text-[#00D9FF]">STUDY</span>
            </h1>
            <p className="text-gray-600">Free • Open Source • Collaborative Learning</p>
          </div>

          {/* Recents Section */}
          {recentDecks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">Recents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentDecks.map((deck) => (
                  <div
                    key={deck.deckId}
                    onClick={() => navigate(`/studio/${deck.deckId}`)}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#00D9FF] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        📚
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-black mb-1 truncate group-hover:text-[#00D9FF] transition-colors">
                          {deck.title}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {deck.cards?.length || 0} cards • by you
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalize Content Section */}
          <div className="mb-12">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#00D9FF] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  Q
                </div>
                <h2 className="text-xl font-bold text-black">Join a live multiplayer session</h2>
              </div>

              <form onSubmit={handleJoinGame} className="flex gap-3">
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  placeholder="ENTER GAME CODE"
                  maxLength={4}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all uppercase text-center font-bold tracking-widest"
                />
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your Name"
                  maxLength={20}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={isJoining || !gameCode.trim() || !playerName.trim()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isJoining || !gameCode.trim() || !playerName.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#00D9FF] hover:bg-[#00c4e6] text-black'
                  }`}
                >
                  {isJoining ? 'Joining...' : 'Join Game'}
                </button>
              </form>

              {joinError && (
                <p className="text-red-600 text-sm mt-3">{joinError}</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate('/library')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
                >
                  Go to My Library
                </button>
                <button
                  onClick={() => navigate('/library')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
                >
                  Create New Deck
                </button>
              </div>
            </div>
          </div>

          {/* Staff Picks Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Staff picks</p>
                <h2 className="text-2xl font-bold text-black">Try out these study modes</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSets.map((set) => (
                <div
                  key={set.id}
                  onMouseEnter={() => setHoveredCard(set.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(set.path)}
                  className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                    hoveredCard === set.id
                      ? 'border-[#00D9FF] shadow-xl transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{set.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black mb-1">{set.title}</h3>
                      <p className="text-sm text-gray-600">{set.cardCount} cards • by openSTUDY</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{set.description}</p>
                  <div className={`inline-flex items-center gap-2 font-medium transition-colors ${
                    hoveredCard === set.id ? 'text-[#00D9FF]' : 'text-gray-600'
                  }`}>
                    Start Learning →
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Switch it up with a game */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Switch it up with a game</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => navigate('/matching')}
                className="bg-gradient-to-br from-[#00D9FF]/10 to-[#00D9FF]/5 rounded-xl border-2 border-[#00D9FF]/30 p-8 cursor-pointer hover:border-[#00D9FF] hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#00D9FF] rounded-2xl flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black group-hover:text-[#00D9FF] transition-colors">
                      Matching
                    </h3>
                    <p className="text-gray-600">Race against the clock</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Match terms and definitions as fast as you can to earn a high score
                </p>
                <div className="inline-flex items-center gap-2 text-[#00D9FF] font-semibold">
                  <Play size={20} />
                  Play Now
                </div>
              </div>

              <div
                onClick={() => navigate('/lobby')}
                className="bg-gradient-to-br from-[#00D9FF]/10 to-[#00D9FF]/5 rounded-xl border-2 border-[#00D9FF]/30 p-8 cursor-pointer hover:border-[#00D9FF] hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-3xl">
                    👥
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black group-hover:text-[#00D9FF] transition-colors">
                      Multiplayer
                    </h3>
                    <p className="text-gray-600">Play with friends</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Join or host a live session and compete with others in real-time
                </p>
                <div className="inline-flex items-center gap-2 text-[#00D9FF] font-semibold">
                  <Users size={20} />
                  Start Session
                </div>
              </div>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="flex items-center justify-center gap-12 py-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D9FF]">100%</div>
              <div className="text-sm text-gray-600">Free Forever</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D9FF]">0</div>
              <div className="text-sm text-gray-600">Ads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D9FF]">∞</div>
              <div className="text-sm text-gray-600">Flashcards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}
