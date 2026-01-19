/**
 * LocalStorage Service
 * Handles all data persistence with error handling and migration support
 */

const STORAGE_KEYS = {
  DECKS: 'openquiz_decks',
  USER_STATS: 'openquiz_user_stats',
  SETTINGS: 'openquiz_settings',
  VERSION: 'openquiz_version'
}

const CURRENT_VERSION = '1.0.0'

class StorageService {
  constructor() {
    this.checkVersion()
    this.ensureDefaultData()
  }

  // Version management
  checkVersion() {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION)
    if (!storedVersion) {
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION)
    } else if (storedVersion !== CURRENT_VERSION) {
      this.migrate(storedVersion, CURRENT_VERSION)
    }
  }

  migrate(fromVersion, toVersion) {
    console.log(`Migrating from ${fromVersion} to ${toVersion}`)
    // Future migration logic here
  }

  // Ensure default data exists
  ensureDefaultData() {
    if (!this.getDecks()) {
      this.saveDecks(this.getDefaultDecks())
    }
  }

  // Generic storage methods
  get(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
      return false
    }
  }

  clear() {
    try {
      localStorage.clear()
      this.ensureDefaultData()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Decks
  getDecks() {
    return this.get(STORAGE_KEYS.DECKS) || []
  }

  saveDecks(decks) {
    return this.set(STORAGE_KEYS.DECKS, decks)
  }

  // User stats
  getUserStats() {
    return this.get(STORAGE_KEYS.USER_STATS) || {
      totalDecks: 0,
      totalCards: 0,
      totalStudyTime: 0,
      streak: 0,
      lastStudyDate: null
    }
  }

  saveUserStats(stats) {
    return this.set(STORAGE_KEYS.USER_STATS, stats)
  }

  // Settings
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || {
      theme: 'light',
      defaultStudyMode: 'classic',
      cardsPerSession: 20,
      showTimer: true,
      playSounds: true
    }
  }

  saveSettings(settings) {
    return this.set(STORAGE_KEYS.SETTINGS, settings)
  }

  // Default demo decks
  getDefaultDecks() {
    return [
      {
        id: 'demo-1',
        name: 'Spanish Basics',
        description: 'Essential Spanish vocabulary for beginners',
        category: 'Languages',
        color: 'from-red-400 to-yellow-400',
        icon: '🇪🇸',
        cards: [
          { id: 'c1', front: 'Hello', back: 'Hola', mastery: 'new' },
          { id: 'c2', front: 'Goodbye', back: 'Adiós', mastery: 'new' },
          { id: 'c3', front: 'Please', back: 'Por favor', mastery: 'new' },
          { id: 'c4', front: 'Thank you', back: 'Gracias', mastery: 'new' },
          { id: 'c5', front: 'Yes', back: 'Sí', mastery: 'new' },
          { id: 'c6', front: 'No', back: 'No', mastery: 'new' },
          { id: 'c7', front: 'Water', back: 'Agua', mastery: 'new' },
          { id: 'c8', front: 'Food', back: 'Comida', mastery: 'new' }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stats: {
          totalCards: 8,
          studied: 0,
          mastered: 0
        }
      },
      {
        id: 'demo-2',
        name: 'Chemistry Elements',
        description: 'Periodic table symbols and names',
        category: 'Science',
        color: 'from-green-400 to-blue-400',
        icon: '⚗️',
        cards: [
          { id: 'c9', front: 'H', back: 'Hydrogen', mastery: 'new' },
          { id: 'c10', front: 'He', back: 'Helium', mastery: 'new' },
          { id: 'c11', front: 'O', back: 'Oxygen', mastery: 'new' },
          { id: 'c12', front: 'C', back: 'Carbon', mastery: 'new' },
          { id: 'c13', front: 'N', back: 'Nitrogen', mastery: 'new' },
          { id: 'c14', front: 'Fe', back: 'Iron', mastery: 'new' },
          { id: 'c15', front: 'Au', back: 'Gold', mastery: 'new' },
          { id: 'c16', front: 'Ag', back: 'Silver', mastery: 'new' }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stats: {
          totalCards: 8,
          studied: 0,
          mastered: 0
        }
      },
      {
        id: 'demo-3',
        name: 'US State Capitals',
        description: 'Test your knowledge of US geography',
        category: 'Geography',
        color: 'from-blue-400 to-purple-400',
        icon: '🗺️',
        cards: [
          { id: 'c17', front: 'California', back: 'Sacramento', mastery: 'new' },
          { id: 'c18', front: 'Texas', back: 'Austin', mastery: 'new' },
          { id: 'c19', front: 'New York', back: 'Albany', mastery: 'new' },
          { id: 'c20', front: 'Florida', back: 'Tallahassee', mastery: 'new' },
          { id: 'c21', front: 'Illinois', back: 'Springfield', mastery: 'new' },
          { id: 'c22', front: 'Washington', back: 'Olympia', mastery: 'new' }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stats: {
          totalCards: 6,
          studied: 0,
          mastered: 0
        }
      }
    ]
  }

  // Export all data
  exportData() {
    return {
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      decks: this.getDecks(),
      userStats: this.getUserStats(),
      settings: this.getSettings()
    }
  }

  // Import data
  importData(data) {
    try {
      if (data.decks) this.saveDecks(data.decks)
      if (data.userStats) this.saveUserStats(data.userStats)
      if (data.settings) this.saveSettings(data.settings)
      return { success: true }
    } catch (error) {
      console.error('Error importing data:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new StorageService()
