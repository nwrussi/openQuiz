import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Palette,
  Type,
  Sparkles,
  FlipHorizontal
} from 'lucide-react'

// Theme configurations
const TEXTURES = {
  clean: {
    name: 'Clean White',
    background: 'bg-white',
    pattern: ''
  },
  parchment: {
    name: 'Old Parchment',
    background: 'bg-amber-50',
    pattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M0 0h20v20H0z\'/%3E%3C/g%3E%3C/svg%3E")]'
  },
  dark: {
    name: 'Dark Mode Terminal',
    background: 'bg-slate-900',
    pattern: ''
  },
  grid: {
    name: 'Grid Paper',
    background: 'bg-white',
    pattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M0 0h1v1H0zM19 0h1v1h-1zM0 19h1v1H0zM19 19h1v1h-1z\'/%3E%3C/g%3E%3C/svg%3E")]'
  }
}

const TYPOGRAPHY = {
  modern: {
    name: 'Modern Sans',
    class: 'font-sans'
  },
  academic: {
    name: 'Academic Serif',
    class: 'font-serif'
  },
  coder: {
    name: 'Coder Monospace',
    class: 'font-mono'
  }
}

const BRAND_COLORS = [
  { name: 'Sky Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Teal', value: '#14b8a6' }
]

export default function Studio() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const { getDeck, updateDeck } = useLibrary()

  const [deck, setDeck] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState('content') // 'content' | 'design'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load deck
  useEffect(() => {
    loadDeck()
  }, [deckId])

  const loadDeck = async () => {
    try {
      setIsLoading(true)
      const loadedDeck = await getDeck(deckId)
      if (!loadedDeck) {
        navigate('/library')
        return
      }

      // Initialize theme if not present
      if (!loadedDeck.theme) {
        loadedDeck.theme = {
          texture: 'clean',
          typography: 'modern',
          brandColor: '#3b82f6'
        }
      }

      // Initialize cards if empty
      if (!loadedDeck.cards || loadedDeck.cards.length === 0) {
        loadedDeck.cards = [
          { id: Date.now(), front: '', back: '', mastery: 0 }
        ]
      }

      setDeck(loadedDeck)
    } catch (error) {
      console.error('Failed to load deck:', error)
      navigate('/library')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateDeck(deckId, deck)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save deck:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateDeckField = (field, value) => {
    setDeck(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const updateCard = (index, field, value) => {
    const newCards = [...deck.cards]
    newCards[index] = { ...newCards[index], [field]: value }
    updateDeckField('cards', newCards)
  }

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      front: '',
      back: '',
      mastery: 0
    }
    updateDeckField('cards', [...deck.cards, newCard])
    setSelectedCardIndex(deck.cards.length)
    setIsFlipped(false)
  }

  const deleteCard = (index) => {
    if (deck.cards.length <= 1) {
      alert('You must have at least one card in the deck')
      return
    }
    const newCards = deck.cards.filter((_, i) => i !== index)
    updateDeckField('cards', newCards)
    if (selectedCardIndex >= newCards.length) {
      setSelectedCardIndex(newCards.length - 1)
    }
  }

  const updateTheme = (key, value) => {
    updateDeckField('theme', { ...deck.theme, [key]: value })
  }

  const getCurrentCard = () => {
    return deck?.cards[selectedCardIndex] || { front: '', back: '' }
  }

  const getTextColor = () => {
    if (deck?.theme?.texture === 'dark') {
      return 'text-white'
    }
    return 'text-gray-900'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-blue-400 opacity-30" />
          </div>
          <p className="text-gray-500 animate-pulse">Loading Studio...</p>
        </div>
      </div>
    )
  }

  if (!deck) return null

  const currentCard = getCurrentCard()
  const texture = TEXTURES[deck.theme.texture]
  const typography = TYPOGRAPHY[deck.theme.typography]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .flip-card {
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/library')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-600" />
                The Studio
              </h1>
              <p className="text-sm text-gray-500">
                {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300
              ${hasUnsavedChanges
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* LEFT PANE: The Tray */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              value={deck.title}
              onChange={(e) => updateDeckField('title', e.target.value)}
              className="w-full text-lg font-bold border-0 focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              placeholder="Deck Title"
            />
            <textarea
              value={deck.description}
              onChange={(e) => updateDeckField('description', e.target.value)}
              className="w-full text-sm text-gray-600 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg p-2 mt-2 resize-none"
              placeholder="Description"
              rows={2}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {deck.cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => {
                  setSelectedCardIndex(index)
                  setIsFlipped(false)
                }}
                className={`
                  group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                  ${selectedCardIndex === index
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                  }
                `}
              >
                <GripVertical size={16} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {card.front || 'Empty card'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {card.back || 'No answer'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCard(index)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={addCard}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Add Card
            </button>
          </div>
        </div>

        {/* CENTER PANE: The Stage */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Live Preview</h2>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FlipHorizontal size={18} />
                Flip Card
              </button>
            </div>

            {/* Card Preview with 3D Flip */}
            <div className="perspective-1000">
              <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-card-front">
                  <div
                    className={`
                      ${texture.background} ${texture.pattern} ${typography.class}
                      rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center justify-center
                      border-4 transition-all duration-300
                    `}
                    style={{ borderColor: deck.theme.brandColor }}
                  >
                    <div className={`text-center ${getTextColor()}`}>
                      <div className="text-sm font-semibold mb-4 opacity-50">QUESTION</div>
                      <p className="text-3xl font-bold">
                        {currentCard.front || 'Type your question...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0">
                  <div
                    className={`
                      ${texture.background} ${texture.pattern} ${typography.class}
                      rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center justify-center
                      border-4 transition-all duration-300
                    `}
                    style={{ borderColor: deck.theme.brandColor }}
                  >
                    <div className={`text-center ${getTextColor()}`}>
                      <div className="text-sm font-semibold mb-4 opacity-50">ANSWER</div>
                      <p className="text-2xl font-bold">
                        {currentCard.back || 'Type your answer...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: The Inspector */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('content')}
              className={`
                flex-1 px-4 py-3 font-medium transition-colors relative
                ${activeTab === 'content'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Content
              {activeTab === 'content' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`
                flex-1 px-4 py-3 font-medium transition-colors relative
                ${activeTab === 'design'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Design
              {activeTab === 'design' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6 fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question (Front)
                  </label>
                  <textarea
                    value={currentCard.front}
                    onChange={(e) => {
                      updateCard(selectedCardIndex, 'front', e.target.value)
                      setIsFlipped(false)
                    }}
                    onFocus={() => setIsFlipped(false)}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3 resize-none transition-colors"
                    placeholder="Enter your question..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Answer (Back)
                  </label>
                  <textarea
                    value={currentCard.back}
                    onChange={(e) => updateCard(selectedCardIndex, 'back', e.target.value)}
                    onFocus={() => setIsFlipped(true)}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3 resize-none transition-colors"
                    placeholder="Enter your answer..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Card auto-flips when you focus this field
                  </p>
                </div>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="space-y-6 fade-in">
                {/* Texture */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Palette size={16} />
                    Texture & Material
                  </label>
                  <div className="space-y-2">
                    {Object.entries(TEXTURES).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => updateTheme('texture', key)}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                          ${deck.theme.texture === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="font-medium">{config.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Type size={16} />
                    Typography
                  </label>
                  <div className="space-y-2">
                    {Object.entries(TYPOGRAPHY).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => updateTheme('typography', key)}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${config.class}
                          ${deck.theme.typography === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="font-medium">{config.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Color */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Sparkles size={16} />
                    Brand Color
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {BRAND_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateTheme('brandColor', color.value)}
                        className={`
                          aspect-square rounded-xl transition-all transform hover:scale-110
                          ${deck.theme.brandColor === color.value
                            ? 'ring-4 ring-offset-2 ring-gray-900'
                            : 'ring-2 ring-gray-200'
                          }
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
