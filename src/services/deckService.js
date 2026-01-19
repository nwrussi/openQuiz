/**
 * Deck Service
 * CRUD operations for decks and flashcards
 */

import storage from './storage'

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

class DeckService {
  // Get all decks
  getAllDecks() {
    return storage.getDecks()
  }

  // Get single deck by ID
  getDeck(deckId) {
    const decks = storage.getDecks()
    return decks.find(deck => deck.id === deckId)
  }

  // Create new deck
  createDeck({ name, description, category, color, icon }) {
    const decks = storage.getDecks()

    const newDeck = {
      id: generateId(),
      name: name || 'Untitled Deck',
      description: description || '',
      category: category || 'Uncategorized',
      color: color || 'from-purple-400 to-pink-400',
      icon: icon || '📚',
      cards: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stats: {
        totalCards: 0,
        studied: 0,
        mastered: 0
      }
    }

    decks.push(newDeck)
    storage.saveDecks(decks)

    return newDeck
  }

  // Update deck metadata
  updateDeck(deckId, updates) {
    const decks = storage.getDecks()
    const deckIndex = decks.findIndex(d => d.id === deckId)

    if (deckIndex === -1) {
      return { success: false, error: 'Deck not found' }
    }

    decks[deckIndex] = {
      ...decks[deckIndex],
      ...updates,
      updatedAt: Date.now()
    }

    storage.saveDecks(decks)
    return { success: true, deck: decks[deckIndex] }
  }

  // Delete deck
  deleteDeck(deckId) {
    const decks = storage.getDecks()
    const filteredDecks = decks.filter(d => d.id !== deckId)

    if (filteredDecks.length === decks.length) {
      return { success: false, error: 'Deck not found' }
    }

    storage.saveDecks(filteredDecks)
    return { success: true }
  }

  // Add card to deck
  addCard(deckId, { front, back }) {
    const decks = storage.getDecks()
    const deck = decks.find(d => d.id === deckId)

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const newCard = {
      id: generateId(),
      front: front || '',
      back: back || '',
      mastery: 'new',
      reviewCount: 0,
      lastReviewed: null,
      nextReview: null
    }

    deck.cards.push(newCard)
    deck.stats.totalCards = deck.cards.length
    deck.updatedAt = Date.now()

    storage.saveDecks(decks)
    return { success: true, card: newCard }
  }

  // Update card
  updateCard(deckId, cardId, updates) {
    const decks = storage.getDecks()
    const deck = decks.find(d => d.id === deckId)

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const cardIndex = deck.cards.findIndex(c => c.id === cardId)
    if (cardIndex === -1) {
      return { success: false, error: 'Card not found' }
    }

    deck.cards[cardIndex] = {
      ...deck.cards[cardIndex],
      ...updates
    }

    deck.updatedAt = Date.now()
    storage.saveDecks(decks)

    return { success: true, card: deck.cards[cardIndex] }
  }

  // Delete card
  deleteCard(deckId, cardId) {
    const decks = storage.getDecks()
    const deck = decks.find(d => d.id === deckId)

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const originalLength = deck.cards.length
    deck.cards = deck.cards.filter(c => c.id !== cardId)

    if (deck.cards.length === originalLength) {
      return { success: false, error: 'Card not found' }
    }

    deck.stats.totalCards = deck.cards.length
    deck.updatedAt = Date.now()
    storage.saveDecks(decks)

    return { success: true }
  }

  // Bulk add cards
  bulkAddCards(deckId, cards) {
    const decks = storage.getDecks()
    const deck = decks.find(d => d.id === deckId)

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const newCards = cards.map(card => ({
      id: generateId(),
      front: card.front || '',
      back: card.back || '',
      mastery: 'new',
      reviewCount: 0,
      lastReviewed: null,
      nextReview: null
    }))

    deck.cards.push(...newCards)
    deck.stats.totalCards = deck.cards.length
    deck.updatedAt = Date.now()

    storage.saveDecks(decks)
    return { success: true, cards: newCards }
  }

  // Update card mastery
  updateCardMastery(deckId, cardId, mastery) {
    const result = this.updateCard(deckId, cardId, {
      mastery,
      reviewCount: (this.getDeck(deckId)?.cards.find(c => c.id === cardId)?.reviewCount || 0) + 1,
      lastReviewed: Date.now()
    })

    if (result.success) {
      this.updateDeckStats(deckId)
    }

    return result
  }

  // Update deck statistics
  updateDeckStats(deckId) {
    const decks = storage.getDecks()
    const deck = decks.find(d => d.id === deckId)

    if (!deck) return

    const stats = {
      totalCards: deck.cards.length,
      studied: deck.cards.filter(c => c.reviewCount > 0).length,
      mastered: deck.cards.filter(c => c.mastery === 'mastered').length
    }

    deck.stats = stats
    storage.saveDecks(decks)
  }

  // Search decks
  searchDecks(query) {
    const decks = storage.getDecks()
    const lowerQuery = query.toLowerCase()

    return decks.filter(deck =>
      deck.name.toLowerCase().includes(lowerQuery) ||
      deck.description.toLowerCase().includes(lowerQuery) ||
      deck.category.toLowerCase().includes(lowerQuery)
    )
  }

  // Get decks by category
  getDecksByCategory(category) {
    const decks = storage.getDecks()
    return decks.filter(deck => deck.category === category)
  }

  // Get all categories
  getCategories() {
    const decks = storage.getDecks()
    const categories = new Set(decks.map(deck => deck.category))
    return Array.from(categories)
  }

  // Duplicate deck
  duplicateDeck(deckId) {
    const deck = this.getDeck(deckId)
    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const newDeck = {
      ...deck,
      id: generateId(),
      name: `${deck.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      cards: deck.cards.map(card => ({
        ...card,
        id: generateId()
      }))
    }

    const decks = storage.getDecks()
    decks.push(newDeck)
    storage.saveDecks(decks)

    return { success: true, deck: newDeck }
  }

  // Export deck to JSON
  exportDeck(deckId) {
    const deck = this.getDeck(deckId)
    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    return {
      success: true,
      data: {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        deck
      }
    }
  }

  // Import deck from JSON
  importDeck(data) {
    try {
      const deck = data.deck || data

      // Generate new IDs to avoid conflicts
      const importedDeck = {
        ...deck,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        cards: deck.cards.map(card => ({
          ...card,
          id: generateId()
        }))
      }

      const decks = storage.getDecks()
      decks.push(importedDeck)
      storage.saveDecks(decks)

      return { success: true, deck: importedDeck }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new DeckService()
