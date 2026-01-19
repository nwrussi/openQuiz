/**
 * Mock Socket Service - Simulates WebSocket connection for multiplayer
 * Uses localStorage for cross-tab communication simulation
 */

class SocketMock {
  constructor() {
    this.connected = false
    this.roomCode = null
    this.userName = null
    this.userId = null
    this.listeners = {}
    this.isHost = false

    // Listen to storage events for cross-tab communication
    window.addEventListener('storage', this.handleStorageChange.bind(this))
  }

  /**
   * Generate a 4-letter room code
   */
  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Create a new room (Host)
   */
  async createRoom(deckId, hostName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.roomCode = this.generateRoomCode()
        this.userName = hostName
        this.userId = `user_${Date.now()}`
        this.isHost = true
        this.connected = true

        const room = {
          code: this.roomCode,
          host: this.userId,
          hostName: hostName,
          deckId: deckId,
          players: [
            {
              id: this.userId,
              name: hostName,
              avatar: '👨‍🏫',
              isHost: true,
              joinedAt: Date.now()
            }
          ],
          status: 'lobby', // 'lobby' | 'playing' | 'finished'
          createdAt: Date.now()
        }

        localStorage.setItem(`room_${this.roomCode}`, JSON.stringify(room))

        this.emit('roomCreated', { roomCode: this.roomCode, room })
        resolve({ success: true, roomCode: this.roomCode, room })
      }, 300)
    })
  }

  /**
   * Join an existing room (Player)
   */
  async joinRoom(roomCode, playerName) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const roomData = localStorage.getItem(`room_${roomCode}`)

        if (!roomData) {
          reject({ error: 'Room not found' })
          return
        }

        const room = JSON.parse(roomData)
        this.roomCode = roomCode
        this.userName = playerName
        this.userId = `user_${Date.now()}_${Math.random()}`
        this.isHost = false
        this.connected = true

        // Random emoji avatars for players
        const avatars = ['😀', '😎', '🤓', '🥳', '🤩', '😇', '🤗', '🦄', '🐱', '🐶', '🦊', '🐼']
        const avatar = avatars[Math.floor(Math.random() * avatars.length)]

        const newPlayer = {
          id: this.userId,
          name: playerName,
          avatar: avatar,
          isHost: false,
          joinedAt: Date.now()
        }

        room.players.push(newPlayer)
        localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))

        // Notify all players
        this.broadcastToRoom(roomCode, 'playerJoined', { player: newPlayer, room })

        this.emit('joinedRoom', { room })
        resolve({ success: true, room })
      }, 300)
    })
  }

  /**
   * Start the game (Host only)
   */
  async startGame() {
    if (!this.isHost) {
      return { success: false, error: 'Only host can start the game' }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const roomData = localStorage.getItem(`room_${this.roomCode}`)
        if (!roomData) {
          resolve({ success: false, error: 'Room not found' })
          return
        }

        const room = JSON.parse(roomData)
        room.status = 'playing'
        localStorage.setItem(`room_${this.roomCode}`, JSON.stringify(room))

        this.broadcastToRoom(this.roomCode, 'gameStarted', { room })
        resolve({ success: true, room })
      }, 300)
    })
  }

  /**
   * Leave the room
   */
  leaveRoom() {
    if (!this.connected || !this.roomCode) return

    const roomData = localStorage.getItem(`room_${this.roomCode}`)
    if (roomData) {
      const room = JSON.parse(roomData)
      room.players = room.players.filter(p => p.id !== this.userId)

      if (room.players.length === 0) {
        // Last player left, delete room
        localStorage.removeItem(`room_${this.roomCode}`)
      } else {
        localStorage.setItem(`room_${this.roomCode}`, JSON.stringify(room))
        this.broadcastToRoom(this.roomCode, 'playerLeft', {
          playerId: this.userId,
          room
        })
      }
    }

    this.connected = false
    this.roomCode = null
    this.userName = null
    this.userId = null
    this.isHost = false
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  /**
   * Emit event to local listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }

  /**
   * Broadcast to all clients in the room via localStorage
   */
  broadcastToRoom(roomCode, event, data) {
    const message = {
      roomCode,
      event,
      data,
      timestamp: Date.now()
    }
    localStorage.setItem('socket_broadcast', JSON.stringify(message))

    // Clean up immediately to allow re-triggering
    setTimeout(() => {
      localStorage.removeItem('socket_broadcast')
    }, 100)
  }

  /**
   * Handle storage changes (cross-tab communication)
   */
  handleStorageChange(e) {
    if (e.key === 'socket_broadcast' && e.newValue) {
      const message = JSON.parse(e.newValue)

      // Only process if we're in the same room
      if (message.roomCode === this.roomCode) {
        this.emit(message.event, message.data)
      }
    }

    // Listen for room updates
    if (e.key === `room_${this.roomCode}` && e.newValue) {
      const room = JSON.parse(e.newValue)
      this.emit('roomUpdated', { room })
    }
  }

  /**
   * Get current room state
   */
  getCurrentRoom() {
    if (!this.roomCode) return null
    const roomData = localStorage.getItem(`room_${this.roomCode}`)
    return roomData ? JSON.parse(roomData) : null
  }

  /**
   * Send player action (for future game interactions)
   */
  sendAction(action, data) {
    if (!this.connected) return

    this.broadcastToRoom(this.roomCode, 'playerAction', {
      playerId: this.userId,
      playerName: this.userName,
      action,
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected
  }

  /**
   * Get user info
   */
  getUserInfo() {
    return {
      userId: this.userId,
      userName: this.userName,
      isHost: this.isHost,
      roomCode: this.roomCode
    }
  }
}

// Singleton instance
let socketInstance = null

export const getSocketInstance = () => {
  if (!socketInstance) {
    socketInstance = new SocketMock()
  }
  return socketInstance
}

export default SocketMock
