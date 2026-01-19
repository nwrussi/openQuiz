import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Copy, Check, Users, Crown, Play, LogOut } from 'lucide-react'

export default function Lobby() {
  const navigate = useNavigate()
  const {
    roomCode,
    players,
    isHost,
    startGame,
    leaveGame,
    error
  } = useGame()

  const [copiedCode, setCopiedCode] = useState(false)
  const [bouncingPlayer, setBouncingPlayer] = useState(null)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    if (!roomCode) {
      navigate('/')
    }
  }, [roomCode, navigate])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleStartGame = async () => {
    try {
      setIsStarting(true)
      await startGame()
      // Navigate to game screen (to be implemented)
      // For now, just show a message
      alert('Game starting! (Game screen to be implemented)')
    } catch (err) {
      console.error('Failed to start game:', err)
      setIsStarting(false)
    }
  }

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave?')) {
      leaveGame()
      navigate('/')
    }
  }

  const handlePlayerClick = (playerId) => {
    setBouncingPlayer(playerId)
    setTimeout(() => setBouncingPlayer(null), 500)
  }

  if (!roomCode) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .bounce-animation {
          animation: bounce 0.5s ease-in-out;
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="fade-in mb-8 text-center">
          <button
            onClick={handleLeave}
            className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Leave
          </button>

          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/20">
              <Users size={24} className="text-white" />
              <span className="text-white font-medium">
                {isHost ? 'Hosting' : 'Joined'} Game
              </span>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-white mb-4">
            Waiting Room
          </h1>
          <p className="text-xl text-white/90">
            {isHost
              ? 'Share the code with your players!'
              : 'Waiting for host to start the game...'}
          </p>
        </div>

        {/* Room Code Display */}
        <div className="fade-in mb-12" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border-2 border-white/20 p-8 text-center">
            <p className="text-white/80 text-lg mb-4 font-medium">Room Code</p>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-white rounded-2xl px-12 py-6 shadow-2xl pulse-animation">
                <div className="text-6xl font-black tracking-widest text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                  {roomCode}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className={`
                  p-4 rounded-xl transition-all transform hover:scale-110
                  ${copiedCode
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
              >
                {copiedCode ? <Check size={24} /> : <Copy size={24} />}
              </button>
            </div>
            {copiedCode && (
              <p className="text-green-300 font-medium mt-4 fade-in">
                Code copied to clipboard!
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 fade-in">
            <div className="bg-red-500/20 backdrop-blur-md border-2 border-red-500/50 rounded-2xl p-4 text-center">
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div className="fade-in mb-8" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border-2 border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users size={28} />
                Players ({players.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player.id)}
                  className={`
                    relative bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl p-6
                    cursor-pointer transition-all transform hover:scale-105
                    border-2 border-white/30 fade-in
                    ${bouncingPlayer === player.id ? 'bounce-animation' : ''}
                  `}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  {player.isHost && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                      <Crown size={16} className="text-yellow-900" />
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-5xl mb-3">{player.avatar}</div>
                    <p className="text-white font-semibold text-sm truncate">
                      {player.name}
                    </p>
                    {player.isHost && (
                      <p className="text-yellow-300 text-xs font-medium mt-1">
                        Host
                      </p>
                    )}
                  </div>

                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 shimmer pointer-events-none rounded-2xl opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              ))}

              {/* Waiting for players placeholder */}
              {players.length < 4 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-center fade-in">
                  <div className="text-4xl mb-2 opacity-50">👥</div>
                  <p className="text-white/60 text-xs">
                    Waiting for more players...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Start Game Button (Host Only) */}
        {isHost && (
          <div className="fade-in text-center" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartGame}
              disabled={isStarting || players.length < 1}
              className={`
                inline-flex items-center gap-3 px-12 py-6 rounded-2xl font-bold text-xl
                transition-all transform hover:-translate-y-1 shadow-2xl
                ${isStarting || players.length < 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 pulse-animation'
                }
                text-white
              `}
            >
              <Play size={28} />
              {isStarting ? 'Starting Game...' : 'START GAME'}
            </button>

            {players.length < 2 && (
              <p className="text-white/60 mt-4 text-sm">
                Tip: You can start with just yourself for testing, but it's more fun with friends!
              </p>
            )}
          </div>
        )}

        {/* Player Status */}
        {!isHost && (
          <div className="fade-in text-center" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">
                Connected and ready!
              </span>
            </div>
          </div>
        )}

        {/* Fun Interactions Hint */}
        <div className="mt-8 text-center fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-white/60 text-sm">
            💡 Click on player avatars to make them bounce!
          </p>
        </div>
      </div>
    </div>
  )
}
