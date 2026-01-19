import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import deckService from '../services/deckService'

const COLORS = [
  { name: 'Purple-Pink', value: 'from-purple-400 to-pink-400' },
  { name: 'Blue-Purple', value: 'from-blue-400 to-purple-400' },
  { name: 'Green-Blue', value: 'from-green-400 to-blue-400' },
  { name: 'Yellow-Orange', value: 'from-yellow-400 to-orange-400' },
  { name: 'Red-Pink', value: 'from-red-400 to-pink-400' },
  { name: 'Cyan-Blue', value: 'from-cyan-400 to-blue-400' },
  { name: 'Emerald-Teal', value: 'from-emerald-400 to-teal-400' },
  { name: 'Orange-Red', value: 'from-orange-400 to-red-400' }
]

const ICONS = ['📚', '🎓', '🧠', '✏️', '📖', '🎯', '⚗️', '🔬', '🌍', '🗺️', '🎨', '🎵', '💡', '🚀', '⚡', '🔥', '🌟', '💻', '📊', '🏆', '🇪🇸', '🇫🇷', '🇩🇪', '🇮🇹']

export default function DeckEditor() {
  const navigate = useNavigate()
  const { deckId } = useParams()
  const isNewDeck = deckId === 'new'

  const [deckInfo, setDeckInfo] = useState({
    name: '',
    description: '',
    category: '',
    color: COLORS[0].value,
    icon: ICONS[0]
  })

  const [cards, setCards] = useState([])
  const [editingCardId, setEditingCardId] = useState(null)
  const [newCard, setNewCard] = useState({ front: '', back: '' })
  const [bulkInput, setBulkInput] = useState('')
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNewDeck) {
      const deck = deckService.getDeck(deckId)
      if (deck) {
        setDeckInfo({
          name: deck.name,
          description: deck.description,
          category: deck.category,
          color: deck.color,
          icon: deck.icon
        })
        setCards(deck.cards)
      } else {
        alert('Deck not found')
        navigate('/library')
      }
    }
  }, [deckId, isNewDeck, navigate])

  const handleSaveDeck = async () => {
    if (!deckInfo.name.trim()) {
      alert('Please enter a deck name')
      return
    }

    setSaving(true)

    try {
      if (isNewDeck) {
        // Create new deck
        const newDeck = deckService.createDeck(deckInfo)

        // Add cards if any
        if (cards.length > 0) {
          deckService.bulkAddCards(newDeck.id, cards)
        }

        alert('Deck created successfully!')
        navigate(`/deck/${newDeck.id}/edit`)
      } else {
        // Update existing deck
        deckService.updateDeck(deckId, deckInfo)

        // Update cards
        const currentDeck = deckService.getDeck(deckId)
        currentDeck.cards = cards
        deckService.updateDeck(deckId, { cards })

        alert('Deck saved successfully!')
      }
    } catch (error) {
      alert('Error saving deck: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      alert('Please fill in both front and back of the card')
      return
    }

    const card = {
      id: `temp-${Date.now()}`,
      ...newCard,
      mastery: 'new',
      reviewCount: 0
    }

    setCards([...cards, card])
    setNewCard({ front: '', back: '' })
  }

  const handleUpdateCard = (cardId, updates) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    ))
    setEditingCardId(null)
  }

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Delete this card?')) {
      setCards(cards.filter(card => card.id !== cardId))
    }
  }

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim())
    const newCards = []

    for (const line of lines) {
      // Support formats: "front | back" or "front\tback"
      const parts = line.includes('|') ? line.split('|') : line.split('\t')
      if (parts.length >= 2) {
        newCards.push({
          id: `temp-${Date.now()}-${Math.random()}`,
          front: parts[0].trim(),
          back: parts[1].trim(),
          mastery: 'new',
          reviewCount: 0
        })
      }
    }

    if (newCards.length > 0) {
      setCards([...cards, ...newCards])
      setBulkInput('')
      setShowBulkAdd(false)
      alert(`Added ${newCards.length} cards!`)
    } else {
      alert('No valid cards found. Use format: front | back (one per line)')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-in">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              {isNewDeck ? 'Create New Deck' : 'Edit Deck'}
            </h1>
            <p className="text-white/80 text-lg">{cards.length} cards</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-medium border border-white/30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDeck}
              disabled={saving}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : '💾 Save Deck'}
            </button>
          </div>
        </div>

        {/* Deck Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-white mb-4">Deck Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">Deck Name *</label>
              <input
                type="text"
                value={deckInfo.name}
                onChange={(e) => setDeckInfo({ ...deckInfo, name: e.target.value })}
                placeholder="e.g., Spanish Vocabulary"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/30 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 font-medium">Category</label>
              <input
                type="text"
                value={deckInfo.category}
                onChange={(e) => setDeckInfo({ ...deckInfo, category: e.target.value })}
                placeholder="e.g., Languages"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/30 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-white/80 mb-2 font-medium">Description</label>
            <textarea
              value={deckInfo.description}
              onChange={(e) => setDeckInfo({ ...deckInfo, description: e.target.value })}
              placeholder="What is this deck about?"
              rows="3"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/30 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setDeckInfo({ ...deckInfo, icon })}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      deckInfo.icon === icon
                        ? 'bg-white/40 scale-110'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 font-medium">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setDeckInfo({ ...deckInfo, color: color.value })}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color.value} transition-all ${
                      deckInfo.color === color.value
                        ? 'ring-4 ring-white scale-110'
                        : 'hover:scale-105'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Flashcards</h2>
            <button
              onClick={() => setShowBulkAdd(!showBulkAdd)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all"
            >
              {showBulkAdd ? 'Single Add' : '📋 Bulk Add'}
            </button>
          </div>

          {/* Bulk Add */}
          {showBulkAdd && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/20">
              <p className="text-white/80 mb-2 text-sm">
                Enter one card per line. Format: <code className="bg-white/20 px-2 py-1 rounded">front | back</code>
              </p>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={"Hello | Hola\nGoodbye | Adiós\nThank you | Gracias"}
                rows="6"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/30 focus:outline-none focus:border-white/60 mb-3 font-mono text-sm"
              />
              <button
                onClick={handleBulkAdd}
                className="w-full py-3 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-bold transition-all"
              >
                Add Cards
              </button>
            </div>
          )}

          {/* Add New Card */}
          {!showBulkAdd && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Front (Question/Term)</label>
                  <input
                    type="text"
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                    placeholder="e.g., Hello"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/30 focus:outline-none focus:border-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Back (Answer/Definition)</label>
                  <input
                    type="text"
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                    placeholder="e.g., Hola"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/30 focus:outline-none focus:border-white/60"
                  />
                </div>
              </div>
              <button
                onClick={handleAddCard}
                className="w-full py-3 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-bold transition-all"
              >
                ➕ Add Card
              </button>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-3">
            {cards.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-3">🎴</div>
                <p className="text-white/70">No cards yet. Add your first card above!</p>
              </div>
            ) : (
              cards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all"
                >
                  {editingCardId === card.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        defaultValue={card.front}
                        onBlur={(e) => handleUpdateCard(card.id, { front: e.target.value })}
                        className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:border-white/60"
                      />
                      <input
                        type="text"
                        defaultValue={card.back}
                        onBlur={(e) => handleUpdateCard(card.id, { back: e.target.value })}
                        className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:border-white/60"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-white/60 text-xs mb-1">Front</div>
                          <div className="text-white font-medium">{card.front}</div>
                        </div>
                        <div>
                          <div className="text-white/60 text-xs mb-1">Back</div>
                          <div className="text-white font-medium">{card.back}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingCardId(card.id)}
                          className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="px-3 py-2 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
