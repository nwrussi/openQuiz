import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import deckService from '../services/deckService'
import storage from '../services/storage'

export default function Library() {
  const navigate = useNavigate()
  const [decks, setDecks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState([])
  const [hoveredDeck, setHoveredDeck] = useState(null)

  useEffect(() => {
    loadDecks()
    loadCategories()
  }, [])

  const loadDecks = () => {
    const allDecks = deckService.getAllDecks()
    setDecks(allDecks)
  }

  const loadCategories = () => {
    const cats = ['All', ...deckService.getCategories()]
    setCategories(cats)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleDelete = (deckId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this deck?')) {
      deckService.deleteDeck(deckId)
      loadDecks()
    }
  }

  const handleDuplicate = (deckId, e) => {
    e.stopPropagation()
    deckService.duplicateDeck(deckId)
    loadDecks()
  }

  const handleExport = (deckId, e) => {
    e.stopPropagation()
    const result = deckService.exportDeck(deckId)
    if (result.success) {
      const dataStr = JSON.stringify(result.data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${result.data.deck.name}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result)
            const result = deckService.importDeck(data)
            if (result.success) {
              loadDecks()
              alert('Deck imported successfully!')
            } else {
              alert(`Import failed: ${result.error}`)
            }
          } catch (error) {
            alert('Invalid file format')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const filteredDecks = decks.filter(deck => {
    const matchesSearch = deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deck.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || deck.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-in">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">My Library</h1>
            <p className="text-white/80 text-lg">{decks.length} decks • {decks.reduce((sum, d) => sum + d.cards.length, 0)} total cards</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-medium border border-white/30 transition-all hover:scale-105"
            >
              📥 Import Deck
            </button>
            <button
              onClick={() => navigate('/deck/new')}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
            >
              ➕ Create New Deck
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search decks..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 backdrop-blur-md text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all text-lg"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl border border-white/30 focus:outline-none focus:border-white/60 cursor-pointer transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-purple-600">{cat}</option>
            ))}
          </select>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg border border-white/20 transition-all"
        >
          ← Back to Home
        </button>

        {/* Decks Grid */}
        {filteredDecks.length === 0 ? (
          <div className="text-center py-20 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-8xl mb-4">📚</div>
            <h2 className="text-3xl font-bold text-white mb-2">No decks found</h2>
            <p className="text-white/70 text-lg mb-6">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try a different search or filter'
                : 'Create your first deck to get started!'}
            </p>
            {!searchQuery && selectedCategory === 'All' && (
              <button
                onClick={() => navigate('/deck/new')}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
              >
                ➕ Create Your First Deck
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck, index) => (
              <div
                key={deck.id}
                onMouseEnter={() => setHoveredDeck(deck.id)}
                onMouseLeave={() => setHoveredDeck(null)}
                onClick={() => navigate(`/deck/${deck.id}/edit`)}
                className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-white/40 hover:shadow-2xl fade-in"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                {/* Shimmer on hover */}
                {hoveredDeck === deck.id && (
                  <div className="absolute inset-0 shimmer pointer-events-none" />
                )}

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${deck.color} opacity-20`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{deck.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{deck.name}</h3>
                        <p className="text-white/60 text-sm">{deck.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 mb-4 line-clamp-2">{deck.description || 'No description'}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="text-white/90">
                      <span className="font-bold">{deck.stats.totalCards}</span> cards
                    </div>
                    <div className="text-white/90">
                      <span className="font-bold">{deck.stats.studied}</span> studied
                    </div>
                    <div className="text-white/90">
                      <span className="font-bold">{deck.stats.mastered}</span> mastered
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/flashcards?deck=${deck.id}`)
                      }}
                      className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all"
                    >
                      🎴 Study
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(deck.id, e)}
                      className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={(e) => handleExport(deck.id, e)}
                      className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                      title="Export"
                    >
                      📤
                    </button>
                    <button
                      onClick={(e) => handleDelete(deck.id, e)}
                      className="px-3 py-2 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg transition-all"
                      title="Delete"
                    >
                      🗑️
                    </button>
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
