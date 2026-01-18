import { dynamoDB } from './aws-config'

const TABLE_NAME = 'OpenQuiz-Flashcards'

/**
 * Flashcard Service - Handles all flashcard CRUD operations via AWS DynamoDB
 */
export const FlashcardService = {
  /**
   * Get all flashcard decks for a user
   */
  async getUserDecks(userId) {
    try {
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }
      const result = await dynamoDB.query(params).promise()
      return result.Items
    } catch (error) {
      console.error('Error fetching user decks:', error)
      throw error
    }
  },

  /**
   * Get a specific deck by ID
   */
  async getDeck(deckId) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { deckId }
      }
      const result = await dynamoDB.get(params).promise()
      return result.Item
    } catch (error) {
      console.error('Error fetching deck:', error)
      throw error
    }
  },

  /**
   * Create a new flashcard deck
   */
  async createDeck(userId, deckData) {
    try {
      const deck = {
        deckId: `deck_${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...deckData
      }

      const params = {
        TableName: TABLE_NAME,
        Item: deck
      }

      await dynamoDB.put(params).promise()
      return deck
    } catch (error) {
      console.error('Error creating deck:', error)
      throw error
    }
  },

  /**
   * Update an existing deck
   */
  async updateDeck(deckId, updates) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { deckId },
        UpdateExpression: 'set updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      }

      // Build update expression dynamically
      Object.keys(updates).forEach((key, index) => {
        params.UpdateExpression += `, ${key} = :val${index}`
        params.ExpressionAttributeValues[`:val${index}`] = updates[key]
      })

      const result = await dynamoDB.update(params).promise()
      return result.Attributes
    } catch (error) {
      console.error('Error updating deck:', error)
      throw error
    }
  },

  /**
   * Delete a deck
   */
  async deleteDeck(deckId) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { deckId }
      }
      await dynamoDB.delete(params).promise()
      return { success: true }
    } catch (error) {
      console.error('Error deleting deck:', error)
      throw error
    }
  }
}

/**
 * Local Storage Fallback - For offline-first capability
 * Uses browser's IndexedDB/LocalStorage when AWS is unavailable
 */
export const LocalFlashcardService = {
  async getUserDecks(userId) {
    const decks = JSON.parse(localStorage.getItem(`decks_${userId}`) || '[]')
    return decks
  },

  async getDeck(deckId) {
    const allDecks = JSON.parse(localStorage.getItem('all_decks') || '{}')
    return allDecks[deckId]
  },

  async createDeck(userId, deckData) {
    const deck = {
      deckId: `deck_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...deckData
    }

    // Save to user's deck list
    const userDecks = await this.getUserDecks(userId)
    userDecks.push(deck)
    localStorage.setItem(`decks_${userId}`, JSON.stringify(userDecks))

    // Save to all decks
    const allDecks = JSON.parse(localStorage.getItem('all_decks') || '{}')
    allDecks[deck.deckId] = deck
    localStorage.setItem('all_decks', JSON.stringify(allDecks))

    return deck
  },

  async updateDeck(deckId, updates) {
    const allDecks = JSON.parse(localStorage.getItem('all_decks') || '{}')
    const deck = allDecks[deckId]

    if (!deck) throw new Error('Deck not found')

    const updatedDeck = {
      ...deck,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    allDecks[deckId] = updatedDeck
    localStorage.setItem('all_decks', JSON.stringify(allDecks))

    return updatedDeck
  },

  async deleteDeck(deckId) {
    const allDecks = JSON.parse(localStorage.getItem('all_decks') || '{}')
    delete allDecks[deckId]
    localStorage.setItem('all_decks', JSON.stringify(allDecks))
    return { success: true }
  }
}
