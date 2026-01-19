import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import { useGame } from '../context/GameContext'
import { BookOpen, Plus, Trash2, Copy, Edit, ArrowLeft, Users } from 'lucide-react'

export default function Library() {
  const navigate = useNavigate()
  const { decks, isLoading, createDeck, deleteDeck, duplicateDeck } = useLibrary()
  const { hostGame } = useGame()
  const [hoveredDeck, setHoveredDeck] = useState(null)
  const [deletingDeck, setDeletingDeck] = useState(null)
  const [hostingDeck, setHostingDeck] = useState(null)

  const handleCreateDeck = async () => {
    try {
      const newDeck = await createDeck({
        title: 'Untitled Deck',
        description: 'Start adding cards to your new deck',
        cards: []
      })
      navigate(`/studio/${newDeck.deckId}`)
    } catch (error) {
      console.error('Failed to create deck:', error)
    }
  }

  const handleDeleteDeck = async (deckId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this deck?')) {
      try {
        setDeletingDeck(deckId)
        await deleteDeck(deckId)
      } catch (error) {
        console.error('Failed to delete deck:', error)
      } finally {
        setDeletingDeck(null)
      }
    }
  }

  const handleDuplicateDeck = async (deckId, e) => {
    e.stopPropagation()
    try {
      const duplicated = await duplicateDeck(deckId)
      navigate(`/studio/${duplicated.deckId}`)
    } catch (error) {
      console.error('Failed to duplicate deck:', error)
    }
  }

  const handleHostSession = async (deck, e) => {
    e.stopPropagation()
    if (getCardCount(deck) === 0) {
      alert('This deck has no cards. Add some cards before hosting a session.')
      return
    }

    try {
      setHostingDeck(deck.deckId)
      await hostGame(deck, 'Host')
      navigate('/lobby')
    } catch (error) {
      console.error('Failed to host session:', error)
      alert('Failed to host session. Please try again.')
    } finally {
      setHostingDeck(null)
    }
  }

  const getCardCount = (deck) => {
    return deck.cards?.length || 0
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(0,217,255,0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="fade-in mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
            <h1 className="text-4xl font-bold text-black flex items-center gap-3">
              <BookOpen size={36} className="text-[#00D9FF]" />
              My Library
            </h1>
            <p className="text-gray-600 mt-2">
              Create, edit, and manage your flashcard decks
            </p>
          </div>

          <button
            onClick={handleCreateDeck}
            className="flex items-center gap-2 bg-[#00D9FF] hover:bg-[#00c4e6] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus size={20} />
            Create New Deck
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fade-in flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-[#00D9FF]" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-[#00D9FF] opacity-30" />
              </div>
              <p className="text-gray-500 animate-pulse">Loading your decks...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && decks.length === 0 && (
          <div className="fade-in flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-8xl mb-6">📚</div>
              <h2 className="text-2xl font-bold text-black mb-2">No decks yet</h2>
              <p className="text-gray-600 mb-8">
                Start your learning journey by creating your first flashcard deck
              </p>
              <button
                onClick={handleCreateDeck}
                className="flex items-center gap-2 bg-[#00D9FF] hover:bg-[#00c4e6] text-black px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 mx-auto"
              >
                <Plus size={24} />
                Create Your First Deck
              </button>
            </div>
          </div>
        )}

        {/* Deck Grid */}
        {!isLoading && decks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {decks.map((deck, index) => (
              <div
                key={deck.deckId}
                onMouseEnter={() => setHoveredDeck(deck.deckId)}
                onMouseLeave={() => setHoveredDeck(null)}
                onClick={() => navigate(`/studio/${deck.deckId}`)}
                className={`
                  relative bg-white rounded-2xl shadow-md border-2 border-gray-200
                  cursor-pointer transition-all duration-300 transform
                  ${hoveredDeck === deck.deckId ? 'scale-105 shadow-2xl border-[#00D9FF]' : 'hover:scale-102'}
                  ${deletingDeck === deck.deckId ? 'opacity-50 pointer-events-none' : ''}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Shimmer effect on hover */}
                {hoveredDeck === deck.deckId && (
                  <div className="absolute inset-0 shimmer pointer-events-none rounded-2xl" />
                )}

                {/* Cyan Accent Bar */}
                <div className="h-2 rounded-t-2xl bg-[#00D9FF]" />

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-1 line-clamp-2">
                        {deck.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {deck.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-black">{getCardCount(deck)}</span>
                      <span>cards</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <span className="text-xs">
                        {new Date(deck.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`
                    space-y-2 transition-all duration-300
                    ${hoveredDeck === deck.deckId ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                  `}>
                    <button
                      onClick={(e) => handleHostSession(deck, e)}
                      disabled={hostingDeck === deck.deckId}
                      className="w-full flex items-center justify-center gap-2 bg-[#00D9FF] hover:bg-[#00c4e6] text-black px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <Users size={16} />
                      {hostingDeck === deck.deckId ? 'Starting...' : 'Host Session'}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/studio/${deck.deckId}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDuplicateDeck(deck.deckId, e)}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDeck(deck.deckId, e)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
