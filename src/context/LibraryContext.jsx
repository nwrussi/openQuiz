import { createContext, useContext, useState, useEffect } from 'react'
import { LocalFlashcardService } from '../services/flashcard-service'
import { useAuth } from './AuthContext'

const LibraryContext = createContext()

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider')
  }
  return context
}

export const LibraryProvider = ({ children }) => {
  const [decks, setDecks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()

  // Use authenticated user ID or fallback to guest mode
  const currentUserId = isAuthenticated && user ? user.id : 'guest_user'

  // Load decks when user changes or on mount
  useEffect(() => {
    loadDecks()
  }, [currentUserId])

  const loadDecks = async () => {
    try {
      setIsLoading(true)
      const userDecks = await LocalFlashcardService.getUserDecks(currentUserId)
      setDecks(userDecks)
    } catch (error) {
      console.error('Error loading decks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createDeck = async (deckData) => {
    try {
      const newDeck = await LocalFlashcardService.createDeck(currentUserId, {
        title: deckData.title || 'Untitled Deck',
        description: deckData.description || '',
        cards: deckData.cards || [],
        theme: deckData.theme || {
          texture: 'clean',
          typography: 'modern',
          brandColor: '#3b82f6'
        }
      })
      setDecks(prev => [...prev, newDeck])
      return newDeck
    } catch (error) {
      console.error('Error creating deck:', error)
      throw error
    }
  }

  const updateDeck = async (deckId, updates) => {
    try {
      const updatedDeck = await LocalFlashcardService.updateDeck(deckId, updates)
      setDecks(prev => prev.map(d => d.deckId === deckId ? updatedDeck : d))
      return updatedDeck
    } catch (error) {
      console.error('Error updating deck:', error)
      throw error
    }
  }

  const deleteDeck = async (deckId) => {
    try {
      await LocalFlashcardService.deleteDeck(deckId)
      setDecks(prev => prev.filter(d => d.deckId !== deckId))

      // Also clean up from user's deck list
      const userDecks = await LocalFlashcardService.getUserDecks(currentUserId)
      const filteredDecks = userDecks.filter(d => d.deckId !== deckId)
      localStorage.setItem(`decks_${currentUserId}`, JSON.stringify(filteredDecks))
    } catch (error) {
      console.error('Error deleting deck:', error)
      throw error
    }
  }

  const duplicateDeck = async (deckId) => {
    try {
      const originalDeck = await LocalFlashcardService.getDeck(deckId)
      if (!originalDeck) throw new Error('Deck not found')

      const duplicatedDeck = await createDeck({
        ...originalDeck,
        title: `${originalDeck.title} (Copy)`,
        deckId: undefined, // Will be auto-generated
        createdAt: undefined,
        updatedAt: undefined
      })
      return duplicatedDeck
    } catch (error) {
      console.error('Error duplicating deck:', error)
      throw error
    }
  }

  const getDeck = async (deckId) => {
    try {
      return await LocalFlashcardService.getDeck(deckId)
    } catch (error) {
      console.error('Error getting deck:', error)
      throw error
    }
  }

  const value = {
    decks,
    isLoading,
    createDeck,
    updateDeck,
    deleteDeck,
    duplicateDeck,
    getDeck,
    refreshDecks: loadDecks
  }

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  )
}
